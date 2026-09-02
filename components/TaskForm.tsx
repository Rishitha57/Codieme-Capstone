
import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../types';

interface TaskFormProps {
  onSubmit: (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  initialData?: Task;
  onCancel?: () => void;
  isEditing?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, onCancel, isEditing }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [time, setTime] = useState(initialData?.time || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDate(initialData.date || '');
      setTime(initialData.time || '');
      inputRef.current?.focus();
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({ title: title.trim(), date, time });
    
    if (!isEditing) {
      setTitle('');
      setDate('');
      setTime('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-500">
      <div className="space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Design system architecture"
            required
            className="w-full px-5 py-4 glass-input rounded-2xl text-white placeholder-slate-500 text-lg font-medium"
          />
          {isEditing && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold">
              Editing
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Due Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 glass-input rounded-xl text-white text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 glass-input rounded-xl text-white text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className={`flex-1 font-bold py-4 rounded-2xl transition-all active:scale-[0.97] shadow-xl flex items-center justify-center gap-2 ${
            isEditing 
            ? 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white' 
            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isEditing ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Update Task
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add to Loom
            </>
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 glass-card hover:bg-white/10 text-white font-semibold rounded-2xl transition-all active:scale-[0.97]"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
