// React Modules
import { useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";

// Layout cand contexts
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { ScholarshipContext } from "@contexts/ScholarshipContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";

// Components
import DynamicFormBuilder from "@components/dynamicForm/DynamicFormBuilder";
import HeaderBanner from "@components/headers/HeaderBanner";
import BackButton from "@components/buttons/BackButton";
import FormContainerWrapper from "@components/dynamicForm/wrappers/FormContainerWrapper";
import FormFieldWrapper from "@components/dynamicForm/wrappers/FormFieldWrapper";
import SubmitFormButton from "@components/buttons/SubmitFormButton";
import QuickSwitchFormFields from "@components/dynamicForm/switchFields/QuickSwitchFormFields";
import SectionHeaderCard from "@components/cards/SectionHeaderCard";
import DefaultSpinner from "@components/spinners/DefaultSpinner";

// Assets
import exportDefaultData from "@data/default/exportDefaultData";
// API
import APIService from "@src/api/exportAPIService";

const UpdateScholarshipPage = () => {
  const { SCHOLARSHIPS_API_REF, putRequest, DATABASE_TABLE_NAMES } = APIService;
  const {
    updateScholarshipPageEffect,
    HELPER,
    setShowModal,
    setShowFlashMessage,
  } = useContext(ConfigContext);

  const { viewScholarshipRoute } = useContext(NavigationContext);
  const { getScholarship, scholarshipStatus } = useContext(ScholarshipContext);

  const { authStatus, combinedAuthStatus } = useContext(AuthContext);

  const loggedInAdminId = authStatus?.loggedInUserId;
  const userIsAdminAndLoggedIn = combinedAuthStatus?.isUserAdminAndLoggedIn;
  useEffect(() => {
    if (!userIsAdminAndLoggedIn) {
      setShowFlashMessage({
        isActive: true,
        message: "You must login as an admin to update a scholarship.",
        type: "warning",
      });
    }
  }, [userIsAdminAndLoggedIn, setShowFlashMessage]);

  const navigate = useNavigate();
  const params = useParams();
  const scholarshipId = params?.id;

  const importedFormSections = exportDefaultData?.scholarshipFormSections;
  const scholarshipFormSections = importedFormSections;

  // Get Scholarship
  useEffect(() => {
    if (scholarshipId) {
      getScholarship(scholarshipId);
    }
  }, [scholarshipId, getScholarship]);

  // const scholarshipData = scholarshipStatus?.scholarship;
  const scholarshipDataOnly = scholarshipStatus?.scholarshipOnly;
  const scholarshipIsLoading = scholarshipStatus?.isLoading;
  const scholarshipErrorMessage = scholarshipStatus?.error;

  // States
  const [scholarshipFormData, setScholarshipFormData] = useState(
    scholarshipDataOnly ? scholarshipDataOnly : {}
  );
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [submitIsDisabled, setSubmitIsDisabled] = useState(true);

  // Application Sections
  const [applicationSections, setApplicationSections] = useState(
    scholarshipDataOnly &&
      Array.isArray(scholarshipDataOnly) &&
      scholarshipDataOnly.length > 0
      ? scholarshipDataOnly.applicationSections
      : [
          {
            id: uuidv4(),
            sectionTitle: "Untitled Section",
            sectionDescription: "",
            sectionOrder: 1,
            sectionQuestions: [],
          },
        ]
  );
  const getFormFields = (applicationSections) => {
    setApplicationSections(applicationSections);
  };

  // On Load
  useEffect(() => {
    if (scholarshipDataOnly) {
      const transformDeadline = HELPER?.getDatetimeLocal(
        scholarshipDataOnly?.deadline
      );
      setScholarshipFormData({
        ...scholarshipDataOnly,
        deadline: transformDeadline,
      });
      if (scholarshipDataOnly.applicationSections) {
        setApplicationSections(scholarshipDataOnly.applicationSections);
      }
    }
  }, [scholarshipDataOnly, HELPER]);

  // Form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setScholarshipFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form Validation
  useEffect(() => {
    const updatedErrors = [];
    let formHasErrors = false;

    scholarshipFormSections?.forEach((section) => {
      section?.sectionFields?.forEach((field) => {
        const thisFieldValue = scholarshipFormData?.[field?.key];
        const thisFieldValidation = HELPER?.validateField(
          field?.regexKey,
          thisFieldValue,
          field?.label,
          field?.isRequired
        );

        const fieldError = {
          key: field?.key,
          hasError: thisFieldValidation?.hasError,
          errorMessage: thisFieldValidation?.message,
        };

        updatedErrors.push(fieldError);

        if (thisFieldValidation?.hasError) {
          formHasErrors = true;
        }
      });
    });

    setSubmitIsDisabled(formHasErrors); // Disable submit if errors exist
  }, [scholarshipFormData, scholarshipFormSections, HELPER]);

  // Reset form
  const resetFormData = (withMessage = true) => {
    setScholarshipFormData(scholarshipDataOnly ? scholarshipDataOnly : {});
    setApplicationSections(
      scholarshipDataOnly?.applicationSections
        ? scholarshipDataOnly?.applicationSections
        : []
    );

    if (withMessage) {
      setShowFlashMessage({
        isActive: true,
        message: "The form has been successfully reset!",
        type: "success",
      });
    }
    setShowModal({
      isActive: false,
    });
  };

  const showResetFormModal = () => {
    setShowModal({
      isActive: true,
      title: "Reset Form",
      message:
        "Are you sure you want to reset this form? This action will reset the form to it previously saved state.",
      action: () => {
        resetFormData();
      },
    });
  };

  // Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormIsSubmitting(true); // Start submitting

    const deadline = scholarshipFormData?.deadline;
    const description = scholarshipFormData?.description;
    const cleanedDescription = DOMPurify.sanitize(
      description?.replace(/"/g, "'")
    );

    const autoAdd = {
      updatedAt: HELPER?.getISODate(),
      updatedByAdminId: loggedInAdminId,
    };

    const dataToSave = {
      ...scholarshipFormData,
      ...autoAdd,
      deadline: HELPER?.getISODate(deadline),
      description: cleanedDescription,
      applicationSections: applicationSections,
    };

    try {
      const response = await putRequest(
        SCHOLARSHIPS_API_REF,
        scholarshipId,
        dataToSave,
        DATABASE_TABLE_NAMES?.SCHOLARSHIPS_TABLE_NAME
      );

      if (response) {
        setShowFlashMessage({
          isActive: true,
          message: "Scholarship updated successfully!",
          type: "success",
        });
        navigate(viewScholarshipRoute?.getPath(scholarshipId));
      } else {
        setShowFlashMessage({
          isActive: true,
          message: "Failed to update scholarship.",
          type: "danger",
        });
      }
    } catch (error) {
      setShowFlashMessage({
        isActive: true,
        message: `An unexpected error occurred while updating scholarship. Please try again later.`,
        type: "error",
      });
    } finally {
      setFormIsSubmitting(false); // Stop submitting
    }
  };

  return (
    <PageTransition effect={updateScholarshipPageEffect}>
      <section>
        <BackButton className="mb-3" />
        <HeaderBanner
          title={`Edit Scholarship - ${scholarshipFormData?.name}`}
          // subTitle={``}
          className="mb-5"
        />

        {scholarshipIsLoading ? (
          <DefaultSpinner />
        ) : scholarshipErrorMessage ? (
          <div className="text-center centering fw-medium text-danger my-5">
            {scholarshipErrorMessage}
          </div>
        ) : !userIsAdminAndLoggedIn ? (
          <div className="text-center text_warning fw-bold my-5">
            You must login as an admin to update scholarship
          </div>
        ) : (
          <>
            <form className="" onSubmit={handleFormSubmit}>
              {scholarshipFormSections?.map((section, sectionIndex) => {
                return (
                  <div key={sectionIndex}>
                    <SectionHeaderCard title={section?.sectionName} />
                    <FormContainerWrapper className="mb-5">
                      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xxl-3 g-3">
                        {section?.sectionFields?.map((field, fieldIndex) => {
                          const thisFieldValue =
                            scholarshipFormData?.[field?.key];
                          const thisFieldValidation = HELPER?.validateField(
                            field?.regexKey,
                            thisFieldValue,
                            field?.label,
                            field?.isRequired
                          );
                          const thisFieldHasError =
                            thisFieldValue === undefined ||
                            thisFieldValue === null
                              ? null
                              : thisFieldValidation?.hasError;
                          return (
                            <div className="col" key={fieldIndex}>
                              <FormFieldWrapper
                                key={fieldIndex}
                                className={``}
                                label={field?.label}
                                isRequired={field?.isRequired}
                                description={field?.placeholder}
                                hasError={thisFieldHasError}
                                errorMessage={thisFieldValidation?.message}
                              >
                                <QuickSwitchFormFields
                                  fieldType={field?.type}
                                  fieldKey={field?.key}
                                  fieldIsRequired={field?.isRequired}
                                  fieldOptions={field?.options}
                                  fieldPlaceholder={field?.placeholder}
                                  hasError={thisFieldHasError}
                                  fieldValue={thisFieldValue}
                                  handleFormChange={handleFormChange}
                                />
                              </FormFieldWrapper>
                            </div>
                          );
                        })}
                      </div>
                    </FormContainerWrapper>
                  </div>
                );
              })}

              <div className="row mt-5 mb-3 centering">
                <DynamicFormBuilder
                  className="col-lg-9 col-12"
                  getFormFields={getFormFields}
                  applicationSections={applicationSections}
                  setFields={setApplicationSections}
                />
              </div>
              <div className="mt-5 mb-4 d-flex align-items-center justify-content-between">
                <div
                  className="btn  btn-danger"
                  role="button"
                  onClick={() => showResetFormModal()}
                >
                  Reset Form
                </div>
                <SubmitFormButton
                  name="Update Scholarship"
                  processingName="Creating Scholarship..."
                  disabled={submitIsDisabled}
                  isLoading={formIsSubmitting}
                  isCentered={false}
                />
              </div>
            </form>
          </>
        )}
      </section>
    </PageTransition>
  );
};

export default UpdateScholarshipPage;
