-- Profiles table (Unified naming as used in the backend)
CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  discord_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar TEXT,
  email TEXT,
  trial_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Memberships table
CREATE TABLE IF NOT EXISTS memberships (
  id SERIAL PRIMARY KEY,
  discord_id TEXT UNIQUE NOT NULL REFERENCES profiles(discord_id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free_trial', 'weekly', 'monthly', 'lifetime')),
  status TEXT NOT NULL DEFAULT 'active', -- active, cancelled, expired, trial
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);



-- Sessions table for connect-pg-simple
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
) WITH (OIDS=FALSE);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
