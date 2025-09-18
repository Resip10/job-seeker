/**
 * AI prompt templates for job analysis
 */

/**
 * Creates a formatted prompt for job description analysis
 * @param jobDescription - The job description text to analyze
 * @returns Formatted prompt string for the AI model
 */
export function createJobAnalysisPrompt(jobDescription: string): string {
  return `ANALYZE THE FOLLOWING TEXT:

FIRST: Determine if this text is actually a job description/job posting in ANY language. 

Job descriptions typically contain:
- Information about a specific role/position
- Required skills, qualifications, or experience
- Responsibilities or duties
- Company information or hiring context
- Professional language and structure

If it's NOT a job description (e.g., personal message, casual conversation, random text, product description, greetings, test input, etc.), respond with:
{"isJobDescription": false, "error": "This text does not appear to be a job description. Please provide a proper job posting that describes a specific role, requirements, and responsibilities."}

IF it IS a job description, analyze it thoroughly:

1. Skills: Extract ALL skills mentioned or reasonably implied, including:
   - Technical skills (programming languages, tools, software)
   - Soft skills (communication, leadership, teamwork)
   - Industry knowledge and methodologies
   - Certifications or educational requirements

2. Interview Questions: Generate 5 realistic, role-specific questions:
   - Mix technical and behavioral questions
   - Match the seniority level indicated
   - Be specific to this particular role
   - Avoid generic questions

3. Response format: Return ONLY valid JSON:
   - 'isJobDescription' (boolean): true
   - 'jobTitle' (string): extracted or inferred job title
   - 'company' (string): company name if mentioned, or "Not specified"
   - 'skills' (array of strings): ALL extracted skills
   - 'interviewQuestions' (array of strings): 5 specific questions
   - 'seniority' (string): "Entry-level", "Mid-level", "Senior", "Lead/Manager", or "Not specified"
   - 'location' (string): location if mentioned, or "Not specified"

TEXT TO ANALYZE:
${jobDescription}

        JSON Response:`;
}
