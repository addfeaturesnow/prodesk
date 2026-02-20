-- Seed instructors
INSERT INTO instructors (id, name, email, certification) VALUES
(gen_random_uuid(), 'Captain Tom', 'tom@example.com', 'Divemaster'),
(gen_random_uuid(), 'Lisa Chen', 'lisa@example.com', 'Instructor'),
(gen_random_uuid(), 'Marco Rossi', 'marco@example.com', 'Master Instructor');

-- Seed boats
INSERT INTO boats (id, name, capacity) VALUES
(gen_random_uuid(), 'Sea Explorer', 20),
(gen_random_uuid(), 'Ocean Wave', 15),
(gen_random_uuid(), 'Neptune''s Dream', 25);

-- Seed dive sites
INSERT INTO dive_sites (id, name, location, max_depth, difficulty) VALUES
(gen_random_uuid(), 'Blue Coral Gardens', 'North Bay', 25, 'easy'),
(gen_random_uuid(), 'The Wreck', 'Deep Channel', 35, 'moderate'),
(gen_random_uuid(), 'Shark Alley', 'East Point', 40, 'challenging'),
(gen_random_uuid(), 'Cathedral', 'South Ridge', 45, 'expert'),
(gen_random_uuid(), 'Turtle Cove', 'West Beach', 20, 'easy'),
(gen_random_uuid(), 'The Pinnacle', 'Central Banks', 30, 'moderate');
