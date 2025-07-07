
-- Update doctor images with the uploaded images
UPDATE public.doctors 
SET image_url = '/lovable-uploads/fead3cfe-ffcb-4a10-ba31-71d4558b323f.png'
WHERE name = 'Dr. Priya Sharma';

UPDATE public.doctors 
SET image_url = '/lovable-uploads/0c5b9ede-f32a-4bb8-9e95-d178f7f6404a.png'
WHERE name = 'Dr. Kavita Patel';

UPDATE public.doctors 
SET image_url = '/lovable-uploads/92c1d4bc-4416-496a-a38d-a5a54b903662.png'
WHERE name = 'Dr. Vikram Mehta';
