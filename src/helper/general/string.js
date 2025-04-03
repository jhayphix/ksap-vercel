export const containsSubstringFlexible = (arr, comparisonValue) => {
  // Ensure `arr` is an array, converting a non-array value into an array
  arr = Array.isArray(arr) ? arr : [arr];

  // Convert comparisonValue to a string if possible
  comparisonValue = comparisonValue != null ? String(comparisonValue) : "";

  // Convert everything to lowercase for case-insensitive matching
  const lowerComparison = comparisonValue.toLowerCase();

  return arr.some((val) => {
    if (val == null) return false; // Skip null or undefined values
    const lowerVal = String(val).toLowerCase();
    const regex = new RegExp(`\\b${lowerVal}\\b`, "i"); // Word boundary match
    return regex.test(lowerComparison);
  });
};

export const containsExactMatch = (arr, comparisonValue) => {
  // Ensure `arr` is an array, converting a non-array value into an array
  arr = Array.isArray(arr) ? arr : [arr];

  // Convert comparisonValue to a string if possible
  comparisonValue = comparisonValue != null ? String(comparisonValue) : "";

  // Convert everything to lowercase for case-insensitive exact matching
  const words = comparisonValue.toLowerCase().split(/\s+/); // Split into words

  return arr.some((val) => {
    if (val == null) return false; // Skip null or undefined values
    return words.includes(String(val).toLowerCase());
  });
};
