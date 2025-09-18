/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { processJobInput } from './helpers';
import { createJobAnalysisPrompt } from './prompts';
import { defineSecret } from 'firebase-functions/params';
import { setGlobalOptions } from 'firebase-functions/v2';
import { logger } from 'firebase-functions';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit.
setGlobalOptions({ maxInstances: 10 });

// Define secret for Gemini API key
const geminiApiKey = defineSecret('GEMINI_API_KEY');

// Callable function - automatically handles CORS and auth
export const analyzeJobDescription = onCall(
  { secrets: [geminiApiKey] },
  async request => {
    const { data } = request;

    if (!data || !data.text) {
      throw new HttpsError('invalid-argument', 'Missing required field: text');
    }

    const jobInput = data.text;

    try {
      // Initialize Gemini AI with the secret key
      const genAI = new GoogleGenerativeAI(geminiApiKey.value());
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Process and validate input text
      const jobDescription = processJobInput(jobInput);
      const prompt = createJobAnalysisPrompt(jobDescription);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // JSON parsing
      let parsedResponse;
      try {
        // Clean "```json" blocks
        const jsonString = text.replace(/```json\n|\n```/g, '');
        parsedResponse = JSON.parse(jsonString);
      } catch {
        // If parsing fails, throw a proper error
        logger.error('Failed to parse JSON from AI response:', text);
        throw new HttpsError('internal', 'AI response format is incorrect', {
          rawResponse: text,
        });
      }

      // Check if AI determined this is not a job description
      if (parsedResponse.isJobDescription === false) {
        throw new HttpsError(
          'invalid-argument',
          parsedResponse.error ||
            'The provided text does not appear to be a job description'
        );
      }

      return parsedResponse;
    } catch (error) {
      logger.error('Error calling Gemini API:', error);

      // If it's already an HttpsError, re-throw it
      if (error instanceof HttpsError) {
        throw error;
      }

      // Otherwise, wrap it in a proper HttpsError
      throw new HttpsError('internal', 'Failed to process AI request', {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }
);
