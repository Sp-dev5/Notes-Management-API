import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Header } from '../components/Header';
import { useProfile } from '../hooks/useAuth';
import { Loader, User, Mail, Shield, Calendar } from 'lucide-react';

export function ProfilePage() {
  const { data: user, isLoading, isError } = useProfile();

  const membershipDays = user ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <MainLayout>
      <Header />

      <div className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 gradient-text">Profile</h1>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="animate-spin text-primary-500" size={40} />
            </div>
          ) : isError ? (
            <div className="glass-lg rounded-2xl p-6 border-2 border-red-500/30">
              <p className="text-red-400">Failed to load profile. Please try again.</p>
            </div>
          ) : user ? (
            <>
              {/* Profile Header Card */}
              <div className="glass-lg rounded-2xl p-8 border-2 mb-6 hover:shadow-xl hover:shadow-primary-500/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                      <User size={32} className="text-white" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{user.name}</h2>
                      <p className="text-slate-400 text-sm mt-1">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {user.role === 'ADMIN' && (
                      <span className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg text-white text-sm font-semibold">
                        <Shield size={16} />
                        Administrator
                      </span>
                    )}
                    {user.role === 'USER' && (
                      <span className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg text-white text-sm font-semibold">
                        <Calendar size={16} />
                        User
                      </span>
                    )}
                  </div>
                </div>

              {/* Info Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="glass rounded-xl p-5 border-2 hover:shadow-lg hover:shadow-primary-500/20">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Last Joined</p>
                  <p className="text-lg font-bold text-white">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="glass rounded-xl p-5 border-2 hover:shadow-lg hover:shadow-primary-500/20">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Member Since</p>
                  <p className="text-lg font-bold text-white">{membershipDays} days</p>
                </div>
              </div>

              {/* Account Details */}
              <div className="glass-lg rounded-2xl p-6 border-2 hover:shadow-lg hover:shadow-primary-500/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Mail size={20} className="text-primary-400" />
                  Account Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Email Address</p>
                    <p className="text-white font-mono text-sm">{user.email}</p>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Account Type</p>
                    <p className="text-white">{user.role === 'ADMIN' ? 'Administrator' : 'Standard User'}</p>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Status</p>
                    <p className="text-green-400 flex items-center gap-2 font-medium">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </MainLayout>
  );
}
