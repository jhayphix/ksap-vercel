// React Modules
import { useContext, useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

// Layout cand contexts
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";

// Components
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

const CreateExternalScholarshipPage = () => {
  const { EXTERNAL_SCHOLARSHIPS_API_REF, postRequest } = APIService;
  const { createExternalScholarshipPageEffect, HELPER, setShowFlashMessage } =
    useContext(ConfigContext);
  const { externalScholarshipsRoute } = useContext(NavigationContext);
  const { authStatus } = useContext(AuthContext);

  const navigate = useNavigate();
  const thisFormKey = "createExternalScholarshipFormKey";
  const externalScholarshipFormSections =
    exportDefaultData?.externalScholarshipFormFields;

  // States
  const [externalScholarshipFormData, setExternalScholarshipFormData] =
    useState(HELPER?.getLocalStorage(thisFormKey) || {});
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [submitIsDisabled, setSubmitIsDisabled] = useState(true);

  // Local storage store
  useEffect(() => {
    const storedData = HELPER?.getLocalStorage(thisFormKey) || {};
    setExternalScholarshipFormData(storedData);
  }, [HELPER, thisFormKey]);

  const saveToLocalStorage = useMemo(
    () =>
      debounce((data) => {
        HELPER?.setLocalStorage(thisFormKey, data);
      }, 500),
    [HELPER, thisFormKey]
  );

  useEffect(() => {
    saveToLocalStorage(externalScholarshipFormData);
  }, [externalScholarshipFormData, saveToLocalStorage]);

  // Form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setExternalScholarshipFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form Validation
  useEffect(() => {
    const updatedErrors = [];
    let formHasErrors = false;

    externalScholarshipFormSections?.forEach((section) => {
      section?.sectionFields?.forEach((field) => {
        const thisFieldValue = externalScholarshipFormData?.[field?.key];
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
  }, [externalScholarshipFormData, externalScholarshipFormSections, HELPER]);


  // Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormIsSubmitting(true); // Start submitting

    // Auto-generated fields
    const autoAdd = {
      externalId: uuidv4(),
      createdByAdminId: authStatus?.loggedInUserId,
      createdAt: HELPER?.getISODate(),
      lastUpdatedByAdminId: authStatus?.loggedInUserId,
      lastUpdatedAt: HELPER?.getISODate(),
    };

    const deadline = externalScholarshipFormData?.deadline;

    // Final data to save
    const dataToSave = {
      ...autoAdd,
      ...externalScholarshipFormData,
      deadline: HELPER?.getISODate(deadline),
    };

    try {
      const response = await postRequest(
        EXTERNAL_SCHOLARSHIPS_API_REF,
        dataToSave
      );

      if (response) {
        setShowFlashMessage({
          isActive: true,
          message: "External Scholarship created successfully!.",
          type: "success",
        });
        navigate(externalScholarshipsRoute?.path);

        // Reset local storage
        HELPER?.setLocalStorage(thisFormKey, {});
      } else {
        setShowFlashMessage({
          isActive: true,
          message: "Failed to create external scholarship.",
          type: "danger",
        });
      }
    } catch (error) {
      setShowFlashMessage({
        isActive: true,
        message: `An unexpected error occurred while creating external scholarship. Please try again later.`,
        type: "error",
      });
    } finally {
      setFormIsSubmitting(false); // Stop submitting
    }
  };

  return (
    <PageTransition effect={createExternalScholarshipPageEffect}>
      <section>
        <BackButton className="mb-3" />
        <HeaderBanner title={`Create External Scholarship`} className="mb-3" />

        <form className={``} onSubmit={handleFormSubmit}>
          {externalScholarshipFormSections?.map((section, sectionIndex) => {
            return (
              <div key={sectionIndex}>
                <SectionHeaderCard title={section?.sectionName} />
                <FormContainerWrapper className="mb-5">
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xxl-3 g-3">
                    {section?.sectionFields?.map((field, fieldIndex) => {
                      const thisFieldValue =
                        externalScholarshipFormData?.[field?.key];
                      const thisFieldValidation = HELPER?.validateField(
                        field?.regexKey,
                        thisFieldValue,
                        field?.label,
                        field?.isRequired
                      );
                      const thisFieldHasError =
                        thisFieldValue === undefined || thisFieldValue === null
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
          <div className="mt-5 mb-4 text-center">
            <SubmitFormButton
              name="Create External Scholarship"
              processingName="Creating External Scholarship..."
              disabled={submitIsDisabled}
              isLoading={formIsSubmitting}
            />
          </div>
        </form>
      </section>
    </PageTransition>
  );
};

export default CreateExternalScholarshipPage;
