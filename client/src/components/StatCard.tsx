interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  accent?: 'default' | 'brand' | 'success';
}

const accents = {
  default: 'from-slate-500/10 to-transparent',
  brand: 'from-brand-500/10 to-transparent',
  success: 'from-emerald-500/10 to-transparent',
};

export function StatCard({ label, value, hint, accent = 'default' }: StatCardProps) {
  return (
    <div className={`card relative overflow-hidden p-5`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${accents[accent]} pointer-events-none`} />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
