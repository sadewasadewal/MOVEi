'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveMovie } from '../../../../services/movie-service';
import { ArrowLeft, CheckCircle2, Sparkles, Image, Star, Eye } from 'lucide-react';

export default function NewMoviePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&h=900&q=80');
  const [backdropUrl, setBackdropUrl] = useState('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&h=1080&q=80');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [runtimeMinutes, setRuntimeMinutes] = useState(120);
  const [ageRating, setAgeRating] = useState('PG-13');
  const [language, setLanguage] = useState('English');
  const [rating, setRating] = useState(8.5);
  const [genres, setGenres] = useState('Action, Sci-Fi');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      setIsSubmitting(true);
      await saveMovie({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tagline,
        description,
        poster_url: posterUrl,
        backdrop_url: backdropUrl,
        trailer_url: trailerUrl,
        runtime_minutes: Number(runtimeMinutes),
        age_rating: ageRating,
        language,
        rating: Number(rating),
        genres: genres.split(',').map(g => g.trim()),
        status
      });

      router.push('/admin/movies');
    } catch (err) {
      console.error('Failed to create movie:', err);
      alert('Failed to save movie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/movies"
            className="p-2 rounded-xl glass-panel hover:bg-white/10 text-gray-300 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#bae861]">
              Movie Studio Publishing
            </span>
            <h1 className="text-3xl font-black text-white mt-0.5">
              Create New Movie Record
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
          <h3 className="text-lg font-bold text-white">Movie Metadata</h3>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Movie Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blade Runner 2099"
              className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#bae861]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. The future is closer than you think."
              className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#bae861]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Plot Synopsis</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of the movie narrative..."
              className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#bae861]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Poster URL <span className="text-[#bae861] font-mono">(Enforces 2:3 Ratio)</span>
              </label>
              <input
                type="url"
                required
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-3 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-[#bae861]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Backdrop URL <span className="text-[#bae861] font-mono">(Enforces 16:9 Ratio)</span>
              </label>
              <input
                type="url"
                required
                value={backdropUrl}
                onChange={(e) => setBackdropUrl(e.target.value)}
                className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-3 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-[#bae861]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Runtime (mins)</label>
              <input
                type="number"
                value={runtimeMinutes}
                onChange={(e) => setRuntimeMinutes(Number(e.target.value))}
                className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#bae861]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Age Rating</label>
              <select
                value={ageRating}
                onChange={(e) => setAgeRating(e.target.value)}
                className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#bae861]"
              >
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R</option>
                <option value="NC-17">NC-17</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">IMDb Rating</label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="10.0"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#bae861]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Genres (comma-separated)</label>
              <input
                type="text"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                placeholder="Action, Sci-Fi, Thriller"
                className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#bae861]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Publishing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#0d0f12] border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#bae861]"
              >
                <option value="published">Published (Now Showing)</option>
                <option value="draft">Draft (Coming Soon)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#bae861] hover:bg-[#cbf27a] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#bae861]/25 transition-all"
          >
            {isSubmitting ? 'Saving to Database...' : 'Save & Publish Movie'}
          </button>
        </form>


        {/* Live Visual Preview (Enforcing 2:3 Poster and 16:9 Backdrop Aspect Ratios) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-gray-400">
            <Eye className="w-4 h-4 text-[#bae861]" />
            <span>Live Aspect Ratio Validation Preview</span>
          </div>

          {/* 16:9 Backdrop Card */}
          <div className="glass-panel p-4 rounded-3xl border border-white/10 space-y-2">
            <div className="flex justify-between text-[11px] font-mono text-gray-400">
              <span>Backdrop (16:9 Landscape)</span>
              <span className="text-[#bae861]">1920 × 1080</span>
            </div>
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-white/10">
              {backdropUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={backdropUrl}
                  alt="Backdrop Preview"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <div>
                  <h4 className="font-black text-white text-lg">{title || 'Movie Title Preview'}</h4>
                  <p className="text-xs text-gray-300 italic">{tagline}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2:3 Poster Card */}
          <div className="glass-panel p-4 rounded-3xl border border-white/10 space-y-2">
            <div className="flex justify-between text-[11px] font-mono text-gray-400">
              <span>Poster (2:3 Vertical)</span>
              <span className="text-[#bae861]">600 × 900</span>
            </div>
            <div className="w-48 aspect-[2/3] mx-auto rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl relative">
              {posterUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={posterUrl}
                  alt="Poster Preview"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
