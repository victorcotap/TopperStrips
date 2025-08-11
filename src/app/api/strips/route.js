import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const strips = await prisma.flightStrip.findMany({
      orderBy: [
        { column: 'asc' },
        { position: 'asc' }
      ]
    });
    if (!Array.isArray(strips)) {
      console.error('Invalid data format from database');
      return NextResponse.json([], { status: 200 }); // Return empty array instead of error
    }
    return NextResponse.json(strips);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array on error
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Convert altitude to feet, support both feet and 3-digit hundreds input
    let altitudeInput = data.altitude;
    let altitude = 0;
    if (typeof altitudeInput === 'string') {
      const digits = altitudeInput.replace(/\D/g, '');
      if (digits.length <= 3) {
        // treat as hundreds of feet
        const hundreds = parseInt(digits || '0', 10);
        altitude = hundreds * 100;
      } else {
        altitude = parseInt(altitudeInput, 10) || 0;
      }
    } else if (typeof altitudeInput === 'number') {
      // Numbers are assumed to be feet already
      altitude = altitudeInput;
    }
    altitude = Math.max(0, Math.min(99000, Math.round(altitude / 1000) * 1000));

    // Default area to 'main' if not provided
    const area = data.area || 'main';
    
    // Get the highest position in the target column+area to append new strip at the end
    const lastStrip = await prisma.flightStrip.findFirst({
      where: { 
        column: data.column,
        area: area
      },
      orderBy: { position: 'desc' }
    });
    
    const nextPosition = lastStrip ? lastStrip.position + 1 : 0;

    const strip = await prisma.flightStrip.create({
      data: {
        callsign: data.callsign,
        aircraftType: data.aircraftType || '',
        numberOfAircrafts: isNaN(parseInt(data.numberOfAircrafts, 10)) ? 1 : parseInt(data.numberOfAircrafts, 10),
        missionType: data.missionType || '',
        origin: data.origin || '',
        destination: data.destination || '',
        route: data.route || '',
        altitude: altitude,
        remarks: data.remarks || '',
        column: data.column,
        area: area,
        position: nextPosition,
      },
    });
    
    return NextResponse.json(strip);
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Error creating flight strip',
      details: error.message 
    }, { status: 500 });
  }
}
