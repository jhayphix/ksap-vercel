import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaAward, FaEdit, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { ConfigContext } from "@contexts/ConfigContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";

import ApplicationStatusTag from "@components/tags/ApplicationStatusTag";
import DefaultBadge from "@components/tags/DefaultBadge";
import DropdownWrapper from "@components/dropdown/DropdownWrapper";
import ApplicationActionBtn from "@components/buttons/ApplicationActionBtn";

// API
import APIService from "@src/api/exportAPIService";

const ApplicationCard = ({ applicantApplication = {}, className }) => {
  const { APPLICATIONS_API_REF, deleteRequest, DATABASE_TABLE_NAMES } =
    APIService;

  const { HELPER, setShowModal, setShowFlashMessage } =
    useContext(ConfigContext);
  const { viewApplicationRoute, updateApplicationRoute, myApplicationsRoute } =
    useContext(NavigationContext);
  const { loadApplications } = useContext(ApplicationContext);

  const navigate = useNavigate();

  const applicationId = applicantApplication?.id;
  const lastCompletedSectionIndex =
    applicantApplication?.progress?.lastCompletedSectionIndex;
  const scholarship = applicantApplication?.scholarship;
  const scholarshipDeadline = scholarship?.deadline;
  const isDeadlineDue = HELPER?.isDeadlineDue(scholarshipDeadline);
  const thisApplicationScholarshipName =
    applicantApplication?.scholarship?.name;

  const showDeleteApplicationModal = () => {
    setShowModal({
      isActive: true,
      title: `Delete Application`,
      message: `This will delete application for "${thisApplicationScholarshipName}"?`,
      action: deleteApplicationHandler,
    });
  };

  const deleteApplicationHandler = async () => {
    setShowModal({ isActive: false });

    try {
      const success = await deleteRequest(
        APPLICATIONS_API_REF,
        applicationId,
        DATABASE_TABLE_NAMES?.APPLICATIONS_TABLE_NAME
      );

      if (success) {
        setShowFlashMessage({
          isActive: true,
          message: "Application Deleted Successfully",
          type: "success",
        });
        navigate(myApplicationsRoute?.path);
        loadApplications();
      } else {
        setShowFlashMessage({
          isActive: true,
          message: "Failed to delete scholarship.",
          type: "danger",
        });
      }
    } catch (error) {
      setShowFlashMessage({
        isActive: true,
        message: `Error deleting scholarship. Please try again:`,
        type: "error",
      });
    }
  };

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
