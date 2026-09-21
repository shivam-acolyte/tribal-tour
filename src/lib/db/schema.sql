-- ============================================================
-- Tribal Discovery Tour – PostgreSQL Schema
-- Run once: psql -U postgres -d tribal_tours -f schema.sql
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ────────────────────────────────────────────
-- ADMINS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id         SERIAL PRIMARY KEY,
  username   TEXT UNIQUE NOT NULL,
  password   TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default admin: username=admin, password=tribal2024
INSERT INTO admins (username, password)
VALUES ('admin', 'tribal2024')
ON CONFLICT (username) DO NOTHING;

-- ────────────────────────────────────────────
-- TOURS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tours (
  slug            TEXT PRIMARY KEY,
  name            TEXT        NOT NULL,
  location        TEXT,
  duration        TEXT,
  price           NUMERIC     DEFAULT 0,
  original_price  NUMERIC     DEFAULT 0,
  rating          NUMERIC     DEFAULT 4.5,
  review_count    INT         DEFAULT 0,
  is_hidden       BOOLEAN     DEFAULT FALSE,
  image           TEXT,
  images          JSONB       DEFAULT '[]',
  badge           TEXT,
  category        TEXT,
  group_size      TEXT,
  description     TEXT,
  highlights      JSONB       DEFAULT '[]',
  included        JSONB       DEFAULT '[]',
  excluded        JSONB       DEFAULT '[]',
  itinerary       JSONB       DEFAULT '[]',
  reviews         JSONB       DEFAULT '[]',
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- BLOGS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blogs (
  slug            TEXT PRIMARY KEY,
  title           TEXT        NOT NULL,
  excerpt         TEXT,
  content         TEXT,
  image           TEXT,
  category        TEXT        DEFAULT 'Destinations',
  author          TEXT,
  author_image    TEXT,
  author_bio      TEXT,
  date            TEXT,
  read_time       TEXT,
  is_hidden       BOOLEAN     DEFAULT FALSE,
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- LEADS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT,
  email      TEXT,
  phone      TEXT,
  subject    TEXT,
  message    TEXT,
  status     TEXT        DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- IMAGES (uploaded via /api/upload)
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS images (
  id         SERIAL PRIMARY KEY,
  url        TEXT        NOT NULL,
  folder     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
