import { useContext, useEffect } from "react";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import PageTransition from "@layouts/PageTransition";

const FlashMessage = ({ className }) => {
  const { showFlashMessage, setShowFlashMessage, flash_message_effect } =
    useContext(ConfigContext);
  const isActive = showFlashMessage?.isActive;
  const message = showFlashMessage?.message;
  const type = showFlashMessage?.type;

  // Close flash message and update sessionStorage
  const closeFlashMessage = () => {
    setShowFlashMessage((prev) => ({ ...prev, isActive: false }));
    sessionStorage.setItem("flashMessageClosed", "true"); // Mark message as closed in sessionStorage
  };

  // Load flash message from sessionStorage only if it hasn't been closed before
  useEffect(() => {
    const storedFlashMessage = sessionStorage.getItem("flashMessage");
    const flashMessageClosed = sessionStorage.getItem("flashMessageClosed");

    // If the flash message hasn't been closed before, show it
    if (!flashMessageClosed && storedFlashMessage) {
      const parsedMessage = JSON.parse(storedFlashMessage);
      setShowFlashMessage({
        isActive: parsedMessage.isActive,
        message: parsedMessage.message,
        type: parsedMessage.type,
      });

      // Remove it after showing so it's not loaded again
      sessionStorage.removeItem("flashMessage");
    }
  }, [setShowFlashMessage]);

  // Save flash message to sessionStorage if it's active
  useEffect(() => {
    if (isActive) {
      sessionStorage.setItem(
        "flashMessage",
        JSON.stringify({ isActive, message, type })
      );
    } else {
      // Remove flash message from sessionStorage when it's not active
      sessionStorage.removeItem("flashMessage");
    }
  }, [isActive, message, type]);

  // Scroll to the flash message when it's active
  useEffect(() => {
    if (isActive) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [isActive]);

  // Don't show the message again after it has been closed
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

  return null; // Return null if no flash message is active
};

export default FlashMessage;
