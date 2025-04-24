// React Modules
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

// Layout cand contexts
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";

import { NavigationContext } from "@contexts/NavigationContextProvider";

// Components
import HeaderBanner from "@components/headers/HeaderBanner";
import BackButton from "@components/buttons/BackButton";
import DefaultSpinner from "@components/spinners/DefaultSpinner";
import ApplicationHeaderCard from "@components/cards/ApplicationHeaderCard";
import ApplicationSectionCard from "@components/cards/ApplicationSectionCard";

// Assets

const ViewApplicationPage = () => {
  // Page Base Variables
  const params = useParams();
  const applicationId = params?.id || "error";

  // Contexts
  const { viewApplicationPageEffect } = useContext(ConfigContext);
  const { loadApplications, applicationStatus, getApplication } =
    useContext(ApplicationContext);
  const { myApplicationsRoute } = useContext(NavigationContext);

  // ::::::::::::::::::::: LOAD APPLICAITONS

  useEffect(() => {
    loadApplications();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getApplication(applicationId);

    //eslint-disable-next-line
  }, [applicationId]);
  const applicantApplication = applicationStatus?.application || {};
  const applicationSections = applicantApplication?.responseSections || [];
  const applicationIsLoading = applicationStatus?.isLoading;
  const applicationErrorMessage = applicationStatus?.error;

  // ::::::::::::::::::::: RETURN IF LODING

  return (
    <PageTransition effect={viewApplicationPageEffect}>
      <section className="mb-5">
        <BackButton
          className="mb-3"
          btnRole="link"
          btnPath={myApplicationsRoute?.path}
        />
        <HeaderBanner title={`Application Details`} className="mb-4" />

        {applicationIsLoading ? (
          <DefaultSpinner />
        ) : applicationErrorMessage ? (
          <div className="text-center centering fw-medium text-danger my-5">
            {applicationErrorMessage}
          </div>
        ) : (
          <div className="row centering">
            <div className="col-lg-9 col-md-10 col-12">
              <ApplicationHeaderCard
                applicantApplication={applicantApplication}
              />
              <div className="pt-5">
                {applicationSections?.map((applicationSection, index) => {
                  return (
                    <ApplicationSectionCard
                      key={index}
                      applicationSection={applicationSection}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </PageTransition>
  );
};

export default ViewApplicationPage;
