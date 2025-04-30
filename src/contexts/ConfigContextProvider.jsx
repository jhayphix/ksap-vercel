// React modules
import { createContext, useState } from "react";

// Context

// Components

// Assets
import HELPER from "@src/helper/HELPER";

// ::::::::::::::::::::: DEFINE CONTEXTS

export const ConfigContext = createContext({
  HELPER: {},

  // ---------------------------- States
  showFlashMessage: {},
  setShowFlashMessage: () => {},
  showModal: {},
  setShowModal: () => {},

  // ---------------------------- Functions

  // ---------------------------- Constants
  transitionDuration: "",
  flash_message_effect: "",
  // General
  dashboardPageEffect: "",
  adminPanelPageEffect: "",

  authSelectionPageEffect: "",
  registerApplicantPageEffect: "",
  registerAdminPageEffect: "",
  updateApplicantPageEffect: "",
  updateAdminPageEffect: "",
  viewApplicantProfilePageEffect: "",
  viewAdminProfilePageEffect: "",
  manageUsersPageEffect: "",

  // Applications
  myApplicationsPageEffect: "",
  viewApplicationPageEffect: "",
  createApplicationPageEffect: "",
  updateApplicationPageEffect: "",
  evaluateApplicationPageEffect: "",
  searchApplicationPageEffect: "",

  // Scholarships
  viewScholarshipPageEffect: "",
  scholarshipApplicantsPageEffect: "",
  createScholarshipPageEffect: "",
  updateScholarshipPageEffect: "",

  // Scholarships
  externalScholarshipsPageEffect: "",
  viewExternalScholarshipsPageEffect: "",
  createExternalScholarshipPageEffect: "",
  updateExternalScholarshipPageEffect: "",
});

// ::::::::::::::::::::: PROVIDER

const ConfigContextProvider = ({ children }) => {
  // ---------------------------- States
  const [showFlashMessage, setShowFlashMessage] = useState({
    isActive: false,
    message: "Flash Message",
    type: "secondary",
  });
  const [showModal, setShowModal] = useState({
    isActive: false,
    title: "Modal Title",
    message: "Modal Message",
    action: () => {},
  });

  /* Effects of motion 
  top, bottom, left, right, fade, flip, scale, rotate, slide-fade
  */
  const transitionDuration = 0.6;
  const flash_message_effect = "top";

  // General
  const dashboardPageEffect = "flip";
  const adminPanelPageEffect = "right";

  // Auth
  const authSelectionPageEffect = "flip";
  const registerApplicantPageEffect = "right";
  const registerAdminPageEffect = "right";
  const updateApplicantPageEffect = "bottom";
  const updateAdminPageEffect = "bottom";
  const viewApplicantProfilePageEffect = "bottom";
  const viewAdminProfilePageEffect = "right";
  const manageUsersPageEffect = "bottom";

  // Applications
  const myApplicationsPageEffect = "top";
  const viewApplicationPageEffect = "bottom";
  const createApplicationPageEffect = "right";
  const updateApplicationPageEffect = "left";
  const evaluateApplicationPageEffect = "fade";
  const searchApplicationPageEffect = "flip";

  // Scholarships
  const viewScholarshipPageEffect = "right";
  const scholarshipApplicantsPageEffect = "bottom";
  const createScholarshipPageEffect = "right";
  const updateScholarshipPageEffect = "left";

  // External Scholarships
  const externalScholarshipsPageEffect = "bottom";
  const viewExternalScholarshipsPageEffect = "flip";
  const createExternalScholarshipPageEffect = "right";
  const updateExternalScholarshipPageEffect = "left";

  // ::::::::::::::::::::: CONTEXT

  const context = {
    HELPER,

    // ---------------------------- States
    showFlashMessage,
    setShowFlashMessage,
    showModal,
    setShowModal,

    // ---------------------------- Functions

    // ---------------------------- Constants
    transitionDuration,
    flash_message_effect,
    // General
    dashboardPageEffect,
    adminPanelPageEffect,

    // Auth
    authSelectionPageEffect,
    registerApplicantPageEffect,
    registerAdminPageEffect,
    updateApplicantPageEffect,
    updateAdminPageEffect,
    viewApplicantProfilePageEffect,
    viewAdminProfilePageEffect,
    manageUsersPageEffect,

    // Applications
    myApplicationsPageEffect,
    viewApplicationPageEffect,
    createApplicationPageEffect,
    updateApplicationPageEffect,
    evaluateApplicationPageEffect,
    searchApplicationPageEffect,

    // Scholarships
    viewScholarshipPageEffect,
    scholarshipApplicantsPageEffect,
    createScholarshipPageEffect,
    updateScholarshipPageEffect,

    // External Scholarships
    externalScholarshipsPageEffect,
    createExternalScholarshipPageEffect,
    updateExternalScholarshipPageEffect,
    viewExternalScholarshipsPageEffect,
  };

  // ::::::::::::::::::::: RETURN

  return (
    <ConfigContext.Provider value={context}>{children}</ConfigContext.Provider>
  );
};

export default ConfigContextProvider;
