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

// Assets
import exportDefaultData from "@data/default/exportDefaultData";

// API
import APIService from "@src/api/exportAPIService";

const UpdateExternalScholarshipPage = () => {
  const { EXTERNAL_SCHOLARSHIPS_API_REF, putRequest, DATABASE_TABLE_NAMES } =
    APIService;
  const { updateExternalScholarshipPageEffect, HELPER, setShowFlashMessage } =
    useContext(ConfigContext);
  const { viewExternalScholarshipRoute } = useContext(NavigationContext);
  const {
    externalScholarshipStatus,
    getExternalScholarship,
    loadExternalScholarships,
  } = useContext(UserContext);
  const { authStatus } = useContext(AuthContext);

  const navigate = useNavigate();
  const params = useParams();
  const externalScholarshipId = params?.id;
  const externalScholarshipFormSections =
    exportDefaultData?.externalScholarshipFormFields;

  useEffect(() => {
    loadExternalScholarships();
  }, [loadExternalScholarships]);
  const externalScholarshipsData =
    externalScholarshipStatus?.externalScholarships;

  useEffect(() => {
    if (externalScholarshipId) {
      getExternalScholarship(externalScholarshipsData, externalScholarshipId);
    }
  }, [externalScholarshipId, getExternalScholarship, externalScholarshipsData]);
  const externalScholarshipData =
    externalScholarshipStatus?.externalScholarship;

  // States
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [submitIsDisabled, setSubmitIsDisabled] = useState(true);

  const [externalScholarshipFormData, setExternalScholarshipFormData] =
    useState(externalScholarshipData ? externalScholarshipData : {});

  // Load
  useEffect(() => {
    if (externalScholarshipData) {
      const deadline = HELPER?.formatToDateInput(
        externalScholarshipData?.deadline
      );
      setExternalScholarshipFormData({
        ...externalScholarshipData,
        deadline: deadline,
      });
    }
  }, [externalScholarshipData, HELPER]);

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
    const metaData = {
      lastUpdatedByAdminId: authStatus?.loggedInUserId,
      lastUpdatedAt: HELPER?.getISODate(),
    };

    const deadline = externalScholarshipFormData?.dealine;
    const scholarshipName = externalScholarshipFormData?.name;
    const dataToSave = {
      ...externalScholarshipData,
      ...externalScholarshipFormData,
      ...metaData,
      deadline: HELPER?.getISODate(deadline),
    };

    try {
      const response = await putRequest(
        EXTERNAL_SCHOLARSHIPS_API_REF,
        externalScholarshipId,
        dataToSave,
        DATABASE_TABLE_NAMES?.EXTERNAL_SCHOLARSHIPS_TABLE_NAME
      );

      if (response) {
        setShowFlashMessage({
          isActive: true,
          message: `External Scholarship ${
            " - " + scholarshipName
          } updated successfully!`,
          type: "success",
        });
        navigate(viewExternalScholarshipRoute?.getPath(externalScholarshipId));
      } else {
        setShowFlashMessage({
          isActive: true,
          message: `Failed to update external scholarship.`,
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
    <PageTransition effect={updateExternalScholarshipPageEffect}>
      <section>
        <BackButton className="mb-3" />
        <HeaderBanner title={`Edit Account`} className="mb-3" />

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

export default UpdateExternalScholarshipPage;
