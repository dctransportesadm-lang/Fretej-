import { useState, useEffect, useCallback } from 'react';
import { TimeEntry } from '../types';

const STORAGE_KEY = 'time_tracking_data';

export function useTimeTracking() {
  const [entries, setEntries] = useState<TimeEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing time entries from localStorage:', error);
      return [];
    }
  });

  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(() => {
    // Find an entry that has no endTime
    // We need to check this from the loaded entries or a separate state?
    // Better to derive it from entries, but for simplicity let's check the list.
    // Actually, let's re-derive it in the effect or init.
    // But wait, useState init runs once.
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: TimeEntry[] = JSON.parse(stored);
        return parsed.find(e => !e.endTime) || null;
      }
    } catch { }
    return null;
  });

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    // Update active entry state if it changed in entries list
    const currentActive = entries.find(e => !e.endTime) || null;
    setActiveEntry(currentActive);
  }, [entries]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (activeEntry) {
      interval = setInterval(() => {
        const now = Date.now();
        const currentSessionDuration = now - activeEntry.startTime;
        
        // Calculate total duration for today including closed sessions
        const today = new Date().toISOString().split('T')[0];
        const todayEntries = entries.filter(e => e.date === today && e.id !== activeEntry.id);
        const previousDuration = todayEntries.reduce((acc, curr) => {
          return acc + ((curr.endTime || now) - curr.startTime);
        }, 0);

        setElapsedTime(previousDuration + currentSessionDuration);
      }, 1000);
    } else {
      // If no active entry, just show total for today
      const today = new Date().toISOString().split('T')[0];
      const todayEntries = entries.filter(e => e.date === today);
      const totalDuration = todayEntries.reduce((acc, curr) => {
        return acc + ((curr.endTime || curr.startTime) - curr.startTime);
      }, 0);
      setElapsedTime(totalDuration);
    }

    return () => clearInterval(interval);
  }, [activeEntry, entries]);

  const startShift = () => {
    if (activeEntry) return; // Already active

    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];
    
    const newEntry: TimeEntry = {
      id: crypto.randomUUID(),
      startTime: now,
      date: today,
    };

    setEntries(prev => [...prev, newEntry]);
  };

  const endShift = () => {
    if (!activeEntry) return;

    const now = Date.now();
    setEntries(prev => prev.map(e => 
      e.id === activeEntry.id ? { ...e, endTime: now } : e
    ));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const clearDay = (date: string) => {
    setEntries(prev => prev.filter(e => e.date !== date));
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)));

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDailyHistory = useCallback(() => {
    const history: Record<string, { totalDuration: number; entries: TimeEntry[] }> = {};

    entries.forEach(entry => {
      if (!history[entry.date]) {
        history[entry.date] = { totalDuration: 0, entries: [] };
      }
      history[entry.date].entries.push(entry);
      
      if (entry.endTime) {
         history[entry.date].totalDuration += (entry.endTime - entry.startTime);
      } else {
         // For active entries, calculate duration up to now
         history[entry.date].totalDuration += (Date.now() - entry.startTime);
      }
    });

    return Object.entries(history)
      .map(([date, data]) => ({
        date,
        totalDuration: data.totalDuration,
        entries: data.entries.sort((a, b) => b.startTime - a.startTime)
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [entries]);

  return {
    entries,
    activeEntry,
    elapsedTime,
    startShift,
    endShift,
    deleteEntry,
    clearDay,
    formatTime,
    getDailyHistory
  };
}
