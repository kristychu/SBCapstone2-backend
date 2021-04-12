CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  profile_img TEXT NOT NULL
);

CREATE TYPE skincare_step AS ENUM (
  'Makeup Remover and Oil Cleanser',
  'Water Based Cleanser',
  'Exfoliator',
  'Toner',
  'Essence',
  'Treatments',
  'Sheet Masks',
  'Eye Cream',
  'Moisturizer',
  'Sun Protection')

CREATE TYPE morning_night AS ENUM ('morning', 'night')

CREATE TABLE step (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25)
    REFERENCES users(username) ON DELETE CASCADE,
  routine_step skincare_step NOT NULL,
  time_of_day morning_night NOT NULL,
  product_id INTEGER NOT NULL,
  UNIQUE (username, time_of_day, routine_step)
);
