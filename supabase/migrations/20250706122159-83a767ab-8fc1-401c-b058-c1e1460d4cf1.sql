
-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  experience TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  image_url TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  about TEXT NOT NULL,
  education TEXT[] NOT NULL,
  consultation_fee INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create available_slots table
CREATE TABLE public.available_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(doctor_id, slot_date, slot_time)
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  slot_id UUID REFERENCES public.available_slots(id) ON DELETE CASCADE NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.available_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories (public read)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

-- Create RLS policies for doctors (public read)
CREATE POLICY "Anyone can view doctors" ON public.doctors FOR SELECT USING (true);

-- Create RLS policies for available_slots (public read)
CREATE POLICY "Anyone can view available slots" ON public.available_slots FOR SELECT USING (true);
CREATE POLICY "System can update available slots" ON public.available_slots FOR UPDATE USING (true);

-- Create RLS policies for appointments (users can only see their own)
CREATE POLICY "Users can view their own appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own appointments" ON public.appointments FOR UPDATE USING (auth.uid() = user_id);

-- Insert categories
INSERT INTO public.categories (name, icon) VALUES
  ('Cardiologist', 'Heart'),
  ('Surgeon', 'Activity'),
  ('Psychiatrist', 'Brain'),
  ('ENT Specialist', 'Stethoscope'),
  ('Ophthalmologist', 'Eye');

