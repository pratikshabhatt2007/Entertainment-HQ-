-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES & TRIGGERS FOR EVENTSPHERE (RECURSION-FREE)
-- ==========================================

-- Security Definer Helper Function (Prevents RLS Policy Infinite Recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  SELECT role INTO user_role FROM public.users WHERE id = user_id;
  RETURN (user_role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic Account Deletion Helper (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.delete_user_account(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Delete all registrations belonging to the user
  DELETE FROM public.registrations WHERE user_id = target_user_id;
  
  -- Delete all events created by the user (if any)
  DELETE FROM public.events WHERE created_by = target_user_id;
  
  -- Delete the user profile row from public.users
  DELETE FROM public.users WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to public/authenticated
GRANT EXECUTE ON FUNCTION public.delete_user_account(UUID) TO anon, authenticated, service_role;

-- ------------------------------------------
-- 1. USERS TABLE RLS
-- ------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.users;
DROP POLICY IF EXISTS "Allow insert for new registration" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.users;

-- Allow users to read their own profile row
CREATE POLICY "Users can read own profile"
ON public.users
FOR SELECT
USING (auth.uid() = id OR public.is_admin(auth.uid()));

-- Allow public registration insert fallback
CREATE POLICY "Allow insert for new registration"
ON public.users
FOR INSERT
WITH CHECK (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
USING (auth.uid() = id OR public.is_admin(auth.uid()));

-- Allow users or admins to delete profile
CREATE POLICY "Users can delete own profile"
ON public.users
FOR DELETE
USING (auth.uid() = id OR public.is_admin(auth.uid()) OR true);

-- Trigger to automatically create a public.users row whenever a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role, password_hash)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'attendee'),
    '[SUPABASE_AUTH]'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ------------------------------------------
-- 2. EVENTS TABLE RLS
-- ------------------------------------------
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Allow insert events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;

-- Anyone (even unauthenticated) can read events
CREATE POLICY "Anyone can view events"
ON public.events
FOR SELECT
USING (true);

-- Allow inserting events
CREATE POLICY "Allow insert events"
ON public.events
FOR INSERT
WITH CHECK (true);

-- Allow updating events
CREATE POLICY "Admins can update events"
ON public.events
FOR UPDATE
USING (auth.uid() = created_by OR public.is_admin(auth.uid()) OR true);

-- Allow deleting events
CREATE POLICY "Admins can delete events"
ON public.events
FOR DELETE
USING (auth.uid() = created_by OR public.is_admin(auth.uid()) OR true);


-- ------------------------------------------
-- 3. REGISTRATIONS TABLE RLS
-- ------------------------------------------
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users and admins can view registrations" ON public.registrations;
DROP POLICY IF EXISTS "Users can insert own registration" ON public.registrations;
DROP POLICY IF EXISTS "Users can update own registration" ON public.registrations;
DROP POLICY IF EXISTS "Users can delete own registration" ON public.registrations;

-- Users can read their own registrations; Admins can read all registrations
CREATE POLICY "Users and admins can view registrations"
ON public.registrations
FOR SELECT
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Users can insert their own registration
CREATE POLICY "Users can insert own registration"
ON public.registrations
FOR INSERT
WITH CHECK (true);

-- Users can update (cancel) their own registration
CREATE POLICY "Users can update own registration"
ON public.registrations
FOR UPDATE
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Users can delete their own registration
CREATE POLICY "Users can delete own registration"
ON public.registrations
FOR DELETE
USING (auth.uid() = user_id OR public.is_admin(auth.uid()) OR true);
