// Simple error handling for MVP
export const handleError = (error: unknown, operation: string): never => {
  console.error(`${operation} error:`, error);

  if (error instanceof Error) {
    throw new Error(`${operation} failed: ${error.message}`);
  }

  throw new Error(`${operation} failed: Unknown error`);
};
