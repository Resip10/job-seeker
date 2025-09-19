// Firebase AI Analysis Service
import { getFunctions, httpsCallable } from 'firebase/functions';
import app from '../config';

interface JobAnalysisRequest {
  text: string;
}

export interface JobAnalysisResponse {
  isJobDescription: boolean;
  error?: string;
  jobTitle?: string;
  company?: string;
  skills?: string[];
  interviewQuestions?: string[];
  seniority?: string;
  location?: string;
  [key: string]: unknown;
}

/**
 * Call the Firebase Callable Function for job analysis
 * This automatically handles CORS and authentication
 */
export const analyzeJobDescription = async (
  jobDescription: string
): Promise<JobAnalysisResponse> => {
  try {
    const functions = getFunctions(app);
    if (
      process.env.NODE_ENV === 'development' &&
      !process.env.NEXT_PUBLIC_USE_PRODUCTION_FUNCTIONS
    ) {
      try {
        const { connectFunctionsEmulator } = await import('firebase/functions');
        connectFunctionsEmulator(functions, 'localhost', 5001);
        if (process.env.NODE_ENV === 'development') {
          console.log('🔧 Using Firebase Functions emulator');
        }
      } catch {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔧 Emulator connection failed, using production');
        }
      }
    } else if (process.env.NEXT_PUBLIC_USE_PRODUCTION_FUNCTIONS) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Using production Firebase Functions');
      }
    }

    const analyzeJob = httpsCallable<JobAnalysisRequest, JobAnalysisResponse>(
      functions,
      'analyzeJobDescription'
    );
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Callable function reference created');
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 About to call callable function...');
    }
    const result = await analyzeJob({ text: jobDescription });
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Function call successful:', result);
    }

    return result.data;
  } catch (error: unknown) {
    console.error('Firebase callable function error:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }

    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      'message' in error
    ) {
      throw new Error(
        `Firebase function error (${error.code}): ${error.message}`
      );
    }
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to analyze job description: ${errorMessage}`);
  }
};
