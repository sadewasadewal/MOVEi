-- 003_cinemas.sql
CREATE TABLE IF NOT EXISTS public.cinemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Colombo',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone TEXT,
    logo_url TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 004_screens.sql
CREATE TABLE IF NOT EXISTS public.screens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cinema_id UUID NOT NULL REFERENCES public.cinemas(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    screen_number INTEGER NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 60,
    screen_type TEXT NOT NULL DEFAULT 'standard', -- standard, imax, 3d, dolby
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 005_seats.sql
CREATE TYPE seat_type AS ENUM ('standard', 'premium', 'vip', 'disabled');

CREATE TABLE IF NOT EXISTS public.seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    screen_id UUID NOT NULL REFERENCES public.screens(id) ON DELETE CASCADE,
    row_label TEXT NOT NULL,
    seat_number INTEGER NOT NULL,
    seat_type seat_type NOT NULL DEFAULT 'standard',
    x_position INTEGER NOT NULL DEFAULT 0,
    y_position INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (screen_id, row_label, seat_number)
);

CREATE INDEX IF NOT EXISTS idx_seats_screen ON public.seats(screen_id);
