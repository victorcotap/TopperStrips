'use client';

import { useState, useRef, useEffect } from 'react';
import { formatAltitude, MISSION_TYPES, AIRCRAFT_TYPES } from '@/models/FlightStrip';

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

export default function FlightStrip({ strip, onDelete, onUpdate, area }) {
  const backgroundColor = getMissionTypeColor(strip.missionType);
  
  // Editing states for all fields
  const [isEditingCallsign, setIsEditingCallsign] = useState(false);
  const [callsignValue, setCallsignValue] = useState(strip.callsign);
  const [isEditingAircraftType, setIsEditingAircraftType] = useState(false);
  const [aircraftTypeValue, setAircraftTypeValue] = useState(strip.aircraftType);
  const [isEditingOrigin, setIsEditingOrigin] = useState(false);
  const [originValue, setOriginValue] = useState(strip.origin);
  const [isEditingDestination, setIsEditingDestination] = useState(false);
  const [destinationValue, setDestinationValue] = useState(strip.destination);
  const [isEditingMissionType, setIsEditingMissionType] = useState(false);
  const [missionTypeValue, setMissionTypeValue] = useState(strip.missionType);
  const [isEditingRoute, setIsEditingRoute] = useState(false);
  const [routeValue, setRouteValue] = useState(strip.route);
  const [isEditingAltitude, setIsEditingAltitude] = useState(false);
  const [altitudeValue, setAltitudeValue] = useState(strip.altitude);
  
  // Refs for all input fields
  const callsignInputRef = useRef(null);
  const aircraftTypeInputRef = useRef(null);
  const originInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const missionTypeInputRef = useRef(null);
  const routeInputRef = useRef(null);
  const altitudeInputRef = useRef(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingCallsign && callsignInputRef.current) {
      callsignInputRef.current.focus();
      callsignInputRef.current.select();
    }
  }, [isEditingCallsign]);

  useEffect(() => {
    if (isEditingAircraftType && aircraftTypeInputRef.current) {
      aircraftTypeInputRef.current.focus();
    }
  }, [isEditingAircraftType]);

  useEffect(() => {
    if (isEditingOrigin && originInputRef.current) {
      originInputRef.current.focus();
      originInputRef.current.select();
    }
  }, [isEditingOrigin]);

  useEffect(() => {
    if (isEditingDestination && destinationInputRef.current) {
      destinationInputRef.current.focus();
      destinationInputRef.current.select();
    }
  }, [isEditingDestination]);

  useEffect(() => {
    if (isEditingMissionType && missionTypeInputRef.current) {
      missionTypeInputRef.current.focus();
    }
  }, [isEditingMissionType]);

  useEffect(() => {
    if (isEditingRoute && routeInputRef.current) {
      routeInputRef.current.focus();
      routeInputRef.current.select();
    }
  }, [isEditingRoute]);

  useEffect(() => {
    if (isEditingAltitude && altitudeInputRef.current) {
      altitudeInputRef.current.focus();
      altitudeInputRef.current.select();
    }
  }, [isEditingAltitude]);

  // Update field values when strip changes
  useEffect(() => {
    setCallsignValue(strip.callsign);
  }, [strip.callsign]);

  useEffect(() => {
    setAircraftTypeValue(strip.aircraftType);
  }, [strip.aircraftType]);

  useEffect(() => {
    setOriginValue(strip.origin);
  }, [strip.origin]);

  useEffect(() => {
    setDestinationValue(strip.destination);
  }, [strip.destination]);

  useEffect(() => {
    setMissionTypeValue(strip.missionType);
  }, [strip.missionType]);

  useEffect(() => {
    setRouteValue(strip.route);
  }, [strip.route]);

  useEffect(() => {
    setAltitudeValue(strip.altitude);
  }, [strip.altitude]);

  // Generic save function
  const saveFieldValue = async (fieldName, newValue, currentValue, setEditing) => {
    if (newValue === currentValue) {
      setEditing(false);
      return;
    }

    try {
      const response = await fetch(`/api/strips/${strip.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [fieldName]: newValue }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${fieldName}`);
      }

      const updatedStrip = await response.json();
      
      if (onUpdate) {
        onUpdate(updatedStrip);
      }
      
      setEditing(false);
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
      alert(`Failed to update ${fieldName}`);
      setEditing(false);
    }
  };

  // Callsign handlers
  const handleCallsignDoubleClick = () => setIsEditingCallsign(true);
  const handleCallsignSave = () => saveFieldValue('callsign', callsignValue, strip.callsign, setIsEditingCallsign);
  const handleCallsignCancel = () => {
    setCallsignValue(strip.callsign);
    setIsEditingCallsign(false);
  };
  const handleCallsignKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCallsignSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCallsignCancel();
    }
  };
  const handleCallsignBlur = () => handleCallsignSave();

  // Aircraft Type handlers
  const handleAircraftTypeDoubleClick = () => setIsEditingAircraftType(true);
  const handleAircraftTypeSave = () => saveFieldValue('aircraftType', aircraftTypeValue, strip.aircraftType, setIsEditingAircraftType);
  const handleAircraftTypeCancel = () => {
    setAircraftTypeValue(strip.aircraftType);
    setIsEditingAircraftType(false);
  };
  const handleAircraftTypeKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAircraftTypeSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleAircraftTypeCancel();
    }
  };
  const handleAircraftTypeBlur = () => handleAircraftTypeSave();

  // Origin handlers
  const handleOriginDoubleClick = () => setIsEditingOrigin(true);
  const handleOriginSave = () => saveFieldValue('origin', originValue, strip.origin, setIsEditingOrigin);
  const handleOriginCancel = () => {
    setOriginValue(strip.origin);
    setIsEditingOrigin(false);
  };
  const handleOriginKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleOriginSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleOriginCancel();
    }
  };
  const handleOriginBlur = () => handleOriginSave();

  // Destination handlers
  const handleDestinationDoubleClick = () => setIsEditingDestination(true);
  const handleDestinationSave = () => saveFieldValue('destination', destinationValue, strip.destination, setIsEditingDestination);
  const handleDestinationCancel = () => {
    setDestinationValue(strip.destination);
    setIsEditingDestination(false);
  };
  const handleDestinationKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleDestinationSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleDestinationCancel();
    }
  };
  const handleDestinationBlur = () => handleDestinationSave();

  // Mission Type handlers
  const handleMissionTypeDoubleClick = () => setIsEditingMissionType(true);
  const handleMissionTypeSave = () => saveFieldValue('missionType', missionTypeValue, strip.missionType, setIsEditingMissionType);
  const handleMissionTypeCancel = () => {
    setMissionTypeValue(strip.missionType);
    setIsEditingMissionType(false);
  };
  const handleMissionTypeKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleMissionTypeSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleMissionTypeCancel();
    }
  };
  const handleMissionTypeBlur = () => handleMissionTypeSave();

  // Route handlers
  const handleRouteDoubleClick = () => setIsEditingRoute(true);
  const handleRouteSave = () => saveFieldValue('route', routeValue, strip.route, setIsEditingRoute);
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
  const handleRouteBlur = () => handleRouteSave();

  // Altitude handlers
  const handleAltitudeDoubleClick = () => setIsEditingAltitude(true);
  const handleAltitudeSave = () => saveFieldValue('altitude', altitudeValue, strip.altitude, setIsEditingAltitude);
  const handleAltitudeCancel = () => {
    setAltitudeValue(strip.altitude);
    setIsEditingAltitude(false);
  };
  const handleAltitudeKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAltitudeSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleAltitudeCancel();
    }
  };
  const handleAltitudeBlur = () => handleAltitudeSave();

  return (
    <div
      draggable
      className="flight-strip"
      style={{ backgroundColor }}
      onDragStart={(e) => {
        e.dataTransfer.setData('stripId', strip.id);
        e.dataTransfer.setData('sourceColumn', strip.column);
        e.dataTransfer.setData('sourceArea', area || strip.area || 'main');
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
          <div className="flight-strip__callsign">
            {isEditingCallsign ? (
              <input
                ref={callsignInputRef}
                type="text"
                value={callsignValue}
                onChange={(e) => setCallsignValue(e.target.value)}
                onBlur={handleCallsignBlur}
                onKeyDown={handleCallsignKeyDown}
                className="flight-strip__field-input"
              />
            ) : (
              <span
                onDoubleClick={handleCallsignDoubleClick}
                className="flight-strip__field-display"
                title="Double-click to edit callsign"
              >
                {strip.callsign}
              </span>
            )}
          </div>
          <div className="flight-strip__aircraft">
            {isEditingAircraftType ? (
              <select
                ref={aircraftTypeInputRef}
                value={aircraftTypeValue}
                onChange={(e) => setAircraftTypeValue(e.target.value)}
                onBlur={handleAircraftTypeBlur}
                onKeyDown={handleAircraftTypeKeyDown}
                className="flight-strip__field-select"
              >
                {Object.entries(AIRCRAFT_TYPES).map(([key, value]) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            ) : (
              <span
                onDoubleClick={handleAircraftTypeDoubleClick}
                className="flight-strip__field-display"
                title="Double-click to edit aircraft type"
              >
                {strip.aircraftType}
              </span>
            )}
          </div>
          <div className="flight-strip__count">
            {strip.numberOfAircrafts}
          </div>
        </div>
        <div className="flight-strip__column flight-strip__column--center">
          <div className="flight-strip__origin">
            {isEditingOrigin ? (
              <input
                ref={originInputRef}
                type="text"
                value={originValue}
                onChange={(e) => setOriginValue(e.target.value)}
                onBlur={handleOriginBlur}
                onKeyDown={handleOriginKeyDown}
                className="flight-strip__field-input"
              />
            ) : (
              <span
                onDoubleClick={handleOriginDoubleClick}
                className="flight-strip__field-display"
                title="Double-click to edit origin"
              >
                {strip.origin}
              </span>
            )}
          </div>
          <div className="flight-strip__destination">
            {isEditingDestination ? (
              <input
                ref={destinationInputRef}
                type="text"
                value={destinationValue}
                onChange={(e) => setDestinationValue(e.target.value)}
                onBlur={handleDestinationBlur}
                onKeyDown={handleDestinationKeyDown}
                className="flight-strip__field-input"
              />
            ) : (
              <span
                onDoubleClick={handleDestinationDoubleClick}
                className="flight-strip__field-display"
                title="Double-click to edit destination"
              >
                {strip.destination}
              </span>
            )}
          </div>
          <div className="flight-strip__mission">
            {isEditingMissionType ? (
              <select
                ref={missionTypeInputRef}
                value={missionTypeValue}
                onChange={(e) => setMissionTypeValue(e.target.value)}
                onBlur={handleMissionTypeBlur}
                onKeyDown={handleMissionTypeKeyDown}
                className="flight-strip__field-select"
              >
                {Object.entries(MISSION_TYPES).map(([key, value]) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            ) : (
              <span
                onDoubleClick={handleMissionTypeDoubleClick}
                className="flight-strip__field-display"
                title="Double-click to edit mission type"
              >
                {strip.missionType}
              </span>
            )}
          </div>
        </div>
        <div className="flight-strip__column flight-strip__column--right">
          <div className="flight-strip__route">
            {isEditingRoute ? (
              <input
                ref={routeInputRef}
                type="text"
                value={routeValue}
                onChange={(e) => setRouteValue(e.target.value)}
                onBlur={handleRouteBlur}
                onKeyDown={handleRouteKeyDown}
                className="flight-strip__field-input flight-strip__field-input--left"
              />
            ) : (
              <span
                onDoubleClick={handleRouteDoubleClick}
                className="flight-strip__field-display flight-strip__field-display--left"
                title="Double-click to edit route"
              >
                {strip.route || 'No route'}
              </span>
            )}
          </div>
          <div className="flight-strip__empty"></div>
          <div className="flight-strip__altitude">
            {isEditingAltitude ? (
              <input
                ref={altitudeInputRef}
                type="number"
                value={altitudeValue}
                onChange={(e) => setAltitudeValue(parseInt(e.target.value, 10) || 0)}
                onBlur={handleAltitudeBlur}
                onKeyDown={handleAltitudeKeyDown}
                className="flight-strip__field-input flight-strip__field-input--right"
                min="0"
                max="50000"
                step="1000"
              />
            ) : (
              <span
                onDoubleClick={handleAltitudeDoubleClick}
                className="flight-strip__field-display flight-strip__field-display--right"
                title="Double-click to edit altitude"
              >
                {formatAltitude(strip.altitude)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}