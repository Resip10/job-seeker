'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import { getTokenUsageStats, resetTokenUsage } from '@/firebase/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useTokenUsage } from '@/hooks/useTokenUsage';
import { showToast } from '@/lib/toast';

export function TokenUsageDisplay() {
  const { stats, loading, error, isUpdating } = useTokenUsage();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleManualRefresh = async () => {
    try {
      setIsRefreshing(true);
      // Force refresh via the Cloud Function (bypasses cache)
      await getTokenUsageStats();
    } catch (err) {
      console.error('Failed to refresh token stats:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleResetTokens = async () => {
    try {
      setIsResetting(true);
      const result = await resetTokenUsage();
      showToast.success('Tokens Reset', result.message);
    } catch (err) {
      console.error('Failed to reset tokens:', err);
      showToast.error(
        'Reset Failed',
        err instanceof Error ? err.message : 'Failed to reset tokens'
      );
    } finally {
      setIsResetting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='w-5 h-5' />
            Token Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='animate-pulse'>
            <div className='h-4 bg-gray-200 rounded mb-2'></div>
            <div className='h-2 bg-gray-200 rounded'></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='w-5 h-5' />
            Token Usage
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Alert variant='destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              Failed to load token usage: {error}
            </AlertDescription>
          </Alert>
          <Button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            variant='outline'
            size='sm'
            className='w-full cursor-pointer'
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            {isRefreshing ? 'Refreshing...' : 'Retry'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const usagePercentage = (stats.totalTokensUsed / stats.dailyLimit) * 100;
  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = usagePercentage >= 100;

  return (
    <Card
      className={`transition-all duration-300 ${isUpdating ? 'ring-2 ring-blue-200 shadow-lg' : ''} ${isAtLimit ? 'border-red-200 bg-red-50' : isNearLimit ? 'border-yellow-200 bg-yellow-50' : ''}`}
    >
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Activity
              className={`w-5 h-5 transition-colors ${isUpdating ? 'text-blue-600' : ''}`}
            />
            Daily Token Usage
            {isUpdating ? (
              <div className='w-4 h-4 rounded-full bg-blue-500 animate-pulse' />
            ) : isAtLimit ? (
              <AlertTriangle className='w-4 h-4 text-red-500' />
            ) : (
              <CheckCircle className='w-4 h-4 text-green-500' />
            )}
          </CardTitle>
          <div className='flex gap-1'>
            <Button
              onClick={handleManualRefresh}
              disabled={isRefreshing || isResetting}
              variant='ghost'
              size='sm'
              className='cursor-pointer h-8 w-8 p-0'
              title='Refresh token usage'
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </Button>
            {process.env.NODE_ENV === 'development' && (
              <Button
                onClick={handleResetTokens}
                disabled={isRefreshing || isResetting}
                variant='ghost'
                size='sm'
                className='cursor-pointer h-8 w-8 p-0 text-orange-600 hover:text-orange-700'
                title='Reset tokens to 0 (dev only)'
              >
                <RotateCcw
                  className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`}
                />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-text-medium'>Used</span>
            <span className='font-medium'>
              {stats.totalTokensUsed.toLocaleString()} /{' '}
              {stats.dailyLimit.toLocaleString()} tokens
            </span>
          </div>
          <Progress
            value={usagePercentage}
            className={`h-2 ${isAtLimit ? 'bg-red-100' : isNearLimit ? 'bg-yellow-100' : ''}`}
          />
        </div>

        <div className='flex justify-between text-sm'>
          <span className='text-text-medium'>Remaining</span>
          <span
            className={`font-medium ${isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'}`}
          >
            {stats.remainingTokens.toLocaleString()} tokens
          </span>
        </div>

        {isAtLimit && (
          <Alert variant='destructive' className='mt-4'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              Daily token limit reached. Please try again tomorrow.
            </AlertDescription>
          </Alert>
        )}

        {isNearLimit && !isAtLimit && (
          <Alert
            variant='default'
            className='mt-4 border-yellow-200 bg-yellow-50'
          >
            <AlertTriangle className='h-4 w-4 text-yellow-600' />
            <AlertDescription className='text-yellow-800'>
              Approaching daily token limit. Use remaining tokens wisely.
            </AlertDescription>
          </Alert>
        )}

        <div className='text-xs text-text-light'>
          Resets daily at midnight UTC
        </div>
      </CardContent>
    </Card>
  );
}
