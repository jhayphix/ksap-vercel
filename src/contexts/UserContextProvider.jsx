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
    error: "",
    isLoading: false,
    admins: [],
    adminsOnly: [],
    adminsFlattened: [],
    admin: {},
  });
  const [applicantStatus, setApplicantStatus] = useState({
    error: "",
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
      const adminsFlattened = Array.isArray(adminsOnly)
        ? adminsOnly
            .map((admin) =>
              admin
                ? {
                    ...flattenObject(admin),
                    fullName: `${admin?.lastName} ${admin?.firstName} ${
                      admin?.otherNames || ""
                    }`.trim(),
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
                    fullName: `${admin?.lastName} ${admin?.firstName} ${
                      admin?.otherNames || ""
                    }`.trim(),
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
      }));
    } catch (error) {
      setAdminStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        error: "Failed to fetch admins.",
      }));
      setShowFlashMessage({
        isActive: true,
        message: `Error fetching admins:`,
        type: "error",
      });
    }

    // eslint-disable-next-line
  }, []);

  // ::::::::::::::::::::: GET APPLICANTS
  const getAdmin = useCallback(async (admins, adminId) => {
    // Clear any previous flash message and set loading state
    setAdminStatus((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    // If ID is missing, show error flash message
    if (!adminId || !admins) {
      setShowFlashMessage({
        isActive: true,
        message: "Admin ID or Admins are missing or invalid",
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

      const admin =
        admins?.find(
          (admin) =>
            admin?.id &&
            adminId &&
            String(admin?.id)?.toLowerCase() === String(adminId)?.toLowerCase()
        ) || null;

      if (admin) {
        setAdminStatus((prevState) => ({
          ...prevState,
          admin,
          isLoading: false,
        }));
      } else {
        setAdminStatus((prevState) => ({
          ...prevState,
          isLoading: false,
          error: "Something went wrong! Admin not found.",
        }));
        setShowFlashMessage({
          isActive: true,
          message: "Something went wrong! Admin not found.",
          type: "danger",
        });
      }
    } catch (error) {
      setAdminStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        error: `Failed to fetch admin.`,
      }));
      setShowFlashMessage({
        isActive: true,
        message: `Failed to fetch admin:`,
        type: "danger",
      });
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

      if (admin) {
        return admin;
      } else {
        console.error("Admin not found!")
        return {};
      }
    } catch (error) {
      console.error("An error occurred while retrieving the admin!")
      return {};
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
      setApplicantStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        error: "Failed to fetch applicants.",
      }));
      setShowFlashMessage({
        isActive: true,
        message: `Error fetching applicants:`,
        type: "error",
      });
    }

    // eslint-disable-next-line
  }, []);

  // ::::::::::::::::::::: GET APPLICANTS
  const getApplicant = useCallback(async (applicants, applicantId) => {
    // Clear any previous flash message and set loading state
    setApplicantStatus((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    // If ID is missing, show error flash message
    if (!applicantId || !applicants) {
      setShowFlashMessage({
        isActive: true,
        message: "Applicant ID or Applicants are missing or invalid",
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

      const applicant =
        applicants?.find(
          (applicant) =>
            applicant?.id &&
            applicantId &&
            String(applicant?.id)?.toLowerCase() ===
              String(applicantId)?.toLowerCase()
        ) || null;

      if (applicant) {
        setApplicantStatus((prevState) => ({
          ...prevState,
          applicant,
          isLoading: false,
        }));
      } else {
        setApplicantStatus((prevState) => ({
          ...prevState,
          isLoading: false,
          error: "Something went wrong! Applicant not found.",
        }));
        setShowFlashMessage({
          isActive: true,
          message: "Something went wrong! Applicant not found.",
          type: "danger",
        });
      }
    } catch (error) {
      setApplicantStatus((prevState) => ({
        ...prevState,
        isLoading: false,
        error: `Failed to fetch applicant.`,
      }));
      setShowFlashMessage({
        isActive: true,
        message: `Failed to fetch applicant:`,
        type: "danger",
      });
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
