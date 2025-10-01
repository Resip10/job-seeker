import { useState, useEffect, useCallback } from 'react';
import { subscribeToTokenUsage, TokenUsageStats } from '@/firebase/services';

interface UseTokenUsageReturn {
  stats: TokenUsageStats | null;
  loading: boolean;
  error: string | null;
  isUpdating: boolean;
}

export function useTokenUsage(): UseTokenUsageReturn {
  const [stats, setStats] = useState<TokenUsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatsUpdate = useCallback((newStats: TokenUsageStats) => {
    setStats(prevStats => {
      if (prevStats && prevStats.totalTokensUsed !== newStats.totalTokensUsed) {
        setIsUpdating(true);
        setTimeout(() => setIsUpdating(false), 1000);
      }

      return newStats;
    });
    setLoading(false);
    setError(null);
  }, []);

  const handleError = useCallback((err: Error) => {
    console.error('Token usage listener error:', err);
    setError(err.message);
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToTokenUsage(handleStatsUpdate, handleError);

    return () => unsubscribe();
  }, [handleStatsUpdate, handleError]);

  return {
    stats,
    loading,
    error,
    isUpdating,
  };
}
