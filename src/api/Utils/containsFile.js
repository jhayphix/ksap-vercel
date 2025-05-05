// @desc    Helper to detect if an object contains any File or Blob.
const containsFile = (obj) => {
  if (obj instanceof File || obj instanceof Blob) return true;

  if (Array.isArray(obj)) {
    return obj.some(containsFile);
  }

  if (typeof obj === "object" && obj !== null) {
    return Object.values(obj).some(containsFile);
  }

  return false;
};

export default containsFile;
