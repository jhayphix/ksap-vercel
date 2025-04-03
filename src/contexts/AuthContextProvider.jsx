// React modules
import { createContext, useState, useEffect, useContext, useMemo } from "react";

import { auth } from "@src/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { ConfigContext } from "@contexts/ConfigContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";

import APIService from "@src/api/exportAPIService";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";

const provider = new GoogleAuthProvider();

// Define Context
export const AuthContext = createContext({
  authStatus: {},
  setAuthStatus: () => {},

  isUserApplicantAndLoggedIn: () => {},
  isUserAdminAndLoggedIn: () => {},
});

// ::::::::::::::::::::: PROVIDER

// Load initial state from localStorage
const defAuthStatus = {
  isUserLoggedIn: false,
  userDisplayName: null,
  loggedInUserId: null,

  isUserApplicant: false,
  isUserRegistered: false,

  isUserAdmin: false,
  isUserSuperAdmin: false,
  isUserApprovalManager: false,
  isUserReviewManager: false,
};

const thisStorageName = "AuthStatusStorage";

const AuthContextProvider = ({ children }) => {
  const {
    ADMINS_API_REF,
    APPLICANTS_API_REF,
    DATABASE_TABLE_NAMES,
    getRequest,
    putRequest,
  } = APIService;
  const { setShowFlashMessage, HELPER } = useContext(ConfigContext);
  const { authSelectionRoute, registerApplicantRoute, dashboardRoute } =
    useContext(NavigationContext);

  const navigate = useNavigate();

  // ---------------------------- States
  const [isLoggingInAsAdmin, setIsLoggingInAsAdmin] = useState(false);
  const [isLoggingInAsApplicant, setIsLoggingInAsApplicant] = useState(false);
  const [authUserInfo, setAuthUserInfo] = useState(null);

  const [authStatus, setAuthStatus] = useState(
    HELPER?.getLocalStorage(thisStorageName) || defAuthStatus
  );

  // Debounced save function
  const saveToLocalStorage = useMemo(() => {
    const debouncedSave = debounce((data) => {
      HELPER?.setLocalStorage(thisStorageName, data);
    }, 500);

    return debouncedSave;

    //eslint-disable-next-line
  }, []);

  // Save authStatus to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage(authStatus);

    return () => {
      saveToLocalStorage.cancel(); // Cleanup debounced function on unmount
    };

    //eslint-disable-next-line
  }, [authStatus]);

  // ::::::::::::::::::::: Extract
  const getCombinedAuthStatus = () => {
    const { isUserLoggedIn, isUserApplicant, isUserAdmin, isAuthUserOwner } =
      authStatus;

    return {
      isUserApplicantAndLoggedIn: isUserLoggedIn && isUserApplicant,
      isUserAdminAndLoggedIn: isUserLoggedIn && isUserAdmin,
      isAuthUserOwnerAndLoggedIn: isUserLoggedIn && isAuthUserOwner,
    };
  };

  const combinedAuthStatus = getCombinedAuthStatus();

  const isAuthUserOwner = (userId) =>
    userId === authStatus?.loggedInUserId || false;

  const userCheck = { isAuthUserOwner };

  // Handle Google Authentication
  // ::::::::::::::::::::: Handle Google Authentication
  const authenticateWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setAuthStatus((prev) => ({
        ...prev,
        isUserLoggedIn: true,
      }));

      setAuthUserInfo((prevState) => ({
        ...prevState,
        uid: user.uid,
        authDisplayName: user.displayName,
        authEmail: user.email,
        authPhotoURL: user.photoURL,
        authPhoneNumber: user.phoneNumber,
      }));

      setIsLoggingInAsAdmin(false);
      setIsLoggingInAsApplicant(false); // ✅ Reset only after success

      setShowFlashMessage({
        isActive: true,
        message: "Login successful! Welcome back!",
        type: "success",
      });

      navigate(dashboardRoute?.path); // Redirect to dashboard
    } catch (error) {
      console.error("Error during authentication:", error.message);

      setShowFlashMessage({
        isActive: true,
        message: "Authentication failed. Please try again.",
        type: "error",
      });

      navigate(authSelectionRoute?.path);
    }
  };

  // ::::::::::::::::::::: On Effect, assign role

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userInfoFromAuth = {
          uid: user.uid,
          authDisplayName: user.displayName,
          authEmail: user.email,
          authPhotoURL: user.photoURL,
          authPhoneNumber: user.phoneNumber,
        };

        setAuthUserInfo(userInfoFromAuth); // ✅ Persist the data after refresh
        // Wait to set authentication status until we confirm the role
        await loadUserRole(user.uid, user.email, userInfoFromAuth);
      } else {
        setAuthStatus(defAuthStatus);
      }
    });

    return () => unsubscribe();

    //eslint-disable-next-line
  }, [isLoggingInAsAdmin, isLoggingInAsApplicant]);

  // ::::::::::::::::::::: Load User Role (Admin or Applicant)
  const loadUserRole = async (uid, authEmail, userInfoFromAuth) => {
    if (isLoggingInAsAdmin) {
      await loadAdminRole(authEmail, userInfoFromAuth);
      return;
    }
    if (isLoggingInAsApplicant) {
      await loadApplicantRole(uid, userInfoFromAuth);
      return;
    }
  };

  // ::::::::::::::::::::: LOAD ADMIN ROLE
  const loadAdminRole = async (authEmail, userInfoFromAuth) => {
    try {
      const admins = await getRequest(ADMINS_API_REF);
      const matchedAdmin = admins.find(
        (admin) => admin.authEmail === authEmail
      );
      if (matchedAdmin) {
        const updatedAuthStatus = {
          ...authStatus,
          isUserLoggedIn: true,
          isUserAdmin: true,
          loggedInUserId: matchedAdmin.id,
          userDisplayName: matchedAdmin.fullName,
          isUserSuperAdmin: matchedAdmin.isSuperAdmin || false,
          isUserApprovalManager: matchedAdmin.isApprovalManager || false,
          isUserReviewManager: matchedAdmin.isReviewManager || false,
        };

        setAuthStatus(updatedAuthStatus);

        setAuthUserInfo((prevState) => ({
          ...prevState,
          ...userInfoFromAuth,
        }));

        await putRequest(
          ADMINS_API_REF,
          matchedAdmin?.id,
          { ...matchedAdmin, ...userInfoFromAuth },
          DATABASE_TABLE_NAMES?.ADMINS_TABLE_NAME
        );

        setShowFlashMessage({
          isActive: true,
          message: "Admin login successful!",
          type: "success",
        });

        navigate(dashboardRoute?.path);
        return;
      }

      // If admin role is not found, force sign out
      await auth.signOut();
      setAuthStatus(defAuthStatus);
      setShowFlashMessage({
        isActive: true,
        message: "Admin access not found. Please log in again.",
        type: "warning",
      });
      navigate(authSelectionRoute?.path);
    } catch (error) {
      console.error("Error loading user role:", error);
      setShowFlashMessage({
        isActive: true,
        message: "An error occurred while verifying user role.",
        type: "error",
      });
    }
  };
  

  // ::::::::::::::::::::: LOAD APPLICANT ROLE
  const loadApplicantRole = async (uid, userInfoFromAuth) => {
    try {
      const applicants = await getRequest(APPLICANTS_API_REF);
      const matchedApplicant = applicants.find(
        (applicant) => applicant.uid === uid
      );

      if (matchedApplicant) {
        setAuthStatus((prev) => ({
          ...prev,
          isUserLoggedIn: true,
          isUserApplicant: true,
          isUserRegistered: true,
          loggedInUserId: matchedApplicant.id,
          userDisplayName: matchedApplicant?.fullName,
        }));

        setAuthUserInfo((prevState) => ({
          ...prevState,
          userInfoFromAuth,
        }));

        setShowFlashMessage({
          isActive: true,
          message: "Applicant login successful!",
          type: "success",
        });

        navigate(dashboardRoute?.path);
        return;
      }

      // If neither admin nor applicant, reset state
      setAuthStatus((prev) => ({
        ...prev,
        isUserApplicant: true, // Corrected
        isUserRegistered: false,
      }));

      setShowFlashMessage({
        isActive: true,
        message: "You have to register to continue.",
        type: "warning",
      });

      navigate(registerApplicantRoute?.path);
    } catch (error) {
      console.error("Error loading applicant role:", error);
      setShowFlashMessage({
        isActive: true,
        message:
          "An error occurred while verifying applicant role. Please try again.",
        type: "error",
      });
    }
  };

  // ::::::::::::::::::::: Sign Out

  const handleSignOut = async () => {
    try {
      await auth.signOut(); // Sign out user from Firebase

      setAuthStatus(defAuthStatus); // Reset auth status
      setIsLoggingInAsAdmin(false);
      setIsLoggingInAsApplicant(false);
      setAuthUserInfo(null)

      // Wait briefly before navigating to allow state updates
      setTimeout(() => {
        setShowFlashMessage({
          isActive: true,
          message: "Sign out successful! See you next time!",
          type: "success",
        });
        navigate(dashboardRoute?.path, { replace: true });
      }, 100);
    } catch (error) {
      setShowFlashMessage({
        isActive: true,
        message: "Error during sign out. Please try again.",
        type: "error",
      });
    }
  };
  

  const context = {
    authStatus,
    setAuthStatus,
    authUserInfo,
    setAuthUserInfo,

    handleSignOut,
    authenticateWithGoogle,

    isLoggingInAsAdmin,
    setIsLoggingInAsAdmin,
    isLoggingInAsApplicant,
    setIsLoggingInAsApplicant,

    combinedAuthStatus,
    userCheck,
  };
  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
