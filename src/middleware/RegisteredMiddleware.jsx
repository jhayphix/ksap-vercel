import { Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@contexts/AuthContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import DefaultSpinner from "@components/spinners/DefaultSpinner";

const RegisteredMiddleware = () => {
  const { authStatus } = useContext(AuthContext);
  const { registerApplicantRoute } = useContext(NavigationContext);
  const { setShowFlashMessage } = useContext(ConfigContext);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    if (authStatus === undefined) return;

    if (!authStatus?.isUserRegistered) {
      setShowFlashMessage({
        isActive: true,
        message:
          "Access denied! You must register your account to use this feature.",
        type: "warning",
      });
      setRedirectPath(registerApplicantRoute?.path);
    }
  }, [authStatus, setShowFlashMessage, registerApplicantRoute]);

  if (authStatus === undefined) {
    return <DefaultSpinner />;
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default RegisteredMiddleware;
