'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Can I bring a plus-one or additional guests?',
    answer: 'Due to venue seating capacity, we can only accommodate the guests explicitly named on your digital invitation card. Check your personalized RSVP section above for your party details.',
  },
  {
    question: 'Are children invited to the celebration?',
    answer: 'While we adore your little ones, our ceremony and evening reception will be an adults-only celebration (12+), allowing all guests to unwind and celebrate together.',
  },
  {
    question: 'What time should I arrive at the venue?',
    answer: 'The wedding ceremony begins promptly at 4:30 PM. We kindly ask guests to arrive between 3:45 PM and 4:15 PM to enjoy welcome refreshments and find their seats before the processional.',
  },
  {
    question: 'Is there parking available on-site?',
    answer: 'Yes! Complimentary valet parking will be available at the main estate entrance upon arrival for all attendees.',
  },
  {
    question: 'What is the ceremony unplugged policy?',
    answer: 'We invite you to be truly present with us during our holy matrimony. We kindly request an unplugged ceremony with all phones and cameras silenced and tucked away. Our professional photographers will capture every moment!',
  },
];

export default function FaqAccordion({ accentColor = '#C5A059' }: { accentColor?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full my-12 text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <HelpCircle className="w-4 h-4 text-[#C5A059]" />
        <span className="text-[10px] sm:text-xs font-sans font-semibold tracking-[0.25em] uppercase text-stone-500">
          QUESTIONS &amp; ANSWERS
        </span>
      </div>
      <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium mb-3">
        Frequently Asked Questions
      </h3>
      <p className="font-serif italic text-stone-600 text-sm max-w-md mx-auto mb-8">
        Everything you need to know about our big day, travel, and schedule.
      </p>

      <div className="max-w-xl mx-auto space-y-3 text-left">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-stone-200/90 bg-white/80 overflow-hidden transition-all duration-200 hover:border-stone-300"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 focus:outline-none"
              >
                <span className="font-serif text-stone-900 font-medium text-base sm:text-lg">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-[#C5A059]' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 font-sans leading-relaxed border-t border-stone-100">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
