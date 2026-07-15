-- AFX Trade Intelligence - Database Schema
-- Version: 1.0 | Date: 14 July 2026

-- PROFILES (user profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_select_public" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- FIRMS (prop firms + brokers)
CREATE TABLE IF NOT EXISTS firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('prop_firm', 'broker')),
  category TEXT[] DEFAULT '{}',
  logo_url TEXT,
  country TEXT,
  countries_allowed TEXT[] DEFAULT '{}',
  platforms TEXT[] DEFAULT '{}',
  max_allocation NUMERIC,
  years_active INT,
  rating NUMERIC(2, 1) DEFAULT 0,
  review_count INT DEFAULT 0,
  website_url TEXT,
  affiliate_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  description TEXT,
  rules JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE firms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "firms_select_all" ON firms FOR SELECT USING (true);
CREATE POLICY "firms_insert_admin" ON firms FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "firms_update_admin" ON firms FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "firms_delete_admin" ON firms FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- DEALS (discount codes)
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  discount_label TEXT,
  description TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  click_count INT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deals_select_all" ON deals FOR SELECT USING (true);
CREATE POLICY "deals_insert_admin" ON deals FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "deals_update_admin" ON deals FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  is_verified_trader BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_published" ON reviews FOR SELECT USING (status = 'published' OR auth.uid() = user_id);
CREATE POLICY "reviews_insert_authenticated" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own" ON reviews FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  cover_image_url TEXT,
  excerpt TEXT,
  content_md TEXT,
  author_id UUID REFERENCES profiles(id),
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_select_published" ON blog_posts FOR SELECT USING (published = TRUE);
CREATE POLICY "blog_insert_admin" ON blog_posts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "blog_update_admin" ON blog_posts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- MARKET TICKER (cached ticker data)
CREATE TABLE IF NOT EXISTS market_ticker (
  symbol TEXT PRIMARY KEY,
  price NUMERIC,
  change_pct NUMERIC,
  sparkline NUMERIC[],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE market_ticker ENABLE ROW LEVEL SECURITY;

CREATE POLICY "market_ticker_select_all" ON market_ticker FOR SELECT USING (true);

-- DEAL CLICKS (affiliate attribution)
CREATE TABLE IF NOT EXISTS deal_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  firm_id UUID REFERENCES firms(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id),
  ip_hash TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deal_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deal_clicks_insert_all" ON deal_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "deal_clicks_select_admin" ON deal_clicks FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- NEWSLETTER
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "newsletter_insert_all" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', null)
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- CREATE INDEXES
CREATE INDEX IF NOT EXISTS idx_firms_slug ON firms(slug);
CREATE INDEX IF NOT EXISTS idx_firms_type ON firms(type);
CREATE INDEX IF NOT EXISTS idx_firms_featured ON firms(is_featured);
CREATE INDEX IF NOT EXISTS idx_deals_firm_id ON deals(firm_id);
CREATE INDEX IF NOT EXISTS idx_deals_featured ON deals(is_featured);
CREATE INDEX IF NOT EXISTS idx_reviews_firm_id ON reviews(firm_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
