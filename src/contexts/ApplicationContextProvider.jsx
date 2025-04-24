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

      if (!Array.isArray(scholarships)) {
        const errorMessage = "Scholarships data is invalid.";
        setApplicationStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }
      if (!Array.isArray(applicants)) {
        const errorMessage = "Applicants data is invalid.";
        setApplicationStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

      if (!Array.isArray(applications)) {
        const errorMessage = "Applications data is invalid.";
        setApplicationStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

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
          applicant: applicant,
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
      const errorMessage = error?.message || "Failed to fetch applications.";
      setApplicationStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        error: errorMessage,
      }));
      setShowFlashMessage({
        isActive: true,
        message: errorMessage,
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

    // Reset any previous flash message
    setShowFlashMessage({
      isActive: false,
    });

    try {
      if (!id) {
        const errorMessage = "Application ID is missing or invalid.";
        setApplicationStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        setShowFlashMessage({
          isActive: true,
          message: errorMessage,
          type: "danger",
        });
        throw new Error(errorMessage);
      }

      const scholarships = await getRequest(SCHOLARSHIPS_API_REF);
      const applications = await getRequest(APPLICATIONS_API_REF);
      const applicants = await getRequest(APPLICANTS_API_REF);

      if (!Array.isArray(scholarships)) {
        const errorMessage = "Scholarships data is invalid.";
        setApplicationStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }
      if (!Array.isArray(applicants)) {
        const errorMessage = "Applicants data is invalid.";
        setApplicationStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

      if (!Array.isArray(applications)) {
        const errorMessage = "Applications data is invalid.";
        setApplicationStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

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
            applicant: applicant,
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
        const errorMessage = "Application not found.";
        setApplicationStatus((prevState) => ({
          ...prevState,
          isLoading: false,
          error: errorMessage,
        }));
        setShowFlashMessage({
          isActive: true,
          message: errorMessage,
          type: "danger",
        });
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error?.message || "Failed to fetch application.";
      setApplicationStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        error: errorMessage,
      }));
      setShowFlashMessage({
        isActive: true,
        message: errorMessage,
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
