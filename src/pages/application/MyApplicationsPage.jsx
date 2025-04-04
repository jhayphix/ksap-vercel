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

// Assets

const MyApplicationsPage = () => {
  // ::::::::::::::::::::: CONTEXTS
  const { myApplicationsPageEffect } = useContext(ConfigContext);
  const { loadApplications, applicationStatus, getApplicantApplications } =
    useContext(ApplicationContext);
  const { dashboardRoute } = useContext(NavigationContext);
  const { authStatus, combinedAuthStatus, authUserInfo } =
    useContext(AuthContext);

  // Basic define
  const loggedInApplicantId = authStatus?.loggedInUserId;
  const loggedInApplicantUid = authUserInfo?.uid;
  const userIsApplicantAndLoggedIn =
    combinedAuthStatus?.isUserApplicantAndLoggedIn;

  // ::::::::::::::::::::: LOAD APPLICAITONS
  useEffect(() => {
    loadApplications();

    //eslint-disable-next-line
  }, []);
  const applicationsData = applicationStatus?.applications;
  const applicationIsLoading = applicationStatus?.isLoading;
  const switchId = loggedInApplicantId
    ? loggedInApplicantId
    : loggedInApplicantUid;
  const applicantApplications = getApplicantApplications(
    applicationsData,
    switchId
  );
  console.log("Applicantions: ", applicationsData);
  console.log("LoggedIN applicant uid", loggedInApplicantUid);

  console.log("loggedInApplicantId: ", loggedInApplicantId);

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
        ) : (
          <div className="my-5 row centering">
            {applicationStatus?.error?.length > 3 ? (
              <div className="text-center text-danger fw-medium my-5">
                {applicationStatus?.error}
              </div>
            ) : (
              ""
            )}

            {applicantApplications?.length <= 0 ? (
              <div className="text-center">
                {" "}
                {userIsApplicantAndLoggedIn ? (
                  "No existing applications found"
                ) : (
                  <span className="text_warning fw-bold">
                    You must login as an applicant to see your applications
                  </span>
                )}{" "}
              </div>
            ) : (
              applicantApplications?.map((applicantApplication, index) => {
                return (
                  <div key={index} className="mb-3 col-lg-8 col-12">
                    <ApplicationCard
                      applicantApplication={applicantApplication}
                    />
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>
    </PageTransition>
  );
};

export default MyApplicationsPage;
