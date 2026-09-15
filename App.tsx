import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskFilter } from './types';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import EmptyState from './components/EmptyState';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('taskloom_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statPulse, setStatPulse] = useState(0);

  useEffect(() => {
    localStorage.setItem('taskloom_data', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
    setStatPulse(p => p + 1);
  };

  const updateTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    if (!editingTask) return;
    setTasks(prev =>
      prev.map(t => (t.id === editingTask.id ? { ...t, ...taskData } : t))
    );
    setEditingTask(null);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
    setStatPulse(p => p + 1);
  };

  const deleteTask = (id: string): boolean => {
    const confirmed = confirm('Are you sure you want to delete this task?');
    if (!confirmed) return false;

    setTasks(prev => prev.filter(t => t.id !== id));
    setStatPulse(p => p + 1);
    return true;
  };

  const clearCompleted = () => {
    if (confirm('Clear all archived successes?')) {
      setTasks(prev => prev.filter(t => !t.completed));
      setStatPulse(p => p + 1);
    }
  };

  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tasks
      .filter(t => {
        const matchesFilter =
          filter === 'all' ||
          (filter === 'active' && !t.completed) ||
          (filter === 'completed' && t.completed);

        if (!normalizedQuery) return matchesFilter;

        const titleMatch = t.title.toLowerCase().includes(normalizedQuery);

        const displayedDate = t.date
          ? new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          : '';
        const dateMatch = displayedDate.toLowerCase().includes(normalizedQuery);

        const displayedTime = t.time || '';
        const timeMatch = displayedTime.toLowerCase().includes(normalizedQuery);

        const matchesSearch = titleMatch || dateMatch || timeMatch;

        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const dateTimeA = a.date ? new Date(`${a.date}T${a.time || '00:00'}`).getTime() : Infinity;
        const dateTimeB = b.date ? new Date(`${b.date}T${b.time || '00:00'}`).getTime() : Infinity;
        if (dateTimeA !== dateTimeB) return dateTimeA - dateTimeB;
        return b.createdAt - a.createdAt;
      });
  }, [tasks, filter, searchQuery]);

  // Empty-state mode derivations (SCRUM-31)
  const hasTasksInStorage = tasks.length > 0;
  const isFilterActive = filter !== 'all';
  const isSearchActive = searchQuery.trim().length > 0;
  const isNoResultsState =
    hasTasksInStorage &&
    (isFilterActive || isSearchActive) &&
    filteredTasks.length === 0;

  // Dashboard Analytics
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const activeCount = totalCount - completedCount;
  const efficiency = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500/30">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation & Brand */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h1 className="text-5xl font-black text-white tracking-tighter flex items-center gap-3">
              <span className="bg-gradient-to-br from-indigo-500 to-violet-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 011.512-.306c.386.03.776.133 1.156.31.381.177.744.435 1.057.777.313.342.569.764.739 1.242.17.478.252 1.011.245 1.577-.014 1.132-.451 2.214-1.266 3.063-.815.849-1.97 1.395-3.233 1.53a1.547 1.547 0 01-1.054-.22 1.545 1.545 0 01-.67-1.061c-.149-.714.129-1.437.725-1.967.596-.53 1.446-.723 2.183-.673a1.185 1.185 0 00-.01-2.37c-.66.046-1.333.235-1.922.56-.588.324-1.126.79-1.554 1.398-.428.607-.741 1.354-.933 2.168-.192.814-.261 1.693-.232 2.57.06 1.791.76 3.47 1.956 4.706.597.619 1.286 1.119 2.044 1.489.758.371 1.586.603 2.454.676 1.277.107 2.587-.137 3.722-.71 1.136-.574 2.162-1.463 2.846-2.52.342-.529.62-1.111.826-1.743.206-.631.341-1.314.408-2.043.134-1.462-.032-2.955-.45-4.305-.419-1.35-.995-2.587-1.631-3.642-.634-1.055-1.303-1.957-1.903-2.716a11.53 11.53 0 00-1.611-1.692z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              TaskLoom
            </h1>
          </div>

          <div className="glass-card flex p-1.5 rounded-2xl w-full sm:w-auto">
            {(['all', 'active', 'completed'] as TaskFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                    : 'text-slate-500 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        {/* Search & Intelligence */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search your tasks..."
            className="w-full pl-12 pr-4 py-4 glass-input rounded-2xl text-white placeholder-slate-500"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Dashboard Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-3xl text-center group transition-all hover:bg-white/[0.08]">
            <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest block mb-1">Total Tasks</span>
            <div key={`total-${statPulse}`} className="text-3xl font-black text-white animate-bar-pulse">
              {totalCount}
            </div>
          </div>
          <div className="glass-card p-5 rounded-3xl text-center group transition-all hover:bg-white/[0.08]">
            <span className="text-amber-500/80 text-[9px] font-black uppercase tracking-widest block mb-1">Active</span>
            <div key={`active-${statPulse}`} className="text-3xl font-black text-white animate-bar-pulse">
              {activeCount}
            </div>
          </div>
          <div className="glass-card p-5 rounded-3xl text-center group transition-all hover:bg-white/[0.08]">
            <span className="text-emerald-500/80 text-[9px] font-black uppercase tracking-widest block mb-1">Success</span>
            <div key={`done-${statPulse}`} className="text-3xl font-black text-white animate-bar-pulse">
              {completedCount}
            </div>
          </div>
          <div className="glass-card p-5 rounded-3xl text-center group transition-all hover:bg-white/[0.08]">
            <span className="text-indigo-400 text-[9px] font-black uppercase tracking-widest block mb-1">Flow</span>
            <div key={`eff-${statPulse}`} className="text-3xl font-black text-white animate-bar-pulse">
              {efficiency}%
            </div>
          </div>
        </section>

        {/* Input Studio */}
        <section className="glass-card p-8 sm:p-10 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none rotate-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-64 w-64" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">{editingTask ? 'Edit Task Entry' : 'Add New Task'}</h2>
          <TaskForm
            onSubmit={editingTask ? updateTask : addTask}
            initialData={editingTask || undefined}
            onCancel={editingTask ? () => setEditingTask(null) : undefined}
            onDelete={editingTask ? deleteTask : undefined}
            isEditing={!!editingTask}
          />
        </section>

        {/* List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Your Current List</h3>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-rose-400/70 hover:text-rose-400 text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                Clear Archive
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onEdit={setEditingTask} />
              ))
            ) : isNoResultsState ? (
              <EmptyState
                title="No results match your filter/search"
                description="Try adjusting your search or filter to see more tasks."
                actionLabel="Clear Search & Filter"
                onAction={() => { setFilter('all'); setSearchQuery(''); }}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      <footer className="mt-20 text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 glass-card rounded-2xl text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          TaskLoom Final • Secure Local Store • Precision Sorted
        </div>
        <p className="text-slate-600 text-[10px] font-medium italic">"The way to get started is to quit talking and begin doing."</p>
      </footer>
    </div>
  );
};

export default App;
