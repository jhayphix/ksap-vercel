// React Modules
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

// Layout cand contexts
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { UserContext } from "@contexts/UserContextProvider";

// Components
import HeaderBanner from "@components/headers/HeaderBanner";
import BackButton from "@components/buttons/BackButton";
import ApplicantProfileComponent from "@pages/auth/ApplicantProfileComponent";
import DefaultSpinner from "@components/spinners/DefaultSpinner";

// Assets

const ViewApplicantProfilePage = () => {
  // Contexts
  const { viewApplicantProfilePageEffect } = useContext(ConfigContext);
  const { loadApplicants, getApplicant, applicantStatus } =
    useContext(UserContext);

  //   Base variables
  const params = useParams();
  const applicantId = params?.applicantId;

  //   Load Applicants
  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);
  const applicants = applicantStatus?.applicants;

  // Get Applicant
  useEffect(() => {
    getApplicant(applicants, applicantId);
  }, [getApplicant, applicants, applicantId]);
  const applicantData = applicantStatus?.applicant || null;

  const applicantIsLoading = applicantStatus?.isLoading;
  const applicantErrorMessage = applicantStatus?.error;

  return (
    <PageTransition effect={viewApplicantProfilePageEffect}>
      <section className="pb-5">
        <BackButton className="mb-3" />
        <HeaderBanner
          title={`Profile`}
          //
          className="mb-3"
        />

        {applicantIsLoading ? (
          <DefaultSpinner />
        ) : applicantErrorMessage ? (
          <div className="text-center centering fw-medium text-danger my-5">
            {applicantErrorMessage}
          </div>
        ) : (
          <ApplicantProfileComponent applicantData={applicantData} />
        )}
      </section>
    </PageTransition>
  );
};

export default ViewApplicantProfilePage;
