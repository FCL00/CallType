import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            CT
          </span>
          <span>CallType</span>
        </Link>

        {/* Zone 2: Nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <Link
            to="/app"
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              isActive('/app') && !location.pathname.includes('/accounts')
                ? 'text-emerald-700 font-semibold'
                : ''
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/app#categories"
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              location.pathname.includes('/accounts')
                ? 'text-emerald-700 font-semibold'
                : ''
            }`}
          >
            Accounts
          </Link>
          <Link
            to="/#how-it-works"
            className="transition-colors whitespace-nowrap shrink-0 hover:text-stone-900"
          >
            How It Works
          </Link>
          <Link
            to="/app#history"
            className="transition-colors whitespace-nowrap shrink-0 hover:text-stone-900"
          >
            Practice History
          </Link>
        </nav>

        {/* Zone 3: Primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/app"
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            Start Practicing
          </Link>
        </div>
      </div>
    </header>
  );
};
