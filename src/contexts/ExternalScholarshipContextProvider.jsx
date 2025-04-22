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
  getExternalScholarship: () => {},
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
    //eslint-disable-next-line
    []
  );

  // ::::::::::::::::::::: CONTEXTS AND RETURN

  const context = {
    // Scholarship States
    externalScholarshipStatus,
    setExternalScholarshipStatus,

    // Scholarship Api Handlers
    loadExternalScholarships,
    getExternalScholarship,
  };
  return (
    <ExternalScholarshipContext.Provider value={context}>
      {children}
    </ExternalScholarshipContext.Provider>
  );
};

export default ExternalScholarshipContextProvider;
