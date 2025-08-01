/**
 * @typedef {Object} FlightStrip
 * @property {string} id - Unique identifier for the flight strip
 * @property {string} callsign - Aircraft callsign
 * @property {string} aircraftType - Type of aircraft (e.g., B737, A320)
 * @property {number} numberOfAircrafts - Number of aircraft in the formation
 * @property {string} missionType - Type of mission or flight operation
 * @property {string} origin - Departure airport or location code
 * @property {string} destination - Arrival airport or location code
 * @property {string} route - Flight route information
 * @property {number} altitude - Flight altitude in feet
 * @property {('ground'|'tower'|'TRACON')} column - Current ATC control position
 * @property {number} position - Position within the column for ordering (0-indexed)
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
    route: '',
    altitude: 0,
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
  // Route is optional, will default to empty string if not provided
  // Altitude is optional, will default to 0 if not provided
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
 * Available mission types
 * @type {Object.<string, string>}
 */
export const MISSION_TYPES = Object.freeze({
  CAP: 'CAP',
  CAS: 'CAS',
  STRIKE: 'Strike',
  SEAD: 'SEAD',
  BAI: 'BAI',
  PATTERN: 'Pattern',
  VFR: 'VFR',
  IFR: 'IFR'
});

/**
 * Available aircraft types
 * @type {Object.<string, string>}
 */
export const AIRCRAFT_TYPES = Object.freeze({
  F4: 'F4',
  F5: 'F5',
  F14: 'F14',
  F15: 'F15',
  F16: 'F16',
  F18: 'F18',
  F22: 'F22',
  F35: 'F35',
  F86: 'F86',
  A10: 'A10',
  AV8: 'AV8',
  C130: 'C130',
  M2C: 'M2C',
  SU25: 'SU25',
  SU27: 'SU27',
  SU33: 'SU33',
  MIG29: 'MIG29',
  AH64: 'AH64',
  OH58: 'OH58',
  CH47: 'CH47',
  UH1: 'UH1',
  SA342: 'SA342',
  MI8: 'MI8',
  MI24: 'MI24'
});

/**
 * Formats altitude for display
 * @param {number} altitude - Altitude in feet
 * @returns {string} Formatted altitude string
 */
export function formatAltitude(altitude) {
  return `${Number(altitude).toLocaleString()}ft`;
}
