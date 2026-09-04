-- 008_scans_and_reviews.sql
-- Scanner logs, staff assignments, and watched movie reviews

CREATE TYPE scan_result AS ENUM ('valid', 'already_used', 'invalid', 'wrong_cinema', 'cancelled', 'expired');

CREATE TABLE IF NOT EXISTS public.staff_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cinema_id UUID NOT NULL REFERENCES public.cinemas(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'scanner',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, cinema_id)
);

CREATE TABLE IF NOT EXISTS public.ticket_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE SET NULL,
    scanner_id UUID NOT NULL REFERENCES public.profiles(id),
    cinema_id UUID NOT NULL REFERENCES public.cinemas(id),
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    result scan_result NOT NULL,
    device_identifier TEXT
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
    rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1.0 AND rating <= 10.0),
    review_text TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, movie_id)
);

CREATE INDEX IF NOT EXISTS idx_scans_scanner ON public.ticket_scans(scanner_id, scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_movie ON public.reviews(movie_id);
