'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MOCK_MOVIES, MOCK_SHOWS, MOCK_CINEMAS } from '../../../lib/mock-data';
import { Star, Clock, Calendar, MapPin, Play, Ticket, ArrowLeft, Shield } from 'lucide-react';

interface MovieDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const resolvedParams = use(params);
  const movie = MOCK_MOVIES.find(m => m.slug === resolvedParams.slug);

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  if (!movie) {
    notFound();
  }

  // Get shows for this movie
  const shows = MOCK_SHOWS.filter(s => s.movie_id === movie.id);

  // Group shows by cinema
  const cinemaGroups = MOCK_CINEMAS.map(cinema => {
    const cinemaShows = shows.filter(s => s.cinema_id === cinema.id);
    return {
      cinema,
      shows: cinemaShows
    };
  }).filter(group => group.shows.length > 0);

  return (
    <div className="space-y-12 pb-20">
      
      {/* 1. Hero Backdrop Banner (16:9 ratio) */}
      <div className="relative w-full h-[55vh] min-h-[420px] max-h-[600px] overflow-hidden bg-gray-950">
        {movie.backdrop_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={movie.backdrop_url}
            alt={movie.title}
            className="w-full h-full object-cover object-top opacity-60"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d0f] via-[#0b0d0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d0f] via-[#0b0d0f]/40 to-transparent" />

        {/* Back Link */}
        <div className="absolute top-6 left-4 lg:left-8 z-20">
          <Link
            href="/movies"
            className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white glass-panel px-3.5 py-2 rounded-xl border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Movies
          </Link>
        </div>

        {/* Floating details */}
        <div className="absolute inset-x-0 bottom-8 max-w-7xl mx-auto px-4 lg:px-8 z-20 flex flex-col sm:flex-row items-end sm:items-center gap-6">
          
          {/* 2:3 Poster thumbnail overlay */}
          <div className="hidden sm:block w-36 md:w-44 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 shrink-0 bg-gray-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#bae861] text-black px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                {movie.age_rating}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {movie.rating.toFixed(1)} IMDB
              </span>
              <span className="text-xs text-gray-300 font-medium">
                {movie.runtime_minutes} mins • {movie.genres.join(', ')}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-sm sm:text-base text-gray-300 italic font-medium">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}
          </div>

        </div>
      </div>


      {/* 2. Main Body Grid: Synopsis & Showtime Selection */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left 2 Cols: Synopsis, Trailer, & Showtimes */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Storyline */}
          <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-xl font-bold text-white">Storyline</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              {movie.description}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5 text-xs">
              <div>
                <span className="text-gray-500 uppercase font-bold text-[10px] block">Release Date</span>
                <span className="text-gray-200 font-semibold">{movie.release_date}</span>
              </div>
              <div>
                <span className="text-gray-500 uppercase font-bold text-[10px] block">Language</span>
                <span className="text-gray-200 font-semibold">{movie.language}</span>
              </div>
              <div>
                <span className="text-gray-500 uppercase font-bold text-[10px] block">Format</span>
                <span className="text-gray-200 font-semibold">Laser / Dolby Atmos</span>
              </div>
            </div>
          </section>

          {/* Showtime Selection Section */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#bae861]">
                Reserve Your Seats
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Select Cinema & Showtime
              </h2>
            </div>

            {cinemaGroups.length > 0 ? (
              <div className="space-y-6">
                {cinemaGroups.map(({ cinema, shows }) => (
                  <div key={cinema.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-extrabold text-white text-base">{cinema.name}</h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#bae861]" />
                          {cinema.address}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-white/5 px-2 py-1 rounded text-gray-400 border border-white/10">
                        {cinema.city}
                      </span>
                    </div>

                    {/* Showtime pills */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      {shows.map(show => {
                        const time = new Date(show.start_time);
                        const timeStr = time.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        });

                        return (
                          <Link
                            key={show.id}
                            href={`/booking/${show.id}`}
                            className="group flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-[#bae861] border border-white/10 hover:border-[#bae861] transition-all min-w-[110px]"
                          >
                            <span className="text-sm font-extrabold text-white group-hover:text-black transition-colors">
                              {timeStr}
                            </span>
                            <span className="text-[10px] text-gray-400 group-hover:text-neutral-900 transition-colors uppercase font-medium mt-0.5">
                              {show.screen?.name || 'Screen 1'}
                            </span>
                            <span className="text-[9px] text-[#bae861] group-hover:text-black font-mono font-bold mt-1">
                              From LKR {show.price_standard}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-8 rounded-2xl text-center border border-white/10">
                <Ticket className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-400">
                  No scheduled shows currently listed for this title. Please check back shortly.
                </p>
              </div>
            )}

          </section>

        </div>


        {/* Right Col: Movie Trailer & Booking Guarantee */}
        <div className="space-y-6">
          
          {/* Trailer Preview Card */}
          {movie.trailer_url && (
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Play className="w-4 h-4 text-[#bae861] fill-[#bae861]" />
                Official Trailer
              </h3>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={movie.backdrop_url}
                  alt={movie.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <a
                  href={movie.trailer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#bae861] text-black flex items-center justify-center group-hover:scale-110 shadow-xl shadow-[#bae861]/40 transition-transform">
                    <Play className="w-5 h-5 fill-black translate-x-0.5" />
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* Cinema Guarantee */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 bg-gradient-to-b from-[#14171c] to-[#181d24]">
            <div className="w-9 h-9 rounded-xl bg-[#bae861]/10 flex items-center justify-center text-[#bae861]">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-white text-sm">MOVEI Safe Ticket Guarantee</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every booking is locked atomically in Supabase with 10-minute hold protection. Add tickets instantly to Apple Wallet on iOS or display digital passes via the web.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
