// React modules
import { createContext, useState, useCallback, useContext } from "react";
import DOMPurify from "dompurify";
import { ConfigContext } from "@contexts/ConfigContextProvider";

import APIService from "@src/api/exportAPIService";

// ::::::::::::::::::::: DEFINE CONTEXTS

export const ApplicationContext = createContext({
  applicationStatus: {},
  setApplicationStatus: () => {},

  loadApplications: () => {},
  getApplication: () => {},
});

// ::::::::::::::::::::: PROVIDER

const ApplicationContextProvider = ({ children }) => {
  // ::::::::::::::::::::: CONTEXTS AND STATES
  const {
    SCHOLARSHIPS_API_REF,
    APPLICATIONS_API_REF,
    APPLICANTS_API_REF,
    getRequest,
  } = APIService;

  const { setShowFlashMessage } = useContext(ConfigContext);
  const [applicationStatus, setApplicationStatus] = useState({
    error: "",
    isLoading: false,
    applications: [],
    applicationsOnly: [],
    application: {},
    applicationOnly: {},
  });

  // ::::::::::::::::::::: FETCH APPLICATIONS

  // Memoize loadApplications function using useCallback
  const loadApplications = useCallback(async () => {
    setApplicationStatus((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    try {
      const scholarships = await getRequest(SCHOLARSHIPS_API_REF);
      const applications = await getRequest(APPLICATIONS_API_REF);
      const applicants = await getRequest(APPLICANTS_API_REF);

      // Map applications and attach the corresponding scholarship with isDue
      const enrichedApplications = applications?.map((app) => {
        const scholarship =
          scholarships?.find(
            (sch) =>
              String(sch?.id)?.toLowerCase() ===
              String(app?.scholarshipId)?.toLowerCase()
          ) || null;
        const applicant =
          applicants?.find(
            (thisApplicant) =>
              String(thisApplicant?.id)?.toLowerCase() ===
              String(app?.applicantId)?.toLowerCase()
          ) || null;

        return {
          ...app,
          applicant: {
            ...applicant,
            fullName:
              applicant?.lastName +
              " " +
              applicant?.firstName +
              " " +
              applicant?.otherNames,
          },
          scholarship: {
            ...scholarship,
            isDue: scholarship?.deadline
              ? new Date(scholarship?.deadline) <= new Date()
              : false, // Check if the deadline has passed
          },
        };
      });

      setApplicationStatus((prevState) => ({
        ...prevState,
        applicationsOnly: applications,
        applications: enrichedApplications,
        isLoading: false,
      }));
    } catch (error) {
      setApplicationStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        error: `Failed to fetch applications.`,
      }));
      setShowFlashMessage({
        isActive: true,
        message: `Error fetching applications:`,
        type: "danger",
      });
    }

    // eslint-disable-next-line
  }, []);

  // ::::::::::::::::::::: GET APPLICATION
  const getApplication = useCallback(async (id) => {
    // Clear any previous flash message and set loading state
    setApplicationStatus((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    // If ID is missing, show error flash message
    if (!id) {
      setShowFlashMessage({
        isActive: true,
        message: "Application ID is missing or invalid",
        type: "danger",
      });
      return;
    }

    try {
      // Reset any previous flash message
      setShowFlashMessage({
        isActive: false,
        message: "",
        type: "",
      });
      const scholarships = await getRequest(SCHOLARSHIPS_API_REF);
      const applications = await getRequest(APPLICATIONS_API_REF);
      const applicants = await getRequest(APPLICANTS_API_REF);

      const application =
        applications?.find(
          (application) =>
            application?.id &&
            id &&
            String(application?.id)?.toLowerCase() === String(id)?.toLowerCase()
        ) || null;

      if (application) {
        const scholarship =
          scholarships?.find(
            (scholarship) =>
              String(scholarship?.id)?.toLowerCase() ===
              String(application?.scholarshipId)?.toLowerCase()
          ) || null;
        const applicant =
          applicants?.find(
            (thisApplicant) =>
              String(thisApplicant?.id)?.toLowerCase() ===
              String(application?.applicantId)?.toLowerCase()
          ) || null;
        setApplicationStatus((prevState) => ({
          ...prevState,
          applicationOnly: application,
          application: {
            ...application,
            description: DOMPurify.sanitize(application?.description),
            applicant: {
              ...applicant,
              fullName:
                applicant?.lastName +
                " " +
                applicant?.firstName +
                " " +
                applicant?.otherNames,
            },
            scholarship: {
              ...scholarship,
              description: DOMPurify.sanitize(scholarship?.description),
              isDue: scholarship?.deadline
                ? new Date(scholarship?.deadline) <= new Date()
                : false, // Check if the deadline has passed
            },
          }, // Sanitize html
          isLoading: false,
        }));
      } else {
        setApplicationStatus((prevState) => ({
          ...prevState,
          isLoading: false,
          error: "Application not found.",
        }));
        setShowFlashMessage({
          isActive: true,
          message: "Application not found.",
          type: "danger",
        });
      }
    } catch (error) {
      setApplicationStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        error: `Failed to fetch application.`,
      }));
      setShowFlashMessage({
        isActive: true,
        message: `Failed to fetch application:`,
        type: "danger",
      });
    }

    //eslint-disable-next-line
  }, []);
  // ::::::::::::::::::::: GET APPLICATION

  const getExistingApplication = useCallback(
    async (applicantId, scholarshipId) => {
      try {
        const applications = await getRequest(APPLICATIONS_API_REF);

        const foundApplication = applications.find(
          (app) =>
            app.applicantId === applicantId &&
            app.scholarshipId === scholarshipId
        );

        return foundApplication;
      } catch (error) {
        setShowFlashMessage({
          isActive: true,
          message: `Error fetching applications`,
          type: "danger",
        });
        return null;
      }
    },
    //eslint-disable-next-line
    []
  );
  const getApplicantApplications = useCallback((applications, applicantId) => {
    try {
      // Validate inputs
      if (!Array.isArray(applications) || !applicantId) return [];

      // Filter applications
      const filteredApplicantApplications = applications.filter(
        (app) =>
          String(app.applicantId)?.toLowerCase() ===
          String(applicantId)?.toLowerCase()
      );

      return filteredApplicantApplications;
    } catch (error) {
      setShowFlashMessage({
        isActive: true,
        message: `Error fetching applicant applications: ${
          error.message || error
        }`,
        type: "danger",
      });
      return [];
    }
    //eslint-disable-next-line
  }, []);

  // ::::::::::::::::::::: CONTEXTS AND RETURN

  const context = {
    applicationStatus,
    setApplicationStatus,

    loadApplications,
    getApplication,
    getExistingApplication,
    getApplicantApplications,
  };
  return (
    <ApplicationContext.Provider value={context}>
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationContextProvider;
