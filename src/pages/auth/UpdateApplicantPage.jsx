// React Modules
import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Layout cand contexts
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { UserContext } from "@contexts/UserContextProvider";

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

const UpdateApplicantPage = () => {
  const { APPLICANTS_API_REF, putRequest, DATABASE_TABLE_NAMES } = APIService;
  const { updateApplicantPageEffect, HELPER, setShowFlashMessage } =
    useContext(ConfigContext);
  const { viewApplicantProfileRoute } = useContext(NavigationContext);
  const { applicantStatus, getApplicant, loadApplicants } =
    useContext(UserContext);

  const navigate = useNavigate();
  const params = useParams();
  const applicantId = params?.applicantId;
  const updateApplicantFormSections = exportDefaultData?.applicantFormSections;

  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);
  const applicantsOnlyFlattenedData = applicantStatus?.applicantsFlattened;

  useEffect(() => {
    if (applicantId) {
      getApplicant(applicantsOnlyFlattenedData, applicantId);
    }
  }, [applicantId, getApplicant, applicantsOnlyFlattenedData]);
  const applicantOnlyFlattenedData = applicantStatus?.applicant;

  // States
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [submitIsDisabled, setSubmitIsDisabled] = useState(true);

  const [applicantFormData, setApplicantFormData] = useState(
    applicantOnlyFlattenedData ? applicantOnlyFlattenedData : {}
  );

  // Load
  useEffect(() => {
    if (applicantOnlyFlattenedData) {
      const dateOfBirth = HELPER?.formatToDateInput(
        applicantOnlyFlattenedData?.dateOfBirth
      );
      setApplicantFormData({
        ...applicantOnlyFlattenedData,
        dateOfBirth: dateOfBirth,
      });
    }
  }, [applicantOnlyFlattenedData, HELPER]);

  // Form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setApplicantFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form Validation
  useEffect(() => {
    const updatedErrors = [];
    let formHasErrors = false;

    updateApplicantFormSections?.forEach((section) => {
      section?.sectionFields?.forEach((field) => {
        const thisFieldValue = applicantFormData?.[field?.key];
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
  }, [applicantFormData, updateApplicantFormSections, HELPER]);

  // Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormIsSubmitting(true); // Start submitting

    // Auto-generated fields
    const metaData = {
      updatedAt: HELPER?.getISODate(),
      fullName: `${applicantFormData?.lastName?.toUpperCase()}, ${
        applicantFormData?.firstName
      } ${applicantFormData?.otherNames}`.trim(),
    };

    // Extract guardian details
    const guardianDetails = {
      guardianName: applicantFormData?.guardianName,
      guardianPhone: applicantFormData?.guardianPhone,
      guardianEmail: applicantFormData?.guardianEmail,
      guardianLocation: applicantFormData?.guardianLocation,
      guardianRelationship: applicantFormData?.guardianRelationship,
      guardianOccupation: applicantFormData?.guardianOccupation,
    };

    // Remove guardian-related fields from the main object
    const {
      guardianName,
      guardianPhone,
      guardianEmail,
      guardianLocation,
      guardianRelationship,
      guardianOccupation,
      ...filteredApplicantData
    } = applicantFormData;

    const dateOfBirth = applicantFormData?.dateOfBirth;
    const dataToSave = {
      ...filteredApplicantData,
      guardianDetails,
      dateOfBirth: HELPER?.getISODate(dateOfBirth),
      ...metaData,
    };

    try {
      const response = await putRequest(
        APPLICANTS_API_REF,
        applicantId,
        dataToSave,
        DATABASE_TABLE_NAMES?.APPLICANTS_TABLE_NAME
      );

      if (response) {
        setShowFlashMessage({
          isActive: true,
          message:
            "Profile updated successfully. Your information has been successfully saved.",
          type: "success",
        });
        navigate(viewApplicantProfileRoute?.getPath(applicantId));
      } else {
        setShowFlashMessage({
          isActive: true,
          message:
            "Profile update failed. Please review the details and try again.",
          type: "danger",
        });
      }
    } catch (error) {
      setShowFlashMessage({
        isActive: true,
        message: `An unexpected error occurred while processing the profile update. Please try again later.`,
        type: "error",
      });
    } finally {
      setFormIsSubmitting(false); // Stop submitting
    }
  };

  return (
    <PageTransition effect={updateApplicantPageEffect}>
      <section>
        <BackButton className="mb-3" />
        <HeaderBanner title={`Edit Account`} className="mb-3" />

        <form className={``} onSubmit={handleFormSubmit}>
          {updateApplicantFormSections?.map((section, sectionIndex) => {
            return (
              <div key={sectionIndex}>
                <SectionHeaderCard title={section?.sectionName} />
                <FormContainerWrapper className="mb-5">
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xxl-3 g-3">
                    {section?.sectionFields?.map((field, fieldIndex) => {
                      const thisFieldValue = applicantFormData?.[field?.key];
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
              name="Edit Account"
              processingName="Updating Account..."
              disabled={submitIsDisabled}
              isLoading={formIsSubmitting}
            />
          </div>
        </form>
      </section>
    </PageTransition>
  );
};

export default UpdateApplicantPage;
