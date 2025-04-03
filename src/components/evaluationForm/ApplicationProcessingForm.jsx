import { useContext, useState } from "react";

import { ConfigContext } from "@contexts/ConfigContextProvider";

import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";

import SectionHeaderCard from "@components/cards/SectionHeaderCard";
import ApplicationReviewForm from "@components/evaluationForm/ApplicationReviewForm";
import ApplicationApprovalForm from "@components/evaluationForm/ApplicationApprovalForm";

import APIService from "@src/api/exportAPIService";

const ApplicationProcessingForm = ({ applicationData }) => {
  const { APPLICATIONS_API_REF, putRequest, DATABASE_TABLE_NAMES } = APIService;

  const { setShowFlashMessage } = useContext(ConfigContext);
  const { getApplication } = useContext(ApplicationContext);
  const { authStatus } = useContext(AuthContext);

  const [updateIsLoading, setUpdateIsLoading] = useState(false);

  const handleApplicationProcessingSubmit = async (dataToSubmit) => {
    setUpdateIsLoading(true);
    try {
      const response = await putRequest(
        APPLICATIONS_API_REF,
        dataToSubmit?.id,
        dataToSubmit,
        DATABASE_TABLE_NAMES?.APPLICATIONS_TABLE_NAME
      );

      if (response) {
        getApplication(applicationData?.id);
        setShowFlashMessage({
          isActive: true,
          message: "Application Review Saved Successfully!",
          type: "success",
        });
      } else {
        setShowFlashMessage({
          isActive: true,
          message: "Failed to save application review. Please try again.",
          type: "danger",
        });
      }
    } catch (error) {
      setShowFlashMessage({
        isActive: true,
        message: `Error saving application review. Please try again:`,
        type: "danger",
      });
    } finally {
      setUpdateIsLoading(false);
    }
  };

  return (
    <div className="rounded">
      <SectionHeaderCard title="Application Review & Review" />
      <div className="mb-5 bg_primary_2 rounded">
        <ApplicationReviewForm
          onSubmit={handleApplicationProcessingSubmit}
          applicationData={applicationData}
          updateIsLoading={updateIsLoading}
        />
      </div>

      {authStatus?.isUserSuperAdmin || authStatus?.isUserApprovalManager ? (
        <>
          <SectionHeaderCard title="Application Approval & Awarding" />
          <div className="mb-5 bg_primary_2 rounded">
            {applicationData?.isQualified ? (
              <ApplicationApprovalForm
                onSubmit={handleApplicationProcessingSubmit}
                applicationData={applicationData}
                updateIsLoading={updateIsLoading}
              />
            ) : (
              <p className="px-2 py-3 text_warning">
                Applicant/Application has to qualify before it can be approve
              </p>
            )}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default ApplicationProcessingForm;
