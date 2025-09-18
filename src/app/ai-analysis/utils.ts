/**
 * Formats response values for display in the AI analysis results
 */
export const formatResponseValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.map(item => `• ${item}`).join('\n');
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }

  return String(value || 'Not provided');
};
