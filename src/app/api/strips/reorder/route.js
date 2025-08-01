import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { stripId, sourceColumn, targetColumn, newPosition } = await request.json();
    
    if (!stripId || sourceColumn === undefined || targetColumn === undefined || newPosition === undefined) {
      return NextResponse.json({ 
        error: 'stripId, sourceColumn, targetColumn, and newPosition are required' 
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
    if (sourceColumn === targetColumn) {
      // Intra-column reordering
      await handleIntraColumnReorder(stripId, stripToMove.position, newPosition, targetColumn);
    } else {
      // Inter-column move (existing functionality but with position control)
      await handleInterColumnMove(stripId, stripToMove.position, sourceColumn, targetColumn, newPosition);
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

async function handleIntraColumnReorder(stripId, oldPosition, newPosition, column) {
  // Use a transaction to ensure data consistency
  await prisma.$transaction(async (tx) => {
    if (oldPosition < newPosition) {
      // Moving down: shift items between oldPosition and newPosition up by 1
      await tx.flightStrip.updateMany({
        where: {
          column: column,
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

async function handleInterColumnMove(stripId, oldPosition, sourceColumn, targetColumn, newPosition) {
  await prisma.$transaction(async (tx) => {
    // 1. Remove gap in source column
    await tx.flightStrip.updateMany({
      where: {
        column: sourceColumn,
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

    // 2. Make space in target column
    await tx.flightStrip.updateMany({
      where: {
        column: targetColumn,
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

    // 3. Move the strip to new column and position
    await tx.flightStrip.update({
      where: { id: stripId },
      data: { 
        column: targetColumn,
        position: newPosition 
      }
    });
  });
}