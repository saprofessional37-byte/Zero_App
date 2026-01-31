/*
  # Add Killed Ideas Storage to Users

  1. Changes to Existing Tables
    - `users` table: Add `killed_ideas` column (JSONB array) to store killed idea IDs for filtering
  
  2. Schema Details
    - `killed_ideas`: JSONB array storing simplified killed idea objects with id, title, category
    - Stored for backend filtering only - never exposed to frontend UI
    - Default empty array for new users
  
  3. Purpose
    - Enables backend to filter out previously killed ideas from future generations
    - Maintains scarcity principle: same idea never appears twice
    - Zero UI exposure: users never see the graveyard of killed ideas
  
  4. Important Notes
    - This data is backend-only: it exists to power the filtering logic
    - No migration UI or settings page will display this data
    - The murdered ideas are truly dead from the user's perspective
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'killed_ideas'
  ) THEN
    ALTER TABLE users ADD COLUMN killed_ideas JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;