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
    
    // Convert altitude to number
    const altitude = parseInt(data.altitude, 10);
    if (isNaN(altitude)) {
      return NextResponse.json({ error: 'Altitude must be a valid number' }, { status: 400 });
    }

    // Get the highest position in the target column to append new strip at the end
    const lastStrip = await prisma.flightStrip.findFirst({
      where: { column: data.column },
      orderBy: { position: 'desc' }
    });
    
    const nextPosition = lastStrip ? lastStrip.position + 1 : 0;

    const strip = await prisma.flightStrip.create({
      data: {
        callsign: data.callsign,
        aircraftType: data.aircraftType,
        numberOfAircrafts: parseInt(data.numberOfAircrafts, 10),
        missionType: data.missionType,
        origin: data.origin,
        destination: data.destination,
        altitude: altitude,
        column: data.column,
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
