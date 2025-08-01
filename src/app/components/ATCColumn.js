'use client';

export default function ATCColumn({ title, strips, onDragOver, onDrop, onDelete, className = '' }) {
  return (
    <div 
      className={className}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <h2 className="atc-column__title">{title}</h2>
      <div className="atc-column__content">
        {strips.map((strip) => (
          <div
            key={strip.id}
            draggable
            className="flight-strip"
            onDragStart={(e) => {
              e.dataTransfer.setData('stripId', strip.id);
              e.dataTransfer.setData('sourceColumn', strip.column);
            }}
          >
            <div className="flight-strip__header">
              <span className="flight-strip__plane-type">{strip.planeType}</span>
              <button
                onClick={() => onDelete(strip.id)}
                className="flight-strip__delete"
                title="Delete strip"
              >
                ×
              </button>
            </div>
            <div className="flight-strip__details">
              <div className="flight-strip__label">Mission:</div>
              <div className="flight-strip__value">{strip.missionType}</div>
              <div className="flight-strip__label">Alt:</div>
              <div className="flight-strip__value">{strip.altitude}</div>
              <div className="flight-strip__label">From:</div>
              <div className="flight-strip__value">{strip.origin}</div>
              <div className="flight-strip__label">To:</div>
              <div className="flight-strip__value">{strip.destination}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
