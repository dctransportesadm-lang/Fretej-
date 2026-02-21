import { Freight } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { formatCurrency, formatDate } from '../lib/utils';
import { Trash2, Calendar } from 'lucide-react';

interface FreightListProps {
  freights: Freight[];
  onDelete: (id: string) => void;
}

export function FreightList({ freights, onDelete }: FreightListProps) {
  if (freights.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        Nenhum frete encontrado para o período selecionado.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile View: Compact List */}
      <div className="block sm:hidden space-y-3">
        {freights.map((freight) => (
          <div 
            key={freight.id} 
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm p-3 flex justify-between items-center"
          >
            <div className="flex-1 min-w-0 pr-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                  {freight.clientName}
                </h3>
                <span className="text-green-600 dark:text-green-400 font-bold text-sm">
                  {formatCurrency(freight.value)}
                </span>
              </div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(freight.date)}
                </span>
                <span className="capitalize bg-gray-50 dark:bg-gray-700 px-1.5 py-0.5 rounded text-[10px] text-gray-600 dark:text-gray-300">
                  {new Date(freight.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                </span>
              </div>
              {freight.description && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                  {freight.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 -mr-2"
              onClick={() => onDelete(freight.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Desktop View: Grid Cards */}
      <div className="hidden sm:grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {freights.map((freight) => (
          <Card key={freight.id} className="relative overflow-hidden transition-all hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold truncate pr-8 dark:text-white">
                  {freight.clientName}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 h-8 w-8 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 dark:hover:bg-red-900/20"
                  onClick={() => onDelete(freight.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(freight.value)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(freight.date)}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full capitalize text-gray-600 dark:text-gray-300">
                    {new Date(freight.date).toLocaleDateString('pt-BR', { weekday: 'long' })}
                  </span>
                </div>
                {freight.description && (
                  <div className="flex items-start gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <span className="italic text-gray-500 dark:text-gray-400">{freight.description}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
