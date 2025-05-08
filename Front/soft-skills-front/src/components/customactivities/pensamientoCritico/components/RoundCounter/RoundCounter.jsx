import { useState, useEffect } from 'react';
import './RoundCounter.css';

const RoundCounter = ({ currentRound, totalRounds }) => {
  const [remainingRounds, setRemainingRounds] = useState(totalRounds);

  useEffect(() => {
    setRemainingRounds(totalRounds - currentRound);
  }, [currentRound, totalRounds]);

  return (
    <div className="round-counter">
      <div className="round-counter-content">
        <span className="round-counter-text">Rondas restantes:</span>
        <span className="round-counter-number">{remainingRounds}</span>
        <span className="round-counter-total">/{totalRounds}</span>
      </div>
    </div>
  );
};

export default RoundCounter; 