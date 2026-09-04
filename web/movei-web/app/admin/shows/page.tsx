'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_SHOWS, MOCK_MOVIES, MOCK_CINEMAS } from '../../../lib/mock-data';
import { Show } from '../../../types';
import { Calendar, Plus, Copy, AlertTriangle, CheckCircle2, ArrowLeft, Clock } from 'lucide-react';

export default function AdminShowsPage() {
  const [shows, setShows] = useState<Show[]>(MOCK_SHOWS);
  const [selectedMovieId, setSelectedMovieId] = useState(MOCK_MOVIES[0].id);
  const [selectedCinemaId, setSelectedCinemaId] = useState(MOCK_CINEMAS[0].id);
  const [selectedScreenId, setSelectedScreenId] = useState(MOCK_CINEMAS[0].screens?.[0].id || '');
  const [startTime, setStartTime] = useState('18:00');
  const [priceStandard, setPriceStandard] = useState(1200);
  const [pricePremium, setPricePremium] = useState(1800);
  const [priceVip, setPriceVip] = useState(2500);
  const [collisionWarning, setCollisionWarning] = useState<string | null>(null);

  const handleDuplicateShow = (show: Show) => {
    const nextHourDate = new Date(new Date(show.start_time).getTime() + 4 * 3600 * 1000);
    const newShow: Show = {
      ...show,
      id: 'sh-' + Date.now(),
      start_time: nextHourDate.toISOString(),
      end_time: new Date(nextHourDate.getTime() + 2.5 * 3600 * 1000).toISOString()
    };
    setShows([newShow, ...shows]);
  };

  const handleCreateShow = (e: React.FormEvent) => {
    e.preventDefault();
    setCollisionWarning(null);

    // Collision check: verify no overlapping show exists in the same screen
    const cinema = MOCK_CINEMAS.find(c => c.id === selectedCinemaId);
    const screen = cinema?.screens?.find(s => s.id === selectedScreenId);
    const movie = MOCK_MOVIES.find(m => m.id === selectedMovieId);

    const now = new Date();
    const [hours, mins] = startTime.split(':').map(Number);
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, mins);
    const endDate = new Date(startDate.getTime() + (movie?.runtime_minutes || 120) * 60000);

    const hasCollision = shows.some(s => {
      if (s.screen_id !== selectedScreenId || s.status === 'cancelled') return false;
      const sStart = new Date(s.start_time).getTime();
      const sEnd = new Date(s.end_time).getTime();
      const nStart = startDate.getTime();
      const nEnd = endDate.getTime();
      return (nStart < sEnd && nEnd > sStart);
    });

    if (hasCollision) {
      setCollisionWarning('Collision Detected: Another show is already scheduled in this screen during this time window.');
      return;
    }

    const newShow: Show = {
      id: 'sh-' + Date.now(),
      movie_id: selectedMovieId,
      cinema_id: selectedCinemaId,
      screen_id: selectedScreenId,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      price_standard: Number(priceStandard),
      price_premium: Number(pricePremium),
      price_vip: Number(priceVip),
      status: 'scheduled',
      movie,
      cinema,
      screen
    };

    setShows([newShow, ...shows]);
  };

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
              Cinema Operations
            </span>
            <h1 className="text-3xl font-black text-white mt-0.5">
              Showtime Scheduler
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Show Creation Form */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#bae861]" />
            Schedule New Showtime
          </h3>

          {collisionWarning && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{collisionWarning}</span>
            </div>
          )}

          <form onSubmit={handleCreateShow} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-gray-300 block mb-1">Movie</label>
              <select
                value={selectedMovieId}
                onChange={(e) => setSelectedMovieId(e.target.value)}
                className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-2.5 text-white"
              >
                {MOCK_MOVIES.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-300 block mb-1">Cinema Venue</label>
              <select
                value={selectedCinemaId}
                onChange={(e) => {
                  setSelectedCinemaId(e.target.value);
                  const cin = MOCK_CINEMAS.find(c => c.id === e.target.value);
                  if (cin?.screens?.[0]) setSelectedScreenId(cin.screens[0].id);
                }}
                className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-2.5 text-white"
              >
                {MOCK_CINEMAS.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-300 block mb-1">Screen / Hall</label>
              <select
                value={selectedScreenId}
                onChange={(e) => setSelectedScreenId(e.target.value)}
                className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-2.5 text-white"
              >
                {MOCK_CINEMAS.find(c => c.id === selectedCinemaId)?.screens?.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.screen_type})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-300 block mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
              <div>
                <label className="font-semibold text-gray-300 block mb-1">Std (LKR)</label>
                <input
                  type="number"
                  value={priceStandard}
                  onChange={(e) => setPriceStandard(Number(e.target.value))}
                  className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-2 text-white"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-300 block mb-1">Prem (LKR)</label>
                <input
                  type="number"
                  value={pricePremium}
                  onChange={(e) => setPricePremium(Number(e.target.value))}
                  className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-2 text-white"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-300 block mb-1">VIP (LKR)</label>
                <input
                  type="number"
                  value={priceVip}
                  onChange={(e) => setPriceVip(Number(e.target.value))}
                  className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-2 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#bae861] text-black font-extrabold shadow-lg shadow-[#bae861]/20 hover:bg-[#cbf27a] transition-all"
            >
              Add Scheduled Showtime
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Scheduled Shows List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Scheduled Shows ({shows.length})</span>
            <span className="text-[#bae861] font-mono font-semibold">PostgreSQL Constraint Protected</span>
          </div>

          <div className="space-y-3">
            {shows.map(show => {
              const start = new Date(show.start_time);
              return (
                <div
                  key={show.id}
                  className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel-hover"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-white text-base">{show.movie?.title}</h4>
                      <span className="text-[10px] font-bold uppercase bg-white/10 px-2 py-0.5 rounded text-gray-300">
                        {show.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-400 flex flex-wrap items-center gap-3">
                      <span>{show.cinema?.name}</span>
                      <span>•</span>
                      <span>{show.screen?.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#bae861] font-mono font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        {start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-400 font-mono">
                      Pricing: LKR {show.price_standard} (Std) / {show.price_premium} (Prem) / {show.price_vip} (VIP)
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDuplicateShow(show)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-semibold text-gray-200 border border-white/10 flex items-center gap-1.5 transition-colors"
                      title="Duplicate Show"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#bae861]" />
                      Duplicate
                    </button>
                    
                    <Link
                      href={`/booking/${show.id}`}
                      className="px-3 py-1.5 rounded-xl bg-[#bae861]/15 hover:bg-[#bae861] text-xs font-bold text-[#bae861] hover:text-black border border-[#bae861]/30 transition-colors"
                    >
                      Seat Map
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
