import { useContext } from "react";

import { AuthContext } from "@contexts/AuthContextProvider";
import { ConfigContext } from "@contexts/ConfigContextProvider";

import DefaultBadge from "@components/tags/DefaultBadge";
import ScholarshipActionBtn from "@components/buttons/ScholarshipActionBtn";

const ScholarshipHeaderCard = ({ className, scholarshipData = {} }) => {
  const { HELPER } = useContext(ConfigContext);
  const { authStatus } = useContext(AuthContext);

  const scholarshipId = scholarshipData?.id;
  const scholarshipName = scholarshipData?.name;
  return (
    <div
      className={`${className} bg_light rounded py-3 px-4 d-flex justify-content-between align-items-start`}
    >
      <div>
        <h4 className="h4 mb-2">
          {scholarshipName}{" "}
          {scholarshipData?.shortName && (
            <span className="h5 mb-2 d-inline-block">
              ( {scholarshipData?.shortName} )
            </span>
          )}
        </h4>

        <div className="mb-2">
          {scholarshipData?.academicYear} Academic Year Application
          <span className="mx-2">{" • "}</span>{" "}
          <DefaultBadge
            text={scholarshipData?.isDue ? "Closed" : "Open"}
            color={scholarshipData?.isDue ? "danger" : "success"}
          />
        </div>
        <div className="mb-2 d-flex align-items-center">
          {scholarshipData?.fundingType}
          <span className="mx-2">{" • "}</span>
          {Array.isArray(scholarshipData?.eligibilityEducationalLevel)
            ? scholarshipData?.eligibilityEducationalLevel?.join(", ")
            : scholarshipData?.eligibilityEducationalLevel}
        </div>
        <div className="mb-2">
          <span style={{ fontWeight: "500" }}>
            Eligibility Years of Study :{" "}
          </span>
          {Array.isArray(scholarshipData?.eligibilityYearsOfStudy)
            ? scholarshipData?.eligibilityYearsOfStudy?.join(", ")
            : scholarshipData?.eligibilityYearsOfStudy}
        </div>
        <div className="mb-2">
          <span style={{ fontWeight: "500" }}>Last Published : </span>
          {HELPER?.formatDateTime(scholarshipData?.updatedAt)}
        </div>
        <div className="mb-2">
          <span style={{ fontWeight: "500" }}>Deadline : </span>
          {HELPER?.formatDateTime(scholarshipData?.deadline)}
        </div>
      </div>

      {authStatus?.isUserSuperAdmin ? (
        <>
          <ScholarshipActionBtn
            scholarshipId={scholarshipId}
            scholarshipName={scholarshipName}
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default ScholarshipHeaderCard;
