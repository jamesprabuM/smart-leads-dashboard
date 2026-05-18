import type { LeadStatus } from '../../types';

const STATUS_STYLES: Record<LeadStatus, string> = {
  New: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-950/50 dark:text-sky-300',
  Contacted: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-300',
  Qualified: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300',
  Lost: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-300',
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

export function RoleBadge({ role }: { role: 'admin' | 'sales' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        role === 'admin'
          ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-600/20 dark:bg-brand-950/50 dark:text-brand-300'
          : 'bg-slate-100 text-slate-600 ring-1 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300'
      }`}
    >
      {role === 'admin' ? 'Admin' : 'Sales'}
    </span>
  );
}
