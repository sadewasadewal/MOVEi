-- 007_bookings_and_tickets.sql
-- Create bookings and tickets with double-booking prevention

CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'expired', 'completed');
CREATE TYPE ticket_status AS ENUM ('reserved', 'confirmed', 'used', 'cancelled', 'expired');

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    show_id UUID NOT NULL REFERENCES public.shows(id) ON DELETE RESTRICT,
    booking_reference TEXT NOT NULL UNIQUE,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'LKR',
    status booking_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    show_id UUID NOT NULL REFERENCES public.shows(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    seat_id UUID NOT NULL REFERENCES public.seats(id) ON DELETE RESTRICT,
    ticket_code TEXT NOT NULL UNIQUE,
    barcode_value TEXT NOT NULL UNIQUE,
    status ticket_status NOT NULL DEFAULT 'reserved',
    hold_expires_at TIMESTAMPTZ,
    scanned_at TIMESTAMPTZ,
    scanned_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CRITICAL: Prevent double booking at the database level!
-- Only one active ticket (reserved, confirmed, or used) can exist for a given show_id and seat_id.
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_seat_booking
    ON public.tickets (show_id, seat_id)
    WHERE status IN ('reserved', 'confirmed', 'used');

CREATE INDEX IF NOT EXISTS idx_tickets_user ON public.tickets(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tickets_show ON public.tickets(show_id);
CREATE INDEX IF NOT EXISTS idx_tickets_barcode ON public.tickets(barcode_value);
