/** Public event catalog with API helpers. The local catalog keeps the storefront useful
 * until an authorised ticketing/event feed is connected. */
import { ARTIST_PHOTOS } from '../data/artistPhotos';

const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 3500);
  try {
    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to execute request.');
    return data;
  } finally { window.clearTimeout(timeoutId); }
};

const show = (id, singer, city, date, venue, category, price, image, description, capacity) => ({
  id, singer_name: singer, title: `${singer} Live in ${city}`, city, event_date: date,
  event_time: '19:00:00', location: venue, category, price: `From ₹${price.toLocaleString('en-IN')}`,
  image_url: image, description, capacity, seats_remaining: Math.round(capacity * 0.18),
  organizer: 'Concerts Manager Demo Schedule', status: 'upcoming',
  tags: [singer, city, category, 'Demo listing'],
  price_tiers: [
    { name: 'Fan Pit', price: price, seats: 80 },
    { name: 'Gold', price: Math.round(price * 1.8 / 100) * 100, seats: 250 },
    { name: 'Platinum', price: Math.round(price * 3.2 / 100) * 100, seats: 120 },
  ],
});

const movie = (id, actor, film, city, date, venue, category, price, image, description, capacity) => ({
  ...show(id, actor, city, date, venue, category, price, image, description, capacity),
  title: `${film} — ${actor}`,
  tags: [actor, film, city, category, 'Archive screening'],
});

export const CURATED_CONCERTS = [
  show('evt-diljit-aura-mumbai', 'Diljit Dosanjh', 'Mumbai', '2026-08-30', 'DY Patil Stadium, Navi Mumbai', 'AURA World Tour', 3299, '/images/diljit-01.jpg', 'Diljit Dosanjh brings the AURA World Tour to Mumbai for a stadium night of Punjabi pop and live anthems.', 42000),
  show('evt-diljit-aura-delhi', 'Diljit Dosanjh', 'New Delhi', '2026-09-12', 'Jawaharlal Nehru Stadium, New Delhi', 'AURA World Tour', 3299, '/images/diljit-02.jpg', 'The Delhi stop of Diljit Dosanjh’s AURA World Tour, with a full live band and immersive production.', 38000),
  show('arijit-mumbai-2026', 'Arijit Singh', 'Mumbai', '2026-09-05', 'DY Patil Stadium, Navi Mumbai', 'Bollywood Live', 2999, '/images/singer_concert_1.jpg', 'An intimate-to-anthemic evening of Bollywood melodies and arena-scale singalongs.', 42000),
  show('shreya-pune-2026', 'Shreya Ghoshal', 'Pune', '2026-09-13', 'Mahalaxmi Lawns, Pune', 'Melody Night', 2499, '/images/singer_concert_2.jpg', 'A full live set celebrating contemporary favourites and timeless Hindi classics.', 18000),
  show('ap-dhillon-delhi-2026', 'AP Dhillon', 'New Delhi', '2026-09-20', 'Jawaharlal Nehru Stadium, New Delhi', 'Punjabi Pop', 3499, '/images/singer_concert_3.jpg', 'High-energy Punjabi pop, immersive visuals and a late-night festival atmosphere.', 30000),
  show('badshah-bengaluru-2026', 'Badshah', 'Bengaluru', '2026-09-27', 'BIEC, Bengaluru', 'Hip-Hop Night', 1999, '/images/singer_concert_4.jpg', 'A bass-heavy hip-hop set built for dance floors, stadium chants and guest moments.', 22000),
  show('king-jaipur-2026', 'King', 'Jaipur', '2026-10-04', 'Jaipur Exhibition & Convention Centre', 'Pop & Hip-Hop', 1799, '/images/singer_concert_1.jpg', 'A headline performance packed with pop hooks, rap verses and cinematic stage design.', 16000),
  show('sunidhi-hyderabad-2026', 'Sunidhi Chauhan', 'Hyderabad', '2026-10-11', 'Gachibowli Indoor Stadium, Hyderabad', 'Live Vocal Show', 2299, '/images/singer_concert_2.jpg', 'A powerhouse vocal show moving from dance-floor hits to unforgettable film songs.', 14000),
  show('anuv-chennai-2026', 'Anuv Jain', 'Chennai', '2026-10-18', 'YMCA Grounds, Chennai', 'Indie Evening', 1499, '/images/singer_concert_3.jpg', 'A warm, acoustic-led evening for fans of intimate indie music and soft singalongs.', 11000),
  show('ritviz-goa-2026', 'Ritviz', 'Goa', '2026-11-01', 'Vagator Open Air, Goa', 'Electronic Live', 1899, '/images/singer_concert_4.jpg', 'Sunset electronic pop, live percussion and an open-air festival close.', 10000),
];

