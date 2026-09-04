import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Cinema, Show, Seat } from '../types';
import { MOCK_CINEMAS, MOCK_SHOWS } from '../lib/mock-data';

export async function getCinemas(): Promise<Cinema[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('cinemas')
      .select('*, screens(*)');
    if (error) {
      console.error('Error fetching cinemas from Supabase:', error);
      return MOCK_CINEMAS;
    }
    return data as Cinema[];
  }
  return MOCK_CINEMAS;
}

export async function getShowsForMovie(movieId: string): Promise<Show[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('shows')
      .select('*, cinema:cinemas(*), screen:screens(*), movie:movies(*)')
      .eq('movie_id', movieId)
      .eq('status', 'scheduled')
      .order('start_time', { ascending: true });
    if (error) {
      console.error('Error fetching shows from Supabase:', error);
      return MOCK_SHOWS.filter(s => s.movie_id === movieId);
    }
    return data as Show[];
  }
  return MOCK_SHOWS.filter(s => s.movie_id === movieId);
}

export async function getShowById(showId: string): Promise<Show | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('shows')
      .select('*, cinema:cinemas(*), screen:screens(*), movie:movies(*)')
      .eq('id', showId)
      .single();
    if (error) {
      console.error('Error fetching show by id:', error);
      return MOCK_SHOWS.find(s => s.id === showId) || null;
    }
    return data as Show;
  }
  return MOCK_SHOWS.find(s => s.id === showId) || null;
}

export async function getScreenSeats(screenId: string, showId?: string): Promise<Seat[]> {
  if (isSupabaseConfigured && supabase) {
    const { data: seatData, error: seatError } = await supabase
      .from('seats')
      .select('*')
      .eq('screen_id', screenId)
      .order('row_label')
      .order('seat_number');

    if (seatError) {
      console.error('Error fetching seats from Supabase:', seatError);
      return generateMockSeatGrid(screenId);
    }

    // Check existing tickets for this show to set occupied state
    if (showId) {
      const { data: ticketData } = await supabase
        .from('tickets')
        .select('seat_id, status')
        .eq('show_id', showId)
        .in('status', ['reserved', 'confirmed', 'used']);

      const occupiedSeatIds = new Set(ticketData?.map(t => t.seat_id) || []);

      return seatData.map((s: Seat) => ({
        ...s,
        status: occupiedSeatIds.has(s.id) ? 'sold' : 'available'
      })) as Seat[];
    }

    return seatData as Seat[];
  }

  return generateMockSeatGrid(screenId);
}

function generateMockSeatGrid(screenId: string): Seat[] {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsPerRow = 8;
  const seats: Seat[] = [];

  rows.forEach((row, rIdx) => {
    for (let num = 1; num <= seatsPerRow; num++) {
      let seatType: 'standard' | 'premium' | 'vip' = 'standard';
      if (rIdx >= 4) seatType = 'vip';
      else if (rIdx >= 2) seatType = 'premium';

      // Mark a couple seats as sold for realism
      const isSold = (row === 'E' && (num === 4 || num === 5)) || (row === 'D' && num === 3);

      seats.push({
        id: `seat-${screenId}-${row}${num}`,
        screen_id: screenId,
        row_label: row,
        seat_number: num,
        seat_type: seatType,
        x_position: num,
        y_position: rIdx + 1,
        is_active: true,
        status: isSold ? 'sold' : 'available'
      });
    }
  });

  return seats;
}
