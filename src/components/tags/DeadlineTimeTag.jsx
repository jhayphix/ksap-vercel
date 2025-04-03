import { useState, useEffect } from "react";
import { MdAlarm } from "react-icons/md";

const DeadlineTimeTag = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const remaining = getTimeRemaining(deadline);
      setTimeLeft(remaining);
    };

    updateCountdown(); // Initial calculation
    const timer = setInterval(updateCountdown, 1000); // Update every second

    return () => clearInterval(timer);
  }, [deadline]);

  function getTimeRemaining(deadline) {
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) return "Invalid Date";

    const total = deadlineDate - new Date();
    if (total <= 0) return "Expired";

    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / (1000 * 60)) % 60);
    const seconds = Math.floor((total / 1000) % 60);

    return `${days} days ${hours} hours ${minutes} mins ${seconds}`;
  }

  return (
    <div
      className="text-center centering fw-bold text_danger rounded bg_danger_light p-2"
      style={{ fontSize: "0.7rem", fontWeight: "600", width: "13rem" }}
    >
      <MdAlarm size={16} className="me-1 fw-bold" />
      {timeLeft}
    </div>
  );
};

export default DeadlineTimeTag;