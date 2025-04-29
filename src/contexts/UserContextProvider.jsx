// React modules
import { createContext, useState, useCallback, useContext } from "react";
import { ConfigContext } from "@contexts/ConfigContextProvider";

// API
import APIService from "@src/api/exportAPIService";

// ::::::::::::::::::::: DEFINE CONTEXTS

export const UserContext = createContext({
  adminStatus: {},
  setAdminStatus: () => {},

  loadAdmins: () => {},
});

// ::::::::::::::::::::: PROVIDER

const UserContextProvider = ({ children }) => {
  const { ADMINS_API_REF, APPLICANTS_API_REF, getRequest } = APIService;
  const { setShowFlashMessage } = useContext(ConfigContext);

  const [adminStatus, setAdminStatus] = useState({
    error: null,
    isLoading: false,
    admins: [],
    adminsOnly: [],
    adminsFlattened: [],
    admin: {},
  });
  const [applicantStatus, setApplicantStatus] = useState({
    error: null,
    isLoading: false,
    applicants: [],
    applicantsFlattened: [],
    applicantsOnly: [],
    applicant: {},
  });

  const flattenObject = (obj) => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return { ...acc, ...value }; // Flatten object properties
      }
      return { ...acc, [key]: value };
    }, {});
  };

  // ::::::::::::::::::::: FETCH ADMINS
  const loadAdmins = useCallback(async () => {
    setAdminStatus((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    try {
      const adminsOnly = await getRequest(ADMINS_API_REF);
      console.log("adminsOnly: ", adminsOnly);

      if (!Array.isArray(adminsOnly)) {
        const errorMessage = "Admins data is invalid.";
        setAdminStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

      const adminsFlattened = Array.isArray(adminsOnly)
        ? adminsOnly
            ?.map((admin) =>
              admin
                ? {
                    ...flattenObject(admin),
                  }
                : null
            )
            .filter(Boolean) // Removes any null values
        : [];
      const admins = Array.isArray(adminsOnly)
        ? adminsOnly
            .map((admin) =>
              admin
                ? {
                    ...admin,
                  }
                : null
            )
            .filter(Boolean) // Removes any null values
        : [];

      setAdminStatus((prevState) => ({
        ...prevState,
        admins,
        adminsOnly,
        adminsFlattened,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage =
        error?.message || "Failed to load admins. Please try again later.";
      setShowFlashMessage({
        isActive: true,
        message: errorMessage,
        type: "danger",
      });

      setAdminStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        error: errorMessage,
      }));
    }

    // eslint-disable-next-line
  }, []);

  // ::::::::::::::::::::: GET APPLICANTS
  const getAdmin = useCallback(async (admins, adminId) => {
    // Clear any previous flash message and set loading state
    setAdminStatus((prevState) => ({
      ...prevState,
      error: null,
    }));

    // Reset any previous flash message
    setShowFlashMessage({
      isActive: false,
    });

    try {
      if (!adminId) {
        const errorMessage = "Admin Id is invalid.";
        setAdminStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

      if (!Array.isArray(admins)) {
        const errorMessage = "Admins data is invalid.";
        setAdminStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

      const admin =
        admins?.find(
          (admin) =>
            admin?.id &&
            adminId &&
            String(admin?.id)?.toLowerCase() === String(adminId)?.toLowerCase()
        ) || null;

      if (!admin) {
        const errorMessage = "Something went wrong! Admin not found.";
        setAdminStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

      setAdminStatus((prevState) => ({
        ...prevState,
        admin,
        error: null,
      }));
    } catch (error) {
      const errorMessage =
        error?.message || "Failed to fetch admin. Please try again later.";
      setShowFlashMessage({
        isActive: true,
        message: errorMessage,
        type: "danger",
      });

      setAdminStatus((prevState) => ({
        ...prevState,
        error: errorMessage,
      }));
    }

    //eslint-disable-next-line
  }, []);

  const getAdminReturn = useCallback((admins, adminId) => {
    try {
      if (!adminId || !admins) {
        return;
      }

      const admin =
        admins?.find(
          (admin) =>
            admin?.id &&
            adminId &&
            String(admin?.id)?.toLowerCase() === String(adminId)?.toLowerCase()
        ) || null;

      if (!admin) return {};

      return admin;
    } catch (error) {
      const errorMessage =
        error.message || "An error occurred while retrieving the admin!.";
      console.error(errorMessage);
    }

    //eslint-disable-next-line
  }, []);

  // ::::::::::::::::::::: FETCH APPLICANTS
  const loadApplicants = useCallback(async () => {
    setApplicantStatus((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    try {
      const applicantsOnly = await getRequest(APPLICANTS_API_REF);
      console.log("applicantsOnly:", applicantsOnly);

      if (!Array.isArray(applicantsOnly)) {
        const errorMessage = "Applicants data is invalid.";
        setApplicantStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

      const applicantsFlattened = Array.isArray(applicantsOnly)
        ? applicantsOnly
            .map((applicant) =>
              applicant
                ? {
                    ...flattenObject(applicant),
                  }
                : null
            )
            .filter(Boolean) // Removes any null values
        : [];

      const applicants = Array.isArray(applicantsOnly)
        ? applicantsOnly
            .map((applicant) =>
              applicant
                ? {
                    ...flattenObject(applicant),
                  }
                : null
            )
            .filter(Boolean) // Removes any null values
        : [];

      setApplicantStatus((prevState) => ({
        ...prevState,
        applicants: applicants,
        applicantsOnly: applicantsOnly,
        applicantsFlattened: applicantsFlattened,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error?.message || "Failed to load applicants. Please try again later.";
      setShowFlashMessage({
        isActive: true,
        message: errorMessage,
        type: "danger",
      });

      setApplicantStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        error: errorMessage,
      }));
    }

    // eslint-disable-next-line
  }, []);

  // ::::::::::::::::::::: GET APPLICANTS
  const getApplicant = useCallback(async (applicants, applicantId) => {
    // Clear any previous flash message and set loading state
    setApplicantStatus((prevState) => ({
      ...prevState,
      error: null,
    }));

    setShowFlashMessage({
      isActive: false,
    });

    try {
      if (!applicantId) {
        const errorMessage = "Applicant Id is invalid.";
        setApplicantStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

      if (!Array.isArray(applicants)) {
        const errorMessage = "Applicants data is invalid.";
        setApplicantStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

      const applicant =
        applicants?.find(
          (applicant) =>
            applicant?.id &&
            applicantId &&
            String(applicant?.id)?.toLowerCase() ===
              String(applicantId)?.toLowerCase()
        ) || null;

      if (!applicant) {
        const errorMessage = "Something went wrong! Applicant not found.";
        setApplicantStatus((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

      setApplicantStatus((prevState) => ({
        ...prevState,
        applicant,
        error: null,
      }));
    } catch (error) {
      const errorMessage =
        error?.message || "Failed to fetch applicant. Please try again later.";
      setShowFlashMessage({
        isActive: true,
        message: errorMessage,
        type: "danger",
      });

      setApplicantStatus((prevState) => ({
        ...prevState,
        getApplicantIsLoading: "Turn to false in catch...",
        error: errorMessage,
      }));
    }

    //eslint-disable-next-line
  }, []);

  // ::::::::::::::::::::: RETURN

  const context = {
    adminStatus,
    setAdminStatus,
    loadAdmins,
    getAdmin,
    getAdminReturn,

    applicantStatus,
    setApplicantStatus,
    loadApplicants,
    getApplicant,
  };
  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
