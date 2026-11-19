'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Invitation, GuestWithRsvp, HostUser, ThemeId, TimelineItem, FaqItem } from '@/types/database';
import { DataService, INITIAL_DEMO_INVITATION } from '@/lib/data-service';
import { THEMES } from '@/lib/themes';
import EnvelopeExperience from '@/components/envelope/EnvelopeExperience';
import { WeddingFooter } from '@/components/layout/WeddingSiteChrome';
import { EternalLogoBadge } from '@/components/layout/EternalLoader';
import {
  Mail,
  Heart,
  DoorOpen,
  ShieldCheck,
  Users,
  Eye,
  Check,
  X,
  Plus,
  Copy,
  Share2,
  Download,
  Trash2,
  Utensils,
  MessageSquare,
  Clock,
  ExternalLink,
  Search,
  Edit3,
  Layers,
  MapPin,
  LogOut,
  RotateCcw,
  Smartphone,
  Trash,
} from 'lucide-react';

export default function DashboardPage() {
  const [hostUser, setHostUser] = useState<HostUser | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [allGuests, setAllGuests] = useState<GuestWithRsvp[]>([]);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation>(INITIAL_DEMO_INVITATION);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'overview' | 'builder'>('overview');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'declined' | 'pending'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestMax, setNewGuestMax] = useState(2);
  const [newGuestGroup, setNewGuestGroup] = useState('Family');

  const [draftCard, setDraftCard] = useState<Invitation>(INITIAL_DEMO_INVITATION);
  const [replayTrigger, setReplayTrigger] = useState(0);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [showMobilePreviewModal, setShowMobilePreviewModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const user = DataService.getCurrentUser();
    setHostUser(user);

    const cards = await DataService.getAllInvitations();
    const guests = await DataService.getAllGuests();
    setInvitations(cards);
    setAllGuests(guests);

    if (cards.length > 0) {
      const current = cards.find((c) => c.id === selectedInvitation?.id) || cards[0];
      setSelectedInvitation(current);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartCreateNewCard = () => {
    const newBlankCard: Invitation = {
      id: `draft-${Date.now()}`,
      slug: `nikah-${Math.random().toString(36).substring(2, 7)}`,
      theme_id: 'royal-emerald',
      title: 'Blessed Nikah & Walima Celebration',
      event_date: '2027-11-20T18:00:00Z',
      venue_details: {
        venue_name: 'Royal Heritage Palace Lawn',
        hall_name: 'Grand Darbar Hall',
        address: '120 Palace Road, Civil Lines',
        maps_url: 'https://maps.google.com',
        city: 'Mumbai',
        dress_code: 'Modest & Traditional Attire',
      },
      design_config: {
        couple_names: {
          partner1: 'FATIMA',
          partner2: 'HAMZA',
        },
        subtitle: 'BISMILLAHIR RAHMANIR RAHIM • TOGETHER WITH THEIR FAMILIES',
        wax_seal_initial: 'F&H',
        music_track: 'royal-harp',
        accent_color: '#D4AF37',
        font_style: 'cormorant',
        show_timeline: true,
        timeline: [
          {
            id: '1',
            time: '18:00',
            title: 'NIKAH',
            location: 'Royal Courtyard',
            description: 'Blessed Nikah ceremony & collective Dua',
          },
          {
            id: '2',
            time: '20:00',
            title: 'WALIMA DAWAT',
            location: 'Grand Banquet Lawn',
            description: '100% Halal Royal Dinner & Blessings',
          },
        ],
        show_dress_code: true,
        ladies_attire: 'Modest Gown / Abaya',
        gents_attire: 'Sherwani / Classic Suit',
        show_story: true,
        show_couple_portrait: true,
        story:
          'Alhamdulillah, with the blessings of our parents, we invite you and your family to grace our wedding ceremony with your prayers and presence.',
        show_menu: false,
        menu_starter_title: 'Zafrani Seekh Kebab & Paneer Tikka',
        menu_starter_desc: 'Charcoal-grilled halal kebabs with mint chutney',
        menu_main_title: 'Shahi Dum Biryani & Mutton Rogan Josh',
        menu_main_desc: 'Fragrant saffron basmati rice & slow-cooked halal cuts',
        menu_dessert_title: 'Shahi Rose Phirni & Pistachio Baklava',
        menu_dessert_desc: 'Chilled saffron pudding with crushed pistachios',
        show_gifts: false,
        gift_note: 'Your duas and presence are our greatest gift.',
        bank_account_holder: '',
        bank_account_number: '',
        show_accommodation: false,
        accommodation_name: '',
        accommodation_note: '',
        accommodation_url: '',
        show_faq: false,
        faqs: [],
        show_rsvp: true,
      },
      is_published: true,
    };

    setEditingCardId(null);
    setDraftCard(newBlankCard);
    setActiveTab('builder');
  };

  const handleEditExistingCard = (card: Invitation) => {
    setEditingCardId(card.id);
    setDraftCard(JSON.parse(JSON.stringify(card)));
    setActiveTab('builder');
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug =
      `${draftCard.design_config.couple_names.partner1}-${draftCard.design_config.couple_names.partner2}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `card-${Date.now()}`;

    if (editingCardId) {
      const updated = await DataService.updateInvitation(editingCardId, {
        ...draftCard,
        slug: draftCard.slug || cleanSlug,
      });
      setSelectedInvitation(updated);
      setSaveToast('Card updated. Only filled sections are shown on your invitation.');
    } else {
      const uniqueSlug = `${cleanSlug}-${Math.random().toString(36).substring(2, 5)}`;
      const created = await DataService.createInvitation({
        slug: uniqueSlug,
        theme_id: draftCard.theme_id,
        title:
          draftCard.title ||
          `Wedding of ${draftCard.design_config.couple_names.partner1} & ${draftCard.design_config.couple_names.partner2}`,
        event_date: draftCard.event_date,
        venue_details: draftCard.venue_details,
        design_config: draftCard.design_config,
        is_published: true,
      });
      setSelectedInvitation(created);
      setSaveToast('New card created. Share it on WhatsApp or manage guests below.');
    }

    await loadData();
    setTimeout(() => {
      setSaveToast(null);
      setActiveTab('overview');
    }, 1000);
  };

  const handleDeleteCard = async (id: string) => {
    await DataService.deleteInvitation(id);
    await loadData();
  };

  const selectedCardGuests = allGuests.filter((g) => g.invitation_id === selectedInvitation.id);

  const totalInvitedParties = selectedCardGuests.length;
  const linksOpenedCount = selectedCardGuests.filter((g) => Boolean(g.link_opened_at)).length;
  const confirmedParties = selectedCardGuests.filter((g) => g.rsvp?.status === 'attending');
  const totalConfirmedHeadcount = confirmedParties.reduce(
    (sum, g) => sum + (g.rsvp?.headcount || 0),
    0
  );
  const declinedCount = selectedCardGuests.filter((g) => g.rsvp?.status === 'declined').length;
  const pendingCount = selectedCardGuests.filter(
    (g) => !g.rsvp || g.rsvp.status === 'pending'
  ).length;

  const mealCounts: Record<string, number> = {};
  confirmedParties.forEach((g) => {
    const meal = g.rsvp?.meal_choice || 'Standard Halal Feast';
    mealCounts[meal] = (mealCounts[meal] || 0) + (g.rsvp?.headcount || 1);
  });

  const getGuestInviteUrl = (guest: GuestWithRsvp, card: Invitation = selectedInvitation) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return `${origin}/invite/${card.slug}?guest=${guest.unique_token}`;
  };

  const getCardPublicUrl = (card: Invitation) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return `${origin}/invite/${card.slug}`;
  };

  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareWhatsApp = (guest: GuestWithRsvp, card: Invitation = selectedInvitation) => {
    const url = getGuestInviteUrl(guest, card);
    const couple = `${card.design_config.couple_names.partner1} & ${card.design_config.couple_names.partner2}`;
    const message =
      `Assalamu Alaikum / Greetings *${guest.guest_name}*,\n\n` +
      `We warmly invite you and your family to the wedding celebration of *${couple}*.\n\n` +
      `Tap below to open your personalized 3D Digital Lifafa & submit your RSVP:\n` +
      `${url}\n\n` +
      `Warm regards,\n${couple}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    await DataService.addGuest(selectedInvitation.id, {
      guest_name: newGuestName.trim(),
      phone: newGuestPhone.trim(),
      email: newGuestEmail.trim(),
      max_allowed_guests: Number(newGuestMax) || 2,
      group_tag: newGuestGroup,
    });

    setNewGuestName('');
    setNewGuestPhone('');
    setNewGuestEmail('');
    setNewGuestMax(2);
    setIsAddModalOpen(false);
    await loadData();
  };

  const handleDeleteGuest = async (guestId: string) => {
    await DataService.deleteGuest(guestId);
    await loadData();
  };

  const handleExportCSV = () => {
    const headers = [
      'Guest Name',
      'Group Tag',
      'Phone',
      'Link Opened',
      'RSVP Status',
      'Confirmed Headcount',
      'Halal Meal Preference',
      'Message',
      'Personalized URL',
    ];
    const rows = selectedCardGuests.map((g) => [
      `"${g.guest_name.replace(/"/g, '""')}"`,
      `"${g.group_tag || 'General'}"`,
      `"${g.phone || ''}"`,
      `"${g.link_opened_at ? new Date(g.link_opened_at).toLocaleString() : 'Not Opened'}"`,
      `"${g.rsvp?.status?.toUpperCase() || 'PENDING'}"`,
      g.rsvp?.status === 'attending' ? g.rsvp.headcount : 0,
      `"${(g.rsvp?.meal_choice || '').replace(/"/g, '""')}"`,
      `"${(g.rsvp?.message || '').replace(/"/g, '""')}"`,
      `"${getGuestInviteUrl(g)}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `${selectedInvitation.slug}-rsvp-list.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredGuests = selectedCardGuests.filter((g) => {
    const matchesSearch =
      g.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.group_tag || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return !g.rsvp || g.rsvp.status === 'pending';
    return g.rsvp?.status === statusFilter;
  });

  const countActiveOptionalSections = (card: Invitation) => {
    const c = card.design_config;
    let count = 0;
    if (c.show_timeline !== false && c.timeline?.length > 0) count++;
    if (c.show_dress_code !== false) count++;
    if (c.show_story !== false && c.story?.trim()) count++;
    if (c.show_menu) count++;
    if (c.show_gifts) count++;
    if (c.show_accommodation) count++;
    if (c.show_faq && c.faqs && c.faqs.length > 0) count++;
    return count;
  };

  const addTimelineSlot = () => {
    const nextItem: TimelineItem = {
      id: `${Date.now()}`,
      time: '20:00',
      title: 'WALIMA DAWAT',
      location: 'Main Banquet Hall',
      description: 'Royal Halal Dinner & Blessings',
    };
    setDraftCard({
      ...draftCard,
      design_config: {
        ...draftCard.design_config,
        timeline: [...(draftCard.design_config.timeline || []), nextItem],
      },
    });
  };

  const updateTimelineSlot = (idx: number, field: keyof TimelineItem, val: string) => {
    const list = [...(draftCard.design_config.timeline || [])];
    list[idx] = { ...list[idx], [field]: val };
    setDraftCard({
      ...draftCard,
      design_config: { ...draftCard.design_config, timeline: list },
    });
  };

  const removeTimelineSlot = (idx: number) => {
    const list = (draftCard.design_config.timeline || []).filter((_, i) => i !== idx);
    setDraftCard({
      ...draftCard,
      design_config: { ...draftCard.design_config, timeline: list },
    });
  };

  const addFaqSlot = () => {
    const nextFaq: FaqItem = {
      q: 'Is the catering 100% Halal?',
      a: 'Yes, all dishes and beverages served at our wedding are 100% Halal certified.',
    };
    setDraftCard({
      ...draftCard,
      design_config: {
        ...draftCard.design_config,
        faqs: [...(draftCard.design_config.faqs || []), nextFaq],
      },
    });
  };

  const updateFaqSlot = (idx: number, field: 'q' | 'a', val: string) => {
    const list = [...(draftCard.design_config.faqs || [])];
    list[idx] = { ...list[idx], [field]: val };
    setDraftCard({
      ...draftCard,
      design_config: { ...draftCard.design_config, faqs: list },
    });
  };

  const removeFaqSlot = (idx: number) => {
    const list = (draftCard.design_config.faqs || []).filter((_, i) => i !== idx);
    setDraftCard({
      ...draftCard,
      design_config: { ...draftCard.design_config, faqs: list },
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#291418] font-sans flex flex-col justify-between">
      <div>
      {/* =========================================================================
          EDITORIAL CHAMPAGNE GOLD DASHBOARD HEADER (ETERNAL VOWZ • E&V)
      ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/85 backdrop-blur-md border-b border-[#E2D7BD]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <EternalLogoBadge size="md" animated />
            <div>
              <span className="font-serif text-2xl font-semibold tracking-tight text-[#291418] block leading-none">
                Eternal Vowz
              </span>
              <span className="text-[9px] uppercase tracking-[0.22em] text-[#8B7355] font-medium block mt-0.5">
                Host Wedding Studio
              </span>
            </div>
          </Link>

          {/* Center Tabs */}
          <div className="flex items-center bg-[#F2ECE1] p-1 rounded-full border border-[#E2D7BD]">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-[#C9A84C] text-white shadow-xs'
                  : 'text-[#8B7355] hover:text-[#291418]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cards &amp; RSVPs ({invitations.length})</span>
            </button>
            <button
              type="button"
              onClick={handleStartCreateNewCard}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'builder'
                  ? 'bg-[#C9A84C] text-white shadow-xs'
                  : 'text-[#8B7355] hover:text-[#291418]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Card (₹79)</span>
            </button>
          </div>

          {/* Right User Info */}
          <div className="hidden md:flex items-center gap-3">
            {hostUser && (
              <div className="text-right text-xs">
                <span className="text-[#291418] font-semibold block">{hostUser.name}</span>
                <span className="text-[11px] text-[#8B7355]">{hostUser.email}</span>
              </div>
            )}
            <Link
              href="/login"
              onClick={() => DataService.logoutHost()}
              className="p-2.5 rounded-md bg-white border border-[#E2D7BD] hover:bg-[#F2ECE1] text-[#8B7355] hover:text-[#291418] transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#291418] text-white shadow-lg flex items-center gap-2 text-xs font-medium">
          <Check className="w-4 h-4 text-[#C9A84C] shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* =========================================================================
          TAB 1: ALL CREATED CARDS GRID + LIVE RSVP TRACKER
      ========================================================================= */}
      {activeTab === 'overview' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-10">
          {/* Post-Purchase Priority WhatsApp Support Banner (Unlocked for Host Cards) */}
          <div className="rounded-3xl bg-white border border-[#E2D7BD] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 editorial-card-shadow">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#F6EEDB] text-[#C9A84C] flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C9A84C]">
                    Post-Purchase Priority Support Unlocked
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                    Active ₹79 Host
                  </span>
                </div>
                <p className="text-xs text-[#8B7355] mt-1">
                  Need help with your 3D Lifafa, 3D Palace Gates, Frosted Veil, or WhatsApp guest links? Chat with our concierge on WhatsApp or email{' '}
                  <a href="mailto:mrsalman7307@gmail.com" className="text-[#291418] font-semibold underline">
                    mrsalman7307@gmail.com
                  </a>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  'Hello Eternal Vowz Support (mrsalman7307@gmail.com), I need assistance with my ₹79 Digital Wedding Card.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-md bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Priority WhatsApp Support</span>
              </a>
              <a
                href="mailto:mrsalman7307@gmail.com"
                className="px-4 py-2.5 rounded-md bg-white hover:bg-[#F2ECE1] border border-[#E2D7BD] text-[#291418] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>Email Support</span>
              </a>
            </div>
          </div>

          {/* Section 1: Created Cards Grid */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold block mb-0.5">
                  Eternal Vowz Collection &bull; ₹79 Per Card &bull; 1-Month (30-Day) Validity
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#291418]">
                  Your Wedding Invitation Cards ({invitations.length})
                </h1>
                <p className="text-xs text-[#8B7355] mt-0.5">
                  Select any card to view its live guest RSVPs or click Edit to customize its details.
                </p>
              </div>

              <button
                type="button"
                onClick={handleStartCreateNewCard}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-md bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Card @ ₹79</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {invitations.map((card) => {
                const isSelected = card.id === selectedInvitation.id;
                const theme = THEMES[card.theme_id] || THEMES['tuscan-sunset'];
                const cardGuests = allGuests.filter((g) => g.invitation_id === card.id);
                const cardOpened = cardGuests.filter((g) => Boolean(g.link_opened_at)).length;
                const cardAttending = cardGuests
                  .filter((g) => g.rsvp?.status === 'attending')
                  .reduce((s, g) => s + (g.rsvp?.headcount || 0), 0);
                const optionalCount = countActiveOptionalSections(card);
                const isFrostedBlur =
                  card.design_config.opening_style === 'frosted-blur' ||
                  (card.theme_id === 'pearl-veil' && !card.design_config.opening_style);
                const isGates =
                  !isFrostedBlur &&
                  (card.design_config.opening_style === 'palace-gates' ||
                    (card.theme_id === 'blush-floral' && card.design_config.opening_style !== 'lifafa'));
                const createdMs = card.created_at ? new Date(card.created_at).getTime() : Date.now();
                const expiresMs = card.expires_at
                  ? new Date(card.expires_at).getTime()
                  : createdMs + 30 * 24 * 60 * 60 * 1000;
                const daysRemaining = Math.max(0, Math.ceil((expiresMs - Date.now()) / (1000 * 60 * 60 * 24)));

                return (
                  <div
                    key={card.id}
                    onClick={() => setSelectedInvitation(card)}
                    className={`rounded-2xl bg-white border transition-all p-5 flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#C9A84C] ring-1 ring-[#C9A84C] editorial-card-shadow'
                        : 'border-[#E2D7BD] hover:border-[#C9A84C]/70'
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-xs text-white shrink-0 border border-[#D4AF37]/40"
                            style={{ backgroundColor: theme.previewColor }}
                          >
                            {card.design_config.wax_seal_initial || 'S&A'}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-serif text-base font-semibold text-[#2C221E] truncate">
                              {card.design_config.couple_names.partner1} &amp;{' '}
                              {card.design_config.couple_names.partner2}
                            </h3>
                            <span className="text-xs text-[#7A6A5E]">
                              {new Date(card.event_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                            isSelected
                              ? 'bg-[#C9A84C] text-white'
                              : 'bg-[#F6EEDB] text-[#8B7355] border border-[#E2D7BD]'
                          }`}
                        >
                          {isSelected ? 'Active • ₹79' : '₹79 / Card'}
                        </span>
                      </div>

                      {/* Animation Type & 30-Day Validity Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E2D7BD] text-[10px] font-semibold text-[#5A4636]">
                          {isFrostedBlur ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Frosted-Blur Veil</span>
                            </>
                          ) : isGates ? (
                            <>
                              <DoorOpen className="w-3 h-3" />
                              <span>3D Palace Gates</span>
                            </>
                          ) : (
                            <>
                              <Mail className="w-3 h-3" />
                              <span>3D Royal Lifafa</span>
                            </>
                          )}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] font-medium text-emerald-800">
                          <Clock className="w-3 h-3" />
                          <span>{daysRemaining}d left (1 Month)</span>
                        </span>
                      </div>

                      <div className="space-y-1 mb-4">
                        <div className="text-xs font-medium text-neutral-800 truncate">
                          {card.title}
                        </div>
                        <p className="text-xs text-neutral-500 flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span className="truncate">{card.venue_details.venue_name}</span>
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Main details + {optionalCount} optional sections
                        </p>
                      </div>

                      {/* Mini Stats */}
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/80 text-center mb-4">
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Invited</span>
                          <span className="text-sm font-semibold text-neutral-900">
                            {cardGuests.length}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Opened</span>
                          <span className="text-sm font-semibold text-neutral-900">
                            {cardOpened}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Attending</span>
                          <span className="text-sm font-semibold text-emerald-700">
                            {cardAttending}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEditExistingCard(card)}
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <Link
                          href={`/invite/${card.slug}${
                            cardGuests[0] ? `?guest=${cardGuests[0].unique_token}` : ''
                          }`}
                          target="_blank"
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Preview</span>
                          <ExternalLink className="w-3 h-3 text-neutral-500" />
                        </Link>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(getCardPublicUrl(card), card.id)}
                          className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
                          title="Copy Card Link"
                        >
                          {copiedId === card.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {invitations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCard(card.id)}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Create New Card Tile */}
              <button
                type="button"
                onClick={handleStartCreateNewCard}
                className="rounded-xl border border-dashed border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-50 p-6 flex flex-col items-center justify-center text-center min-h-[210px] transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-900 flex items-center justify-center mb-2.5">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="text-sm font-semibold text-neutral-900">
                  Create New Wedding Card
                </div>
                <p className="text-xs text-neutral-500 max-w-xs mt-1">
                  Fill only the main details — optional sections adjust automatically.
                </p>
              </button>
            </div>
          </section>

          {/* Section 2: RSVP Tracker for Selected Card */}
          <section className="space-y-5 pt-6 border-t border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                  Guest List &amp; RSVPs — {selectedInvitation.design_config.couple_names.partner1} &amp;{' '}
                  {selectedInvitation.design_config.couple_names.partner2}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Track read receipts, confirmed attendance, and share personalized WhatsApp links.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Guest</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 rounded-lg bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-700 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* 4 Clean Summary Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-neutral-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-neutral-500">Invited Parties</span>
                  <Users className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="text-2xl font-semibold text-neutral-900">{totalInvitedParties}</div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-neutral-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-neutral-500">Links Opened</span>
                  <Eye className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="text-2xl font-semibold text-neutral-900">{linksOpenedCount}</div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-neutral-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-neutral-500">Confirmed Headcount</span>
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-semibold text-emerald-700">
                  {totalConfirmedHeadcount}
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-neutral-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-neutral-500">Declined / Pending</span>
                  <Clock className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="text-2xl font-semibold text-neutral-900">
                  {declinedCount} <span className="text-sm font-normal text-neutral-400">/ {pendingCount}</span>
                </div>
              </div>
            </div>

            {/* Meal Summary Bar */}
            {Object.keys(mealCounts).length > 0 && (
              <div className="bg-white rounded-xl p-4 border border-neutral-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-700">
                  <Utensils className="w-4 h-4 text-neutral-400" />
                  <span>Catering Meal Summary:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {Object.entries(mealCounts).map(([meal, count]) => (
                    <div
                      key={meal}
                      className="px-2.5 py-1 rounded-md bg-neutral-100 text-xs flex items-center gap-1.5"
                    >
                      <span className="font-semibold text-neutral-900">{count}x</span>
                      <span className="text-neutral-600">{meal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guest Table Card */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search guest name..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto">
                  {(['all', 'attending', 'pending', 'declined'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors cursor-pointer ${
                        statusFilter === st
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center text-xs text-neutral-400">Loading guests...</div>
              ) : filteredGuests.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="text-sm font-medium text-neutral-700">No guests found</p>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-medium"
                  >
                    + Add Guest
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-neutral-200">
                  {filteredGuests.map((guest) => {
                    const inviteUrl = getGuestInviteUrl(guest);
                    const isCopied = copiedId === guest.id;
                    const rsvpStatus = guest.rsvp?.status || 'pending';

                    return (
                      <div
                        key={guest.id}
                        className="p-4 hover:bg-neutral-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/invite/${selectedInvitation.slug}?guest=${guest.unique_token}`}
                              target="_blank"
                              className="text-sm font-semibold text-neutral-900 hover:underline inline-flex items-center gap-1"
                            >
                              <span>{guest.guest_name}</span>
                              <ExternalLink className="w-3 h-3 text-neutral-400" />
                            </Link>
                            <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[11px]">
                              {guest.group_tag || 'Family'} &bull; Max {guest.max_allowed_guests}
                            </span>

                            {guest.link_opened_at ? (
                              <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[11px] inline-flex items-center gap-1">
                                <Eye className="w-3 h-3 text-neutral-500" />
                                <span>Opened</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-neutral-400">Unopened</span>
                            )}

                            {rsvpStatus === 'attending' && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
                                Attending ({guest.rsvp?.headcount})
                              </span>
                            )}
                            {rsvpStatus === 'declined' && (
                              <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-medium">
                                Declined
                              </span>
                            )}
                            {rsvpStatus === 'pending' && (
                              <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-500 text-[11px]">
                                Pending
                              </span>
                            )}
                          </div>

                          {(guest.rsvp?.meal_choice || guest.rsvp?.message) && (
                            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 pt-0.5">
                              {guest.rsvp?.meal_choice && (
                                <span className="inline-flex items-center gap-1 text-neutral-700">
                                  <Utensils className="w-3 h-3 text-neutral-400" />
                                  <span>{guest.rsvp.meal_choice}</span>
                                </span>
                              )}
                              {guest.rsvp?.message && (
                                <span className="inline-flex items-center gap-1 italic">
                                  <MessageSquare className="w-3 h-3 text-neutral-400 shrink-0" />
                                  <span>&ldquo;{guest.rsvp.message}&rdquo;</span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(inviteUrl, guest.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-700 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleShareWhatsApp(guest)}
                            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteGuest(guest.id)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                            title="Delete Guest"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {/* =========================================================================
          TAB 2: MINIMALIST SMART CARD BUILDER
      ========================================================================= */}
      {activeTab === 'builder' && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900">
                {editingCardId ? `Edit Card: ${draftCard.title}` : 'Create New Wedding Card'}
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Fill the main details below. Optional sections only appear on the card if turned ON.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMobilePreviewModal(true)}
                className="lg:hidden px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-800 text-xs font-medium inline-flex items-center gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="px-3.5 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-700 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveCard}
                className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium cursor-pointer"
              >
                {editingCardId ? 'Save Changes' : 'Publish Card'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            {/* Left Column: Form */}
            <form onSubmit={handleSaveCard} className="lg:col-span-7 space-y-6">
              {/* Step 1: Required Main Details */}
              <div className="rounded-xl bg-white border border-neutral-200 p-5 sm:p-6 space-y-4">
                <div className="border-b border-neutral-100 pb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Step 1 &bull; Main Details (Required)
                  </span>
                  <h2 className="text-base font-semibold text-neutral-900 mt-0.5">
                    Couple Names, Date &amp; Venue
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Bride Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={draftCard.design_config.couple_names.partner1}
                      onChange={(e) => {
                        const p1 = e.target.value;
                        const p2 = draftCard.design_config.couple_names.partner2;
                        setDraftCard({
                          ...draftCard,
                          design_config: {
                            ...draftCard.design_config,
                            couple_names: { partner1: p1, partner2: p2 },
                            wax_seal_initial: `${p1?.[0] || 'Z'}&${p2?.[0] || 'A'}`,
                          },
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Groom Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={draftCard.design_config.couple_names.partner2}
                      onChange={(e) => {
                        const p1 = draftCard.design_config.couple_names.partner1;
                        const p2 = e.target.value;
                        setDraftCard({
                          ...draftCard,
                          design_config: {
                            ...draftCard.design_config,
                            couple_names: { partner1: p1, partner2: p2 },
                            wax_seal_initial: `${p1?.[0] || 'Z'}&${p2?.[0] || 'A'}`,
                          },
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={draftCard.title}
                      onChange={(e) => setDraftCard({ ...draftCard, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Event Date &amp; Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={draftCard.event_date.slice(0, 16)}
                      onChange={(e) =>
                        setDraftCard({
                          ...draftCard,
                          event_date: new Date(e.target.value).toISOString(),
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Top Invitation Line
                  </label>
                  <input
                    type="text"
                    value={draftCard.design_config.subtitle || ''}
                    onChange={(e) =>
                      setDraftCard({
                        ...draftCard,
                        design_config: { ...draftCard.design_config, subtitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Venue Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={draftCard.venue_details.venue_name}
                      onChange={(e) =>
                        setDraftCard({
                          ...draftCard,
                          venue_details: {
                            ...draftCard.venue_details,
                            venue_name: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Google Maps Link (Optional)
                    </label>
                    <input
                      type="text"
                      value={draftCard.venue_details.maps_url}
                      onChange={(e) =>
                        setDraftCard({
                          ...draftCard,
                          venue_details: { ...draftCard.venue_details, maps_url: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Venue Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={draftCard.venue_details.address}
                      onChange={(e) =>
                        setDraftCard({
                          ...draftCard,
                          venue_details: { ...draftCard.venue_details, address: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                {/* 3D Opening Animation Style Selector (Lifafa vs Palace Gates vs Frosted Blur Veil) */}
                <div className="pt-3 border-t border-neutral-100">
                  <label className="block text-xs font-medium text-neutral-700 mb-2">
                    Opening Animation Style
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setDraftCard({
                          ...draftCard,
                          design_config: {
                            ...draftCard.design_config,
                            opening_style: 'lifafa',
                          },
                        });
                        setReplayTrigger((p) => p + 1);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        draftCard.design_config.opening_style !== 'palace-gates' &&
                        draftCard.design_config.opening_style !== 'frosted-blur'
                          ? 'border-[#6E2E3A] bg-[#FAF6F0] ring-1 ring-[#6E2E3A]'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <Mail className="w-4 h-4 text-[#6E2E3A] shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-neutral-900">
                          3D Royal Lifafa
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          Envelope &amp; wax seal
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDraftCard({
                          ...draftCard,
                          design_config: {
                            ...draftCard.design_config,
                            opening_style: 'palace-gates',
                          },
                        });
                        setReplayTrigger((p) => p + 1);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        draftCard.design_config.opening_style === 'palace-gates'
                          ? 'border-[#6E2E3A] bg-[#FAF6F0] ring-1 ring-[#6E2E3A]'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <DoorOpen className="w-4 h-4 text-[#6E2E3A] shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-neutral-900">
                          3D Palace Gates
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          Swinging double doors
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDraftCard({
                          ...draftCard,
                          design_config: {
                            ...draftCard.design_config,
                            opening_style: 'frosted-blur',
                          },
                        });
                        setReplayTrigger((p) => p + 1);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        draftCard.design_config.opening_style === 'frosted-blur'
                          ? 'border-[#6E2E3A] bg-[#FAF6F0] ring-1 ring-[#6E2E3A]'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <Eye className="w-4 h-4 text-[#6E2E3A] shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-neutral-900">
                          Frosted-Blur Veil
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          Blur melts on tap
                        </div>
                      </div>
                    </button>
                  </div>

                  <label className="block text-xs font-medium text-neutral-700 mb-2">
                    Card Color &amp; Hero Artwork Theme
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(Object.keys(THEMES) as ThemeId[]).map((tKey) => {
                      const t = THEMES[tKey];
                      const active = draftCard.theme_id === tKey;
                      return (
                        <button
                          key={tKey}
                          type="button"
                          onClick={() => {
                            setDraftCard({
                              ...draftCard,
                              theme_id: tKey,
                              design_config: {
                                ...draftCard.design_config,
                                opening_style:
                                  tKey === 'pearl-veil'
                                    ? 'frosted-blur'
                                    : tKey === 'blush-floral'
                                    ? 'palace-gates'
                                    : draftCard.design_config.opening_style || 'lifafa',
                              },
                            });
                            setReplayTrigger((p) => p + 1);
                          }}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                            active
                              ? 'border-[#6E2E3A] bg-[#FAF6F0] ring-1 ring-[#6E2E3A]'
                              : 'border-neutral-200 hover:border-neutral-300 bg-white'
                          }`}
                        >
                          <div
                            className="w-6 h-6 rounded-full mb-1.5"
                            style={{ backgroundColor: t.previewColor }}
                          />
                          <div className="text-xs font-medium text-neutral-900 truncate">
                            {t.name.split(' (')[0]}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 2: Optional Sections */}
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Step 2 &bull; Optional Sections (Turn ON only what you want)
                  </span>
                </div>

                {/* 1. Schedule */}
                <div className="rounded-xl bg-white border border-neutral-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900">
                        1. Event Schedule / Timeline
                      </h4>
                      <p className="text-xs text-neutral-500">Welcome, Nikah, Walima timings</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={draftCard.design_config.show_timeline !== false}
                      onChange={(e) =>
                        setDraftCard({
                          ...draftCard,
                          design_config: {
                            ...draftCard.design_config,
                            show_timeline: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-neutral-900 cursor-pointer"
                    />
                  </div>

                  {draftCard.design_config.show_timeline !== false && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
                      {(draftCard.design_config.timeline || []).map((item, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                        >
                          <input
                            type="text"
                            value={item.time}
                            onChange={(e) => updateTimelineSlot(idx, 'time', e.target.value)}
                            placeholder="18:00"
                            className="sm:col-span-2 px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                          />
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateTimelineSlot(idx, 'title', e.target.value)}
                            placeholder="NIKAH"
                            className="sm:col-span-3 px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-medium"
                          />
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateTimelineSlot(idx, 'description', e.target.value)}
                            placeholder="Description..."
                            className="sm:col-span-6 px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => removeTimelineSlot(idx)}
                            className="sm:col-span-1 p-1 text-neutral-400 hover:text-rose-600 flex justify-center"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addTimelineSlot}
                        className="text-xs font-medium text-neutral-700 hover:text-neutral-900 inline-flex items-center gap-1 pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Slot</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Dress Code */}
                <div className="rounded-xl bg-white border border-neutral-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900">
                        2. Modest Dress Code &amp; Couple Illustration
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Attire guidelines &amp; color swatches
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={draftCard.design_config.show_dress_code !== false}
                      onChange={(e) =>
                        setDraftCard({
                          ...draftCard,
                          design_config: {
                            ...draftCard.design_config,
                            show_dress_code: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-neutral-900 cursor-pointer"
                    />
                  </div>

                  {draftCard.design_config.show_dress_code !== false && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={draftCard.venue_details.dress_code || ''}
                        onChange={(e) =>
                          setDraftCard({
                            ...draftCard,
                            venue_details: {
                              ...draftCard.venue_details,
                              dress_code: e.target.value,
                            },
                          })
                        }
                        placeholder="Dress code title"
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                      />
                      <input
                        type="text"
                        value={draftCard.design_config.ladies_attire || ''}
                        onChange={(e) =>
                          setDraftCard({
                            ...draftCard,
                            design_config: {
                              ...draftCard.design_config,
                              ladies_attire: e.target.value,
                            },
                          })
                        }
                        placeholder="Ladies attire"
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                      />
                      <input
                        type="text"
                        value={draftCard.design_config.gents_attire || ''}
                        onChange={(e) =>
                          setDraftCard({
                            ...draftCard,
                            design_config: {
                              ...draftCard.design_config,
                              gents_attire: e.target.value,
                            },
                          })
                        }
                        placeholder="Gentlemen attire"
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* 3. Blessed Union Portrait & Story */}
                <div className="rounded-xl bg-white border border-neutral-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900">
                        3. Couple Floral Arch Portrait &amp; Story
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Modest couple illustration &amp; family blessing message
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={draftCard.design_config.show_story !== false}
                      onChange={(e) =>
                        setDraftCard({
                          ...draftCard,
                          design_config: {
                            ...draftCard.design_config,
                            show_story: e.target.checked,
                            show_couple_portrait: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-neutral-900 cursor-pointer"
                    />
                  </div>

                  {draftCard.design_config.show_story !== false && (
                    <div className="mt-3 pt-3 border-t border-neutral-100">
                      <textarea
                        rows={2}
                        value={draftCard.design_config.story || ''}
                        onChange={(e) =>
                          setDraftCard({
                            ...draftCard,
                            design_config: { ...draftCard.design_config, story: e.target.value },
                          })
                        }
                        placeholder="Family blessing or welcome note..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* 4. Royal Halal Menu */}
                <div className="rounded-xl bg-white border border-neutral-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900">
                        4. Royal Halal Menu
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Starter, Main Course &amp; Dessert display
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(draftCard.design_config.show_menu)}
                      onChange={(e) =>
                        setDraftCard({
                          ...draftCard,
                          design_config: {
                            ...draftCard.design_config,
                            show_menu: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-neutral-900 cursor-pointer"
                    />
                  </div>

                  {draftCard.design_config.show_menu && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={draftCard.design_config.menu_starter_title || ''}
                          onChange={(e) =>
                            setDraftCard({
                              ...draftCard,
                              design_config: {
                                ...draftCard.design_config,
                                menu_starter_title: e.target.value,
                              },
                            })
                          }
                          placeholder="Starter Title"
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                        />
                        <input
                          type="text"
                          value={draftCard.design_config.menu_starter_desc || ''}
                          onChange={(e) =>
                            setDraftCard({
                              ...draftCard,
                              design_config: {
                                ...draftCard.design_config,
                                menu_starter_desc: e.target.value,
                              },
                            })
                          }
                          placeholder="Starter Description"
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={draftCard.design_config.menu_main_title || ''}
                          onChange={(e) =>
                            setDraftCard({
                              ...draftCard,
                              design_config: {
                                ...draftCard.design_config,
                                menu_main_title: e.target.value,
                              },
                            })
                          }
                          placeholder="Main Course Title"
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                        />
                        <input
                          type="text"
                          value={draftCard.design_config.menu_main_desc || ''}
                          onChange={(e) =>
                            setDraftCard({
                              ...draftCard,
                              design_config: {
                                ...draftCard.design_config,
                                menu_main_desc: e.target.value,
                              },
                            })
                          }
                          placeholder="Main Course Description"
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={draftCard.design_config.menu_dessert_title || ''}
                          onChange={(e) =>
                            setDraftCard({
                              ...draftCard,
                              design_config: {
                                ...draftCard.design_config,
                                menu_dessert_title: e.target.value,
                              },
                            })
                          }
                          placeholder="Dessert Title"
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                        />
                        <input
                          type="text"
                          value={draftCard.design_config.menu_dessert_desc || ''}
                          onChange={(e) =>
                            setDraftCard({
                              ...draftCard,
                              design_config: {
                                ...draftCard.design_config,
                                menu_dessert_desc: e.target.value,
                              },
                            })
                          }
                          placeholder="Dessert Description"
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Gifts */}
                <div className="rounded-xl bg-white border border-neutral-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900">
                        5. Blessings &amp; Gift / Bank Details
                      </h4>
                      <p className="text-xs text-neutral-500">Optional gift note or account info</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(draftCard.design_config.show_gifts)}
                      onChange={(e) =>
                        setDraftCard({
                          ...draftCard,
                          design_config: {
                            ...draftCard.design_config,
                            show_gifts: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-neutral-900 cursor-pointer"
                    />
                  </div>

                  {draftCard.design_config.show_gifts && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
                      <input
                        type="text"
                        value={draftCard.design_config.gift_note || ''}
                        onChange={(e) =>
                          setDraftCard({
                            ...draftCard,
                            design_config: {
                              ...draftCard.design_config,
                              gift_note: e.target.value,
                            },
                          })
                        }
                        placeholder="Gift note..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={draftCard.design_config.bank_account_holder || ''}
                          onChange={(e) =>
                            setDraftCard({
                              ...draftCard,
                              design_config: {
                                ...draftCard.design_config,
                                bank_account_holder: e.target.value,
                              },
                            })
                          }
                          placeholder="Account Holder"
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                        />
                        <input
                          type="text"
                          value={draftCard.design_config.bank_account_number || ''}
                          onChange={(e) =>
                            setDraftCard({
                              ...draftCard,
                              design_config: {
                                ...draftCard.design_config,
                                bank_account_number: e.target.value,
                              },
                            })
                          }
                          placeholder="UPI / Account Number"
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Accommodation */}
                <div className="rounded-xl bg-white border border-neutral-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900">
                        6. Guest Accommodation
                      </h4>
                      <p className="text-xs text-neutral-500">Hotel stay recommendations</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(draftCard.design_config.show_accommodation)}
                      onChange={(e) =>
                        setDraftCard({
                          ...draftCard,
                          design_config: {
                            ...draftCard.design_config,
                            show_accommodation: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-neutral-900 cursor-pointer"
                    />
                  </div>

                  {draftCard.design_config.show_accommodation && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={draftCard.design_config.accommodation_name || ''}
                        onChange={(e) =>
                          setDraftCard({
                            ...draftCard,
                            design_config: {
                              ...draftCard.design_config,
                              accommodation_name: e.target.value,
                            },
                          })
                        }
                        placeholder="Hotel Name"
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                      />
                      <input
                        type="text"
                        value={draftCard.design_config.accommodation_note || ''}
                        onChange={(e) =>
                          setDraftCard({
                            ...draftCard,
                            design_config: {
                              ...draftCard.design_config,
                              accommodation_note: e.target.value,
                            },
                          })
                        }
                        placeholder="Room block note"
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* 7. FAQ */}
                <div className="rounded-xl bg-white border border-neutral-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900">
                        7. Guest FAQ Accordion
                      </h4>
                      <p className="text-xs text-neutral-500">Expandable questions &amp; answers</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(draftCard.design_config.show_faq)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const currentFaqs = draftCard.design_config.faqs || [];
                        setDraftCard({
                          ...draftCard,
                          design_config: {
                            ...draftCard.design_config,
                            show_faq: checked,
                            faqs:
                              checked && currentFaqs.length === 0
                                ? [
                                    {
                                      q: 'Is valet parking available at the venue?',
                                      a: 'Yes, complimentary valet parking is available at the main gate.',
                                    },
                                  ]
                                : currentFaqs,
                          },
                        });
                      }}
                      className="w-4 h-4 accent-neutral-900 cursor-pointer"
                    />
                  </div>

                  {draftCard.design_config.show_faq && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
                      {(draftCard.design_config.faqs || []).map((f, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={f.q}
                              onChange={(e) => updateFaqSlot(idx, 'q', e.target.value)}
                              placeholder="Question..."
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => removeFaqSlot(idx)}
                              className="p-1 text-neutral-400 hover:text-rose-600"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={f.a}
                            onChange={(e) => updateFaqSlot(idx, 'a', e.target.value)}
                            placeholder="Answer..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFaqSlot}
                        className="text-xs font-medium text-neutral-700 hover:text-neutral-900 inline-flex items-center gap-1 pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add FAQ</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium cursor-pointer"
                >
                  {editingCardId ? 'Save Updated Card' : 'Publish Wedding Card'}
                </button>
              </div>
            </form>

            {/* Right Column: Live Mobile Preview (1:1 Flush Fit inside Phone Frame) */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="sticky top-28 flex flex-col items-center">
                <div className="w-full max-w-[368px] flex items-center justify-between mb-2 px-3 py-1.5 rounded-full bg-white border border-[#E8DFD1] text-xs">
                  <span className="font-medium text-[#6E5D53]">
                    Live Mobile Preview
                  </span>
                  <button
                    type="button"
                    onClick={() => setReplayTrigger((p) => p + 1)}
                    className="font-semibold text-[#6E2E3A] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Replay Animation</span>
                  </button>
                </div>

                <div className="w-full max-w-[368px] rounded-[42px] bg-[#241A16] p-[10px] shadow-xl border-2 border-[#D4AF37]/45">
                  <div className="w-24 h-1.5 rounded-full bg-[#3D2E28] mx-auto mb-2" />
                  <div className="w-full h-[640px] rounded-[32px] overflow-y-auto overflow-x-hidden bg-[#f4e2c1] relative">
                    <EnvelopeExperience
                      invitation={draftCard}
                      isPreview={true}
                      replayTrigger={replayTrigger}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Mobile Full-Screen Preview Modal */}
      {showMobilePreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex flex-col items-center justify-center p-3 lg:hidden">
          <div className="w-full max-w-[380px] flex items-center justify-between text-white mb-2 px-2">
            <span className="text-xs font-medium">Live Card Preview</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setReplayTrigger((p) => p + 1)}
                className="text-xs text-neutral-200 underline"
              >
                Replay
              </button>
              <button
                type="button"
                onClick={() => setShowMobilePreviewModal(false)}
                className="px-3 py-1 rounded-md bg-white text-neutral-900 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
          <div className="w-full max-w-[380px] h-[82vh] rounded-[32px] border-4 border-neutral-800 overflow-y-auto overflow-x-hidden bg-[#f4e2c1]">
            <EnvelopeExperience
              invitation={draftCard}
              isPreview={true}
              replayTrigger={replayTrigger}
            />
          </div>
        </div>
      )}

      {/* Minimalist Add Guest Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-neutral-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Add Guest Party</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddGuest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Guest / Family Name (Printed on Front of Lifafa) *
                </label>
                <input
                  type="text"
                  required
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="e.g., Tariq Bhai & Family"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Max Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={newGuestMax}
                    onChange={(e) => setNewGuestMax(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Group
                  </label>
                  <select
                    value={newGuestGroup}
                    onChange={(e) => setNewGuestGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm"
                  >
                    <option value="VIP Family">VIP Family</option>
                    <option value="Close Relatives">Close Relatives</option>
                    <option value="Bride Side">Bride Side</option>
                    <option value="Groom Side">Groom Side</option>
                    <option value="Friends">Friends</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  WhatsApp Phone (Optional)
                </label>
                <input
                  type="text"
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-neutral-300 text-xs font-medium text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#6E2E3A] hover:bg-[#58222C] text-white text-xs font-medium cursor-pointer"
                >
                  Add &amp; Generate Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>

      <WeddingFooter />
    </div>
  );
}
