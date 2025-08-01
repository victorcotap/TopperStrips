'use client';

import { formatAltitude } from '@/models/FlightStrip';

// Function to get background color based on mission type
function getMissionTypeColor(missionType) {
  const colorMap = {
    'CAP': '#fef3e2',      // Pale amber
    'CAS': '#e0f2fe',      // Pale cyan  
    'Strike': '#fee2e2',   // Pale red
    'SEAD': '#f0f9ff',     // Pale blue
    'BAI': '#f3e8ff',      // Pale purple
    'Pattern': '#f0fdf4',  // Pale green
    'VFR': '#fffbeb',      // Pale yellow
    'IFR': '#f8fafc'       // Pale gray
  };
  return colorMap[missionType] || '#ffffff'; // Default to white
}

export default function FlightStrip({ strip, onDelete }) {
  const backgroundColor = getMissionTypeColor(strip.missionType);
  
  return (
    <div
      draggable
      className="flight-strip"
      style={{ backgroundColor }}
      onDragStart={(e) => {
        e.dataTransfer.setData('stripId', strip.id);
        e.dataTransfer.setData('sourceColumn', strip.column);
      }}
    >
      <div className="flight-strip__delete-container">
        <button
          onClick={() => onDelete(strip.id)}
          className="flight-strip__delete"
          title="Delete strip"
        >
          ×
        </button>
      </div>
      <div className="flight-strip__grid">
        <div className="flight-strip__column flight-strip__column--left">
          <div className="flight-strip__callsign">{strip.callsign}</div>
          <div className="flight-strip__aircraft">{strip.aircraftType}</div>
          <div className="flight-strip__count">
            {strip.numberOfAircrafts}
          </div>
        </div>
        <div className="flight-strip__column flight-strip__column--center">
          <div className="flight-strip__origin">{strip.origin}</div>
          <div className="flight-strip__destination">{strip.destination}</div>
          <div className="flight-strip__empty"></div>
        </div>
        <div className="flight-strip__column flight-strip__column--right">
          <div className="flight-strip__mission">{strip.missionType}</div>
          <div className="flight-strip__empty"></div>
          <div className="flight-strip__altitude">{formatAltitude(strip.altitude)}</div>
        </div>
      </div>
    </div>
  );
}