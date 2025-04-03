import { useContext, useEffect, useState, useRef } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { MdArrowBack, MdArrowForward, MdErrorOutline } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
// import { ScholarshipContext } from "@contexts/ScholarshipContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";

import HeaderBanner from "@components/headers/HeaderBanner";
import BackButton from "@components/buttons/BackButton";
import ApplicationFormSection from "@components/applicationForm/ApplicationFormSection";
import SwitchFormField from "@components/applicationForm/SwitchFormField";
import DefaultSpinner from "@components/spinners/DefaultSpinner";

// API
import APIService from "@src/api/exportAPIService";

const UpdateApplicationPage = () => {
  const { APPLICATIONS_API_REF, putRequest, DATABASE_TABLE_NAMES } = APIService;
  // ::::::::::::::::::::: CONTEXTS :::::::::::::::::::::
  const { myApplicationsPageEffect, HELPER, setShowFlashMessage } =
    useContext(ConfigContext);
  // const { getScholarship, scholarshipStatus } = useContext(ScholarshipContext);
  const { myApplicationsRoute, homeRoute } = useContext(NavigationContext);
  const {
    loadApplications,
    applicationStatus,
    getApplication,
    getExistingApplication,
  } = useContext(ApplicationContext);
  const { authStatus, combinedAuthStatus } = useContext(AuthContext);

  // Base Define
  const loggedInApplicantId = authStatus?.loggedInUserId;
  const userIsApplicantAndLoggedIn =
    combinedAuthStatus?.isUserApplicantAndLoggedIn;

  const navigate = useNavigate();

  // ::::::::::::::::::::: GET APPLICATION DATA :::::::::::::::::::::
  const pageParams = useParams();
  const applicationId = pageParams?.id;
  const [searchParams, setSearchParams] = useSearchParams();
  const thisSectionIndex = Number(searchParams.get("section") || 0);

  useEffect(() => {
    loadApplications();
    getApplication(applicationId);
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    loadApplications();

    //eslint-disable-next-line
  }, [thisSectionIndex]);

  useEffect(() => {
    getApplication(applicationId);

    //eslint-disable-next-line
  }, [applicationId, thisSectionIndex]);
  const applicationIsLoading = applicationStatus?.isLoading;
  const applicantApplication = applicationStatus?.application || {};
  const applicantApplicationOnly = applicationStatus?.applicationOnly || {};

  const applicationResponseSections =
    applicantApplication?.responseSections || [];
  const reducedResponseSection = applicationResponseSections.reduce(
    (acc, section) => {
      acc[section?.sectionId] = section?.responses?.length
        ? section.responses.reduce((responsesAcc, response) => {
            responsesAcc[response?.questionId] = { ...response };
            return responsesAcc;
          }, {})
        : {}; // Ensuring it doesn't return undefined
      return acc;
    },
    {}
  );

  const [updateLoading, setUpdateLoading] = useState(false);

  const scholarshipData = applicantApplication?.scholarship || {};
  const scholarshipId = scholarshipData?.id;

  const scholarshipApplicationSections =
    scholarshipData?.applicationSections || [];
  const totalApplicationSections = scholarshipApplicationSections?.length;
  const thisSection = scholarshipApplicationSections[thisSectionIndex] || null;
  const notOnLastSection = thisSectionIndex < totalApplicationSections - 1;
  const isOnLastSection = thisSectionIndex === totalApplicationSections - 1;

  useEffect(() => {
    let sectionIndex = Number(searchParams.get("section"));

    // If sectionIndex is not a valid number or greater than totalApplicationSections, reset to 0
    if (
      isNaN(sectionIndex) ||
      sectionIndex >= totalApplicationSections ||
      sectionIndex < 0
    ) {
      setSearchParams({ section: 0 });
    }
  }, [searchParams, totalApplicationSections, setSearchParams]);

  const [finalSubmit, setFinalSubmit] = useState(false); // Track submission

  const progressPercentage =
    ((thisSectionIndex + 1) / totalApplicationSections) * 100;

  // ::::::::::::::::::::: APPLICATION FORM DATA :::::::::::::::::::::
  // const thisPageFormKey = "updateApplicationSections";

  const [applicationFormData, setApplicationFormData] = useState(
    thisSection?.id ? reducedResponseSection[thisSection?.id] : {}
  );

  useEffect(() => {
    if (reducedResponseSection && thisSection?.id) {
      setApplicationFormData(reducedResponseSection[thisSection?.id]);
    }
    // eslint-disable-next-line
  }, [thisSection?.id, applicationResponseSections, thisSectionIndex]);

  // ::::::::::::::::::::: ERRORS AND STATUS :::::::::::::::::::::
  const [thisFormStatus, setThisFormStatus] = useState({
    isValid: false,
  });

  const [thisFormError, setThisFormError] = useState(() => {
    return HELPER?.getLocalStorage("updateApplicationFormErrors") || {};
  });
  useEffect(() => {
    HELPER?.setLocalStorage("updateApplicationFormErrors", thisFormError);

    // eslint-disable-next-line
  }, [thisFormError]);

  useEffect(() => {
    if (thisSection) {
      setThisFormStatus((prevState) => ({
        ...prevState,
        isValid: thisFormError[thisSection?.id]?.isValid || false,
      }));
    }
  }, [thisFormError, thisSection, thisSectionIndex]);

  // Load form errors
  const sectionRef = useRef(thisSection);
  const helperRef = useRef(HELPER);
  const formDataRef = useRef(applicationFormData);

  useEffect(() => {
    sectionRef.current = thisSection; // Update ref when thisSectionIndex changes
    formDataRef.current = applicationFormData; // Ensure latest form data is used

    if (sectionRef.current && formDataRef.current) {
      let updatedSectionErrors = {};

      sectionRef.current?.sectionQuestions?.forEach((question) => {
        const error = helperRef.current?.validateDynamicField(
          question,
          formDataRef.current[question?.id]?.response
        );
        updatedSectionErrors[question?.id] = error;
      });

      const thisSectionQuestions = sectionRef.current?.sectionQuestions
        ?.filter((q) => q.required || q.validation)
        ?.map((q) => q.id);

      const allErrors = thisSectionQuestions?.map(
        (qid) => updatedSectionErrors[qid]?.hasError
      );

      const isValid = allErrors.every((hasError) => hasError === false);

      setThisFormError((prevErrors) => ({
        ...prevErrors,
        [sectionRef.current?.id]: {
          ...updatedSectionErrors,
          isValid,
        },
      }));
    }
  }, [thisSectionIndex, thisSection, applicationFormData]); // Add dependencies

  // ::::::::::::::::::::: REDIRECT IF NOT COMPLETED :::::::::::::::::::::
  useEffect(() => {
    if (scholarshipApplicationSections?.length > 0) {
      // Find the first incomplete section
      const firstIncompleteIndex = scholarshipApplicationSections?.findIndex(
        (section) => !thisFormError[section.id]?.isValid
      );

      if (
        firstIncompleteIndex !== -1 &&
        thisSectionIndex > firstIncompleteIndex
      ) {
        setSearchParams({ section: firstIncompleteIndex });
        setShowFlashMessage({
          isActive: true,
          message: `Please you have to complete this section before you can proceed!`,
          type: "warning",
        });
      }
    }
    //eslint-disable-next-line
  }, [
    thisFormError,
    thisSectionIndex,
    setSearchParams,
    scholarshipApplicationSections,
  ]);

  // ::::::::::::::::::::: HANDLE FORM CHANGE :::::::::::::::::::::
  const handleFormChange = (section, question, questionIndex) => (event) => {
    let value;

    switch (question?.type) {
      case "checkbox":
        value = Array.isArray(applicationFormData[question?.id]?.response)
          ? event.target.checked
            ? [
                ...applicationFormData[question?.id]?.response,
                event.target.value,
              ]
            : applicationFormData[question?.id]?.response.filter(
                (item) => item !== event.target.value
              )
          : event.target.checked
          ? [event.target.value]
          : [];
        break;

      default:
        value = event.target.value;
    }

    setApplicationFormData((prev = {}) => {
      const updatedData = {
        ...prev,
        [question?.id]: {
          ...prev[question?.id], // Preserve existing properties
          id: prev[question?.id]?.id || uuidv4(),
          questionId: question?.id,
          type: question?.type,
          label: question?.label,
          order: questionIndex,
          response: value,
        },
      };

      // Convert object to array, sort by order, and convert back to object
      return Object.fromEntries(
        Object.entries(updatedData).sort(([, a], [, b]) => a.order - b.order)
      );
    });

    const error = HELPER?.validateDynamicField(question, value);
    setThisFormError((prevErrors) => {
      const updatedSectionErrors = {
        ...prevErrors[section?.id],
        [question?.id]: error,
      };

      // const thisSectionQuestions = section?.sectionQuestions?.map((q) => q.id);
      const thisSectionQuestions = section?.sectionQuestions
        ?.filter((q) => q.required || q.validation) // Keep questions that are required or have validation
        ?.map((q) => q.id); // Extract IDs
      const allErrors = thisSectionQuestions?.map(
        (qid) => updatedSectionErrors[qid]?.hasError
      );
      const isValid = allErrors.every((hasError) => hasError === false);

      return {
        ...prevErrors,
        [section?.id]: {
          ...updatedSectionErrors,
          isValid, // Correctly updated validity status
        },
      };
    });
  };

  const validateThisField = (question, value) => {
    if (applicationFormData) {
      return HELPER?.validateDynamicField(question, value);
    }
  };

  // ::::::::::::::::::::: SECTION ROUTING :::::::::::::::::::::

  const goToPreviousSection = () => {
    if (thisSectionIndex > 0) {
      setSearchParams({ section: thisSectionIndex - 1 });
    }
  };

  const goToNextSection = async () => {
    if (!thisFormStatus || !thisFormStatus?.isValid) {
      setShowFlashMessage({
        isActive: true,
        message: "Please fill out the form with valid input before continuing.",
        type: "warning",
      });
      return;
    }

    try {
      await updateApplicationController();
      if (notOnLastSection) {
        setSearchParams({ section: thisSectionIndex + 1 });
      }
    } catch (error) {
      setShowFlashMessage({
        isActive: true,
        message: `Application submission failed.`,
        type: "danger",
      });
    }
  };

  // ::::::::::::::::::::: UUPADATE APPLICATIONS :::::::::::::::::::::
  // Controller
  const updateApplicationController = async () => {
    if (userIsApplicantAndLoggedIn) {
      await submitUpdateApplication();
    } else {
      setShowFlashMessage({
        isActive: true,
        message:
          "You must be logged in as an applicant to update this application.",
        type: "danger",
      });
      navigate(homeRoute?.path, { replace: true });
    }
  };

  // On Create Application on Submit
  const submitUpdateApplication = async () => {
    const updatedSection = scholarshipApplicationSections
      ?.map((section) => ({
        id: uuidv4(),
        sectionId: section?.id,
        sectionTitle: section?.sectionTitle,
        responses: section?.sectionQuestions
          .map((question) => applicationFormData[question?.id])
          .filter(Boolean),
      }))
      ?.find((section) => section?.sectionId === thisSection?.id);

    // const responseSections = applicantApplication?.responseSections?.map(
    //   (section) =>
    //     section?.sectionId === updatedSection?.sectionId
    //       ? updatedSection
    //       : section
    // );

    // Ensure all scholarship sections exist in responseSections
    const responseSections = scholarshipApplicationSections.map((section) => {
      const existingSection = applicantApplication?.responseSections?.find(
        (s) => s.sectionId === section.id
      );

      return existingSection
        ? existingSection.sectionId === updatedSection?.sectionId
          ? updatedSection // Update existing section
          : existingSection
        : {
            id: uuidv4(),
            sectionId: section.id,
            sectionTitle: section.sectionTitle,
            responses: [], // Empty responses for new section
          };
    });

    const sectionWithCompleteResponse = responseSections?.filter(
      (section) => section?.responses?.length > 0
    );

    const completedSections = sectionWithCompleteResponse?.map(
      (section) => section.sectionId
    );

    const progress = {
      completedSections,
      lastCompletedSection:
        completedSections[completedSections.length - 1] || null,
      lastCompletedSectionIndex: completedSections.length - 1,
      percentage: (completedSections?.length / totalApplicationSections) * 100,
      isCompleted: completedSections.length === totalApplicationSections,
    };

    // const { scholarship, ...withOutScholarship } = applicantApplication;
    const applicationDataToSave = {
      ...applicantApplicationOnly,
      updatedAt: HELPER?.getISODate(new Date()),
      progress,
      responseSections: responseSections,
    };

    setUpdateLoading(true);

    try {
      const existingApplication = await getExistingApplication(
        loggedInApplicantId,
        scholarshipId
      );
      const response =
        existingApplication &&
        (await putRequest(
          APPLICATIONS_API_REF,
          existingApplication?.id,
          applicationDataToSave,
          DATABASE_TABLE_NAMES?.APPLICATIONS_TABLE_NAME
        ));

      if (response) {
        setShowFlashMessage({
          isActive: true,
          message: "Application saved successfully!",
          type: "success",
        });

        if (isOnLastSection) {
          setApplicationFormData([]);
          setThisFormError([]);
          setSearchParams({ section: 0 });
          setFinalSubmit(true);
        }
      } else {
        setFinalSubmit(false);
        setShowFlashMessage({
          isActive: true,
          message: "Failed to save scholarship application. Please try again.",
          type: "danger",
        });
      }
    } catch (error) {
      setFinalSubmit(false);
      setShowFlashMessage({
        isActive: true,
        message: `Error saving application. Please try again.`,
        type: "danger",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <PageTransition effect={myApplicationsPageEffect}>
      <section>
        <BackButton
          className="mb-3"
          btnRole="link"
          btnName="Scholarships"
          btnPath={myApplicationsRoute?.path}
        />
        <HeaderBanner
          title={`${scholarshipData?.name || ""} ${
            scholarshipData?.fundingType || "Scholarship"
          } Application`}
          className="mb-4"
        />
        {applicationIsLoading ? (
          <DefaultSpinner />
        ) : (
          <div className={`row centering g-0 mb-5`}>
            {updateLoading ? (
              <div className="col-lg-9 col-md-10 col-12">
                <DefaultSpinner />
              </div>
            ) : (
              <div className="col-lg-9 col-md-10 col-12">
                {finalSubmit ? (
                  // ::::::::::::::::::::: CONFIRMATION MESSAGE ::::::::::::::::::::::
                  <div className="text-center p-4 bg-light rounded shadow-sm">
                    <FaCheckCircle
                      className="text-success mb-3"
                      size={50}
                      // onClick={() => setFinalSubmit(false)} // Fix : Remove this
                    />
                    <h5 className="fw-bold mb-3">
                      Your application has been successfully submitted for
                      review.
                    </h5>
                    <p className="text-muted">
                      <Link
                        to={myApplicationsRoute?.path}
                        className="fw-bold text-primary"
                      >
                        Click here
                      </Link>{" "}
                      to track the progress of your application.
                    </p>
                  </div>
                ) : (
                  // ::::::::::::::::::::: FORM ::::::::::::::::::::::
                  <form id="uniqueCustomForm">
                    {thisSection && (
                      <div className="mb-3">
                        <ApplicationFormSection
                          section={thisSection}
                          className="mb-3"
                        />
                        <div className="row gy-3">
                          {thisSection?.sectionQuestions?.map(
                            (question, questionIndex) => {
                              if (!question) return null; // Ensure question exists before proceeding

                              const questionId = question?.id ?? ""; // Provide a fallback value
                              const questionType = question?.type ?? "";
                              const questionLabel =
                                question?.label ?? "No Label";
                              const questionDescription =
                                question?.description ?? "";
                              const isRequired = question?.required ?? false;
                              const response =
                                applicationFormData?.[questionId]?.response ??
                                ""; // Handle missing data safely

                              const thisField =
                                validateThisField(question, response) || {}; // Ensure thisField is always an object

                              return (
                                <div
                                  key={questionId}
                                  className={`${
                                    questionType === "textarea"
                                      ? "col-md-12"
                                      : "col-md-6"
                                  } col-12`}
                                >
                                  <div
                                    className={`h-100 bg_light px-3 py-3 rounded border border-1 ${
                                      thisField?.hasError
                                        ? "border-danger"
                                        : "border-success"
                                    }`}
                                  >
                                    <label>
                                      {questionLabel}
                                      {isRequired && (
                                        <span className="text_danger ms-2">
                                          *
                                        </span>
                                      )}
                                    </label>
                                    <p
                                      className="text-muted my-2"
                                      style={{ fontWeight: "400" }}
                                    >
                                      {questionDescription}
                                    </p>
                                    <SwitchFormField
                                      hasError={thisField?.hasError}
                                      question={question}
                                      questionIndex={questionIndex}
                                      handleFormChange={handleFormChange}
                                      applicationFormData={applicationFormData}
                                      thisSection={thisSection}
                                    />
                                    {thisField?.hasError && (
                                      <div
                                        className="text_danger mt-3"
                                        style={{ fontSize: "0.9rem" }}
                                      >
                                        <MdErrorOutline
                                          size={25}
                                          className="me-2"
                                        />
                                        {thisField?.errorMessage ??
                                          "Invalid input"}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons + Progress Bar */}
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      {/* Back Button */}
                      {thisSectionIndex > 0 && (
                        <button
                          type="button"
                          className="btn btn-light px-3 shadow-sm text_secondary"
                          onClick={goToPreviousSection}
                        >
                          <MdArrowBack className="me-2" />
                          Back
                        </button>
                      )}

                      {/* Progress Bar + Page Number */}
                      <div className="d-flex align-items-center flex-grow-1 justify-content-center">
                        <span className="text-muted me-3">
                          Page {thisSectionIndex + 1} of{" "}
                          {totalApplicationSections}
                        </span>
                        <div
                          className="progress"
                          style={{ width: "150px", height: "6px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width: `${progressPercentage}%`,
                              backgroundColor: "#007bff",
                            }}
                            aria-valuenow={progressPercentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          />
                        </div>
                      </div>

                      {/* Next / Submit Button */}
                      <button
                        className={`btn btn_secondary_2 ${
                          thisFormStatus?.isValid ? "" : "btn_disabled"
                        } px-3 shadow-sm`}
                        onClick={(e) => {
                          e.preventDefault();
                          goToNextSection();
                        }}
                      >
                        {isOnLastSection ? "Submit" : "Next"}
                        <MdArrowForward className="ms-2" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </PageTransition>
  );
};

export default UpdateApplicationPage;
