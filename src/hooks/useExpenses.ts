import { useState, useEffect, useMemo } from 'react';
import { Expense, DateFilterType } from '../types';
import { isSameDay, isSameWeek, isSameMonth, parseISO, startOfDay, endOfDay } from 'date-fns';

const STORAGE_KEY = 'expenses_data';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing expenses from localStorage:', error);
      return [];
    }
  });

  const [filterType, setFilterType] = useState<DateFilterType>('month');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      
      switch (filterType) {
        case 'today':
          return isSameDay(expenseDate, now);
        case 'week':
          return isSameWeek(expenseDate, now, { weekStartsOn: 1 }); // Monday start
        case 'month':
          return isSameMonth(expenseDate, now);
        case 'custom':
          if (!customStartDate || !customEndDate) return true;
          const start = startOfDay(parseISO(customStartDate));
          const end = endOfDay(parseISO(customEndDate));
          return expenseDate >= start && expenseDate <= end;
        case 'all':
        default:
          return true;
      }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, filterType, customStartDate, customEndDate]);

  const stats = useMemo(() => {
    const totalCount = filteredExpenses.length;
    const totalValue = filteredExpenses.reduce((acc, curr) => acc + curr.value, 0);
    
    return {
      totalCount,
      totalValue,
    };
  }, [filteredExpenses]);

  return {
    expenses,
    filteredExpenses,
    addExpense,
    deleteExpense,
    filterType,
    setFilterType,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    stats
  };
}
