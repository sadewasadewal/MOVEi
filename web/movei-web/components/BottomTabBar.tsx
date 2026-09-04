'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Ticket, User } from 'lucide-react';

export default function BottomTabBar() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Movies', href: '/movies', icon: Film },
    { name: 'Wallet', href: '/wallet', icon: Ticket },
    { name: 'Profile', href: '/profile', icon: User }
  ];

  return (
    <div className="fixed bottom-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto ios-tab-bar rounded-full px-3 py-2 flex items-center gap-1.5 sm:gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.href === '/' 
            ? pathname === '/' 
            : pathname === tab.href || pathname?.startsWith(tab.href + '/');

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center px-4 sm:px-5 py-1.5 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              <span className={`text-[10px] font-semibold mt-0.5 ${isActive ? 'text-white font-bold' : 'text-gray-400'}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
