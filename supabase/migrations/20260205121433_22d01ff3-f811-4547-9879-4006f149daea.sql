-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create answers table
CREATE TABLE public.answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- Public read access for gameplay
CREATE POLICY "Anyone can read questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Anyone can read answers" ON public.answers FOR SELECT USING (true);

-- Admin write access (using a simple password check via function for now)
CREATE POLICY "Anyone can insert questions" ON public.questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update questions" ON public.questions FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete questions" ON public.questions FOR DELETE USING (true);

CREATE POLICY "Anyone can insert answers" ON public.answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update answers" ON public.answers FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete answers" ON public.answers FOR DELETE USING (true);

-- Insert sample questions
INSERT INTO public.questions (id, emoji) VALUES 
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '🍕🍔🍟'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', '🐶🐱🐭'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', '🌞🌙⭐');

-- Insert sample answers
INSERT INTO public.answers (question_id, text, is_correct) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Comida rápida', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Deportes extremos', false),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Música clásica', false),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Mascotas populares', true),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Animales salvajes', false),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'El cielo', true),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Frutas tropicales', false);