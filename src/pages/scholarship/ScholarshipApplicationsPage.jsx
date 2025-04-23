// React Modules
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

// Layout cand contexts
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { ScholarshipContext } from "@contexts/ScholarshipContextProvider";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";

import { UserContext } from "@contexts/UserContextProvider";

// Components
import HeaderBanner from "@components/headers/HeaderBanner";
import BackButton from "@components/buttons/BackButton";
import DefaultSpinner from "@components/spinners/DefaultSpinner";
import ApplicationStatusCardList from "@components/cards/ApplicationStatusCardList";
import MultiSearchTable from "@components/tables/MultiSearchTable";

// Assets

const ScholarshipApplicationsPage = () => {
  // Page Base Variables
  // Contexts
  const { scholarshipApplicantsPageEffect } = useContext(ConfigContext);
  const { adminPanelRoute } = useContext(NavigationContext);
  const { getScholarship, scholarshipStatus } = useContext(ScholarshipContext);
  const { loadApplications, applicationStatus } =
    useContext(ApplicationContext);
  const { loadAdmins, adminStatus } = useContext(UserContext);

  // Load admins
  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);
  const adminsData = adminStatus?.adminsFlattened;

  const pageParams = useParams();
  const scholarshipId = pageParams?.id;

  useEffect(() => {
    if (scholarshipId) {
      getScholarship(scholarshipId);
    }
  }, [getScholarship, scholarshipId]);
  const scholarshipData = scholarshipStatus?.scholarship || {};
  const scholarshipIsLoading = scholarshipStatus?.isLoading;
  // const numberOfApplications = scholarshipData?.numberOfApplications;

  useEffect(() => {
    loadApplications();

    //eslint-disable-next-line
  }, [scholarshipId]);
  const applicationsData = applicationStatus?.applications;
  const applicationIsLoading = applicationStatus?.isLoading;

  const scholarshipApplicationsData = scholarshipData?.applications;

  return (
    <PageTransition effect={scholarshipApplicantsPageEffect}>
      <section className="">
        <BackButton
          className="mb-3"
          btnRole="link"
          btnPath={adminPanelRoute?.path}
        />
        <HeaderBanner
          title={`${
            scholarshipData?.name ? scholarshipData?.name : "Scholarship Name"
          }`}
          className="mb-4"
        />
        <div className="mb-5">
          {scholarshipIsLoading || applicationIsLoading ? (
            <DefaultSpinner />
          ) : (
            <>
              <ApplicationStatusCardList
                scholarshipData={scholarshipData}
                applicationsData={applicationsData}
                className="mb-4"
              />
              <div>
                <MultiSearchTable
                  rawData={scholarshipApplicationsData}
                  adminsData={adminsData}
                  canDownload={true}
                  tableName={scholarshipData?.name}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default ScholarshipApplicationsPage;
