import BrandName from "@components/typography/BrandName";
import NavList from "@layouts/NavList";
import { useContext, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

import { AuthContext } from "@contexts/AuthContextProvider";

const SideNavBar = ({ className, setShowMinimalNavbar, topNavbarHeight }) => {
  const { authStatus, handleSignOut } = useContext(AuthContext);
  const [closeSideNavbar, setCloseSideNavbar] = useState(false);

  const userIsLoggedIn = authStatus?.isUserLoggedIn;

  const handleNavClose = () => {
    setShowMinimalNavbar(true);
    setCloseSideNavbar(true);
  };
  const signOutHandler = () => {
    handleSignOut();
  };

  

  return (
    <div
      className={`${className} ${
        closeSideNavbar && "close"
      } bg_secondary user_select_none `}
      style={{ height: "100%" }}
    >
      <div
        className="d-flex align-items-center justify-content-between px-3"
        style={{
          height: "2.8rem",
        }}
      >
        <BrandName />
        <IoMdClose
          side={30}
          className="sideNavbarCloseButton"
          onClick={() => handleNavClose()}
        />
      </div>
      <div
        className="d-flex flex-column justify-content-between "
        style={{ height: `calc(90vh - ${topNavbarHeight})` }}
      >
        <NavList />

        <div className="mb-5">
          {userIsLoggedIn ? (
            <div
              className="ps-3 py-2 cursor_pointer  fw-medium user_select_none nav_link_hover"
              style={{ fontSize: "0.92rem" }}
              onClick={() => signOutHandler()}
            >
              <FaSignOutAlt />
              <span className="ms-3">Sign Out</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SideNavBar;
