-- ====================================================================
-- PROJECT: ติดไปด้วยกัน by อาตี๋ (INTERVIEW READY)
-- SUPABASE POSTGRESQL DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Programs Table
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    degree_name VARCHAR(255) NOT NULL,
    degree_short VARCHAR(50),
    faculty_name VARCHAR(255) NOT NULL,
    major_name VARCHAR(255),
    category VARCHAR(50) NOT NULL CHECK (category IN ('engineering', 'business', 'arts', 'education', 'health', 'communication')),
    description TEXT NOT NULL,
    image_path TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_programs_slug ON public.programs(slug);
CREATE INDEX IF NOT EXISTS idx_programs_status ON public.programs(status);

-- 3. Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
    id VARCHAR(50) PRIMARY KEY,
    program_slug VARCHAR(100) NOT NULL REFERENCES public.programs(slug) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    category_name_th VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    question_text TEXT NOT NULL,
    hint TEXT,
    follow_up_questions JSONB DEFAULT '[]'::jsonb,
    source_reference TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_program_slug ON public.questions(program_slug);
CREATE INDEX IF NOT EXISTS idx_questions_category ON public.questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_status ON public.questions(status);

-- 4. User Profiles Table (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Admin Roles Table (Strict RBAC protection)
CREATE TABLE IF NOT EXISTS public.admin_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Practice Sessions Table
CREATE TABLE IF NOT EXISTS public.practice_sessions (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_identifier VARCHAR(100),
    is_guest BOOLEAN DEFAULT TRUE,
    program_slug VARCHAR(100) NOT NULL REFERENCES public.programs(slug) ON DELETE CASCADE,
    program_name VARCHAR(255) NOT NULL,
    selected_category VARCHAR(50) DEFAULT 'all',
    selected_difficulty VARCHAR(20) DEFAULT 'all',
    total_questions INT NOT NULL,
    answered_questions INT DEFAULT 0,
    skipped_questions INT DEFAULT 0,
    total_time_spent_seconds INT DEFAULT 0,
    mode VARCHAR(50) DEFAULT 'one_by_one',
    timer_duration_seconds INT DEFAULT 60,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.practice_sessions(status);

-- 7. Practice Answers Table
CREATE TABLE IF NOT EXISTS public.practice_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) NOT NULL REFERENCES public.practice_sessions(id) ON DELETE CASCADE,
    question_id VARCHAR(50) NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    time_spent_seconds INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('answered', 'skipped', 'draft')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_answers_session_id ON public.practice_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON public.practice_answers(question_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_answers ENABLE ROW LEVEL SECURITY;

-- Programs: Public can view published programs; Admins can do anything
CREATE POLICY "Public can view published programs" 
ON public.programs FOR SELECT 
USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage programs" 
ON public.programs FOR ALL 
USING (public.is_admin());

-- Questions: Public can view published questions; Admins can manage
CREATE POLICY "Public can view published questions" 
ON public.questions FOR SELECT 
USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage questions" 
ON public.questions FOR ALL 
USING (public.is_admin());

-- Profiles: Users can view and edit their own profile
CREATE POLICY "Users can manage own profile" 
ON public.profiles FOR ALL 
USING (auth.uid() = id);

-- Admin Roles: Only admins can view admin table
CREATE POLICY "Admins can view admin roles" 
ON public.admin_roles FOR SELECT 
USING (public.is_admin());

-- Practice Sessions: Users access only their own sessions
CREATE POLICY "Users can manage their own practice sessions" 
ON public.practice_sessions FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Practice Answers: Users access answers linked to their sessions
CREATE POLICY "Users can manage their own answers" 
ON public.practice_answers FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.practice_sessions
        WHERE public.practice_sessions.id = public.practice_answers.session_id
        AND (public.practice_sessions.user_id = auth.uid() OR public.practice_sessions.user_id IS NULL)
    )
);
