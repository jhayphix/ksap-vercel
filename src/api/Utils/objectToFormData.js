/**
 * Recursively converts a nested object to FormData.
 * @param {object} obj - The object to convert.
 * @param {FormData} formData - The FormData instance.
 * @param {string} [parentKey] - The prefix for nested keys.
 */

// @desc    Recursively converts a nested object to FormData
const objectToFormData = (obj, formData = new FormData(), parentKey = "") => {
  if (obj instanceof File || obj instanceof Blob) {
    formData.append(parentKey, obj);
  } else if (Array.isArray(obj)) {
    obj.forEach((value, index) => {
      const key = `${parentKey}[${index}]`;
      objectToFormData(value, formData, key);
    });
  } else if (typeof obj === "object" && obj !== null) {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;
      objectToFormData(value, formData, fullKey);
    });
  } else {
    formData.append(parentKey, obj ?? "");
  }

  return formData;
};

export default objectToFormData;
