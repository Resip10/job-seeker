import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions/v2';
import type { GenerativeModel } from '@google/generative-ai';

const GLOBAL_DOC_ID = 'usage';
const MAX_DAILY_TOKENS = 50000;

export interface TokenUsage {
  totalTokensUsed: number;
  lastResetDate: string;
}

export function estimateTokenCountFallback(text: string): number {
  const cleanText = text.trim().replace(/\s+/g, ' ');
  const estimatedTokens = Math.ceil(cleanText.length / 4);
  const bufferedEstimate = Math.ceil(estimatedTokens * 1.2);

  logger.warn(
    `Fallback token estimation: ${cleanText.length} chars → ${estimatedTokens} tokens (with buffer: ${bufferedEstimate})`
  );

  return bufferedEstimate;
}

function shouldResetDaily(lastResetDate: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  const lastReset = lastResetDate.split('T')[0];

  return today !== lastReset;
}

export async function resetTokenUsage(): Promise<void> {
  const db = getFirestore();
  const globalDocRef = db.collection('global').doc(GLOBAL_DOC_ID);

  const resetUsage: TokenUsage = {
    totalTokensUsed: 0,
    lastResetDate: new Date().toISOString(),
  };

  await globalDocRef.set(resetUsage);
  logger.info('🔄 Token usage manually reset to 0');
}

export async function getTokenUsageStats(): Promise<
  TokenUsage & { remainingTokens: number; dailyLimit: number }
> {
  const db = getFirestore();
  const globalDocRef = db.collection('global').doc(GLOBAL_DOC_ID);

  try {
    const globalDoc = await globalDocRef.get();

    let currentUsage: TokenUsage;

    if (!globalDoc.exists) {
      currentUsage = {
        totalTokensUsed: 0,
        lastResetDate: new Date().toISOString(),
      };
    } else {
      currentUsage = globalDoc.data() as TokenUsage;

      if (shouldResetDaily(currentUsage.lastResetDate)) {
        currentUsage = {
          totalTokensUsed: 0,
          lastResetDate: new Date().toISOString(),
        };
      }
    }

    return {
      ...currentUsage,
      remainingTokens: Math.max(
        0,
        MAX_DAILY_TOKENS - currentUsage.totalTokensUsed
      ),
      dailyLimit: MAX_DAILY_TOKENS,
    };
  } catch (error) {
    logger.error('Failed to get token usage stats:', error);
    throw error;
  }
}

export async function executeJobAnalysisTransaction<T>(
  prompt: string,
  model: GenerativeModel,
  processResponse: (text: string) => T
): Promise<T> {
  const db = getFirestore();
  const globalDocRef = db.collection('global').doc(GLOBAL_DOC_ID);

  return await db.runTransaction(async transaction => {
    const globalDoc = await transaction.get(globalDocRef);

    let currentUsage: TokenUsage;

    if (!globalDoc.exists) {
      currentUsage = {
        totalTokensUsed: 0,
        lastResetDate: new Date().toISOString(),
      };
    } else {
      currentUsage = globalDoc.data() as TokenUsage;
    }

    if (shouldResetDaily(currentUsage.lastResetDate)) {
      currentUsage = {
        totalTokensUsed: 0,
        lastResetDate: new Date().toISOString(),
      };
      logger.info('Daily token counter reset');
    }

    let promptTokens: number;
    try {
      const tokenCountResult = await model.countTokens(prompt);
      promptTokens = tokenCountResult.totalTokens;
      logger.info(
        `✅ Accurate prompt token count: ${promptTokens} tokens (prompt length: ${prompt.length} chars)`
      );
    } catch (tokenCountError) {
      promptTokens = estimateTokenCountFallback(prompt);
      logger.warn(
        `⚠️ Token counting failed, using fallback estimation: ${promptTokens} tokens (prompt length: ${prompt.length} chars)`,
        tokenCountError
      );
    }

    if (currentUsage.totalTokensUsed >= MAX_DAILY_TOKENS) {
      throw new Error(
        `Daily token limit of ${MAX_DAILY_TOKENS} tokens has been reached. Please try again tomorrow.`
      );
    }

    const futureUsage = currentUsage.totalTokensUsed + promptTokens;
    if (futureUsage > MAX_DAILY_TOKENS) {
      const remainingTokens = MAX_DAILY_TOKENS - currentUsage.totalTokensUsed;
      throw new Error(
        `Request requires ${promptTokens} tokens, but only ${remainingTokens} tokens remain for today. ` +
          `Daily limit: ${MAX_DAILY_TOKENS} tokens.`
      );
    }

    let apiResult;
    let actualTokens = promptTokens;

    try {
      logger.info(
        `Making Gemini API call with ${promptTokens} tokens reserved`
      );
      apiResult = await model.generateContent(prompt);
      const response = await apiResult.response;
      const text = response.text();

      const usageMetadata = response.usageMetadata;
      const promptTokensActual =
        usageMetadata?.promptTokenCount || promptTokens;
      const candidatesTokensActual = usageMetadata?.candidatesTokenCount || 0;
      const calculatedTotal = promptTokensActual + candidatesTokensActual;
      const apiReportedTotal = usageMetadata?.totalTokenCount || promptTokens;

      actualTokens = calculatedTotal;

      logger.info('🎯 API call successful. Token breakdown:', {
        promptTokens: promptTokensActual,
        candidatesTokens: candidatesTokensActual,
        calculatedTotal,
        apiReportedTotal,
        discrepancy: apiReportedTotal - calculatedTotal,
        usingCalculatedTotal: true,
      });

      const processedResponse = processResponse(text);

      const finalUsage: TokenUsage = {
        totalTokensUsed: currentUsage.totalTokensUsed + actualTokens,
        lastResetDate: currentUsage.lastResetDate,
      };

      transaction.set(globalDocRef, finalUsage);

      logger.info(
        `Transaction completed. New token total: ${finalUsage.totalTokensUsed}/${MAX_DAILY_TOKENS}`
      );

      return processedResponse;
    } catch (apiError) {
      logger.error(
        'API call failed, transaction will be rolled back:',
        apiError
      );
      throw apiError;
    }
  });
}
