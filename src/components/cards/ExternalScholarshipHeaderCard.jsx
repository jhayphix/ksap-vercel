import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import APIService from "@src/api/exportAPIService";

import DefaultBadge from "@components/tags/DefaultBadge";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";

import DropdownWrapper from "@components/dropdown/DropdownWrapper";
import { AuthContext } from "@contexts/AuthContextProvider";
import { ExternalScholarshipContext } from "@contexts/ExternalScholarshipContextProvider";

const ScholarshipHeaderCard = ({ className, externalScholarshipData = {} }) => {
  const { EXTERNAL_SCHOLARSHIPS_API_REF, deleteRequest, DATABASE_TABLE_NAMES } =
    APIService;

  const { setShowFlashMessage, setShowModal, HELPER } =
    useContext(ConfigContext);
  const { updateScholarshipRoute, dashboardRoute } =
    useContext(NavigationContext);
  const { authStatus } = useContext(AuthContext);
  const { showDeleteExternalScholarshipModal } = useContext(
    ExternalScholarshipContext
  );

  const navigate = useNavigate();

  const scholarshipId = externalScholarshipData?.id;
  const scholarshipCreatedAt = externalScholarshipData?.createdAt;
  const scholarshipCreatedByAdminId = externalScholarshipData?.createdByAdminId;
  const scholarshipDeadline = externalScholarshipData?.deadline;
  const scholarshipIsActive = externalScholarshipData?.isActive;
  const scholarshipLastUpdatedAt = externalScholarshipData?.lastUpdatedAt;
  const scholarshipLastUpdatedByAdminId =
    externalScholarshipData?.lastUpdatedByAdminId;
  const scholarshipName = externalScholarshipData?.name;
  const scholarshipSponsor = externalScholarshipData?.sponsor;
  const scholarshipUrl = externalScholarshipData?.url;

  const handleDeleteScholarship = () => {
    showDeleteExternalScholarshipModal(scholarshipId, scholarshipName);
  };

  return (
    <div
      className={`${className} bg_light rounded py-3 px-4 d-flex justify-content-between align-items-start`}
    >
      <div>
        <h4 className="h4 mb-2">{scholarshipName}</h4>

        <div className="mb-2">
          {externalScholarshipData?.academicYear} Academic Year Application
          <span className="mx-2">{" • "}</span>{" "}
          <DefaultBadge
            text={externalScholarshipData?.isDue ? "Closed" : "Open"}
            color={externalScholarshipData?.isDue ? "danger" : "success"}
          />
        </div>
        <div className="mb-2 d-flex align-items-center">
          {externalScholarshipData?.fundingType}
          <span className="mx-2">{" • "}</span>
          {Array.isArray(externalScholarshipData?.eligibilityEducationalLevel)
            ? externalScholarshipData?.eligibilityEducationalLevel?.join(", ")
            : externalScholarshipData?.eligibilityEducationalLevel}
        </div>
        <div className="mb-2">
          <span style={{ fontWeight: "500" }}>
            Eligibility Years of Study :{" "}
          </span>
          {Array.isArray(externalScholarshipData?.eligibilityYearsOfStudy)
            ? externalScholarshipData?.eligibilityYearsOfStudy?.join(", ")
            : externalScholarshipData?.eligibilityYearsOfStudy}
        </div>
        <div className="mb-2">
          <span style={{ fontWeight: "500" }}>Last Published : </span>
          {HELPER?.formatDateTime(externalScholarshipData?.updatedAt)}
        </div>
        <div className="mb-2">
          <span style={{ fontWeight: "500" }}>Deadline : </span>
          {HELPER?.formatDateTime(externalScholarshipData?.deadline)}
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

          <hr className="my-3" />
          <button
            className="btn dropdown-item text_danger"
            onClick={() => handleDeleteScholarship()}
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
