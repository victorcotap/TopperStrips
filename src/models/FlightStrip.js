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
 * @property {string} [remarks] - Optional remarks
 * @property {('ground'|'tower'|'TRACON'|'C2')} column - Current ATC control position
 * @property {('main'|'handoff')} area - Area within the column (main or handoff)
 * @property {number} position - Position within the column+area for ordering (0-indexed)
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
    remarks: '',
    column: 'ground',
    area: 'main'
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
  // aircraftType, missionType, origin, destination are optional in the form
  // Route is optional, will default to empty string if not provided
  // Altitude is optional, will default to 0 if not provided
  if (
    strip.numberOfAircrafts !== undefined &&
    (typeof strip.numberOfAircrafts !== 'number' || strip.numberOfAircrafts < 1)
  ) {
    errors.push('Number of aircrafts must be a positive number');
  }
  if (!['ground', 'tower', 'TRACON', 'C2'].includes(strip.column)) {
    errors.push('Invalid column value');
  }
  if (strip.area && !['main', 'handoff'].includes(strip.area)) {
    errors.push('Invalid area value');
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
  TRACON: 'TRACON',
  C2: 'C2'
});

/**
 * Available areas within ATC columns
 * @type {Object.<string, string>}
 */
export const ATC_AREAS = Object.freeze({
  MAIN: 'main',
  HANDOFF: 'handoff'
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
	A4: 'A-4',
	HAR: 'AV-8',
	A10: 'A-10',
	SB37: 'AJS37',
	B06: 'OH-58',
	BF19: 'Bf 109',
	C101: 'C-101',
	C30J: 'C-130J',
	EAGL: 'CEII',
	H47: 'CH-47',
  CORS: 'F4U',
	F4: 'F-4',
	F5: 'F-5',
	F14: 'F-14',
	F15: 'F-15',
	F16: 'F-16',
	F18H: 'F/A-18C',
	F86: 'F-86',
	FW90: 'Fw 190',
	I16: 'I-16',
	FC1: 'JF-17',
	KA50: 'Ka-50',
	L39: 'L-39',
	M339: 'MB-339',
	MG15: 'MiG-15',
	MG19: 'MiG-19',
	MG21: 'MiG-21',
	MG29: 'MiG-29',
	MI8: 'Mi-8',
	MI24: 'Mi-24',
	MRF1: 'Mirage F1',
	MIR2: 'Mirage 2000',
	MOSQ: 'Mosquito',
	P47: 'P-47',
	P51: 'P-51',
	P210: 'P210',
	GAZL: 'SA342',
	SPIT: 'Spitfire',
	SU25: 'Su-25',
	SU27: 'Su-27/Su-33/J-11',
	HAWK: 'T-45',
	UH1: 'UH-1',
	H60: 'UH-60',
	H64: 'UH-64',
	YK52: 'Yak-52',
  ZZZZ: 'Placeholder',
});

/**
 * Formats altitude for display
 * @param {number} altitude - Altitude in feet
 * @returns {string} Formatted altitude string
 */
export function formatAltitude(altitude) {
  return `${Number(altitude).toLocaleString()}ft`;
}
