// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// This page contains routes
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
import {
  FaHome,
  FaClipboardList,
  FaSearch,
  FaUserEdit,
  FaPlusCircle,
  FaClipboardCheck,
  FaUsers,
  FaRegBookmark,
  FaUserPlus,
  FaUser,
  FaUsersCog,
} from "react-icons/fa";
import { MdLogin } from "react-icons/md";

import {
  BsPencil,
  BsGrid,
  BsBoxArrowUpRight,
  BsGlobeAmericas,
} from "react-icons/bs";

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Base Declarations
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
const baseRoute = "";
const iconSize = 20; // Define icon size

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Navigation Records
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
const navigationRecords = {
  baseRoute: baseRoute,

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // General
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  homeRoute: {
    title: "Home",
    path: `${baseRoute}/`,
    icon: <FaHome size={iconSize} />,
    end: true,
  },
  dashboardRoute: {
    title: "Scholarships",
    path: `${baseRoute}/dashboard`,
    icon: <BsGrid size={iconSize} />,
    end: true,
  },
  adminPanelRoute: {
    title: "Admin Panel",
    path: `${baseRoute}/admin-panel`,
    icon: <FaUsers size={iconSize} />,
    end: true,
  },

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // AUTHENTICATION
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  authSelectionRoute: {
    title: "Login",
    path: `${baseRoute}/user/auth-selection`,
    icon: <MdLogin size={iconSize} />,
    end: false,
  },
  registerApplicantRoute: {
    title: "Register",
    path: `${baseRoute}/applicant/register`,
    icon: <FaUserPlus size={iconSize} />,
    end: false,
  },
  registerAdminRoute: {
    title: "Register Admin",
    path: `${baseRoute}/admin/register`,
    icon: <FaUserPlus size={iconSize} />,
    end: false,
  },
  updateApplicantRoute: {
    title: "Update Profile",
    path: `${baseRoute}/applicant/:applicantId/update`,
    getPath: (applicantId) => {
      return `${baseRoute}/applicant/${applicantId}/update`;
    },
    icon: <FaUserPlus size={iconSize} />,
    end: false,
  },
  updateAdminRoute: {
    title: "Update Profile (Admin)",
    path: `${baseRoute}/admin/:adminId/update`,
    getPath: (adminId) => {
      return `${baseRoute}/admin/${adminId}/update`;
    },
    icon: <FaUserPlus size={iconSize} />,
    end: false,
  },
  viewAdminProfileRoute: {
    title: "Admin Profile",
    path: `${baseRoute}/admin/profile/:adminId`,
    getPath: (adminId) => {
      return `${baseRoute}/admin/profile/${adminId}`;
    },
    icon: <FaUser size={iconSize} />,
    end: false,
  },

  viewApplicantProfileRoute: {
    title: "Applicant Profile",
    path: `${baseRoute}/applicant/profile/:applicantId`,
    getPath: (applicantId) => {
      return `${baseRoute}/applicant/profile/${applicantId}`;
    },
    icon: <FaUser size={iconSize} />,
    end: false,
  },
  manageUsersRoute: {
    title: "Manage Users",
    path: `${baseRoute}/manage/users`,
    icon: <FaUsersCog size={iconSize} />,
    end: false,
  },

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // Applications
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  myApplicationsRoute: {
    title: "My Applications",
    path: `${baseRoute}/my-applications`,
    icon: <FaClipboardList size={iconSize} />,
    end: false,
  },
  viewApplicationRoute: {
    title: "Preview Application",
    path: `${baseRoute}/applications/:id`,
    getPath: (id) => {
      return `${baseRoute}/applications/${id}`;
    },
    icon: <FaClipboardCheck size={iconSize} />,
    end: false,
  },
  createApplicationRoute: {
    title: "Create Application",
    path: `${baseRoute}/applications/:id/create`, // Scholarship id
    getPath: (scholarshipId) => {
      return `${baseRoute}/applications/${scholarshipId}/create`;
    },
    icon: <FaPlusCircle size={iconSize} />,
    end: false,
  },

  updateApplicationRoute: {
    title: "Edit Application",
    path: `${baseRoute}/applications/:id/edit`,
    getPath: (applicationId, sectionIndex = 0) => {
      return `${baseRoute}/applications/${applicationId}/edit?section=${sectionIndex}`;
    },
    icon: <BsPencil size={iconSize} />,
    end: false,
  },
  evaluateApplicationRoute: {
    title: "Evaluate Application",
    path: `${baseRoute}/applications/:id/evaluate`,
    getPath: (id) => {
      return `${baseRoute}/applications/${id}/evaluate`;
    },
    icon: <FaUserEdit size={iconSize} />,
    end: false,
  },
  searchApplicationRoute: {
    title: "Search & Filter",
    path: `${baseRoute}/search-and-filter`,
    icon: <FaSearch size={iconSize} />,
    end: false,
  },

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // Scholarships
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  viewScholarshipRoute: {
    title: "Preview Scholarship",
    path: `${baseRoute}/scholarships/:id`,
    getPath: (id) => {
      return `${baseRoute}/scholarships/${id}`;
    },
    icon: <FaRegBookmark size={iconSize} />,
    end: false,
  },
  scholarshipApplicantsRoute: {
    title: "Scholarship Applicants",
    path: `${baseRoute}/scholarships/:id/applicants`,
    getPath: (scholarshipId) => {
      return `${baseRoute}/scholarships/${scholarshipId}/applicants`;
    },
    icon: <FaUsers size={iconSize} />,
    end: false,
  },
  createScholarshipRoute: {
    title: "Add Scholarship",
    path: `${baseRoute}/scholarships/new`,
    icon: <FaPlusCircle size={iconSize} />,
    end: false,
  },
  updateScholarshipRoute: {
    title: "Edit Scholarship",
    path: `${baseRoute}/scholarships/:id/update`,
    getPath: (id) => {
      return `${baseRoute}/scholarships/${id}/update`;
    },
    icon: <FaClipboardCheck size={iconSize} />,
    end: false,
  },

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // External Scholarships
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  externalScholarshipsRoute: {
    title: "External Scholarships",
    path: `${baseRoute}/external-scholarships`,
    icon: <BsBoxArrowUpRight size={iconSize} />,
    end: true,
  },

  createExternalScholarshipRoute: {
    title: "Add External Scholarship",
    path: `${baseRoute}/external-scholarships/new`,
    icon: <BsGlobeAmericas size={iconSize} />,
    end: false,
  },

  updateExternalScholarshipRoute: {
    title: "Edit External Scholarship",
    path: `${baseRoute}/external-scholarships/:id/update`,
    getPath: (id) => `${baseRoute}/external-scholarships/${id}/update`,
    icon: <FaClipboardCheck size={iconSize} />,
    end: false,
  },
};

export default navigationRecords;
