import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";

const NavList = ({ showMinimalNavbar, handleMobileNavClose }) => {
  const { navLinksByUserType } = useContext(NavigationContext);
  const { authStatus } = useContext(AuthContext);

  const handleNavClose = () => {
    handleMobileNavClose();
  };

  let NavLinks = [];
  if (authStatus?.isUserSuperAdmin) {
    NavLinks = navLinksByUserType?.superAdminRoutesOnly;
  } else if (authStatus?.isUserAdmin) {
    NavLinks = navLinksByUserType?.adminRoutesOnly;
  } else if (authStatus?.isUserApplicant) {
    NavLinks = navLinksByUserType?.applicantRoutesOnly;
  } else {
    NavLinks = navLinksByUserType?.default;
  }

  return (
    <nav className="py-5 side_navbar">
      <ul className="">
        {NavLinks?.map(({ title, path, icon, end }, index) => {
          return (
            <li
              className="d-flex"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title={title}
              key={index}
              onClick={() => handleNavClose()}
            >
              <NavLink
                to={path}
                end={end}
                className={({ isActive }) =>
                  `nav_link py-2 fw-semibold d-flex align-items-center w-100 ${
                    isActive ? "nav_link_active" : ""
                  } ${showMinimalNavbar ? "justify-content-center" : "ps-3"}`
                }
                style={{ fontSize: "0.92rem" }}
              >
                <span>{icon}</span>
                {!showMinimalNavbar && <span className="ms-3">{title}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavList;
