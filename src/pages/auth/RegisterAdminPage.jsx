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

const RegisterAdminPage = () => {
  const { ADMINS_API_REF, postRequest } = APIService;
  const { registerAdminPageEffect, HELPER, setShowFlashMessage } =
    useContext(ConfigContext);
  const { dashboardRoute } = useContext(NavigationContext);
  const { authStatus } = useContext(AuthContext);

  const navigate = useNavigate();
  const thisFormKey = "registerAdminForm";
  const adminFormSections = exportDefaultData?.adminFormSections;

  // States
  const [adminFormData, setAdminFormData] = useState(
    HELPER?.getLocalStorage(thisFormKey) || {}
  );
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [submitIsDisabled, setSubmitIsDisabled] = useState(true);

  // Local storage store
  useEffect(() => {
    const storedData = HELPER?.getLocalStorage(thisFormKey) || {};
    setAdminFormData(storedData);
  }, [HELPER, thisFormKey]);

  const saveToLocalStorage = useMemo(
    () =>
      debounce((data) => {
        HELPER?.setLocalStorage(thisFormKey, data);
      }, 500),
    [HELPER, thisFormKey]
  );

  useEffect(() => {
    saveToLocalStorage(adminFormData);
  }, [adminFormData, saveToLocalStorage]);

  // Form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form Validation
  useEffect(() => {
    const updatedErrors = [];
    let formHasErrors = false;

    adminFormSections?.forEach((section) => {
      section?.sectionFields?.forEach((field) => {
        const thisFieldValue = adminFormData?.[field?.key];
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
  }, [adminFormData, adminFormSections, HELPER]);

  // Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormIsSubmitting(true); // Start submitting

    // Auto-generated fields
    const autoAdd = {
      externalId: uuidv4(),
      createdByAdminId: authStatus?.loggedInUserId,
      createdAt: HELPER?.getISODate(),
      updatedByAdminId: authStatus?.loggedInUserId,
      updatedAt: HELPER?.getISODate(),
      role: "Admin",
      accountStatus: "Active",
      deactivatedAt: null,
      deactivatedByAdminId: null,
    };

    const dateOfBirth = adminFormData?.dateOfBirth;

    const isSuperAdmin =
      adminFormData?.assignedRole?.toLowerCase() === "super admin";
    const isApprovalManager =
      adminFormData?.assignedRole?.toLowerCase() === "approval manager";
    const isReviewManager =
      adminFormData?.assignedRole?.toLowerCase() === "review manager";

    const fullName = `${adminFormData?.lastName?.toUpperCase()}, ${
      adminFormData?.firstName
    } ${adminFormData?.otherNames}`.trim();

    // Final data to save
    const dataToSave = {
      ...autoAdd,
      ...adminFormData,
      fullName,
      isSuperAdmin,
      isApprovalManager,
      isReviewManager,
      dateOfBirth: HELPER?.getISODate(dateOfBirth),
    };


    try {
      const response = await postRequest(ADMINS_API_REF, dataToSave);

      if (response) {
        setShowFlashMessage({
          isActive: true,
          message:
            "Registration successful. Admin have been successfully registered.",
          type: "success",
        });
        navigate(dashboardRoute?.path);

        // Reset local storage
        HELPER?.setLocalStorage(thisFormKey, {});
      } else {
        setShowFlashMessage({
          isActive: true,
          message:
            "Registration unsuccessful. Please verify the Admin details and try again.",
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
    <PageTransition effect={registerAdminPageEffect}>
      <section>
        <BackButton className="mb-3" />
        <HeaderBanner title={`Register Account`} className="mb-3" />

        <form className={``} onSubmit={handleFormSubmit}>
          {adminFormSections?.map((section, sectionIndex) => {
            return (
              <div key={sectionIndex}>
                <SectionHeaderCard title={section?.sectionName} />
                <FormContainerWrapper className="mb-5">
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xxl-3 g-3">
                    {section?.sectionFields?.map((field, fieldIndex) => {
                      const thisFieldValue = adminFormData?.[field?.key];
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
              name="Register Admin"
              processingName="Registering Account..."
              disabled={submitIsDisabled}
              isLoading={formIsSubmitting}
            />
          </div>
        </form>
      </section>
    </PageTransition>
  );
};

export default RegisterAdminPage;
