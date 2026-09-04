import { Movie, Cinema, Show, Booking, Ticket, Profile } from '../types';

export const MOCK_MOVIES: Movie[] = [
  {
    id: 'm0000000-0000-0000-0000-000000000000',
    title: 'Wicked',
    slug: 'wicked',
    tagline: 'Everyone deserves the chance to fly.',
    description: 'Elphaba, an ostracized but fiery girl and Glinda, a bubbly popular aristocrat, forge an improbable bond in the magical land of Oz, before destiny pulls them into the legendary conflict.',
    poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&h=1080&q=80',
    trailer_url: 'https://www.youtube.com/watch?v=6COmYeLsz4c',
    runtime_minutes: 160,
    release_date: '2024-11-22',
    rating: 8.1,
    genres: ['Fantasy', 'Musical'],
    language: 'English',
    age_rating: 'PG',
    status: 'published'
  },
  {
    id: 'm1111111-1111-1111-1111-111111111111',
    title: 'Inception',
    slug: 'inception',
    tagline: 'Your mind is the scene of the crime.',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&h=1080&q=80',
    trailer_url: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    runtime_minutes: 148,
    release_date: '2010-07-16',
    rating: 8.8,
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    language: 'English',
    age_rating: 'PG-13',
    status: 'published'
  },
  {
    id: 'm2222222-2222-2222-2222-222222222222',
    title: 'Dune: Part Two',
    slug: 'dune-part-two',
    tagline: 'Long live the fighters.',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&h=1080&q=80',
    trailer_url: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    runtime_minutes: 166,
    release_date: '2024-03-01',
    rating: 8.6,
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    language: 'English',
    age_rating: 'PG-13',
    status: 'published'
  },
  {
    id: 'm3333333-3333-3333-3333-333333333333',
    title: 'Oppenheimer',
    slug: 'oppenheimer',
    tagline: 'The world forever changes.',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    poster_url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1920&h=1080&q=80',
    trailer_url: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    runtime_minutes: 180,
    release_date: '2023-07-21',
    rating: 8.9,
    genres: ['Biography', 'Drama', 'History'],
    language: 'English',
    age_rating: 'R',
    status: 'published'
  },
  {
    id: 'm4444444-4444-4444-4444-444444444444',
    title: 'Interstellar',
    slug: 'interstellar',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    poster_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&h=1080&q=80',
    trailer_url: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    runtime_minutes: 169,
    release_date: '2014-11-07',
    rating: 8.7,
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    language: 'English',
    age_rating: 'PG-13',
    status: 'published'
  },
  {
    id: 'm5555555-5555-5555-5555-555555555555',
    title: 'Cyberpunk 2077: No Coincidence',
    slug: 'cyberpunk-no-coincidence',
    tagline: 'Night City is waiting for you.',
    description: 'In the neon-soaked underworld of Night City, a group of disparate strangers find themselves united in a high-stakes heist orchestrated by an unknown contractor.',
    poster_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&h=1080&q=80',
    trailer_url: '',
    runtime_minutes: 135,
    release_date: '2026-11-15',
    rating: 8.4,
    genres: ['Action', 'Cyberpunk', 'Sci-Fi'],
    language: 'English',
    age_rating: 'R',
    status: 'draft'
  }
];

