import { useEffect, useRef, useState } from "react";

const FileUploadField = ({
  question,
  questionIndex,
  section,
  formData,
  onChange,
  hasError,
}) => {
  const fileInputRef = useRef(null);
  const questionId = question?.id;
  const fileConfig = question?.fileUploadConfig ?? {};

  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  const fileResponse = formData?.[questionId]?.response;

  // Generate preview for images and PDF
  useEffect(() => {
    if (fileResponse instanceof File) {
      const fileType = fileResponse?.type;

      if (fileType?.startsWith("image")) {
        const url = URL.createObjectURL(fileResponse);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      }

      // Preview PDF (basic support)
      if (fileType === "application/pdf") {
        const url = URL.createObjectURL(fileResponse);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    }

    setPreviewUrl(""); // Clear preview if unsupported
  }, [fileResponse]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = fileConfig?.allowedFileTypes?.map((type) =>
      type.toLowerCase()
    );
    const restrictTypes = fileConfig?.restrictFileTypes;
    const maxFileSizeMB =
      parseFloat(fileConfig?.maxFileSize?.replace("MB", "")) || 5;

    const fileSizeMB = file?.size / (1024 * 1024);

    // Validate file type
    if (restrictTypes && allowedTypes?.length > 0) {
      const isValidType = allowedTypes.some(
        (type) =>
          file?.type?.toLowerCase().includes(type) ||
          file?.name?.toLowerCase().includes(type)
      );
      if (!isValidType) {
        setError(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`);
        fileInputRef.current.value = ""; // Reset file input
        onChange(
          section,
          question,
          questionIndex
        )({
          target: { value: null, files: [] },
        });
        return;
      }
    }

    // Validate file size
    if (fileSizeMB > maxFileSizeMB) {
      setError(`File size exceeds ${maxFileSizeMB} MB`);
      fileInputRef.current.value = ""; // Reset file input
      onChange(
        section,
        question,
        questionIndex
      )({
        target: { value: null, files: [] },
      });
      return;
    }

    setError("");
    onChange(
      section,
      question,
      questionIndex
    )({
      target: { value: file, files: [file] },
    });
  };

  return (
    <div className="file-upload-field">
      <input
        ref={fileInputRef}
        type="file"
        className={`form-control ${hasError || error ? "fieldHasError" : ""}`}
        onChange={handleFileChange}
        required={question?.required}
      />

      {/* Preview image */}
      {previewUrl && fileResponse?.type?.startsWith("image") && (
        <div className="mt-2 text-center">
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              maxWidth: "100px",
              maxHeight: "100px",
              borderRadius: "5px",
            }}
          />
        </div>
      )}

      {/* Preview PDF */}
      {previewUrl && fileResponse?.type === "application/pdf" && (
        <div className="mt-2">
          <embed
            src={previewUrl}
            type="application/pdf"
            width="100%"
            height="150px"
          />
        </div>
      )}

      {/* Show file name for other files */}
      {/* {!previewUrl && fileResponse instanceof File && (
        <div className="mt-2 text-muted small">{fileResponse?.name}</div>
      )} */}

      {/* Preview Word/Excel or other files as download link */}
      {!previewUrl && fileResponse instanceof File && (
        <div className="mt-2 text-muted small">
          <i className="bi bi-file-earmark-text me-1"></i>{" "}
          {/* Bootstrap icon or replace with any */}
          {fileResponse?.name}
          <br />
          <a
            href={URL.createObjectURL(fileResponse)}
            target="_blank"
            rel="noopener noreferrer"
            className="small text-primary"
          >
            Download Uploaded File
          </a>
        </div>
      )}

      {/* File config info */}
      {(fileConfig?.restrictFileTypes || fileConfig?.maxFileSize) && (
        <div className="mt-1 small text-muted">
          Upload 1 supported file:{" "}
          {fileConfig?.allowedFileTypes?.join(", ").toLowerCase() || "any type"}
          . Max {fileConfig?.maxFileSize || "5MB"}.
        </div>
      )}

      {/* Error Message */}
      {error && <div className="text-danger mt-1 small">{error}</div>}
    </div>
  );
};

export default FileUploadField;
