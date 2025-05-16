import { useState } from "react";
import axios from "axios";
import React from "react";

const TestPage = () => {
  const [file, setFile] = useState();

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("file: ", file);
      console.log("formData: ", formData);

      const res = await axios.post(
        "http://localhost:5000/api/test/upload",
        formData
      );
      console.log("Upload successful:", res.data);
    } catch (error) {
      console.error("Error occurred at client:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="button" onClick={upload}>
        Upload
      </button>
    </div>
  );
};

export default TestPage;
