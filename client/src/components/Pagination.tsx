import type { PaginationMeta } from '../types';
import { Button } from './ui/Button';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-5 py-4 dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Page <span className="font-medium text-slate-700 dark:text-slate-200">{meta.page}</span> of{' '}
        <span className="font-medium text-slate-700 dark:text-slate-200">{meta.totalPages}</span>
        <span className="mx-2 text-slate-300">·</span>
        {meta.total} total leads
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!meta.hasPrevPage}
          onClick={() => onPageChange(meta.page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
