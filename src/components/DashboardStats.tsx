import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { formatCurrency } from '../lib/utils';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalCount: number;
    totalValue: number;
    bestDay: { name: string; value: number } | null;
  };
  showBestDay?: boolean;
}

export function DashboardStats({ stats, showBestDay = true }: DashboardStatsProps) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${showBestDay ? 'md:grid-cols-3' : ''} md:gap-4`}>
      <Card className="col-span-1 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground dark:text-gray-400 uppercase tracking-wider">Fretes</CardTitle>
          <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-xl md:text-2xl font-bold dark:text-white">{stats.totalCount}</div>
          <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-1">
            Qtd. total
          </p>
        </CardContent>
      </Card>
      <Card className="col-span-1 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground dark:text-gray-400 uppercase tracking-wider">Receita</CardTitle>
          <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(stats.totalValue)}
          </div>
          <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-1">
            Total bruto
          </p>
        </CardContent>
      </Card>
      {showBestDay && (
        <Card className="col-span-2 md:col-span-1 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground dark:text-gray-400 uppercase tracking-wider">Melhor Dia</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold capitalize truncate dark:text-white">
              {stats.bestDay ? stats.bestDay.name : '-'}
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
              {stats.bestDay
                ? `Total: ${formatCurrency(stats.bestDay.value)}`
                : 'Sem dados'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
