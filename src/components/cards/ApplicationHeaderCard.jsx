import { useEffect, useState } from "react";
import ApplicationStatusTag from "@components/tags/ApplicationStatusTag";
import DefaultBadge from "@components/tags/DefaultBadge";

const ApplicationHeaderCard = ({ applicantApplication }) => {
  // ::::::::::::::::::::: CONTEXTS AND STATES
  const [loadedImage, setLoadedImage] = useState("");

  // ::::::::::::::::::::: BASE VAR

  const scholarship = applicantApplication?.scholarship || {};
  const thisApplicant = applicantApplication?.applicant || {};

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

  const profilePictureSize = {
    lgScreen: "150px",
    smScreen: "300px",
  };

  return (
    <div className="">
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
      <div className="bg_light rounded p-3 d-flex align-items-start justify-content-between user_select_none">
        <div>
          <h2 className="h2 mb-3">{thisApplicant?.fullName}</h2>
          <div className="d-flex align-items-center mb-2">
            <h5 className="h5 m-0">{scholarship?.name}</h5>
            <span className="mx-2">{" • "}</span>
            <DefaultBadge
              text={scholarship?.isDue ? "Closed" : "Open"}
              color={scholarship?.isDue ? "danger" : "success"}
            />
          </div>
          <p className="text-muted mb-3">
            {scholarship?.academicYear} Academic Year Application
          </p>
          <ApplicationStatusTag applicantApplication={applicantApplication} />
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

export default ApplicationHeaderCard;
