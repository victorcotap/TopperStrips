'use client';

import { useState } from 'react';
import FlightStrip from './FlightStrip';

export default function ATCColumn({ title, strips, onDragOver, onDrop, onDelete, onStripReorder, onStripUpdate, className = '' }) {
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const getColumnFromClassName = (className) => {
    if (className.includes('departure')) return 'ground';
    if (className.includes('enroute')) return 'tower';
    if (className.includes('arrival')) return 'TRACON';
    return 'ground'; // fallback
  };

  const column = getColumnFromClassName(className);

  const handleDropZoneDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling up to column handler
    setDragOverIndex(index);
  };

  const handleDropZoneDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling up to column handler
    setDragOverIndex(null);
    
    const stripId = e.dataTransfer.getData('stripId');
    const sourceColumn = e.dataTransfer.getData('sourceColumn');
    
    if (sourceColumn === column) {
      // Intra-column reordering
      onStripReorder(stripId, sourceColumn, column, dropIndex);
    } else {
      // Inter-column move to specific position
      onStripReorder(stripId, sourceColumn, column, dropIndex);
    }
  };

  const handleDropZoneDragLeave = () => {
    setDragOverIndex(null);
  };

  // Fallback for dropping on the column itself (append to end)
  const handleColumnDrop = (e) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    const stripId = e.dataTransfer.getData('stripId');
    const sourceColumn = e.dataTransfer.getData('sourceColumn');
    
    if (sourceColumn !== column) {
      // Only handle inter-column moves here, append to end
      onDrop(e);
    }
  };

  return (
    <div 
      className={className}
      onDragOver={onDragOver}
      onDrop={handleColumnDrop}
    >
      <h2 className="atc-column__title">{title}</h2>
      <div className="atc-column__content">
        {/* Drop zone at the top */}
        <div
          className={`drop-zone ${dragOverIndex === 0 ? 'drop-zone--active' : ''}`}
          onDragOver={(e) => handleDropZoneDragOver(e, 0)}
          onDrop={(e) => handleDropZoneDrop(e, 0)}
          onDragLeave={handleDropZoneDragLeave}
        />
        
        {strips.map((strip, index) => (
          <div key={strip.id}>
            <FlightStrip
              strip={strip}
              onDelete={onDelete}
              onUpdate={onStripUpdate}
            />
            {/* Drop zone after each strip */}
            <div
              className={`drop-zone ${dragOverIndex === index + 1 ? 'drop-zone--active' : ''}`}
              onDragOver={(e) => handleDropZoneDragOver(e, index + 1)}
              onDrop={(e) => handleDropZoneDrop(e, index + 1)}
              onDragLeave={handleDropZoneDragLeave}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
