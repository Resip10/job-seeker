# Token Tracking System Setup

This document explains how to set up and use the token tracking system for Gemini API usage in your Firebase project.

## Overview

The token tracking system implements:

- **Daily token limits** (10,000 tokens per day)
- **Race condition prevention** using Firestore transactions
- **Real-time token usage monitoring**
- **Automatic daily reset** at midnight UTC
- **Accurate token counting** with estimation and correction

## Setup Instructions

### 1. Deploy Firestore Security Rules

Update your Firestore security rules to include the global collection:

```bash
firebase deploy --only firestore:rules
```

The rules in `firestore.rules` allow:

- **Read access** for authenticated users to view token usage
- **Write access** only for Cloud Functions (admin SDK)

### 2. Deploy Cloud Functions

Deploy the updated Cloud Functions:

```bash
cd functions
npm run build
npm run deploy
```

This deploys:

- `analyzeJobDescription` - Updated with token tracking
- `getTokenUsage` - New function to get usage statistics

### 3. Initialize Global Document

The system automatically creates the global document on first use, but you can manually initialize it:

```javascript
// In Firestore console or admin script
// Collection: global
// Document ID: usage
{
  "totalTokensUsed": 0,
  "lastResetDate": "2024-01-01T00:00:00.000Z"
}
```

## How It Works

### Accurate Token Counting

- Uses **Gemini's built-in `model.countTokens()`** for precise token counting
- Gets exact token count before making API calls
- Falls back to character-based estimation only if `countTokens()` fails
- Corrects with actual usage metadata after API response

### Fully Transactional Flow

The entire job analysis operation is wrapped in a **single Firestore transaction** ensuring complete atomicity:

1. **Read** current token usage (within transaction)
2. **Count** exact tokens needed using `model.countTokens()`
3. **Validate** daily limits won't be exceeded
4. **Execute** Gemini API call
5. **Process** and validate API response
6. **Commit** token usage update (only if everything succeeds)

**Key Benefit**: If the API call fails or response processing fails, **no tokens are consumed** - the entire transaction rolls back automatically.

### Daily Reset

- Automatically resets at midnight UTC
- Compares `lastResetDate` with current date
- Resets `totalTokensUsed` to 0 when new day detected

## Usage Examples

### Frontend - Check Token Usage

```typescript
import { getTokenUsageStats } from '@/firebase/services';

const stats = await getTokenUsageStats();
console.log(`Used: ${stats.totalTokensUsed}/${stats.dailyLimit}`);
console.log(`Remaining: ${stats.remainingTokens}`);
```

### Backend - Manual Token Check

```typescript
import { checkAndReserveTokens } from './services/tokenTracker';

try {
  await checkAndReserveTokens(500); // Reserve 500 tokens
  // Proceed with API call
} catch (error) {
  // Handle token limit exceeded
}
```

## Error Handling

### Token Limit Errors

The system throws specific errors when limits are exceeded:

```typescript
// Daily limit reached
'Daily token limit of 10000 tokens has been reached. Please try again tomorrow.';

// Request would exceed limit
'Request requires 1500 tokens, but only 800 tokens remain for today. Daily limit: 10000 tokens.';
```

### Frontend Error Handling

```typescript
try {
  const result = await analyzeJobDescription(jobText);
} catch (error) {
  if (error.message.includes('token limit')) {
    // Show user-friendly token limit message
    showTokenLimitError();
  }
}
```

## Configuration

### Adjusting Token Limits

To change the daily token limit, update the constant in `functions/src/services/tokenTracker.ts`:

```typescript
const MAX_DAILY_TOKENS = 15000; // Change from 10000 to 15000
```

### Token Counting Accuracy

The system uses Gemini's built-in token counting for maximum accuracy:

```typescript
// Primary method - accurate token counting
const tokenCountResult = await model.countTokens(prompt);
const promptTokens = tokenCountResult.totalTokens;

// Fallback method - only used if countTokens() fails
const fallbackTokens = estimateTokenCountFallback(prompt);
```

