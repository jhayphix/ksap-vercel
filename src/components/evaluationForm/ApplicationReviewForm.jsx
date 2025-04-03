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

  const [reviewFormData, setReviewFormData] = useState({
    reviewedAcademicScore: applicationData?.reviewedAcademicScore,
    reviewStatus: applicationData?.reviewStatus,
    reviewComment: applicationData?.reviewComment,
  });

  useEffect(() => {
    if (applicationData) {
      setReviewFormData({
        reviewedAcademicScore: applicationData?.reviewedAcademicScore,
        reviewStatus: applicationData?.reviewStatus,
        reviewComment: applicationData?.reviewComment,
      });
    }
  }, [applicationData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setReviewFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const reviewStatus = reviewFormData?.reviewStatus;
    const isQualified = reviewStatus?.toLowerCase() === "qualified";
    const isPendingReview = reviewStatus?.toLowerCase() === "pending review";
    const isDisqualified = reviewStatus?.toLowerCase() === "disqualified";

    const dataToSave = {
      ...applicationData,
      reviewedByAdminId: loggedInAdminId,
      isQualified,
      isPendingReview,
      isDisqualified,
      isReviewed: true,
      ...reviewFormData,
      applicationStatus: reviewStatus,
      reviewedAt: HELPER?.getISODate(new Date()),

      isApproved: false,
      isPendingApproval: isQualified,
      isDisapproved: false,
      isProcessed: false,
      applicationScore: "",
      approvalStatus: "Awaiting Approval",
      approvalComment: "",
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

  const reviewStatusOptions = ["Qualified", "Pending Review", "Disqualified"];
  const formFieldClass = "mb-2";

  if (!userIsAdminAndLoggedIn) {
    return (
      <div className="text-center text_warning fw-bold my-5">
        You must login as an admin to review an application
      </div>
    );
  } else if (userIsAdminAndLoggedIn) {
    return (
      <form className={`p-2`} id="uniqueCustomForm" onSubmit={handleFormSubmit}>
        {updateIsLoading === true ? (
          <DefaultSpinner />
        ) : (
          <div>
            <div className={`${updateIsLoading ? "blurred" : ""}`}>
              {/* Reviewed Academic Score */}
              <FormFieldWrapper
                className={`${formFieldClass}`}
                label="Reviewed Academic Score"
                isRequired={true}
                description="Enter CWA or WASSCE Aggregate of applicant"
                hasError={false}
                errorMessage=""
              >
                <input
                  type="number"
                  name="reviewedAcademicScore"
                  className="form-control input"
                  required
                  value={reviewFormData?.reviewedAcademicScore ?? ""}
                  onChange={handleFormChange}
                />
              </FormFieldWrapper>

              {/* Review Status */}
              <FormFieldWrapper
                className={`${formFieldClass}`}
                label="Select Appropriate Review Status"
                isRequired={true}
                hasError={false}
                errorMessage=""
              >
                <select
                  name="reviewStatus"
                  className="form-select"
                  required
                  value={reviewFormData?.reviewStatus ?? ""}
                  onChange={handleFormChange}
                >
                  <option value="">Select Review Status</option>
                  {reviewStatusOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </FormFieldWrapper>

              {/* Review Comment */}
              <FormFieldWrapper
                className={`${formFieldClass}`}
                label="Review Comment"
                isRequired={false}
                description="Provide remarks or notes regarding the review status of the applicant's details."
                hasError={false}
                errorMessage=""
              >
                <textarea
                  name="reviewComment"
                  rows={1}
                  className="form-control"
                  required={false}
                  value={reviewFormData?.reviewComment ?? ""}
                  onChange={handleFormChange}
                />
              </FormFieldWrapper>
            </div>

            <div className="text-center mb-3 mt-4">
              <SubmitFormButton
                name="Submit Review"
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
