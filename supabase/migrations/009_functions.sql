-- 009_functions.sql
-- Server-side atomic stored procedures for seat holds, booking confirmation, and ticket admission

-- 1. Hold seats atomically for 10 minutes
CREATE OR REPLACE FUNCTION public.hold_seats(
    p_show_id UUID,
    p_seat_ids UUID[],
    p_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_seat_id UUID;
    v_booking_id UUID;
    v_booking_ref TEXT;
    v_total NUMERIC(10, 2) := 0.0;
    v_expires_at TIMESTAMPTZ := NOW() + INTERVAL '10 minutes';
    v_price NUMERIC(10, 2);
    v_seat_record RECORD;
    v_count INT := 0;
BEGIN
    -- Expire stale holds
    UPDATE public.tickets
    SET status = 'expired'
    WHERE status = 'reserved' AND hold_expires_at < NOW();

    -- Check if any requested seat is occupied
    FOR v_seat_id IN SELECT unnest(p_seat_ids) LOOP
        IF EXISTS (
            SELECT 1 FROM public.tickets
            WHERE show_id = p_show_id
              AND seat_id = v_seat_id
              AND status IN ('reserved', 'confirmed', 'used')
        ) THEN
            RAISE EXCEPTION 'Seat % is no longer available', v_seat_id;
        END IF;
    END LOOP;

    -- Generate a unique booking reference
    v_booking_ref := 'MOV-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8));

    -- Calculate price based on show and seat types
    FOR v_seat_record IN 
        SELECT s.id, s.row_label, s.seat_number, s.seat_type,
               sh.price_standard, sh.price_premium, sh.price_vip
        FROM public.seats s
        JOIN public.shows sh ON sh.id = p_show_id
        WHERE s.id = ANY(p_seat_ids)
    LOOP
        IF v_seat_record.seat_type = 'vip' THEN
            v_price := v_seat_record.price_vip;
        ELSIF v_seat_record.seat_type = 'premium' THEN
            v_price := v_seat_record.price_premium;
        ELSE
            v_price := v_seat_record.price_standard;
        END IF;
        v_total := v_total + v_price;
    END LOOP;

    -- Create pending booking
    INSERT INTO public.bookings (user_id, show_id, booking_reference, total_amount, status)
    VALUES (p_user_id, p_show_id, v_booking_ref, v_total, 'pending')
    RETURNING id INTO v_booking_id;

    -- Create reserved ticket passes
    FOR v_seat_id IN SELECT unnest(p_seat_ids) LOOP
        v_count := v_count + 1;
        INSERT INTO public.tickets (
            booking_id, show_id, user_id, seat_id,
            ticket_code, barcode_value, status, hold_expires_at
        )
        VALUES (
            v_booking_id, p_show_id, p_user_id, v_seat_id,
            v_booking_ref || '-' || LPAD(v_count::TEXT, 2, '0'),
            v_booking_ref || '-' || LPAD(v_count::TEXT, 2, '0'),
            'reserved', v_expires_at
        );
    END LOOP;

    RETURN jsonb_build_object(
        'booking_id', v_booking_id,
        'booking_reference', v_booking_ref,
        'total_amount', v_total,
        'expires_at', v_expires_at
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Confirm booking after payment confirmation
CREATE OR REPLACE FUNCTION public.confirm_booking(
    p_booking_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_booking RECORD;
BEGIN
    SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Booking not found';
    END IF;

    -- Check if tickets expired
    IF EXISTS (
        SELECT 1 FROM public.tickets
        WHERE booking_id = p_booking_id
          AND status = 'reserved'
          AND hold_expires_at < NOW()
    ) THEN
        UPDATE public.bookings SET status = 'expired' WHERE id = p_booking_id;
        UPDATE public.tickets SET status = 'expired' WHERE booking_id = p_booking_id;
        RAISE EXCEPTION 'Reservation hold expired';
    END IF;

    UPDATE public.bookings SET status = 'confirmed', updated_at = NOW() WHERE id = p_booking_id;
    UPDATE public.tickets SET status = 'confirmed', hold_expires_at = NULL WHERE booking_id = p_booking_id;

    RETURN jsonb_build_object('success', true, 'booking_reference', v_booking.booking_reference);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Atomic ticket scan and admission validation (Strict Row Locking)
CREATE OR REPLACE FUNCTION public.validate_and_admit_ticket(
    p_ticket_code TEXT,
    p_scanner_id UUID,
    p_cinema_id UUID,
    p_device_id TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_ticket RECORD;
    v_customer_name TEXT;
    v_movie_title TEXT;
    v_cinema_name TEXT;
    v_screen_name TEXT;
    v_seat_label TEXT;
    v_showtime TIMESTAMPTZ;
BEGIN
    -- Select with row-level lock to prevent concurrent double-scans
    SELECT t.*, s.cinema_id AS show_cinema_id, s.start_time, s.screen_id, s.movie_id,
           c.name AS cinema_name, sc.name AS screen_name, st.row_label || st.seat_number::TEXT AS seat_str,
           m.title AS movie_title, p.full_name AS customer_name
    INTO v_ticket
    FROM public.tickets t
    JOIN public.shows s ON s.id = t.show_id
    JOIN public.cinemas c ON c.id = s.cinema_id
    JOIN public.screens sc ON sc.id = s.screen_id
    JOIN public.seats st ON st.id = t.seat_id
    JOIN public.movies m ON m.id = s.movie_id
    JOIN public.profiles p ON p.id = t.user_id
    WHERE t.ticket_code = p_ticket_code OR t.barcode_value = p_ticket_code
    FOR UPDATE OF t;

    IF NOT FOUND THEN
        INSERT INTO public.ticket_scans (scanner_id, cinema_id, result, device_identifier)
        VALUES (p_scanner_id, p_cinema_id, 'invalid', p_device_id);
        RETURN jsonb_build_object('valid', false, 'reason', 'invalid', 'message', 'Ticket not found');
    END IF;

    -- Check venue
    IF v_ticket.show_cinema_id != p_cinema_id THEN
        INSERT INTO public.ticket_scans (ticket_id, scanner_id, cinema_id, result, device_identifier)
        VALUES (v_ticket.id, p_scanner_id, p_cinema_id, 'wrong_cinema', p_device_id);
        RETURN jsonb_build_object('valid', false, 'reason', 'wrong_cinema', 'message', 'Ticket is valid for ' || v_ticket.cinema_name);
    END IF;

    -- Check if already used
    IF v_ticket.status = 'used' THEN
        INSERT INTO public.ticket_scans (ticket_id, scanner_id, cinema_id, result, device_identifier)
        VALUES (v_ticket.id, p_scanner_id, p_cinema_id, 'already_used', p_device_id);
        RETURN jsonb_build_object('valid', false, 'reason', 'already_used', 'message', 'Ticket was already scanned at ' || TO_CHAR(v_ticket.scanned_at, 'HH12:MI AM'));
    END IF;

    -- Check if cancelled or expired
    IF v_ticket.status IN ('cancelled', 'expired') THEN
        INSERT INTO public.ticket_scans (ticket_id, scanner_id, cinema_id, result, device_identifier)
        VALUES (v_ticket.id, p_scanner_id, p_cinema_id, v_ticket.status::scan_result, p_device_id);
        RETURN jsonb_build_object('valid', false, 'reason', v_ticket.status, 'message', 'Ticket is ' || v_ticket.status);
    END IF;

    -- Mark admitted
    UPDATE public.tickets
    SET status = 'used', scanned_at = NOW(), scanned_by = p_scanner_id
    WHERE id = v_ticket.id;

    INSERT INTO public.ticket_scans (ticket_id, scanner_id, cinema_id, result, device_identifier)
    VALUES (v_ticket.id, p_scanner_id, p_cinema_id, 'valid', p_device_id);

    RETURN jsonb_build_object(
        'valid', true,
        'reason', 'valid',
        'ticket_code', v_ticket.ticket_code,
        'movie_title', v_ticket.movie_title,
        'customer_name', v_ticket.customer_name,
        'cinema_name', v_ticket.cinema_name,
        'screen_name', v_ticket.screen_name,
        'seat', v_ticket.seat_str,
        'showtime', v_ticket.start_time
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
