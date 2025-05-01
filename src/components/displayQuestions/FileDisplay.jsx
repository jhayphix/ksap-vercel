import { Link } from "react-router-dom";

const FileDisplay = ({ question = {}, className }) => {
  const fileUrl = question?.response;
  const fileQuestionLabel = question?.label;

  return (
    <div className={`${className}`}>
      <p className="text mb-2 text-muted" style={{ fontWeight: "600" }}>
        {fileQuestionLabel}
      </p>
      {fileUrl ? (
        <Link
          to={fileUrl}
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
