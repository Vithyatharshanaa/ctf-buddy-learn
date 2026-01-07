-- Create enum for challenge categories
CREATE TYPE public.challenge_category AS ENUM ('web', 'crypto', 'forensics', 'linux', 'reverse');

-- Create enum for difficulty levels
CREATE TYPE public.difficulty_level AS ENUM ('easy', 'medium', 'hard');

-- Create challenges table
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category challenge_category NOT NULL,
  difficulty difficulty_level NOT NULL,
  points INTEGER NOT NULL DEFAULT 100,
  flag TEXT NOT NULL,
  hint TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_solves table to track completed challenges
CREATE TABLE public.user_solves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  solved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_solves ENABLE ROW LEVEL SECURITY;

-- RLS policies for challenges (public read, no public write)
CREATE POLICY "Challenges are viewable by everyone" 
ON public.challenges FOR SELECT USING (true);

-- RLS policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS policies for user_solves
CREATE POLICY "Users can view own solves" 
ON public.user_solves FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own solves" 
ON public.user_solves FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data ->> 'username');
  RETURN new;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update user points when they solve a challenge
CREATE OR REPLACE FUNCTION public.update_user_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  challenge_points INTEGER;
BEGIN
  SELECT points INTO challenge_points FROM public.challenges WHERE id = NEW.challenge_id;
  UPDATE public.profiles SET total_points = total_points + challenge_points, updated_at = now()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- Trigger to update points on solve
CREATE TRIGGER on_challenge_solved
  AFTER INSERT ON public.user_solves
  FOR EACH ROW EXECUTE FUNCTION public.update_user_points();

-- Insert sample challenges (flags are server-side only, never exposed to frontend)
INSERT INTO public.challenges (title, description, category, difficulty, points, flag, hint) VALUES
('Hello Web', 'Your first web challenge! Inspect the page source and find the hidden flag.', 'web', 'easy', 50, 'CTF{w3lc0m3_t0_w3b}', 'Right-click and view page source'),
('Base64 Basics', 'Decode this message: Q1RGe2I0czM2NF9pc19mdW59', 'crypto', 'easy', 50, 'CTF{b4s364_is_fun}', 'This encoding uses A-Z, a-z, 0-9, + and /'),
('Hidden in Plain Sight', 'A secret message was hidden in this image metadata. The flag is: CTF{m3t4d4t4_m4st3r}', 'forensics', 'easy', 75, 'CTF{m3t4d4t4_m4st3r}', 'EXIF data can hide secrets'),
('Linux Permissions', 'What command shows file permissions in Linux? Answer format: CTF{command}', 'linux', 'easy', 50, 'CTF{ls -l}', 'Think about listing files with details'),
('Simple XOR', 'XOR each character of "DUG" with key 7. Format: CTF{result}', 'crypto', 'medium', 100, 'CTF{CAB}', 'XOR is its own inverse'),
('Cookie Monster', 'Websites store session data in cookies. Find the flag stored in document.cookie on a vulnerable site. Flag: CTF{c00k13_j4r}', 'web', 'medium', 100, 'CTF{c00k13_j4r}', 'Check your browser developer tools'),
('File Carving', 'Multiple files can be hidden inside one. This is called file carving. Flag: CTF{f1l3_c4rv1ng}', 'forensics', 'medium', 125, 'CTF{f1l3_c4rv1ng}', 'Tools like binwalk help here'),
('Find the Process', 'What command lists running processes in Linux? Format: CTF{command}', 'linux', 'easy', 50, 'CTF{ps}', 'Think process status'),
('ROT13 Cipher', 'Decode: PGS{e0g4g10a_1f_sha}', 'crypto', 'easy', 50, 'CTF{r0t4t10n_1s_fun}', 'Each letter shifts by 13 positions'),
('SQL Injection Intro', 'SQL injection lets you manipulate database queries. The classic test is: '' OR 1=1 --. Flag: CTF{sql_1nj3ct10n}', 'web', 'medium', 100, 'CTF{sql_1nj3ct10n}', 'Single quotes break query syntax'),
('Reverse the Binary', 'Sometimes you need to look at compiled code backwards. Flag: CTF{r3v3rs3_3ng1n33r1ng}', 'reverse', 'medium', 125, 'CTF{r3v3rs3_3ng1n33r1ng}', 'Disassemblers are your friend'),
('Network Capture', 'Wireshark can capture network traffic. Flag: CTF{p4ck3t_sn1ff3r}', 'forensics', 'medium', 100, 'CTF{p4ck3t_sn1ff3r}', 'PCAP files store network data');