import { useState, useEffect, useMemo } from 'react';
import { Freight, DateFilterType } from '../types';
import { isSameDay, isSameWeek, isSameMonth, parseISO, startOfDay, endOfDay } from 'date-fns';

const STORAGE_KEY = 'freights_data';

export function useFreights() {
  const [freights, setFreights] = useState<Freight[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing freights from localStorage:', error);
      return [];
    }
  });

  const [filterType, setFilterType] = useState<DateFilterType>('month');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(freights));
  }, [freights]);

  const addFreight = (freight: Omit<Freight, 'id' | 'createdAt'>) => {
    const newFreight: Freight = {
      ...freight,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setFreights(prev => [newFreight, ...prev]);
  };

  const deleteFreight = (id: string) => {
    setFreights(prev => prev.filter(f => f.id !== id));
  };

  const filteredFreights = useMemo(() => {
    const now = new Date();
    return freights.filter(freight => {
      const freightDate = parseISO(freight.date);
      
      switch (filterType) {
        case 'today':
          return isSameDay(freightDate, now);
        case 'week':
          return isSameWeek(freightDate, now, { weekStartsOn: 1 }); // Monday start
        case 'month':
          return isSameMonth(freightDate, now);
        case 'custom':
          if (!customStartDate || !customEndDate) return true;
          const start = startOfDay(parseISO(customStartDate));
          const end = endOfDay(parseISO(customEndDate));
          return freightDate >= start && freightDate <= end;
        case 'all':
        default:
          return true;
      }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [freights, filterType, customStartDate, customEndDate]);

  const stats = useMemo(() => {
    const totalCount = filteredFreights.length;
    const totalValue = filteredFreights.reduce((acc, curr) => acc + curr.value, 0);
    
    // Calculate most profitable day of week
    const dayEarnings: Record<string, number> = {};
    filteredFreights.forEach(f => {
      const dayName = new Date(f.date).toLocaleDateString('pt-BR', { weekday: 'long' });
      dayEarnings[dayName] = (dayEarnings[dayName] || 0) + f.value;
    });
    
    const sortedDays = Object.entries(dayEarnings).sort(([,a], [,b]) => b - a);
    const bestDay = sortedDays.length > 0 ? sortedDays[0] : null;

    return {
      totalCount,
      totalValue,
      bestDay: bestDay ? { name: bestDay[0], value: bestDay[1] } : null
    };
  }, [filteredFreights]);

  return {
    freights,
    filteredFreights,
    addFreight,
    deleteFreight,
    filterType,
    setFilterType,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    stats
  };
}
