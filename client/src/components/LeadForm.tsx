import { useState, type FormEvent } from 'react';
import type { Lead, LeadSource, LeadStatus } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

interface LeadFormProps {
  initial?: Partial<Lead>;
  onSubmit: (data: {
    name: string;
    email: string;
    status: LeadStatus;
    source: LeadSource;
  }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function LeadForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = 'Save Lead',
}: LeadFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [status, setStatus] = useState<LeadStatus>(initial?.status ?? 'New');
  const [source, setSource] = useState<LeadSource>(initial?.source ?? 'Website');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), email: email.trim(), status, source });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Select
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value as LeadStatus)}
        options={STATUS_OPTIONS}
      />
      <Select
        label="Source"
        value={source}
        onChange={(e) => setSource(e.target.value as LeadSource)}
        options={SOURCE_OPTIONS}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
