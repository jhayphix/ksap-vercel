// React Modules
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

// Layout cand contexts
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { UserContext } from "@contexts/UserContextProvider";

// Components
import HeaderBanner from "@components/headers/HeaderBanner";
import BackButton from "@components/buttons/BackButton";
import AdminProfileComponent from "@pages/auth/AdminProfileComponent";
import DefaultSpinner from "@components/spinners/DefaultSpinner";

// Assets

const ViewAdminProfilePage = () => {
  // Contexts
  const { viewAdminProfilePageEffect } = useContext(ConfigContext);
  const { loadAdmins, getAdmin, adminStatus } = useContext(UserContext);

  //   Base variables
  const params = useParams();
  const adminId = params?.id;

  //   Load Admins
  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);
  const admins = adminStatus?.admins;

  // Get Admin
  useEffect(() => {
    getAdmin(admins, adminId);
  }, [getAdmin, admins, adminId]);
  const adminData = adminStatus?.admin || null;

  const adminIsLoading = adminStatus?.isLoading;
  const adminErrorMessage = adminStatus?.error;

  return (
    <PageTransition effect={viewAdminProfilePageEffect}>
      <section className="pb-5">
        <BackButton className="mb-3" />
        <HeaderBanner
          title={`Profile`}
          //
          className="mb-3"
        />

        {adminIsLoading ? (
          <DefaultSpinner />
        ) : adminErrorMessage ? (
          <div className="text-center centering fw-medium text-danger my-5">
            {adminErrorMessage}
          </div>
        ) : (
          <AdminProfileComponent adminData={adminData} />
        )}
      </section>
    </PageTransition>
  );
};

export default ViewAdminProfilePage;
