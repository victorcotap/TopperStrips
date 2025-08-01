import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Handle PATCH requests to update a strip
export async function PATCH(request, context) {
  try {
    const { params } = await context
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Strip ID is required' }, { status: 400 });
    }

    const data = await request.json();
    
    const updatedStrip = await prisma.flightStrip.update({
      where: { id },
      data: { column: data.column }
    });

    return NextResponse.json(updatedStrip);
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ 
      error: 'Error updating flight strip',
      details: error.message 
    }, { status: 500 });
  }
}

// Handle DELETE requests to remove a strip
export async function DELETE(request, context) {
  try {
    const { params } = await context
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Strip ID is required' }, { status: 400 });
    }
    
    await prisma.flightStrip.delete({
      where: { id }
    });

    // Get all strips for broadcast
    const allStrips = await prisma.flightStrip.findMany();
    const grouped = allStrips.reduce((acc, s) => {
      if (!acc[s.column]) acc[s.column] = [];
      acc[s.column].push(s);
      return acc;
    }, {
      ground: [],
      tower: [],
      TRACON: []
    });

    // Broadcast the update to all clients
    global.io?.emit('boardState', grouped);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Error deleting flight strip',
      details: error.message 
    }, { status: 500 });
  }
}
