import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Movie, MovieStatus } from '../types';
import { MOCK_MOVIES } from '../lib/mock-data';

export async function getMovies(status?: MovieStatus): Promise<Movie[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('movies').select('*').order('release_date', { ascending: false });
    if (status) {
      query = query.eq('status', status);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching movies from Supabase:', error);
      return status ? MOCK_MOVIES.filter(m => m.status === status) : MOCK_MOVIES;
    }
    return data as Movie[];
  }

  // Fallback to in-memory mock data
  if (status) {
    return MOCK_MOVIES.filter(m => m.status === status);
  }
  return MOCK_MOVIES;
}

export async function getMovieBySlug(slug: string): Promise<Movie | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) {
      console.error('Error fetching movie by slug:', error);
      return MOCK_MOVIES.find(m => m.slug === slug) || null;
    }
    return data as Movie;
  }

  return MOCK_MOVIES.find(m => m.slug === slug) || null;
}

export async function getMovieById(id: string): Promise<Movie | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Error fetching movie by id:', error);
      return MOCK_MOVIES.find(m => m.id === id) || null;
    }
    return data as Movie;
  }

  return MOCK_MOVIES.find(m => m.id === id) || null;
}

export async function saveMovie(movie: Partial<Movie>): Promise<Movie> {
  if (isSupabaseConfigured && supabase) {
    if (movie.id) {
      const { data, error } = await supabase
        .from('movies')
        .update(movie)
        .eq('id', movie.id)
        .select()
        .single();
      if (error) throw error;
      return data as Movie;
    } else {
      const { data, error } = await supabase
        .from('movies')
        .insert([{
          ...movie,
          slug: movie.slug || movie.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'movie'
        }])
        .select()
        .single();
      if (error) throw error;
      return data as Movie;
    }
  }

  // Local fallback mock
  const existingIdx = MOCK_MOVIES.findIndex(m => m.id === movie.id);
  if (existingIdx >= 0) {
    MOCK_MOVIES[existingIdx] = { ...MOCK_MOVIES[existingIdx], ...movie } as Movie;
    return MOCK_MOVIES[existingIdx];
  } else {
    const newMovie: Movie = {
      id: 'm-' + Date.now(),
      title: movie.title || 'Untitled',
      slug: movie.slug || (movie.title || 'untitled').toLowerCase().replace(/\s+/g, '-'),
      description: movie.description || '',
      tagline: movie.tagline || '',
      poster_url: movie.poster_url || '',
      backdrop_url: movie.backdrop_url || '',
      runtime_minutes: movie.runtime_minutes || 120,
      release_date: movie.release_date || new Date().toISOString().split('T')[0],
      rating: movie.rating || 8.0,
      genres: movie.genres || ['Action'],
      language: movie.language || 'English',
      age_rating: movie.age_rating || 'PG-13',
      status: movie.status || 'published'
    };
    MOCK_MOVIES.unshift(newMovie);
    return newMovie;
  }
}
