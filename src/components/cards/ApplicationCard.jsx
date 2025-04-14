import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaAward, FaEdit, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { ConfigContext } from "@contexts/ConfigContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";

import ApplicationStatusTag from "@components/tags/ApplicationStatusTag";
import DefaultStatusTag from "@components/tags/DefaultStatusTag";
import DropdownWrapper from "@components/dropdown/DropdownWrapper";

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
  const isDeadlineDue = HELPER?.isDeadlineDue(scholarship?.deadline);

  const showDeleteApplicationModal = () => {
    setShowModal({
      isActive: true,
      title: `Delete Application`,
      message: `Are you sure you want to delete this application for "${applicantApplication?.scholarship?.name}"?`,
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
            className="bg_secondary_3 p-2 rounded centering"
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
                  className="hover_underline hover_secondary"
                >
                  {scholarship?.name}
                </Link>
              </h5>
              <span className="mx-sm-2 mx-0 d-inline-block d-none">
                {" • "}
              </span>
              <DefaultStatusTag
                className="d-inline-block d-none"
                text={scholarship?.isDue ? "Closed" : "Open"}
                color={scholarship?.isDue ? "danger" : "success"}
              />
            </div>

            {/* Application Status */}
            <div className="d-flex flex-sm-row flex-column align-items-sm-center align-items-start mt-3">
              <p
                className="text-muted me-3"
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
          <DropdownWrapper
            id="applicationCardDropdown"
            className="rounded bg_secondary_3"
          >
            <Link
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title={viewApplicationRoute?.title}
              to={viewApplicationRoute?.getPath(applicationId)}
              className="dropdown-item cursor_pointer me-4"
            >
              <FaEye size={20} className="me-2" /> Preview
            </Link>
            {!isDeadlineDue ? (
              <Link
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title={updateApplicationRoute?.title}
                to={updateApplicationRoute?.getPath(
                  applicationId,
                  lastCompletedSectionIndex
                )}
                className="dropdown-item cursor_pointer"
              >
                <FaEdit size={20} className="me-2" /> Edit
              </Link>
            ) : null}

            <hr className="my-3" />
            <button
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title={"Delete application"}
              onClick={showDeleteApplicationModal}
              className="dropdown-item cursor_pointer text_danger"
            >
              <MdDelete size={20} className="me-2" /> Delete
            </button>
          </DropdownWrapper>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
