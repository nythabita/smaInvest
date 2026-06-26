-- Jalankan script SQL ini di SQL Editor Supabase untuk membuat tabel user_profiles

CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  role_title TEXT DEFAULT 'Siswa Investor',
  total_xp INTEGER DEFAULT 0,
  achievements JSONB DEFAULT '[]'::jsonb,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mengaktifkan Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING ( auth.uid() = id );

-- Policy: Users can insert their own profile (saat registrasi)
CREATE POLICY "Users can insert own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK ( auth.uid() = id );

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING ( auth.uid() = id );
