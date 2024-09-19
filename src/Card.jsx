import React from "react";
import "./Card.css"; // Ensure you have this file for styling

const Card = ({ safeDistance }) => {
  return (
    <div className="info-card">
      <h2>Trail-Quester Information</h2>
      <p>
        <span className="pirate-zone">
          <span className="circle red"></span>
          <span className="cross"></span>
        </span>
        <strong> Pirate Zone:</strong> Represents areas with pirates.
      </p>
      <p>
        <span className="circle grey"></span>
        <strong> Cyclone Zone:</strong> Represents cyclone zones.
      </p>
      <p>
        Each grid square represents an area of <strong>50 km x 50 km</strong>.
      </p>
      <p>
        Cyclone diameter: <strong>300 km</strong>.
      </p>
      <p>
        Recommended safe distance from a cyclone: <strong>10 km</strong>.
      </p>
      <p>
        Safe distance to nearest cyclone from the path: <strong>10 km</strong>.
      </p>
    </div>
  );
};

export default Card;
