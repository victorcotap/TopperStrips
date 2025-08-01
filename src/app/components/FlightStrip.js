'use client';

import { useState, useRef, useEffect } from 'react';
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

export default function FlightStrip({ strip, onDelete, onUpdate }) {
  const backgroundColor = getMissionTypeColor(strip.missionType);
  const [isEditingRoute, setIsEditingRoute] = useState(false);
  const [routeValue, setRouteValue] = useState(strip.route);
  const inputRef = useRef(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingRoute && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingRoute]);

  // Update route value when strip changes
  useEffect(() => {
    setRouteValue(strip.route);
  }, [strip.route]);

  const handleRouteDoubleClick = () => {
    setIsEditingRoute(true);
  };

  const handleRouteSave = async () => {
    if (routeValue === strip.route) {
      setIsEditingRoute(false);
      return;
    }

    try {
      const response = await fetch(`/api/strips/${strip.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ route: routeValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to update route');
      }

      const updatedStrip = await response.json();
      
      // Call onUpdate if provided to update parent state
      if (onUpdate) {
        onUpdate(updatedStrip);
      }
      
      setIsEditingRoute(false);
    } catch (error) {
      console.error('Error updating route:', error);
      // Revert to original value on error
      setRouteValue(strip.route);
      setIsEditingRoute(false);
      alert('Failed to update route');
    }
  };

  const handleRouteCancel = () => {
    setRouteValue(strip.route);
    setIsEditingRoute(false);
  };

  const handleRouteKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRouteSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleRouteCancel();
    }
  };

  const handleRouteBlur = () => {
    handleRouteSave();
  };

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
          <div className="flight-strip__mission">{strip.missionType}</div>
        </div>
        <div className="flight-strip__column flight-strip__column--right">
          <div className="flight-strip__route">
            {isEditingRoute ? (
              <input
                ref={inputRef}
                type="text"
                value={routeValue}
                onChange={(e) => setRouteValue(e.target.value)}
                onBlur={handleRouteBlur}
                onKeyDown={handleRouteKeyDown}
                className="flight-strip__route-input"
              />
            ) : (
              <span
                onDoubleClick={handleRouteDoubleClick}
                className="flight-strip__route-display"
                title="Double-click to edit route"
              >
                {strip.route || 'No route'}
              </span>
            )}
          </div>
          <div className="flight-strip__empty"></div>
          <div className="flight-strip__altitude">{formatAltitude(strip.altitude)}</div>
        </div>
      </div>
    </div>
  );
}