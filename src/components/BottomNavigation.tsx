import { Home, History, Settings, Plus, Wallet, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export type Tab = 'home' | 'history' | 'settings' | 'entry' | 'expenses' | 'expense-entry' | 'time-tracking';

interface BottomNavigationProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomNavigation({ currentTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-lg rounded-full px-6 py-3 flex items-center gap-4 transition-colors duration-300">
      <button
        onClick={() => onTabChange('home')}
        className={cn(
          "flex flex-col items-center gap-1 transition-colors",
          currentTab === 'home' ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        )}
      >
        <Home className={cn("h-6 w-6", currentTab === 'home' && "fill-current")} />
      </button>

      <button
        onClick={() => onTabChange('time-tracking')}
        className={cn(
          "flex flex-col items-center gap-1 transition-colors",
          currentTab === 'time-tracking' ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        )}
      >
        <Clock className={cn("h-6 w-6", currentTab === 'time-tracking' && "fill-current")} />
      </button>

      <button
        onClick={() => onTabChange('entry')}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-md transform transition-transform hover:scale-105 -mt-8 border-4 border-gray-50 dark:border-gray-900"
      >
        <Plus className="h-6 w-6" />
      </button>

      <button
        onClick={() => onTabChange('expenses')}
        className={cn(
          "flex flex-col items-center gap-1 transition-colors",
          (currentTab === 'expenses' || currentTab === 'expense-entry') ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        )}
      >
        <Wallet className={cn("h-6 w-6", (currentTab === 'expenses' || currentTab === 'expense-entry') && "fill-current")} />
      </button>

      <button
        onClick={() => onTabChange('history')}
        className={cn(
          "flex flex-col items-center gap-1 transition-colors",
          currentTab === 'history' ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        )}
      >
        <History className={cn("h-6 w-6", currentTab === 'history' && "fill-current")} />
      </button>

      <button
        onClick={() => onTabChange('settings')}
        className={cn(
          "flex flex-col items-center gap-1 transition-colors",
          currentTab === 'settings' ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        )}
      >
        <Settings className={cn("h-6 w-6", currentTab === 'settings' && "fill-current")} />
      </button>
    </div>
  );
}
