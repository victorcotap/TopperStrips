'use client';

import ATCColumn from './ATCColumn';

import './styles.css';

export default function ATCColumns({ strips, onStripMove, onStripReorder, onDelete, onStripUpdate }) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumn) => (e) => {
    e.preventDefault();
    const stripId = e.dataTransfer.getData('stripId');
    const sourceColumn = e.dataTransfer.getData('sourceColumn');
    
    if (sourceColumn !== targetColumn) {
      onStripMove(stripId, sourceColumn, targetColumn);
    }
  };

  return (
    <div className="atc-columns">
      <ATCColumn
        title="Ground"
        handoffStrips={strips.ground?.handoff || []}
        mainStrips={strips.ground?.main || []}
        onDragOver={handleDragOver}
        onDrop={handleDrop('ground')}
        onStripReorder={onStripReorder}
        onDelete={onDelete}
        onStripUpdate={onStripUpdate}
        className="atc-column atc-column--departure"
      />
      <ATCColumn
        title="Tower"
        handoffStrips={strips.tower?.handoff || []}
        mainStrips={strips.tower?.main || []}
        onDragOver={handleDragOver}
        onDrop={handleDrop('tower')}
        onStripReorder={onStripReorder}
        onDelete={onDelete}
        onStripUpdate={onStripUpdate}
        className="atc-column atc-column--enroute"
      />
      <ATCColumn
        title="TRACON"
        handoffStrips={strips.TRACON?.handoff || []}
        mainStrips={strips.TRACON?.main || []}
        onDragOver={handleDragOver}
        onDrop={handleDrop('TRACON')}
        onStripReorder={onStripReorder}
        onDelete={onDelete}
        onStripUpdate={onStripUpdate}
        className="atc-column atc-column--arrival"
      />
      <ATCColumn
        title="C2"
        handoffStrips={strips.C2?.handoff || []}
        mainStrips={strips.C2?.main || []}
        onDragOver={handleDragOver}
        onDrop={handleDrop('C2')}
        onStripReorder={onStripReorder}
        onDelete={onDelete}
        onStripUpdate={onStripUpdate}
        className="atc-column atc-column--c2"
      />
    </div>
  );
}
