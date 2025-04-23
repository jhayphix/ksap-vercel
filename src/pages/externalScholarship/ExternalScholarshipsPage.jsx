import { useContext, useEffect } from "react";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { ExternalScholarshipContext } from "@contexts/ExternalScholarshipContextProvider";

import HeaderBanner from "@components/headers/HeaderBanner";
import PageTransition from "@layouts/PageTransition";
import DefaultSpinner from "@components/spinners/DefaultSpinner";
import ExternalScholarshipCard from "@components/cards/ExternalScholarshipCard";

// ...

const ExternalScholarshipsPage = () => {
  const { externalScholarshipsPageEffect } = useContext(ConfigContext);
  const { loadExternalScholarships, externalScholarshipStatus } = useContext(
    ExternalScholarshipContext
  );

  useEffect(() => {
    loadExternalScholarships();
  }, [loadExternalScholarships]);

  const externalScholarshipsData = externalScholarshipStatus?.externalScholarships;
  const externalScholarshipsIsLoading = externalScholarshipStatus?.isLoading;
  const externalScholarshipErrorMessage = externalScholarshipStatus?.error;

  const getScholarshipImagePath = (index) =>
    `/images/scholarships/scholarshipImage${index}.png`;

  const assignedImages = {};
  let imageIndex = 0;
  const totalImages = 10;

  const assignImage = (id) => {
    if (!assignedImages[id]) {
      imageIndex = (imageIndex + 1) % totalImages;
      assignedImages[id] = getScholarshipImagePath(imageIndex + 1);
    }
    return assignedImages[id];
  };

  const activeScholarships = externalScholarshipsData?.filter(
    (scholarship) => new Date(scholarship?.deadline) > new Date()
  );

  const expiredScholarships = externalScholarshipsData?.filter(
    (scholarship) => new Date(scholarship?.deadline) <= new Date()
  );

  return (
    <PageTransition effect={externalScholarshipsPageEffect}>
      <div>
        <HeaderBanner
          title="KNUST EXTERNAL SCHOLARSHIP PORTAL"
          subTitle="Explore verified external scholarships available to eligible students. These opportunities are independent of KNUST and can be accessed via their official websites."
        />

        {externalScholarshipsIsLoading ? (
          <DefaultSpinner />
        ) : externalScholarshipErrorMessage ? (
          <div className="text-center centering fw-medium text-danger my-5">
            {externalScholarshipErrorMessage}
          </div>
        ) : !externalScholarshipsData || externalScholarshipsData.length < 1 ? (
          <div className="text-center centering fw-medium text_warning my-5">
            No Scholarship Available
          </div>
        ) : (
          <div>
            {/* Active Scholarships */}
            <div className="row gy-3 gx-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 d-flex align-items-center py-4">
              {activeScholarships?.map((scholarship) => (
                <div className="col" key={scholarship?.id}>
                  <ExternalScholarshipCard
                    id={scholarship?.id}
                    name={scholarship?.name}
                    deadline={scholarship?.deadline}
                    url={scholarship?.url}
                    sponsor={scholarship?.sponsor}
                    imagePath={assignImage(scholarship?.id)}
                  />
                </div>
              ))}
            </div>

            {/* Expired Scholarships */}
            {expiredScholarships.length > 0 && (
              <>
                <div className="text-muted text-uppercase text-center fw-semibold mt-5 mb-5 px-1 h6">
                  Expired External Scholarships
                </div>
                <div className="row gy-3 gx-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 d-flex align-items-center pb-4">
                  {expiredScholarships?.map((scholarship) => (
                    <div className="col" key={scholarship?.id}>
                      <ExternalScholarshipCard
                        id={scholarship?.id}
                        name={scholarship?.name}
                        deadline={scholarship?.deadline}
                        url={scholarship?.url}
                        sponsor={scholarship?.sponsor}
                        imagePath={assignImage(scholarship?.id)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default ExternalScholarshipsPage;
