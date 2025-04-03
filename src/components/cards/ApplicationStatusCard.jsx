import {
  FaCheckCircle,
  FaHourglassStart,
  FaTimesCircle,
  FaAward,
  FaUserCheck,
  FaFileAlt,
  // FaUserClock,
  // FaUserTimes,
  // FaUserEdit,
  FaUserShield,
  FaUserSlash,
} from "react-icons/fa";

const ApplicationStatusCard = ({
  applicationStatus,
  numberOfApplications,
  className,
}) => {
  const statusLowerCase = applicationStatus?.toLowerCase();
  const totalApplicants = Number(numberOfApplications);

  let status = {};
  const iconSize = 32;

  switch (statusLowerCase) {
    case "total applications":
      status = {
        icon: <FaFileAlt size={iconSize} />,
        text: applicationStatus,
        color: "dark",
      };
      break;
    case "approved":
      status = {
        icon: <FaCheckCircle size={iconSize} />,
        text: applicationStatus,
        color: "success",
      };
      break;
    case "qualified":
      status = {
        icon: <FaUserCheck size={iconSize} />,
        text: applicationStatus,
        color: "primary",
      };
      break;
    case "pending review":
      status = {
        icon: <FaHourglassStart size={iconSize} />,
        text: applicationStatus,
        color: "warning",
      };
      break;
    case "pending approval":
      status = {
        icon: <FaHourglassStart size={iconSize} />,
        text: applicationStatus,
        color: "warning",
      };
      break;
    case "disqualified":
      status = {
        icon: <FaTimesCircle size={iconSize} />,
        text: applicationStatus,
        color: "danger",
      };
      break;
    case "not approved":
      status = {
        icon: <FaTimesCircle size={iconSize} />,
        text: applicationStatus,
        color: "danger",
      };
      break;
    case "reviewed":
      status = {
        icon: <FaUserShield size={iconSize} />,
        text: applicationStatus,
        color: "info",
      };
      break;
    case "unreviewed":
      status = {
        icon: <FaUserSlash size={iconSize} />,
        text: applicationStatus,
        color: "dark",
      };
      break;
    default:
      status = {
        icon: <FaAward size={iconSize} />,
        text: applicationStatus,
        color: "dark",
      };
  }

  return (
    <div className={`${className} rounded bg_light shadow_sm py-2`}>
      <div className="row g-0 centering">
        <div className="col-lg-10 col-md-11 col-10 d-flex justify-content-between align-items-center">
          <div className={`centering p-0 text-${status?.color}`}>
            {status?.icon}
          </div>

          <div className="d-flex flex-column align-items-center">
            <div className={`mb-1 text-${status?.color} fw-bold text-center`}>
              {status?.text}
            </div>
            <div className="fw-bold" style={{ fontSize: "1.5rem" }}>
              {isNaN(totalApplicants) ? "N/A" : totalApplicants}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusCard;
