import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaAward } from "react-icons/fa";

import { ConfigContext } from "@contexts/ConfigContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";

import ApplicationStatusTag from "@components/tags/ApplicationStatusTag";
import DefaultBadge from "@components/tags/DefaultBadge";
import ApplicationActionBtn from "@components/buttons/ApplicationActionBtn";

// API

const ApplicationCard = ({ applicantApplication = {}, className }) => {
  const { HELPER } = useContext(ConfigContext);
  const { viewApplicationRoute } = useContext(NavigationContext);

  const applicationId = applicantApplication?.id;
  const lastCompletedSectionIndex =
    applicantApplication?.progress?.lastCompletedSectionIndex;
  const scholarship = applicantApplication?.scholarship;
  const scholarshipDeadline = scholarship?.deadline;
  const isDeadlineDue = HELPER?.isDeadlineDue(scholarshipDeadline);
  const thisApplicationScholarshipName =
    applicantApplication?.scholarship?.name;

  return (
    <div className={`${className} bg_primary px-2 py-2 rounded`}>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          {/* Scholarship Icon */}
          <div
            className="bg_secondary_3 p-2 rounded centering d-none d-sm-inline-block"
            style={{
              width: "3.5rem",
            }}
          >
            <FaAward size={35} className="bs_text_warning" />
          </div>

          {/* Scholarship Details */}
          <div className="mx-3 d-flex flex-column justify-content-between">
            {/* Scholarship Name and (Close and open) */}
            <div className="d-flex flex-sm-row flex-column align-items-sm-center align-items-start">
              <h5 className="" style={{ fontSize: "1.1rem", opacity: "0.85" }}>
                <Link
                  to={viewApplicationRoute?.getPath(applicationId)}
                  className="hover_underline hover_text_secondary"
                >
                  {scholarship?.name}
                </Link>
              </h5>
              <span className="mx-sm-2 mx-0 d-inline-block d-none">
                {" • "}
              </span>
              <DefaultBadge
                className="d-inline-block d-none"
                text={scholarship?.isDue ? "Closed" : "Open"}
                color={scholarship?.isDue ? "danger" : "success"}
              />
            </div>

            {/* Application Status */}
            <div className="d-flex flex-sm-row flex-column align-items-sm-center align-items-start mt-3">
              <p
                className="text-muted me-3 mb-sm-0 mb-2"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                }}
              >
                {HELPER?.formatDateMMDDYYY(applicantApplication?.appliedAt)}
              </p>
              <ApplicationStatusTag
                applicantApplication={applicantApplication}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="centering">
          <ApplicationActionBtn
            applicationId={applicationId}
            isDeadlineDue={isDeadlineDue}
            lastCompletedSectionIndex={lastCompletedSectionIndex}
            applicationScholarshipName={thisApplicationScholarshipName}
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
