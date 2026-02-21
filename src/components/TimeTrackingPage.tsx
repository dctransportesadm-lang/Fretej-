import { useState } from 'react';
import { Play, Square, Clock, Calendar as CalendarIcon, History, Trash2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { useTimeTracking } from '../hooks/useTimeTracking';
import { formatDate, cn } from '../lib/utils';

export function TimeTrackingPage() {
  const { activeEntry, elapsedTime, startShift, endShift, deleteEntry, clearDay, formatTime, entries, getDailyHistory } = useTimeTracking();
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [isClearingDay, setIsClearingDay] = useState(false);
  const [view, setView] = useState<'today' | 'history'>('today');
  const [expandedDays, setExpandedDays] = useState<string[]>([]);
  
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = entries
    .filter(e => e.date === today)
    .sort((a, b) => b.startTime - a.startTime);

  const history = getDailyHistory();

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id);
    setEntryToDelete(null);
  };

  const handleClearDay = () => {
    clearDay(today);
    setIsClearingDay(false);
  };

  const toggleDay = (date: string) => {
    setExpandedDays(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Controle de Ponto</h1>
      </div>

      <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <button 
          className={cn(
            "flex-1 py-1.5 text-sm font-medium rounded-md transition-all", 
            view === 'today' ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          )}
          onClick={() => setView('today')}
        >
          Hoje
        </button>
        <button 
          className={cn(
            "flex-1 py-1.5 text-sm font-medium rounded-md transition-all", 
            view === 'history' ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          )}
          onClick={() => setView('history')}
        >
          Histórico
        </button>
      </div>

      {view === 'today' ? (
        <>
          {/* Main Timer Card */}
          <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden relative">
            <div className={`absolute top-0 left-0 w-full h-1 ${activeEntry ? 'bg-green-500 animate-pulse' : 'bg-gray-200 dark:bg-gray-700'}`} />
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {activeEntry ? 'Turno em Andamento' : 'Total Trabalhado Hoje'}
              </div>
              
              <div className="text-6xl font-mono font-bold text-gray-900 dark:text-white mb-8 tabular-nums tracking-tight">
                {formatTime(elapsedTime)}
              </div>

              <div className="w-full max-w-xs">
                {!activeEntry ? (
                  <Button 
                    onClick={startShift}
                    className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 dark:shadow-none transition-all hover:scale-[1.02]"
                  >
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    Iniciar Turno
                  </Button>
                ) : (
                  <Button 
                    onClick={endShift}
                    className="w-full h-14 text-lg bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 dark:shadow-none transition-all hover:scale-[1.02]"
                  >
                    <Square className="mr-2 h-5 w-5 fill-current" />
                    Encerrar Turno
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Today's History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <History className="h-5 w-5" />
                Registros de Hoje
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  {formatDate(today)}
                </span>
                {todayEntries.length > 0 && (
                  <div className="relative">
                    {isClearingDay ? (
                      <div className="absolute right-0 top-0 flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-lg border border-red-200 dark:border-red-900 z-10">
                        <span className="text-xs text-red-600 font-medium whitespace-nowrap px-2">Apagar tudo?</span>
                        <Button size="sm" variant="destructive" className="h-7 px-2" onClick={handleClearDay}>Sim</Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setIsClearingDay(false)}>Não</Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => setIsClearingDay(true)}
                        title="Apagar todos os registros de hoje"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {todayEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                Nenhum registro de ponto hoje.
              </div>
            ) : (
              <div className="space-y-3">
                {todayEntries.map((entry) => {
                  const duration = (entry.endTime || Date.now()) - entry.startTime;
                  const isOngoing = !entry.endTime;

                  return (
                    <Card key={entry.id} className="dark:bg-gray-800 dark:border-gray-700 overflow-visible">
                      <CardContent className="p-4 flex items-center justify-between relative">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${isOngoing ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {new Date(entry.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              {' - '}
                              {entry.endTime 
                                ? new Date(entry.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                                : <span className="text-green-600 dark:text-green-400 font-medium">Em andamento...</span>
                              }
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {isOngoing ? 'Atividade atual' : 'Turno finalizado'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className={`font-mono font-medium ${isOngoing ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                              {formatTime(duration)}
                            </span>
                          </div>
                          
                          {!isOngoing && (
                            <div className="relative">
                              {entryToDelete === entry.id ? (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-lg border border-red-200 dark:border-red-900 z-10">
                                  <Button size="sm" variant="destructive" className="h-6 w-6 p-0" onClick={() => handleDeleteEntry(entry.id)}>✓</Button>
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setEntryToDelete(null)}>✕</Button>
                                </div>
                              ) : (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  onClick={() => setEntryToDelete(entry.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              Nenhum histórico disponível.
            </div>
          ) : (
            history.map((day) => (
              <Card key={day.date} className="dark:bg-gray-800 dark:border-gray-700">
                <button 
                  onClick={() => toggleDay(day.date)}
                  className="w-full text-left"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                        <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {formatDate(day.date)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {day.entries.length} registro{day.entries.length !== 1 && 's'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-gray-900 dark:text-white">
                        {formatTime(day.totalDuration)}
                      </span>
                      {expandedDays.includes(day.date) ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </CardContent>
                </button>
                
                {expandedDays.includes(day.date) && (
                  <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="p-4 space-y-2">
                      {day.entries.map((entry) => {
                        const duration = (entry.endTime || Date.now()) - entry.startTime;
                        return (
                          <div key={entry.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(entry.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                {' - '}
                                {entry.endTime 
                                  ? new Date(entry.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                                  : '...'
                                }
                              </span>
                            </div>
                            <span className="font-mono text-gray-900 dark:text-white text-xs">
                              {formatTime(duration)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
