// Profile utility functions

// Helper function to check if notice period should be shown
export const shouldShowNoticePeriod = (
  availabilityStatus?: string
): boolean => {
  return (
    availabilityStatus === 'Employed - not interested' ||
    availabilityStatus === 'Open to opportunities'
  );
};

// Helper function to calculate years of experience from work history
export const calculateYearsOfExperience = (
  experience: Array<{
    startDate: string;
    endDate?: string;
    current: boolean;
  }>
): number => {
  if (!experience || experience.length === 0) {
    return 0;
  }

  let totalMonths = 0;

  experience.forEach(exp => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.current
      ? new Date()
      : new Date(exp.endDate || new Date());

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      const monthsDiff =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());
      totalMonths += Math.max(0, monthsDiff);
    }
  });

  // Convert months to years, rounded to 1 decimal place
  return Math.round((totalMonths / 12) * 10) / 10;
};
