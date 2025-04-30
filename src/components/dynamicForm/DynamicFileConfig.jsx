const DynamicFileConfig = ({
  question,
  sectionIndex,
  questionIndex,
  updateField,
}) => {
  const questionType = question?.type;

  return (
    <div>
      {/* File Upload Config */}
      {questionType === "file" && (
        <div className="mt-4">
          <h6 className="mb-3">File Upload Configuration</h6>
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id={`restrictFileTypesSwitch-${sectionIndex}-${questionIndex}`}
              checked={question?.fileUploadConfig?.restrictFileTypes || false}
              onChange={(e) =>
                updateField(
                  sectionIndex,
                  questionIndex,
                  "fileUploadConfig",
                  {
                    ...question.fileUploadConfig,
                    restrictFileTypes: e.target.checked,
                    allowedFileTypes: e.target.checked
                      ? question?.fileUploadConfig?.allowedFileTypes || []
                      : [],
                  },
                  question
                )
              }
            />
            <label
              className="form-check-label"
              htmlFor={`restrictFileTypesSwitch-${sectionIndex}-${questionIndex}`}
            >
              Allow only specific file types
            </label>
          </div>

          {question?.fileUploadConfig?.restrictFileTypes && (
            <div className="mb-3">
              <label className="form-label">Allowed File Types</label>
              <div className="d-flex gap-3">
                {["pdf", "document", "image"].map((type) => (
                  <div key={type} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`fileType-${type}-${sectionIndex}-${questionIndex}`}
                      checked={question?.fileUploadConfig?.allowedFileTypes?.includes(
                        type
                      )}
                      onChange={(e) => {
                        const current =
                          question?.fileUploadConfig?.allowedFileTypes || [];
                        const updated = e.target.checked
                          ? [...current, type]
                          : current.filter((t) => t !== type);
                        updateField(
                          sectionIndex,
                          questionIndex,
                          "fileUploadConfig",
                          {
                            ...question.fileUploadConfig,
                            allowedFileTypes: updated,
                          },
                          question
                        );
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`fileType-${type}-${sectionIndex}-${questionIndex}`}
                    >
                      {type.toUpperCase()}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Maximum File Size</label>
            <select
              className="form-select"
              value={question?.fileUploadConfig?.maxFileSize || ""}
              onChange={(e) =>
                updateField(
                  sectionIndex,
                  questionIndex,
                  "fileUploadConfig",
                  {
                    ...question.fileUploadConfig,
                    maxFileSize: e.target.value,
                  },
                  question
                )
              }
            >
              <option value="" disabled>
                Select max file size
              </option>
              <option value="1Mb">1 MB</option>
              <option value="5Mb">5 MB</option>
              <option value="10Mb">10 MB</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicFileConfig;
