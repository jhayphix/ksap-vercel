import { db } from "@src/firebaseConfig";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const SCHOLARSHIPS_API_REF = collection(db, "scholarships");
export const APPLICATIONS_API_REF = collection(db, "applications");
export const ADMINS_API_REF = collection(db, "admins");
export const APPLICANTS_API_REF = collection(db, "applicants");
export const DATABASE_TABLE_NAMES = {
  SCHOLARSHIPS_TABLE_NAME: "scholarships",
  APPLICATIONS_TABLE_NAME: "applications",
  APPLICANTS_TABLE_NAME: "applicants",
  ADMINS_TABLE_NAME: "admins",
};

/**
 * Retrieves all documents from a Firestore collection.
 * @param {CollectionReference} collectionRef - Firestore collection reference.
 * @returns {Promise<Array<object>>} - Array of documents with their data.
 */
export const getRequest = async (collectionRef) => {
  try {
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id, // Renamed from documentId for clarity
    }));
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

/**
 * Sends a POST request to add a new document to a Firestore collection.
 * @param {CollectionReference} collectionRef - Firestore collection reference.
 * @param {object} data - The data to be added.
 * @returns {Promise<string>} - The ID of the newly created document.
 */
export const postRequest = async (collectionRef, data) => {
  try {
    const docRef = await addDoc(collectionRef, data);
    return docRef.id; // Return the new document ID
  } catch (error) {
    console.error("POST request error:", error);
    throw error;
  }
};

/**
 * Sends a PUT request to update an existing document in a Firestore collection.
 * @param {CollectionReference} collectionRef - Firestore collection reference.
 * @param {string} documentId - The ID of the document to update.
 * @param {object} data - The updated data.
 * @returns {Promise<void>}
 */
export const putRequest = async (
  collectionRef,
  documentId,
  data,
  collectionName
) => {
  try {
    // Validate inputs to prevent errors
    if (!collectionName) throw new Error("Collection name is required.");
    if (!documentId) throw new Error("Document ID is required.");

    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, data);

    // Fetch the updated document and return it
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.exists()
      ? { id: updatedDoc.id, ...updatedDoc.data() }
      : null;
  } catch (error) {
    console.error("PUT request error:", error);
    throw error;
  }
};

/**
 * Sends a DELETE request to remove a document from a Firestore collection.
 * @param {CollectionReference} collectionRef - Firestore collection reference.
 * @param {string} documentId - The ID of the document to delete.
 * @returns {Promise<void>}
 */
export const deleteRequest = async (
  collectionRef,
  documentId,
  collectionName
) => {
  try {
    if (!collectionName) throw new Error("Collection name is required.");
    if (!documentId) throw new Error("Document ID is required.");

    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("DELETE request error:", error);
    throw error;
  }
};