import { FreightList } from './FreightList';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { DateFilterType, Freight } from '../types';
import { DashboardStats } from './DashboardStats';

interface HistoryPageProps {
  freights: Freight[];
  stats: {
    totalCount: number;
    totalValue: number;
    bestDay: { name: string; value: number } | null;
  };
  deleteFreight: (id: string) => void;
  filterType: DateFilterType;
  setFilterType: (type: DateFilterType) => void;
  customStartDate: string;
  setCustomStartDate: (date: string) => void;
  customEndDate: string;
  setCustomEndDate: (date: string) => void;
}

export function HistoryPage({
  freights,
  stats,
  deleteFreight,
  filterType,
  setFilterType,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
}: HistoryPageProps) {
  return (
    <div className="space-y-4 pb-20">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Histórico</h1>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
            {freights.length} registros
          </span>
        </div>
        
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
      </div>

      {/* Custom Date Range Inputs */}
      {filterType === 'custom' && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-4 flex flex-col sm:flex-row gap-4 items-end animate-in fade-in slide-in-from-top-2">
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

      {/* Stats Cards */}
      <DashboardStats stats={stats} showBestDay={false} />

      <FreightList freights={freights} onDelete={deleteFreight} />
    </div>
  );
}
