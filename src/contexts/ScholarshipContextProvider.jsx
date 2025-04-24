// React modules
import { createContext, useState, useCallback, useContext } from "react";
import DOMPurify from "dompurify";

// API
import APIService from "@src/api/exportAPIService";

// Context
import { ConfigContext } from "@contexts/ConfigContextProvider";

// Components

// Assets

// ::::::::::::::::::::: DEFINE CONTEXTS
export const ScholarshipContext = createContext({
  scholarshipStatus: {},
  setScholarshipStatus: () => {},

  loadScholarships: () => {},
  getScholarship: () => {},
});

// ::::::::::::::::::::: PROVIDER

const ScholarshipContextProvider = ({ children }) => {
  const {
    SCHOLARSHIPS_API_REF,
    APPLICATIONS_API_REF,
    APPLICANTS_API_REF,
    getRequest,
  } = APIService;

  // ::::::::::::::::::::: CONTEXTS AND STATES

  const { setShowFlashMessage } = useContext(ConfigContext);
  const [scholarshipStatus, setScholarshipStatus] = useState({
    error: null,
    isLoading: false,
    scholarships: [],
    scholarshipsOnly: [],
    scholarship: {},
    scholarshipOnly: {},
  });

  // ::::::::::::::::::::: FETCH SCHOLARSHIPS
  const loadScholarships = useCallback(async () => {
    setScholarshipStatus((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    try {
      const scholarships = await getRequest(SCHOLARSHIPS_API_REF);
      const applications = await getRequest(APPLICATIONS_API_REF);

      if (!Array.isArray(scholarships)) {
        const errorMessage = "Scholarships data is invalid.";
        setScholarshipStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

      if (!Array.isArray(applications)) {
        const errorMessage = "Applications data is invalid.";
        setScholarshipStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

      const scholarshipsWithApplicationCount = scholarships?.map(
        (scholarship) => {
          const scholarshipApplications = applications?.filter(
            (application) => application?.scholarshipId === scholarship?.id
          );
          return {
            ...scholarship,
            applications: scholarshipApplications,
            numberOfApplications: scholarshipApplications?.length,
          };
        }
      );

      setScholarshipStatus((prevState) => ({
        ...prevState,
        scholarshipsOnly: scholarships,
        scholarships: scholarshipsWithApplicationCount,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage =
        error?.message ||
        "Failed to load scholarships. Please try again later.";
      setShowFlashMessage({
        isActive: true,
        message: errorMessage,
        type: "danger",
      });

      setScholarshipStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        error: errorMessage,
      }));
    }
    // eslint-disable-next-line
  }, []);

  // ::::::::::::::::::::: GET SCHOLARSHIP
  const getScholarship = useCallback(async (id) => {
    setScholarshipStatus((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    

    try {
      if (!id) {
        const errorMessage = "Scholarship ID is missing or invalid.";
        setScholarshipStatus((prevState) => ({
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

      setShowFlashMessage({
        isActive: false,
      });

      const scholarships = await getRequest(SCHOLARSHIPS_API_REF);
      const applications = await getRequest(APPLICATIONS_API_REF);
      const applicants = await getRequest(APPLICANTS_API_REF);

      const scholarship = scholarships?.find(
        (scholarship) =>
          scholarship?.id &&
          id &&
          String(scholarship?.id)?.toLowerCase() === String(id)?.toLowerCase()
      );

      if (scholarship) {
        // Get applications for this scholarship
        const scholarshipApplications = applications
          .filter(
            (application) =>
              application?.scholarshipId?.toLowerCase() ===
              scholarship.id?.toLowerCase()
          )
          .map((application) => {
            const applicant =
              applicants.find((app) => app.id === application.applicantId) ||
              null;

            return {
              ...application,
              applicant: applicant,
            };
          });

        setScholarshipStatus((prevState) => ({
          ...prevState,
          scholarships,
          scholarshipOnly: scholarship,
          scholarship: {
            ...scholarship,
            applications: scholarshipApplications,
            numberOfApplications: scholarshipApplications?.length,
            description: DOMPurify.sanitize(scholarship?.description),
            isDue: scholarship?.deadline
              ? new Date(scholarship?.deadline) <= new Date()
              : false,
          },
          isLoading: false,
          error: null,
        }));
      } else {
        const errorMessage = "Scholarship not found.";
        setScholarshipStatus((prevState) => ({
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
      const errorMessage = error?.message || "Scholarship not found.";
      setScholarshipStatus((prevState) => ({
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

  // ::::::::::::::::::::: CREATE SCHOLARSHIPS

  // ::::::::::::::::::::: CONTEXTS AND RETURN

  const context = {
    // Scholarship States
    scholarshipStatus,
    setScholarshipStatus,

    // Scholarship Api Handlers
    loadScholarships,
    getScholarship,
  };
  return (
    <ScholarshipContext.Provider value={context}>
      {children}
    </ScholarshipContext.Provider>
  );
};

export default ScholarshipContextProvider;
