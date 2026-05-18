import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { IconLogo } from './icons';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footer: ReactNode;
}

export function AuthLayout({ children, title, subtitle, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-12 text-white">
        <Link to="/" className="flex items-center gap-3">
          <IconLogo className="h-10 w-10" />
          <span className="text-xl font-bold tracking-tight">Smart Leads</span>
        </Link>
        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Manage leads smarter,<br />close deals faster.
          </h1>
          <p className="mt-4 max-w-md text-brand-100 text-lg leading-relaxed">
            A professional lead management dashboard built with React, TypeScript, and the MERN stack.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-brand-100">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              JWT authentication & role-based access
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Advanced filters, search & pagination
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              CSV export & real-time dashboard
            </li>
          </ul>
        </div>
        <p className="text-sm text-brand-200">© 2026 Smart Leads Dashboard</p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <IconLogo />
            <span className="text-lg font-bold text-slate-900 dark:text-white">Smart Leads</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
        </div>
      </div>
    </div>
  );
}
