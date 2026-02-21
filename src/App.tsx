import { useState } from 'react';
import { useFreights } from './hooks/useFreights';
import { useExpenses } from './hooks/useExpenses';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthPage } from './components/AuthPage';
import { FreightEntryPage } from './components/FreightEntryPage';
import { HomePage } from './components/HomePage';
import { HistoryPage } from './components/HistoryPage';
import { SettingsPage } from './components/SettingsPage';
import { ExpensesPage } from './components/ExpensesPage';
import { ExpenseEntryPage } from './components/ExpenseEntryPage';
import { TimeTrackingPage } from './components/TimeTrackingPage';
import { BottomNavigation, Tab } from './components/BottomNavigation';
import { Truck } from 'lucide-react';

function AppContent() {
  const { user, logout } = useAuth();
  const {
    filteredFreights,
    addFreight,
    deleteFreight,
    filterType,
    setFilterType,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    stats,
  } = useFreights();

  const {
    filteredExpenses,
    addExpense,
    deleteExpense,
    filterType: expenseFilterType,
    setFilterType: setExpenseFilterType,
    customStartDate: expenseStartDate,
    setCustomStartDate: setExpenseStartDate,
    customEndDate: expenseEndDate,
    setCustomEndDate: setExpenseEndDate,
    stats: expenseStats,
  } = useExpenses();

  const [currentTab, setCurrentTab] = useState<Tab>('home');

  if (currentTab === 'entry') {
    return (
      <FreightEntryPage 
        onBack={() => setCurrentTab('home')} 
        onAddFreight={addFreight} 
      />
    );
  }

  if (currentTab === 'expense-entry') {
    return (
      <ExpenseEntryPage
        onBack={() => setCurrentTab('expenses')}
        onAddExpense={addExpense}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header - Only show on Home, History, Settings, Expenses */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center">
          <div className="text-center flex flex-col items-center">
            {user?.avatar && (
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full object-cover mb-1 border border-gray-200 dark:border-gray-600" 
              />
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Bem-vindo,</p>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight truncate max-w-[200px]">
              {user?.name || 'Motorista'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'home' && (
          <HomePage 
            stats={stats} 
            freights={filteredFreights} 
            onViewAllHistory={() => setCurrentTab('history')}
            filterType={filterType}
            setFilterType={setFilterType}
            customStartDate={customStartDate}
            setCustomStartDate={setCustomStartDate}
            customEndDate={customEndDate}
            setCustomEndDate={setCustomEndDate}
          />
        )}
        
        {currentTab === 'history' && (
          <HistoryPage 
            freights={filteredFreights}
            stats={stats}
            deleteFreight={deleteFreight}
            filterType={filterType}
            setFilterType={setFilterType}
            customStartDate={customStartDate}
            setCustomStartDate={setCustomStartDate}
            customEndDate={customEndDate}
            setCustomEndDate={setCustomEndDate}
          />
        )}

        {currentTab === 'expenses' && (
          <ExpensesPage
            expenses={filteredExpenses}
            onAddExpense={() => setCurrentTab('expense-entry')}
            onDeleteExpense={deleteExpense}
            filterType={expenseFilterType}
            setFilterType={setExpenseFilterType}
            customStartDate={expenseStartDate}
            setCustomStartDate={setExpenseStartDate}
            customEndDate={expenseEndDate}
            setCustomEndDate={setExpenseEndDate}
            stats={expenseStats}
          />
        )}

        {currentTab === 'time-tracking' && (
          <TimeTrackingPage />
        )}

        {currentTab === 'settings' && (
          <SettingsPage user={user} logout={logout} />
        )}
      </main>

      <BottomNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}

function AppWrapper() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AppContent /> : <AuthPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppWrapper />
      </ThemeProvider>
    </AuthProvider>
  );
}
