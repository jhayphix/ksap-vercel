import { useContext } from "react";
import { ConfigContext } from "@contexts/ConfigContextProvider";

import HeaderBanner from "@components/headers/HeaderBanner";
import PageTransition from "@layouts/PageTransition";
import DefaultSpinner from "@components/spinners/DefaultSpinner";
import ExternalScholarshipCard from "@components/cards/ExternalScholarshipCard";

const externalScholarshipsData = [
  {
    id: "sch-ext-001",
    name: "GETFund Scholarship",
    url: "https://getfund.scholarshipgh.com",
    deadline: "2025-06-30T23:59:59Z",
    sponsor: "GETFund",
    logoUrl: "https://example.com/logos/getfund.png",
    createdAt: "2025-04-10T10:00:00Z",
    lastUpdatedAt: "2025-04-12T09:00:00Z",
    createdByAdminId: "admin_001",
    lastUpdatedByAdminId: "admin_001",
    isActive: true,
  },
  {
    id: "sch-ext-002",
    name: "GNPC Scholarship",
    url: "https://gnpcfoundation.org/scholarship",
    deadline: "2025-05-15T23:59:59Z",
    sponsor: "GNPC Foundation",
    logoUrl: "https://example.com/logos/gnpc.png",
    createdAt: "2025-04-09T15:45:00Z",
    lastUpdatedAt: "2025-04-11T08:15:00Z",
    createdByAdminId: "admin_002",
    lastUpdatedByAdminId: "admin_002",
    isActive: true,
  },
  {
    id: "sch-ext-003",
    name: "MTN Bright Scholarship",
    url: "https://scholarship.mtn.com.gh",
    deadline: "2025-07-01T23:59:59Z",
    sponsor: "MTN Ghana Foundation",
    logoUrl: "https://example.com/logos/mtn.png",
    createdAt: "2025-04-08T12:30:00Z",
    lastUpdatedAt: "2025-04-12T11:00:00Z",
    createdByAdminId: "admin_003",
    lastUpdatedByAdminId: "admin_003",
    isActive: true,
  },
  {
    id: "sch-ext-004",
    name: "Mastercard Foundation Scholars Program",
    url: "https://mastercardfdn.org/scholars",
    deadline: "2025-08-20T23:59:59Z",
    sponsor: "Mastercard Foundation",
    logoUrl:
      "https://via.assets.so/img.jpg?w=600&h=200&tc=white&bg=#d8d8d8&txt=No+Logo",
    createdAt: "2025-04-07T14:00:00Z",
    lastUpdatedAt: "2025-04-12T14:00:00Z",
    createdByAdminId: "admin_004",
    lastUpdatedByAdminId: "admin_004",
    isActive: true,
  },
];

const ExternalScholarshipsPage = () => {
  // Contexts
  const { externalScholarshipsPageEffect } = useContext(ConfigContext);

  const externalScholarshipStatus = { isLoading: false };

  const pageTitle = "KNUST EXTERNAL SCHOLARSHIP PORTAL";
  const pageSubTitle =
    "Explore a list of verified external scholarships available to support students in pursuing higher education. These opportunities are not managed by KNUST but are accessible to eligible students. Click on any scholarship to view more details or apply via the official website.";

  return (
    <PageTransition effect={externalScholarshipsPageEffect}>
      <div>
        <HeaderBanner title={pageTitle} subTitle={pageSubTitle} />

        {externalScholarshipStatus?.isLoading ? (
          <DefaultSpinner />
        ) : !externalScholarshipsData ||
          (Array.isArray(externalScholarshipsData) &&
            externalScholarshipsData.length < 1) ? (
          <div className="text-center centering fw-medium text_warning my-5">
            No Scholarship Available
          </div>
        ) : (
          <div>
            <div className="row gy-3 gx-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 d-flex align-items-center  py-4">
              {externalScholarshipsData.map(
                ({ name, deadline, url, sponsor, logoUrl }, index) => (
                  <div className="col" key={index}>
                    <ExternalScholarshipCard
                      key={index}
                      name={name}
                      deadline={deadline}
                      url={url}
                      sponsor={sponsor}
                      logoUrl={logoUrl}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default ExternalScholarshipsPage;
