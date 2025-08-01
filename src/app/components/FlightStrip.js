'use client';

import { formatAltitude } from '@/models/FlightStrip';

export default function FlightStrip({ strip, onDelete }) {
  return (
    <div
      draggable
      className="flight-strip"
      onDragStart={(e) => {
        e.dataTransfer.setData('stripId', strip.id);
        e.dataTransfer.setData('sourceColumn', strip.column);
      }}
    >
      <div className="flight-strip__header">
        <span className="flight-strip__plane-type">{strip.callsign}</span>
        <button
          onClick={() => onDelete(strip.id)}
          className="flight-strip__delete"
          title="Delete strip"
        >
          ×
        </button>
      </div>
      <div className="flight-strip__details">
        <div className="flight-strip__label">Aircraft:</div>
        <div className="flight-strip__value">
          {strip.aircraftType}
          {strip.numberOfAircrafts > 1 && ` (${strip.numberOfAircrafts})`}
        </div>
        <div className="flight-strip__label">Mission:</div>
        <div className="flight-strip__value">{strip.missionType}</div>
        <div className="flight-strip__label">Alt:</div>
        <div className="flight-strip__value">{formatAltitude(strip.altitude)}</div>
        <div className="flight-strip__label">From:</div>
        <div className="flight-strip__value">{strip.origin}</div>
        <div className="flight-strip__label">To:</div>
        <div className="flight-strip__value">{strip.destination}</div>
      </div>
    </div>
  );
}