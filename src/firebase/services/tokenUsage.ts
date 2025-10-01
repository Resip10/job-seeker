import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, doc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import app from '../config';

export interface TokenUsageStats {
  totalTokensUsed: number;
  lastResetDate: string;
  remainingTokens: number;
  dailyLimit: number;
}

interface TokenUsageDoc {
  totalTokensUsed: number;
  lastResetDate: string;
}

const GLOBAL_DOC_ID = 'usage';
const MAX_DAILY_TOKENS = 50000;

function shouldResetDaily(lastResetDate: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  const lastReset = lastResetDate.split('T')[0];

  return today !== lastReset;
}

export const resetTokenUsage = async (): Promise<{
  success: boolean;
  message: string;
  newStats: TokenUsageStats;
}> => {
  try {
    const functions = getFunctions(app);

    if (
      process.env.NODE_ENV === 'development' &&
      !process.env.NEXT_PUBLIC_USE_PRODUCTION_FUNCTIONS
    ) {
      try {
        const { connectFunctionsEmulator } = await import('firebase/functions');
        connectFunctionsEmulator(functions, 'localhost', 5001);
      } catch {
        // Emulator connection failed, use production
      }
    }

    const resetTokens = httpsCallable<
      void,
      { success: boolean; message: string; newStats: TokenUsageStats }
    >(functions, 'resetTokens');

    const result = await resetTokens();

    return result.data;
  } catch (error: unknown) {
    console.error('Failed to reset token usage:', error);

    throw new Error(
      error instanceof Error ? error.message : 'Failed to reset token usage'
    );
  }
};

export const getTokenUsageStats = async (): Promise<TokenUsageStats> => {
  try {
    const functions = getFunctions(app);

    if (
      process.env.NODE_ENV === 'development' &&
      !process.env.NEXT_PUBLIC_USE_PRODUCTION_FUNCTIONS
    ) {
      try {
        const { connectFunctionsEmulator } = await import('firebase/functions');
        connectFunctionsEmulator(functions, 'localhost', 5001);
      } catch {
        // Emulator connection failed, use production
      }
    }

    const getTokenUsage = httpsCallable<void, TokenUsageStats>(
      functions,
      'getTokenUsage'
    );

    const result = await getTokenUsage();

    return result.data;
  } catch (error: unknown) {
    console.error('Failed to get token usage stats:', error);

    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to get token usage statistics'
    );
  }
};

export const subscribeToTokenUsage = (
  onUpdate: (stats: TokenUsageStats) => void,
  onError: (error: Error) => void
): Unsubscribe => {
  const db = getFirestore(app);
  const globalDocRef = doc(db, 'global', GLOBAL_DOC_ID);

  console.log('🔥 Setting up Firestore listener for token usage');

  return onSnapshot(
    globalDocRef,
    docSnapshot => {
      try {
        console.log('📊 Token usage snapshot received:', {
          exists: docSnapshot.exists(),
          data: docSnapshot.data(),
          fromCache: docSnapshot.metadata.fromCache,
        });

        let currentUsage: TokenUsageDoc;

        if (!docSnapshot.exists()) {
          currentUsage = {
            totalTokensUsed: 0,
            lastResetDate: new Date().toISOString(),
          };
          console.log('📊 Using default token usage (document does not exist)');
        } else {
          currentUsage = docSnapshot.data() as TokenUsageDoc;

          if (shouldResetDaily(currentUsage.lastResetDate)) {
            currentUsage = {
              totalTokensUsed: 0,
              lastResetDate: new Date().toISOString(),
            };
            console.log('📊 Daily reset applied to token usage');
          }
        }

        const stats: TokenUsageStats = {
          ...currentUsage,
          remainingTokens: Math.max(
            0,
            MAX_DAILY_TOKENS - currentUsage.totalTokensUsed
          ),
          dailyLimit: MAX_DAILY_TOKENS,
        };

        console.log('📊 Calling onUpdate with stats:', stats);
        onUpdate(stats);
      } catch (error) {
        console.error('Error processing token usage snapshot:', error);
        onError(new Error('Failed to process token usage update'));
      }
    },
    error => {
      console.error('Token usage snapshot error:', error);
      onError(new Error('Failed to listen to token usage updates'));
    }
  );
};
