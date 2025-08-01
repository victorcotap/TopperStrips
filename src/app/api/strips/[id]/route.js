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
    
    // If moving to a different column, assign next position in target column
    if (data.column) {
      const lastStrip = await prisma.flightStrip.findFirst({
        where: { column: data.column },
        orderBy: { position: 'desc' }
      });
      
      const nextPosition = lastStrip ? lastStrip.position + 1 : 0;
      
      const updatedStrip = await prisma.flightStrip.update({
        where: { id },
        data: { 
          column: data.column,
          position: nextPosition
        }
      });

      return NextResponse.json(updatedStrip);
    }

    // For other updates (not column moves)
    const updatedStrip = await prisma.flightStrip.update({
      where: { id },
      data: data
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
    
    // Get the strip details before deletion for position recalculation
    const stripToDelete = await prisma.flightStrip.findUnique({
      where: { id }
    });
    
    if (!stripToDelete) {
      return NextResponse.json({ error: 'Strip not found' }, { status: 404 });
    }
    
    // Delete the strip
    await prisma.flightStrip.delete({
      where: { id }
    });

    // Recalculate positions for remaining strips in the same column
    // Decrement position for all strips that had position > deleted strip's position
    await prisma.flightStrip.updateMany({
      where: {
        column: stripToDelete.column,
        position: {
          gt: stripToDelete.position
        }
      },
      data: {
        position: {
          decrement: 1
        }
      }
    });

    // Get all strips for broadcast
    const allStrips = await prisma.flightStrip.findMany({
      orderBy: [
        { column: 'asc' },
        { position: 'asc' }
      ]
    });
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
