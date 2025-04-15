import validateField from "@src/helper/forms/validateField";
import validateDynamicField from "@src/helper/forms/validateDynamicField";
import { setLocalStorage, getLocalStorage } from "@src/helper/forms/storage";
import {
  generateAcademicYears,
  getYearsOfStudy,
} from "@src/helper/eduUtils/academicUtils";
import {
  toProperCase,
  capitalizeFirstLetterOnly,
} from "@src/helper/general/transform";
import { formatToKOrM } from "@src/helper/general/numbers";
import {
  containsExactMatch,
  containsSubstringFlexible,
} from "@src/helper/general/string";
import {
  hasAppliedForScholarship,
  isDeadlineDue,
  getStatusWithColor,
} from "@src/helper/applications/applicationsUtils";

import { findAdminById } from "@src/helper/queries/adminQuery";
import {
  getApplicationsByStatus,
  getApplicationsWhere,
} from "@src/helper/queries/applicationQuery";

import {
  getISODate,
  getYYYYMMDD,
  getDDMMYYYY,
  getMMDDYYYY,
  getHHMM,
  getHHMMSS,
  getHHMMSSsss,
  getDatetimeLocal,
  formatToDatetimeLocal,
  formatToDateInput,
  getYYYYMMDD_HHMM,
  getUTCString,
  getToString,
  getTimestamp,
  formatDateTime,
  formatDateMMDDYYY,
} from "@src/helper/datetime/datetime";

const HELPER = {
  // Queries
  findAdminById, // (admins, adminId)
  getApplicationsWhere, // (  applications,  scholarshipId,  key, value)
  getApplicationsByStatus, // (  applications,  scholarshipId,  statusKey)

  // Scholarship Application
  hasAppliedForScholarship, // ( applicantId, scholarshipId, applications)
  isDeadlineDue, // (deadline)
  getStatusWithColor, // Status

  // Number
  formatToKOrM, // ( num,  decimals = 1,  thousandSuffix = "K",  millionSuffix = "M")

  // String
  containsExactMatch, // (array, value)
  containsSubstringFlexible, // (array, value)

  // Transform
  toProperCase, // (value) [value to be transformed]
  capitalizeFirstLetterOnly, // (value) [value to be transformed]

  // Form
  validateField, // (fieldName, value, label = "", extra = {})
  validateDynamicField, // ( label, value, required, regex, errorMessage)

  // Storage
  setLocalStorage, // (key, data) thus (Name to given, data to score)
  getLocalStorage, // (key) thus (the name to the data to retrieve)

  // Academic Unit
  generateAcademicYears, // () Return an array
  getYearsOfStudy, // () Return an array

  // DateTime Utility Functions Output Formats

  getISODate, // → "2025-02-09T14:10:00.000Z"
  getYYYYMMDD, // → "2025-02-09"
  getDDMMYYYY, // → "09-02-2025"
  getMMDDYYYY, // → "02-09-2025"
  getHHMM, // → "14:10"
  getHHMMSS, // → "14:10:30"
  getHHMMSSsss, // → "14:10:30.123"
  getDatetimeLocal, // → "2025-02-09T14:10"
  formatToDatetimeLocal, // → "2025-02-09T14:10"
  formatToDateInput, // → "2025-02-09"
  getYYYYMMDD_HHMM, // → "2025-02-09 14:10"
  getUTCString, // → "Sun, 09 Feb 2025 14:10:00 GMT"
  getToString, // → "Sun Feb 09 2025 14:10:00 GMT+0000 (Coordinated Universal Time)"
  getTimestamp, // → 1733782200000
  formatDateTime, // → "Sun, Feb 9, 2025, 02:10 PM"
  formatDateMMDDYYY, // → "Feb 09, 2025"
};
export default HELPER;
