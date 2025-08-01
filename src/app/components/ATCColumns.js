'use client';

import ATCColumn from './ATCColumn';

import './styles.css';

export default function ATCColumns({ strips, onStripMove, onDelete }) {
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
        strips={strips.ground || []}
        onDragOver={handleDragOver}
        onDrop={handleDrop('ground')}
        onDelete={onDelete}
        className="atc-column atc-column--departure"
      />
      <ATCColumn
        title="Tower"
        strips={strips.tower || []}
        onDragOver={handleDragOver}
        onDrop={handleDrop('tower')}
        onDelete={onDelete}
        className="atc-column atc-column--enroute"
      />
      <ATCColumn
        title="TRACON"
        strips={strips.TRACON || []}
        onDragOver={handleDragOver}
        onDrop={handleDrop('TRACON')}
        onDelete={onDelete}
        className="atc-column atc-column--arrival"
      />
    </div>
  );
}