-- Insert Indian doctors with proper Indian photos and details
INSERT INTO public.doctors (name, specialization, category_id, experience, rating, image_url, location, phone, email, about, education, consultation_fee) VALUES
  ('Dr. Priya Sharma', 'Cardiologist', (SELECT id FROM public.categories WHERE name = 'Cardiologist'), '15 years', 4.9, 'https://images.unsplash.com/photo-1594824804732-ca0916aa2cbc?w=400&h=400&fit=crop&crop=face', 'Apollo Hospital, New Delhi', '+91 9876543210', 'dr.priya.sharma@apollo.com', 'Dr. Priya Sharma is a renowned cardiologist with over 15 years of experience in treating cardiovascular diseases. She specializes in preventive cardiology, heart failure management, and interventional procedures.', ARRAY['MBBS - All India Institute of Medical Sciences (AIIMS), New Delhi', 'MD Cardiology - Post Graduate Institute of Medical Education and Research (PGIMER), Chandigarh', 'Fellowship in Interventional Cardiology - Fortis Escorts Heart Institute, New Delhi'], 800),
  
  ('Dr. Rajesh Kumar', 'Surgeon', (SELECT id FROM public.categories WHERE name = 'Surgeon'), '20 years', 4.8, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face', 'Max Super Speciality Hospital, Gurgaon', '+91 9876543211', 'dr.rajesh.kumar@maxhealthcare.com', 'Dr. Rajesh Kumar is a highly experienced general surgeon with expertise in laparoscopic and robotic surgery. He has performed over 5000 successful surgeries.', ARRAY['MBBS - King Georges Medical University, Lucknow', 'MS General Surgery - Sanjay Gandhi Postgraduate Institute of Medical Sciences, Lucknow', 'Fellowship in Minimal Access Surgery - Sir Ganga Ram Hospital, New Delhi'], 1200),
  
  ('Dr. Anita Gupta', 'Psychiatrist', (SELECT id FROM public.categories WHERE name = 'Psychiatrist'), '12 years', 4.9, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face', 'Fortis Hospital, Bangalore', '+91 9876543212', 'dr.anita.gupta@fortis.com', 'Dr. Anita Gupta is a leading psychiatrist specializing in anxiety disorders, depression, and cognitive behavioral therapy. She has helped thousands of patients achieve mental wellness.', ARRAY['MBBS - Maulana Azad Medical College, New Delhi', 'MD Psychiatry - Institute of Human Behaviour and Allied Sciences (IHBAS), New Delhi', 'Fellowship in Child and Adolescent Psychiatry - NIMHANS, Bangalore'], 900),
  
  ('Dr. Arjun Singh', 'ENT Specialist', (SELECT id FROM public.categories WHERE name = 'ENT Specialist'), '18 years', 4.7, 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face', 'Medanta - The Medicity, Gurgaon', '+91 9876543213', 'dr.arjun.singh@medanta.org', 'Dr. Arjun Singh is an experienced ENT specialist with expertise in endoscopic sinus surgery, cochlear implants, and head & neck oncology.', ARRAY['MBBS - Government Medical College, Patiala', 'MS ENT - Postgraduate Institute of Medical Education and Research (PGIMER), Chandigarh', 'Fellowship in Head and Neck Surgery - Tata Memorial Hospital, Mumbai'], 700),
  
  ('Dr. Kavita Patel', 'Ophthalmologist', (SELECT id FROM public.categories WHERE name = 'Ophthalmologist'), '14 years', 4.8, 'https://images.unsplash.com/photo-1594824804732-ca0916aa2cbc?w=400&h=400&fit=crop&crop=face', 'L V Prasad Eye Institute, Hyderabad', '+91 9876543214', 'dr.kavita.patel@lvpei.org', 'Dr. Kavita Patel is a skilled ophthalmologist specializing in cataract surgery, retinal diseases, and corneal transplantation.', ARRAY['MBBS - Grant Government Medical College, Mumbai', 'MS Ophthalmology - Sankara Nethralaya, Chennai', 'Fellowship in Vitreo-Retinal Surgery - Aravind Eye Care System, Madurai'], 750),
  
  ('Dr. Vikram Mehta', 'Cardiologist', (SELECT id FROM public.categories WHERE name = 'Cardiologist'), '22 years', 4.9, 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face', 'Narayana Health, Bangalore', '+91 9876543215', 'dr.vikram.mehta@narayanahealth.org', 'Dr. Vikram Mehta is a senior cardiologist and interventional cardiologist with over two decades of experience in complex cardiac procedures.', ARRAY['MBBS - Armed Forces Medical College, Pune', 'MD Cardiology - All India Institute of Medical Sciences (AIIMS), New Delhi', 'Fellowship in Interventional Cardiology - Escorts Heart Institute, New Delhi'], 1000);

-- Insert available slots for doctors
INSERT INTO public.available_slots (doctor_id, slot_date, slot_time, is_available) VALUES
  -- Dr. Priya Sharma slots
  ((SELECT id FROM public.doctors WHERE name = 'Dr. Priya Sharma'), CURRENT_DATE, '14:00:00', true),
  ((SELECT id FROM public.doctors WHERE name = 'Dr. Priya Sharma'), CURRENT_DATE, '15:30:00', true),
  ((SELECT id FROM public.doctors WHERE name = 'Dr. Priya Sharma'), CURRENT_DATE, '17:00:00', false),
  ((SELECT id FROM public.doctors WHERE name = 'Dr. Priya Sharma'), CURRENT_DATE + 1, '09:00:00', true),
  ((SELECT id FROM public.doctors WHERE name = 'Dr. Priya Sharma'), CURRENT_DATE + 1, '10:30:00', true),
  ((SELECT id FROM public.doctors WHERE name = 'Dr. Priya Sharma'), CURRENT_DATE + 1, '14:00:00', true),
  
  -- Dr. Rajesh Kumar slots
  ((SELECT id FROM public.doctors WHERE name = 'Dr. Rajesh Kumar'), CURRENT_DATE + 1, '10:00:00', true),
  ((SELECT id FROM public.doctors WHERE name = 'Dr. Rajesh Kumar'), CURRENT_DATE + 1, '14:00:00', true),
  
  -- Dr. Anita Gupta slots
  ((SELECT id FROM public.doctors WHERE name = 'Dr. Anita Gupta'), CURRENT_DATE, '16:00:00', true),
  ((SELECT id FROM public.doctors WHERE name = 'Dr. Anita Gupta'), CURRENT_DATE + 1, '11:00:00', true),
  
  -- Dr. Arjun Singh slots
  ((SELECT id FROM public.doctors WHERE name = 'Dr. Arjun Singh'), CURRENT_DATE + 2, '09:00:00', true),
  ((SELECT id FROM public.doctors WHERE name = 'Dr. Arjun Singh'), CURRENT_DATE + 2, '14:30:00', true),
  
  -- Dr. Kavita Patel slots
  ((SELECT id FROM public.doctors WHERE name = 'Dr. Kavita Patel'), CURRENT_DATE + 1, '14:30:00', true),
  ((SELECT id FROM public.doctors WHERE name = 'Dr. Kavita Patel'), CURRENT_DATE + 2, '10:00:00', true),
  
  -- Dr. Vikram Mehta slots
  ((SELECT id FROM public.doctors WHERE name = 'Dr. Vikram Mehta'), CURRENT_DATE, '18:00:00', true),
  ((SELECT id FROM public.doctors WHERE name = 'Dr. Vikram Mehta'), CURRENT_DATE + 1, '16:00:00', true);
