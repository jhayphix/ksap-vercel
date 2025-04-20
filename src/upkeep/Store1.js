import { useContext, useEffect } from "react";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { ExternalScholarshipContext } from "@contexts/ExternalScholarshipContextProvider";

import HeaderBanner from "@components/headers/HeaderBanner";
import PageTransition from "@layouts/PageTransition";
import DefaultSpinner from "@components/spinners/DefaultSpinner";
import ExternalScholarshipCard from "@components/cards/ExternalScholarshipCard";

const ExternalScholarshipsPage = () => {
  // Contexts
  const { externalScholarshipsPageEffect } = useContext(ConfigContext);
  const { loadExternalScholarships, externalScholarshipStatus } = useContext(
    ExternalScholarshipContext
  );

  // Load scholarships
  useEffect(() => {
    loadExternalScholarships();
  }, [loadExternalScholarships]);
  const externalScholarshipsData =
    externalScholarshipStatus?.externalScholarships;
  const externalScholarshipsIsLoading = externalScholarshipStatus?.isLoading;

  const pageTitle = "KNUST EXTERNAL SCHOLARSHIP PORTAL";
  const pageSubTitle =
    "Explore a list of verified external scholarships available to support students in pursuing higher education. These opportunities are not managed by KNUST but are accessible to eligible students. Click on any scholarship to view more details or apply via the official website.";

  return (
    <PageTransition effect={externalScholarshipsPageEffect}>
      <div>
        <HeaderBanner title={pageTitle} subTitle={pageSubTitle} />

        {externalScholarshipsIsLoading ? (
          <DefaultSpinner />
        ) : !externalScholarshipsData ||
          (Array.isArray(externalScholarshipsData) &&
            externalScholarshipsData?.length < 1) ? (
          <div className="text-center centering fw-medium text_warning my-5">
            No Scholarship Available
          </div>
        ) : (
          <div>
            <div className="row gy-3 gx-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 d-flex align-items-center  py-4">
              {externalScholarshipsData?.map(
                ({ name, deadline, url, sponsor }, scholarshipIndex) => (
                  <div className="col" key={scholarshipIndex}>
                    <ExternalScholarshipCard
                      key={scholarshipIndex}
                      name={name}
                      deadline={deadline}
                      url={url}
                      sponsor={sponsor}
                      imageIndex={scholarshipIndex}
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
