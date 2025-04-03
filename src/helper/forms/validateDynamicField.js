const validateDynamicField = (question, value) => {
  const label = question?.label;
  const required = question?.required;
  const hasValidation = question?.validation;

  let regexPattern = question?.regex?.pattern;
  const errorMessage = question?.regex?.errorMessage;

  if (!required && !hasValidation) {
    return {
      label,
      value,
      hasError: false,
      errorMessage: "",
    };
  }

  const processedValue = Array.isArray(value)
    ? value.map((v) => v?.trim()).filter(Boolean) // Trim and remove empty values
    : value?.trim();

  let hasError = false;
  let message = "";

  if (
    required &&
    (!processedValue ||
      (Array.isArray(processedValue) && processedValue.length === 0))
  ) {
    hasError = true;
    message = `${label} is required.`;
  } else if (hasValidation) {
    if (
      regexPattern &&
      regexPattern.trim() !== "" &&
      typeof processedValue === "string"
    ) {
      // ✅ Remove surrounding slashes if regex is stored as a string
      regexPattern = regexPattern.replace(/^\/|\/$/g, "");

      const regex = new RegExp(regexPattern);
      if (!regex.test(processedValue)) {
        hasError = true;
        message = errorMessage || `Invalid ${label}.`;
      }
    }
  }

  return {
    label,
    value: processedValue,
    hasError,
    errorMessage: hasError ? message : "Looks good!",
  };
};

export default validateDynamicField;
