'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_PROFILES } from '../../lib/mock-data';
import { User, ShieldCheck, QrCode, ArrowRight, Film, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'signin' | 'quick_roles'>('quick_roles');

  const handleQuickLogin = (role: 'customer' | 'admin' | 'scanner') => {
    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'scanner') {
      router.push('/scanner');
    } else {
      router.push('/wallet');
    }
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Supabase login
    router.push('/wallet');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="glass-panel max-w-md w-full p-8 sm:p-10 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#bae861] to-[#fa6b38] flex items-center justify-center font-black text-black text-xl mx-auto shadow-xl shadow-[#bae861]/25">
            M
          </div>
          <h1 className="text-2xl font-black text-white">Access MOVEI</h1>
          <p className="text-xs text-gray-400">
            Unified access across customer wallet, administration, and ticket scanners.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('quick_roles')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'quick_roles' ? 'bg-[#bae861] text-black font-extrabold shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Demo Role Switcher
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'signin' ? 'bg-[#bae861] text-black font-extrabold shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Supabase Sign In
          </button>
        </div>

        {activeTab === 'quick_roles' ? (
          /* One-click demo roles */
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold text-gray-400 block text-center">
              Select an account to launch instantly:
            </span>

            <button
              onClick={() => handleQuickLogin('customer')}
              className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#bae861]/40 flex items-center justify-between group transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#bae861]/15 text-[#bae861] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Customer Account</div>
                  <div className="text-[11px] text-gray-400">Alex Mercer • Wallet & Bookings</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#bae861] group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => handleQuickLogin('admin')}
              className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#bae861]/40 flex items-center justify-between group transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#bae861]/25 text-[#bae861] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Cinema Admin Portal</div>
                  <div className="text-[11px] text-gray-400">Elena Vance • Shows, Movies, Metrics</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#bae861] group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => handleQuickLogin('scanner')}
              className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#fa6b38]/40 flex items-center justify-between group transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#fa6b38]/20 text-[#fa6b38] flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Gate Scanner Staff</div>
                  <div className="text-[11px] text-gray-400">Marcus Brody • Camera Barcode Admission</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#fa6b38] group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        ) : (
          /* Standard email/password form */
          <form onSubmit={handleFormLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-gray-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@cinema.com"
                  className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#bae861]"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#bae861]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#bae861] text-black font-extrabold shadow-lg shadow-[#bae861]/25 hover:bg-[#cbf27a] transition-all"
            >
              Sign In
            </button>
          </form>
        )}

        <div className="pt-2 text-center text-xs text-gray-500">
          Zero password lockouts in demo environment. All actions are logged safely.
        </div>

      </div>
    </div>
  );
}
