export function Spinner({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <div
      className={`animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600 dark:border-brand-900 dark:border-t-brand-500 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
