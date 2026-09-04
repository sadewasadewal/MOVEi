import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ScanResponse } from '../types';
import { MOCK_TICKETS } from '../lib/mock-data';

export async function validateAndAdmitTicket(
  ticketCode: string,
  scannerId: string = 'u3333333-3333-3333-3333-333333333333',
  cinemaId: string = 'c1111111-1111-1111-1111-111111111111',
  deviceId?: string
): Promise<ScanResponse> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.rpc('validate_and_admit_ticket', {
      p_ticket_code: ticketCode.trim(),
      p_scanner_id: scannerId,
      p_cinema_id: cinemaId,
      p_device_id: deviceId || 'web-browser-scanner'
    });
    if (error) {
      console.error('Scan RPC error:', error);
      return {
        valid: false,
        reason: 'invalid',
        message: error.message || 'Database error during scan'
      };
    }
    return data as ScanResponse;
  }

  // Local mock admission logic with atomic checks
  const ticket = MOCK_TICKETS.find(
    t => t.ticket_code.toUpperCase() === ticketCode.trim().toUpperCase() ||
         t.barcode_value.toUpperCase() === ticketCode.trim().toUpperCase()
  );

  if (!ticket) {
    return {
      valid: false,
      reason: 'invalid',
      message: 'Ticket not found in system'
    };
  }

  if (ticket.show?.cinema_id && ticket.show.cinema_id !== cinemaId) {
    return {
      valid: false,
      reason: 'wrong_cinema',
      message: `Ticket is for ${ticket.show?.cinema?.name || 'another cinema'}`
    };
  }

  if (ticket.status === 'used') {
    return {
      valid: false,
      reason: 'already_used',
      message: `Already used / admitted at ${ticket.scanned_at ? new Date(ticket.scanned_at).toLocaleTimeString() : 'earlier today'}`
    };
  }

  if (ticket.status === 'cancelled' || ticket.status === 'expired') {
    return {
      valid: false,
      reason: ticket.status,
      message: `Ticket is marked as ${ticket.status}`
    };
  }

  // Mark admitted
  ticket.status = 'used';
  ticket.scanned_at = new Date().toISOString();
  ticket.scanned_by = scannerId;

  return {
    valid: true,
    reason: 'valid',
    ticket_code: ticket.ticket_code,
    movie_title: ticket.show?.movie?.title || 'Unknown Title',
    customer_name: 'Alex Mercer',
    cinema_name: ticket.show?.cinema?.name || 'Cinema Complex',
    screen_name: ticket.show?.screen?.name || 'Screen 1',
    seat: `${ticket.seat?.row_label}${ticket.seat?.seat_number}`,
    showtime: ticket.show?.start_time
  };
}
