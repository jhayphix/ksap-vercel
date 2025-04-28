// React Modules
import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Layout cand contexts
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { UserContext } from "@contexts/UserContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";

// Components
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

const UpdateAdminPage = () => {
  const { ADMINS_API_REF, putRequest, DATABASE_TABLE_NAMES } = APIService;
  const { updateAdminPageEffect, HELPER, setShowFlashMessage } =
    useContext(ConfigContext);
  const { viewAdminProfileRoute } = useContext(NavigationContext);
  const { adminStatus, getAdmin, loadAdmins } = useContext(UserContext);
  const { authStatus } = useContext(AuthContext);

  const navigate = useNavigate();
  const params = useParams();
  const adminId = params?.id;
  const adminFormSections = exportDefaultData?.adminFormSections;

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);
  const adminsOnlyData = adminStatus?.adminsFlattened;

  useEffect(() => {
    if (adminId && adminsOnlyData) {
      getAdmin(adminsOnlyData, adminId);
    }
  }, [adminId, getAdmin, adminsOnlyData]);
  const adminOnlyData = adminStatus?.admin;
  const adminIsLoading = adminStatus?.isLoading;
  const adminErrorMessage = adminStatus?.error;

  // States
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [submitIsDisabled, setSubmitIsDisabled] = useState(true);

  const [adminFormData, setAdminFormData] = useState(
    adminOnlyData ? adminOnlyData : {}
  );

  // Load
  useEffect(() => {
    if (adminOnlyData) {
      const dateOfBirth = HELPER?.formatToDateInput(adminOnlyData?.dateOfBirth);
      setAdminFormData({
        ...adminOnlyData,
        dateOfBirth: dateOfBirth,
      });
    }
  }, [adminOnlyData, HELPER]);

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
    const metaData = {
      updatedByAdminId: authStatus?.loggedInUserId,
      updatedAt: HELPER?.getISODate(),
      isSuperAdmin:
        adminFormData?.assignedRole?.toLowerCase() === "super admin",
      isApprovalManager:
        adminFormData?.assignedRole?.toLowerCase() === "approval manager",
      isReviewManager:
        adminFormData?.assignedRole?.toLowerCase() === "review manager",
      fullName: `${adminFormData?.lastName?.toUpperCase()}, ${
        adminFormData?.firstName
      } ${adminFormData?.otherNames}`.trim(),
    };

    const dateOfBirth = adminFormData?.dateOfBirth;
    const dataToSave = {
      ...adminOnlyData,
      ...adminFormData,
      ...metaData,
      dateOfBirth: HELPER?.getISODate(dateOfBirth),
    };

    try {
      const response = await putRequest(
        ADMINS_API_REF,
        adminId,
        dataToSave,
        DATABASE_TABLE_NAMES?.ADMINS_TABLE_NAME
      );

      if (response) {
        setShowFlashMessage({
          isActive: true,
          message:
            "Profile updated successfully. Your information has been successfully saved.",
          type: "success",
        });
        navigate(viewAdminProfileRoute?.getPath(adminId));
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
    <PageTransition effect={updateAdminPageEffect}>
      <section>
        <BackButton className="mb-3" />
        <HeaderBanner title={`Edit Admin Account`} className="mb-3" />

        {adminIsLoading ? (
          <DefaultSpinner />
        ) : adminErrorMessage ? (
          <div className="text-center centering fw-medium text-danger my-5">
            {adminErrorMessage}
          </div>
        ) : (
          <>
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
              <div className="mt-5 mb-4 text-center">
                <SubmitFormButton
                  name="Edit Account"
                  processingName="Updating Account..."
                  disabled={submitIsDisabled}
                  isLoading={formIsSubmitting}
                />
              </div>
            </form>
          </>
        )}
      </section>
    </PageTransition>
  );
};

export default UpdateAdminPage;
