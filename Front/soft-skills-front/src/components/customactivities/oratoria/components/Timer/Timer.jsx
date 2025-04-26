import { useEffect, useState } from "react";

import "./Timer.css";

const Timer = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    if (timeLeft <= 5000) {
      setIsEnding(true);
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (ms) => {
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}s`;
  };

  return (
    <div className={`timer-box ${isEnding ? "ending" : ""}`}>
      <span className="timer-text">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;
