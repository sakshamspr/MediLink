
-- Remove the foreign key constraint that's causing the error
ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_user_id_fkey;

-- The appointments table can now accept any UUID in the user_id field
-- This allows both authenticated users (with real user IDs) and anonymous users (with generated UUIDs)
