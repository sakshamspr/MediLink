
-- Update doctor images with completely unique Unsplash URLs
UPDATE public.doctors 
SET image_url = 'https://images.unsplash.com/photo-1594824475180-29c25753d4b2?w=400&h=400&fit=crop&crop=face'
WHERE name = 'Dr. Priya Sharma';

UPDATE public.doctors 
SET image_url = 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop&crop=face'
WHERE name = 'Dr. Kavita Patel';

UPDATE public.doctors 
SET image_url = 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face'
WHERE name = 'Dr. Vikram Mehta';
