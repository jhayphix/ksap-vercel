const validateField = (
  regexKey,
  fieldValue,
  fieldLabel = "",
  isRequired = true
) => {
  let errors = {
    hasError: false,
    message: "Looks good!",
    isReady: false,
  };

  // Use fieldLabel if provided, otherwise fallback to regexKey
  const switchFieldLabel = fieldLabel ? fieldLabel : regexKey;

  // Capitalize the first letter of switchFieldLabel
  const capitalizedLabel =
    switchFieldLabel.charAt(0).toUpperCase() + switchFieldLabel.slice(1);

  // Trim fieldValue if it's a string
  const trimmedValue =
    fieldValue === undefined || fieldValue === null
      ? ""
      : typeof fieldValue === "string"
      ? fieldValue.trim()
      : fieldValue;

  // Validation rules
  const rules = {
    name: /^[A-Za-z\s'().-]+$/, // Letters, spaces, hyphens (-), apostrophes (')
    programmeOfStudy: /^[A-Z][a-zA-Z]*\s[A-Za-z\s]+$/,
    age: /^[1-9][0-9]*$/, // Positive numbers only
    select: /.+/, // Must have a fieldValue
    email: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, // Email format
    phone: /^\+233(?:\d{9})$/, // "Invalid format. Use +233 followed by 9 digits (e.g., +233XXXXXXXXX)"
    password: /^.{6,}$/, // At least 6 characters
    checkbox: fieldValue === true, // Checkbox must be checked
    textarea: /^.{5,}$/, // At least 5 characters
    url: /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})(\/[\w.-]*)*\/?$/, // URL format
    generalText: /.+/, // Non-empty text
    list: (fieldValue, isRequired) =>
      !isRequired || (Array.isArray(fieldValue) && fieldValue.length > 0), // Must be a non-empty array if required
  };

  // Field-specific validation
  if (isRequired === false && !trimmedValue) {
    return errors;
  } else if (["name", "lastName", "firstName", "lastName"].includes(regexKey)) {
    if (!trimmedValue) {
      errors = {
        hasError: true,
        message: `${capitalizedLabel} cannot be empty.`,
        isReady: false,
      };
    } else if (!rules.name.test(trimmedValue)) {
      errors = {
        hasError: true,
        message: `Invalid ${capitalizedLabel} format. Allowed: letters, spaces, hyphens (-), and apostrophes (').`,
        isReady: false,
      };
    }
  } else if (regexKey === "age") {
    if (!trimmedValue) {
      errors = {
        hasError: true,
        message: `${capitalizedLabel} is required.`,
        isReady: false,
      };
    } else if (!rules.age.test(trimmedValue)) {
      errors = {
        hasError: true,
        message: `Invalid ${capitalizedLabel}. Only positive numbers are allowed.`,
        isReady: false,
      };
    }
  } else if (regexKey === "select") {
    if (!trimmedValue) {
      errors = {
        hasError: true,
        message: `Please select a value for ${capitalizedLabel}.`,
        isReady: false,
      };
    }
  } else if (regexKey === "email") {
    if (!trimmedValue) {
      errors = {
        hasError: true,
        message: `${capitalizedLabel} is required.`,
        isReady: false,
      };
    } else if (!rules.email.test(trimmedValue)) {
      errors = {
        hasError: true,
        message: `Invalid ${capitalizedLabel} format.  Example: john@example.com `,
        isReady: false,
      };
    }
  } else if (regexKey === "programmeOfStudy") {
    if (!trimmedValue) {
      errors = {
        hasError: true,
        message: `${capitalizedLabel} is required.`,
        isReady: false,
      };
    } else if (!rules.programmeOfStudy.test(trimmedValue)) {
      errors = {
        hasError: true,
        message: `Invalid ${capitalizedLabel} format. Example: BSc Statistics, PhD MdEngineering.`,
        isReady: false,
      };
    }
  } else if (regexKey === "phone") {
    if (!trimmedValue) {
      errors = {
        hasError: true,
        message: `${capitalizedLabel} is required.`,
        isReady: false,
      };
    } else if (!rules.phone.test(trimmedValue)) {
      errors = {
        hasError: true,
        message: `Invalid ${capitalizedLabel} format. Use +233 followed by 9 digits (e.g., +233XXXXXXXXX).`,
        isReady: false,
      };
    }
  } else if (regexKey === "password") {
    if (!trimmedValue) {
      errors = {
        hasError: true,
        message: `${capitalizedLabel} is required.`,
        isReady: false,
      };
    } else if (!rules.password.test(trimmedValue)) {
      errors = {
        hasError: true,
        message: `${capitalizedLabel} must be at least 6 characters long.`,
        isReady: false,
      };
    }
  } else if (regexKey === "checkbox") {
    if (!fieldValue) {
      errors = {
        hasError: true,
        message: `${capitalizedLabel} must be checked.`,
        isReady: false,
      };
    }
  } else if (regexKey === "textarea") {
    if (!trimmedValue) {
      errors = {
        hasError: true,
        message: `${capitalizedLabel} cannot be empty.`,
        isReady: false,
      };
    } else if (!rules.textarea.test(trimmedValue)) {
      errors = {
        hasError: true,
        message: `${capitalizedLabel} must be at least 5 characters long.`,
        isReady: false,
      };
    }
  } else if (regexKey === "url") {
    if (!trimmedValue) {
      errors = {
        hasError: true,
        message: `${capitalizedLabel} is required.`,
        isReady: false,
      };
    } else if (!rules.url.test(trimmedValue)) {
      errors = {
        hasError: true,
        message: `Invalid ${capitalizedLabel} format. Example: https://example.com`,
        isReady: false,
      };
    }
  } else if (["generalText", "text"].includes(regexKey)) {
    if (trimmedValue === "") {
      errors = {
        hasError: true,
        message: `${capitalizedLabel} cannot be empty.`,
        isReady: false,
      };
    }
  } // Validation for applicationSections that are not required at all (can be empty)
  else if (regexKey === "list") {
    if (isRequired && (!Array.isArray(fieldValue) || fieldValue.length === 0)) {
      errors = {
        hasError: true,
        message: `${capitalizedLabel} must contain at least one item.`,
        isReady: false,
      };
    }
  } else if (["file", "image", "number", "radio"].includes(regexKey)) {
    // Allow empty fieldValue
    if (regexKey === "file" && fieldValue === null) {
      errors = {
        hasError: false,
        message: "No file uploaded",
        isReady: true,
      };
    } else if (regexKey === "image" && fieldValue === null) {
      errors = {
        hasError: false,
        message: "No image uploaded",
        isReady: true,
      };
    }
  }

  // If no error, mark as ready
  if (!errors.hasError) {
    errors.isReady = true;
  }

  return { regexKey, fieldLabel, fieldValue, trimmedValue, ...errors };
};

export default validateField;
