import { Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@contexts/AuthContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import DefaultSpinner from "@components/spinners/DefaultSpinner";

const ApplicantMiddleware = () => {
  const { authStatus } = useContext(AuthContext);
  const { dashboardRoute } = useContext(NavigationContext);
  const { setShowFlashMessage } = useContext(ConfigContext);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    if (authStatus === undefined) return;

    if (!authStatus?.isUserApplicant) {
      setShowFlashMessage({
        isActive: true,
        message: "Access denied! This section is for applicants only.",
        type: "warning",
      });
      setRedirectPath(dashboardRoute?.path);
    }
  }, [authStatus, setShowFlashMessage, dashboardRoute]);

  if (authStatus === undefined) {
    return <DefaultSpinner />;
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ApplicantMiddleware;
