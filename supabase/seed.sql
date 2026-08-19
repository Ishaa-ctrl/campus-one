-- ============================================================
-- CampusOne Demo/Seed Data
-- ============================================================
-- IMPORTANT: This is DEMO DATA for development and testing.
-- Remove or replace this data before going to production.
-- 
-- NOTE: This seed file assumes you have already run the schema
-- migration (001_schema.sql) and have created users through
-- Supabase Auth. The user_id values below are placeholders.
-- 
-- To use this seed data:
-- 1. Create 6 test users in Supabase Auth Dashboard
-- 2. Replace the user_id UUIDs below with real auth user IDs
-- 3. Run this SQL in the Supabase SQL Editor
-- ============================================================

-- PLACEHOLDER USER IDs - Replace with real auth.users IDs
-- User 1 (Rohan): 00000000-0000-0000-0000-000000000001
-- User 2 (Aditya): 00000000-0000-0000-0000-000000000002
-- User 3 (Meera): 00000000-0000-0000-0000-000000000003
-- User 4 (Sneha): 00000000-0000-0000-0000-000000000004
-- User 5 (Arjun): 00000000-0000-0000-0000-000000000005
-- User 6 (Neha - Admin): 00000000-0000-0000-0000-000000000006

-- ============================================================
-- DEMO PROFILES
-- ============================================================
INSERT INTO public.profiles (user_id, full_name, email, usn, department, semester, college, bio, role) VALUES
('00000000-0000-0000-0000-000000000001', 'Rohan Sharma', 'rohan@college.edu', '1RV21CS001', 'Computer Science & Engineering', 3, 'RV College of Engineering', 'CSE student passionate about web development and AI.', 'student'),
('00000000-0000-0000-0000-000000000002', 'Aditya Patel', 'aditya@college.edu', '1RV21CS002', 'Computer Science & Engineering', 3, 'RV College of Engineering', 'Full-stack developer and open source contributor.', 'student'),
('00000000-0000-0000-0000-000000000003', 'Meera Krishnan', 'meera@college.edu', '1RV21IS001', 'Information Science & Engineering', 5, 'RV College of Engineering', 'ISE student interested in data science and ML.', 'student'),
('00000000-0000-0000-0000-000000000004', 'Sneha Reddy', 'sneha@college.edu', '1RV21EC001', 'Electronics & Communication Engineering', 3, 'RV College of Engineering', 'ECE student with interest in IoT and embedded systems.', 'student'),
('00000000-0000-0000-0000-000000000005', 'Arjun Nair', 'arjun@college.edu', '1RV21ME001', 'Mechanical Engineering', 5, 'RV College of Engineering', 'Mechanical engineering student and robotics enthusiast.', 'student'),
('00000000-0000-0000-0000-000000000006', 'Neha Gupta', 'neha@college.edu', '1RV21CS003', 'Computer Science & Engineering', 7, 'RV College of Engineering', 'Senior CSE student and campus coordinator.', 'admin')
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- DEMO SUBJECTS
-- ============================================================
INSERT INTO public.subjects (name, code, semester, department) VALUES
('Engineering Mathematics I', 'MAT101', 1, 'Computer Science & Engineering'),
('Engineering Physics', 'PHY101', 1, 'Computer Science & Engineering'),
('Basic Electronics', 'ECE101', 1, 'Computer Science & Engineering'),
('Engineering Mathematics II', 'MAT201', 2, 'Computer Science & Engineering'),
('Discrete Mathematics', 'MAT203', 2, 'Computer Science & Engineering'),
('Python Programming', 'CSE201', 2, 'Computer Science & Engineering'),
('Data Structures & Algorithms', 'CSE301', 3, 'Computer Science & Engineering'),
('Database Management Systems', 'CSE302', 3, 'Computer Science & Engineering'),
('Operating Systems', 'CSE303', 3, 'Computer Science & Engineering'),
('Computer Networks', 'CSE304', 3, 'Computer Science & Engineering'),
('Object Oriented Programming', 'CSE305', 3, 'Computer Science & Engineering'),
('Theory of Computation', 'CSE401', 4, 'Computer Science & Engineering'),
('Design & Analysis of Algorithms', 'CSE402', 4, 'Computer Science & Engineering'),
('Software Engineering', 'CSE403', 4, 'Computer Science & Engineering'),
('Artificial Intelligence', 'CSE501', 5, 'Computer Science & Engineering'),
('Machine Learning', 'CSE502', 5, 'Computer Science & Engineering'),
('Web Development', 'CSE503', 5, 'Computer Science & Engineering'),
('Computer Graphics', 'CSE504', 5, 'Computer Science & Engineering'),
('Cloud Computing', 'CSE601', 6, 'Computer Science & Engineering'),
('Cryptography', 'CSE602', 6, 'Computer Science & Engineering');

