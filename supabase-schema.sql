-- ==========================================
-- SUPABASE DATABASE SCHEMA
-- Smart Expense Tracker
-- ==========================================

-- Enable pgvector for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- ==========================================
-- TRANSACTIONS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID DEFAULT auth.uid() REFERENCES auth.users(id),
    amount BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    merchant VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('expense', 'income')),
    note TEXT,
    embedding VECTOR(1536), -- For semantic search with OpenAI embeddings
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON public.transactions
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON public.transactions
    FOR DELETE
    USING (auth.uid() = user_id);

-- ==========================================
-- INDEXES (for better performance)
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON public.transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);

-- ==========================================
-- SEMANTIC SEARCH INDEX (pgvector)
-- ==========================================

-- Note: You'll need to create embeddings using OpenAI API
-- and store them in the embedding column for semantic search

-- CREATE INDEX IF NOT EXISTS idx_transactions_embedding 
-- ON public.transactions 
-- USING ivfflat (embedding vector_cosine_ops)
-- WITH (lists = 100);

-- ==========================================
-- DASHBOARD VIEW (聚合统计)
-- ==========================================

CREATE OR REPLACE VIEW public.transactions_summary AS
SELECT 
    user_id,
    DATE_TRUNC('day', created_at) as date,
    type,
    category,
    COUNT(*) as count,
    SUM(amount) as total
FROM public.transactions
GROUP BY user_id, DATE_TRUNC('day', created_at), type, category;

-- ==========================================
-- FUNCTION: Get monthly summary
-- ==========================================

CREATE OR REPLACE FUNCTION get_monthly_summary(p_user_id UUID, p_month TIMESTAMPTZ)
RETURNS TABLE (
    total_income BIGINT,
    total_expense BIGINT,
    balance BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0)::BIGINT as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0)::BIGINT as total_expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0)::BIGINT as balance
    FROM public.transactions
    WHERE user_id = p_user_id 
        AND created_at >= DATE_TRUNC('month', p_month)
        AND created_at < DATE_TRUNC('month', p_month) + INTERVAL '1 month';
END;
$$;

-- ==========================================
-- STORAGE BUCKET (for receipts/images)
-- ==========================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

-- Allow users to upload receipts
CREATE POLICY "Users can upload receipts" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'receipts' AND auth.uid() = owner);

CREATE POLICY "Users can view receipts" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'receipts' AND auth.uid() = owner);