export const MOCK_CINEMAS: Cinema[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Colombo City Centre (CCC)',
    address: '137 Sir James Pieris Mawatha',
    city: 'Colombo 02',
    latitude: 6.9177,
    longitude: 79.8546,
    phone: '+94 11 208 3000',
    status: 'active',
    screens: [
      {
        id: 'sc111111-1111-1111-1111-111111111111',
        cinema_id: 'c1111111-1111-1111-1111-111111111111',
        name: 'Screen 1 - Dolby Atmos Luxe',
        screen_number: 1,
        capacity: 48,
        screen_type: 'dolby'
      },
      {
        id: 'sc222222-2222-2222-2222-222222222222',
        cinema_id: 'c1111111-1111-1111-1111-111111111111',
        name: 'Screen 2 - Laser Standard',
        screen_number: 2,
        capacity: 48,
        screen_type: 'standard'
      }
    ]
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Majestic City IMAX',
    address: '10 Station Road, Bambalapitiya',
    city: 'Colombo 04',
    latitude: 6.8942,
    longitude: 79.8553,
    phone: '+94 11 258 1111',
    status: 'active',
    screens: [
      {
        id: 'sc333333-3333-3333-3333-333333333333',
        cinema_id: 'c2222222-2222-2222-2222-222222222222',
        name: 'IMAX Grand Screen',
        screen_number: 1,
        capacity: 48,
        screen_type: 'imax'
      }
    ]
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Liberty Cinema Kollupitiya',
    address: '35 Dharmapala Mawatha',
    city: 'Colombo 03',
    latitude: 6.9114,
    longitude: 79.8519,
    phone: '+94 11 232 5265',
    status: 'active',
    screens: [
      {
        id: 'sc444444-4444-4444-4444-444444444444',
        cinema_id: 'c3333333-3333-3333-3333-333333333333',
        name: 'Liberty Lite Hall',
        screen_number: 1,
        capacity: 48,
        screen_type: 'standard'
      }
    ]
  }
];

export const MOCK_SHOWS: Show[] = [
  {
    id: 'sh111111-1111-1111-1111-111111111111',
    movie_id: 'm1111111-1111-1111-1111-111111111111',
    cinema_id: 'c1111111-1111-1111-1111-111111111111',
    screen_id: 'sc111111-1111-1111-1111-111111111111',
    start_time: new Date(Date.now() + 3600 * 1000 * 4).toISOString(), // 4 hours from now
    end_time: new Date(Date.now() + 3600 * 1000 * 6.5).toISOString(),
    price_standard: 1200,
    price_premium: 1800,
    price_vip: 2500,
    status: 'scheduled',
    movie: MOCK_MOVIES[0],
    cinema: MOCK_CINEMAS[0],
    screen: MOCK_CINEMAS[0].screens?.[0]
  },
  {
    id: 'sh222222-2222-2222-2222-222222222222',
    movie_id: 'm1111111-1111-1111-1111-111111111111',
    cinema_id: 'c1111111-1111-1111-1111-111111111111',
    screen_id: 'sc111111-1111-1111-1111-111111111111',
    start_time: new Date(Date.now() + 3600 * 1000 * 8).toISOString(), // 8 hours from now
    end_time: new Date(Date.now() + 3600 * 1000 * 10.5).toISOString(),
    price_standard: 1200,
    price_premium: 1800,
    price_vip: 2500,
    status: 'scheduled',
    movie: MOCK_MOVIES[0],
    cinema: MOCK_CINEMAS[0],
    screen: MOCK_CINEMAS[0].screens?.[0]
  },
  {
    id: 'sh333333-3333-3333-3333-333333333333',
    movie_id: 'm2222222-2222-2222-2222-222222222222',
    cinema_id: 'c2222222-2222-2222-2222-222222222222',
    screen_id: 'sc333333-3333-3333-3333-333333333333',
    start_time: new Date(Date.now() + 3600 * 1000 * 5).toISOString(),
    end_time: new Date(Date.now() + 3600 * 1000 * 8).toISOString(),
    price_standard: 1500,
    price_premium: 2200,
    price_vip: 3000,
    status: 'scheduled',
    movie: MOCK_MOVIES[1],
    cinema: MOCK_CINEMAS[1],
    screen: MOCK_CINEMAS[1].screens?.[0]
  },
  {
    id: 'sh444444-4444-4444-4444-444444444444',
    movie_id: 'm3333333-3333-3333-3333-333333333333',
    cinema_id: 'c1111111-1111-1111-1111-111111111111',
    screen_id: 'sc222222-2222-2222-2222-222222222222',
    start_time: new Date(Date.now() + 3600 * 1000 * 6).toISOString(),
    end_time: new Date(Date.now() + 3600 * 1000 * 9).toISOString(),
    price_standard: 1200,
    price_premium: 1800,
    price_vip: 2500,
    status: 'scheduled',
    movie: MOCK_MOVIES[2],
    cinema: MOCK_CINEMAS[0],
    screen: MOCK_CINEMAS[0].screens?.[1]
  }
];

