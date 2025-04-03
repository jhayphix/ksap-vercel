import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";

import { FaUserAlt, FaSignOutAlt } from "react-icons/fa"; // Importing icons
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";
import DropdownWrapper from "@components/dropdown/DropdownWrapper";

const ProfileMenu = () => {
  const { authStatus, authUserInfo, handleSignOut } = useContext(AuthContext);
  const {
    myApplicationsRoute,
    viewApplicantProfileRoute,
    viewAdminProfileRoute,
  } = useContext(NavigationContext);

  const {
    userDisplayName,
    isUserApplicant,
    isUserRegistered,

    loggedInUserId,

    isUserSuperAdmin,
    isUserApprovalManager,
    isUserReviewManager,
  } = authStatus;
  
  const authDisplayName = authUserInfo?.authDisplayName;
  const authPhotoURL = authUserInfo?.authPhotoURL;

  const [loadedImage, setLoadedImage] = useState("");
  const [userProfileRoute, setUserProfileRoute] = useState({
    getPath: () => {},
  });

  useEffect(() => {
    if (authStatus?.isUserAdmin) {
      setUserProfileRoute(viewAdminProfileRoute);
    } else if (authStatus?.isUserApplicant) {
      setUserProfileRoute(viewApplicantProfileRoute);
    }
  }, [
    authStatus?.isUserAdmin,
    authStatus?.isUserApplicant,
    viewApplicantProfileRoute,
    viewAdminProfileRoute,
  ]);

  const dropdownRef = useRef(null);
  const photoURL = authPhotoURL;

  // Preload image logic
  useEffect(() => {
    const loadImage = () => {
      if (photoURL) {
        const img = new Image();
        img.src = photoURL;
        img.onload = () => setLoadedImage(photoURL);
        img.onerror = () =>
          setLoadedImage("https://www.w3schools.com/w3images/avatar3.png");
      } else {
        setLoadedImage("https://www.w3schools.com/w3images/avatar3.png");
      }
    };

    loadImage();
  }, [photoURL]);

  const signOutHandler = () => {
    handleSignOut();
  };

  const dropdownId = "profileMenuDropdown";
  const displayAdminAssignedRole = isUserSuperAdmin
    ? "Super Admin"
    : isUserApprovalManager
    ? "Approval Manager"
    : isUserReviewManager
    ? "Review Manager"
    : "Admin";

  const displayName = authStatus?.isUserAdmin
    ? `${userDisplayName || authDisplayName} (${displayAdminAssignedRole})`
    : authStatus?.isUserApplicant
    ? `${userDisplayName || authDisplayName}${
        isUserRegistered ? "" : " (Unregistered)"
      }`
    : "Guest User";
  

  return (
    <div className="user_select_none" ref={dropdownRef}>
      <div className="d-flex align-items-center">
        <div className="m-0" style={{ fontWeight: "500" }}>
          {displayName}
        </div>

        <DropdownWrapper
          id={dropdownId}
          hasImageButton={true}
          image={loadedImage}
        >
          <li>
            <Link
              className="dropdown-item"
              to={
                userProfileRoute
                  ? userProfileRoute?.getPath(loggedInUserId)
                  : ""
              }
            >
              <FaUserAlt />

              <span className="ms-2">My Profile</span>
            </Link>
          </li>
          {isUserApplicant ? (
            <li className="">
              <Link className="dropdown-item" to={myApplicationsRoute?.path}>
                {myApplicationsRoute?.icon}

                <span className="ms-2">{myApplicationsRoute?.title}</span>
              </Link>
            </li>
          ) : null}

          <hr className="my-2" />

          <li className="" onClick={() => signOutHandler()}>
            <div className="dropdown-item text-danger cursor_pointer">
              <FaSignOutAlt />
              <span className="ms-2">Sign Out</span>
            </div>
          </li>
        </DropdownWrapper>
      </div>
    </div>
  );
};

export default ProfileMenu;
