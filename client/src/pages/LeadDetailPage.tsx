import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { leadsApi } from '../services/api';
import type { Lead } from '../types';

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    leadsApi
      .getById(id)
      .then((res) => setLead(res.data.data ?? null))
      .catch(() => setError('Lead not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="card mx-auto max-w-md py-16 text-center">
        <p className="text-rose-500 mb-4">{error || 'Lead not found'}</p>
        <Link to="/">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const fields = [
    { label: 'Email', value: lead.email },
    { label: 'Source', value: lead.source },
    {
      label: 'Created',
      value: new Date(lead.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    },
    {
      label: 'Created by',
      value:
        typeof lead.createdBy === 'object' ? lead.createdBy?.name : lead.createdBy ?? '—',
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-brand-600 dark:hover:text-brand-400"
      >
        ← Back to Dashboard
      </Link>

      <div className="card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{lead.name}</h1>
            <p className="mt-1 text-slate-500">{lead.email}</p>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
