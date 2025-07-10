
-- First, let's reverse the previous migration by removing the added slots
DELETE FROM public.available_slots 
WHERE created_at > '2025-07-10 19:56:00';

-- Reset all existing slots to use a simple pattern based on current date
-- This will make all slots appear for today, tomorrow, and day after tomorrow
WITH doctor_slots AS (
  SELECT DISTINCT doctor_id, slot_time 
  FROM public.available_slots
)
UPDATE public.available_slots 
SET slot_date = CURRENT_DATE + (CASE 
  WHEN slot_time < '12:00:00' THEN 0  -- Morning slots for today
  WHEN slot_time < '16:00:00' THEN 1  -- Afternoon slots for tomorrow  
  ELSE 2                              -- Evening slots for day after tomorrow
END);

-- Create a simple view that always shows slots for current and next few days
CREATE OR REPLACE VIEW current_available_slots AS
SELECT 
  id,
  doctor_id,
  CURRENT_DATE + (CASE 
    WHEN slot_time < '12:00:00' THEN 0
    WHEN slot_time < '16:00:00' THEN 1
    ELSE 2
  END) as slot_date,
  slot_time,
  is_available,
  created_at
FROM public.available_slots;
