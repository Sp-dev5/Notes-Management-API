import React from 'react';
import { useAuthStore } from '../context/store';
import { Link } from 'react-router-dom';
import { LogOut, Search, Shield } from 'lucide-react';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      }
    }, 300);
  };

  const logoPath = isAuthenticated ? '/dashboard' : '/';

  return (
    <header className="bg-slate-950/40 border-b border-primary-500/30 sticky top-0 z-40 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link to={logoPath} className="flex items-center gap-3 flex-shrink-0 hover:opacity-90 transition-opacity duration-200 cursor-pointer group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-primary-500/50 transition-all duration-200">
            <span className="text-white font-bold text-lg">✦</span>
          </div>
          <h1 className="text-2xl font-bold gradient-text">Notes</h1>
        </Link>

        {onSearch && (
          <div className="flex-1 max-w-md relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search your notes..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-primary-600/40 bg-slate-900/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium"
            />
          </div>
        )}

        <div className="flex items-center gap-4 flex-shrink-0">
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-xs text-primary-300 flex items-center justify-end gap-1">
                  {user.role === 'ADMIN' && <Shield size={12} />}
                  {user.role === 'ADMIN' ? 'Admin' : 'User'}
                </p>
              </div>

              <button
                onClick={logout}
                className="p-2.5 hover:bg-primary-600/30 rounded-lg text-slate-300 hover:text-red-400 transition-all"
                title="Logout"
              >
                <LogOut size={20} stroke-width={2} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
