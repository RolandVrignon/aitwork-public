import React, { useState, useEffect } from 'react';

const ProgressBar = ({ rounds, initialProgress, status }) => {
  const [currentProgress, setCurrentProgress] = useState(initialProgress);

  useEffect(() => {
    const maxProgress = status + 19;
    let intervalId;

    const simulateProgress = () => {
      setCurrentProgress(prevProgress => {
        const randomIncrement = Math.floor(Math.random() * 5); // Incrémente de 0 à 4% aléatoirement
        const newProgress = prevProgress + randomIncrement;
        if (newProgress < maxProgress) {
          return newProgress;
        }
        clearInterval(intervalId); // Arrêter si on atteint le max avant l'update
        return maxProgress; // Assurez que la progression ne dépasse pas maxProgress
      });
    }

    if (status < 100) {
      intervalId = setInterval(simulateProgress, rounds * 45 * 1000 / 20);
    }

    // Cleanup de l'intervalle à la désinscription du composant ou si status change
    return () => {
      clearInterval(intervalId);
    };
  }, [status, rounds]); // Inclure rounds dans le tableau de dépendances

  return (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${currentProgress}%` }}>
        <span className="status-info">{currentProgress}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
