import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { stripId, sourceColumn, targetColumn, sourceArea, targetArea, newPosition } = await request.json();
    
    if (!stripId || sourceColumn === undefined || targetColumn === undefined || 
        sourceArea === undefined || targetArea === undefined || newPosition === undefined) {
      return NextResponse.json({ 
        error: 'stripId, sourceColumn, targetColumn, sourceArea, targetArea, and newPosition are required' 
      }, { status: 400 });
    }

    // Get the strip being moved
    const stripToMove = await prisma.flightStrip.findUnique({
      where: { id: stripId }
    });
    
    if (!stripToMove) {
      return NextResponse.json({ error: 'Strip not found' }, { status: 404 });
    }

    // Handle different move scenarios
    if (sourceColumn === targetColumn && sourceArea === targetArea) {
      // Intra-area reordering (same column, same area)
      await handleIntraAreaReorder(stripId, stripToMove.position, newPosition, targetColumn, targetArea);
    } else if (sourceColumn === targetColumn) {
      // Inter-area move (same column, different area)
      await handleInterAreaMove(stripId, stripToMove.position, sourceArea, targetArea, targetColumn, newPosition);
    } else {
      // Inter-column move (different column, any area)
      await handleInterColumnMove(stripId, stripToMove.position, sourceColumn, sourceArea, targetColumn, targetArea, newPosition);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json({ 
      error: 'Error reordering flight strip',
      details: error.message 
    }, { status: 500 });
  }
}

async function handleIntraAreaReorder(stripId, oldPosition, newPosition, column, area) {
  // Use a transaction to ensure data consistency
  await prisma.$transaction(async (tx) => {
    if (oldPosition < newPosition) {
      // Moving down: shift items between oldPosition and newPosition up by 1
      await tx.flightStrip.updateMany({
        where: {
          column: column,
          area: area,
          position: {
            gt: oldPosition,
            lte: newPosition
          }
        },
        data: {
          position: {
            decrement: 1
          }
        }
      });
    } else if (oldPosition > newPosition) {
      // Moving up: shift items between newPosition and oldPosition down by 1
      await tx.flightStrip.updateMany({
        where: {
          column: column,
          area: area,
          position: {
            gte: newPosition,
            lt: oldPosition
          }
        },
        data: {
          position: {
            increment: 1
          }
        }
      });
    }
    
    // Update the moved strip's position
    await tx.flightStrip.update({
      where: { id: stripId },
      data: { position: newPosition }
    });
  });
}

async function handleInterAreaMove(stripId, oldPosition, sourceArea, targetArea, column, newPosition) {
  await prisma.$transaction(async (tx) => {
    // 1. Remove gap in source area
    await tx.flightStrip.updateMany({
      where: {
        column: column,
        area: sourceArea,
        position: {
          gt: oldPosition
        }
      },
      data: {
        position: {
          decrement: 1
        }
      }
    });

    // 2. Make space in target area
    await tx.flightStrip.updateMany({
      where: {
        column: column,
        area: targetArea,
        position: {
          gte: newPosition
        }
      },
      data: {
        position: {
          increment: 1
        }
      }
    });

    // 3. Move the strip to new area and position
    await tx.flightStrip.update({
      where: { id: stripId },
      data: { 
        area: targetArea,
        position: newPosition 
      }
    });
  });
}

async function handleInterColumnMove(stripId, oldPosition, sourceColumn, sourceArea, targetColumn, targetArea, newPosition) {
  await prisma.$transaction(async (tx) => {
    // 1. Remove gap in source column+area
    await tx.flightStrip.updateMany({
      where: {
        column: sourceColumn,
        area: sourceArea,
        position: {
          gt: oldPosition
        }
      },
      data: {
        position: {
          decrement: 1
        }
      }
    });

    // 2. Make space in target column+area
    await tx.flightStrip.updateMany({
      where: {
        column: targetColumn,
        area: targetArea,
        position: {
          gte: newPosition
        }
      },
      data: {
        position: {
          increment: 1
        }
      }
    });

    // 3. Move the strip to new column, area, and position
    await tx.flightStrip.update({
      where: { id: stripId },
      data: { 
        column: targetColumn,
        area: targetArea,
        position: newPosition 
      }
    });
  });
}