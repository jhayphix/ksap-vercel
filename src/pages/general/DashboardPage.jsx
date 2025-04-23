import { useContext, useEffect } from "react";
import { ScholarshipContext } from "@contexts/ScholarshipContextProvider";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import HeaderBanner from "@components/headers/HeaderBanner";
import ScholarshipCard from "@components/cards/ScholarshipCard";
import PageTransition from "@layouts/PageTransition";
import DefaultSpinner from "@components/spinners/DefaultSpinner";

const DashboardPage = () => {
  // Contexts
  const { dashboardPageEffect } = useContext(ConfigContext);
  const { loadScholarships, scholarshipStatus } =
    useContext(ScholarshipContext);

  // Load scholarships
  useEffect(() => {
    loadScholarships();
  }, [loadScholarships]);
  const scholarshipsData = scholarshipStatus?.scholarships;
  const scholarshipErrorMessage = scholarshipStatus?.error;

  return (
    <PageTransition effect={dashboardPageEffect}>
      <div>
        <HeaderBanner
          title={`KNUST SCHOLARSHIP APPLICATION PORTAL (KSAP)`}
          subTitle={`Below are available Scholarships for brilliant but needy students to enable them pursue their University Education. Click to read details and apply:`}
        />

        {scholarshipStatus?.isLoading ? (
          <DefaultSpinner />
        ) : scholarshipErrorMessage ? (
          <div className="text-center centering fw-medium text-danger my-5">
            {scholarshipErrorMessage}
          </div>
        ) : !scholarshipsData ||
          (Array.isArray(scholarshipsData) && scholarshipsData.length < 1) ? (
          <div className="text-center centering fw-medium text_warning my-5">
            No Scholarship Available
          </div>
        ) : (
          <div>
            <div className="row g-0 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 d-flex align-items-center py-4">
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

export default DashboardPage;
