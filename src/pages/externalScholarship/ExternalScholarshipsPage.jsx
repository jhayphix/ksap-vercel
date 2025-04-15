import { useContext, useEffect } from "react";
import { ScholarshipContext } from "@contexts/ScholarshipContextProvider";
import HeaderBanner from "@components/headers/HeaderBanner";
import ScholarshipCard from "@components/cards/ScholarshipCard";
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import DefaultSpinner from "@components/spinners/DefaultSpinner";

const ExternalScholarshipsPage = () => {
  // Contexts
  const { externalScholarshipsPageEffect } = useContext(ConfigContext);
  const { loadScholarships, scholarshipStatus } =
    useContext(ScholarshipContext);

  // Load scholarships
  useEffect(() => {
    loadScholarships();
  }, [loadScholarships]);
  const scholarshipsData = scholarshipStatus?.scholarships;

  const pageTitle = "KNUST EXTERNAL SCHOLARSHIP PORTAL";
  const pageSubTitle =
    "Explore a list of verified external scholarships available to support students in pursuing higher education. These opportunities are not managed by KNUST but are accessible to eligible students. Click on any scholarship to view more details or apply via the official website.";

  return (
    <PageTransition effect={externalScholarshipsPageEffect}>
      <div>
        <HeaderBanner title={pageTitle} subTitle={pageSubTitle} />

        {scholarshipStatus?.isLoading ? (
          <DefaultSpinner />
        ) : !scholarshipsData ||
          (Array.isArray(scholarshipsData) && scholarshipsData.length < 1) ? (
          <div className="text-center centering fw-medium text_warning my-5">
            No Scholarship Available
          </div>
        ) : (
          <div>
            <div className="row g-0 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 d-flex align-items-center  py-4">
              {scholarshipsData.map(
                ({ id, name, deadline, requirements }, index) => (
                  <ScholarshipCard
                    key={index}
                    scholarshipId={id}
                    name={name}
                    deadline={deadline}
                    requirements={requirements}
                  />
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
