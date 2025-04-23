// React modules
import { createContext, useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";

// API
import APIService from "@src/api/exportAPIService";

// Context
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";

// Components

// Assets

// ::::::::::::::::::::: DEFINE CONTEXTS
export const ExternalScholarshipContext = createContext({
  externalScholarshipStatus: {},
  setExternalScholarshipStatus: () => {},

  loadExternalScholarships: () => {},
  getExternalScholarship: () => {},
});

// ::::::::::::::::::::: PROVIDER

const ExternalScholarshipContextProvider = ({ children }) => {
  const {
    EXTERNAL_SCHOLARSHIPS_API_REF,
    getRequest,
    deleteRequest,
    DATABASE_TABLE_NAMES,
  } =
    // ::::::::::::::::::::: CONTEXTS AND STATES

    APIService;

  const navigate = useNavigate();
  const { setShowFlashMessage, setShowModal } = useContext(ConfigContext);
  const { externalScholarshipsRoute } = useContext(NavigationContext);

  const [externalScholarshipStatus, setExternalScholarshipStatus] = useState({
    error: null,
    isLoading: false,
    externalScholarships: [],
    externalScholarship: {},
  });

  // ::::::::::::::::::::: FETCH SCHOLARSHIPS

  const loadExternalScholarships = useCallback(async () => {
    setExternalScholarshipStatus((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    try {
      const externalScholarships = await getRequest(
        EXTERNAL_SCHOLARSHIPS_API_REF
      );

      if (!Array.isArray(externalScholarships)) {
        const errorMessage = "External Scholarships data is invalid.";
        setExternalScholarshipStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

      setExternalScholarshipStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        externalScholarships,
        error: null,
      }));
    } catch (error) {
      const errorMessage =
        error?.message ||
        "Failed to fetch external scholarships: Please try again later.";

      setShowFlashMessage({
        isActive: true,
        message: errorMessage,
        type: "danger",
      });
      setExternalScholarshipStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        error: errorMessage,
      }));
    }

    //eslint-disable-next-line
  }, []); // Empty array to ensure it's only created once

  // ::::::::::::::::::::: GET EXTERNAL SCHOLARSHIP
  const getExternalScholarship = useCallback(
    async (externalScholarshipsData, externalScholarshipId) => {
      setExternalScholarshipStatus((prevState) => ({
        ...prevState,
        isLoading: true,
        error: null,
      }));

      if (!externalScholarshipId) {
        const errorMessage = "External Scholarship ID is missing or invalid.";
        setExternalScholarshipStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        return;
      }

      if (!Array.isArray(externalScholarshipsData)) {
        const errorMessage = "External Scholarships data is invalid.";
        setExternalScholarshipStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        return;
      }

      try {
        const foundExternalScholarship = externalScholarshipsData?.find(
          (scholarship) => scholarship?.id === externalScholarshipId
        );

        if (!foundExternalScholarship) {
          const errorMessage = `External scholarship not found!`;
          setExternalScholarshipStatus((prevState) => ({
            ...prevState,
            error: errorMessage,
            isLoading: false,
          }));
          setShowFlashMessage({
            isActive: true,
            message: errorMessage,
            type: "danger",
          });

          throw new Error(errorMessage);
        }

        setExternalScholarshipStatus((prevState) => ({
          ...prevState,
          externalScholarship: foundExternalScholarship,
          isLoading: false,
          error: null,
        }));
        setShowFlashMessage({
          isActive: false,
        });
      } catch (error) {
        const errorMessage = `Error fetching external scholarship`;
        setExternalScholarshipStatus((prevState) => ({
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
    },
    // eslint-disable-next-line
    []
  );
  

  // ::::::::::::::::::::: DELETE
  const showDeleteExternalScholarshipModal = (
    scholarshipId,
    scholarshipName
  ) => {
    setShowModal({
      isActive: true,
      title: `Delete External Scholarship - "${scholarshipName}"`,
      message: `Are you sure you want to delete External Scholarship - "${scholarshipName}"?`,
      action: () => deleteExternalScholarship(scholarshipId),
    });
  };
  const deleteExternalScholarship = async (scholarshipId) => {
    setShowModal({ isActive: false });

    try {
      const success = await deleteRequest(
        EXTERNAL_SCHOLARSHIPS_API_REF,
        scholarshipId,
        DATABASE_TABLE_NAMES?.EXTERNAL_SCHOLARSHIPS_TABLE_NAME
      );

      if (success) {
        setShowFlashMessage({
          isActive: true,
          message: "External Scholarship Deleted Successfully",
          type: "success",
        });
        navigate(externalScholarshipsRoute?.path);
        loadExternalScholarships();
      } else {
        setShowFlashMessage({
          isActive: true,
          message: "Failed to delete external scholarship.",
          type: "danger",
        });
      }
    } catch (error) {
      setShowFlashMessage({
        isActive: true,
        message: `Error deleting external scholarship. Please try again:`,
        type: "error",
      });
    }
  };

  // ::::::::::::::::::::: CONTEXTS AND RETURN

  const context = {
    // Scholarship States
    externalScholarshipStatus,
    setExternalScholarshipStatus,

    // Scholarship Api Handlers
    loadExternalScholarships,
    getExternalScholarship,
    deleteExternalScholarship,
    showDeleteExternalScholarshipModal,
  };
  return (
    <ExternalScholarshipContext.Provider value={context}>
      {children}
    </ExternalScholarshipContext.Provider>
  );
};

export default ExternalScholarshipContextProvider;
