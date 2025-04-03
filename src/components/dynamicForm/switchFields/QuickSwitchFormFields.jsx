import { useContext } from "react";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import TextAreaToList from "./TextAreaToList";

const QuickSwitchFormFields = ({
  fieldType = "text",
  fieldKey = "key",
  fieldValue = "",
  fieldIsRequired = false,
  fieldOptions = [],
  fieldPlaceholder = "Type",
  hasError = false,
  handleFormChange,
}) => {
  const { HELPER } = useContext(ConfigContext);

  // Overide
  fieldPlaceholder = "Type here...";

  // Used for export purposes
  const thisComponentProps = {
    fieldType,
    fieldKey,
    fieldValue,
    fieldIsRequired,
    fieldOptions,
    fieldPlaceholder,
    hasError,
    handleFormChange,
  };

  const onFormChange = (e) => {
    handleFormChange(e);
  };

  if (fieldType === "textarea") {
    return (
      <textarea
        name={fieldKey}
        rows={1}
        className={`form-control ${hasError ? "fieldHasError" : ""}`}
        required={false}
        placeholder={fieldPlaceholder}
        value={
          fieldValue !== undefined && fieldValue !== null ? fieldValue : ""
        }
        onChange={(e) => onFormChange(e)}
      />
    );
  } else if (fieldType === "textareaList") {
    return <TextAreaToList props={thisComponentProps} />;
  } else if (fieldType === "select") {
    return (
      <select
        name={fieldKey}
        className={`form-select ${hasError ? "fieldHasError" : ""}`}
        required={fieldIsRequired}
        value={
          fieldValue !== undefined && fieldValue !== null ? fieldValue : ""
        }
        onChange={(e) => onFormChange(e)}
      >
        <option value="" disabled>
          None
        </option>
        {fieldOptions?.map((option, selectIndex) => (
          <option key={selectIndex} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  } else if (fieldType === "checkbox") {
    return (
      <>
        {fieldOptions?.map((option, checkboxIndex) => (
          <div className="form-check" key={checkboxIndex}>
            <label
              className="me-3 form-check-label"
              htmlFor={`${fieldType}-${fieldKey}-${checkboxIndex}`}
            >
              <input
                name={fieldKey}
                id={`${fieldType}-${fieldKey}-${checkboxIndex}`}
                className="form-check-input form_check_input"
                type="checkbox"
                value={option}
                checked={
                  Array.isArray(fieldValue) && fieldValue.includes(option)
                }
                onChange={(e) => {
                  const newValue = e.target.checked
                    ? [...(fieldValue || []), option]
                    : fieldValue.filter((val) => val !== option);

                  handleFormChange({
                    target: { name: fieldKey, value: newValue },
                  });
                }}
              />{" "}
              {option}
            </label>
          </div>
        ))}
      </>
    );
  } else if (fieldType === "radio") {
    return (
      <>
        {fieldOptions?.map((option, radioIndex) => (
          <div className="form-check" key={radioIndex}>
            <label
              htmlFor={`${fieldType}-${fieldKey}-${radioIndex}`}
              className="me-3 form-check-label"
            >
              <input
                id={`${fieldType}-${fieldKey}-${radioIndex}`}
                type="radio"
                name={fieldKey}
                value={option ?? false}
                // checked={option === fieldValue}
                checked={
                  // Array.isArray(fieldValue) &&
                  HELPER?.containsExactMatch(fieldValue, option)
                }
                onChange={(e) => onFormChange(e)}
                required={fieldIsRequired}
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
        type={fieldType}
        name={fieldKey}
        placeholder={fieldPlaceholder}
        className={`form-control input ${hasError ? "fieldHasError" : ""}`}
        value={
          fieldValue !== undefined && fieldValue !== null ? fieldValue : ""
        }
        onChange={(e) => onFormChange(e)}
        required={fieldIsRequired}
      />
    );
  }
};

export default QuickSwitchFormFields;
