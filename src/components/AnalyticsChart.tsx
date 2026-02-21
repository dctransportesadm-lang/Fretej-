import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Freight } from '../types';
import { formatCurrency } from '../lib/utils';

interface AnalyticsChartProps {
  freights: Freight[];
}

export function AnalyticsChart({ freights }: AnalyticsChartProps) {
  const dailyData = useMemo(() => {
    const data: Record<string, number> = {};
    freights.forEach((f) => {
      data[f.date] = (data[f.date] || 0) + f.value;
    });
    return Object.entries(data)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [freights]);

  const weeklyData = useMemo(() => {
    const data: Record<number, number> = {};
    freights.forEach((f) => {
      const dayIndex = new Date(f.date).getDay();
      data[dayIndex] = (data[dayIndex] || 0) + f.value;
    });
    
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    return Object.entries(data)
      .map(([dayIndex, value]) => ({
        name: dayNames[parseInt(dayIndex)],
        index: parseInt(dayIndex),
        value
      }))
      .sort((a, b) => a.index - b.index);
  }, [freights]);

  if (freights.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-1 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium dark:text-gray-200">Faturamento Diário</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pl-0">
          <div className="h-[200px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => `R$${value}`}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  width={60}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Faturamento']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')}
                  contentStyle={{ fontSize: '12px', borderRadius: '8px', backgroundColor: '#fff', borderColor: '#e5e7eb' }}
                  itemStyle={{ color: '#111827' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium dark:text-gray-200">Por Dia da Semana</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pl-0">
          <div className="h-[200px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#6b7280' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => `R$${value}`}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  width={60}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Faturamento']}
                  contentStyle={{ fontSize: '12px', borderRadius: '8px', backgroundColor: '#fff', borderColor: '#e5e7eb' }}
                  itemStyle={{ color: '#111827' }}
                />
                <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
