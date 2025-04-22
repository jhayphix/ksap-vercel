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
    error: "",
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

      setExternalScholarshipStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        externalScholarships,
      }));
    } catch (error) {
      setShowFlashMessage({
        isActive: true,
        message: `Failed to fetch external scholarships:`,
        type: "danger",
      });
      setExternalScholarshipStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        error: `Failed to fetch external scholarships:`,
      }));
    }

    //eslint-disable-next-line
  }, []); // Empty array to ensure it's only created once

  // ::::::::::::::::::::: GET EXTERNAL SCHOLARSHIP
  const getExternalScholarship = useCallback(
    async (externalScholarshipsData, externalScholarshipId) => {
      if (
        !Array.isArray(externalScholarshipsData) ||
        externalScholarshipsData.length === 0 ||
        !externalScholarshipId
      ) {
        return;
      }

      setExternalScholarshipStatus((prevState) => ({
        ...prevState,
        isLoading: true,
      }));

      try {
        const foundExternalScholarship = externalScholarshipsData.find(
          (scholarship) => scholarship?.id === externalScholarshipId
        );

        setExternalScholarshipStatus((prevState) => ({
          ...prevState,
          isLoading: false,
        }));

        if (foundExternalScholarship) {
          setExternalScholarshipStatus((prevState) => ({
            ...prevState,
            externalScholarship: foundExternalScholarship,
          }));
        } else {
          setShowFlashMessage({
            isActive: true,
            message: `External scholarship not found!`,
            type: "danger",
          });
        }
      } catch (error) {
        setShowFlashMessage({
          isActive: true,
          message: `Error fetching external scholarship`,
          type: "danger",
        });
        setExternalScholarshipStatus((prevState) => ({
          ...prevState,
          isLoading: false,
        }));

        return null;
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
        DATABASE_TABLE_NAMES?.EXTERNAL_SCHOLARSHIPS_API_REF
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
