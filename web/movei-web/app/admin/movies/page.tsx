'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_MOVIES } from '../../../lib/mock-data';
import { Movie, MovieStatus } from '../../../types';
import { Film, Plus, Edit, Eye, Archive, CheckCircle2, Star, ArrowLeft } from 'lucide-react';

export default function AdminMoviesListPage() {
  const [movies, setMovies] = useState<Movie[]>(MOCK_MOVIES);

  const handleToggleStatus = (movieId: string) => {
    setMovies(prev =>
      prev.map(m => {
        if (m.id === movieId) {
          const nextStatus: MovieStatus = m.status === 'published' ? 'archived' : 'published';
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
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
              Catalog Management
            </span>
            <h1 className="text-3xl font-black text-white mt-0.5">
              Movies & Media Assets
            </h1>
          </div>
        </div>

        <Link
          href="/admin/movies/new"
          className="px-4 py-2.5 rounded-xl bg-[#bae861] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-[#bae861]/25 hover:bg-[#cbf27a] transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Movie
        </Link>
      </div>

      {/* Movies Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-gray-400 uppercase font-bold">
              <th className="py-4 px-4">Poster</th>
              <th className="py-4 px-4">Title & Slug</th>
              <th className="py-4 px-4">Runtime & Age</th>
              <th className="py-4 px-4">Rating</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {movies.map(movie => (
              <tr key={movie.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4">
                  <div className="w-12 aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 border border-white/10 shadow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="font-bold text-white text-sm">{movie.title}</div>
                  <div className="text-[11px] font-mono text-gray-400">/{movie.slug}</div>
                </td>

                <td className="py-3 px-4 text-gray-300">
                  <div>{movie.runtime_minutes} mins</div>
                  <span className="text-[10px] font-bold uppercase bg-white/10 px-1.5 py-0.5 rounded text-gray-300">
                    {movie.age_rating}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{movie.rating.toFixed(1)}</span>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                      movie.status === 'published'
                        ? 'bg-[#bae861]/20 text-[#bae861]'
                        : movie.status === 'draft'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {movie.status}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/movies/${movie.slug}`}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                      title="View public page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleToggleStatus(movie.id)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 border border-white/10"
                    >
                      {movie.status === 'published' ? 'Archive' : 'Publish'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
