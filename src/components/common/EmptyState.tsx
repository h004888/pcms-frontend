interface EmptyStateProps {
  message: string;
  icon?: string;
  className?: string;
}

export function EmptyState({ message, icon = '📭', className = '' }: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 text-slate-500 ${className}`}>
      <div className="text-4xl mb-3" aria-hidden="true">{icon}</div>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
