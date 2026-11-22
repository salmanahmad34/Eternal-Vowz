/**
 * Single Source of Truth for Eternal Vowz FAQs
 * Shared across Homepage UI and Schema.org FAQPage JSON-LD to guarantee 100% exact text parity.
 */

export interface FaqEntry {
  id: string;
  icon: 'sparkles' | 'clock' | 'share' | 'sliders' | 'message' | 'shield';
  bg: string;
  border: string;
  q: string;
  a: string;
  qHinglish?: string;
  aHinglish?: string;
}

export const SHARED_FAQS: FaqEntry[] = [
  {
    id: 'what-is-eternal-vowz',
    icon: 'sparkles',
    bg: 'bg-[#EFF3FF]',
    border: 'border-[#DCE5FF]',
    q: 'What is Eternal Vowz and how long does an invitation stay active?',
    a: 'Eternal Vowz is an online platform to create royal 3D digital wedding invitations for a flat fee of ₹99. Every invitation remains active for 30 days with a live RSVP dashboard, custom wedding music, and unlimited personalized guest links for WhatsApp. Guests experience cinematic lifafa reveals and crackable wax seals directly inside their mobile browser with no app download required.',
    qHinglish: 'Eternal Vowz kya hai aur card kitne din active rehta hai?',
    aHinglish:
      'Eternal Vowz ek online platform hai jahan aap ₹99 me 3D digital wedding invitation bana sakte hain. Card 30 din active rehta hai, usme live RSVP dashboard milta hai, aur aap unlimited guests ko personalized WhatsApp link bhej sakte hain. Isme Lifafa opening, wax seal crack, aur background wedding music ka cinematic royal experience milta hai bina kisi app download ke.',
  },
  {
    id: 'shahi-palace-gate',
    icon: 'sparkles',
    bg: 'bg-[#FDF7EB]',
    border: 'border-[#F3E4C6]',
    q: 'What is the 3D Shahi Palace wedding invitation?',
    a: 'A 3D Shahi Palace wedding invitation is an animated digital card featuring grand palace double doors that smoothly swing open when tapped by guests on their mobile screen. It showcases 24K gold filigree motifs, traditional shehnai or dhol music, interactive wedding timeline schedules, one-tap Google Maps directions, and built-in RSVP confirmation buttons that open directly in any modern mobile web browser.',
    qHinglish: '3D Shahi Palace wedding invitation kya hai?',
    aHinglish:
      '3D Shahi Palace wedding invitation ek royal digital card hai jisme mehmaan jab link kholte hain, toh unke phone par ek grand shahi mahal ke double-door darwaze animated roop se khulte hain. Isme 24K gold filigree, authentic shehnai ya dhol music, event schedule, venue Google Maps, aur RSVP button shamil hota hai jo bina kisi app ke browser me chalta hai.',
  },
  {
    id: 'whatsapp-digital-rsvp',
    icon: 'share',
    bg: 'bg-[#EEFCF3]',
    border: 'border-[#D3F5DF]',
    q: 'How does WhatsApp digital RSVP work in India?',
    a: "WhatsApp digital RSVP allows hosts to send unique, personalized invitation links directly to each guest family from their dashboard. When guests tap the link, they view their personal greeting, select 'Attending' or 'Declined', and specify their guest count. The host's live dashboard updates in real time with confirmed attendee counts, eliminating manual phone calls and preventing catering food waste.",
    qHinglish: 'India me WhatsApp digital RSVP kaise kaam karta hai?',
    aHinglish:
      "India me WhatsApp digital RSVP me host apne dashboard se har mehmaan ke naam ka personalized WhatsApp link bhejta hai. Mehmaan bina kisi app download ke link khol kar 'Attending' ya 'Declined' select karte hain aur kitne log aayenge likh dete hain. Host ke live dashboard par attendance count aur guest details real-time update ho jaati hain.",
  },
  {
    id: 'paper-vs-digital-cost',
    icon: 'clock',
    bg: 'bg-[#ECFCFA]',
    border: 'border-[#D3F5F1]',
    q: 'Are digital wedding invitations cheaper than paper cards?',
    a: 'Yes, digital wedding invitations are significantly more economical. In our real benchmark example, printing 300 paper cards in a tier 2 city at ₹23 per card costs ₹6,900, compared to Eternal Vowz at a flat ₹99 per wedding card. That saves ₹6,801—about 98% less in this example—while also eliminating courier postage, accompanying sweet boxes, and reprint costs for last-minute venue or timing updates.',
    qHinglish: 'Digital wedding invitation paper card se sasta hai kya?',
    aHinglish:
      'Haan, digital wedding invitation paper card se bohot sasta padta hai. Real example ke mutabiq: tier 2 shehar me 300 paper cards ₹23 ke hisaab se print karwane me ₹6,900 kharch hote hain, jabki Eternal Vowz par wahi card sirf ₹99 me banta hai. Is example me direct ₹6,801 ki bachat hoti hai (lagbhag 98% sasta), aur courier ya reprint ka koi extra kharcha nahi lagta.',
  },
  {
    id: 'edit-after-publish',
    icon: 'sliders',
    bg: 'bg-[#F7F0FD]',
    border: 'border-[#EAD9FA]',
    q: 'Can I fill only basic details now and edit later?',
    a: 'Yes! Our Smart Conditional Card Builder only requires couple names, event date, and venue to get started. All optional modules such as timeline schedules, dress codes, catering menus, and accommodations stay hidden unless you choose to enable them. You can update details live anytime from your dashboard.',
    qHinglish: 'Kya main pehle basic details daal kar baad me edit kar sakta hoon?',
    aHinglish:
      'Haan! Hamare Smart Conditional Card Builder me sirf Dulha-Dulhan ka naam, tareeq aur venue daalna zaroori hai. Baaqi sabhi sections (Schedule, Dress Code, Halal Menu, Story) optional hain aur tabhi dikhte hain jab aap unhe bharen. Aap dashboard se kabhi bhi live edit kar sakte hain.',
  },
  {
    id: 'support-and-concierge',
    icon: 'message',
    bg: 'bg-[#FDF7EB]',
    border: 'border-[#F3E4C6]',
    q: 'How do I reach customer support or request a refund?',
    a: 'For any questions or refund requests, write directly to founder Salman Ahmad at mrsalman7307@gmail.com with a guaranteed reply within 24 hours. Approved refunds are credited back to your original payment source within 5 to 7 working days. Once a card is activated, priority WhatsApp concierge support also unlocks in your dashboard.',
    qHinglish: 'Customer support ya refund ke liye kaise contact karein?',
    aHinglish:
      'Kisi bhi sawaal ya refund request ke liye founder Salman Ahmad ko mrsalman7307@gmail.com par email karein, 24 ghante ke andar reply milta hai. Approved refund 5 se 7 working days me original payment source par wapas aa jata hai. Card activate hone ke baad dashboard me priority WhatsApp support bhi milta hai.',
  },
];
