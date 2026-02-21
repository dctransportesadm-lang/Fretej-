import { useState, FormEvent } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Freight } from '../types';

interface FreightFormProps {
  onAddFreight: (freight: Omit<Freight, 'id' | 'createdAt'>) => void;
}

export function FreightForm({ onAddFreight }: FreightFormProps) {
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!clientName || !date || !value) return;

    onAddFreight({
      clientName,
      description,
      date,
      value: parseFloat(value),
    });

    setClientName('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setValue('');
  };

  return (
    <Card className="border-0 shadow-none sm:border sm:shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-0 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="clientName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Cliente
              </label>
              <Input
                id="clientName"
                placeholder="Nome do cliente"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="value" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Valor (R$)
              </label>
              <Input
                id="value"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Data
              </label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Descrição (Opcional)
              </label>
              <Input
                id="description"
                placeholder="Detalhes do frete..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Salvar Lançamento
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
