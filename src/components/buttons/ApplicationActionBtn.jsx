import DropdownWrapper from "@components/dropdown/DropdownWrapper";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import React, { useContext } from "react";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

import APIService from "@src/api/exportAPIService";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";

import ConfirmDeleteModal from "@components/display/ConfirmDeleteModal";

const ApplicationActionBtn = ({
  applicationId,
  isDeadlineDue,
  lastCompletedSectionIndex,
  applicationScholarshipName,
}) => {
  const { viewApplicationRoute, updateApplicationRoute, myApplicationsRoute } =
    useContext(NavigationContext);

  const { APPLICATIONS_API_REF, deleteRequest, DATABASE_TABLE_NAMES } =
    APIService;

  const { setShowModal, setShowFlashMessage } = useContext(ConfigContext);
  const { loadApplications } = useContext(ApplicationContext);

  const navigate = useNavigate();

  //   const showDeleteApplicationModal = () => {
  //     setShowModal({
  //       isActive: true,
  //       title: `Delete Application`,
  //       message: `This will delete application for "${applicationScholarshipName}"?`,
  //       action: deleteApplicationHandler,
  //     });
  //   };

  //   const deleteApplicationHandler = async () => {
  //     setShowModal({ isActive: false });

  //     try {
  //       const success = await deleteRequest(
  //         APPLICATIONS_API_REF,
  //         applicationId,
  //         DATABASE_TABLE_NAMES?.APPLICATIONS_TABLE_NAME
  //       );

  //       if (success) {
  //         setShowFlashMessage({
  //           isActive: true,
  //           message: "Application Deleted Successfully",
  //           type: "success",
  //         });
  //         navigate(myApplicationsRoute?.path);
  //         loadApplications();
  //       } else {
  //         setShowFlashMessage({
  //           isActive: true,
  //           message: "Failed to delete scholarship.",
  //           type: "danger",
  //         });
  //       }
  //     } catch (error) {
  //       setShowFlashMessage({
  //         isActive: true,
  //         message: `Error deleting scholarship. Please try again:`,
  //         type: "error",
  //       });
  //     }
  //   };

  const showDeleteApplicationModal = () => {
    setShowModal({
      isActive: true,
      title: `Delete Application`,
      message: (
        <ConfirmDeleteModal
          itemName={applicationScholarshipName}
          onConfirm={async (confirmed) => {
            if (!confirmed) return;

            try {
              const success = await deleteRequest(
                APPLICATIONS_API_REF,
                applicationId,
                DATABASE_TABLE_NAMES?.APPLICATIONS_TABLE_NAME
              );
              setShowModal({ isActive: false });
              if (success) {
                setShowFlashMessage({
                  isActive: true,
                  message: "Application Deleted Successfully",
                  type: "success",
                });
                navigate(myApplicationsRoute?.path);
                loadApplications();
              } else {
                setShowModal({
                  isActive: true,
                  title: "Delete Application",
                  message: (
                    <ConfirmDeleteModal
                      itemName={applicationScholarshipName}
                      onConfirm={() => setShowModal({ isActive: false })}
                      onCancel={() => setShowModal({ isActive: false })}
                    />
                  ),
                });
              }
            } catch (error) {
              setShowModal({
                isActive: true,
                title: "Delete Application",
                message: (
                  <div>
                    <p className="text-danger mb-3">
                      Error deleting Application: {error.message}
                    </p>
                    <ConfirmDeleteModal
                      itemName={applicationScholarshipName}
                      onConfirm={() => setShowModal({ isActive: false })}
                      onCancel={() => setShowModal({ isActive: false })}
                    />
                  </div>
                ),
                action: () => {},
              });
            }
          }}
          onCancel={() => setShowModal({ isActive: false })}
        />
      ),
      action: null,
    });
  };

  return (
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
  );
};

export default ApplicationActionBtn;
