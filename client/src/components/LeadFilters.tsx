import type { LeadFilters as Filters, SortOrder } from '../types';
import { IconSearch } from './icons';
import { Input } from './ui/Input';
import { Select } from './ui/Select';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const SOURCE_OPTIONS = [
  { value: '', label: 'All Sources' },
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
];

interface LeadFiltersProps {
  filters: Filters;
  searchInput: string;
  onSearchChange: (v: string) => void;
  onFilterChange: (key: keyof Filters, value: string) => void;
}

export function LeadFiltersBar({
  filters,
  searchInput,
  onSearchChange,
  onFilterChange,
}: LeadFiltersProps) {
  return (
    <div className="card p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Filters & Search
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Input
          label="Search"
          placeholder="Name or email..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<IconSearch />}
        />
        <Select
          label="Status"
          value={filters.status ?? ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
          options={STATUS_OPTIONS}
        />
        <Select
          label="Source"
          value={filters.source ?? ''}
          onChange={(e) => onFilterChange('source', e.target.value)}
          options={SOURCE_OPTIONS}
        />
        <Select
          label="Sort"
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value as SortOrder)}
          options={SORT_OPTIONS}
        />
      </div>
    </div>
  );
}
