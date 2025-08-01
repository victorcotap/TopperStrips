'use client';

import { useState } from 'react';
import { createEmptyFlightStrip, validateFlightStrip, ATC_POSITIONS, MISSION_TYPES, AIRCRAFT_TYPES } from '@/models/FlightStrip';

export default function CreateStrip({ onCreateStrip }) {
  const [formData, setFormData] = useState(createEmptyFlightStrip());

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateFlightStrip(formData);
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }

    try {
      await onCreateStrip(formData);
      // Reset form only if creation was successful
      setFormData(createEmptyFlightStrip());
    } catch (error) {
      console.error('Error creating strip:', error);
      alert('Failed to create strip: ' + (error.details || error.message || 'Unknown error'));
    }
  };

  const handleChange = (e) => {
    let value = e.target.value;
    
    if (e.target.type === 'number') {
      // For altitude field, default to 0 if empty or invalid
      if (e.target.name === 'altitude' && (value === '' || isNaN(Number(value)))) {
        value = 0;
      } else {
        value = Number(value);
      }
    }
    
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="create-strip-form">
      <div className="form-group">
        <label className="form-label">Callsign</label>
        <input
          type="text"
          name="callsign"
          value={formData.callsign}
          onChange={handleChange}
          placeholder="Enter callsign"
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Aircraft Type</label>
        <select
          name="aircraftType"
          value={formData.aircraftType}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Select Aircraft Type</option>
          {Object.entries(AIRCRAFT_TYPES).map(([key, value]) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Number of Aircraft</label>
        <input
          type="number"
          name="numberOfAircrafts"
          value={formData.numberOfAircrafts}
          onChange={handleChange}
          placeholder="1"
          className="form-input"
          min="1"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Mission Type</label>
        <select
          name="missionType"
          value={formData.missionType}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Select Mission Type</option>
          {Object.entries(MISSION_TYPES).map(([key, value]) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Origin</label>
        <input
          type="text"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          placeholder="Departure location"
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Destination</label>
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Arrival location"
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Altitude (Optional)</label>
        <input
          type="number"
          name="altitude"
          value={formData.altitude}
          onChange={handleChange}
          placeholder="Altitude in feet"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label className="form-label">ATC Position</label>
        <select
          name="column"
          value={formData.column}
          onChange={handleChange}
          className="form-input"
          required
        >
          {Object.entries(ATC_POSITIONS).map(([key, value]) => (
            <option key={value} value={value}>
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="submit-button"
      >
        Create Strip
      </button>
    </form>
  );
}
