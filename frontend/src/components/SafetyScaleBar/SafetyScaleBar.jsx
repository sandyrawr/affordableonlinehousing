import React from 'react';
import './SafetyScaleBar.css';

const SafetyScaleBar = ({ rating, max = 10 }) => {
  const percentage = Math.min(100, (rating / max) * 100);
  const getColor = () => {
    const hue = (rating / max) * 120; // 0 (red) to 120 (green)
    return `hsl(${hue}, 80%, 50%)`;
  };

  return (
    <div className="safety-scale-container">
      <div className="safety-scale-bar" style={{
        width: `${percentage}%`,
        backgroundColor: getColor()
      }}></div>
      <span className="safety-scale-label">
        Safety: {rating}/10
      </span>
    </div>
  );
};

export default SafetyScaleBar;