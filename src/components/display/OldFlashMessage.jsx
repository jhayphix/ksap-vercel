import { useContext, useEffect } from "react";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import PageTransition from "@layouts/PageTransition";

const FlashMessage = ({ className }) => {
  const { showFlashMessage, setShowFlashMessage, flash_message_effect } =
    useContext(ConfigContext);
  const isActive = showFlashMessage?.isActive;
  const message = showFlashMessage?.message;
  const type = showFlashMessage?.type;

  // Close flash message
  const closeFlashMessage = () => {
    setShowFlashMessage((prev) => ({ ...prev, isActive: false }));
  };

  // Scroll to the flash message when it's active
  useEffect(() => {
    if (isActive) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [isActive]);

  if (isActive && message?.length > 3) {
    return (
      <PageTransition effect={flash_message_effect}>
        <div
          className={`${className} alert alert-${
            type === "error" ? "danger" : type
          } alert-dismissible rounded fade show m-0`}
          role="alert"
          style={{
            width: "100%",
            zIndex: 1050,
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <span>{message}</span>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => {
                closeFlashMessage();
              }}
            ></button>
          </div>
        </div>
      </PageTransition>
    );
  }
};

export default FlashMessage;
