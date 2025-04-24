// React Modules
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Layout cand contexts
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { UserContext } from "@contexts/UserContextProvider";
import { TableDataContext } from "@contexts/TableDataContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";

// Components
import HeaderBanner from "@components/headers/HeaderBanner";
import BackButton from "@components/buttons/BackButton";
import DefaultNavTab from "@components/tabs/DefaultNavTab";
import ManageUserTable from "@components/tables/ManageUserTable";
import DefaultSpinner from "@components/spinners/DefaultSpinner";

// Assets

const ManageUsersPage = () => {
  // Contexts
  const { manageUserPageEffect } = useContext(ConfigContext);
  const { authStatus } = useContext(AuthContext);
  const { loadAdmins, adminStatus, loadApplicants, applicantStatus } =
    useContext(UserContext);
  const {
    getAdminsTableData,
    adminsTableDefaultColumns,
    getApplicantsTableData,
    applicantsTableDefaultColumns,
  } = useContext(TableDataContext);
  const { viewAdminProfileRoute, viewApplicantProfileRoute } =
    useContext(NavigationContext);

  const [adminsTableData, setAdminsTableData] = useState([]);
  const [applicantsTableData, setApplicantsTableData] = useState([]);

  // Load admins table data
  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);
  const adminsData = adminStatus?.adminsFlattened;
  const adminsIsLoading = adminStatus?.isLoading;
  const adminsErrorMessage = adminStatus?.error;

  useEffect(() => {
    if (adminsData?.length > 0) {
      const getTableData = getAdminsTableData(adminsData);
      setAdminsTableData(getTableData);
    }
  }, [adminsData, getAdminsTableData]);

  // Load applicants table data
  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);
  const applicantsData = applicantStatus?.applicantsFlattened;
  const applicantsIsLoading = applicantStatus?.isLoading;
  const applicantsErrorMessage = applicantStatus?.error;

  useEffect(() => {
    if (applicantsData?.length > 0) {
      const getTableData = getApplicantsTableData(applicantsData, adminsData);
      setApplicantsTableData(getTableData);
    }
  }, [applicantsData, getApplicantsTableData, adminsData]);

  const queryParamKey = "user-type"; // Represents the query parameter key in the URL
  const actionRoutes = ["admins", "applicants"]; // Possible action values for tabs
  const tabMappings = authStatus?.isUserSuperAdmin
    ? {
        "Manage Admins": actionRoutes[0],
        "Manage Applicants": actionRoutes[1],
      }
    : {
        "Manage Applicants": actionRoutes[1],
      };

  const [searchParams] = useSearchParams();
  const activeTab =
    searchParams.get(queryParamKey) || Object.values(tabMappings)[0];

  const tableNames = {
    admins: "Admins_Table",
    applicants: "Applicants_Table",
  };
  return (
    <PageTransition effect={manageUserPageEffect}>
      <section>
        <BackButton className="mb-3" />
        <HeaderBanner
          title={`Manage Admins & Applicants`}
          className="mb-3 d-none"
        />

        <div className="centering mt-4">
          <DefaultNavTab
            tabMappings={tabMappings}
            queryParamKey={queryParamKey}
          />
        </div>

        {activeTab === actionRoutes[0] &&
          (adminsIsLoading ? (
            <DefaultSpinner />
          ) : adminsErrorMessage ? (
            <div className="text-center centering fw-medium text-danger my-5">
              {adminsErrorMessage}
            </div>
          ) : !adminsTableData ||
            (Array.isArray(adminsTableData) && adminsTableData?.length < 1) ? (
            <div className="text-center centering fw-medium text_warning my-5">
              No Admin Available
            </div>
          ) : (
            <div className="pt-5">
              <ManageUserTable
                rawData={adminsTableData}
                route={viewAdminProfileRoute}
                defColumns={adminsTableDefaultColumns}
                className="mb-4"
                canDownload={true}
                tableName={tableNames?.admins}
              />
            </div>
          ))}

        {activeTab === actionRoutes[1] &&
          (applicantsIsLoading ? (
            <DefaultSpinner />
          ) : applicantsErrorMessage ? (
            <div className="text-center centering fw-medium text-danger my-5">
              {applicantsErrorMessage}
            </div>
          ) : !applicantsTableData ||
            (Array.isArray(applicantsTableData) &&
              applicantsTableData?.length < 1) ? (
            <div className="text-center centering fw-medium text_warning my-5">
              No Applicant Available
            </div>
          ) : (
            <div className="pt-5">
              <ManageUserTable
                rawData={applicantsTableData}
                route={viewApplicantProfileRoute}
                defColumns={applicantsTableDefaultColumns}
                className="mb-4"
                canDownload={true}
                tableName={tableNames?.applicants}
              />
            </div>
          ))}
      </section>
    </PageTransition>
  );
};

export default ManageUsersPage;
