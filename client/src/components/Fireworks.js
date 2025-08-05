import React from 'react';
import './Fireworks.css';

const Fireworks = ({ show }) => {
  return (
    <div className={`fireworks-container ${show ? 'show' : ''}`}>
      <div className="firework"></div>
      <div className="firework"></div>
      <div className="firework"></div>
      <div className="firework"></div>
      <div className="firework"></div>
    </div>
  );
};

export default Fireworks;