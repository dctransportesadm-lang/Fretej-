import { useMemo } from 'react';
import { DashboardStats } from './DashboardStats';
import { AnalyticsChart } from './AnalyticsChart';
import { Freight, DateFilterType } from '../types';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Calendar, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';

interface HomePageProps {
  stats: {
    totalCount: number;
    totalValue: number;
    bestDay: { name: string; value: number } | null;
  };
  freights: Freight[];
  onViewAllHistory: () => void;
  filterType: DateFilterType;
  setFilterType: (type: DateFilterType) => void;
  customStartDate: string;
  setCustomStartDate: (date: string) => void;
  customEndDate: string;
  setCustomEndDate: (date: string) => void;
}

export function HomePage({ 
  stats, 
  freights = [], 
  onViewAllHistory,
  filterType,
  setFilterType,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate
}: HomePageProps) {
  // Get last 10 freights sorted by date (newest first)
  const recentFreights = useMemo(() => {
    if (!freights) return [];
    return [...freights]
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
      })
      .slice(0, 10);
  }, [freights]);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Visão Geral</h1>
        
        {/* Filters */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1 shadow-sm w-max sm:w-auto">
            {(['all', 'today', 'week', 'month'] as DateFilterType[]).map((type) => (
              <Button
                key={type}
                variant={filterType === type ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilterType(type)}
                className="capitalize text-xs sm:text-sm h-8 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
              >
                {type === 'all' ? 'Todos' : 
                 type === 'today' ? 'Hoje' :
                 type === 'week' ? 'Semana' : 'Mês'}
              </Button>
            ))}
            <Button
              variant={filterType === 'custom' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilterType('custom')}
              className="text-xs sm:text-sm h-8 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Período
            </Button>
          </div>
        </div>

        {/* Custom Date Range Inputs */}
        {filterType === 'custom' && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row gap-4 items-end animate-in fade-in slide-in-from-top-2">
            <div className="w-full sm:w-auto">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Data Início</label>
              <Input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="w-full sm:w-auto">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Data Fim</label>
              <Input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>
      
      <section>
        <DashboardStats stats={stats} />
      </section>
      
      <section>
        <AnalyticsChart freights={freights} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Atividades Recentes</h2>
          <button 
            onClick={onViewAllHistory}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center"
          >
            Ver tudo
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-0">
            {recentFreights.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                Nenhuma atividade recente encontrada.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentFreights.map((freight) => (
                  <div key={freight.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {freight.clientName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(freight.date)}
                        </span>
                        {freight.description && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 truncate border-l border-gray-200 dark:border-gray-600 pl-2">
                            {freight.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
                      {formatCurrency(freight.value)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
