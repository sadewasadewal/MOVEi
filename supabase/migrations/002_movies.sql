-- 002_movies.sql
-- Create movies table with publishing workflow (draft, published, archived)

CREATE TYPE movie_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE IF NOT EXISTS public.movies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    tagline TEXT NOT NULL DEFAULT '',
    poster_url TEXT NOT NULL DEFAULT '',
    backdrop_url TEXT NOT NULL DEFAULT '',
    logo_url TEXT,
    trailer_url TEXT,
    runtime_minutes INTEGER NOT NULL DEFAULT 120,
    release_date DATE NOT NULL DEFAULT CURRENT_DATE,
    rating NUMERIC(3, 1) NOT NULL DEFAULT 8.0,
    genres TEXT[] NOT NULL DEFAULT '{}',
    language TEXT NOT NULL DEFAULT 'English',
    age_rating TEXT NOT NULL DEFAULT 'PG-13',
    status movie_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_movies_status ON public.movies(status);
CREATE INDEX IF NOT EXISTS idx_movies_release_date ON public.movies(release_date);
