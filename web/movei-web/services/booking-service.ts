import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Ticket, Booking } from '../types';
import { MOCK_TICKETS, MOCK_BOOKINGS, MOCK_SHOWS } from '../lib/mock-data';

export async function holdSeats(showId: string, seatIds: string[], userId: string = 'u1111111-1111-1111-1111-111111111111') {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.rpc('hold_seats', {
      p_show_id: showId,
      p_seat_ids: seatIds,
      p_user_id: userId
    });
    if (error) throw error;
    return data as {
      booking_id: string;
      booking_reference: string;
      total_amount: number;
      expires_at: string;
    };
  }

  // Local fallback mock
  const bookingRef = 'MOV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const show = MOCK_SHOWS.find(s => s.id === showId) || MOCK_SHOWS[0];
  const total = seatIds.length * show.price_standard;
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const bookingId = 'bk-' + Date.now();

  const newTickets: Ticket[] = seatIds.map((seatId, idx) => ({
    id: `tk-${Date.now()}-${idx}`,
    booking_id: bookingId,
    show_id: showId,
    user_id: userId,
    seat_id: seatId,
    ticket_code: `${bookingRef}-${String(idx + 1).padStart(2, '0')}`,
    barcode_value: `${bookingRef}-${String(idx + 1).padStart(2, '0')}`,
    status: 'reserved',
    hold_expires_at: expiresAt,
    show: show,
    seat: {
      id: seatId,
      screen_id: show.screen_id,
      row_label: seatId.split('-').pop()?.substring(0, 1) || 'A',
      seat_number: parseInt(seatId.split('-').pop()?.substring(1) || '1', 10),
      seat_type: 'standard',
      x_position: 1,
      y_position: 1,
      is_active: true
    },
    created_at: new Date().toISOString()
  }));

  const newBooking: Booking = {
    id: bookingId,
    user_id: userId,
    show_id: showId,
    booking_reference: bookingRef,
    total_amount: total,
    currency: 'LKR',
    status: 'pending',
    created_at: new Date().toISOString(),
    show: show,
    tickets: newTickets
  };

  MOCK_BOOKINGS.unshift(newBooking);
  newTickets.forEach(t => MOCK_TICKETS.unshift(t));

  return {
    booking_id: bookingId,
    booking_reference: bookingRef,
    total_amount: total,
    expires_at: expiresAt
  };
}

export async function confirmBooking(bookingId: string) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.rpc('confirm_booking', {
      p_booking_id: bookingId
    });
    if (error) throw error;
    return data as { success: boolean; booking_reference: string };
  }

  // Local fallback mock
  const booking = MOCK_BOOKINGS.find(b => b.id === bookingId);
  if (booking) {
    booking.status = 'confirmed';
    if (booking.tickets) {
      booking.tickets.forEach(t => {
        t.status = 'confirmed';
        t.hold_expires_at = null;
      });
    }
  }

  return {
    success: true,
    booking_reference: booking?.booking_reference || 'MOV-CONFIRMED'
  };
}

export async function getUserTickets(userId: string = 'u1111111-1111-1111-1111-111111111111'): Promise<Ticket[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('tickets')
      .select('*, show:shows(*, movie:movies(*), cinema:cinemas(*), screen:screens(*)), seat:seats(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user tickets:', error);
      return MOCK_TICKETS.filter(t => t.user_id === userId);
    }
    return data as Ticket[];
  }

  return MOCK_TICKETS.filter(t => t.user_id === userId);
}
