import { useContext, useEffect } from "react";

import DefaultBadge from "@components/tags/DefaultBadge";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";
import { UserContext } from "@contexts/UserContextProvider";

import ExternalScholarshipActionBtn from "@components/buttons/ExternalScholarshipActionBtn";

const ScholarshipHeaderCard = ({ className, externalScholarshipData = {} }) => {
  const { HELPER } = useContext(ConfigContext);
  const { authStatus } = useContext(AuthContext);
  const { loadAdmins, adminStatus, getAdminReturn } = useContext(UserContext);

  // Load admins
  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);
  const adminsData = adminStatus?.adminsFlattened;

  const scholarshipId = externalScholarshipData?.id;
  const scholarshipName = externalScholarshipData?.name;
  const scholarshipSponsor = externalScholarshipData?.sponsor;
  const scholarshipUrl = externalScholarshipData?.url;

  const scholarshipDeadline = externalScholarshipData?.deadline;
  const scholarshipIsDue = new Date(scholarshipDeadline) <= new Date();

  const scholarshipCreatedAt = externalScholarshipData?.createdAt;
  const scholarshipCreatedByAdminId = externalScholarshipData?.createdByAdminId;
  const scholarshipCreatedBy =
    getAdminReturn(adminsData, scholarshipCreatedByAdminId) || {};
  const scholarshipUpdatedAt = externalScholarshipData?.updatedAt;
  const scholarshipUpdatedByAdminId = externalScholarshipData?.updatedByAdminId;
  const scholarshipUpdatedBy =
    getAdminReturn(adminsData, scholarshipUpdatedByAdminId) || {};

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
          value: scholarshipCreatedBy?.fullName || "N/A",
        },
        {
          label: "Published At",
          value: HELPER?.formatDateTime(scholarshipCreatedAt),
        },
        {
          label: "Last Updated By",
          value: scholarshipUpdatedBy?.fullName || "N/A",
        },
        {
          label: "Last Updated At",
          value: HELPER?.formatDateTime(scholarshipUpdatedAt),
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
                {value ? value : "N/A"}
              </div>
            ))}
          </div>
        ))}
      </div>

      {authStatus?.isUserSuperAdmin ? (
        <>
          <ExternalScholarshipActionBtn
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
