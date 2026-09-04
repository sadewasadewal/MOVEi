import React from 'react';
import Link from 'next/link';
import { Film, Shield, Smartphone, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08090b] text-gray-400 py-12 px-4 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        {/* Brand info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#bae861] to-[#fa6b38] flex items-center justify-center font-black text-black text-sm">
              M
            </div>
            <span className="text-lg font-black tracking-widest text-white">MOVEI</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            The next-generation unified cinema ticketing platform. Seamless synchronized passes across iOS SwiftUI, Apple Wallet, and the Web.
          </p>
        </div>

        {/* Portals */}
        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Portals</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/movies" className="hover:text-[#bae861] transition-colors">Browse Movies</Link></li>
            <li><Link href="/wallet" className="hover:text-[#bae861] transition-colors">Digital Ticket Wallet</Link></li>
            <li><Link href="/watched" className="hover:text-[#bae861] transition-colors">Watched & Reviews</Link></li>
            <li><Link href="/cinemas" className="hover:text-[#bae861] transition-colors">Cinemas & Halls</Link></li>
          </ul>
        </div>

        {/* Operations */}
        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Platform Operations</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/admin" className="hover:text-[#bae861] transition-colors flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Admin Control Room</Link></li>
            <li><Link href="/scanner" className="hover:text-[#bae861] transition-colors flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5" /> Gate Scanner PWA</Link></li>
            <li><span className="text-gray-500">Apple Wallet PassKit API</span></li>
          </ul>
        </div>

        {/* Technology */}
        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Built With</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Powered by Next.js, Supabase PostgreSQL with RLS, atomic ticket locks, PassKit, and SwiftUI on Apple platforms.
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div>© {new Date().getFullYear()} MOVEI Cinema Network. All rights reserved.</div>
        <div className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-[#fa6b38] fill-[#fa6b38]" /> for cinema lovers.
        </div>
      </div>
    </footer>
  );
}
