
-- Swap Dr. Kavita's current photo to Dr. Rajesh Kumar and get a new photo for Dr. Kavita
UPDATE public.doctors 
SET image_url = 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face'
WHERE name = 'Dr. Rajesh Kumar';

UPDATE public.doctors 
SET image_url = 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop&crop=face'
WHERE name = 'Dr. Kavita Patel';
