import FileUploadField from "@components/applicationForm/FileUploadField";

const SwitchFormField = ({
  hasError,
  question,
  questionIndex,
  applicationFormData,
  thisSection,
  handleFormChange,
}) => {
  const questionId = question?.id;

  if (question?.type === "textarea") {
    return (
      <textarea
        rows={1}
        className={`form-control ${hasError ? "fieldHasError" : null}`}
        value={applicationFormData?.[questionId]?.response ?? ""}
        onChange={handleFormChange(thisSection, question, questionIndex)}
        required={question?.required}
      />
    );
  } else if (question?.type === "file") {
    return (
      <FileUploadField
        question={question}
        questionIndex={questionIndex}
        section={thisSection}
        formData={applicationFormData}
        onChange={handleFormChange}
        hasError={hasError}
      />
    );
  } else if (question?.type === "select") {
    return (
      <select
        className="form-select"
        value={applicationFormData?.[questionId]?.response ?? ""}
        onChange={handleFormChange(thisSection, question, questionIndex)}
        required={question?.required}
      >
        <option value="">Select {question?.label}</option>
        {Array.isArray(question.options) &&
          question.options.map((option, selectIndex) => (
            <option key={selectIndex} value={option}>
              {option}
            </option>
          ))}
      </select>
    );
  } else if (question?.type === "checkbox") {
    return (
      <>
        {question?.options?.map((option, checkboxIndex) => (
          <div className="form-check" key={checkboxIndex}>
            <label
              className="me-3 form-check-label"
              htmlFor={`${question?.id}-${checkboxIndex}`}
            >
              <input
                id={`${question?.id}-${checkboxIndex}`}
                className="form-check-input form_check_input"
                type="checkbox"
                value={option ?? false}
                checked={
                  Array.isArray(applicationFormData[question?.id]?.response) &&
                  applicationFormData[question?.id]?.response.includes(option)
                }
                onChange={handleFormChange(
                  thisSection,
                  question,
                  questionIndex
                )}
                // required={question?.required}
              />{" "}
              {option}
            </label>
          </div>
        ))}
      </>
    );
  } else if (question?.type === "radio") {
    return (
      <>
        {question?.options?.map((option, radioIndex) => (
          <div className="form-check" key={radioIndex}>
            <label
              htmlFor={`${question?.id}-${radioIndex}`}
              className="me-3 form-check-label"
            >
              <input
                id={`${question?.id}-${radioIndex}`}
                type="radio"
                name={question?.label}
                value={option ?? false}
                checked={option === applicationFormData?.[questionId]?.response}
                onChange={handleFormChange(
                  thisSection,
                  question,
                  questionIndex
                )}
                // required={question?.required}
                className="form-check-input form_check_input"
              />{" "}
              {option}
            </label>
          </div>
        ))}
      </>
    );
  } else {
    return (
      <input
        type={question?.type}
        className={`form-control input ${hasError ? "fieldHasError" : null}`}
        value={applicationFormData?.[questionId]?.response ?? ""}
        onChange={handleFormChange(thisSection, question, questionIndex)}
        required={question?.required}
      />
    );
  }
};

export default SwitchFormField;
