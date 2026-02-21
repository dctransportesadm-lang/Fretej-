import { useState } from 'react';
import { ArrowLeft, Save, DollarSign, Calendar, FileText, Tag } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Expense } from '../types';

interface ExpenseEntryPageProps {
  onBack: () => void;
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
}

export function ExpenseEntryPage({ onBack, onAddExpense }: ExpenseEntryPageProps) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !value || !date) return;

    onAddExpense({
      category,
      description,
      value: Number(value),
      date,
    });

    onBack();
  };

  return (
    <div className="max-w-md mx-auto pb-20 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 dark:text-gray-200">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nova Despesa</h1>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Detalhes da Despesa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Categoria
              </label>
              <Input
                placeholder="Ex: Combustível, Manutenção, Alimentação"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Valor (R$)
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Descrição (Opcional)
              </label>
              <Input
                placeholder="Detalhes adicionais..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              />
            </div>

            <Button type="submit" className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800">
              <Save className="mr-2 h-4 w-4" />
              Salvar Despesa
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