export const MOCK_PROFILES: Profile[] = [
  {
    id: 'u1111111-1111-1111-1111-111111111111',
    email: 'customer@movei.io',
    full_name: 'Alex Mercer',
    role: 'customer'
  },
  {
    id: 'u2222222-2222-2222-2222-222222222222',
    email: 'admin@movei.io',
    full_name: 'Elena Vance (Manager)',
    role: 'admin'
  },
  {
    id: 'u3333333-3333-3333-3333-333333333333',
    email: 'scanner@movei.io',
    full_name: 'Marcus Brody (Gate 1 Staff)',
    role: 'scanner'
  }
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'tk-101',
    booking_id: 'bk-001',
    show_id: 'sh111111-1111-1111-1111-111111111111',
    user_id: 'u1111111-1111-1111-1111-111111111111',
    seat_id: 'st-f5',
    ticket_code: 'MOV-INCEPT-01',
    barcode_value: 'MOV-INCEPT-01',
    status: 'confirmed',
    seat: {
      id: 'st-f5',
      screen_id: 'sc111111-1111-1111-1111-111111111111',
      row_label: 'F',
      seat_number: 5,
      seat_type: 'premium',
      x_position: 5,
      y_position: 6,
      is_active: true
    },
    show: MOCK_SHOWS[0],
    created_at: new Date().toISOString()
  },
  {
    id: 'tk-102',
    booking_id: 'bk-001',
    show_id: 'sh111111-1111-1111-1111-111111111111',
    user_id: 'u1111111-1111-1111-1111-111111111111',
    seat_id: 'st-f6',
    ticket_code: 'MOV-INCEPT-02',
    barcode_value: 'MOV-INCEPT-02',
    status: 'confirmed',
    seat: {
      id: 'st-f6',
      screen_id: 'sc111111-1111-1111-1111-111111111111',
      row_label: 'F',
      seat_number: 6,
      seat_type: 'premium',
      x_position: 6,
      y_position: 6,
      is_active: true
    },
    show: MOCK_SHOWS[0],
    created_at: new Date().toISOString()
  },
  {
    id: 'tk-103',
    booking_id: 'bk-002',
    show_id: 'sh333333-3333-3333-3333-333333333333',
    user_id: 'u1111111-1111-1111-1111-111111111111',
    seat_id: 'st-d8',
    ticket_code: 'MOV-DUNE-88',
    barcode_value: 'MOV-DUNE-88',
    status: 'used',
    scanned_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    seat: {
      id: 'st-d8',
      screen_id: 'sc333333-3333-3333-3333-333333333333',
      row_label: 'D',
      seat_number: 8,
      seat_type: 'vip',
      x_position: 8,
      y_position: 4,
      is_active: true
    },
    show: MOCK_SHOWS[2],
    created_at: new Date(Date.now() - 3600 * 1000 * 25).toISOString()
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk-001',
    user_id: 'u1111111-1111-1111-1111-111111111111',
    show_id: 'sh111111-1111-1111-1111-111111111111',
    booking_reference: 'MOV-INCEPT-982',
    total_amount: 3600,
    currency: 'LKR',
    status: 'confirmed',
    created_at: new Date().toISOString(),
    show: MOCK_SHOWS[0],
    tickets: [MOCK_TICKETS[0], MOCK_TICKETS[1]]
  },
  {
    id: 'bk-002',
    user_id: 'u1111111-1111-1111-1111-111111111111',
    show_id: 'sh333333-3333-3333-3333-333333333333',
    booking_reference: 'MOV-DUNE2-441',
    total_amount: 3000,
    currency: 'LKR',
    status: 'completed',
    created_at: new Date(Date.now() - 3600 * 1000 * 25).toISOString(),
    show: MOCK_SHOWS[2],
    tickets: [MOCK_TICKETS[2]]
  }
];
