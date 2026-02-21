import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';
import { FreightForm } from './FreightForm';
import { Freight } from '../types';

interface FreightEntryPageProps {
  onBack: () => void;
  onAddFreight: (freight: Omit<Freight, 'id'>) => void;
}

export function FreightEntryPage({ onBack, onAddFreight }: FreightEntryPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Novo Frete</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <FreightForm onAddFreight={(f) => {
          onAddFreight(f);
          onBack();
        }} />
      </main>
    </div>
  );
}
