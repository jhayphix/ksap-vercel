import { Link, useNavigate } from "react-router-dom";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { useContext } from "react";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import APIService from "@src/api/exportAPIService";

import { ConfigContext } from "@contexts/ConfigContextProvider";
import { ScholarshipContext } from "@contexts/ScholarshipContextProvider";

import DropdownWrapper from "@components/dropdown/DropdownWrapper";
import ConfirmDeleteModal from "@components/display/ConfirmDeleteModal";

const ScholarshipActionBtn = ({ scholarshipId, scholarshipName }) => {
  const { SCHOLARSHIPS_API_REF, deleteRequest, DATABASE_TABLE_NAMES } =
    APIService;

  const { viewScholarshipRoute, updateScholarshipRoute, dashboardRoute } =
    useContext(NavigationContext);
  const { setShowFlashMessage, setShowModal } = useContext(ConfigContext);
  const { loadScholarships } = useContext(ScholarshipContext);
  const navigate = useNavigate();

  // const showDeleteScholarshipModal = () => {
  //   setShowModal({
  //     isActive: true,
  //     title: `Delete Scholarship"`,
  //     message: `This will delete this scholarship - "${scholarshipName}"?`,
  //     action: deleteScholarshipHandler,
  //   });
  // };

  // const deleteScholarshipHandler = async () => {
  //   setShowModal({ isActive: false });

  //   try {
  //     const success = await deleteRequest(
  //       SCHOLARSHIPS_API_REF,
  //       scholarshipId,
  //       DATABASE_TABLE_NAMES?.SCHOLARSHIPS_TABLE_NAME
  //     );

  //     if (success) {
  //       setShowFlashMessage({
  //         isActive: true,
  //         message: "Scholarship Deleted Successfully",
  //         type: "success",
  //       });
  //       navigate(dashboardRoute?.path);
  //       loadScholarships();
  //     } else {
  //       setShowFlashMessage({
  //         isActive: true,
  //         message: "Failed to delete scholarship.",
  //         type: "danger",
  //       });
  //     }
  //   } catch (error) {
  //     setShowFlashMessage({
  //       isActive: true,
  //       message: `Error deleting scholarship. Please try again:`,
  //       type: "error",
  //     });
  //   }
  // };

  const showDeleteScholarshipModal = () => {
    setShowModal({
      isActive: true,
      title: `Delete Scholarship`,
      message: (
        <ConfirmDeleteModal
          itemName={scholarshipName}
          onConfirm={async (confirmed) => {
            if (!confirmed) return;

            try {
              const success = await deleteRequest(
                SCHOLARSHIPS_API_REF,
                scholarshipId,
                DATABASE_TABLE_NAMES?.SCHOLARSHIPS_TABLE_NAME
              );

              setShowModal({ isActive: false });

              if (success) {
                setShowFlashMessage({
                  isActive: true,
                  message: "Scholarship deleted successfully.",
                  type: "success",
                });
                navigate(dashboardRoute?.path);
                loadScholarships();
              } else {
                setShowModal({
                  isActive: true,
                  title: "Delete Scholarship",
                  message: (
                    <ConfirmDeleteModal
                      itemName={scholarshipName}
                      onConfirm={() => setShowModal({ isActive: false })}
                      onCancel={() => setShowModal({ isActive: false })}
                    />
                  ),
                });
              }
            } catch (error) {
              setShowModal({
                isActive: true,
                title: "Delete Scholarship",
                message: (
                  <div>
                    <p className="text-danger mb-3">
                      Error deleting scholarship: {error.message}
                    </p>
                    <ConfirmDeleteModal
                      itemName={scholarshipName}
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
      id="viewEditScholarshipDropdown"
      className="rounded bg_secondary_3"
    >
      <Link
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        title={viewScholarshipRoute?.title}
        to={viewScholarshipRoute?.getPath(scholarshipId)}
        className="dropdown-item cursor_pointer text_secondary me-4"
      >
        <FaEye size={20} className="me-2" /> Preview
      </Link>
      <Link
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        title={updateScholarshipRoute?.title}
        to={updateScholarshipRoute?.getPath(scholarshipId)}
        className="dropdown-item cursor_pointer text_secondary"
      >
        <FaEdit size={20} className="me-2" /> Edit
      </Link>
      <hr className="my-3" />
      <button
        className="btn dropdown-item text_danger text-danger"
        onClick={showDeleteScholarshipModal}
      >
        <MdDelete size={20} className="me-2" /> Delete
      </button>
    </DropdownWrapper>
  );
};

export default ScholarshipActionBtn;
