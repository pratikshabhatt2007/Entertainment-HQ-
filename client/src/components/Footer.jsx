import React from 'react';
import { Link } from 'react-router-dom';
import { Music2, Heart, Instagram, Twitter, Youtube, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="concert-frame mx-3 mb-3 rounded-3xl bg-[#0D0B15]/95 backdrop-blur-md
      pt-14 pb-8
      text-stone-500 dark:text-stone-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="md:col-span-1 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="p-2 rounded-xl bg-yellow-500/20 border border-yellow-500/30 dark:border-yellow-400/20">
                <Music2 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <span className="text-lg font-black bg-gradient-to-r from-yellow-600 to-red-600 dark:from-yellow-400 dark:to-red-400 bg-clip-text text-transparent">
                  EntertainmentHQ
                </span>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-600">India's entertainment booking platform</p>
              </div>
            </Link>
            <p className="text-xs text-stone-500 dark:text-stone-500 leading-relaxed">
              Blockbusters, beats, and belly laughs—all in one place. From screen to stage, your seat is waiting.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {[
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Youtube, label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  title={label}
                  className="p-2 rounded-xl bg-stone-200 dark:bg-white/5 hover:bg-yellow-100 dark:hover:bg-yellow-500/10 border border-stone-300 dark:border-white/10 hover:border-yellow-300 dark:hover:border-yellow-500/30 text-stone-500 dark:text-stone-400 hover:text-yellow-700 dark:hover:text-yellow-400 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-stone-700 dark:text-stone-300">Explore</h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { label: 'Concerts', to: '/' },
                { label: 'Stand-up comedy', to: '/comedy' },
                { label: 'Movies', to: '/movies' },
                { label: 'Concert Calendar', to: '/calendar' },
                { label: 'My Inventory', to: '/my-registrations' },
                { label: 'Fan Lounge', to: '/profile' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors font-medium">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tours */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-stone-700 dark:text-stone-300">Entertainment Cities</h4>
            <ul className="space-y-2.5 text-xs">
              {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Goa', 'Jaipur'].map((city) => (
                <li key={city} className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-yellow-500 shrink-0" />
                  <span className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors cursor-pointer font-medium">{city}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-stone-700 dark:text-stone-300">Contact</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                <span>hello@entertainmenthq.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                <span>+91 98765 22011</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                <span>Mumbai entertainment desk</span>
              </li>
            </ul>

            {/* Newsletter placeholder */}
            <div className="pt-2 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-600">Get Entertainment Alerts</p>
              <div className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="fan@email.com"
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl text-xs bg-white dark:bg-white/5 border border-stone-300 dark:border-white/10 text-stone-700 dark:text-stone-300 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-yellow-500 transition-colors"
                />
                <button className="px-3 py-2 rounded-xl btn-gold text-stone-900 text-xs font-black shrink-0">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider + Bottom */}
        <div className="pt-8 border-t border-stone-200 dark:border-yellow-900/10 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-stone-400 dark:text-stone-600">
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>where cinema, live concerts, and stand-up collide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
