
import React from 'react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const getDueStatus = () => {
    if (!task.date) return null;
    const taskDate = new Date(`${task.date}T${task.time || '23:59'}`);
    const now = new Date();
    const diff = taskDate.getTime() - now.getTime();
    
    if (task.completed) return null;
    if (diff < 0) return <span className="text-[10px] text-rose-400 font-bold uppercase tracking-tight">Overdue</span>;
    if (diff < 86400000) return <span className="text-[10px] text-amber-400 font-bold uppercase tracking-tight">Soon</span>;
    return null;
  };

  return (
    <div 
      className={`group glass-card p-5 rounded-3xl flex items-start gap-4 transition-all duration-500 task-enter ${
        task.completed ? 'opacity-50 grayscale-[0.6]' : 'hover:scale-[1.02] hover:bg-white/[0.07] cursor-pointer'
      }`}
      onClick={(e) => {
        // Prevent click if we're hitting buttons
        const target = e.target as HTMLElement;
        if (target.closest('button')) return;
        onToggle(task.id);
      }}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
        className={`mt-1 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
          task.completed 
            ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/40' 
            : 'border-slate-600 group-hover:border-indigo-400'
        }`}
      >
        {task.completed && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className={`text-white font-semibold text-lg leading-tight transition-all truncate ${task.completed ? 'line-through text-slate-500' : ''}`}>
            {task.title}
          </h3>
          {getDueStatus()}
        </div>
        
        {(task.date || task.time) && (
          <div className="flex items-center gap-3 text-slate-400">
             <span className="flex items-center gap-1.5 text-xs font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {task.date ? new Date(task.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                {task.time ? ` @ ${task.time}` : ''}
              </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(task); }}
          className="p-2.5 hover:bg-white/10 text-slate-400 hover:text-indigo-300 rounded-xl transition-colors"
          title="Edit Name & Details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className="p-2.5 hover:bg-white/10 text-slate-400 hover:text-rose-400 rounded-xl transition-colors"
          title="Remove Permanently"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
