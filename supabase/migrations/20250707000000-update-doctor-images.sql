
-- Update doctor images with the provided Unsplash URLs
UPDATE public.doctors 
SET image_url = 'https://images.unsplash.com/photo-1594824804732-ca0916aa2cbc?w=400&h=400&fit=crop&crop=face'
WHERE name = 'Dr. Priya Sharma';

UPDATE public.doctors 
SET image_url = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face'
WHERE name = 'Dr. Kavita Patel';

UPDATE public.doctors 
SET image_url = 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face'
WHERE name = 'Dr. Vikram Mehta';
