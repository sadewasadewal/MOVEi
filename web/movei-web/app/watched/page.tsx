'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_MOVIES, MOCK_CINEMAS } from '../../lib/mock-data';
import { Star, Eye, MessageSquare, ThumbsUp, Calendar, MapPin, Sparkles } from 'lucide-react';

interface WatchedEntry {
  id: string;
  movie: typeof MOCK_MOVIES[0];
  cinema: string;
  watchedAt: string;
  rating: number;
  review?: string;
  tags: string[];
}

export default function WatchedPage() {
  const [entries, setEntries] = useState<WatchedEntry[]>([
    {
      id: 'w-1',
      movie: MOCK_MOVIES[1], // Dune: Part Two
      cinema: 'Majestic City IMAX',
      watchedAt: 'Yesterday, 8:30 PM',
      rating: 5,
      review: 'Incredible cinematography and Hans Zimmer score in IMAX. Denis Villeneuve delivered a sci-fi masterpiece.',
      tags: ['Visual Masterpiece', 'IMAX', 'Epic']
    },
    {
      id: 'w-2',
      movie: MOCK_MOVIES[2], // Oppenheimer
      cinema: 'Colombo City Centre (CCC)',
      watchedAt: '2 weeks ago',
      rating: 5,
      review: 'Tense courtroom drama and sound design shook the entire room. Cillian Murphy gave the performance of a lifetime.',
      tags: ['Phenomenal Sound', 'Award Winner']
    }
  ]);

  const [activeMovieId, setActiveMovieId] = useState<string>(MOCK_MOVIES[0].id);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const movie = MOCK_MOVIES.find(m => m.id === activeMovieId) || MOCK_MOVIES[0];
    const newEntry: WatchedEntry = {
      id: 'w-' + Date.now(),
      movie,
      cinema: 'Colombo City Centre (CCC)',
      watchedAt: 'Just now',
      rating: newRating,
      review: newComment || 'Great cinema screening experience!',
      tags: ['Verified Attendee']
    };

    setEntries([newEntry, ...entries]);
    setNewComment('');
    setIsFormOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#bae861]">
            Cinema Memories
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
            Watched & Reviews
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Your personal cinema diary. Rate movies you&apos;ve experienced and share impressions.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2.5 rounded-xl bg-[#bae861] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#bae861]/25 hover:bg-[#cbf27a] transition-all"
        >
          <Sparkles className="w-4 h-4" />
          {isFormOpen ? 'Close Form' : 'Log a Movie'}
        </button>
      </div>

      {/* Review Modal Form */}
      {isFormOpen && (
        <form onSubmit={handleAddReview} className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#bae861]/30 max-w-xl mx-auto space-y-4 animate-in fade-in zoom-in-95">
          <h3 className="text-lg font-bold text-white">Add Watched Entry</h3>
          
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Select Film</label>
            <select
              value={activeMovieId}
              onChange={(e) => setActiveMovieId(e.target.value)}
              className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#bae861]"
            >
              {MOCK_MOVIES.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Your Star Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-gray-300 ml-2">{newRating} / 5 Stars</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Your Review</label>
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What did you think of the cinematography, sound, or story?"
              className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#bae861]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#bae861] text-black font-extrabold text-xs shadow-lg shadow-[#bae861]/25 hover:bg-[#cbf27a]"
            >
              Publish Review
            </button>
          </div>
        </form>
      )}

      {/* Watched Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entries.map(entry => (
          <div key={entry.id} className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row gap-5 glass-panel-hover">
            
            {/* Poster thumbnail */}
            <div className="w-24 sm:w-28 aspect-[2/3] rounded-xl overflow-hidden shrink-0 bg-gray-900 border border-white/10 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entry.movie.poster_url}
                alt={entry.movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-base">{entry.movie.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#bae861]" />
                    <span>{entry.cinema}</span>
                    <span>•</span>
                    <span>{entry.watchedAt}</span>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-0.5 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20 text-amber-400 text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{entry.rating}.0</span>
                </div>
              </div>

              {entry.review && (
                <p className="text-xs text-gray-300 italic bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed">
                  &ldquo;{entry.review}&rdquo;
                </p>
              )}

              <div className="flex flex-wrap gap-1.5 pt-1">
                {entry.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
