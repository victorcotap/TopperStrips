/**
 * @typedef {Object} FlightStrip
 * @property {string} id - Unique identifier for the flight strip
 * @property {string} callsign - Aircraft callsign
 * @property {string} aircraftType - Type of aircraft (e.g., B737, A320)
 * @property {number} numberOfAircrafts - Number of aircraft in the formation
 * @property {string} missionType - Type of mission or flight operation
 * @property {string} origin - Departure airport or location code
 * @property {string} destination - Arrival airport or location code
 * @property {number} altitude - Flight altitude in feet
 * @property {('ground'|'tower'|'TRACON')} column - Current ATC control position
 */

/**
 * Creates a new flight strip with default values
 * @returns {FlightStrip} Default flight strip template
 */
export function createEmptyFlightStrip() {
  return {
    callsign: '',
    aircraftType: '',
    numberOfAircrafts: 1,
    missionType: '',
    origin: '',
    destination: '',
    altitude: '',
    column: 'ground'
  };
}

/**
 * Validates a flight strip object
 * @param {FlightStrip} strip - The flight strip to validate
 * @returns {{ isValid: boolean, errors: string[] }} Validation result
 */
export function validateFlightStrip(strip) {
  const errors = [];

  if (!strip.callsign) errors.push('Callsign is required');
  if (!strip.aircraftType) errors.push('Aircraft type is required');
  if (!strip.missionType) errors.push('Mission type is required');
  if (!strip.origin) errors.push('Origin is required');
  if (!strip.destination) errors.push('Destination is required');
  if (!strip.altitude) errors.push('Altitude is required');
  if (typeof strip.numberOfAircrafts !== 'number' || strip.numberOfAircrafts < 1) {
    errors.push('Number of aircrafts must be a positive number');
  }
  if (!['ground', 'tower', 'TRACON'].includes(strip.column)) {
    errors.push('Invalid column value');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Available ATC control positions
 * @type {Object.<string, string>}
 */
export const ATC_POSITIONS = Object.freeze({
  GROUND: 'ground',
  TOWER: 'tower',
  TRACON: 'TRACON'
});

/**
 * Formats altitude for display
 * @param {number} altitude - Altitude in feet
 * @returns {string} Formatted altitude string
 */
export function formatAltitude(altitude) {
  return `${Number(altitude).toLocaleString()}ft`;
}
