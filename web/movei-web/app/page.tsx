'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_MOVIES, MOCK_SHOWS } from '../lib/mock-data';
import { Star, Ticket, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const publishedMovies = MOCK_MOVIES.filter(m => m.status === 'published');
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const currentMovie = publishedMovies[currentIndex] || publishedMovies[0];
  const matchingShow = MOCK_SHOWS.find(s => s.movie_id === currentMovie.id) || MOCK_SHOWS[0];

  // Auto advance every 8 seconds if idle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % publishedMovies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [publishedMovies.length]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      setCurrentIndex(prev => (prev + 1) % publishedMovies.length);
    } else if (isRightSwipe) {
      setCurrentIndex(prev => (prev - 1 + publishedMovies.length) % publishedMovies.length);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      className="relative w-full h-[calc(100dvh-5rem)] md:h-screen bg-black overflow-hidden flex flex-col justify-between select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Backdrop Movie Poster Image (Upper 58%) */}
      <div className="relative w-full h-[56vh] min-h-[300px] max-h-[600px] overflow-hidden bg-black shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={currentMovie.id}
          src={currentMovie.backdrop_url || currentMovie.poster_url}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-center animate-in fade-in zoom-in-105 duration-700"
        />

        {/* Seamless iOS Bottom Fade Gradient */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.5) 75%, #000000 100%)'
          }}
        />

        {/* Carousel indicator dots in upper area or desktop controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
          {publishedMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. Content Lower Half matching iOS HomeView.swift */}
      <div className="flex-1 max-w-md w-full mx-auto px-6 flex flex-col items-center justify-between pb-4 sm:pb-6 text-center z-10 -mt-8 sm:-mt-12">
        
        {/* Title, Rating & Tagline */}
        <div className="space-y-2 w-full">
          <h1 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-white leading-tight drop-shadow-md">
            {currentMovie.title}
          </h1>

          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-white/80">
            <span className="flex items-center gap-1 text-white font-semibold">
              <Star className="w-3.5 h-3.5 fill-white text-white" />
              {currentMovie.rating.toFixed(1)}
            </span>
            <span>•</span>
            <span className="truncate max-w-[160px]">{currentMovie.genres.join(' • ')}</span>
            <span>•</span>
            <span>{Math.floor(currentMovie.runtime_minutes / 60)}h {currentMovie.runtime_minutes % 60}m</span>
          </div>

          <p className="text-xs sm:text-sm text-white/80 font-normal leading-relaxed line-clamp-1 px-4">
            {currentMovie.tagline || currentMovie.description}
          </p>
        </div>

        {/* Action Buttons: Blue Pill + Frosted Pill (1:1 iOS HomeView) */}
        <div className="w-full space-y-3 pt-4 sm:pt-6">
          <Link
            href={`/booking/${matchingShow.id}`}
            className="w-full h-[52px] sm:h-[54px] rounded-full bg-[#007AFF] hover:bg-[#0066d6] active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#007AFF]/30 transition-all"
          >
            <Ticket className="w-5 h-5 fill-white text-white" />
            Book Show
          </Link>

          <Link
            href={`/movies/${currentMovie.slug}`}
            className="w-full h-[52px] sm:h-[54px] rounded-full bg-white/10 hover:bg-white/15 active:scale-[0.98] border border-white/30 text-white font-medium text-base flex items-center justify-center gap-2 backdrop-blur-sm transition-all"
          >
            <Plus className="w-5 h-5 text-white" />
            See Details
          </Link>
        </div>

      </div>

      {/* Desktop side navigation arrows */}
      <div className="hidden md:flex absolute inset-y-0 inset-x-8 items-center justify-between pointer-events-none">
        <button
          onClick={() => setCurrentIndex(prev => (prev - 1 + publishedMovies.length) % publishedMovies.length)}
          className="pointer-events-auto p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentIndex(prev => (prev + 1) % publishedMovies.length)}
          className="pointer-events-auto p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}
