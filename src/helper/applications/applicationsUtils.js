export const hasAppliedForScholarship = (
  applicantId,
  scholarshipId,
  applications
) => {
  return applications?.some(
    (app) =>
      app?.applicantId === applicantId && app?.scholarshipId === scholarshipId
  );
};

export const isDeadlineDue = (deadline) => new Date(deadline) <= new Date();

export const getStatusWithColor = (status) => {
  if (!status) return { status: "Unknown", color: "secondary" };

  const transformedStatus = status.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  const statusMap = {
    success: [
      "approved",
      "aproval",
      "aprove",
      "granted",
      "awarded",
      "accepted",
    ],
    danger: [
      "reject",
      "rejected",
      "rejection",
      "declined",
      "disqualified",
      "disapproved",
      "disapprove",
      "disapproval",
      "failed",
    ],
    blue: [
      "qualify",
      "qualified",
      "review",
      "reviewed",
      "screened",
      "eligible",
      "validated",
      "awaitingreview",
      "awaitingapproval",
    ],
    warning: [
      "pending",
      "inreview",
      "unreviewed",
      "unreview",
      "underreview",
      "processing",
      "awaiting",
      "pendingreview",
      "pendingapproval",
    ],
  };

  for (const [color, statuses] of Object.entries(statusMap)) {
    if (statuses.includes(transformedStatus)) {
      return { status: status, color };
    }
  }

  return { status: status, color: "secondary" };
};


