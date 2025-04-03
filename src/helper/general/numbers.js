export const formatToKOrM = (
  num,
  useCommas = true,
  decimals = 2,
  thousandSuffix = "K",
  millionSuffix = "M"
) => {
  // Ensure num is a valid number (even if it's a string)
  num = Number(num);

  if (isNaN(num)) {
    return "Invalid number"; // Handle if num is invalid
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000)?.toFixed(decimals) + millionSuffix;
  } else if (num >= 1_000) {
    return (num / 1_000)?.toFixed(decimals) + thousandSuffix;
  }
  return useCommas ? num?.toLocaleString() : num?.toString();
};
