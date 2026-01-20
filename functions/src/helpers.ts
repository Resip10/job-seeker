/**
 * Helper utilities for job description processing
 */

export class JobInputError extends Error {
  readonly code: 'invalid-argument' | 'url-fetch-failed';

  constructor(
    message: string,
    code: 'invalid-argument' | 'url-fetch-failed' = 'invalid-argument'
  ) {
    super(message);
    this.name = 'JobInputError';
    this.code = code;
  }
}

const isUrl = (text: string) => {
  try {
    const url = new URL(text);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const fetchJobTextFromUrl = async (url: string): Promise<string> => {
  const parsedUrl = new URL(url);
  const requestUrls =
    parsedUrl.hostname === 'r.jina.ai'
      ? [parsedUrl.toString()]
      : [
          `https://r.jina.ai/${parsedUrl.host}${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`,
          `https://r.jina.ai/${parsedUrl.toString()}`,
        ];

  let lastError: unknown;

  for (const requestUrl of requestUrls) {
    try {
      const response = await fetch(requestUrl, {
        headers: {
          'X-Return-Format': 'text',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL content: ${response.status}`);
      }

      const text = (await response.text()).trim();

      if (!text) {
        throw new Error('Fetched content is empty');
      }

      return text;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Failed to fetch URL content from Jina');
};

/**
 * Validates if the input text appears to be a job description (language-agnostic)
 * @param input - Text to validate
 * @returns boolean - true if it appears to be a job description
 */
export function validateJobDescription(input: string): boolean {
  const text = input.trim();

  // Basic length check - job descriptions are typically substantial
  if (text.length < 50) {
    return false;
  }

  // Check for very short inputs that are clearly not job descriptions
  if (text.length < 100 && !/\n/.test(text)) {
    return false;
  }

  return true;
}

/**
 * Processes and validates job description text
 * @param input - Job description text
 * @returns string - The validated job description text
 * @throws Error if input is not a valid job description
 */
export async function processJobInput(input: string): Promise<string> {
  // Basic text cleanup
  const initialInput = input.trim();
  const isUrlInput = isUrl(initialInput);

  if (!initialInput) {
    throw new JobInputError('Job description text cannot be empty');
  }

  let cleanedInput = initialInput;
  let fromUrl = false;

  if (isUrlInput) {
    fromUrl = true;

    try {
      cleanedInput = await fetchJobTextFromUrl(initialInput);
    } catch (error) {
      throw new JobInputError(
        'Unable to read the website. Please paste the job description text instead.',
        'url-fetch-failed'
      );
    }
  }

  if (cleanedInput.length < 50) {
    if (fromUrl) {
      throw new JobInputError(
        'Unable to parse the job posting. Please paste the job description text instead.'
      );
    }

    throw new JobInputError(
      'Job description text is too short. Please provide a more detailed job description.'
    );
  }

  if (!validateJobDescription(cleanedInput)) {
    if (fromUrl) {
      throw new JobInputError(
        'Unable to parse the job posting. Please paste the job description text instead.'
      );
    }

    throw new JobInputError(
      'The provided text does not appear to be a job description. Please provide a proper job posting with requirements, responsibilities, and qualifications.'
    );
  }

  return cleanedInput;
}
