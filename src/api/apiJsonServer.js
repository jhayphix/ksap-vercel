import axios from "axios";

export const SCHOLARSHIPS_API_REF = "http://localhost:3002/scholarships";
export const APPLICATIONS_API_REF = "http://localhost:3003/applications";
export const ADMINS_API_REF = "http://localhost:3004/admins";
export const APPLICANTS_API_REF = "http://localhost:3005/applicants";

/**
 * Sends a GET request to retrieve data from the API.
 * @param {string} url - The API endpoint.
 * @returns {Promise<object>} - The response data.
 */
export const getRequest = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("GET request error:", error);
    throw error;
  }
};

/**
 * Sends a POST request to create a new resource.
 * @param {string} url - The API endpoint.
 * @param {object} data - The data to be sent.
 * @returns {Promise<object>} - The response data.
 */
export const postRequest = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error("POST request error:", error);
    throw error;
  }
};

/**
 * Sends a PUT request to update an existing resource.
 * @param {string} url - The API endpoint.
 * @param {string} id - The ID of the resource.
 * @param {object} data - The updated data.
 * @returns {Promise<object>} - The response data.
 */
export const putRequest = async (url, id, data) => {
  try {
    const response = await axios.put(`${url}/${id}`, data);
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
