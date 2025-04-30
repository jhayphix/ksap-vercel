import { useState } from "react";

const ConfirmDeleteModal = ({ itemName, onConfirm, onCancel }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);

  const handleConfirm = () => {
    if (inputValue.trim() === itemName.trim()) {
      setError(null);
      onConfirm(true);
    } else {
      setError("The entered name does not match.");
    }
  };

  return (
    <div>
      <p>
        To confirm deletion, type <strong>{itemName}</strong> exactly as it
        appears:
      </p>
      <input
        type="text"
        className="form-control mt-3"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setError(null);
        }}
        placeholder="Enter name"
      />
      {error && (
        <p className="text-danger bg_danger_light px-2 rounded mt-2">{error}</p>
      )}

      <div className="mt-3 d-flex justify-content-end">
        <button className="btn btn-outline-light me-2" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
