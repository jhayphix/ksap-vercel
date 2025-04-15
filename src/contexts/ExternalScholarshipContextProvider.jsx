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
export const ExternalScholarshipContext = createContext({
  externalScholarshipStatus: {},
  setExternalScholarshipStatus: () => {},

  loadExternalScholarships: () => {},
});

// ::::::::::::::::::::: PROVIDER

const ExternalScholarshipContextProvider = ({ children }) => {
  const {
    SCHOLARSHIPS_API_REF,
    APPLICATIONS_API_REF,
    APPLICANTS_API_REF,
    getRequest,
  } = APIService;
  // ::::::::::::::::::::: CONTEXTS AND STATES

  const { setShowFlashMessage } = useContext(ConfigContext);
  const [externalScholarshipStatus, setExternalScholarshipStatus] = useState({
    error: "",
    isLoading: false,
    scholarships: [],
    scholarshipsOnly: [],
    scholarship: {},
    scholarshipOnly: {},
  });

  // ::::::::::::::::::::: FETCH SCHOLARSHIPS

  const loadExternalScholarships = useCallback(async () => {
    setExternalScholarshipStatus((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    try {
      const scholarships = await getRequest(SCHOLARSHIPS_API_REF);
      const applications = await getRequest(APPLICATIONS_API_REF);

      // Count applications for each scholarship
      const scholarshipsWithApplicationCount = scholarships?.map(
        (scholarship) => {
          const scholarshipApplications = applications.filter(
            (application) => application.scholarshipId === scholarship.id
          );
          return {
            ...scholarship,
            applications: scholarshipApplications,
            numberOfApplications: scholarshipApplications?.length, // Add application count
          };
        }
      );

      setExternalScholarshipStatus((prevState) => ({
        ...prevState,
        scholarshipsOnly: scholarships,
        scholarships: scholarshipsWithApplicationCount, // Include the modified scholarships
        isLoading: false,
      }));
    } catch (error) {
      setShowFlashMessage({
        isActive: true,
        message: `Failed to fetch scholarships:`,
        type: "danger",
      });
      setExternalScholarshipStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        error: `Failed to fetch scholarships:`,
      }));
    }

    //eslint-disable-next-line
  }, []); // Empty array to ensure it's only created once

  // ::::::::::::::::::::: GET SCHOLARSHIP
  const getScholarship = useCallback(async (id) => {
    setExternalScholarshipStatus((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    if (!id) {
      setShowFlashMessage({
        isActive: true,
        message: "Scholarship ID is missing or invalid",
        type: "danger",
      });
      return;
    }

    try {
      setShowFlashMessage({
        isActive: false,
        message: "",
        type: "",
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
              applicant: applicant
                ? {
                    ...applicant,
                    fullName:
                      (applicant?.lastName || "") +
                      " " +
                      (applicant?.firstName || "") +
                      " " +
                      (applicant?.otherNames || ""),
                  }
                : null,
            };
          });

        setExternalScholarshipStatus((prevState) => ({
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
        }));
      } else {
        setExternalScholarshipStatus((prevState) => ({
          ...prevState,
          isLoading: false,
          error: "Scholarship not found.",
        }));
        setShowFlashMessage({
          isActive: true,
          message: `Scholarship not found.`,
          type: "danger",
        });
      }
    } catch (error) {
      setExternalScholarshipStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        error: `Failed to fetch scholarship:`,
      }));
      setShowFlashMessage({
        isActive: true,
        message: `Failed to fetch scholarship:`,
        type: "danger",
      });
    }

    //eslint-disable-next-line
  }, []);

  // ::::::::::::::::::::: CREATE SCHOLARSHIPS

  // ::::::::::::::::::::: CONTEXTS AND RETURN

  const context = {
    // Scholarship States
    externalScholarshipStatus,
    setExternalScholarshipStatus,

    // Scholarship Api Handlers
    loadExternalScholarships,
    getScholarship,
  };
  return (
    <ExternalScholarshipContext.Provider value={context}>
      {children}
    </ExternalScholarshipContext.Provider>
  );
};

export default ExternalScholarshipContextProvider;
