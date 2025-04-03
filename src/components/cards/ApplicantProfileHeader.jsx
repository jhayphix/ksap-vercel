import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { NavigationContext } from "@contexts/NavigationContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";
import { ConfigContext } from "@contexts/ConfigContextProvider";

import DefaultStatusTag from "@components/tags/DefaultStatusTag";
import { MdFiberManualRecord } from "react-icons/md";

const ApplicantProfileHeader = ({ applicantData, className }) => {
  // ::::::::::::::::::::: CONTEXTS AND STATES
  const { updateApplicantRoute } = useContext(NavigationContext);
  const { HELPER } = useContext(ConfigContext);
  const { authStatus, userCheck } = useContext(AuthContext);
  const [loadedImage, setLoadedImage] = useState("");

  // ::::::::::::::::::::: BASE VAR
  const thisApplicant = applicantData ?? {};
  const applicantId = thisApplicant?.id;
  const loggedInUserId = authStatus?.loggedInUserId;
  const userIsSuperAdmin = authStatus?.isUserSuperAdmin;
  const isAuthUserOwner = userCheck?.isAuthUserOwner(
    applicantId,
    loggedInUserId
  );

  const OwnerAndSuperAdminOnly =
    isAuthUserOwner === true || userIsSuperAdmin === true;

  // ::::::::::::::::::::: PRELOAD IMAGE LOGIC
  const photoURL = thisApplicant?.authPhotoURL; // Pass in the real profile picture url
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
  const accountStatus = getAccountStatus(thisApplicant?.accountStatus);

  const applicantFields = [
    {
      label: "Role",
      value: thisApplicant?.role,
    },
    {
      label: "Account Status",
      value: thisApplicant?.accountStatus,
    },
    {
      label: "Account Deactivated At",
      value: HELPER?.formatDateTime(thisApplicant?.deactivatedAt, {
        nullValue: "None",
      }),
    },

    {
      label: "Registered At",
      value: HELPER?.formatDateTime(thisApplicant?.createdAt),
    },
    {
      label: "Updated At",
      value: HELPER?.formatDateTime(thisApplicant?.updatedAt),
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
            <h2 className="h2 mb-0">{thisApplicant?.fullName}</h2>
            <MdFiberManualRecord className="mx-2" size={10} />
            <DefaultStatusTag
              text={accountStatus?.text}
              color={accountStatus?.type}
            />
          </div>

          <div className="d-flex flex-wrap gap-3 my-4">
            {applicantFields?.map(({ label, value }, fieldIndex) => (
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
          {OwnerAndSuperAdminOnly ? (
            <div className="d-flex align-items-center">
              <Link
                className="btn btn-sm btn_secondary_2"
                to={updateApplicantRoute?.getPath(applicantId)}
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

export default ApplicantProfileHeader;
