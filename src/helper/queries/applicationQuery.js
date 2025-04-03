export const getApplicationsByStatus = (
  applications = [],
  scholarshipId,
  statusKey
) => {
  return applications.filter(
    (app) =>
      app?.scholarshipId === scholarshipId &&
      (statusKey ? app[statusKey] === true : true) // If statusKey is provided, check if it's true
  );
};

export const getApplicationsWhere = (
  applications = [],
  scholarshipId,
  key = null,
  value = null
) => {
  return applications?.filter((application) => {
    const matchesScholarship = application?.scholarshipId === scholarshipId;

    if (!key) return matchesScholarship;

    const appValue = application[key];

    const matchesKey =
      typeof value === "boolean"
        ? appValue === value
        : String(appValue)?.toLowerCase() === String(value)?.toLowerCase();

    return matchesScholarship && matchesKey;
  });
};
