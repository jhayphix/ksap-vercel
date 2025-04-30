import { useContext } from "react";
import { ConfigContext } from "@contexts/ConfigContextProvider";

const DefaultModal = () => {
  // ---------------------------- Context
  const { showModal, setShowModal } = useContext(ConfigContext);

  const modalIsActive = showModal?.isActive;
  const modalTitle = showModal?.title;
  const modalMessage = showModal?.message;
  const modalAction = showModal?.action;

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
          // onClick={handleCloseModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from propagating
          >
            <div className="modal-content bg_secondary">
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
              <div className="modal-body">
                {typeof modalMessage === "string" ? (
                  <p>{modalMessage}</p>
                ) : (
                  modalMessage
                )}
              </div>
              <div className="modal-footer">
                {modalAction && (
                  <>
                    <button
                      type="button"
                      className="btn btn-outline-light"
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DefaultModal;
