"use client"
import React, { useState, useEffect } from 'react';

const Timer = () => {
  // Initializing the time remaining in seconds (20 minutes)
  const [timeRemaining, setTimeRemaining] = useState(15 * 60);

  useEffect(() => {
    // Exit early if the timer reaches zero
    if (timeRemaining === 0) return;

    // Set up an interval to update the timer every second
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    // Cleanup interval when component is unmounted or timer reaches zero
    return () => clearInterval(interval);
  }, [timeRemaining]); // Re-run when timeRemaining changes

  // Format the time into minutes and seconds
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  // Render the timer and "Time's up!" message when the timer ends
  return (
    <div className='text-4xl p-2'>
      {timeRemaining > 0 ? (
        <h1>
          {minutes}:{seconds < 10 ? '0' : ''}{seconds}
        </h1>
      ) : (
        <h1>Time's up!</h1>
      )}
    </div>
  );
};

export default Timer;
