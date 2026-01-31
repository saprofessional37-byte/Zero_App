/*
  # Create Users Table for Zero App

  ## Overview
  Creates the users table to store user profiles from the onboarding process.
  Integrates with Clerk authentication using Clerk User ID as the primary key.

  ## New Tables
  - `users`
    - `id` (text, primary key) - Clerk User ID
    - `age_bracket` (text) - User's age range
    - `location_type` (text) - Geographic location type
    - `employment_status` (text) - Current employment situation
    - `capital_available` (text) - Available capital for business
    - `monthly_runway` (text) - Months of financial runway
    - `weekly_hours` (text) - Available hours per week
    - `skill_type` (text) - Primary marketable skill
    - `past_attempts` (text) - Number of previous business attempts
    - `biggest_failure` (text) - Description of biggest failure
    - `why_now` (text) - Reason for starting now
    - `commitment` (text) - Commitment level
    - `created_at` (timestamptz) - Record creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable Row Level Security (RLS)
  - Users can only access their own profile data
  - SELECT, INSERT, and UPDATE policies based on Clerk JWT token
  - auth.uid()::text is used to compare with Clerk user ID

  ## Notes
  - The `id` field stores the Clerk User ID (not a UUID)
  - RLS policies cast auth.uid() to text for comparison
  - Users must configure a "supabase" JWT template in Clerk Dashboard with sub claim
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  age_bracket text NOT NULL,
  location_type text NOT NULL,
  employment_status text NOT NULL,
  capital_available text NOT NULL,
  monthly_runway text NOT NULL,
  weekly_hours text NOT NULL,
  skill_type text NOT NULL,
  past_attempts text NOT NULL,
  biggest_failure text NOT NULL,
  why_now text NOT NULL,
  commitment text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);