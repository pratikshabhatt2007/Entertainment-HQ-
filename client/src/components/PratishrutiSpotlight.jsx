import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import BookingModal from './BookingModal';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ARTIST_PHOTOS } from '../data/artistPhotos';
import {
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Share2,
  Music,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Ticket,
  Flame,
  CheckCircle2,
} from 'lucide-react';

const SINGER_CONCERT_SLIDES = [
  {
    id: 1,
    title: 'AURA stadium scale with giant gold-lit visuals',
    category: 'AURA Era',
    image: ARTIST_PHOTOS[0],
    desc: 'A premium stage build with towering LED walls, smoke bursts, and that larger-than-life Diljit entrance energy.',
    color: 'from-amber-500 to-red-600',
  },
  {
    id: 2,
    title: 'Punjabi-pop melodies, crowd chants, and singalong hooks',
    category: 'Live Anthem',
    image: ARTIST_PHOTOS[1],
    desc: 'The mood shifts from smooth romantic phrasing to all-out crowd takeover, built around fan-favourite songs.',
    color: 'from-fuchsia-500 to-purple-600',
  },
  {
    id: 3,
    title: 'Fashion-led visuals with a global Punjabi concert mood',
    category: 'Global Tour',
    image: ARTIST_PHOTOS[2],
    desc: 'The look is sleek, dark, high-contrast, and stadium-ready, matching the sharp aesthetic of a modern official artist site.',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 4,
    title: 'Finale moments built for phones, fireworks, and fan videos',
    category: 'Closing Energy',
    image: ARTIST_PHOTOS[0],
    desc: 'Confetti, laser sweeps, and a full-arena singalong are the kind of finish this spotlight section is designed to suggest.',
    color: 'from-emerald-500 to-teal-600',
  },
];

export default function PratishrutiSpotlight({ onShare }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const { user } = useAuth();
  const { addRegistration } = useNotifications();

  // Auto-advance photos one by one
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SINGER_CONCERT_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    setCurrentSlide((prev) => (prev + 1) % SINGER_CONCERT_SLIDES.length);
  };

  const prevSlide = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    setCurrentSlide((prev) => (prev - 1 + SINGER_CONCERT_SLIDES.length) % SINGER_CONCERT_SLIDES.length);
  };

  const slide = SINGER_CONCERT_SLIDES[currentSlide];

  const handleBookingComplete = (attendee) => {
    addRegistration({
      id: `aura-${Date.now()}`,
      ticket_id: `AURA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      status: 'registered',
      events: { id: 'evt-diljit-aura-mumbai', title: 'Diljit Dosanjh AURA Mumbai Stadium Night', event_date: '2026-08-30', location: 'DY Patil Stadium, Navi Mumbai' },
      ...attendee,
    });
    setBookingModalOpen(false);
  };

  return (
    <>
      {/* Booking Modal */}
      {bookingModalOpen && (
        <BookingModal
          event={{ id: 'evt-diljit-aura-mumbai', title: 'Diljit Dosanjh AURA Mumbai Stadium Night', price: '₹4,999', event_date: '2026-08-30', event_time: '18:30:00', location: 'DY Patil Stadium, Navi Mumbai', singer_name: 'Diljit Dosanjh' }}
          onClose={() => setBookingModalOpen(false)}
          onComplete={handleBookingComplete}
        />
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ scale: 1.15, opacity: 0.5 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          {/* Section Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30 shadow-md">
              <TrendingUp className="w-4 h-4 animate-bounce text-amber-500" />
              <span>Official spotlight concert • AURA world tour</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                <span>Starting from ₹4,999</span>
              </span>
            </div>
          </div>

          {/* Spotlight Concert Card Container */}
          <div className="group relative rounded-3xl overflow-hidden bg-slate-950 border-2 border-amber-500/40 hover:border-amber-400 shadow-2xl shadow-amber-500/10 transition-all duration-500">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
              
              {/* Left Column: Singer Photo Slideshow */}
              <div className="lg:col-span-7 relative h-80 lg:h-auto overflow-hidden bg-slate-950">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={slide.id}
                    src={slide.image}
                    alt={slide.title}
                    initial={{ opacity: 0, scale: 1.12 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />

                {/* Singer Category Pill */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black text-white bg-gradient-to-r ${slide.color} shadow-lg backdrop-blur-md`}>
                    <Music className="w-4 h-4" />
                    <span>{slide.category}</span>
                  </span>
                </div>

                {/* Slideshow Control Buttons */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="p-2.5 rounded-full bg-slate-950/80 hover:bg-amber-500 text-white hover:text-slate-950 backdrop-blur-md border border-slate-700 transition-all cursor-pointer shadow-lg"
                    title="Previous concert frame"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-2.5 rounded-full bg-slate-950/80 hover:bg-amber-500 text-white hover:text-slate-950 backdrop-blur-md border border-slate-700 transition-all cursor-pointer shadow-lg"
                    title="Next concert frame"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Slideshow Indicator Dots */}
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                  {SINGER_CONCERT_SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2.5 bg-slate-600 hover:bg-slate-400'
                      }`}
                      title={s.title}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Singer & Concert Details */}
              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6 bg-slate-950/95 text-white">
                <div className="space-y-4">
                  
                  {/* Singer Name & Event Tag */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-amber-400 bg-amber-500/10 px-3 py-0.5 rounded-md border border-amber-500/30">
                        OFFICIAL TOUR DESTINATION
                      </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-300">
                      DILJIT DOSANJH
                    </h2>
                    <p className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                      Sound of a Nation • AURA World Tour
                    </p>
                  </div>

                  {/* Slide Description */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={slide.id}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <h3 className="text-lg font-bold text-indigo-300">{slide.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {slide.desc}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Highlights Tags */}
                  <div className="pt-1 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-extrabold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Fan pit access
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-extrabold flex items-center gap-1">
                      <Music className="w-3.5 h-3.5" /> Hit songs live
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-extrabold flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5" /> Instant digital pass
                    </span>
                  </div>

                </div>

                {/* Event Date, Venue & Price Badge */}
                <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-bold text-white">Aug 30, 2026</span>
                    <span className="text-slate-500">•</span>
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>06:30 PM IST Onwards</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">DY Patil Stadium, Navi Mumbai</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400 font-semibold">BOOKING STARTS:</span>
                    <span className="text-xl font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                      ₹4,999
                    </span>
                  </div>
                </div>

                {/* Footer CTA Actions */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setBookingModalOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs tracking-wider shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>BOOK AURA PASSES</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => onShare && onShare(e, 'evt-diljit-aura-mumbai', 'Diljit Dosanjh AURA Mumbai Stadium Night')}
                    className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Share concert event"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </motion.div>
      </section>
    </>
  );
}
