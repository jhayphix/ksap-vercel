import { Link } from "react-router-dom";

const FileDisplay = ({ response = {}, className }) => {
  const responseFileUrl = response?.response;
  const responseLabel = response?.label;

  return (
    <div className={`${className}`}>
      <p className="text mb-2 text-muted" style={{ fontWeight: "600" }}>
        {responseLabel}
      </p>
      {responseFileUrl ? (
        <Link
          to={responseFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary fw-bold text-decoration-underline"
        >
          View File
        </Link>
      ) : (
        <p className="text-muted">No file uploaded</p>
      )}
    </div>
  );
};

export default FileDisplay;
