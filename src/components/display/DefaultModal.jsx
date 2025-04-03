import { useContext } from "react";
import { ConfigContext } from "@contexts/ConfigContextProvider";

const DefaultModal = () => {
  // ---------------------------- Context
  const { showModel, setShowModal } = useContext(ConfigContext);

  const modalIsActive = showModel?.isActive;
  const modalTitle = showModel?.title;
  const modalMessage = showModel?.message;
  const modalAction = showModel?.action;

  const handleCloseModal = () => {
    setShowModal((prev) => ({
      ...prev,
      isActive: false,
    }));
  };

  const handleModalAction = () => {
    modalAction();
  };

  // ---------------------------- Return
  return (
    <div>
      {/* Modal */}
      {modalIsActive && (
        <div
          className="modal fade show"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden={!modalIsActive}
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Backdrop color
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          onClick={handleCloseModal} // Close modal on backdrop click
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from propagating
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {modalTitle}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseModal} // Close modal
                ></button>
              </div>
              <div className="modal-body">{modalMessage}</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleModalAction}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DefaultModal;
