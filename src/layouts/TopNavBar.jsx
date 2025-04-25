import { RxHamburgerMenu, RxDoubleArrowRight } from "react-icons/rx";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "@contexts/AuthContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";

import ProfileMenu from "@components/buttons/ProfileMenu";

const TopNavBar = ({
  style,
  className,
  handleShowMinimalNavbar,
  showMinimalNavbar,
}) => {
  const { authStatus } = useContext(AuthContext);
  const { authSelectionRoute } = useContext(NavigationContext);
  const navigate = useNavigate();

  return (
    <div className={`${className} bg_primary`} style={style}>
      <div className="d-flex align-items-center justify-content-between w-100 h-100">
        <div
          className="cursor_pointer"
          onClick={() => handleShowMinimalNavbar()}
        >
          {showMinimalNavbar ? (
            <RxDoubleArrowRight size={20} />
          ) : (
            <RxHamburgerMenu size={20} />
          )}
        </div>
        <div>
          {authStatus?.isUserLoggedIn ? (
            <ProfileMenu />
          ) : (
            <button
              className="btn btn_secondary_2 "
              onClick={() => navigate(authSelectionRoute?.path)}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;
