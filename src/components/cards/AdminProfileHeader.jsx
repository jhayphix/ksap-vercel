import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { NavigationContext } from "@contexts/NavigationContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";
import { ConfigContext } from "@contexts/ConfigContextProvider";

import { UserContext } from "@contexts/UserContextProvider";

import DefaultStatusTag from "@components/tags/DefaultStatusTag";
import { MdFiberManualRecord } from "react-icons/md";

const AdminProfileHeader = ({ adminData, className }) => {
  // ::::::::::::::::::::: CONTEXTS AND STATES
  const { updateAdminRoute } = useContext(NavigationContext);
  const { HELPER } = useContext(ConfigContext);
  const { authStatus } = useContext(AuthContext);
  const { getAdminReturn, adminStatus } = useContext(UserContext);

  const [loadedImage, setLoadedImage] = useState("");

  // ::::::::::::::::::::: BASE VAR
  const thisAdmin = adminData ?? {};
  const adminId = thisAdmin?.id;
  const isUserSuperAdmin = authStatus?.isUserSuperAdmin;

  const adminsData = adminStatus?.admins;

  const getAdminById = (adminId) => {
    const foundAdmin = getAdminReturn(adminsData, adminId);
    return foundAdmin ?? "N/A";
  };

  // ::::::::::::::::::::: PRELOAD IMAGE LOGIC
  const photoURL = thisAdmin?.authPhotoURL; // Pass in the real profile picture url
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

  const getAccountStatus = (accountStatus) => {
    const transformStatus = accountStatus?.toLowerCase();
    let type;
    switch (transformStatus) {
      case "active":
        type = "success";
        break;
      case "inactive":
        type = "warning";
        break;

      case "blocked":
        type = "warning";
        break;

      default:
        type = "info";
        break;
    }

    return { text: accountStatus, type };
  };
  const accountStatus = getAccountStatus(thisAdmin?.accountStatus);

  const adminFields = [
    {
      label: "Role",
      value: thisAdmin?.role,
    },
    {
      label: "Assigned Role",
      value: thisAdmin?.assignedRole,
    },
    {
      label: "Registered By",
      value: getAdminById(thisAdmin?.createdByAdminId)?.fullName,
    },

    {
      label: "Registered At",
      value: HELPER?.formatDateTime(thisAdmin?.createdAt),
    },
    {
      label: "Last Updated By",
      value: getAdminById(thisAdmin?.updatedByAdminId)?.fullName,
    },
    {
      label: "Last Updated At",
      value: HELPER?.formatDateTime(thisAdmin?.updatedAt),
    },
    {
      label: "Account Status",
      value: thisAdmin?.accountStatus,
    },
    {
      label: "Account Deactivated At",
      value: HELPER?.formatDateTime(thisAdmin?.deactivatedAt, {
        nullValue: "None",
      }),
    },
  ];

  const profilePictureSize = {
    lgScreen: "150px",
    smScreen: "300px",
  };
  return (
    <div>
      <div className="centering">
        <div
          className="rounded-circle bg_secondary ms-3 d-block d-md-none mb-5 mt-3"
          style={{
            width: profilePictureSize?.smScreen,
            height: profilePictureSize?.smScreen,
            backgroundImage: `url(${loadedImage})`,
            backgroundSize: "cover",
          }}
        />
      </div>
      <div
        className={`${className} bg_light rounded p-3 d-flex align-items-center justify-content-md-between justify-content-center`}
      >
        <div>
          <div className="d-flex align-items-center">
            <h2 className="h2 mb-0">{thisAdmin?.fullName}</h2>
            <MdFiberManualRecord className="mx-2" size={10} />
            <DefaultStatusTag
              text={accountStatus?.text}
              color={accountStatus?.type}
            />
          </div>

          <div className="d-flex flex-wrap gap-3 my-4">
            {adminFields?.map(({ label, value }, fieldIndex) => (
              <div className="d-flex align-items-center" key={fieldIndex}>
                {/* React Icon for a bullet-like effect */}
                <MdFiberManualRecord
                  className="me-2 text_secondary_2"
                  size={10}
                />

                {/* Label and Value */}
                <span className="fw-medium me-1">{label}:</span>
                <span className="text-muted">{value}</span>
              </div>
            ))}
          </div>
          {isUserSuperAdmin ? (
            <div className="d-flex align-items-center">
              <Link
                className="btn btn-sm btn_secondary_2"
                to={updateAdminRoute?.getPath(adminId)}
              >
                Edit Profile
              </Link>
            </div>
          ) : null}
        </div>
        <div className="ms-3 d-none d-md-block">
          <div
            className="rounded-circle bg_secondary "
            style={{
              width: profilePictureSize?.lgScreen,
              height: profilePictureSize?.lgScreen,
              backgroundImage: `url(${loadedImage})`,
              backgroundSize: "cover",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminProfileHeader;
