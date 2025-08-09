'use client';

import { useEffect, useRef, useState } from 'react';
import FlightStrip from './FlightStrip';

export default function ATCColumn({ title, handoffStrips, mainStrips, onDragOver, onDrop, onDelete, onStripReorder, onStripUpdate, className = '' }) {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOverArea, setDragOverArea] = useState(null);
  const [handoffSubscribed, setHandoffSubscribed] = useState(false);

  // Track previous handoff strip IDs to detect new additions
  const previousHandoffIdsRef = useRef(new Set(handoffStrips.map((s) => s.id)));

  // Function to play notification sound
  const playHandoffSound = () => {
    try {
      // Try to use the browser's built-in beep sound first
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        // Alternative: generate a simple ding using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // High frequency for ding
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (error) {
      console.warn('Could not play handoff notification sound:', error);
    }
  };

  const getColumnFromClassName = (className) => {
    if (className.includes('departure')) return 'ground';
    if (className.includes('enroute')) return 'tower';
    if (className.includes('arrival')) return 'TRACON';
    if (className.includes('c2')) return 'C2';
    return 'ground'; // fallback
  };

  const column = getColumnFromClassName(className);

  const handleDropZoneDragOver = (e, area, index) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling up to column handler
    setDragOverIndex(index);
    setDragOverArea(area);
  };

  const handleDropZoneDrop = (e, area, dropIndex) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling up to column handler
    setDragOverIndex(null);
    setDragOverArea(null);
    
    const stripId = e.dataTransfer.getData('stripId');
    const sourceColumn = e.dataTransfer.getData('sourceColumn');
    const sourceArea = e.dataTransfer.getData('sourceArea') || 'main';
    
    onStripReorder(stripId, sourceColumn, sourceArea, column, area, dropIndex);
  };

  const handleDropZoneDragLeave = () => {
    setDragOverIndex(null);
    setDragOverArea(null);
  };

  // Fallback for dropping on the column itself (append to end of main area)
  const handleColumnDrop = (e) => {
    e.preventDefault();
    setDragOverIndex(null);
    setDragOverArea(null);
    
    const stripId = e.dataTransfer.getData('stripId');
    const sourceColumn = e.dataTransfer.getData('sourceColumn');
    const sourceArea = e.dataTransfer.getData('sourceArea') || 'main';
    
    if (sourceColumn !== column) {
      // Only handle inter-column moves here, append to end of main area
      onStripReorder(stripId, sourceColumn, sourceArea, column, 'main', mainStrips.length);
    }
  };

  // When a new strip appears in handoff area, play sound if subscribed
  useEffect(() => {
    const previousIds = previousHandoffIdsRef.current;
    const currentIds = new Set(handoffStrips.map((s) => s.id));

    // Detect if any new ID exists in current that wasn't in previous
    let hasNewAddition = false;
    for (const id of currentIds) {
      if (!previousIds.has(id)) {
        hasNewAddition = true;
        break;
      }
    }

    if (hasNewAddition && handoffSubscribed) {
      playHandoffSound();
    }

    previousHandoffIdsRef.current = currentIds;
  }, [handoffStrips, handoffSubscribed]);

  return (
    <div 
      className={className}
      onDragOver={onDragOver}
      onDrop={handleColumnDrop}
    >
      <h2 className="atc-column__title">{title}</h2>
      <div className="atc-column__content">
        {/* Handoff Area */}
        <div className="atc-column__handoff-area">
          <h3 className="atc-column__area-title">
            <label className="handoff-subscription">
              <input
                type="checkbox"
                checked={handoffSubscribed}
                onChange={(e) => setHandoffSubscribed(e.target.checked)}
                className="handoff-subscription__checkbox"
              />
              Handoff
            </label>
          </h3>
          <div className="atc-column__area-content">
            {handoffStrips.length === 0 ? (
              <div 
                className={`atc-column__empty-area ${dragOverArea === 'handoff' && dragOverIndex === 0 ? 'atc-column__empty-area--active' : ''}`}
                onDragOver={(e) => handleDropZoneDragOver(e, 'handoff', 0)}
                onDrop={(e) => handleDropZoneDrop(e, 'handoff', 0)}
                onDragLeave={handleDropZoneDragLeave}
              >
                <span className="atc-column__empty-text">Drop strips here</span>
              </div>
            ) : (
              <>
                {/* Drop zone at the top of handoff area when not empty */}
                <div
                  className={`drop-zone ${dragOverArea === 'handoff' && dragOverIndex === 0 ? 'drop-zone--active' : ''}`}
                  onDragOver={(e) => handleDropZoneDragOver(e, 'handoff', 0)}
                  onDrop={(e) => handleDropZoneDrop(e, 'handoff', 0)}
                  onDragLeave={handleDropZoneDragLeave}
                />
                
                {handoffStrips.map((strip, index) => (
                  <div key={strip.id}>
                    <FlightStrip
                      strip={strip}
                      onDelete={onDelete}
                      onUpdate={onStripUpdate}
                      area="handoff"
                    />
                    {/* Drop zone after each strip in handoff */}
                    <div
                      className={`drop-zone ${dragOverArea === 'handoff' && dragOverIndex === index + 1 ? 'drop-zone--active' : ''}`}
                      onDragOver={(e) => handleDropZoneDragOver(e, 'handoff', index + 1)}
                      onDrop={(e) => handleDropZoneDrop(e, 'handoff', index + 1)}
                      onDragLeave={handleDropZoneDragLeave}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Main Area */}
        <div className="atc-column__main-area">
          <div className="atc-column__area-content">
            {/* Drop zone at the top of main area */}
            <div
              className={`drop-zone ${dragOverArea === 'main' && dragOverIndex === 0 ? 'drop-zone--active' : ''}`}
              onDragOver={(e) => handleDropZoneDragOver(e, 'main', 0)}
              onDrop={(e) => handleDropZoneDrop(e, 'main', 0)}
              onDragLeave={handleDropZoneDragLeave}
            />
            
            {mainStrips.map((strip, index) => (
              <div key={strip.id}>
                <FlightStrip
                  strip={strip}
                  onDelete={onDelete}
                  onUpdate={onStripUpdate}
                  area="main"
                />
                {/* Drop zone after each strip in main */}
                <div
                  className={`drop-zone ${dragOverArea === 'main' && dragOverIndex === index + 1 ? 'drop-zone--active' : ''}`}
                  onDragOver={(e) => handleDropZoneDragOver(e, 'main', index + 1)}
                  onDrop={(e) => handleDropZoneDrop(e, 'main', index + 1)}
                  onDragLeave={handleDropZoneDragLeave}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
