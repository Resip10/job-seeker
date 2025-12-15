import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import type { Response } from 'express';
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

// CORS helper function
const setCorsHeaders = (res: Response, origin?: string) => {
  const requestOrigin = origin || '';

  // Allow localhost for development and any Vercel app for production
  const isAllowed =
    requestOrigin === 'http://localhost:3000' ||
    requestOrigin.match(/https:\/\/.*\.vercel\.app$/);

  if (isAllowed) {
    res.set('Access-Control-Allow-Origin', requestOrigin);
  }

  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Max-Age', '3600');
};

export const analyzeJobDescription = onCall(
  {
    secrets: [geminiApiKey],
    cors: [/https:\/\/.*\.vercel\.app$/, 'http://localhost:3000'],
  },
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
          // Clean up the response - remove any markdown formatting
          let jsonString = text.replace(/```json\n?|\n?```/g, '').trim();

          // Extract JSON object if there's extra text
          const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            jsonString = jsonMatch[0];
          }

          parsedResponse = JSON.parse(jsonString);
        } catch (parseError) {
          logger.error('Failed to parse JSON from AI response:', text);
          logger.error('Parse error:', parseError);
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

export const getTokenUsage = onCall(
  {
    cors: [/https:\/\/.*\.vercel\.app$/, 'http://localhost:3000'],
  },
  async () => {
    try {
      const stats = await getTokenUsageStats();

      return stats;
    } catch (error) {
      logger.error('Error getting token usage stats:', error);
      throw new HttpsError('internal', 'Failed to get token usage statistics', {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }
);

export const resetTokens = onCall(
  {
    cors: [/https:\/\/.*\.vercel\.app$/, 'http://localhost:3000'],
  },
  async request => {
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
  }
);

// HTTP version of analyzeJobDescription with manual CORS handling
export const analyzeJobDescriptionHttp = onRequest(
  { secrets: [geminiApiKey] },
  async (req, res) => {
    // Handle CORS
    setCorsHeaders(res, req.get('Origin'));

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(204).send('');

      return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });

      return;
    }

    try {
      const { text } = req.body;

      if (!text) {
        res.status(400).json({ error: 'Missing required field: text' });

        return;
      }

      logger.info('Starting job analysis process (HTTP)');

      const jobDescription = processJobInput(text);
      const prompt = createJobAnalysisPrompt(jobDescription);

      const genAI = new GoogleGenerativeAI(geminiApiKey.value());
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const processResponse = (text: string) => {
        let parsedResponse;
        try {
          // Clean up the response - remove any markdown formatting
          let jsonString = text.replace(/```json\n?|\n?```/g, '').trim();

          // Extract JSON object if there's extra text
          const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            jsonString = jsonMatch[0];
          }

          parsedResponse = JSON.parse(jsonString);
        } catch (parseError) {
          logger.error('Failed to parse JSON from AI response:', text);
          logger.error('Parse error:', parseError);
          throw new Error('AI response format is incorrect');
        }

        if (parsedResponse.isJobDescription === false) {
          throw new Error(
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

      res.status(200).json(result);
    } catch (error) {
      logger.error('Error in analyzeJobDescriptionHttp:', error);

      if (error instanceof Error && error.message.includes('token limit')) {
        res.status(429).json({ error: error.message });

        return;
      }

      res.status(500).json({
        error: 'Failed to process AI request',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
);
