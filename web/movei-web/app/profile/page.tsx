'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_TICKETS } from '../../lib/mock-data';
import { User, CheckCircle2, Shield, QrCode, Ticket, Film, Building2, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<'customer' | 'scanner' | 'admin'>('customer');

  const activePassesCount = MOCK_TICKETS.filter(t => t.status !== 'used').length;
  const watchedCount = MOCK_TICKETS.filter(t => t.status === 'used').length;

  const handleRoleSelect = (role: 'customer' | 'scanner' | 'admin') => {
    setCurrentRole(role);
    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'scanner') {
      router.push('/scanner');
    }
  };

  return (
    <div className="ios-canvas min-h-screen pb-40 pt-4 sm:pt-8 px-4 max-w-lg mx-auto select-none">
      
      {/* Title */}
      <h1 className="text-3xl font-bold font-sans tracking-tight text-[#14171a] mb-6">
        Profile
      </h1>

      <div className="space-y-6">
        
        {/* Avatar & User Info matching iOS ProfileView */}
        <div className="flex flex-col items-center space-y-2.5">
          <div className="w-20 h-20 rounded-full bg-[#14171a] flex items-center justify-center text-[#bae861] shadow-lg">
            <User className="w-10 h-10" />
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-[#14171a]">Alex Mercer</h2>
            <div className="inline-flex items-center gap-1 bg-[#bae861] text-[#14171a] px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              {currentRole}
            </div>
          </div>
        </div>

        {/* 3 Stat Tiles matching iOS ProfileStatTile */}
        <div className="grid grid-cols-3 gap-3">
          <div className="ios-card p-4 text-center">
            <div className="text-2xl font-bold text-[#14171a]">{activePassesCount}</div>
            <div className="text-[10px] font-medium text-[#6b6e73] mt-0.5">Active Passes</div>
          </div>

          <div className="ios-card p-4 text-center">
            <div className="text-2xl font-bold text-[#14171a]">{watchedCount}</div>
            <div className="text-[10px] font-medium text-[#6b6e73] mt-0.5">Watched</div>
          </div>

          <div className="ios-card p-4 text-center">
            <div className="text-2xl font-bold text-[#14171a]">3</div>
            <div className="text-[10px] font-medium text-[#6b6e73] mt-0.5">Cinemas</div>
          </div>
        </div>

        {/* SWITCH ROLE / PERSONA matching iOS RoleRow */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6b6e73] block px-1">
            SWITCH ROLE / PERSONA
          </span>

          <div className="ios-card overflow-hidden divide-y divide-gray-100">
            
            {/* Customer */}
            <button
              onClick={() => handleRoleSelect('customer')}
              className="w-full p-4 flex items-center justify-between hover:bg-black/5 active:bg-black/10 transition-colors text-left"
            >
              <div>
                <div className="text-sm font-semibold text-[#14171a]">Customer Persona</div>
                <div className="text-xs text-[#6b6e73]">Book tickets, wallet, collectibles</div>
              </div>
              {currentRole === 'customer' && (
                <CheckCircle2 className="w-5 h-5 fill-[#bae861] text-[#14171a]" />
              )}
            </button>

            {/* Scanner */}
            <button
              onClick={() => handleRoleSelect('scanner')}
              className="w-full p-4 flex items-center justify-between hover:bg-black/5 active:bg-black/10 transition-colors text-left"
            >
              <div>
                <div className="text-sm font-semibold text-[#14171a]">Cinema Scanner Staff</div>
                <div className="text-xs text-[#6b6e73]">Camera scanner, ticket verification</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* Admin */}
            <button
              onClick={() => handleRoleSelect('admin')}
              className="w-full p-4 flex items-center justify-between hover:bg-black/5 active:bg-black/10 transition-colors text-left"
            >
              <div>
                <div className="text-sm font-semibold text-[#14171a]">Platform Administrator</div>
                <div className="text-xs text-[#6b6e73]">KPIs, movie publishing, shows, cinemas</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

          </div>
        </div>

        {/* Sign Out Button matching iOS */}
        <button
          onClick={() => alert('Signed out')}
          className="w-full h-12 rounded-2xl bg-white hover:bg-gray-50 active:scale-[0.98] text-[#ea4335] font-bold text-sm shadow-sm transition-all text-center"
        >
          Sign Out
        </button>

      </div>

    </div>
  );
}
