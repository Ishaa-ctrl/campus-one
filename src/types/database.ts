export type UserRole = 'student' | 'admin';
export type ItemCondition = 'new' | 'like_new' | 'good' | 'fair' | 'poor';
export type MarketplaceCategory = 'books' | 'electronics' | 'stationery' | 'clothing' | 'lab_equipment' | 'others';
export type MarketplaceStatus = 'active' | 'sold' | 'reserved' | 'deleted';
export type LostFoundType = 'lost' | 'found';
export type LostFoundStatus = 'active' | 'resolved' | 'deleted';
export type ContentType = 'note' | 'marketplace_item' | 'lost_found_post';
export type AnnouncementCategory = 'exam' | 'event' | 'placement' | 'holiday' | 'general';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  usn: string;
  department: string;
  semester: number;
  college: string;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  semester: number;
  department: string;
  created_at: string;
}

export interface Note {
  id: string;
  title: string;
  description: string | null;
  subject_id: string | null;
  subject_name: string | null;
  semester: number;
  file_url: string;
  file_type: string;
  file_size: number;
  thumbnail_url: string | null;
  tags: string[];
  download_count: number;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  uploader?: Profile;
  subject?: Subject;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: MarketplaceCategory;
  condition: ItemCondition;
  location: string | null;
  contact_preference: string | null;
  seller_id: string;
  status: MarketplaceStatus;
  created_at: string;
  updated_at: string;
  // Joined fields
  seller?: Profile;
  images?: MarketplaceImage[];
}

export interface MarketplaceImage {
  id: string;
  item_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface LostFoundPost {
  id: string;
  item_name: string;
  description: string;
  type: LostFoundType;
  location: string;
  date: string;
  image_url: string | null;
  posted_by: string;
  status: LostFoundStatus;
  created_at: string;
  updated_at: string;
  // Joined fields
  poster?: Profile;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: AnnouncementCategory;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  creator?: Profile;
}

export interface SavedItem {
  id: string;
  user_id: string;
  item_type: ContentType;
  item_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reported_by: string;
  content_type: ContentType;
  content_id: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

// Form types
export interface SignUpFormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  usn: string;
  department: string;
  semester: number;
  college: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface NoteUploadFormData {
  title: string;
  description: string;
  subject_id: string;
  semester: number;
  tags: string[];
  file: File;
}

export interface MarketplaceFormData {
  title: string;
  description: string;
  price: number;
  category: MarketplaceCategory;
  condition: ItemCondition;
  location: string;
  contact_preference: string;
  images: File[];
}

export interface LostFoundFormData {
  item_name: string;
  description: string;
  type: LostFoundType;
  location: string;
  date: string;
  image: File | null;
}

export interface AnnouncementFormData {
  title: string;
  description: string;
  category: AnnouncementCategory;
}

// Search
export interface SearchResult {
  notes: Note[];
  marketplace: MarketplaceItem[];
  lostFound: LostFoundPost[];
}

// Stats
export interface DashboardStats {
  totalNotes: number;
  totalListings: number;
  totalLostFound: number;
}

export interface ProfileStats {
  notesUploaded: number;
  itemsSold: number;
  foundItems: number;
}