-- ============================================================
-- DEMO NOTES
-- ============================================================
INSERT INTO public.notes (title, description, subject_name, semester, file_url, file_type, file_size, tags, download_count, uploaded_by) VALUES
('DBMS Complete Notes', 'Comprehensive notes covering all units of Database Management Systems including ER diagrams, normalization, SQL, and transactions.', 'Database Management Systems', 3, 'https://example.com/dbms-notes.pdf', 'pdf', 2500000, ARRAY['dbms', 'sql', 'normalization', 'database'], 156, '00000000-0000-0000-0000-000000000001'),
('Operating Systems Unit 1-4', 'Detailed notes on process management, memory management, file systems, and I/O systems.', 'Operating Systems', 3, 'https://example.com/os-notes.pdf', 'pdf', 3200000, ARRAY['os', 'processes', 'memory', 'scheduling'], 203, '00000000-0000-0000-0000-000000000002'),
('AI Lab Manual', 'Complete lab manual with all experiments for Artificial Intelligence course including search algorithms and neural networks.', 'Artificial Intelligence', 5, 'https://example.com/ai-lab.pdf', 'pdf', 1800000, ARRAY['ai', 'lab', 'neural-networks', 'search'], 89, '00000000-0000-0000-0000-000000000003'),
('Discrete Mathematics Formulas', 'Quick reference formula sheet for Discrete Mathematics covering sets, relations, graphs, and combinatorics.', 'Discrete Mathematics', 2, 'https://example.com/dm-formulas.pdf', 'pdf', 500000, ARRAY['discrete-math', 'formulas', 'graphs'], 312, '00000000-0000-0000-0000-000000000001'),
('Data Structures Notes', 'Complete notes on arrays, linked lists, trees, graphs, sorting, and searching algorithms with code examples.', 'Data Structures & Algorithms', 3, 'https://example.com/dsa-notes.pdf', 'pdf', 4100000, ARRAY['dsa', 'algorithms', 'trees', 'sorting'], 278, '00000000-0000-0000-0000-000000000005'),
('Computer Networks Complete', 'End-to-end notes covering OSI model, TCP/IP, routing protocols, and network security.', 'Computer Networks', 3, 'https://example.com/cn-notes.pdf', 'pdf', 2800000, ARRAY['networks', 'tcp-ip', 'osi', 'routing'], 145, '00000000-0000-0000-0000-000000000004'),
('Python Programming Basics', 'Beginner-friendly notes on Python covering variables, functions, OOP, file handling, and libraries.', 'Python Programming', 2, 'https://example.com/python-notes.pdf', 'pdf', 1500000, ARRAY['python', 'programming', 'oop'], 189, '00000000-0000-0000-0000-000000000002'),
('Machine Learning Algorithms', 'Notes on supervised and unsupervised learning, regression, classification, clustering, and neural networks.', 'Machine Learning', 5, 'https://example.com/ml-notes.pdf', 'pdf', 3500000, ARRAY['ml', 'algorithms', 'deep-learning'], 167, '00000000-0000-0000-0000-000000000003'),
('Software Engineering Models', 'Comprehensive notes on SDLC models, agile methodology, UML diagrams, and software testing.', 'Software Engineering', 4, 'https://example.com/se-notes.pdf', 'pdf', 2100000, ARRAY['software-engineering', 'sdlc', 'agile', 'uml'], 98, '00000000-0000-0000-0000-000000000006'),
('Web Development Full Stack', 'Notes covering HTML, CSS, JavaScript, React, Node.js, and database integration.', 'Web Development', 5, 'https://example.com/webdev-notes.pdf', 'pdf', 2900000, ARRAY['web', 'react', 'nodejs', 'javascript'], 234, '00000000-0000-0000-0000-000000000001');

-- ============================================================
-- DEMO MARKETPLACE ITEMS
-- ============================================================
INSERT INTO public.marketplace_items (title, description, price, category, condition, location, seller_id, status) VALUES
('Engineering Mathematics Book', 'Higher Engineering Mathematics by B.S. Grewal. Used for one semester, in excellent condition. All pages intact, minor highlighting.', 250, 'books', 'good', 'Main Campus', '00000000-0000-0000-0000-000000000001', 'active'),
('Casio fx-991ES Plus', 'Scientific calculator in perfect working condition. Includes original case and manual. Battery recently replaced.', 700, 'electronics', 'like_new', 'Hostel Block A', '00000000-0000-0000-0000-000000000002', 'active'),
('Physics Lab Coat', 'White lab coat, size M. Used for two semesters. Clean and in good condition. Perfect for physics and chemistry labs.', 150, 'clothing', 'good', 'Department Store', '00000000-0000-0000-0000-000000000004', 'active'),
('Steel Water Bottle (1L)', 'Milton stainless steel water bottle, 1 liter capacity. Insulated, keeps water cold for 12 hours.', 200, 'others', 'like_new', 'Canteen Area', '00000000-0000-0000-0000-000000000003', 'active'),
('Data Structures Textbook', 'Data Structures using C by Reema Thareja. Perfect for CSE 3rd semester. Minor wear on cover.', 180, 'books', 'fair', 'Library Area', '00000000-0000-0000-0000-000000000005', 'active'),
('Arduino Starter Kit', 'Complete Arduino UNO R3 starter kit with breadboard, sensors, LEDs, and project book. Great for IoT projects.', 1200, 'electronics', 'new', 'ECE Lab', '00000000-0000-0000-0000-000000000004', 'active'),
('Drawing Instruments Box', 'Complete engineering drawing box with compass, divider, set squares, protractor, and scale. Brand: Faber-Castell.', 350, 'stationery', 'good', 'Civil Department', '00000000-0000-0000-0000-000000000005', 'active'),
('Laptop Stand', 'Adjustable aluminum laptop stand. Ergonomic design, portable, fits laptops up to 15.6 inches.', 450, 'electronics', 'like_new', 'Hostel Block B', '00000000-0000-0000-0000-000000000001', 'active');

