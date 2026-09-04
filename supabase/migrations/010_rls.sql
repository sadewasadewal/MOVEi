-- 010_rls.sql
-- Row Level Security policies for Customer, Scanner, and Admin

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cinemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper to check if current user is scanner
CREATE OR REPLACE FUNCTION public.is_scanner()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (role = 'scanner' OR role = 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- PROFILES
CREATE POLICY "Users read own profile or admin reads all"
    ON public.profiles FOR SELECT
    USING (id = auth.uid() OR public.is_admin() OR public.is_scanner());

CREATE POLICY "Users update own profile"
    ON public.profiles FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- MOVIES
CREATE POLICY "Public reads published movies"
    ON public.movies FOR SELECT
    USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins manage movies"
    ON public.movies FOR ALL
    USING (public.is_admin());

-- CINEMAS, SCREENS, SEATS, SHOWS
CREATE POLICY "Public reads cinemas" ON public.cinemas FOR SELECT USING (status = 'active' OR public.is_admin());
CREATE POLICY "Admins manage cinemas" ON public.cinemas FOR ALL USING (public.is_admin());

CREATE POLICY "Public reads screens" ON public.screens FOR SELECT USING (true);
CREATE POLICY "Admins manage screens" ON public.screens FOR ALL USING (public.is_admin());

CREATE POLICY "Public reads seats" ON public.seats FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins manage seats" ON public.seats FOR ALL USING (public.is_admin());

CREATE POLICY "Public reads shows" ON public.shows FOR SELECT USING (status != 'cancelled' OR public.is_admin());
CREATE POLICY "Admins manage shows" ON public.shows FOR ALL USING (public.is_admin());

-- BOOKINGS
CREATE POLICY "Users read own bookings"
    ON public.bookings FOR SELECT
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users insert own bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- TICKETS
CREATE POLICY "Users read own tickets"
    ON public.tickets FOR SELECT
    USING (user_id = auth.uid() OR public.is_admin() OR public.is_scanner());

-- SCANS & ASSIGNMENTS
CREATE POLICY "Scanners read own scans"
    ON public.ticket_scans FOR SELECT
    USING (scanner_id = auth.uid() OR public.is_admin());

CREATE POLICY "Staff read own assignment"
    ON public.staff_assignments FOR SELECT
    USING (user_id = auth.uid() OR public.is_admin());

-- REVIEWS
CREATE POLICY "Public reads reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users write own reviews" ON public.reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own reviews" ON public.reviews FOR UPDATE USING (user_id = auth.uid());
