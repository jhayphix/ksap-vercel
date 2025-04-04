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

const RegisterApplicantPage = () => {
  const { APPLICANTS_API_REF, postRequest } = APIService;
  const { registerApplicantPageEffect, HELPER, setShowFlashMessage } =
    useContext(ConfigContext);
  const { authUserInfo, setAuthStatus, loadApplicantRole } =
    useContext(AuthContext);
  const { dashboardRoute } = useContext(NavigationContext);

  const loggedINApplicantUid = authUserInfo?.uid;

  const navigate = useNavigate();
  const thisFormKey = "registerApplicantForm";
  const applicantFormSections = exportDefaultData?.applicantFormSections;

  // States
  const [applicantFormData, setApplicantFormData] = useState(
    HELPER?.getLocalStorage(thisFormKey) || {}
  );
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [submitIsDisabled, setSubmitIsDisabled] = useState(true);

  // Local storage store
  useEffect(() => {
    const storedData = HELPER?.getLocalStorage(thisFormKey) || {};
    setApplicantFormData(storedData);
  }, [HELPER, thisFormKey]);

  const saveToLocalStorage = useMemo(
    () =>
      debounce((data) => {
        HELPER?.setLocalStorage(thisFormKey, data);
      }, 500),
    [HELPER, thisFormKey]
  );

  useEffect(() => {
    saveToLocalStorage(applicantFormData);
  }, [applicantFormData, saveToLocalStorage]);

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

    applicantFormSections?.forEach((section) => {
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
  }, [applicantFormData, applicantFormSections, HELPER]);

  // Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormIsSubmitting(true); // Start submitting

    const dateOfBirth = applicantFormData?.dateOfBirth;
    const fullName = `${applicantFormData?.lastName?.toUpperCase()}, ${
      applicantFormData?.firstName
    } ${applicantFormData?.otherNames}`.trim();

    const addFromAuth = {
      uid: authUserInfo?.uid,
      authDisplayName: authUserInfo?.authDisplayName,
      authEmail: authUserInfo?.authEmail,
      authPhotoURL: authUserInfo?.authPhotoURL,
      authPhoneNumber: authUserInfo?.authPhoneNumber,
    };

    // Auto-generated fields
    const autoAdd = {
      externalId: uuidv4(),
      createdAt: HELPER?.getISODate(),
      updatedAt: HELPER?.getISODate(),
      fullName,
      role: "Applicant",
      accountStatus: "Active",
      deactivatedAt: null,
      deactivatedByAdminId: null,
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

    // Final data to save
    const dataToSave = {
      ...autoAdd,
      ...addFromAuth,
      ...filteredApplicantData,
      dateOfBirth: HELPER?.getISODate(dateOfBirth),
      guardianDetails, // Save guardian details as an object
    };

    try {
      const response = await postRequest(APPLICANTS_API_REF, dataToSave);

      if (response) {
        setAuthStatus((prev) => ({
          ...prev,
          isUserApplicant: true,
          isUserRegistered: true,
        }));
        setShowFlashMessage({
          isActive: true,
          message:
            "Registration successful. You have been successfully registered.",
          type: "success",
        });
        loadApplicantRole(loggedINApplicantUid, authUserInfo);
        navigate(dashboardRoute?.path);

        // Reset local storage
        HELPER?.setLocalStorage(thisFormKey, {});
      } else {
        setShowFlashMessage({
          isActive: true,
          message:
            "Registration unsuccessful. Please verify the details and try again.",
          type: "danger",
        });
      }
    } catch (error) {
      setShowFlashMessage({
        isActive: true,
        message: `An unexpected error occurred while processing the registration. Please try again later.`,
        type: "error",
      });
    } finally {
      setFormIsSubmitting(false); // Stop submitting
    }
  };

  return (
    <PageTransition effect={registerApplicantPageEffect}>
      <section>
        <BackButton className="mb-3" />
        <HeaderBanner title={`Register Account`} className="mb-3" />

        <form className={``} onSubmit={handleFormSubmit}>
          {applicantFormSections?.map((section, sectionIndex) => {
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
              name="Register Account"
              processingName="Creating Account..."
              disabled={submitIsDisabled}
              isLoading={formIsSubmitting}
            />
          </div>
        </form>
      </section>
    </PageTransition>
  );
};

export default RegisterApplicantPage;
