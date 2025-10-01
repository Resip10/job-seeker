import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { initializeApp } from 'firebase-admin/app';
import { processJobInput } from './helpers';
import { createJobAnalysisPrompt } from './prompts';
import { defineSecret } from 'firebase-functions/params';
import { setGlobalOptions } from 'firebase-functions/v2';
import { logger } from 'firebase-functions';
import {
  executeJobAnalysisTransaction,
  getTokenUsageStats,
  resetTokenUsage,
} from './services/tokenTracker';

initializeApp();
setGlobalOptions({ maxInstances: 10 });

const geminiApiKey = defineSecret('GEMINI_API_KEY');

export const analyzeJobDescription = onCall(
  { secrets: [geminiApiKey] },
  async request => {
    const { data } = request;

    if (!data || !data.text) {
      throw new HttpsError('invalid-argument', 'Missing required field: text');
    }

    if (request.auth) {
      logger.info(`Authenticated request from user: ${request.auth.uid}`);
    } else {
      logger.info('Unauthenticated request received');
    }

    const jobInput = data.text;

    try {
      logger.info('Starting job analysis process');

      const jobDescription = processJobInput(jobInput);
      const prompt = createJobAnalysisPrompt(jobDescription);

      const genAI = new GoogleGenerativeAI(geminiApiKey.value());
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const processResponse = (text: string) => {
        let parsedResponse;
        try {
          const jsonString = text.replace(/```json\n|\n```/g, '');
          parsedResponse = JSON.parse(jsonString);
        } catch {
          logger.error('Failed to parse JSON from AI response:', text);
          throw new HttpsError('internal', 'AI response format is incorrect', {
            rawResponse: text,
          });
        }

        if (parsedResponse.isJobDescription === false) {
          throw new HttpsError(
            'invalid-argument',
            parsedResponse.error ||
              'The provided text does not appear to be a job description'
          );
        }

        return parsedResponse;
      };

      const result = await executeJobAnalysisTransaction(
        prompt,
        model,
        processResponse
      );

      return result;
    } catch (error) {
      logger.error('Error in analyzeJobDescription:', error);

      if (error instanceof HttpsError) {
        throw error;
      }

      if (error instanceof Error && error.message.includes('token limit')) {
        throw new HttpsError('resource-exhausted', error.message);
      }

      throw new HttpsError('internal', 'Failed to process AI request', {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }
);

export const getTokenUsage = onCall(async () => {
  try {
    const stats = await getTokenUsageStats();

    return stats;
  } catch (error) {
    logger.error('Error getting token usage stats:', error);
    throw new HttpsError('internal', 'Failed to get token usage statistics', {
      originalError: error instanceof Error ? error.message : String(error),
    });
  }
});

export const resetTokens = onCall(async request => {
  try {
    if (request.auth) {
      logger.info(`Token reset requested by user: ${request.auth.uid}`);
    } else {
      logger.info('Token reset requested (unauthenticated)');
    }

    await resetTokenUsage();
    const newStats = await getTokenUsageStats();

    return {
      success: true,
      message: 'Token usage reset to 0',
      newStats,
    };
  } catch (error) {
    logger.error('Error resetting token usage:', error);
    throw new HttpsError('internal', 'Failed to reset token usage', {
      originalError: error instanceof Error ? error.message : String(error),
    });
  }
});
