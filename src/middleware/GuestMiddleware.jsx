import { Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "@contexts/AuthContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import DefaultSpinner from "@components/spinners/DefaultSpinner";

const GuestMiddleware = () => {
  const { authStatus } = useContext(AuthContext);
  const { dashboardRoute } = useContext(NavigationContext);
  const { setShowFlashMessage } = useContext(ConfigContext);

  useEffect(() => {
    if (authStatus?.isUserLoggedIn) {
      setShowFlashMessage({
        isActive: true,
        message: "You are logged in!",
        type: "info",
      });
    }

    //eslint-disable-next-line
  }, [authStatus?.isUserLoggedIn]);

  if (authStatus === undefined) {
    return <DefaultSpinner />;
  }

  if (authStatus?.isUserLoggedIn) {
    return <Navigate to={dashboardRoute?.path} replace />;
  }

  return <Outlet />;
};

export default GuestMiddleware;
