import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../context/store';
import { FileText, LogOut, User } from 'lucide-react';

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-slate-950/80 backdrop-blur-lg border-r border-primary-500/30 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">✦</span>
          </div>
          <h1 className="text-2xl font-bold gradient-text">Notes</h1>
        </Link>

        <nav className="space-y-2">
          <NavLink
            to="/dashboard"
            active={isActive('/dashboard')}
            icon={<FileText size={20} />}
            label="My Notes"
          />
          <NavLink
            to="/profile"
            active={isActive('/profile')}
            icon={<User size={20} />}
            label="Profile"
          />
        </nav>

        <div className="mt-8 pt-8 border-t border-primary-500/20">
          <p className="text-sm text-primary-300 mb-4">{user?.email}</p>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:bg-primary-600/20 hover:text-primary-200 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

interface NavLinkProps {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}

function NavLink({ to, active, icon, label }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
        active
          ? 'bg-primary-600/30 text-primary-200 border border-primary-500/50'
          : 'text-slate-300 hover:bg-primary-500/10 hover:text-primary-300 border border-transparent'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
