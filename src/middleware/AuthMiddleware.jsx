import { Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@contexts/AuthContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import DefaultSpinner from "@components/spinners/DefaultSpinner";

const AuthMiddleware = () => {
  const { authStatus } = useContext(AuthContext);
  const { authSelectionRoute } = useContext(NavigationContext);
  const { setShowFlashMessage } = useContext(ConfigContext);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    if (authStatus === undefined) return;

    if (!authStatus?.isUserLoggedIn) {
      setShowFlashMessage({
        isActive: true,
        message: "Access denied! Please login first.",
        type: "warning",
      });
      setRedirectPath(authSelectionRoute?.path);
    }
  }, [authStatus, setShowFlashMessage, authSelectionRoute]);

  if (authStatus === undefined) {
    return <DefaultSpinner />;
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default AuthMiddleware;
