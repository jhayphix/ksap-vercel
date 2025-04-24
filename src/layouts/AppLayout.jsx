import FlashMessage from "@components/display/FlashMessage";
import DefaultModal from "@components/display/DefaultModal";

import SideNavBar from "@layouts/SideNavBar";
import TopNavBar from "@layouts/TopNavBar";
import MinimalSideNavbar from "@layouts/MinimalSideNavbar";
import ScrollToTopBottom from "@layouts/ScrollToTopBottom";
import { useContext, useState, useEffect } from "react";
import Footer from "@layouts/Footer";
import useOnlineStatus from "@layouts/useOnlineStatus";
import { ConfigContext } from "@contexts/ConfigContextProvider";

const AppLayout = ({ children }) => {
  const { setShowFlashMessage, HELPER } = useContext(ConfigContext);

  const [wasOffline, setWasOffline] = useState(false); // Track previous state
  const topNavbarHeight = "2.5rem";
  const isOnline = useOnlineStatus();

  const navigationStateKey = "NavigationState";

  const [showMinimalNavbar, setShowMinimalNavbar] = useState(() => {
    return HELPER?.getLocalStorage(navigationStateKey) ?? false;
  });

  // Save to localStorage whenever the state changes
  useEffect(() => {
    HELPER?.setLocalStorage(navigationStateKey, showMinimalNavbar);

    //eslint-disable-next-line
  }, [showMinimalNavbar]);


  

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true); // Mark that the user was offline
      setShowFlashMessage({
        isActive: true,
        message: "No internet. You're offline!",
        type: "error",
        hideCloseBtn: true,
      });
    } else if (wasOffline) {
      // Only show the restored message if they were offline before
      setWasOffline(false);
      setShowFlashMessage({
        isActive: true,
        message: "Your connection has been restored.",
        type: "success",
      });
    }
  }, [isOnline, wasOffline, setShowFlashMessage]);

  const handleShowMinimalNavbar = () => {
    setShowMinimalNavbar((prev) => !prev);
  };

  return (
    <div
      id="app_wrapper"
      className={`d-flex position-relative navbar_overlay_parent g-0 p-0`}
      style={{
        height: "100vh",
        width: "100vw",
        maxWidth: "1500px",
        margin: "auto",
      }}
    >
      <div className="" style={{ height: "100vh" }}>
        {showMinimalNavbar ? (
          <MinimalSideNavbar
            className="minimalNavbarWidthControl"
            showMinimalNavbar={showMinimalNavbar}
            topNavbarHeight={topNavbarHeight}
          />
        ) : (
          <SideNavBar
            setShowMinimalNavbar={setShowMinimalNavbar}
            className="sideNavbarWidthControl active"
            topNavbarHeight={topNavbarHeight}
          />
        )}
      </div>
      <div
        className={`${
          showMinimalNavbar
            ? "minimalMainContainerWidthControl"
            : "mainContainerWidthControl"
        }`}
        style={{ height: "100vh" }}
      >
        <TopNavBar
          className={`px-3`}
          style={{ height: topNavbarHeight }}
          handleShowMinimalNavbar={handleShowMinimalNavbar}
          showMinimalNavbar={showMinimalNavbar}
        />
        <DefaultModal />
        <div className="px-2 bg_primary_3">
          <FlashMessage className="" />
        </div>
        <main
          id="main_container"
          className="has_scrollbar bg_primary_3 px-3 pt-3"
          style={{
            height: `calc(100vh - ${topNavbarHeight})`,
          }}
        >
          <div>{children}</div>
          <Footer />
          <ScrollToTopBottom />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
