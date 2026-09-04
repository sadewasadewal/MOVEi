'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_MOVIES, MOCK_SHOWS } from '../../lib/mock-data';
import { Search, Star, Ticket } from 'lucide-react';

export default function MoviesPage() {
  const [search, setSearch] = useState('');
  const publishedMovies = MOCK_MOVIES.filter(m => m.status === 'published');

  const filteredMovies = publishedMovies.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.genres.some(g => g.toLowerCase().includes(search.toLowerCase()))
  );

  const spotlightMovie = filteredMovies[0] || publishedMovies[0];
  const spotlightShow = MOCK_SHOWS.find(s => s.movie_id === spotlightMovie?.id) || MOCK_SHOWS[0];

  return (
    <div className="ios-canvas min-h-screen pb-40 pt-4 sm:pt-8 px-4 max-w-lg sm:max-w-2xl mx-auto">
      
      {/* 1. Header & Search Input matching iOS MoviesView */}
      <div className="space-y-4 mb-6">
        <h1 className="text-3xl font-bold font-sans tracking-tight text-[#14171a]">
          Explore Movies
        </h1>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6e73]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies, genres..."
            className="w-full h-12 bg-white rounded-2xl pl-11 pr-4 text-xs sm:text-sm text-[#14171a] placeholder-[#6b6e73] shadow-sm border border-black/5 focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
          />
        </div>
      </div>

      {/* 2. FEATURED SPOTLIGHT matching iOS HeroCard */}
      {spotlightMovie && (
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6b6e73] block mb-3">
            FEATURED SPOTLIGHT
          </span>

          <div className="relative h-60 w-full rounded-3xl overflow-hidden shadow-lg bg-gray-900 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={spotlightMovie.backdrop_url || spotlightMovie.poster_url}
              alt={spotlightMovie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="absolute inset-x-5 bottom-5 text-white space-y-1.5">
              <h3 className="text-xl font-bold tracking-tight">{spotlightMovie.title}</h3>
              <p className="text-xs text-white/80">
                {spotlightMovie.genres.join('  •  ')}  •  {Math.floor(spotlightMovie.runtime_minutes / 60)}h {spotlightMovie.runtime_minutes % 60}m
              </p>

              <div className="pt-2">
                <Link
                  href={`/booking/${spotlightShow.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#bae861] text-[#14171a] font-bold text-xs shadow-md active:scale-95 transition-all"
                >
                  <Ticket className="w-3.5 h-3.5 fill-[#14171a]" />
                  Book tickets
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ALL MOVIES 2-Column Grid matching iOS MovieGridCard */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#6b6e73] block mb-3">
          ALL MOVIES
        </span>

        <div className="grid grid-cols-2 gap-4">
          {filteredMovies.map(movie => {
            const matchingShow = MOCK_SHOWS.find(s => s.movie_id === movie.id) || MOCK_SHOWS[0];

            return (
              <Link
                key={movie.id}
                href={`/movies/${movie.slug}`}
                className="group flex flex-col space-y-2 cursor-pointer"
              >
                {/* 2:3 Vertical Poster */}
                <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-md bg-gray-900 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-[#14171a] truncate group-hover:text-[#007AFF] transition-colors">
                    {movie.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#6b6e73]">
                    <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                      <Star className="w-3 h-3 fill-amber-500" />
                      {movie.rating.toFixed(1)}
                    </span>
                    <span>•</span>
                    <span>{movie.runtime_minutes}m</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
