'use client';

import { useEffect, useState } from 'react';
import CreateStrip from './components/CreateStrip';
import ATCColumns from './components/ATCColumns';

export default function Home() {
  const [strips, setStrips] = useState({
    ground: { handoff: [], main: [] },
    tower: { handoff: [], main: [] },
    TRACON: { handoff: [], main: [] },
    C2: { handoff: [], main: [] }
  });

  const fetchStrips = async () => {
    try {
      const res = await fetch('/api/strips');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      
      // Initialize the default structure
      const grouped = {
        ground: { handoff: [], main: [] },
        tower: { handoff: [], main: [] },
        TRACON: { handoff: [], main: [] },
        C2: { handoff: [], main: [] }
      };
      
      // Only try to reduce if we got an array
      if (Array.isArray(data)) {
        data.forEach(strip => {
          if (strip && strip.column && grouped[strip.column]) {
            const area = strip.area || 'main'; // Default to main for backward compatibility
            if (grouped[strip.column][area]) {
              grouped[strip.column][area].push(strip);
            }
          }
        });
        
        // Sort strips by position within each area
        Object.keys(grouped).forEach(column => {
          Object.keys(grouped[column]).forEach(area => {
            grouped[column][area].sort((a, b) => a.position - b.position);
          });
        });
      }

      setStrips(grouped);
    } catch (error) {
      console.error('Error fetching strips:', error);
      // Set empty state on error
      setStrips({
        ground: { handoff: [], main: [] },
        tower: { handoff: [], main: [] },
        TRACON: { handoff: [], main: [] },
        C2: { handoff: [], main: [] }
      });
    }
  };

  useEffect(() => {
    fetchStrips();
    
    // Set up polling for updates
    const interval = setInterval(fetchStrips, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateStrip = async (stripData) => {
    try {
      const response = await fetch('/api/strips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stripData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.details || 'Failed to create strip');
      }
      
      await fetchStrips();
      return true;
    } catch (error) {
      console.error('Error creating strip:', error);
      throw error;
    }
  };

  const handleStripMove = async (stripId, sourceColumn, targetColumn) => {
    try {
      const response = await fetch(`/api/strips/${stripId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ column: targetColumn }),
      });

      if (!response.ok) {
        throw new Error('Failed to move strip');
      }

      await fetchStrips();
    } catch (error) {
      console.error('Error moving strip:', error);
      alert('Failed to move strip: ' + error.message);
    }
  };

  const handleStripReorder = async (stripId, sourceColumn, sourceArea, targetColumn, targetArea, newPosition) => {
    try {
      const response = await fetch('/api/strips/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          stripId, 
          sourceColumn, 
          sourceArea,
          targetColumn, 
          targetArea,
          newPosition 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder strip');
      }

      await fetchStrips();
    } catch (error) {
      console.error('Error reordering strip:', error);
      alert('Failed to reorder strip: ' + error.message);
    }
  };

  const handleDelete = async (stripId) => {
    try {
      const response = await fetch(`/api/strips/${stripId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete strip');
      
      await fetchStrips();
    } catch (error) {
      console.error('Error deleting strip:', error);
    }
  };

  const handleStripUpdate = async (updatedStrip) => {
    // Update the local state immediately for responsive UI
    setStrips(prevStrips => {
      const newStrips = { ...prevStrips };
      
      // Find and update the strip in the appropriate column and area
      Object.keys(newStrips).forEach(column => {
        Object.keys(newStrips[column]).forEach(area => {
          const stripIndex = newStrips[column][area].findIndex(strip => strip.id === updatedStrip.id);
          if (stripIndex !== -1) {
            newStrips[column][area][stripIndex] = updatedStrip;
          }
        });
      });
      
      return newStrips;
    });
    
    // Optionally refresh from server to ensure consistency
    // await fetchStrips();
  };

  return (
    <main className="main-container">
      <CreateStrip onCreateStrip={handleCreateStrip} />
      <ATCColumns
        strips={strips}
        onStripMove={handleStripMove}
        onStripReorder={handleStripReorder}
        onDelete={handleDelete}
        onStripUpdate={handleStripUpdate}
      />
    </main>
  );
}
