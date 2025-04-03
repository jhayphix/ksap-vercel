// React modules
import { createContext } from "react";

// Context

// Components

// Assets
import navigationRecords from "@data/navigationRecords";

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::::::::::::::::::::: CREATE CONTEXT
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
export const NavigationContext = createContext({
  navLinksByUserType: [],
  baseRoute: "",

  // General
  homeRoute: {},
  dashboardRoute: {},
  adminPanelRoute: {},

  // Auth
  authSelectionRoute: {},
  registerApplicantRoute: {},
  registerAdminRoute: {},
  updateApplicantRoute: {},
  updateAdminRoute: {},
  viewApplicantProfileRoute: {},
  viewAdminProfileRoute: {},
  manageUsersRoute: {},

  // Applications
  myApplicationsRoute: {},
  viewApplicationRoute: {},
  createApplicationRoute: {},
  updateApplicationRoute: {},
  evaluateApplicationRoute: {},
  searchApplicationRoute: {},

  // Scholarships
  viewScholarshipRoute: {},
  scholarshipApplicantsRoute: {},
  createScholarshipRoute: {},
  updateScholarshipRoute: {},
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::::::::::::::::::::: PROVIDER
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
const NavigationContextProvider = ({ children }) => {
  // --------------------- States

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // ::::::::::::::::::::: EXTRACT
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const navigationData = navigationRecords;
  const baseRoute = navigationData?.baseRoute;

  // General
  const homeRoute = navigationData?.homeRoute;
  const dashboardRoute = navigationData?.dashboardRoute;
  const adminPanelRoute = navigationData?.adminPanelRoute;

  // General
  const authSelectionRoute = navigationData?.authSelectionRoute;
  const registerApplicantRoute = navigationData?.registerApplicantRoute;
  const registerAdminRoute = navigationData?.registerAdminRoute;
  const updateApplicantRoute = navigationData?.updateApplicantRoute;
  const updateAdminRoute = navigationData?.updateAdminRoute;
  const viewApplicantProfileRoute = navigationData?.viewApplicantProfileRoute;
  const viewAdminProfileRoute = navigationData?.viewAdminProfileRoute;
  const manageUsersRoute = navigationData?.manageUsersRoute;

  // Applications
  const myApplicationsRoute = navigationData?.myApplicationsRoute;
  const viewApplicationRoute = navigationData?.viewApplicationRoute;
  const createApplicationRoute = navigationData?.createApplicationRoute;
  const updateApplicationRoute = navigationData?.updateApplicationRoute;
  const evaluateApplicationRoute = navigationData?.evaluateApplicationRoute;
  const searchApplicationRoute = navigationData?.searchApplicationRoute;

  // Scholarships
  const viewScholarshipRoute = navigationData?.viewScholarshipRoute;
  const scholarshipApplicantsRoute = navigationData?.scholarshipApplicantsRoute;
  const createScholarshipRoute = navigationData?.createScholarshipRoute;
  const updateScholarshipRoute = navigationData?.updateScholarshipRoute;

  const defaultNavRoutesOnTop = [dashboardRoute];
  const defaultNavRoutesOnBottom = [];
  const adminRoutesOnlyList = [
    adminPanelRoute,
    manageUsersRoute,
    searchApplicationRoute,
  ];
  const superAdminRoutesOnlyList = [
    adminPanelRoute,
    createScholarshipRoute,
    registerAdminRoute,
    manageUsersRoute,
    searchApplicationRoute,
  ];
  const applicantRoutesOnlyList = [myApplicationsRoute];
  const getNavRoutes = (routes) => {
    return [...defaultNavRoutesOnTop, ...routes, ...defaultNavRoutesOnBottom];
  };
  const navLinksByUserType = {
    default: [...defaultNavRoutesOnTop, ...defaultNavRoutesOnBottom],
    superAdminRoutesOnly: getNavRoutes(superAdminRoutesOnlyList),
    adminRoutesOnly: getNavRoutes(adminRoutesOnlyList),
    applicantRoutesOnly: getNavRoutes(applicantRoutesOnlyList),
  };

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // ::::::::::::::::::::: CONTEXT
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const context = {
    // Collection Links
    navLinksByUserType,
    baseRoute,

    // General
    homeRoute,
    dashboardRoute,
    adminPanelRoute,
    authSelectionRoute,
    registerApplicantRoute,
    registerAdminRoute,
    updateApplicantRoute,
    updateAdminRoute,
    viewApplicantProfileRoute,
    viewAdminProfileRoute,
    manageUsersRoute,

    // Custom Route

    // Applications
    myApplicationsRoute,
    viewApplicationRoute,
    createApplicationRoute,
    updateApplicationRoute,
    evaluateApplicationRoute,
    searchApplicationRoute,

    // Scholarships
    viewScholarshipRoute,
    scholarshipApplicantsRoute,
    createScholarshipRoute,
    updateScholarshipRoute,

    // Custom path
  };

  return (
    <NavigationContext.Provider value={context}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContextProvider;
