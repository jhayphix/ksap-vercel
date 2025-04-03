export const generateAcademicYears = () => {
  let currentYear = new Date().getFullYear();
  currentYear = currentYear - 1;
  const academicYears = [];

  for (let i = 0; i <= 4; i++) {
    const startYear = currentYear + i;
    const endYear = startYear + 1; // End year should be startYear + 1
    academicYears.push(`${startYear}/${endYear}`);
  }

  return academicYears;
};

export const getYearsOfStudy = () => {
  return [1, 2, 3, 4, 6];
};
