
-- Update doctor images with new working Unsplash URLs
UPDATE public.doctors 
SET image_url = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face'
WHERE name = 'Dr. Priya Sharma';

UPDATE public.doctors 
SET image_url = 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face'
WHERE name = 'Dr. Kavita Patel';
