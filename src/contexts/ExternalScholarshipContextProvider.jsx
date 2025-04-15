// React modules
import { createContext, useState, useCallback, useContext } from "react";

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
  const { EXTERNAL_SCHOLARSHIPS_API_REF, getRequest } = APIService;
  // ::::::::::::::::::::: CONTEXTS AND STATES

  const { setShowFlashMessage } = useContext(ConfigContext);
  const [externalScholarshipStatus, setExternalScholarshipStatus] = useState({
    error: "",
    isLoading: false,
    externalScholarships: [],
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

  // ::::::::::::::::::::: CREATE SCHOLARSHIPS

  // ::::::::::::::::::::: CONTEXTS AND RETURN

  const context = {
    // Scholarship States
    externalScholarshipStatus,
    setExternalScholarshipStatus,

    // Scholarship Api Handlers
    loadExternalScholarships,
  };
  return (
    <ExternalScholarshipContext.Provider value={context}>
      {children}
    </ExternalScholarshipContext.Provider>
  );
};

export default ExternalScholarshipContextProvider;
