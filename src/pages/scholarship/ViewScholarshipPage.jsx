import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";

import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { ScholarshipContext } from "@contexts/ScholarshipContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";

import HeaderBanner from "@components/headers/HeaderBanner";
import BackButton from "@components/buttons/BackButton";
import ApplyButton from "@components/buttons/ApplyButton";
import ScholarshipDetails from "@components/cards/ScholarshipDetails";
import DefaultSpinner from "@components/spinners/DefaultSpinner";
import SectionHeaderCard from "@components/cards/SectionHeaderCard";

const ViewScholarshipPage = () => {
  // Contexts
  const { viewScholarshipPageEffect } = useContext(ConfigContext);
  const { createApplicationRoute, dashboardRoute } =
    useContext(NavigationContext);
  const { getScholarship, scholarshipStatus } = useContext(ScholarshipContext);
  const { authStatus } = useContext(AuthContext);

  // Params
  const pageParams = useParams();
  const scholarshipId = pageParams?.id;

  // Get Scholarship
  useEffect(() => {
    getScholarship(scholarshipId);
  }, [getScholarship, scholarshipId]);
  const scholarshipData = scholarshipStatus?.scholarship;
  const scholarshipIsLoading = scholarshipStatus?.isLoading;

  // Page variables
  const pageTitle = scholarshipData?.name || "Scholarship";
  const pageSubTitle = `Call for Applications for ${
    scholarshipData?.name || "..."
  } ${scholarshipData?.fundingType || ""} for the ${
    scholarshipData?.academicYear || "..."
  } Academic Year`;

  return (
    <PageTransition effect={viewScholarshipPageEffect}>
      <div>
        <BackButton
          className="mb-3"
          btnRole="link"
          btnPath={dashboardRoute?.path}
        />
        <HeaderBanner title={pageTitle} subTitle={pageSubTitle} />

        {scholarshipIsLoading ? (
          <DefaultSpinner />
        ) : (
          <div className="row mt-3 pt-1 pb-4 centering has_dangerous_html">
            {authStatus?.isUserAdmin && (
              <ScholarshipDetails
                className="col-lg-9 col-md-10 col-12 mb-5"
                scholarshipData={scholarshipData}
              />
            )}

            <div className="col-lg-9 col-md-10 col-12">
              <SectionHeaderCard title="Scholarship Description" />
              <div className=" py-4 px-md-5 px-3 rounded bg_light">
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(scholarshipData?.description),
                  }}
                  className="mb-4 has_dangerous_html"
                  style={{ fontSize: "1rem" }}
                />
                {authStatus?.isUserAdmin ? (
                  " "
                ) : (
                  <div className="row centering">
                    <ApplyButton
                      className="col-lg-4 col-md-4 col-sm-6 col-11"
                      deadline={scholarshipData?.deadline}
                      path={createApplicationRoute?.getPath(
                        scholarshipData?.id
                      )}
                      scholarshipId={scholarshipId}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default ViewScholarshipPage;
