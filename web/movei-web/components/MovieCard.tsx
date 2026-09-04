import React from 'react';
import Link from 'next/link';
import { Movie } from '../types';
import { Star, Clock, Ticket } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="group flex flex-col glass-panel rounded-2xl overflow-hidden glass-panel-hover transition-all duration-300">
      
      {/* 2:3 Poster Ratio Container */}
      <Link href={`/movies/${movie.slug}`} className="relative aspect-[2/3] w-full overflow-hidden bg-gray-900 block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d0f] via-transparent to-transparent opacity-80" />

        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-xs font-bold text-amber-400 shadow-lg">
          <Star className="w-3 h-3 fill-amber-400" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>

        {/* Age Rating */}
        <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider text-white border border-white/10">
          {movie.age_rating}
        </div>

        {/* Floating Quick Book on hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="w-full py-2 rounded-xl bg-[#bae861] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xl shadow-[#bae861]/30">
            <Ticket className="w-3.5 h-3.5" />
            Book Tickets
          </span>
        </div>
      </Link>

      {/* Info Card */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-extrabold text-white text-base truncate group-hover:text-[#bae861] transition-colors">
            <Link href={`/movies/${movie.slug}`}>
              {movie.title}
            </Link>
          </h3>
          
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-500" />
              {movie.runtime_minutes}m
            </span>
            <span>•</span>
            <span className="truncate">{movie.genres.slice(0, 2).join(', ')}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 line-clamp-2 mt-2 leading-relaxed">
          {movie.tagline || movie.description}
        </p>
      </div>

    </div>
  );
}
