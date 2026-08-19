# 🎓 CampusOne

**Your College, One Platform.**

CampusOne is a full-stack, college-exclusive student platform that brings together academic notes, a student marketplace, lost & found, announcements, and community features — all in one modern, beautiful application.

![CampusOne](https://img.shields.io/badge/CampusOne-v1.0-purple)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## ✨ Features

### 📚 Academic Notes & Resources
- Upload, browse, and download study materials (PDF, DOC)
- Filter by semester, subject, and file type
- Tag-based organization
- Download counter

### 🛍️ Student Marketplace
- Buy and sell items within your campus
- Categories: Books, Electronics, Stationery, Clothing, Lab Equipment
- Multiple image support
- Condition rating and pricing

### 🔍 Lost & Found
- Report lost or found items
- Location and date tracking
- Mark items as resolved
- Image support

### 📢 Announcements
- Campus-wide announcements
- Categories: Exam, Event, Placement, Holiday, General
- Admin-only posting

### 👤 Student Profiles
- USN-verified student profiles
- Department and semester info
- Activity statistics
- Profile customization

### 🔔 Notifications
- Real-time notification system
- Activity-based alerts
- Mark as read functionality

### 🔎 Global Search
- Search across notes, marketplace, and lost & found
- Debounced search with grouped results

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS 3 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Backend** | Next.js API Routes / Server Actions |
| **Database** | PostgreSQL (via Supabase) |
| **Authentication** | Supabase Auth (email/password) |
| **Storage** | Supabase Storage |
| **Validation** | Zod |
| **Notifications** | react-hot-toast |
| **Deployment** | Vercel + Supabase |

## 📁 Project Structure

```
campus-one/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth pages (login, signup, forgot-password)
│   │   ├── (main)/              # Protected app pages
│   │   │   ├── dashboard/       # Home dashboard
│   │   │   ├── notes/           # Notes system
│   │   │   ├── marketplace/     # Marketplace
│   │   │   ├── lost-found/      # Lost & Found
│   │   │   ├── announcements/   # Announcements
│   │   │   ├── profile/         # User profiles
│   │   │   └── settings/        # Settings
│   │   ├── api/                 # API routes
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── auth/                # Auth provider
│   │   ├── cards/               # Card components
│   │   ├── layout/              # Layout (Sidebar, Header, MobileNav)
│   │   ├── modals/              # Modal components
│   │   └── ui/                  # UI components
│   ├── lib/
│   │   ├── supabase/            # Supabase client setup
│   │   ├── validations/         # Zod schemas
│   │   └── utils.ts             # Utility functions
│   └── types/
│       └── database.ts          # TypeScript types
├── supabase/
│   ├── migrations/
│   │   └── 001_schema.sql       # Database schema
│   └── seed.sql                 # Demo data
├── .env.example
├── package.json
├── tailwind.config.ts
└── next.config.ts
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.17 or later
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd campus-one
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Go to **Project Settings > API** and copy:
   - Project URL
   - `anon` (public) key
   - `service_role` key (keep this secret!)

### 4. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_COLLEGE_EMAIL_DOMAIN=college.edu
NEXT_PUBLIC_COLLEGE_NAME=Your College Name
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Set Up Database

1. Go to Supabase Dashboard > **SQL Editor**
2. Copy the contents of `supabase/migrations/001_schema.sql`
3. Run it in the SQL Editor
4. This creates all tables, indexes, RLS policies, and triggers

### 6. Set Up Storage Buckets

In Supabase Dashboard > **Storage**, create these buckets:

| Bucket | Public | Purpose |
|---|---|---|
| `avatars` | Yes | Profile pictures |
| `notes` | Yes | Note files (PDFs) |
| `marketplace` | Yes | Product images |
| `lost-found` | Yes | Lost & found images |

For each bucket, add a storage policy:
- **Upload**: Allow authenticated users to upload
- **Read**: Allow public access (for serving files)

### 7. Set Up Authentication

1. In Supabase Dashboard > **Authentication > Providers**
2. Ensure **Email** provider is enabled
3. Configure email templates if desired
4. Optionally set up email domain restrictions

### 8. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 9. Seed Demo Data (Optional)

1. First create test users in Supabase Dashboard > **Authentication > Users**
2. Note down their UUIDs
3. Update `supabase/seed.sql` with real user UUIDs
4. Run the seed SQL in Supabase SQL Editor

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only modify their own content
- Admin-only access for announcements
- College email verification (configurable)
- Server-side user validation
- File type and size validation
- Service role key never exposed to frontend

## 📱 Responsive Design

| Viewport | Layout |
|---|---|
| **Desktop** | Left sidebar navigation |
| **Tablet** | Collapsible sidebar |
| **Mobile** | Bottom navigation bar with FAB |

## ☁️ Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel project settings
5. Deploy!

```bash
npm run build  # Verify build passes first
```

## 🧹 Removing Demo Data

To remove all demo data:

```sql
-- Run in Supabase SQL Editor
DELETE FROM public.notifications;
DELETE FROM public.saved_items;
DELETE FROM public.reports;
DELETE FROM public.announcements;
DELETE FROM public.marketplace_images;
DELETE FROM public.marketplace_items;
DELETE FROM public.lost_found_posts;
DELETE FROM public.notes;
DELETE FROM public.subjects;
DELETE FROM public.profiles;
```

## 📝 License

This project is built for educational purposes. Feel free to use and modify.

---

**Built with ❤️ for students, by students.**
