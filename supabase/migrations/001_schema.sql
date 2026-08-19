-- ============================================================
-- CampusOne Database Schema
-- PostgreSQL (Supabase)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE public.profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  usn TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 8),
  college TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_usn ON public.profiles(usn);
CREATE INDEX idx_profiles_department ON public.profiles(department);

-- ============================================================
-- SUBJECTS TABLE
-- ============================================================
CREATE TABLE public.subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 8),
  department TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_subjects_semester ON public.subjects(semester);
CREATE INDEX idx_subjects_department ON public.subjects(department);

-- ============================================================
-- NOTES TABLE
-- ============================================================
CREATE TABLE public.notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  subject_name TEXT,
  semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 8),
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  file_size INTEGER DEFAULT 0,
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  download_count INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_notes_semester ON public.notes(semester);
CREATE INDEX idx_notes_subject ON public.notes(subject_id);
CREATE INDEX idx_notes_uploaded_by ON public.notes(uploaded_by);
CREATE INDEX idx_notes_created_at ON public.notes(created_at DESC);
CREATE INDEX idx_notes_title_search ON public.notes USING gin(to_tsvector('english', title));

-- ============================================================
-- MARKETPLACE_ITEMS TABLE
-- ============================================================
CREATE TABLE public.marketplace_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL CHECK (category IN ('books', 'electronics', 'stationery', 'clothing', 'lab_equipment', 'others')),
  condition TEXT NOT NULL CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
  location TEXT,
  contact_preference TEXT,
  seller_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'reserved', 'deleted')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_marketplace_category ON public.marketplace_items(category);
CREATE INDEX idx_marketplace_seller ON public.marketplace_items(seller_id);
CREATE INDEX idx_marketplace_status ON public.marketplace_items(status);
CREATE INDEX idx_marketplace_created_at ON public.marketplace_items(created_at DESC);
CREATE INDEX idx_marketplace_price ON public.marketplace_items(price);
CREATE INDEX idx_marketplace_title_search ON public.marketplace_items USING gin(to_tsvector('english', title));

-- ============================================================
-- MARKETPLACE_IMAGES TABLE
-- ============================================================
CREATE TABLE public.marketplace_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_marketplace_images_item ON public.marketplace_images(item_id);

-- ============================================================
-- LOST_FOUND_POSTS TABLE
-- ============================================================
CREATE TABLE public.lost_found_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  location TEXT NOT NULL,
  date DATE NOT NULL,
  image_url TEXT,
  posted_by UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'deleted')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_lost_found_type ON public.lost_found_posts(type);
CREATE INDEX idx_lost_found_posted_by ON public.lost_found_posts(posted_by);
CREATE INDEX idx_lost_found_status ON public.lost_found_posts(status);
CREATE INDEX idx_lost_found_created_at ON public.lost_found_posts(created_at DESC);
CREATE INDEX idx_lost_found_name_search ON public.lost_found_posts USING gin(to_tsvector('english', item_name));

-- ============================================================
-- ANNOUNCEMENTS TABLE
-- ============================================================
CREATE TABLE public.announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('exam', 'event', 'placement', 'holiday', 'general')),
  created_by UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_announcements_category ON public.announcements(category);
CREATE INDEX idx_announcements_created_at ON public.announcements(created_at DESC);

-- ============================================================
-- SAVED_ITEMS TABLE
-- ============================================================
CREATE TABLE public.saved_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('note', 'marketplace_item', 'lost_found_post')),
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, item_type, item_id)
);

CREATE INDEX idx_saved_items_user ON public.saved_items(user_id);
CREATE INDEX idx_saved_items_item ON public.saved_items(item_type, item_id);

-- ============================================================
-- REPORTS TABLE
-- ============================================================
CREATE TABLE public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reported_by UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('note', 'marketplace_item', 'lost_found_post')),
  content_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_reports_status ON public.reports(status);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  link TEXT,
  read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.marketplace_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.lost_found_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_found_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- SUBJECTS POLICIES
CREATE POLICY "Subjects are viewable by everyone" ON public.subjects
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage subjects" ON public.subjects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- NOTES POLICIES
CREATE POLICY "Notes are viewable by all authenticated users" ON public.notes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload notes" ON public.notes
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update own notes" ON public.notes
  FOR UPDATE USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete own notes" ON public.notes
  FOR DELETE USING (auth.uid() = uploaded_by);

-- MARKETPLACE POLICIES
CREATE POLICY "Active marketplace items are viewable by all authenticated users" ON public.marketplace_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create listings" ON public.marketplace_items
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own listings" ON public.marketplace_items
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own listings" ON public.marketplace_items
  FOR DELETE USING (auth.uid() = seller_id);

-- MARKETPLACE IMAGES POLICIES
CREATE POLICY "Marketplace images are viewable by all authenticated users" ON public.marketplace_images
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Sellers can manage their listing images" ON public.marketplace_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.marketplace_items 
      WHERE id = item_id AND seller_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can delete their listing images" ON public.marketplace_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.marketplace_items 
      WHERE id = item_id AND seller_id = auth.uid()
    )
  );

-- LOST FOUND POLICIES
CREATE POLICY "Lost found posts are viewable by all authenticated users" ON public.lost_found_posts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create posts" ON public.lost_found_posts
  FOR INSERT WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Users can update own posts" ON public.lost_found_posts
  FOR UPDATE USING (auth.uid() = posted_by);

CREATE POLICY "Users can delete own posts" ON public.lost_found_posts
  FOR DELETE USING (auth.uid() = posted_by);

-- ANNOUNCEMENTS POLICIES
CREATE POLICY "Announcements are viewable by all authenticated users" ON public.announcements
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can create announcements" ON public.announcements
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update announcements" ON public.announcements
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete announcements" ON public.announcements
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- SAVED ITEMS POLICIES
CREATE POLICY "Users can view own saved items" ON public.saved_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save items" ON public.saved_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave items" ON public.saved_items
  FOR DELETE USING (auth.uid() = user_id);

-- REPORTS POLICIES
CREATE POLICY "Users can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can view own reports" ON public.reports
  FOR SELECT USING (auth.uid() = reported_by);

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- STORAGE BUCKET POLICIES (run in Supabase Dashboard)
-- ============================================================
-- Note: Storage policies must be created via Supabase Dashboard or CLI
-- Buckets needed: avatars, notes, marketplace, lost-found
-- Each bucket should allow authenticated users to upload
-- and public read access for serving files
