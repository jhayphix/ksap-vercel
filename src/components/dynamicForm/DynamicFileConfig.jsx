const DynamicFileConfig = ({
  question,
  sectionIndex,
  questionIndex,
  updateField,
}) => {
  const questionType = question?.type;

  return (
    <div id="dynamicFormBuilderShowLabelId">
      {/* File Upload Config */}
      {questionType === "file" && (
        <div className="mt-4">
          <h5 className="mb-3 text-center">File Upload Configuration</h5>
          <div className="d-flex align-items-center justify-content-start mb-4">
            <label
              className="form-check-label me-3"
              htmlFor={`restrictFileTypesSwitch-${sectionIndex}-${questionIndex}`}
            >
              Allow only specific file types
            </label>
            <div className="form-check form-switch m-0">
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
            </div>
          </div>

          {question?.fileUploadConfig?.restrictFileTypes && (
            <div className="mb-3">
              <h6 className="form-label mb-3">Allowed File Types</h6>
              <div className="d-flex gap-3">
                {["Pdf", "Document", "Image"].map((type) => (
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
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-3 d-flex">
            <label className="form-label me-2">Maximum File Size</label>
            <select
              style={{ width: "10rem" }}
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
              <option value="1MB">1 MB</option>
              <option value="5MB">5 MB</option>
              <option value="10MB">10 MB</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicFileConfig;
