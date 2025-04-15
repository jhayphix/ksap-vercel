import ApplicationStatusCard from "@components/cards/ApplicationStatusCard";
import { Row, Col } from "react-bootstrap";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { useContext } from "react";

const ApplicationStatusCardList = ({
  scholarshipData,
  applicationsData,
  className,
}) => {
  const { HELPER } = useContext(ConfigContext);
  const scholarshipId = scholarshipData?.id;

  console.log("applicationsData: ", applicationsData);

  // Total Applications
  const numberOfApplications = scholarshipData?.numberOfApplications;

  // Get numbers
  const numOfReviewed = HELPER?.getApplicationsByStatus(
    applicationsData,
    scholarshipId,
    "isReviewed"
  )?.length;
  const numOfUnreviewed = HELPER?.getApplicationsWhere(
    applicationsData,
    scholarshipId,
    "isReviewed",
    false
  )?.length;

  // Reviewing
  const numOfQualified = HELPER?.getApplicationsByStatus(
    applicationsData,
    scholarshipId,
    "isQualified"
  )?.length;
  const numOfPendingReview = HELPER?.getApplicationsByStatus(
    applicationsData,
    scholarshipId,
    "isPendingReview"
  )?.length;
  const numOfDisqualified = HELPER?.getApplicationsByStatus(
    applicationsData,
    scholarshipId,
    "isDisqualified"
  )?.length;

  // ::::: Approvals
  const numOfApproved = HELPER?.getApplicationsByStatus(
    applicationsData,
    scholarshipId,
    "isApproved"
  )?.length;
  const numOfPendingApproval = HELPER?.getApplicationsByStatus(
    applicationsData,
    scholarshipId,
    "isPendingApproval"
  )?.length;
  const numOfDisapproved = HELPER?.getApplicationsWhere(
    applicationsData,
    scholarshipId,
    "isDisapproved",
    true
  )?.length;

  return (
    <div className={`${className} user_select_none`}>
      {/* Row 1 - Total Applications */}
      <Row className="justify-content-center mb-3">
        <Col md={4}>
          <ApplicationStatusCard
            applicationStatus="Total Applications"
            numberOfApplications={numberOfApplications}
          />
        </Col>
      </Row>

      {/* Row 2 - Reviewed / Not Reviewed */}
      <Row className="justify-content-center mb-3">
        <Col md={4}>
          <ApplicationStatusCard
            applicationStatus="Reviewed"
            numberOfApplications={numOfReviewed}
          />
        </Col>
        <Col md={4}>
          <ApplicationStatusCard
            applicationStatus="Not Reviewed"
            numberOfApplications={numOfUnreviewed}
          />
        </Col>
      </Row>

      {/* Row 3 - Qualified / Pending Review / Disqualified */}
      <Row className="justify-content-center mb-3">
        <Col md={4}>
          <ApplicationStatusCard
            applicationStatus="Qualified"
            numberOfApplications={numOfQualified}
          />
        </Col>
        <Col md={4}>
          <ApplicationStatusCard
            applicationStatus="Pending Review"
            numberOfApplications={numOfPendingReview}
          />
        </Col>
        <Col md={4}>
          <ApplicationStatusCard
            applicationStatus="Disqualified"
            numberOfApplications={numOfDisqualified}
          />
        </Col>
      </Row>

      {/* Row 4 - Approved / Pending Approval / Not Approved */}
      <Row className="justify-content-center">
        <Col md={4}>
          <ApplicationStatusCard
            applicationStatus="Approved"
            numberOfApplications={numOfApproved}
          />
        </Col>
        <Col md={4}>
          <ApplicationStatusCard
            applicationStatus="Pending Approval"
            numberOfApplications={numOfPendingApproval}
          />
        </Col>
        <Col md={4}>
          <ApplicationStatusCard
            applicationStatus="Not Approved"
            numberOfApplications={numOfDisapproved}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ApplicationStatusCardList;
