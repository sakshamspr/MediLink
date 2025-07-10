
-- Update existing available slots to use current and future dates
-- This will make the slots appear as available from today onwards

-- Update slots that were set for CURRENT_DATE to today
UPDATE public.available_slots 
SET slot_date = CURRENT_DATE 
WHERE slot_date < CURRENT_DATE;

-- Update slots that were set for CURRENT_DATE + 1 to tomorrow
UPDATE public.available_slots 
SET slot_date = CURRENT_DATE + 1 
WHERE slot_date = (SELECT MIN(slot_date) FROM public.available_slots WHERE slot_date > CURRENT_DATE);

-- Update remaining old slots to be distributed across the next few days
UPDATE public.available_slots 
SET slot_date = CURRENT_DATE + 2 
WHERE slot_date < CURRENT_DATE OR slot_date = (SELECT MIN(slot_date) FROM public.available_slots WHERE slot_date > CURRENT_DATE + 1);

-- Add some additional slots for the next few days to ensure good availability
INSERT INTO public.available_slots (doctor_id, slot_date, slot_time, is_available) 
SELECT 
  id as doctor_id,
  CURRENT_DATE + (CASE 
    WHEN row_number() OVER (ORDER BY id) % 3 = 1 THEN 0
    WHEN row_number() OVER (ORDER BY id) % 3 = 2 THEN 1  
    ELSE 2
  END) as slot_date,
  (ARRAY['09:00:00', '14:00:00', '16:00:00'])[((row_number() OVER (ORDER BY id) - 1) % 3) + 1]::time as slot_time,
  true as is_available
FROM public.doctors 
WHERE id NOT IN (
  SELECT DISTINCT doctor_id FROM public.available_slots 
  WHERE slot_date >= CURRENT_DATE
)
LIMIT 20;
