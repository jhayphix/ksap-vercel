import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@contexts/AuthContextProvider";

const ApplyButton = ({ deadline, path, className, scholarshipId }) => {
  const { HELPER } = useContext(ConfigContext);
  const { loadApplications, applicationStatus } =
    useContext(ApplicationContext);

  const { myApplicationsRoute } = useContext(NavigationContext);

  const { authStatus } = useContext(AuthContext);

  const applicantId = authStatus?.loggedInUserId;

  useEffect(() => {
    loadApplications();

    //eslint-disable-next-line
  }, []);

  const applicationsData = applicationStatus?.applications;
  const hasAppliedForScholarship = HELPER?.hasAppliedForScholarship(
    applicantId,
    scholarshipId,
    applicationsData
  );

  const isDeadlineDue = HELPER?.isDeadlineDue(deadline);
  const deadlineStatus = (deadline) => {
    if (deadline) {
      let status = { color: "success", text: "Apply Now" };
      if (isDeadlineDue) {
        status.color = "danger";
        status.text = "Closed";
      }
      return status;
    } else {
      return { color: "danger", text: "Error" };
    }
  };

  const statusText = deadlineStatus(deadline)?.text;

  const parentstyle =
    "fw-medium  py-1 px-3 rounded hover_opacity_5 user_select_none text-center";
  if (hasAppliedForScholarship) {
    return (
      <Link
        to={myApplicationsRoute?.path}
        className={`${className}  hover_underline btn btn_secondary_outline_2 ${parentstyle}`}
        style={{
          opacity: "0.9",
        }}
      >
        {" "}
        Application In Progress
      </Link>
    );
  } else if (isDeadlineDue) {
    return (
      <div
        className={`${className} text_danger bg_danger_light  ${parentstyle}`}
        style={{
          opacity: "0.6",
        }}
      >
        {statusText}
      </div>
    );
  } else {
    return (
      <Link
        to={path}
        className={` ${className} btn_secondary_3 cursor_pointer  ${parentstyle}`}
        style={{ opacity: "1" }}
        role="button"
      >
        {statusText}
      </Link>
    );
  }
};

export default ApplyButton;
