import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = ({
  btnRole,
  btnPath = "/",
  btnName = "Back",
  className,
}) => {
  const navigate = useNavigate();

  if (btnRole === "link") {
    return (
      <div className={`${className} d-inline-block`}>
        <Link
          role="button"
          to={btnPath}
          className={`btn btn-sm px-2 btn_secondary_2 d-flex align-items-center`}
        >
          <FaArrowLeft className="me-2" />
          {btnName}
        </Link>
      </div>
    );
  } else {
    return (
      <button
        onClick={() => navigate(-1)}
        className={`${className} btn btn-sm btn_secondary_2 d-flex align-items-center`}
      >
        <FaArrowLeft className="me-2" />
        Back
      </button>
    );
  }
};

export default BackButton;
