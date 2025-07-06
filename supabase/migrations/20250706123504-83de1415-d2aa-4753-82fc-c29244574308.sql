
-- Drop the existing RLS policy that requires auth.uid()
DROP POLICY IF EXISTS "Users can create their own appointments" ON public.appointments;

-- Create a new policy that allows both authenticated users and anonymous bookings
CREATE POLICY "Allow appointment creation" ON public.appointments
FOR INSERT 
WITH CHECK (
  -- Allow if user is authenticated and user_id matches auth.uid()
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Allow if user is not authenticated (anonymous booking)
  (auth.uid() IS NULL)
);

-- Also update the select policy to allow viewing appointments
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;

CREATE POLICY "Allow appointment viewing" ON public.appointments
FOR SELECT
USING (
  -- Allow if user is authenticated and user_id matches auth.uid()
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Allow viewing all appointments if user is not authenticated (for now)
  (auth.uid() IS NULL)
);
