import { useContext, useEffect, useState } from "react";
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
import { ScholarshipContext } from "@contexts/ScholarshipContextProvider";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";

import HeaderBanner from "@components/headers/HeaderBanner";
import BackButton from "@components/buttons/BackButton";
import ApplicationFormSection from "@components/applicationForm/ApplicationFormSection";
import SwitchFormField from "@components/applicationForm/SwitchFormField";
import DefaultSpinner from "@components/spinners/DefaultSpinner";

// API
import APIService from "@src/api/exportAPIService";

const CreateApplicationPage = () => {
  const {
    APPLICATIONS_API_REF,
    postRequest,
    putRequest,
    DATABASE_TABLE_NAMES,
  } = APIService;
  // ::::::::::::::::::::: CONTEXTS :::::::::::::::::::::
  const { myApplicationsPageEffect, HELPER, setShowFlashMessage } =
    useContext(ConfigContext);
  const { getScholarship, scholarshipStatus } = useContext(ScholarshipContext);
  const { getExistingApplication } = useContext(ApplicationContext);
  const { myApplicationsRoute, homeRoute } = useContext(NavigationContext);
  const { authStatus, combinedAuthStatus } = useContext(AuthContext);

  // Basic Define
  const loggedInApplicantId = authStatus?.loggedInUserId;
  const userIsApplicantAndLoggedIn =
    combinedAuthStatus?.isUserApplicantAndLoggedIn;

  const navigate = useNavigate();

  // ::::::::::::::::::::: GET SCHOLARSHIP DATA :::::::::::::::::::::
  const pageParams = useParams();
  const scholarshipId = pageParams?.id;

  const [loading, setLoading] = useState(false); // Loading state
  useEffect(() => {
    if (scholarshipId) {
      getScholarship(scholarshipId);
    }
  }, [getScholarship, scholarshipId]);

  const scholarshipData = scholarshipStatus?.scholarship || {};

  const [searchParams, setSearchParams] = useSearchParams();

  const thisSectionIndex = Number(searchParams.get("section") || 0);

  const applicationSections = scholarshipData?.applicationSections || [];
  const totalApplicationSections = applicationSections?.length;
  const thisSection = applicationSections[thisSectionIndex] || null;
  const notOnLastSection = thisSectionIndex < totalApplicationSections - 1;
  const isOnLastSection = thisSectionIndex === totalApplicationSections - 1;

  const [finalSubmit, setFinalSubmit] = useState(false); // Track submission

  const progressPercentage =
    ((thisSectionIndex + 1) / totalApplicationSections) * 100;

  // ::::::::::::::::::::: APPLICATION FORM DATA :::::::::::::::::::::
  const thisPageFormKey = "createApplicationSections";

  const [applicationFormData, setApplicationFormData] = useState(
    HELPER?.getLocalStorage(thisPageFormKey) || []
  );

  useEffect(() => {
    const storedData = HELPER?.getLocalStorage(thisPageFormKey) || {};
    setApplicationFormData(storedData);
  }, [HELPER]);

  useEffect(() => {
    HELPER?.setLocalStorage(thisPageFormKey, applicationFormData);
  }, [applicationFormData, HELPER]);

  // ::::::::::::::::::::: ERRORS AND STATUS :::::::::::::::::::::
  const [thisFormStatus, setThisFormStatus] = useState({
    isValid: false,
  });
  const [thisFormError, setThisFormError] = useState(() => {
    return HELPER?.getLocalStorage("applicationFormErrors") || {};
  });
  useEffect(() => {
    HELPER?.setLocalStorage("applicationFormErrors", thisFormError);

    // eslint-disable-next-line
  }, [thisFormError]);

  useEffect(() => {
    if (thisSection) {
      setThisFormStatus((prevState) => ({
        ...prevState,
        isValid: thisFormError[thisSection?.id]?.isValid || false,
      }));
    }
  }, [thisFormError, thisSection]);

  // ::::::::::::::::::::: REDIRECT IF NOT COMPLETED :::::::::::::::::::::
  useEffect(() => {
    if (applicationSections?.length > 0) {
      // Find the first incomplete section
      const firstIncompleteIndex = applicationSections?.findIndex(
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
  }, [thisFormError, thisSectionIndex, setSearchParams, applicationSections]);

  // ::::::::::::::::::::: HANDLE FIELD CHANGE :::::::::::::::::::::
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

    setApplicationFormData((prev) => {
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
      await createApplicationController();
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

  // ::::::::::::::::::::: CREATE APPLICATIONS :::::::::::::::::::::
  // Controller
  const createApplicationController = async () => {
    if (userIsApplicantAndLoggedIn) {
      await submitCreateApplication();
    } else {
      setShowFlashMessage({
        isActive: true,
        message:
          "You must be logged in as an applicant to create an application.",
        type: "danger",
      });
      navigate(homeRoute?.path, { replace: true });
    }
  };

  // On Create Application on Submit
  const submitCreateApplication = async () => {
    const completedSections = applicationSections
      .filter((section) => thisFormError[section.id]?.isValid)
      .map((section) => section.id);

    const progress = {
      lastCompletedSection:
        completedSections[completedSections?.length - 1] || null,
      lastCompletedSectionIndex: completedSections?.length - 1,
      completedSections,
      percentage: (completedSections.length / totalApplicationSections) * 100,
      isCompleted: completedSections.length === totalApplicationSections,
    };

    const dataToSave = {
      externalId: uuidv4(),
      applicantId: loggedInApplicantId,
      reviewedByAdminId: null,
      approvedByAdminId: null,
      scholarshipId: scholarshipData?.id,
      isApproved: false,
      isPendingApproval: false,
      isDisapproved: false,
      isProcessed: false,
      isQualified: false,
      isPendingReview: false,
      isDisqualified: false,
      isReviewed: false,
      reviewComment: null,
      applicationScore: null,
      reviewedAcademicScore: null,
      applicationStatus: "Awaiting Review",
      reviewStatus: "Awaiting Review",
      approvalStatus: "Awaiting Approval",
      approvalComment: null,
      reviewedAt: null,
      approvedAt: null,
      appliedAt: HELPER?.getISODate(new Date()),
      updatedAt: HELPER?.getISODate(new Date()),
      progress,
      responseSections: applicationSections.map((section) => ({
        id: uuidv4(),
        sectionId: section.id,
        sectionTitle: section.sectionTitle,
        responses: section.sectionQuestions
          .map((question) => applicationFormData[question?.id])
          .filter(Boolean),
      })),
    };

    setLoading(true); // Start loading

    try {
      const existingApplication = await getExistingApplication(
        loggedInApplicantId,
        scholarshipId
      );

      let response;

      if (
        existingApplication &&
        !Array.isArray(existingApplication) &&
        existingApplication.id
      ) {
        response = await putRequest(
          APPLICATIONS_API_REF,
          existingApplication.id,
          dataToSave,
          DATABASE_TABLE_NAMES?.APPLICATIONS_TABLE_NAME
        );
      } else if (
        !existingApplication ||
        (Array.isArray(existingApplication) && existingApplication.length === 0)
      ) {
        response = await postRequest(APPLICATIONS_API_REF, dataToSave);
      }

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
      setLoading(false); // Stop loading
    }
  };

  // Return
  return (
    <PageTransition effect={myApplicationsPageEffect}>
      <section>
        <BackButton className="mb-3" />
        <HeaderBanner
          title={`${scholarshipData?.name || ""} ${
            scholarshipData?.fundingType || "Scholarship"
          } Application`}
          className="mb-4"
        />

        {loading === true ? (
          <DefaultSpinner />
        ) : (
          <div className={`row centering g-0 mb-5`}>
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
                    Your application has been successfully submitted for review.
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
                            const thisField = validateThisField(
                              question,
                              applicationFormData[question?.id]?.response || ""
                            );
                            return (
                              <div
                                key={question?.id}
                                className={`${
                                  question?.type === "textarea"
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
                                    {question?.label}
                                    <span className="text_danger ms-2">
                                      {question?.required && "*"}
                                    </span>
                                  </label>
                                  <p
                                    className="text-muted my-2"
                                    style={{ fontWeight: "400" }}
                                  >
                                    {question?.description}
                                  </p>
                                  <SwitchFormField
                                    hasError={thisField?.hasError}
                                    question={question}
                                    questionIndex={questionIndex}
                                    handleFormChange={handleFormChange}
                                    applicationFormData={applicationFormData}
                                    thisSection={thisSection}
                                  />
                                  <div
                                    className={`${
                                      thisField?.hasError
                                        ? "text_danger mt-3"
                                        : "d-none"
                                    }`}
                                    style={{ fontSize: "0.9rem" }}
                                  >
                                    <MdErrorOutline
                                      size={25}
                                      className="me-2"
                                    />
                                    {thisField?.errorMessage}
                                  </div>
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
          </div>
        )}
      </section>
    </PageTransition>
  );
};

export default CreateApplicationPage;
