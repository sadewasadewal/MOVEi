'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, Ticket, Eye, ShieldCheck, QrCode, User, ChevronDown, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

export default function Navbar() {
  const pathname = usePathname();
  const [activeRole, setActiveRole] = useState<UserRole>('customer');
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Movies', href: '/movies', icon: Film },
    { name: 'Cinemas', href: '/cinemas', icon: Sparkles },
    { name: 'My Wallet', href: '/wallet', icon: Ticket },
    { name: 'Watched', href: '/watched', icon: Eye }
  ];

  return (
    <header className="hidden md:block sticky top-0 z-50 w-full glass-panel border-b border-white/10 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#bae861] to-[#fa6b38] flex items-center justify-center font-black text-black text-lg tracking-wider shadow-lg shadow-[#bae861]/20 group-hover:scale-105 transition-transform">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-widest text-white group-hover:text-[#bae861] transition-colors">
              MOVEI
            </span>
            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold -mt-1">
              Cinema OS
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-[#bae861] bg-white/5 shadow-inner'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Role Switcher & Scanner/Admin Quick Jumps */}
        <div className="flex items-center gap-3">
          
          {/* Quick Scanner Shortcut */}
          <Link
            href="/scanner"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              pathname?.startsWith('/scanner')
                ? 'bg-[#fa6b38] text-white border-[#fa6b38]'
                : 'bg-white/5 text-gray-300 border-white/10 hover:border-[#fa6b38]/50 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Scanner
          </Link>

          {/* Quick Admin Shortcut */}
          <Link
            href="/admin"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              pathname?.startsWith('/admin')
                ? 'bg-[#bae861] text-black border-[#bae861]'
                : 'bg-white/5 text-gray-300 border-white/10 hover:border-[#bae861]/50 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </Link>

          {/* Role Dropdown (Simulating iOS Role Switcher) */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-xs font-medium text-gray-200 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-[#bae861] animate-pulse" />
              <span className="capitalize">{activeRole}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {roleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl glass-panel border border-white/15 shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-white/10 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Select User Role
                </div>
                <Link
                  href="/"
                  onClick={() => setActiveRole('customer')}
                  className={`flex items-center justify-between px-3 py-2 text-xs hover:bg-white/10 ${
                    activeRole === 'customer' ? 'text-[#bae861] font-bold' : 'text-gray-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Customer View
                  </span>
                  {activeRole === 'customer' && <span className="text-[10px] bg-[#bae861]/20 px-1.5 py-0.5 rounded">Active</span>}
                </Link>

                <Link
                  href="/scanner"
                  onClick={() => setActiveRole('scanner')}
                  className={`flex items-center justify-between px-3 py-2 text-xs hover:bg-white/10 ${
                    activeRole === 'scanner' ? 'text-[#fa6b38] font-bold' : 'text-gray-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <QrCode className="w-3.5 h-3.5" /> Staff Scanner
                  </span>
                  {activeRole === 'scanner' && <span className="text-[10px] bg-[#fa6b38]/20 px-1.5 py-0.5 rounded">Active</span>}
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setActiveRole('admin')}
                  className={`flex items-center justify-between px-3 py-2 text-xs hover:bg-white/10 ${
                    activeRole === 'admin' ? 'text-[#bae861] font-bold' : 'text-gray-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Cinema Admin
                  </span>
                  {activeRole === 'admin' && <span className="text-[10px] bg-[#bae861]/20 px-1.5 py-0.5 rounded">Active</span>}
                </Link>
              </div>
            )}
          </div>

          {/* Login / Profile */}
          <Link
            href="/login"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-gray-200 transition-colors"
            title="User Profile"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </header>
  );
}
