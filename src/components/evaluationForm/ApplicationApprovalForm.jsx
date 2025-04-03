import { useEffect, useState, useContext } from "react";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";

import FormFieldWrapper from "@components/dynamicForm/wrappers/FormFieldWrapper";
import SubmitFormButton from "@components/buttons/SubmitFormButton";
import DefaultSpinner from "@components/spinners/DefaultSpinner";

const ApplicationReviewForm = ({
  onSubmit,
  applicationData,
  updateIsLoading,
}) => {
  const { HELPER, setShowFlashMessage } = useContext(ConfigContext);
  const { authStatus, combinedAuthStatus } = useContext(AuthContext);

  const loggedInAdminId = authStatus?.loggedInUserId;
  const userIsAdminAndLoggedIn = combinedAuthStatus?.isUserAdminAndLoggedIn;

  const [approvalFormData, setApprovalFormData] = useState({
    applicationScore: applicationData?.applicationScore,
    approvalStatus: applicationData?.approvalStatus,
    approvalComment: applicationData?.approvalComment,
  });

  useEffect(() => {
    if (applicationData) {
      setApprovalFormData({
        applicationScore: applicationData?.applicationScore,
        approvalStatus: applicationData?.approvalStatus,
        approvalComment: applicationData?.approvalComment,
      });
    }
  }, [applicationData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setApprovalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const approvalStatus = approvalFormData?.approvalStatus;
    const isApproved = approvalStatus?.toLowerCase() === "approved";
    const isPendingApproval =
      approvalStatus?.toLowerCase() === "pending approval";
    const isDisapproved = approvalStatus?.toLowerCase() === "disapproved";

    const dataToSave = {
      ...applicationData,
      approvedByAdminId: loggedInAdminId,
      isApproved,
      isPendingApproval,
      isDisapproved,
      isProcessed: true,
      ...approvalFormData,
      applicationStatus: approvalStatus,
      approvedAt: HELPER?.getISODate(new Date()),
    };

    try {
      await onSubmit(dataToSave); // Ensure the submission completes before proceeding
    } catch (error) {
      setShowFlashMessage({
        isActive: true,
        message: `Error submitting form:`,
        type: "error",
      });
    }
  };

  const approvalStatusOptions = ["Approved", "Pending Approval", "Disapproved"];
  const formFieldClass = "mb-2";

  if (!userIsAdminAndLoggedIn) {
    return (
      <div className="text-center text_warning fw-bold my-5">
        You must login as an admin to approve an application
      </div>
    );
  } else if (userIsAdminAndLoggedIn) {
    return (
      <form className={`p-2`} id="uniqueCustomForm" onSubmit={handleFormSubmit}>
        {updateIsLoading === true ? (
          <DefaultSpinner />
        ) : (
          <div>
            <div>
              {/* Application Score */}
              <FormFieldWrapper
                className={`${formFieldClass}`}
                label="Application Score"
                isRequired={true}
                description="Enter applicant application score"
                hasError={false}
                errorMessage=""
              >
                <input
                  type="number"
                  name="applicationScore"
                  className="form-control input"
                  required
                  value={approvalFormData?.applicationScore ?? ""}
                  onChange={handleFormChange}
                />
              </FormFieldWrapper>

              {/* Approval Status */}
              <FormFieldWrapper
                className={`${formFieldClass}`}
                label="Select Appropriate Approval Status"
                isRequired={true}
                hasError={false}
                errorMessage=""
              >
                <select
                  name="approvalStatus"
                  className="form-select"
                  required
                  value={approvalFormData?.approvalStatus ?? ""}
                  onChange={handleFormChange}
                >
                  <option value="">Select Approval Status</option>
                  {approvalStatusOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </FormFieldWrapper>

              {/* Approval Comment */}
              <FormFieldWrapper
                className={`${formFieldClass}`}
                label="Approval Comment"
                isRequired={false}
                description="Provide remarks or notes regarding the approval status of the applicant's details."
                hasError={false}
                errorMessage=""
              >
                <textarea
                  name="approvalComment"
                  rows={1}
                  className="form-control"
                  required={false}
                  value={approvalFormData?.approvalComment ?? ""}
                  onChange={handleFormChange}
                />
              </FormFieldWrapper>
            </div>

            <div className="text-center mb-3 mt-4">
              <SubmitFormButton
                name="Submit Approval"
                disabled={false}
                isLoading={updateIsLoading}
              />
            </div>
          </div>
        )}
      </form>
    );
  }
};

export default ApplicationReviewForm;
