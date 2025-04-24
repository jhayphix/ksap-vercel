// React Modules
import { useContext, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

// Layout cand contexts
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";

// Components
import BackButton from "@components/buttons/BackButton";
import DefaultSpinner from "@components/spinners/DefaultSpinner";
import ApplicationHeaderCard from "@components/cards/ApplicationHeaderCard";
import ApplicationSectionCard from "@components/cards/ApplicationSectionCard";
import DefaultNavTab from "@components/tabs/DefaultNavTab";
import ApplicationProcessingForm from "@components/evaluationForm/ApplicationProcessingForm";
import HeaderBanner from "@components/headers/HeaderBanner";

// Assets

const EvaluateApplicationPage = () => {
  // Page Base Variables
  const params = useParams();
  const applicationId = params?.id || "error";

  const queryParamKey = "action"; // Represents the query parameter key in the URL
  const actionRoutes = ["application-details", "review"]; // Possible action values for tabs
  const tabMappings = {
    "Application Details": actionRoutes[0],
    "Evaluate Application": actionRoutes[1],
  };

  const [searchParams] = useSearchParams();
  const activeTab =
    searchParams.get(queryParamKey) || Object.values(tabMappings)[0];

  // Contexts
  const { viewApplicationPageEffect } = useContext(ConfigContext);
  const { loadApplications, applicationStatus, getApplication } =
    useContext(ApplicationContext);
  const { scholarshipApplicantsRoute } = useContext(NavigationContext);

  // ::::::::::::::::::::: LOAD APPLICAITONS
  useEffect(() => {
    loadApplications();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getApplication(applicationId);

    //eslint-disable-next-line
  }, [applicationId]);
  const applicationIsLoading = applicationStatus?.isLoading;
  const applicationErrorMessage = applicationStatus?.error;
  const applicantApplication = applicationStatus?.application || {};
  const applicantApplicationOnly = applicationStatus?.applicationOnly;
  const applicationSections = applicantApplication?.responseSections || [];

  // ::::::::::::::::::::: RETURN
  return (
    <PageTransition effect={viewApplicationPageEffect}>
      <section className="mb-5">
        <BackButton
          className="mb-3"
          btnRole="link"
          btnPath={scholarshipApplicantsRoute?.getPath(
            applicantApplication?.scholarshipId
          )}
        />

        {applicationIsLoading ? (
          <DefaultSpinner />
        ) : applicationErrorMessage ? (
          <>
            <HeaderBanner title={"Evaluate Application"} />
            <div className="text-center centering fw-medium text-danger my-5">
              {applicationErrorMessage}
            </div>
          </>
        ) : (
          <>
            <div className="centering mb-4">
              <DefaultNavTab
                tabMappings={tabMappings}
                queryParamKey={queryParamKey}
              />
            </div>

            <div className="row centering">
              <div className="col-lg-9 col-md-10 col-12">
                <ApplicationHeaderCard
                  applicantApplication={applicantApplication}
                />
                <div className="pt-5">
                  {activeTab === actionRoutes[1] ? (
                    <ApplicationProcessingForm
                      applicationData={applicantApplicationOnly}
                    />
                  ) : (
                    <>
                      {applicationSections?.map((applicationSection, index) => {
                        return (
                          <ApplicationSectionCard
                            key={index}
                            applicationSection={applicationSection}
                          />
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </PageTransition>
  );
};

export default EvaluateApplicationPage;
