// React Modules
import { useContext, useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

// Layout cand contexts
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
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

// Assets
import exportDefaultData from "@data/default/exportDefaultData";
// API
import APIService from "@src/api/exportAPIService";

const CreateScholarshipPage = () => {
  const { SCHOLARSHIPS_API_REF, postRequest } = APIService;
  const {
    createScholarshipPageEffect,
    HELPER,
    setShowModal,
    setShowFlashMessage,
  } = useContext(ConfigContext);
  const { dashboardRoute } = useContext(NavigationContext);
  const { authStatus, combinedAuthStatus } = useContext(AuthContext);

  const loggedInAdminId = authStatus?.loggedInUserId;
  const userIsAdminAndLoggedIn = combinedAuthStatus?.isUserAdminAndLoggedIn;
  useEffect(() => {
    if (!userIsAdminAndLoggedIn) {
      setShowFlashMessage({
        isActive: true,
        message: "You must login as an admin to create a scholarship.",
        type: "warning",
      });
    }
  }, [userIsAdminAndLoggedIn, setShowFlashMessage]);

  const navigate = useNavigate();
  const thisFormKey = "createScholarshipFormStorage";
  const importedFormSections = exportDefaultData?.scholarshipFormSections;
  const scholarshipFormSections = importedFormSections;

  // States
  const [scholarshipFormData, setScholarshipFormData] = useState(
    HELPER?.getLocalStorage(thisFormKey) || {}
  );
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [submitIsDisabled, setSubmitIsDisabled] = useState(true);

  // Application Sections
  const [applicationSections, setApplicationSections] = useState(
    scholarshipFormData?.applicationSections || [
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

  // Local storage store
  useEffect(() => {
    const storedData = HELPER?.getLocalStorage(thisFormKey) || {};
    setScholarshipFormData(storedData);
  }, [HELPER, thisFormKey]);

  const saveToLocalStorage = useMemo(
    () =>
      debounce((data) => {
        HELPER?.setLocalStorage(thisFormKey, data);
      }, 500),
    [HELPER, thisFormKey]
  );

  useEffect(() => {
    const dataToLocalStorage = { ...scholarshipFormData, applicationSections };
    saveToLocalStorage(dataToLocalStorage);
  }, [scholarshipFormData, saveToLocalStorage, applicationSections]);

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

  // Clear form
  const resetFormData = (withMessage = true) => {
    HELPER?.setLocalStorage(thisFormKey, {});
    setScholarshipFormData({});
    setApplicationSections([
      {
        id: uuidv4(),
        sectionTitle: "Untitled Section",
        sectionDescription: "",
        sectionOrder: 1,
        sectionQuestions: [],
      },
    ]);

    if (withMessage) {
      setShowFlashMessage({
        isActive: true,
        message:
          "The form has been successfully cleared. You may now start fresh.",
        type: "success",
      });
    }
    setShowModal({
      isActive: false,
    });
  };

  const showClearFormModal = () => {
    setShowModal({
      isActive: true,
      title: "Clear Form",
      message:
        "Are you sure you want to clear the form? This action will remove all entered data.",
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
      externalId: uuidv4(),
      createdAt: HELPER?.getISODate(),
      updatedAt: HELPER?.getISODate(),
      createdByAdminId: loggedInAdminId,
      updatedByAdminId: loggedInAdminId,
    };

    const dataToSave = {
      ...autoAdd,
      ...scholarshipFormData,
      deadline: HELPER?.getISODate(deadline),
      description: cleanedDescription,
      applicationSections: applicationSections,
    };

    try {
      const response = await postRequest(SCHOLARSHIPS_API_REF, dataToSave);

      if (response) {
        setShowFlashMessage({
          isActive: true,
          message: "Scholarship created successfully!.",
          type: "success",
        });
        navigate(dashboardRoute?.path);

        // Reset local storage
        resetFormData(false);
      } else {
        setShowFlashMessage({
          isActive: true,
          message: "Failed to create scholarship.",
          type: "danger",
        });
      }
    } catch (error) {
      setShowFlashMessage({
        isActive: true,
        message: `An unexpected error occurred while creating scholarship. Please try again later.`,
        type: "error",
      });
    } finally {
      setFormIsSubmitting(false); // Stop submitting
    }
  };

  return (
    <PageTransition effect={createScholarshipPageEffect}>
      <section>
        <BackButton className="mb-3" />
        <HeaderBanner
          title={`Create a Scholarship`}
          subTitle={`Easily create a new scholarship by providing key details. Customize the application form with sections and questions to gather relevant information from applicants.`}
          className="mb-5"
        />

        {!userIsAdminAndLoggedIn ? (
          <div className="text-center text_warning fw-bold my-5">
            You must login as an admin to create a scholarship
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
                  onClick={() => showClearFormModal()}
                >
                  Clear Form
                </div>
                <SubmitFormButton
                  name="Create Scholarship"
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

export default CreateScholarshipPage;
