import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { ExternalScholarshipContext } from "@contexts/ExternalScholarshipContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";

import HeaderBanner from "@components/headers/HeaderBanner";
import BackButton from "@components/buttons/BackButton";
import ExternalScholarshipHeaderCard from "@components/cards/ExternalScholarshipHeaderCard";
import DefaultSpinner from "@components/spinners/DefaultSpinner";

const ViewExternalScholarshipPage = () => {
  // Contexts
  const { viewExternalScholarshipsPageEffect } = useContext(ConfigContext);
  const { externalScholarshipsRoute } = useContext(NavigationContext);

  const {
    getExternalScholarship,
    loadExternalScholarships,
    externalScholarshipStatus,
  } = useContext(ExternalScholarshipContext);
  const { authStatus } = useContext(AuthContext);

  // Params
  const pageParams = useParams();
  const scholarshipId = pageParams?.id;

  // Load scholarships
  useEffect(() => {
    loadExternalScholarships();
  }, [loadExternalScholarships]);
  const externalScholarshipsData =
    externalScholarshipStatus?.externalScholarships;

  // Get Scholarship
  useEffect(() => {
    getExternalScholarship(externalScholarshipsData, scholarshipId);
  }, [externalScholarshipsData, getExternalScholarship, scholarshipId]);
  const externalScholarshipData =
    externalScholarshipStatus?.externalScholarship;
  const externalScholarshipIsLoading = externalScholarshipStatus?.isLoading;

  return (
    <PageTransition effect={viewExternalScholarshipsPageEffect}>
      <div>
        <BackButton
          className="mb-3"
          btnRole="link"
          btnPath={externalScholarshipsRoute?.path}
        />
        <HeaderBanner
          title={externalScholarshipData?.name || "External Scholarship"}
          subTitle={`View complete information about this external scholarship`}
        />

        {externalScholarshipIsLoading ? (
          <DefaultSpinner />
        ) : (
          <div className="row mt-3 pt-1 pb-4 centering has_dangerous_html">
            {authStatus?.isUserAdmin && (
              <ExternalScholarshipHeaderCard
                className="col-lg-9 col-md-10 col-12 mb-5"
                externalScholarshipData={externalScholarshipData}
              />
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default ViewExternalScholarshipPage;
