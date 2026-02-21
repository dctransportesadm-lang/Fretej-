import { Expense, DateFilterType } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { formatCurrency, formatDate } from '../lib/utils';
import { Trash2, Calendar, DollarSign, Tag, Plus } from 'lucide-react';

interface ExpensesPageProps {
  expenses: Expense[];
  onAddExpense: () => void;
  onDeleteExpense: (id: string) => void;
  filterType: DateFilterType;
  setFilterType: (type: DateFilterType) => void;
  customStartDate: string;
  setCustomStartDate: (date: string) => void;
  customEndDate: string;
  setCustomEndDate: (date: string) => void;
  stats: {
    totalCount: number;
    totalValue: number;
  };
}

export function ExpensesPage({
  expenses,
  onAddExpense,
  onDeleteExpense,
  filterType,
  setFilterType,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  stats,
}: ExpensesPageProps) {
  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Despesas</h1>
        <Button onClick={onAddExpense} className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800">
          <Plus className="h-4 w-4 mr-2" />
          Nova Despesa
        </Button>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground dark:text-gray-400 uppercase tracking-wider">Total Despesas</CardTitle>
            <Tag className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold dark:text-white">{stats.totalCount}</div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground dark:text-gray-400 uppercase tracking-wider">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(stats.totalValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {expenses.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            Nenhuma despesa encontrada para o período selecionado.
          </div>
        ) : (
          expenses.map((expense) => (
            <Card key={expense.id} className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                      {expense.category}
                    </h3>
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">
                      - {formatCurrency(expense.value)}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(expense.date)}
                    </span>
                    {expense.description && (
                      <span className="truncate border-l border-gray-200 dark:border-gray-600 pl-2">
                        {expense.description}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 -mr-2"
                  onClick={() => onDeleteExpense(expense.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
