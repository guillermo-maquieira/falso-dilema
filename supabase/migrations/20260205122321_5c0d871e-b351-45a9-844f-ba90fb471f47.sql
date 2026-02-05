-- Create votes table to track user votes per question
CREATE TABLE public.votes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    answer_id UUID NOT NULL REFERENCES public.answers(id) ON DELETE CASCADE,
    voter_id TEXT NOT NULL, -- Anonymous identifier (browser fingerprint/localStorage)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(question_id, voter_id) -- One vote per question per user
);

-- Enable RLS
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Policies for votes
CREATE POLICY "Anyone can read votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert votes" ON public.votes FOR INSERT WITH CHECK (true);

-- Create admin_settings table for password
CREATE TABLE public.admin_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Only allow reading admin settings (password check will be done server-side)
CREATE POLICY "No direct access to admin settings" ON public.admin_settings FOR SELECT USING (false);

-- Insert default admin password (should be changed)
INSERT INTO public.admin_settings (setting_key, setting_value) VALUES ('admin_password', 'falso2024');