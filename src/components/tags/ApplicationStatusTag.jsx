import DefaultBadge from "@components/tags/DefaultBadge";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { useContext, useEffect, useState } from "react";

const ApplicationStatusTag = ({ applicantApplication }) => {
  const { HELPER } = useContext(ConfigContext);

  const [nextStage, setNextStage] = useState({
    hasNextStage: false,
    status: "",
  });

  const applicationStatus = applicantApplication?.applicationStatus || "";
  const progress = applicantApplication?.progress || {};

  useEffect(() => {
    if (applicantApplication) {
      const { isQualified, isApproved, isDisapproved, approvalStatus } =
        applicantApplication;

      if (
        isQualified &&
        !isApproved &&
        !isDisapproved &&
        approvalStatus?.toLowerCase() !== "pending approval"
      ) {
        setNextStage((prevStage) => {
          if (
            !prevStage?.hasNextStage
            // prevStage?.status?.toLowerCase() !== "pending approval"
            // approvalStatus?.toLowerCase() !== "pending approval"
          ) {
            return {
              hasNextStage: true,
              status: "Awaiting Approval",
            };
          }
          return prevStage; // Prevents unnecessary state updates
        });
      }
    }
  }, [applicantApplication]);

  return (
    <div className="d-flex flex-sm-row flex-column align-items-sm-center align-items-start">
      <div
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        title="Application completion percentage"
        className={`fw-semibold cursor_default d-inline-block`}
        style={{ fontSize: "0.8rem" }}
      >
        {Number(progress?.percentage) === 100 ? (
          <DefaultBadge text={"100% Finished"} color={"success"} />
        ) : (
          <DefaultBadge
            text={`${Number(progress?.percentage).toFixed(2)}% Progress`}
            color={"blue"}
          />
        )}
      </div>
      <span className="mx-2">{" • "}</span>
      <div
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        title="Application Status"
      >
        <DefaultBadge
          color={HELPER?.getStatusWithColor(applicationStatus)?.color}
          text={HELPER?.getStatusWithColor(applicationStatus)?.status}
        />
      </div>
      {nextStage?.hasNextStage ? (
        <>
          <span className="mx-2">{" • "}</span>
          <div
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Next Process"
          >
            <DefaultBadge
              color={HELPER?.getStatusWithColor(nextStage?.status)?.color}
              text={HELPER?.getStatusWithColor(nextStage?.status)?.status}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ApplicationStatusTag;
