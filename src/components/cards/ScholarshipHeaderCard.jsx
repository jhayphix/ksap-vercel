import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import APIService from "@src/api/exportAPIService";

import DefaultStatusTag from "@components/tags/DefaultStatusTag";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";

import DropdownWrapper from "@components/dropdown/DropdownWrapper";
import { AuthContext } from "@contexts/AuthContextProvider";

const ScholarshipHeaderCard = ({ className, scholarshipData = {} }) => {
  const { SCHOLARSHIPS_API_REF, deleteRequest, DATABASE_TABLE_NAMES } =
    APIService;

  const navigate = useNavigate();
  const { setShowFlashMessage, setShowModal, HELPER } =
    useContext(ConfigContext);
  const { updateScholarshipRoute, dashboardRoute } =
    useContext(NavigationContext);
  const { authStatus } = useContext(AuthContext);

  const scholarshipId = scholarshipData?.id;

  const showDeleteScholarshipModal = () => {
    setShowModal({
      isActive: true,
      title: `Delete ${scholarshipData?.type || "Scholarship"} "${
        scholarshipData?.name
      }"`,
      message: `Are you sure you want to delete ${
        scholarshipData?.type || "Scholarship"
      } "${scholarshipData?.name}"?`,
      action: deleteScholarshipHandler,
    });
  };

  const deleteScholarshipHandler = async () => {
    setShowModal({ isActive: false });

    try {
      const success = await deleteRequest(
        SCHOLARSHIPS_API_REF,
        scholarshipId,
        DATABASE_TABLE_NAMES?.SCHOLARSHIPS_TABLE_NAME
      );

      if (success) {
        setShowFlashMessage({
          isActive: true,
          message: "Scholarship Deleted Successfully",
          type: "success",
        });
        navigate(dashboardRoute?.path);
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
    <div
      className={`${className} bg_light rounded py-3 px-4 d-flex justify-content-between align-items-start`}
    >
      <div>
        <h4 className="h4 mb-2">
          {scholarshipData?.name}{" "}
          {scholarshipData?.shortName && (
            <span className="h5 mb-2 d-inline-block">
              ( {scholarshipData?.shortName} )
            </span>
          )}
        </h4>

        <div className="mb-2">
          {scholarshipData?.academicYear} Academic Year Application
          <span className="mx-2">{" • "}</span>{" "}
          <DefaultStatusTag
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
        <DropdownWrapper
          id="scholarshipHeaderCardDropdown"
          className="bg_secondary_3 rounded"
        >
          <Link
            role="button"
            to={updateScholarshipRoute?.getPath(scholarshipId)}
            className="btn dropdown-item"
          >
            <FaEdit size={20} className="me-2" /> Edit
          </Link>
          <button
            className="btn dropdown-item text_danger"
            onClick={showDeleteScholarshipModal}
          >
            <MdDelete size={20} className="me-2" /> Delete
          </button>
        </DropdownWrapper>
      ) : (
        ""
      )}
    </div>
  );
};

export default ScholarshipHeaderCard;
