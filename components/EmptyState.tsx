
import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Your List is Empty',
  description = 'Start building your productivity by creating your first task today.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center glass-card rounded-[2.5rem]">
      <div className="w-24 h-24 mb-8 rounded-[2rem] bg-indigo-500/5 flex items-center justify-center text-indigo-500/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-500 max-w-xs font-medium leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          data-testid="empty-state-reset-btn"
          className="mt-6 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-wider transition-all active:scale-[0.97] shadow-lg shadow-indigo-600/30"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
