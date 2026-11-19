'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TimelineItem, VenueDetails } from '@/types/database';
import { 
  MapPin, 
  ExternalLink, 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  Heart, 
  Utensils, 
  GlassWater, 
  Music,
  Compass
} from 'lucide-react';

interface EventScheduleProps {
  timeline: TimelineItem[];
  venue: VenueDetails;
  eventDate: string;
  coupleNames: { partner1: string; partner2: string };
  accentColor?: string;
}

const iconMap: Record<string, React.ElementType> = {
  GlassWater,
  Heart,
  Utensils,
  Sparkles,
  Music,
  Clock,
  Compass,
};

export default function EventSchedule({
  timeline,
  venue,
  eventDate,
  coupleNames,
  accentColor = '#C5A059',
}: EventScheduleProps) {
  // Generate Google Calendar Link
  const getGoogleCalendarUrl = () => {
    const startDate = new Date(eventDate);
    const endDate = new Date(startDate.getTime() + 6 * 3600 * 1000); // 6 hours

    const formatCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const title = encodeURIComponent(`The Wedding of ${coupleNames.partner1} & ${coupleNames.partner2}`);
    const details = encodeURIComponent(
      `Celebrating the wedding of ${coupleNames.partner1} & ${coupleNames.partner2}.\nVenue: ${venue.venue_name}, ${venue.address}\nDress Code: ${venue.dress_code || 'Formal'}`
    );
    const location = encodeURIComponent(`${venue.venue_name}, ${venue.address}`);
    const dates = `${formatCalDate(startDate)}/${formatCalDate(endDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  return (
    <div className="w-full my-10 space-y-10">
      {/* Schedule Header */}
      <div className="text-center space-y-1">
        <span className="text-[10px] tracking-[0.3em] font-semibold uppercase text-stone-500 font-sans">
          ORDER OF CELEBRATION
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium">
          The Wedding Itinerary
        </h3>
        <div className="w-12 h-[1px] mx-auto bg-[#C5A059]/60 my-2" />
      </div>

      {/* Timeline Items */}
      <div className="relative border-l border-stone-200/90 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8">
        {timeline.map((item, index) => {
          const IconComponent = (item.icon && iconMap[item.icon]) ? iconMap[item.icon] : Sparkles;

          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative group"
            >
              {/* Timeline Pin Node */}
              <div
                className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FAF8F5] border-2 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"
                style={{ borderColor: accentColor }}
              >
                <IconComponent className="w-3.5 h-3.5 text-stone-700" />
              </div>

              {/* Event Content Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-stone-200/80 shadow-xs hover:border-[#C5A059]/50 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-sans tracking-wide"
                    style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                  >
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                  {item.location && (
                    <span className="text-xs text-stone-500 font-sans flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      {item.location}
                    </span>
                  )}
                </div>

                <h4 className="font-serif text-lg sm:text-xl text-stone-900 font-medium">
                  {item.title}
                </h4>

                {item.description && (
                  <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Venue & Location Box */}
      <div className="bg-stone-50/90 rounded-2xl p-6 sm:p-7 border border-stone-200/90 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <MapPin className="w-5 h-5" style={{ color: accentColor }} />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.25em] font-semibold uppercase text-stone-500 font-sans">
              VENUE & SANCTUARY
            </span>
            <h4 className="font-serif text-xl sm:text-2xl text-stone-900 font-semibold">
              {venue.venue_name}
            </h4>
            {venue.hall_name && (
              <p className="text-sm font-sans text-stone-700 font-medium">{venue.hall_name}</p>
            )}
            <p className="text-xs sm:text-sm font-sans text-stone-600 leading-relaxed">
              {venue.address}
            </p>
            {venue.dress_code && (
              <div className="pt-2 text-xs font-sans text-stone-500">
                <span className="font-semibold text-stone-700">Attire: </span>
                {venue.dress_code}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons: Open Maps & Add to Calendar */}
        <div className="pt-3 border-t border-stone-200/80 flex flex-col sm:flex-row gap-2.5">
          <a
            href={venue.maps_url || `https://maps.google.com/?q=${encodeURIComponent(venue.venue_name + ' ' + venue.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-sans text-xs sm:text-sm font-medium shadow-xs transition-colors"
          >
            <MapPin className="w-4 h-4 text-[#C5A059]" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-sans text-xs sm:text-sm font-medium transition-colors"
          >
            <CalendarIcon className="w-4 h-4 text-[#C5A059]" />
            <span>Add to Calendar</span>
          </a>
        </div>
      </div>
    </div>
  );
}
