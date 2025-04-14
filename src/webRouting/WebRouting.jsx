import { Routes, Route, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AnimatePresence } from "framer-motion";
import { NavigationContext } from "@contexts/NavigationContextProvider";

// Middleware
import AuthMiddleware from "@middleware/AuthMiddleware";
import GuestMiddleware from "@middleware/GuestMiddleware";
import ApplicantMiddleware from "@middleware/ApplicantMiddleware";
import AdminMiddleware from "@middleware/AdminMiddleware";
import SuperAdminMiddleware from "@middleware/SuperAdminMiddleware";
import ApplicantNotRegisteredMiddleware from "@middleware/ApplicantNotRegisteredMiddleware";
import RegisteredMiddleware from "@middleware/RegisteredMiddleware";

// Pages
import DashboardPage from "@pages/general/DashboardPage";
import AdminPanelPage from "@pages/general/AdminPanelPage";
import AuthSelectionPage from "@pages/auth/AuthSelectionPage";
import RegisterApplicantPage from "@pages/auth/RegisterApplicantPage";
import RegisterAdminPage from "@pages/auth/RegisterAdminPage";
import UpdateApplicantPage from "@pages/auth/UpdateApplicantPage";
import UpdateAdminPage from "@pages/auth/UpdateAdminPage";
import ViewApplicantProfilePage from "@pages/auth/ViewApplicantProfilePage";
import ViewAdminProfilePage from "@pages/auth/ViewAdminProfilePage";
import ManageUsersPage from "@pages/auth/ManageUsersPage";
import MyApplicationsPage from "@pages/application/MyApplicationsPage";
import ViewApplicationPage from "@pages/application/ViewApplicationPage";
import CreateApplicationPage from "@pages/application/CreateApplicationPage";
import UpdateApplicationPage from "@pages/application/UpdateApplicationPage";
import EvaluateApplicationPage from "@pages/application/EvaluateApplicationPage";
import SearchApplicationPage from "@pages/application/SearchApplicationPage";
import ViewScholarshipPage from "@pages/scholarship/ViewScholarshipPage";
import ScholarshipApplicationsPage from "@pages/scholarship/ScholarshipApplicationsPage";
import CreateScholarshipPage from "@pages/scholarship/CreateScholarshipPage";
import UpdateScholarshipPage from "@pages/scholarship/UpdateScholarshipPage";
import NotFoundPage from "@pages/notFound/NotFoundPage";

const WebRouting = () => {
  const location = useLocation();
  const {
    homeRoute,
    dashboardRoute,
    adminPanelRoute,
    authSelectionRoute,
    registerApplicantRoute,
    registerAdminRoute,
    updateApplicantRoute,
    viewApplicantProfileRoute,
    viewAdminProfileRoute,
    updateAdminRoute,
    manageUsersRoute,
    myApplicationsRoute,
    viewApplicationRoute,
    createApplicationRoute,
    updateApplicationRoute,
    evaluateApplicationRoute,
    searchApplicationRoute,
    viewScholarshipRoute,
    scholarshipApplicantsRoute,
    createScholarshipRoute,
    updateScholarshipRoute,
  } = useContext(NavigationContext);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ✅ Public Routes */}
        <Route path={homeRoute?.path} element={<DashboardPage />} />
        <Route path={dashboardRoute?.path} element={<DashboardPage />} />

        {/* ✅ Guest Routes (Only for Unauthenticated Users) */}
        <Route element={<GuestMiddleware />}>
          <Route
            path={authSelectionRoute?.path}
            element={<AuthSelectionPage />}
          />
        </Route>

        {/* ✅ Protected Routes (Only Authenticated Users) */}
        <Route element={<AuthMiddleware />}>
          {/* ✅ General Protected Routes */}

          <Route
            path={viewScholarshipRoute?.path}
            element={<ViewScholarshipPage />}
          />

          {/* ✅ Admin-Only Routes */}
          <Route element={<AdminMiddleware />}>
            {/* All Admin Public Routes */}
            <Route
              path={viewAdminProfileRoute?.path}
              element={<ViewAdminProfilePage />}
            />
            <Route path={adminPanelRoute?.path} element={<AdminPanelPage />} />

            <Route
              path={evaluateApplicationRoute?.path}
              element={<EvaluateApplicationPage />}
            />
            <Route
              path={searchApplicationRoute?.path}
              element={<SearchApplicationPage />}
            />
            <Route
              path={scholarshipApplicantsRoute?.path}
              element={<ScholarshipApplicationsPage />}
            />
            <Route
              path={manageUsersRoute?.path}
              element={<ManageUsersPage />}
            />

            {/* ✅ Super Admin-Only Routes */}
            <Route element={<SuperAdminMiddleware />}>
              <Route
                path={registerAdminRoute?.path}
                element={<RegisterAdminPage />}
              />
              <Route
                path={updateAdminRoute?.path}
                element={<UpdateAdminPage />}
              />
              <Route
                path={createScholarshipRoute?.path}
                element={<CreateScholarshipPage />}
              />
              <Route
                path={updateScholarshipRoute?.path}
                element={<UpdateScholarshipPage />}
              />
            </Route>
          </Route>

          {/* ✅ Applicant-Only Routes */}
          <Route element={<ApplicantMiddleware />}>
            {/* ✅ Unregistered Applicants Can Register */}
            <Route element={<ApplicantNotRegisteredMiddleware />}>
              <Route
                path={registerApplicantRoute?.path}
                element={<RegisterApplicantPage />}
              />
            </Route>

            {/* ✅ Registered Applicants */}
            <Route element={<RegisteredMiddleware />}>
              <Route
                path={viewApplicantProfileRoute?.path}
                element={<ViewApplicantProfilePage />}
              />
              <Route
                path={myApplicationsRoute?.path}
                element={<MyApplicationsPage />}
              />
              <Route
                path={viewApplicationRoute?.path}
                element={<ViewApplicationPage />}
              />
              <Route
                path={createApplicationRoute?.path}
                element={<CreateApplicationPage />}
              />
              <Route
                path={updateApplicationRoute?.path}
                element={<UpdateApplicationPage />}
              />
              <Route
                path={updateApplicantRoute?.path}
                element={<UpdateApplicantPage />}
              />
            </Route>
          </Route>
        </Route>

        {/* ✅ Catch-All 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

export default WebRouting;
