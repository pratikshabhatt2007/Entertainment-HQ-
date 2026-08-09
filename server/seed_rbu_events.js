import { supabase } from './config/supabase.js';

const rbuEvents = [
  {
    title: 'Pratishruti 2026 - Annual Cultural Fest',
    description: 'The flagship annual national cultural festival of Ramdeobaba University (RBU), Nagpur. Featuring grand pro-nights, music battles, dance face-offs, fashion shows, and celebrity performances.',
    category: 'Social',
    event_date: '2026-08-25',
    event_time: '17:00:00',
    location: 'Main Sports Ground, Ramdeobaba University, Katol Road, Nagpur',
    capacity: 2500,
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'UDHOSH 2026 - Inter-College Premier Cricket Cup',
    description: 'High-octane T20 cricket tournament conducted in the university sports ground featuring top college teams competing for championship trophy & cash rewards.',
    category: 'Udhosh Sports',
    event_date: '2026-08-18',
    event_time: '08:30:00',
    location: 'Main Stadium Pitch & Sports Complex, RBU Area',
    capacity: 1200,
    image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'UDHOSH 2026 - Campus Football Super League',
    description: 'Annual 11-a-side knock-out football tournament under floodlights with referee panel, live match commentary, and sports trophies.',
    category: 'Udhosh Sports',
    event_date: '2026-08-20',
    event_time: '16:00:00',
    location: 'Turf Football Arena, RBU Sports Ground Area',
    capacity: 800,
    image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'NSS Club - Mega Blood Donation & Health Drive',
    description: 'Organized by NSS Student Unit in collaboration with City Blood Bank. Free health check-up, donor certificates, and volunteer refreshments.',
    category: 'NSS Club',
    event_date: '2026-08-28',
    event_time: '09:00:00',
    location: 'Student Activity Center & Health Block, RBU Campus',
    capacity: 500,
    image_url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'GFG Student Club - 36-Hour National Hackathon Blitz',
    description: 'GeeksforGeeks RBU Chapter flagship hackathon! Build innovative web apps, AI systems, or IoT solutions. Rs 1,00,000+ prize pool & mentor guidance.',
    category: 'GFG Club',
    event_date: '2026-09-10',
    event_time: '09:00:00',
    location: 'CSE Department High-Perf Computing Labs & Auditorium',
    capacity: 350,
    image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  },
];

async function seedRBU() {
  console.log('🌱 Seeding Ramdeobaba University Nagpur events...');
  
  const { data, error } = await supabase.from('events').insert(rbuEvents).select();

  if (error) {
    console.error('❌ Error inserting RBU events:', error);
  } else {
    console.log(`✅ Successfully added ${data.length} events for Ramdeobaba University Nagpur!`);
    console.log(data.map((e) => `• ${e.title} (${e.event_date})`));
  }
}

seedRBU();
