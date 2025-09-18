/**
 * Helper utilities for job description processing
 */

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
export function processJobInput(input: string): string {
  // Basic text cleanup
  const cleanedInput = input.trim();

  if (!cleanedInput) {
    throw new Error('Job description text cannot be empty');
  }

  if (cleanedInput.length < 50) {
    throw new Error(
      'Job description text is too short. Please provide a more detailed job description.'
    );
  }

  if (!validateJobDescription(cleanedInput)) {
    throw new Error(
      'The provided text does not appear to be a job description. Please provide a proper job posting with requirements, responsibilities, and qualifications.'
    );
  }

  return cleanedInput;
}
