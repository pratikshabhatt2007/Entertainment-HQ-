import { supabase } from './config/supabase.js';

const rbuEvents = [
  {
    title: 'Pratishruti 2026 - Annual Cultural Fest',
    description: 'The flagship annual national cultural festival of Ramdeobaba University (RBU), Nagpur. Featuring grand pro-nights, music battles, dance face-offs, fashion shows, and celebrity performances.',
    category: 'Social',
    event_date: '2026-09-20',
    event_time: '17:00:00',
    location: 'Main Sports Ground, Ramdeobaba University, Katol Road, Nagpur',
    capacity: 1500,
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Technovision 2026 - National Tech Symposium',
    description: 'Annual national technical fest hosted by RBU Nagpur featuring AI hackathons, robotics challenges, competitive coding sprints, paper presentations, and tech expos.',
    category: 'Technology',
    event_date: '2026-10-10',
    event_time: '09:30:00',
    location: 'MBA Auditorium & CSE Block, Ramdeobaba University, Nagpur',
    capacity: 500,
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'RBU Innovation & Entrepreneurship Summit 2026',
    description: 'Organized by the Technology Business Incubator (TBI) at Ramdeobaba University. Pitching competitions, startup mentorship, and keynote talks by prominent alumni founders.',
    category: 'Business',
    event_date: '2026-11-05',
    event_time: '10:00:00',
    location: 'TBI Incubation Center, Ramdeobaba University Campus, Nagpur',
    capacity: 300,
    image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Hands-on GenAI & Cloud Computing Workshop',
    description: 'Practical hands-on workshop on LLMs, Retrieval-Augmented Generation (RAG), and Cloud Deployment organized by RBU ACM & IEEE Student Chapters.',
    category: 'Workshop',
    event_date: '2026-08-25',
    event_time: '11:00:00',
    location: 'Department of Computer Science & Engineering, RBU Nagpur',
    capacity: 120,
    image_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
  },
];

async function checkAndInsert() {
  console.log('🔍 Checking existing events in Supabase...');
  const { data: existingEvents, error: fetchErr } = await supabase.from('events').select('*');
  
  if (fetchErr) {
    console.error('Fetch Error:', fetchErr);
  } else {
    console.log(`Current events count in DB: ${existingEvents.length}`);
  }

  console.log('Inserting RBU Events...');
  for (const ev of rbuEvents) {
    const { data, error } = await supabase.from('events').insert([ev]).select();
    if (error) {
      console.error(`Failed to insert "${ev.title}":`, error.message);
    } else {
      console.log(`✅ Inserted: "${ev.title}"`);
    }
  }
}

checkAndInsert();
