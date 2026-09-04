-- 006_shows.sql
-- Create shows table with schedule and tier pricing

CREATE TYPE show_status AS ENUM ('scheduled', 'sold_out', 'cancelled', 'completed');

CREATE TABLE IF NOT EXISTS public.shows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
    cinema_id UUID NOT NULL REFERENCES public.cinemas(id) ON DELETE CASCADE,
    screen_id UUID NOT NULL REFERENCES public.screens(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    price_standard NUMERIC(10, 2) NOT NULL DEFAULT 1000.00,
    price_premium NUMERIC(10, 2) NOT NULL DEFAULT 1500.00,
    price_vip NUMERIC(10, 2) NOT NULL DEFAULT 2000.00,
    status show_status NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_times CHECK (end_time > start_time)
);

-- Constraint function to prevent overlapping shows on the same screen
CREATE OR REPLACE FUNCTION check_show_overlap()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.shows
        WHERE screen_id = NEW.screen_id
          AND id != NEW.id
          AND status != 'cancelled'
          AND tstzrange(start_time, end_time, '[)') && tstzrange(NEW.start_time, NEW.end_time, '[)')
    ) THEN
        RAISE EXCEPTION 'Showtime overlaps with an existing scheduled show on this screen';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_check_show_overlap
    BEFORE INSERT OR UPDATE ON public.shows
    FOR EACH ROW EXECUTE FUNCTION check_show_overlap();

CREATE INDEX IF NOT EXISTS idx_shows_movie_time ON public.shows(movie_id, start_time);
CREATE INDEX IF NOT EXISTS idx_shows_screen_time ON public.shows(screen_id, start_time);
