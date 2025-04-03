import academicProgrammesRecords from "@data/default/academicProgrammesRecords";

export const allUndergraduateProgrammes = Object.values(
  academicProgrammesRecords
)
  .flatMap((college) => college.undergraduate || [])
  .sort();

export const allPostgraduateProgrammes = Object.values(
  academicProgrammesRecords
)
  .flatMap((college) => college.postgraduate || [])
  .sort();

export const allAcademicProgrammes = [
  ...allUndergraduateProgrammes,
  ...allPostgraduateProgrammes,
];

export const allColleges = [
  "College of Engineering",
  "College of Health Sciences",
  "College of Science",
  "College of Agriculture and Natural Resources",
  "College of Arts and Built Environment",
  "College of Social Sciences",
];

export const generateProgrammeDurations = (maxYears = 10) => {
  if (typeof maxYears !== "number" || maxYears < 1) {
    throw new Error("Invalid input. maxYears must be a positive number.");
  }

  const durations = [];
  for (let months = 1; months <= maxYears * 12; months++) {
    const years = Math.floor(months / 12);
    const display =
      years > 0 && months % 12 === 0
        ? `${months} months (${years} year${years > 1 ? "s" : ""})`
        : `${months} month${months > 1 ? "s" : ""}`;
    durations.push(display);
  }

  return durations;
};
