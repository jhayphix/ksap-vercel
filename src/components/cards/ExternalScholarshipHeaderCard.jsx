import { Link } from "react-router-dom";
import { useContext } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import DefaultBadge from "@components/tags/DefaultBadge";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";

import DropdownWrapper from "@components/dropdown/DropdownWrapper";
import { AuthContext } from "@contexts/AuthContextProvider";
import { ExternalScholarshipContext } from "@contexts/ExternalScholarshipContextProvider";

const ScholarshipHeaderCard = ({ className, externalScholarshipData = {} }) => {
  const { HELPER } = useContext(ConfigContext);
  const { updateScholarshipRoute } = useContext(NavigationContext);
  const { authStatus } = useContext(AuthContext);
  const { showDeleteExternalScholarshipModal } = useContext(
    ExternalScholarshipContext
  );

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

  const scholarshipIsDue = new Date(scholarshipDeadline) <= new Date();

  const handleDeleteScholarship = () => {
    showDeleteExternalScholarshipModal(scholarshipId, scholarshipName);
  };

  const scholarshipDetailsObj = [
    {
      sectionName: "Details",
      sectionDetails: [
        {
          label: "Sponsor",
          value: scholarshipSponsor,
        },
        {
          label: "Deadline Status",
          value: (
            <DefaultBadge
              text={scholarshipIsDue ? "Closed" : "Open"}
              color={scholarshipIsDue ? "danger" : "success"}
            />
          ),
        },
        {
          label: "Listing Status",
          value: (
            <DefaultBadge
              text={scholarshipIsActive === true ? "Active" : "Inactive"}
              color={scholarshipIsActive === true ? "success" : "warning"}
            />
          ),
        },

        {
          label: "Scholarship URL",
          value: (
            <a
              href={scholarshipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-decoration-underline cursor_pointer"
            >
              {scholarshipUrl}
            </a>
          ),
        },
        {
          label: "Deadline",
          value: HELPER?.formatDateTime(scholarshipDeadline),
        },
      ],
    },
    {
      sectionName: "Meta Data",
      sectionDetails: [
        {
          label: "Published By",
          value: scholarshipCreatedByAdminId,
        },
        {
          label: "Published At",
          value: HELPER?.formatDateTime(scholarshipCreatedAt),
        },
        {
          label: "Last Updated By",
          value: scholarshipLastUpdatedByAdminId,
        },
        {
          label: "Last Updated At",
          value: HELPER?.formatDateTime(scholarshipLastUpdatedAt),
        },
      ],
    },
  ];

  return (
    <div
      className={`${className} bg_light rounded py-3 px-4 d-flex justify-content-between align-items-start`}
    >
      <div>
        <h4 className="h4 mb-4">{scholarshipName}</h4>
        {scholarshipDetailsObj?.map(({ sectionDetails }, sectionIndex) => (
          <div className="mb-5" key={sectionIndex}>
            {sectionDetails?.map(({ label, value }, index) => (
              <div className="mb-2" key={index}>
                <span style={{ fontWeight: "500" }}>{label}: </span>
                {value}
              </div>
            ))}
          </div>
        ))}
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
