-- ==========================================
-- RAMDEOBABA UNIVERSITY NAGPUR EVENTS SEED SQL
-- Paste and run this in Supabase SQL Editor
-- ==========================================

INSERT INTO public.events (title, description, category, event_date, event_time, location, capacity, image_url)
VALUES 
(
  'Pratishruti 2026 - Annual Cultural Fest',
  'The flagship annual national cultural festival of Ramdeobaba University (RBU), Nagpur. Featuring grand pro-nights, music battles, dance face-offs, fashion shows, and celebrity performances.',
  'Social',
  '2026-09-20',
  '17:00:00',
  'Main Sports Ground, Ramdeobaba University, Katol Road, Nagpur',
  1500,
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
),
(
  'Technovision 2026 - National Tech Symposium',
  'Annual national technical fest hosted by RBU Nagpur featuring AI hackathons, robotics challenges, competitive coding sprints, paper presentations, and tech expos.',
  'Technology',
  '2026-10-10',
  '09:30:00',
  'MBA Auditorium & CSE Block, Ramdeobaba University, Nagpur',
  500,
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
),
(
  'RBU Innovation & Entrepreneurship Summit 2026',
  'Organized by the Technology Business Incubator (TBI) at Ramdeobaba University. Pitching competitions, startup mentorship, and keynote talks by prominent alumni founders.',
  'Business',
  '2026-11-05',
  '10:00:00',
  'TBI Incubation Center, Ramdeobaba University Campus, Nagpur',
  300,
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80'
),
(
  'Hands-on GenAI & Cloud Computing Workshop',
  'Practical hands-on workshop on LLMs, Retrieval-Augmented Generation (RAG), and Cloud Deployment organized by RBU ACM & IEEE Student Chapters.',
  'Workshop',
  '2026-08-25',
  '11:00:00',
  'Department of Computer Science & Engineering, RBU Nagpur',
  120,
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80'
);
