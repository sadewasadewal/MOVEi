'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_CINEMAS } from '../../../lib/mock-data';
import { Cinema } from '../../../types';
import { Building2, Plus, MapPin, Phone, Layers, ArrowLeft } from 'lucide-react';

export default function AdminCinemasPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>(MOCK_CINEMAS);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 rounded-xl glass-panel hover:bg-white/10 text-gray-300 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#bae861]">
              Venues & Infrastructure
            </span>
            <h1 className="text-3xl font-black text-white mt-0.5">
              Cinemas & Screen Layouts
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cinemas.map(cinema => (
          <div key={cinema.id} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-white">{cinema.name}</h3>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#bae861]" />
                  {cinema.address}, {cinema.city}
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold bg-[#bae861]/20 text-[#bae861] px-2 py-0.5 rounded">
                {cinema.status}
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-xs font-bold uppercase text-gray-400">Configured Screens</span>
              <div className="space-y-2">
                {cinema.screens?.map(screen => (
                  <div key={screen.id} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{screen.name}</div>
                      <div className="text-[10px] text-gray-400">{screen.capacity} seats</div>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-[#bae861]/15 text-[#bae861] px-2 py-0.5 rounded font-bold">
                      {screen.screen_type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
