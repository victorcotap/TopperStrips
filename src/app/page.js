'use client';

import { useEffect, useState } from 'react';
import CreateStrip from './components/CreateStrip';
import ATCColumns from './components/ATCColumns';

export default function Home() {
  const [strips, setStrips] = useState({
    ground: [],
    tower: [],
    TRACON: []
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
        ground: [],
        tower: [],
        TRACON: []
      };
      
      // Only try to reduce if we got an array
      if (Array.isArray(data)) {
        data.forEach(strip => {
          if (strip && strip.column && grouped[strip.column]) {
            grouped[strip.column].push(strip);
          }
        });
      }

      setStrips(grouped);
    } catch (error) {
      console.error('Error fetching strips:', error);
      // Set empty state on error
      setStrips({
        ground: [],
        tower: [],
        TRACON: []
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

  return (
    <main className="min-h-screen bg-gray-50">
      <CreateStrip onCreateStrip={handleCreateStrip} />
      <ATCColumns
        strips={strips}
        onStripMove={handleStripMove}
        onDelete={handleDelete}
      />
    </main>
  );
}
