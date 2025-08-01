'use client';

import { useState } from 'react';
import { createEmptyFlightStrip, validateFlightStrip, ATC_POSITIONS } from '@/models/FlightStrip';

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
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="create-strip-form">
      <div className="form-group">
        <input
          type="text"
          name="callsign"
          value={formData.callsign}
          onChange={handleChange}
          placeholder="Callsign"
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="aircraftType"
          value={formData.aircraftType}
          onChange={handleChange}
          placeholder="Aircraft Type"
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <input
          type="number"
          name="numberOfAircrafts"
          value={formData.numberOfAircrafts}
          onChange={handleChange}
          placeholder="Number of Aircrafts"
          className="form-input"
          min="1"
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="missionType"
          value={formData.missionType}
          onChange={handleChange}
          placeholder="Mission Type"
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          placeholder="Origin"
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Destination"
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <input
          type="number"
          name="altitude"
          value={formData.altitude}
          onChange={handleChange}
          placeholder="Altitude (ft)"
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
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
