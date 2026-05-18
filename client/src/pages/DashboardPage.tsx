import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LeadFiltersBar } from '../components/LeadFilters';
import { LeadForm } from '../components/LeadForm';
import { Pagination } from '../components/Pagination';
import { StatCard } from '../components/StatCard';
import { ConfirmModal, Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { IconDownload, IconEdit, IconPlus, IconTrash } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { leadsApi } from '../services/api';
import type { Lead, LeadFilters, LeadSource, LeadStatus, PaginationMeta } from '../types';

const SOURCE_ICONS: Record<string, string> = {
  Website: '🌐',
  Instagram: '📸',
  Referral: '🤝',
};

export function DashboardPage() {
  const { isAdmin } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput);
  const [filters, setFilters] = useState<LeadFilters>({ page: 1, sort: 'latest' });
  const [showCreate, setShowCreate] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: LeadFilters = { ...filters, search: debouncedSearch || undefined };
      if (!params.status) delete params.status;
      if (!params.source) delete params.source;
      const res = await leadsApi.getAll(params);
      setLeads(res.data.data ?? []);
      setMeta(res.data.meta ?? null);
    } catch {
      setError('Failed to load leads. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => {
    setFilters((f) => ({ ...f, page: 1 }));
  }, [debouncedSearch, filters.status, filters.source, filters.sort]);

  const qualifiedCount = useMemo(
    () => leads.filter((l) => l.status === 'Qualified').length,
    [leads]
  );

  const handleFilterChange = (key: keyof LeadFilters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value || undefined, page: 1 }));
  };

  const handleCreate = async (data: {
    name: string; email: string; status: LeadStatus; source: LeadSource;
  }) => {
    await leadsApi.create(data);
    setShowCreate(false);
    fetchLeads();
  };

  const handleUpdate = async (data: {
    name: string; email: string; status: LeadStatus; source: LeadSource;
  }) => {
    if (!editLead) return;
    await leadsApi.update(editLead._id, data);
    setEditLead(null);
    fetchLeads();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await leadsApi.delete(deleteId);
      setDeleteId(null);
      fetchLeads();
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await leadsApi.exportCsv({
        status: filters.status,
        source: filters.source,
        search: debouncedSearch || undefined,
        sort: filters.sort,
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads-export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Leads Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track, filter, and manage your sales pipeline
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={<IconDownload />} loading={exporting} onClick={handleExport}>
            Export CSV
          </Button>
          <Button icon={<IconPlus />} onClick={() => setShowCreate(true)}>
            Add Lead
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Leads" value={meta?.total ?? '—'} accent="brand" />
        <StatCard label="On This Page" value={leads.length} hint="10 per page max" />
        <StatCard label="Qualified (page)" value={qualifiedCount} accent="success" />
      </div>

      <LeadFiltersBar
        filters={filters}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onFilterChange={handleFilterChange}
      />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
              📋
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">No leads found</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Try adjusting your filters or create a new lead to get started.
            </p>
            <Button className="mt-6" icon={<IconPlus />} onClick={() => setShowCreate(true)}>
              Create Lead
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50">
                    <th className="table-head">Lead</th>
                    <th className="table-head">Status</th>
                    <th className="table-head">Source</th>
                    <th className="table-head">Created</th>
                    <th className="table-head text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {leads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="group transition hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
                    >
                      <td className="table-cell">
                        <Link to={`/leads/${lead._id}`} className="block">
                          <p className="font-medium text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                            {lead.name}
                          </p>
                          <p className="text-xs text-slate-500">{lead.email}</p>
                        </Link>
                      </td>
                      <td className="table-cell">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="table-cell">
                        <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <span>{SOURCE_ICONS[lead.source]}</span>
                          {lead.source}
                        </span>
                      </td>
                      <td className="table-cell text-slate-500">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="table-cell">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setEditLead(lead)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800 dark:hover:text-brand-400"
                            title="Edit"
                          >
                            <IconEdit />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => setDeleteId(lead._id)}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                              title="Delete"
                            >
                              <IconTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {meta && (
              <Pagination meta={meta} onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))} />
            )}
          </>
        )}
      </div>

      <Modal
        open={showCreate}
        title="Create New Lead"
        subtitle="Add a lead to your pipeline"
        onClose={() => setShowCreate(false)}
      >
        <LeadForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      <Modal
        open={!!editLead}
        title="Edit Lead"
        subtitle="Update lead information"
        onClose={() => setEditLead(null)}
      >
        {editLead && (
          <LeadForm
            initial={editLead}
            onSubmit={handleUpdate}
            onCancel={() => setEditLead(null)}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Lead"
        message="This action cannot be undone. The lead will be permanently removed."
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