-- ============================================================
-- DEMO LOST & FOUND POSTS
-- ============================================================
INSERT INTO public.lost_found_posts (item_name, description, type, location, date, posted_by, status) VALUES
('Student ID Card', 'Blue college ID card with name Rahul K. Found near the main library entrance on the steps.', 'found', 'Library', '2024-12-01', '00000000-0000-0000-0000-000000000001', 'active'),
('Black Leather Wallet', 'Lost my black leather wallet somewhere in the main academic block. Contains student ID and some cash. Please contact if found.', 'lost', 'Main Block', '2024-12-02', '00000000-0000-0000-0000-000000000002', 'active'),
('AirPods Case (White)', 'Found a white AirPods charging case in Classroom 204. No AirPods inside, just the case.', 'found', 'Classroom 204', '2024-11-28', '00000000-0000-0000-0000-000000000003', 'active'),
('Blue Umbrella', 'Lost my blue folding umbrella near the canteen area. It has a wooden handle with my initials carved.', 'lost', 'Canteen', '2024-12-03', '00000000-0000-0000-0000-000000000004', 'active'),
('Calculator (Casio)', 'Found a Casio scientific calculator in the exam hall after the mathematics exam. Has a small sticker on the back.', 'found', 'Exam Hall', '2024-11-30', '00000000-0000-0000-0000-000000000005', 'active'),
('Bunch of Keys', 'Lost a keychain with 3 keys (room key, locker key, bike key) and a small teddy bear keychain. Last seen near parking.', 'lost', 'Parking Area', '2024-12-04', '00000000-0000-0000-0000-000000000001', 'active');

-- ============================================================
-- DEMO ANNOUNCEMENTS
-- ============================================================
INSERT INTO public.announcements (title, description, category, created_by) VALUES
('Internal Assessment Schedule Released', 'The internal assessment schedule for all departments has been released. Semester 3 exams start from December 15th. Check the notice board for detailed timetable. All students must carry their ID cards.', 'exam', '00000000-0000-0000-0000-000000000006'),
('TechFest 2024 Registrations Open', 'Annual technical festival TechFest 2024 is back! Register for hackathons, paper presentations, coding competitions, and robotics challenges. Early bird discount available until December 10th. Visit the event website for more details.', 'event', '00000000-0000-0000-0000-000000000006'),
('Campus Placement Drive - Infosys', 'Infosys will be conducting an on-campus placement drive on December 20th for CSE, ISE, and ECE students. Eligible criteria: 7.0 CGPA and above, no active backlogs. Register on the placement portal by December 12th.', 'placement', '00000000-0000-0000-0000-000000000006'),
('Winter Break Announcement', 'The college will remain closed from December 25th to January 2nd for winter break. Hostellers who wish to stay must register with the warden by December 20th. Library will operate on reduced hours during the break.', 'holiday', '00000000-0000-0000-0000-000000000006'),
('New Computer Lab Inaugurated', 'A new state-of-the-art computer lab with 60 workstations has been inaugurated in the CSE block. The lab features high-performance systems with GPU support for AI/ML projects. Open for all students from 8 AM to 8 PM.', 'general', '00000000-0000-0000-0000-000000000006');

-- ============================================================
-- DEMO NOTIFICATIONS
-- ============================================================
INSERT INTO public.notifications (user_id, title, message, type, link, read) VALUES
('00000000-0000-0000-0000-000000000001', 'New Notes Uploaded', 'Aditya uploaded "Operating Systems Unit 1-4" for Semester 3.', 'note', '/notes', false),
('00000000-0000-0000-0000-000000000001', 'Item Saved', 'Someone saved your marketplace listing "Engineering Mathematics Book".', 'marketplace', '/marketplace', false),
('00000000-0000-0000-0000-000000000002', 'Found Item Match', 'A found item matching your area was reported: "Student ID Card" near Library.', 'lost_found', '/lost-found', false),
('00000000-0000-0000-0000-000000000003', 'New Announcement', 'TechFest 2024 registrations are now open!', 'announcement', '/announcements', false),
('00000000-0000-0000-0000-000000000001', 'Welcome to CampusOne!', 'Welcome to CampusOne! Start by exploring notes, marketplace, and connecting with your campus community.', 'general', '/dashboard', true);

-- ============================================================
-- END OF DEMO DATA
-- ============================================================
