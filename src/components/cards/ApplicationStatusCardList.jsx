import ApplicationStatusCard from "@components/cards/ApplicationStatusCard";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { useContext } from "react";

const ApplicationStatusCardList = ({
  scholarshipData,
  applicationsData,
  className,
}) => {
  const { HELPER } = useContext(ConfigContext);
  const scholarshipId = scholarshipData?.id;
  const numberOfApplications = scholarshipData?.numberOfApplications;

  // Define status mappings
  const statusKeys = {
    // isApproved: "Approved",
    isQualified: "Qualified",
    isPendingReview: "Pending Review",
    isDisqualified: "Disqualified",
    isReviewed: "Reviewed",
  };

  // Dynamically populate applicationStatus array
  const numOfUnreviewed = HELPER?.getApplicationsWhere(
    applicationsData,
    scholarshipId,
    "isReviewed",
    false
  )?.length;
  const numOfApprovals = HELPER?.getApplicationsByStatus(
    applicationsData,
    scholarshipId,
    "isApproved"
  )?.length;
  const numOfPendingApprovals = HELPER?.getApplicationsByStatus(
    applicationsData,
    scholarshipId,
    "isPendingApproval"
  )?.length;
  const numOfDisapprovals = HELPER?.getApplicationsWhere(
    applicationsData,
    scholarshipId,
    "isDisapproved",
    true
  )?.length;

  let applicationStatus = Object.entries(statusKeys)?.map(([key, label]) => ({
    applicationStatus: label,
    numberOfApplications: HELPER?.getApplicationsByStatus(
      applicationsData,
      scholarshipId,
      key
    )?.length,
  }));

  applicationStatus = [
    {
      applicationStatus: "Approved",
      numberOfApplications: numOfApprovals,
    },
    {
      applicationStatus: "Pending Approval",
      numberOfApplications: numOfPendingApprovals,
    },
    {
      applicationStatus: "Not Approved",
      numberOfApplications: numOfDisapprovals,
    },
    ...applicationStatus,
    {
      applicationStatus: "Unreviewed",
      numberOfApplications: numOfUnreviewed,
    },

    {
      applicationStatus: "Total Applications",
      numberOfApplications: numberOfApplications,
    },
  ];

  return (
    <div
      className={`${className} row g-3 row-cols-lg-4 row-cols-md-4 row-cols-sm-3 row-cols-2 centering user_select_none`}
    >
      {applicationStatus.map((item, index) => (
        <div className="col" key={index}>
          <ApplicationStatusCard
            applicationStatus={item.applicationStatus}
            numberOfApplications={item.numberOfApplications}
          />
        </div>
      ))}
    </div>
  );
};

export default ApplicationStatusCardList;
