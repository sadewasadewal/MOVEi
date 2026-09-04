'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_CINEMAS, MOCK_SHOWS } from '../../lib/mock-data';
import { MapPin, Phone, Film, Sparkles, Navigation, Layers } from 'lucide-react';

export default function CinemasPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#bae861]">
          Venues & Screening Rooms
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
          Partner Cinemas & IMAX Screens
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          State-of-the-art projection, laser audio, and luxury recliner seating across Colombo.
        </p>
      </div>

      {/* Cinema Cards */}
      <div className="space-y-8">
        {MOCK_CINEMAS.map(cinema => {
          const cinemaShows = MOCK_SHOWS.filter(s => s.cinema_id === cinema.id);

          return (
            <div key={cinema.id} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-white">{cinema.name}</h2>
                    <span className="text-[10px] font-black uppercase bg-[#bae861]/20 text-[#bae861] px-2 py-0.5 rounded">
                      Open
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#bae861]" />
                      {cinema.address}, {cinema.city}
                    </span>
                    {cinema.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gray-500" />
                        {cinema.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://maps.google.com/?q=${cinema.latitude},${cinema.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#bae861]" />
                    Get Directions
                  </a>
                </div>
              </div>

              {/* Screens and capabilities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {cinema.screens?.map(screen => (
                  <div key={screen.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-white">{screen.name}</h4>
                      <span className="text-[10px] font-mono uppercase bg-[#bae861]/10 text-[#bae861] px-1.5 py-0.5 rounded font-bold">
                        {screen.screen_type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Capacity: {screen.capacity} luxury recliners
                    </p>
                  </div>
                ))}
              </div>

              {/* Active Today Shows */}
              <div>
                <h4 className="text-xs uppercase font-extrabold text-gray-400 tracking-wider mb-3">
                  Scheduled Screenings Today
                </h4>
                {cinemaShows.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {cinemaShows.map(show => (
                      <Link
                        key={show.id}
                        href={`/booking/${show.id}`}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#bae861] border border-white/10 hover:border-[#bae861] group transition-all"
                      >
                        <div className="text-xs font-black text-white group-hover:text-black transition-colors">
                          {show.movie?.title}
                        </div>
                        <div className="text-[10px] text-gray-400 group-hover:text-neutral-900 transition-colors">
                          {new Date(show.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • LKR {show.price_standard}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">No more shows scheduled for today at this venue.</p>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
