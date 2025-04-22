// Convert Firebase Timestamp to JavaScript Date
export const convertToDate = (date) => {
  if (!date) return null;
  if (date?.seconds) return new Date(date.seconds * 1000); // Handle Firestore Timestamp
  return new Date(date);
};

// Get current date in ISO format - 2025-02-09T14:10:00.000Z
export const getISODate = (date = new Date()) => convertToDate(date)?.toISOString() ?? "";

// Format date to `YYYY-MM-DDTHH:MM` for <input type="datetime-local">
export const formatToDatetimeLocal = (date) => {
  const validDate = convertToDate(date);
  return validDate ? validDate.toISOString().slice(0, 16) : "";
};

// Format date to `YYYY-MM-DD` for <input type="date">
export const formatToDateInput = (date) => {
  const validDate = convertToDate(date);
  return validDate ? validDate.toISOString().split("T")[0] : "";
};

// Get date in YYYY-MM-DD format - 2025/02/09
export const getYYYYMMDD = (date = new Date(), separator = "-") => {
  const validDate = convertToDate(date);
  return validDate
    ? validDate.toISOString().split("T")[0].replace(/-/g, separator)
    : "";
};

// Get date in DD-MM-YYYY format (default separator: "-")
export const getDDMMYYYY = (date = new Date(), separator = "-") => {
  const validDate = convertToDate(date);
  return validDate
    ? `${String(validDate.getDate()).padStart(2, "0")}${separator}${String(
        validDate.getMonth() + 1
      ).padStart(2, "0")}${separator}${validDate.getFullYear()}`
    : "";
};

// Get date in MM/DD/YYYY format (default separator: "/")
export const getMMDDYYYY = (date = new Date(), separator = "/") => {
  const validDate = convertToDate(date);
  return validDate
    ? `${String(validDate.getMonth() + 1).padStart(2, "0")}${separator}${String(
        validDate.getDate()
      ).padStart(2, "0")}${separator}${validDate.getFullYear()}`
    : "";
};

// Get time in HH:MM format - 14:10
export const getHHMM = (date = new Date()) => {
  const validDate = convertToDate(date);
  return validDate
    ? `${String(validDate.getHours()).padStart(2, "0")}:${String(
        validDate.getMinutes()
      ).padStart(2, "0")}`
    : "";
};

// Get time in HH:MM:SS format - 14:10:00
export const getHHMMSS = (date = new Date()) => {
  const validDate = convertToDate(date);
  return validDate ? `${getHHMM(validDate)}:${String(validDate.getSeconds()).padStart(2, "0")}` : "";
};

// Get time in HH:MM:SS.sss format - 14:10:00.000
export const getHHMMSSsss = (date = new Date()) => {
  const validDate = convertToDate(date);
  return validDate
    ? `${getHHMMSS(validDate)}.${String(validDate.getMilliseconds()).padStart(3, "0")}`
    : "";
};


// Get date-time in datetime-local format - 2025-02-09T14:10
export const getDatetimeLocal = (date = new Date()) => {
  const validDate = convertToDate(date);
  return validDate ? `${getYYYYMMDD(validDate)}T${getHHMM(validDate)}` : "";
};

// Get date-time in YYYY-MM-DD HH:MM format - 2025-02-09 14:10
export const getYYYYMMDD_HHMM = (date = new Date()) => {
  const validDate = convertToDate(date);
  return validDate ? `${getYYYYMMDD(validDate)} ${getHHMM(validDate)}` : "";
};

// Get date-time in UTC string format - Sun, 09 Feb 2025 14:10:00 GMT
export const getUTCString = (date = new Date()) => {
  const validDate = convertToDate(date);
  return validDate ? validDate.toUTCString() : "";
};

// Get date-time in default JavaScript toString format - Sun Feb 09 2025 14:10:00 GMT+0000
export const getToString = (date = new Date()) => {
  const validDate = convertToDate(date);
  return validDate ? validDate.toString() : "";
};

// Get timestamp in milliseconds - 1739081400000
export const getTimestamp = (date = new Date()) => {
  const validDate = convertToDate(date);
  return validDate ? validDate.getTime() : null;
};

// Format a date string into a human-readable format - Sun, February 9, 2025, 2:10 PM
export const formatDateTime = (
  date,
  dateObj = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    nullValue: "Invalid Date",
  }
) => {
  const validDate = convertToDate(date);
  return validDate
    ? validDate.toLocaleString("en-GB", {
        weekday: dateObj?.weekday ?? undefined,
        year: dateObj?.year ?? undefined,
        month: dateObj?.month ?? undefined,
        day: dateObj?.day ?? undefined,
        hour: dateObj?.hour ?? undefined,
        minute: dateObj?.minute ?? undefined,
        hour12: dateObj?.hour12 ?? true,
      })
    : dateObj?.nullValue;
};

// Format a date string into a human-readable format - Nov 25, 2025
export const formatDateMMDDYYY = (date) => {
  const validDate = convertToDate(date);
  return validDate
    ? validDate.toLocaleDateString("en-GB", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "Invalid Date";
};
