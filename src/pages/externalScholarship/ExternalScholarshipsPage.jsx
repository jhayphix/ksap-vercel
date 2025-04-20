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

  // Work on scholarship images
  const getScholarshipImagePath = (scholarshipImageIndex) =>
    `/images/scholarships/scholarshipImage${scholarshipImageIndex}.png`;
  const assignedImages = {};
  let imageIndex = 0;
  const totalImages = 10;

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
              {externalScholarshipsData.map((scholarship) => {
                if (!assignedImages[scholarship.id]) {
                  imageIndex = (imageIndex + 1) % totalImages;
                  assignedImages[scholarship.id] = getScholarshipImagePath(
                    imageIndex + 1
                  );
                }

                return (
                  <div className="col" key={scholarship.id}>
                    <ExternalScholarshipCard
                      name={scholarship.name}
                      deadline={scholarship.deadline}
                      url={scholarship.url}
                      sponsor={scholarship.sponsor}
                      imagePath={assignedImages[scholarship.id]}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default ExternalScholarshipsPage;
