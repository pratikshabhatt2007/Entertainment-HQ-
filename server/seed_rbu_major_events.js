import { supabase } from './config/supabase.js';

const majorRBUEvents = [
  {
    title: 'First Convocation of RBU',
    description: "The university's first official convocation ceremony celebrating graduating scholars and conferring degrees.",
    category: 'General',
    event_date: '2026-09-05',
    event_time: '10:30:00',
    location: 'Main Auditorium, Ramdeobaba University, Katol Road, Nagpur',
    capacity: 2000,
    image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Induction Programme (2026–27)',
    description: 'The welcome and induction for the new academic session officially introducing new students to campus life, culture, and faculty.',
    category: 'Workshop',
    event_date: '2026-07-27',
    event_time: '09:00:00',
    location: 'MBA Auditorium & Department Blocks, Ramdeobaba University, Nagpur',
    capacity: 1200,
    image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Pratishruti 2026',
    description: "RBU's flagship annual social and cultural festival featuring music battles, dance face-offs, fashion shows, and grand pro-nights.",
    category: 'Social',
    event_date: '2026-02-25',
    event_time: '17:00:00',
    location: 'Main Sports Ground, Ramdeobaba University, Nagpur',
    capacity: 2500,
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Graduation Ceremony (Batches 2024 & 2025)',
    description: 'A joint graduation event celebrating the successful graduating batches of 2024 and 2025.',
    category: 'General',
    event_date: '2026-01-17',
    event_time: '10:00:00',
    location: 'University Open Air Theatre, Ramdeobaba University, Nagpur',
    capacity: 1800,
    image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'NEEV-25 - National Technical Symposium',
    description: 'A national-level technical symposium focused on digital civil technology, featuring CAD-WARS, SIM-CITY, and technical paper presentations.',
    category: 'Technology',
    event_date: '2025-02-07',
    event_time: '09:30:00',
    location: 'Department of Civil Engineering, RBU Nagpur',
    capacity: 600,
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'UDGHOSH 7.0 - Flagship Sports Fest',
    description: "The university's flagship annual sports festival bringing students together for basketball, chess, volleyball, football, and athletics.",
    category: 'Social',
    event_date: '2025-01-25',
    event_time: '08:00:00',
    location: 'University Sports Complex & Grounds, RBU Nagpur',
    capacity: 1000,
    image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'AAGAAZ 6.0 - Annual Sports Kick-off',
    description: "The official kick-off tournament for the university's annual sports calendar.",
    category: 'Social',
    event_date: '2024-08-21',
    event_time: '08:30:00',
    location: 'Sports Ground, Ramdeobaba University, Nagpur',
    capacity: 800,
    image_url: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=1200&q=80',
  },
];

async function seedMajorEvents() {
  console.log('🌱 Seeding major Ramdeobaba University events...');

  for (const ev of majorRBUEvents) {
    const { data, error } = await supabase.from('events').insert([ev]).select();
    if (error) {
      console.error(`❌ Failed to insert "${ev.title}":`, error.message);
    } else {
      console.log(`✅ Inserted: "${ev.title}" (${ev.event_date})`);
    }
  }
}

seedMajorEvents();
