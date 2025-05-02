Okay then this is my frontend 


this is the apiCustom.js file 

import axios from "axios";

// const BASE_API_REF = "https://ksap-api.onrender.com/api";
const BASE_API_REF = "http://localhost:5000/api";
export const SCHOLARSHIPS_API_REF = `${BASE_API_REF}/scholarships`;
export const APPLICATIONS_API_REF = `${BASE_API_REF}/applications`;
export const ADMINS_API_REF = `${BASE_API_REF}/admins`;
export const APPLICANTS_API_REF = `${BASE_API_REF}/applicants`;
export const EXTERNAL_SCHOLARSHIPS_API_REF = `${BASE_API_REF}/external-scholarships`;

/**
 * Helper to detect if an object contains any File or Blob.
 */
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

/**
 * Recursively converts a nested object to FormData.
 * @param {object} obj - The object to convert.
 * @param {FormData} formData - The FormData instance.
 * @param {string} [parentKey] - The prefix for nested keys.
 */
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

/**
 * Sends a GET request to retrieve data from the API.
 * @param {string} url - The API endpoint.
 * @returns {Promise<object>} - The response data.
 */
export const getRequest = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data.data?.map((doc) => ({
      ...doc,
      id: doc._id, // Renamed from documentId for clarity
    }));
  } catch (error) {
    console.error("GET request error:", error);
    throw error;
  }
};

/**
 * Sends a POST request to create a new resource.
 * Automatically handles multipart/form-data if a File or Blob is present.
 * @param {string} url - The API endpoint.
 * @param {object|FormData} data - The data to be sent.
 * @returns {Promise<object>} - The response data.
 */
export const postRequest = async (url, data) => {
  try {
    const isMultipart = containsFile(data);
    const payload = isMultipart ? objectToFormData(data) : data;
    const headers = isMultipart
      ? {} // Let Axios/browser handle Content-Type with boundary
      : { "Content-Type": "application/json" };

    const response = await axios.post(url, payload, { headers });
    return response.data;
  } catch (error) {
    console.error("POST request error:", error);
    throw error;
  }
};


/**
 * Sends a PUT request to update an existing resource.
 * Automatically handles multipart/form-data if a File or Blob is present.
 * Sends a PUT request and handles file upload automatically.
 * @param {string} url - The API endpoint.
 * @param {string} id - The ID of the resource.
 * @param {object|FormData} data - The updated data.
 * @returns {Promise<object>} - The response data.
 */
export const putRequest = async (url, id, data) => {
  try {
    const isMultipart = containsFile(data);
    const payload = isMultipart ? objectToFormData(data) : data;
    const headers = isMultipart
  ? {} // Let Axios/browser handle Content-Type with boundary
  : { "Content-Type": "application/json" };


    const response = await axios.put(`${url}/${id}`, payload, { headers });
    return response.data;
  } catch (error) {
    console.error("PUT request error:", error);
    throw error;
  }
};


/**
 * Sends a DELETE request to remove a resource.
 * @param {string} url - The API endpoint.
 * @param {string} id - The ID of the resource.
 * @returns {Promise<object>} - The response data.
 */
export const deleteRequest = async (url, id) => {
  try {
    const response = await axios.delete(`${url}/${id}`);
    return response.data;
  } catch (error) {
    console.error("DELETE request error:", error);
    throw error;
  }
};
