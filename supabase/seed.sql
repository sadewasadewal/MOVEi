-- seed.sql
-- Realistic seed data for MOVEI platform

-- 1. Cinemas
INSERT INTO public.cinemas (id, name, address, city, phone, logo_url, status)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Cinemax Colombo', '125 Galle Road, Colombo 03', 'Colombo', '+94 11 234 5678', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400', 'active'),
    ('22222222-2222-2222-2222-222222222222', 'Scope Cinemas', 'Colombo City Centre, Sir Chittampalam A Gardiner Mawatha', 'Colombo', '+94 11 765 4321', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400', 'active'),
    ('33333333-3333-3333-3333-333333333333', 'Majestic City', '10 Station Road, Bambalapitiya', 'Colombo', '+94 11 258 9632', 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=400', 'active')
ON CONFLICT (id) DO NOTHING;

-- 2. Screens
INSERT INTO public.screens (id, cinema_id, name, screen_number, capacity, screen_type)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Screen 01 (Dolby Atmos)', 1, 30, 'dolby'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Screen 04 (IMAX Laser)', 4, 30, 'imax'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Screen 02', 2, 30, 'standard')
ON CONFLICT (id) DO NOTHING;

-- 3. Seats (Rows A through E, Seats 1 to 6)
DO $$
DECLARE
    v_screen_id UUID;
    v_row TEXT;
    v_num INT;
    v_type seat_type;
BEGIN
    FOR v_screen_id IN SELECT id FROM public.screens LOOP
        FOREACH v_row IN ARRAY ARRAY['A', 'B', 'C', 'D', 'E'] LOOP
            FOR v_num IN 1..6 LOOP
                IF v_row IN ('D', 'E') THEN
                    v_type := 'vip';
                ELSIF v_row = 'C' THEN
                    v_type := 'premium';
                ELSE
                    v_type := 'standard';
                END IF;

                INSERT INTO public.seats (screen_id, row_label, seat_number, seat_type, x_position, y_position)
                VALUES (v_screen_id, v_row, v_num, v_type, v_num, ascii(v_row) - 64)
                ON CONFLICT (screen_id, row_label, seat_number) DO NOTHING;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

-- 4. Movies
INSERT INTO public.movies (id, title, slug, tagline, description, poster_url, backdrop_url, runtime_minutes, release_date, rating, genres, status)
VALUES
    (
        '44444444-4444-4444-4444-444444444444',
        'Wicked',
        'wicked',
        'Everyone deserves the chance to fly.',
        'Elphaba, an ostracized but gifted young woman, forms an unlikely bond with Glinda, an ambitious, popular young woman.',
        'https://image.tmdb.org/t/p/w780/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg',
        'https://image.tmdb.org/t/p/w1280/uKb22E5ww9bX9rgZIk5GqK52vKn.jpg',
        160,
        '2024-11-22',
        8.1,
        ARRAY['Fantasy', 'Musical', 'Romance'],
        'published'
    ),
    (
        '55555555-5555-5555-5555-555555555555',
        'Spider-Man: Brand New Day',
        'brand-new-day',
        'A fresh dawn rises over New York.',
        'Peter Parker embarks on a completely new path with fresh challenges facing him across Manhattan.',
        'https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
        'https://image.tmdb.org/t/p/w1280/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
        148,
        '2025-07-15',
        8.6,
        ARRAY['Action', 'Adventure', 'Sci-Fi'],
        'published'
    ),
    (
        '66666666-6666-6666-6666-666666666666',
        'Oppenheimer',
        'oppenheimer',
        'The world forever changes.',
        'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
        'https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        'https://image.tmdb.org/t/p/w1280/fm6K9vYQ7jBXrLfDXYMG9DfqCIq.jpg',
        180,
        '2023-07-21',
        8.9,
        ARRAY['Biography', 'Drama', 'History'],
        'published'
    ),
    (
        '77777777-7777-7777-7777-777777777777',
        'Interstellar',
        'interstellar',
        'Mankind was born on Earth. It was never meant to die here.',
        'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked with piloting a spacecraft.',
        'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
        169,
        '2014-11-07',
        8.7,
        ARRAY['Adventure', 'Drama', 'Sci-Fi'],
        'published'
    ),
    (
        '88888888-8888-8888-8888-888888888888',
        'Barbie',
        'barbie',
        'She''s everything. He''s just Ken.',
        'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.',
        'https://image.tmdb.org/t/p/w780/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
        'https://image.tmdb.org/t/p/w1280/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg',
        114,
        '2023-07-21',
        7.2,
        ARRAY['Comedy', 'Adventure', 'Fantasy'],
        'published'
    ),
    (
        '99999999-9999-9999-9999-999999999999',
        'The Batman',
        'the-batman',
        'Unmask the truth.',
        'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family.',
        'https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg',
        'https://image.tmdb.org/t/p/w1280/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
        176,
        '2022-03-04',
        7.8,
        ARRAY['Action', 'Crime', 'Drama'],
        'published'
    )
ON CONFLICT (id) DO NOTHING;

-- 5. Shows
INSERT INTO public.shows (id, movie_id, cinema_id, screen_id, start_time, end_time, price_standard, price_premium, price_vip, status)
VALUES
    (
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        '44444444-4444-4444-4444-444444444444', -- Wicked
        '11111111-1111-1111-1111-111111111111', -- Cinemax Colombo
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', -- Screen 04
        NOW() + INTERVAL '1 day' + INTERVAL '3 hours',
        NOW() + INTERVAL '1 day' + INTERVAL '5 hours 40 minutes',
        1000.00, 1500.00, 2000.00,
        'scheduled'
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        '55555555-5555-5555-5555-555555555555', -- Spider-Man
        '22222222-2222-2222-2222-222222222222', -- Scope Cinemas
        'cccccccc-cccc-cccc-cccc-cccccccccccc', -- Screen 02
        NOW() + INTERVAL '1 day' + INTERVAL '6 hours',
        NOW() + INTERVAL '1 day' + INTERVAL '8 hours 30 minutes',
        1200.00, 1600.00, 2200.00,
        'scheduled'
    )
ON CONFLICT (id) DO NOTHING;
