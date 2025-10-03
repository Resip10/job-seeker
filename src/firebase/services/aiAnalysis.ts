// Firebase AI Analysis Service

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
 * Call the Firebase HTTP Function for job analysis
 * Uses direct HTTP request to avoid CORS issues with callable functions
 */
export const analyzeJobDescription = async (
  jobDescription: string
): Promise<JobAnalysisResponse> => {
  try {
    // Use HTTP function instead of callable function to avoid CORS issues
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const functionUrl = `https://us-central1-${projectId}.cloudfunctions.net/analyzeJobDescriptionHttp`;

    console.log('🔧 Calling HTTP function:', functionUrl);

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: jobDescription }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log('🔧 HTTP function call successful:', result);

    return result;
  } catch (error: unknown) {
    console.error('HTTP function error:', error);

    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to analyze job description'
    );
  }
};
