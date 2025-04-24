// React Modules
import { useContext, useEffect } from "react";

// Layout cand contexts
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";

// Components
import HeaderBanner from "@components/headers/HeaderBanner";
import BackButton from "@components/buttons/BackButton";
import DefaultSpinner from "@components/spinners/DefaultSpinner";
import ApplicationCard from "@components/cards/ApplicationCard";
import ApplicationStatusInfoCard from "@components/cards/ApplicationStatusInfoCard";

// Assets

const MyApplicationsPage = () => {
  // ::::::::::::::::::::: CONTEXTS
  const { myApplicationsPageEffect } = useContext(ConfigContext);
  const { loadApplications, applicationStatus, getApplicantApplications } =
    useContext(ApplicationContext);
  const { dashboardRoute } = useContext(NavigationContext);
  const { authStatus, authUserInfo } = useContext(AuthContext);

  // Basic define
  const loggedInApplicantId = authStatus?.loggedInUserId;
  const loggedInApplicantUid = authUserInfo?.uid;

  // ::::::::::::::::::::: LOAD APPLICAITONS
  useEffect(() => {
    loadApplications();

    //eslint-disable-next-line
  }, []);
  const applicationsData = applicationStatus?.applications;
  const applicationIsLoading = applicationStatus?.isLoading;
  const applicationErrorMessage = applicationStatus?.error;
  const switchId = loggedInApplicantId
    ? loggedInApplicantId
    : loggedInApplicantUid;
  const applicantApplications = getApplicantApplications(
    applicationsData,
    switchId
  );

  // ::::::::::::::::::::: RETURN
  return (
    <PageTransition effect={myApplicationsPageEffect}>
      <section>
        <BackButton
          className="mb-3"
          btnRole="link"
          btnPath={dashboardRoute?.path}
        />
        <HeaderBanner title={`My Applications`} className="" />

        {applicationIsLoading ? (
          <DefaultSpinner />
        ) : applicationErrorMessage ? (
          <div className="text-center centering fw-medium text-danger my-5">
            {applicationErrorMessage}
          </div>
        ) : !applicantApplications ||
          (Array.isArray(applicantApplications) &&
            applicantApplications?.length < 1) ? (
          <div className="text-center centering fw-medium text_warning my-5">
            No Application Available
          </div>
        ) : (
          <div className="my-5 row centering">
            {applicantApplications?.map((applicantApplication, index) => {
              return (
                <div key={index} className="mb-3 col-lg-8 col-12">
                  <ApplicationCard
                    applicantApplication={applicantApplication}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="my-5">
          <ApplicationStatusInfoCard />
        </div>
      </section>
    </PageTransition>
  );
};

export default MyApplicationsPage;
