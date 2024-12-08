import React, { useState, useEffect } from "react";

const Timer = ({ startTime, onTimeEnd }) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // Timer duration in seconds (15 minutes)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const gameStart = new Date(startTime).getTime();
      const elapsedTime = Math.floor((now - gameStart) / 1000); // Time elapsed in seconds
      const remainingTime = Math.max(1 * 60 - elapsedTime, 0); // Ensure no negative time
      setTimeLeft(remainingTime);

      if (remainingTime === 0) {
        onTimeEnd(); // Notify parent when the timer reaches zero
      }
    };

    calculateTimeLeft(); // Initial calculation
    const interval = setInterval(calculateTimeLeft, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [startTime, onTimeEnd]);

  // Format time as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div style={{ textAlign: "center", fontSize: "40px", fontWeight: "bold", color: "white" }}>
      {formatTime(timeLeft)}
    </div>
  );
};

export default Timer;
