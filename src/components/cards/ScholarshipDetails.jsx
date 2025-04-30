import ScholarshipHeaderCard from "@components/cards/ScholarshipHeaderCard";
import SectionHeaderCard from "@components/cards/SectionHeaderCard";

const ScholarshipDetails = ({ scholarshipData, className }) => {
  const { requirements, applicationSections } = scholarshipData || {}; // Ensure scholarshipData is not undefined

  const applicationSectionsLength = applicationSections?.length;

  const getSectionLabel = (sectionIndex) => {
    return `Section ${sectionIndex + 1} of ${applicationSectionsLength}`;
  };
  return (
    <div className={`${className} px-0`}>
      {/* Scholarship Details */}
      <ScholarshipHeaderCard
        className="mb-5"
        scholarshipData={scholarshipData}
      />

      <div className="bg_light py-4 px-4 mb-5 rounded">
        {" "}
        {requirements?.length > 0 ? (
          <>
            <h5 className="h5 mb-2">Requirements</h5>
            <ul className="list-group">
              {requirements?.map((req, requirementIndex) => (
                <li key={requirementIndex} className="list-group-item">
                  {req}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
      <div className="rounded">
        {/* Render Fields Dynamically (Without Description) */}
        {applicationSectionsLength > 0 ? (
          <>
            {applicationSections?.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-5">
                <SectionHeaderCard
                  title={section?.sectionTitle}
                  subTitle={getSectionLabel(sectionIndex)}
                />
                <div className="list-group bg_light pt-4 pb-5 px-3">
                  <p className="text-muted mb-3">
                    {section?.sectionDescription}
                  </p>
                  {section?.sectionQuestions?.map((question, questionIndex) => (
                    <li key={questionIndex} className="list-group-item">
                      <div>
                        <strong>{question?.label}:</strong>{" "}
                        <span
                          className="me-2 text-muted"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {question?.description}
                        </span>
                        <span className="fw-bold text-danger">
                          {question?.required ? "*" : null}
                        </span>
                      </div>

                      {/* Validation */}
                      {question?.validation ? (
                        <div className="ps-4 mt-3 text-secondary border-start border-secondary border-4">
                          <div className="">
                            <strong>Regex Pattern:</strong>{" "}
                            {question?.regex?.pattern}
                          </div>
                          <div className="">
                            <strong>Comparism Operator:</strong>{" "}
                            {question?.regex?.comparismOperator}
                          </div>
                          <div className="">
                            <strong>Error Message</strong> "
                            {question?.regex?.errorMessage}"
                          </div>
                        </div>
                      ) : null}

                      {/* Options */}
                      {question?.options?.length > 0 ? (
                        <div className="ps-4 mt-3 border-start border-secondary border-4">
                          <div className="text-secondary">
                            <strong className="text-dark mb-1">Options</strong>{" "}
                            <div className="ms-3">
                              {question?.options?.map((option, optionIndex) => {
                                return <div key={optionIndex}>{option}</div>;
                              })}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {/* File Upload Config */}
                      {question?.type === "file" &&
                      question?.fileUploadConfig ? (
                        <div className="ps-4 mt-3 border-start border-secondary border-4">
                          <div className="text-secondary">
                            <strong className="text-dark d-block mb-2">
                              File Upload Settings
                            </strong>
                            <div className="ms-3">
                              <div>
                                <strong>Allow only specific file types:</strong>{" "}
                                {question?.fileUploadConfig?.restrictFileTypes
                                  ? "Yes"
                                  : "No"}
                              </div>
                              {question?.fileUploadConfig?.restrictFileTypes &&
                              question?.fileUploadConfig?.allowedFileTypes
                                ?.length > 0 ? (
                                <div>
                                  <strong>Allowed File Types:</strong>{" "}
                                  {question?.fileUploadConfig?.allowedFileTypes.join(
                                    ", "
                                  )}
                                </div>
                              ) : null}
                              <div>
                                <strong>Max File Size:</strong>{" "}
                                {question?.fileUploadConfig?.maxFileSize}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ScholarshipDetails;
