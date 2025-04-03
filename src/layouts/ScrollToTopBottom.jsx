import { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const ScrollToTopBottom = () => {
  const [scrollContainer, setScrollContainer] = useState(null);

  useEffect(() => {
    // Get the scrollable container inside #app_wrapper
    const container = document.querySelector("#app_wrapper main.has_scrollbar");
    setScrollContainer(container);
  }, []);

  const scrollToTop = () => {
    scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    scrollContainer?.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: "smooth",
    });
  };

  const iconSize = 20;
  const buttonSize = 40;
  const buttonStyle = { width: buttonSize, height: buttonSize };

  return (
    <div
      className="position-absolute bottom-0 end-0 mb-3 me-3 d-flex flex-column gap-2"
      style={{ zIndex: 1000, right: "10px", bottom: "10px" }}
    >
      <button
        type="button"
        className="btn btn_secondary_2 rounded-circle d-flex justify-content-center align-items-center shadow"
        style={buttonStyle}
        onClick={scrollToTop}
      >
        <FaArrowUp size={iconSize} />
      </button>

      <button
        type="button"
        className="btn btn-secondary rounded-circle d-flex justify-content-center align-items-center shadow"
        style={buttonStyle}
        onClick={scrollToBottom}
      >
        <FaArrowDown size={iconSize} />
      </button>
    </div>
  );
};

export default ScrollToTopBottom;