// Promotional photos show the named performers. Dates and venues are clearly
// marked as demo listings until an authorised ticketing feed is connected.
export const CURATED_COMEDY = [
  show('comedy-zakir-mumbai', 'Zakir Khan', 'Mumbai', '2026-09-06', 'NCPA, Mumbai', 'Storytelling Comedy', 999, 'https://www.inquilab.com/images/2025/Jun/zakir-0606_d.jpg', 'A demo listing for a warm, story-led stand-up night.', 900),
  show('comedy-bassi-delhi', 'Anubhav Singh Bassi', 'New Delhi', '2026-09-19', 'Siri Fort Auditorium, New Delhi', 'Stand-up Comedy', 899, 'https://images.indianexpress.com/2023/07/anubhav-bassi.jpg', 'A demo listing for an observational comedy set.', 1100),
  show('comedy-vir-pune', 'Vir Das', 'Pune', '2026-10-03', 'Bal Gandharva Rang Mandir, Pune', 'Comedy Special', 1199, 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/202111/Vir_Das_For_India_1200x768.jpeg?size=1200%3A675', 'A demo listing for a sharp, global comedy special.', 800),
  show('comedy-pranit-mumbai', 'Pranit More', 'Mumbai', '2026-10-10', 'The Royal Opera House, Mumbai', 'Stand-up Comedy', 799, 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=85', 'A demo listing for a high-energy Marathi and Hindi comedy night.', 650),
  show('comedy-rahul-bengaluru', 'Rahul Dua', 'Bengaluru', '2026-10-17', 'Good Shepherd Auditorium, Bengaluru', 'Crowd-work Comedy', 749, 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=85', 'A demo listing for a fast, interactive stand-up set.', 700),
  show('comedy-gaurav-hyderabad', 'Gaurav Kapoor', 'Hyderabad', '2026-10-24', 'Shilpakala Vedika, Hyderabad', 'Stand-up Comedy', 899, 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1200&q=85', 'A demo listing for a sports, travel and everyday-life comedy special.', 900),
  show('comedy-akhil-pune', 'Aakash Gupta', 'Pune', '2026-11-01', 'Yashwantrao Chavan Natyagruha, Pune', 'Character Comedy', 699, 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=85', 'A demo listing for an animated character-driven comedy show.', 600),
  show('comedy-abhishek-delhi', 'Abhishek Upmanyu', 'New Delhi', '2026-11-08', 'Kamani Auditorium, New Delhi', 'Observational Comedy', 999, 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=85', 'A demo listing for a witty observational comedy evening.', 800),
];

export const CURATED_MOVIES = [
  movie('movie-srk-mumbai', 'Shah Rukh Khan & Deepika Padukone', 'Chennai Express', 'Mumbai', '2026-09-11', 'PVR ICON, Phoenix Palladium', 'Hindi Cinema', 350, 'https://cdn.district.in/movies-assets/images/cinema/chennai-express_-608x800-4bcebd20-3506-11ee-a3fe-6d0a80a1228c.jpg', 'A demo cinema listing featuring Shah Rukh Khan and Deepika Padukone.', 240),
  movie('movie-deepika-delhi', 'Deepika Padukone, Amitabh Bachchan & Irrfan Khan', 'Piku', 'New Delhi', '2026-09-18', 'PVR Select Citywalk, New Delhi', 'Hindi Cinema', 320, 'https://images.indianexpress.com/2015/03/piku-poster2-embed.jpg', 'A demo cinema listing featuring Deepika Padukone.', 200),
  movie('movie-allu-bengaluru', 'Allu Arjun', 'Ala Vaikunthapurramuloo', 'Bengaluru', '2026-10-02', 'PVR Orion Mall, Bengaluru', 'Telugu Cinema', 300, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Allu_Arjun_at_the_62nd_Filmfare_awards_south.jpg/640px-Allu_Arjun_at_the_62nd_Filmfare_awards_south.jpg', 'A demo cinema listing featuring Allu Arjun.', 220),
  movie('movie-varun-mumbai', 'Varun Dhawan', 'Badlapur', 'Mumbai', '2026-08-23', 'PVR ICON, Phoenix Palladium', 'Archive Screening', 280, 'https://static.moviecrow.com/gallery/20141201/50683-fl2.jpg', 'An archive screening listing for Badlapur featuring Varun Dhawan.', 240),
  movie('movie-varun-delhi', 'Varun Dhawan & Alia Bhatt', 'Badrinath Ki Dulhania', 'New Delhi', '2026-08-30', 'PVR Select Citywalk, New Delhi', 'Archive Screening', 280, 'https://venkatarangan.com/wp-content/uploads/2017/07/badrinath-ki-dulhania-film.jpg', 'An archive screening listing for Badrinath Ki Dulhania featuring Varun Dhawan and Alia Bhatt.', 220),
  movie('movie-ranbir-pune', 'Ranbir Kapoor', 'Wake Up Sid', 'Pune', '2026-09-04', 'PVR Market City, Pune', 'Archive Screening', 300, 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=85', 'An archive screening listing for Wake Up Sid featuring Ranbir Kapoor.', 200),
  movie('movie-alia-bengaluru', 'Alia Bhatt & Shah Rukh Khan', 'Dear Zindagi', 'Bengaluru', '2026-09-09', 'PVR Nexus Mall, Bengaluru', 'Archive Screening', 300, 'https://m.media-amazon.com/images/M/MV5BOGMxMGEwY2QtYzE5ZS00ZjA0LWI1OGMtNjI4ZDE5MGUxNGQ4XkEyXkFqcGc%40._V1_.jpg', 'An archive screening listing for Dear Zindagi featuring Alia Bhatt and Shah Rukh Khan.', 220),
  movie('movie-rashmika-hyderabad', 'Rashmika Mandanna', 'Geetha Govindam', 'Hyderabad', '2026-09-14', 'AMB Cinemas, Hyderabad', 'Telugu Cinema', 320, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85', 'An archive screening listing featuring Rashmika Mandanna.', 250),
  movie('movie-vicky-mumbai', 'Vicky Kaushal', 'Masaan', 'Mumbai', '2026-09-21', 'PVR ICON, Phoenix Palladium', 'Archive Screening', 300, 'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?auto=format&fit=crop&w=1200&q=85', 'An archive screening listing for Masaan featuring Vicky Kaushal.', 230),
];

const filterCatalog = (events, params) => events.filter((event) => {
  const search = params.search?.trim().toLowerCase();
  const haystack = [event.title, event.singer_name, event.city, event.location, event.category, ...event.tags].join(' ').toLowerCase();
  return (!search || haystack.includes(search)) && (!params.category || params.category === 'All' || event.category === params.category);
});

export const fetchEvents = async (params = {}) => {
  // The curated catalogue deliberately powers public discovery until a verified provider feed is configured.
  return { events: filterCatalog(CURATED_CONCERTS, params) };
};

export const fetchEventById = async (id) => {
  const event = [...CURATED_CONCERTS, ...CURATED_COMEDY, ...CURATED_MOVIES].find((item) => item.id === id);
  if (event) return { event };
  return apiRequest(`/events/${id}`);
};

export const createEvent = (eventData, token) => apiRequest('/events', 'POST', eventData, token);
export const updateEvent = (id, eventData, token) => apiRequest(`/events/${id}`, 'PUT', eventData, token);
export const deleteEvent = (id, token) => apiRequest(`/events/${id}`, 'DELETE', null, token);
export const fetchEventAttendees = (id, token) => apiRequest(`/events/${id}/attendees`, 'GET', null, token);
