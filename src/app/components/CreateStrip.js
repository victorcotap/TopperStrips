'use client';

import { useState } from 'react';

export default function CreateStrip({ onCreateStrip }) {
  const [formData, setFormData] = useState({
    planeType: '',
    missionType: '',
    origin: '',
    destination: '',
    altitude: '',
    column: 'ground' // default column
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onCreateStrip(formData);
      // Reset form only if creation was successful
      setFormData({
        planeType: '',
        missionType: '',
        origin: '',
        destination: '',
        altitude: '',
        column: 'ground'
      });
    } catch (error) {
      console.error('Error creating strip:', error);
      alert('Failed to create strip: ' + (error.details || error.message || 'Unknown error'));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="create-strip-form">
      <div className="form-group">
        <input
          type="text"
          name="planeType"
          value={formData.planeType}
          onChange={handleChange}
          placeholder="Plane Type"
          className="form-input"
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
          placeholder="Altitude"
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
          <option value="ground">Ground</option>
          <option value="tower">Tower</option>
          <option value="TRACON">TRACON</option>
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