The fallback estimation can be adjusted if needed:

```typescript
export function estimateTokenCountFallback(text: string): number {
  const cleanText = text.trim().replace(/\s+/g, ' ');
  // Adjust this ratio based on your content type
  return Math.ceil(cleanText.length / 3.5); // More accurate for technical content
}
```

## Monitoring and Analytics

### View Usage in Firebase Console

1. Go to Firestore Database
2. Navigate to `global` collection
3. View the `usage` document for current stats

### Cloud Functions Logs

Monitor token usage in Cloud Functions logs:

```bash
firebase functions:log --only analyzeJobDescription
```

Look for log entries:

- `Accurate prompt token count: X tokens`
- `Actual token usage: X tokens (prompt tokens: X)`
- `Reserved X tokens. New total: X/10000`

## Security Considerations

### Complete Transaction Safety

- **Entire operation** wrapped in a single Firestore transaction
- **Atomic execution**: Either everything succeeds or everything rolls back
- **No partial failures**: API failures don't consume tokens
- **Race condition prevention**: Multiple concurrent requests handled safely
- **Rollback guarantee**: Failed operations leave token counts unchanged

### Access Control

- Only authenticated users can read token usage
- Only Cloud Functions can modify token counts
- Client-side cannot manipulate token limits

## Troubleshooting

### Common Issues

**1. "Document not found" errors**

- The global document is created automatically on first use
- Ensure Cloud Functions have proper Firestore permissions

**2. Token counting issues**

- Check if `model.countTokens()` is working properly
- Monitor fallback usage in logs (should be rare)
- Adjust fallback estimation if `countTokens()` frequently fails

**3. Daily reset not working**

- Check server timezone settings
- Verify date comparison logic in `shouldResetDaily()`

**4. Transaction rollback issues**

- Monitor logs for transaction failures and rollbacks
- Ensure API errors don't leave tokens in inconsistent state
- Check for proper error handling in concurrent scenarios

### Debug Mode

Enable detailed logging in development:

```typescript
// In executeJobAnalysisTransaction
logger.info(`Accurate prompt token count: ${promptTokens} tokens`);
logger.info(`Making Gemini API call with ${promptTokens} tokens reserved`);
logger.info(`API call successful. Actual token usage: ${actualTokens} tokens`);
logger.info(
  `Transaction completed. New token total: ${finalUsage.totalTokensUsed}/${MAX_DAILY_TOKENS}`
);

// Error scenarios
logger.error('API call failed, transaction will be rolled back:', apiError);
```

## Performance Considerations

### Transaction Limits

- Firestore transactions have a 10MB limit
- Token tracking documents are small (~100 bytes)
- Can handle thousands of concurrent requests

### Caching

Consider implementing client-side caching for token usage display:

```typescript
// Cache token stats for 1 minute
const CACHE_DURATION = 60 * 1000;
let cachedStats: TokenUsageStats | null = null;
let cacheTime = 0;

export const getCachedTokenStats = async () => {
  const now = Date.now();
  if (cachedStats && now - cacheTime < CACHE_DURATION) {
    return cachedStats;
  }

  cachedStats = await getTokenUsageStats();
  cacheTime = now;
  return cachedStats;
};
```

## Future Enhancements

### Potential Improvements

1. **User-specific limits** - Track usage per user
2. **Monthly/weekly limits** - Additional time-based limits
3. **Priority queuing** - Premium users get priority
4. **Usage analytics** - Detailed usage reports
5. **Auto-scaling limits** - Increase limits based on usage patterns

### Implementation Ideas

```typescript
// User-specific tracking
interface UserTokenUsage {
  userId: string;
  dailyUsed: number;
  monthlyUsed: number;
  lastReset: string;
  tier: 'free' | 'premium' | 'enterprise';
}

// Priority queuing
interface TokenRequest {
  userId: string;
  estimatedTokens: number;
  priority: number;
  timestamp: number;
}
```

This token tracking system provides robust protection against API cost overruns while maintaining excellent user experience through real-time feedback and graceful error handling.
