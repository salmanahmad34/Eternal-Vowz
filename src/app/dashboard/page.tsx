'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Invitation, GuestWithRsvp, HostUser, ThemeId, TimelineItem, FaqItem } from '@/types/database';
import { DataService, INITIAL_DEMO_INVITATION, getCanonicalOrigin } from '@/lib/data-service';
import { THEMES, MUSIC_TRACKS, ORDERED_THEME_IDS } from '@/lib/themes';
import { luxuryAudio } from '@/lib/audio';
import EnvelopeExperience from '@/components/envelope/EnvelopeExperience';
import { EternalLogoBadge } from '@/components/layout/EternalLoader';
import RazorpayCheckoutModal from '@/components/RazorpayCheckoutModal';
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
  Sparkles,
  Calendar,
  Settings,
  CreditCard,
  Music,
  Volume2,
  Upload,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [hostUser, setHostUser] = useState<HostUser | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [allGuests, setAllGuests] = useState<GuestWithRsvp[]>([]);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'overview' | 'builder'>('overview');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [cardSearchQuery, setCardSearchQuery] = useState('');
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
  const [checkoutCard, setCheckoutCard] = useState<Invitation | null>(null);
  const [checkoutMode, setCheckoutMode] = useState<'pay-existing' | 'create-new'>('pay-existing');
  const [previewTrackId, setPreviewTrackId] = useState<string | null>(null);

  const handleToggleAudioPreview = (trackIdOrUrl: string) => {
    const isNowPlaying = luxuryAudio.togglePreview(trackIdOrUrl);
    setPreviewTrackId(isNowPlaying ? trackIdOrUrl : null);
  };

  const handleCustomAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      setSaveToast('Audio file size must be less than 25MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setDraftCard({
        ...draftCard,
        design_config: {
          ...draftCard.design_config,
          music_track: 'custom',
          custom_music_url: dataUrl,
        },
      });
      setSaveToast(`Custom song loaded: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleCustomAudioUrlChange = (url: string) => {
    setDraftCard({
      ...draftCard,
      design_config: {
        ...draftCard.design_config,
        music_track: 'custom',
        custom_music_url: url,
      },
    });
  };

  const loadData = async () => {
    setLoading(true);
    const user = await DataService.getAuthenticatedHost();
    if (!user) {
      window.location.replace('/login?next=/dashboard');
      return;
    }
    setHostUser(user);

    const cards = await DataService.getAllInvitations();
    const guests = await DataService.getAllGuests();
    setInvitations(cards);
    setAllGuests(guests);

    if (cards.length > 0) {
      const current = cards.find((c) => c.id === selectedInvitation?.id) || cards[0];
      setSelectedInvitation(current);
    } else {
      setSelectedInvitation(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const themeParam = urlParams.get('theme') as ThemeId | null;
      const isNew = urlParams.get('new') === 'true';
      if (themeParam && THEMES[themeParam]) {
        handleStartCreateNewCard(themeParam);
      } else if (isNew) {
        handleStartCreateNewCard();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartCreateNewCard = (themeOverride?: ThemeId | React.MouseEvent | unknown) => {
    const selectedTheme =
      typeof themeOverride === 'string' && THEMES[themeOverride as ThemeId]
        ? (themeOverride as ThemeId)
        : 'pearl-veil';
    const newBlankCard: Invitation = {
      id: `draft-${Date.now()}`,
      slug: `wedding-${Math.random().toString(36).substring(2, 7)}`,
      theme_id: selectedTheme,
      title: '',
      event_date: '2027-11-20T18:00:00Z',
      venue_details: {
        venue_name: '',
        hall_name: '',
        address: '',
        maps_url: '',
        city: '',
        dress_code: 'Modest & Traditional Attire',
      },
      design_config: {
        couple_names: {
          partner1: '',
          partner2: '',
        },
        subtitle: 'TOGETHER WITH THEIR FAMILIES INVITE YOU',
        wax_seal_initial: 'E&V',
        music_track: 'wedding-nasheed',
        accent_color: '#D4AF37',
        font_style: 'cormorant',
        opening_style:
          selectedTheme === 'pearl-veil' || selectedTheme === 'kashmir-lotus'
            ? 'frosted-blur'
            : selectedTheme === 'blush-floral'
            ? 'palace-gates'
            : 'lifafa',
        show_timeline: true,
        timeline: [
          {
            id: '1',
            time: '18:00',
            title: 'NIKAH',
            location: 'Main Ceremony Hall',
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
          'With the blessings of our parents, we warmly invite you and your family to grace our wedding celebration with your prayers and presence.',
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
    let initialCard = newBlankCard;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ev_builder_draft_card');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed?.design_config?.couple_names?.partner1 || parsed?.design_config?.couple_names?.partner2) {
            initialCard = { ...newBlankCard, ...parsed };
          }
        } catch {}
      }
    }
    setDraftCard(initialCard);
    setActiveTab('builder');
  };

  // Auto-save form draft to localStorage while editing so refreshes never lose work
  useEffect(() => {
    if (typeof window !== 'undefined' && activeTab === 'builder' && !editingCardId) {
      try {
        localStorage.setItem('ev_builder_draft_card', JSON.stringify(draftCard));
      } catch {}
    }
  }, [draftCard, activeTab, editingCardId]);

  const handleEditExistingCard = (card: Invitation) => {
    setEditingCardId(card.id);
    setDraftCard(JSON.parse(JSON.stringify(card)));
    setActiveTab('builder');
  };

  const handleSaveDraft = async () => {
    const p1 = draftCard.design_config.couple_names.partner1?.trim() || '';
    const p2 = draftCard.design_config.couple_names.partner2?.trim() || '';
    if (!p1 || !p2) {
      setSaveToast('Please enter both Bride Name and Groom Name to save draft.');
      setTimeout(() => setSaveToast(null), 3000);
      return;
    }

    const cleanSlug =
      `${p1}-${p2}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `card-${Date.now()}`;

    try {
      if (editingCardId) {
        await DataService.updateInvitation(editingCardId, {
          ...draftCard,
          slug: draftCard.slug || cleanSlug,
        });
      } else {
        await DataService.createInvitation({
          ...draftCard,
          slug: cleanSlug,
          title: draftCard.title?.trim() || `Wedding of ${p1} & ${p2}`,
          is_published: false,
          is_paid: false,
        });
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ev_builder_draft_card');
      }
      setSaveToast('Draft saved! Your card will always remain on your dashboard.');
      await loadData();
      setTimeout(() => {
        setSaveToast(null);
        setActiveTab('overview');
      }, 800);
    } catch (err: any) {
      setSaveToast(err?.message || 'Failed to save draft.');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const p1 = draftCard.design_config.couple_names.partner1?.trim() || '';
    const p2 = draftCard.design_config.couple_names.partner2?.trim() || '';
    if (!p1 || !p2) {
      setSaveToast('Please enter both Bride Name and Groom Name before continuing.');
      setTimeout(() => setSaveToast(null), 3000);
      return;
    }

    const cleanSlug =
      `${p1}-${p2}`
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
      await loadData();
      setTimeout(() => {
        setSaveToast(null);
        setActiveTab('overview');
      }, 1000);
    } else {
      // Payment MUST succeed BEFORE a new card is created & published!
      setCheckoutMode('create-new');
      setCheckoutCard({
        ...draftCard,
        slug: cleanSlug,
        title: draftCard.title?.trim() || `Wedding of ${p1} & ${p2}`,
      });
    }
  };

  const handleDeleteCard = async (id: string) => {
    await DataService.deleteInvitation(id);
    await loadData();
  };

  const selectedCardGuests = selectedInvitation
    ? allGuests.filter((g) => g.invitation_id === selectedInvitation.id)
    : [];

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

  const getGuestInviteUrl = (guest: GuestWithRsvp, card: Invitation | null = selectedInvitation) => {
    if (!card) return '';
    const origin = getCanonicalOrigin();
    return `${origin}/invite/${card.slug}?guest=${guest.unique_token}`;
  };

  const getCardPublicUrl = (card: Invitation) => {
    const origin = getCanonicalOrigin();
    return `${origin}/invite/${card.slug}`;
  };

  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareWhatsApp = (guest: GuestWithRsvp, card: Invitation | null = selectedInvitation) => {
    if (!card) return;
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
    if (!selectedInvitation || !newGuestName.trim()) return;

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
    if (!selectedInvitation) return;
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

  const previewDraftCard: Invitation = {
    ...draftCard,
    title: draftCard.title?.trim() || 'Wedding Celebration',
    venue_details: {
      ...draftCard.venue_details,
      venue_name: draftCard.venue_details.venue_name?.trim() || 'Your Wedding Venue',
      address: draftCard.venue_details.address?.trim() || 'Venue Address',
    },
    design_config: {
      ...draftCard.design_config,
      couple_names: {
        partner1: draftCard.design_config.couple_names.partner1?.trim() || 'BRIDE',
        partner2: draftCard.design_config.couple_names.partner2?.trim() || 'GROOM',
      },
      wax_seal_initial: draftCard.design_config.wax_seal_initial?.trim() || 'E&V',
    },
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#291418] font-sans flex flex-col justify-between">
      <div>
      {/* =========================================================================
          EDITORIAL CHAMPAGNE GOLD DASHBOARD HEADER (ETERNAL VOWZ • E&V)
      ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E2D7BD]/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-0 sm:h-20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Top Row on Mobile: Logo/Brand on Left, Logout on Right */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <EternalLogoBadge size="sm" animated />
              <div>
                <span className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#291418] block leading-none">
                  Eternal Vowz
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.22em] text-[#8B7355] font-medium block mt-0.5">
                  Host Wedding Studio
                </span>
              </div>
            </Link>

            {/* Mobile-only Logout button placed neatly at top right */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={async () => {
                  await DataService.logoutHost();
                  router.replace('/login');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E2D7BD] hover:bg-rose-50 hover:border-rose-200 text-[#8B7355] hover:text-rose-700 transition-all text-xs font-semibold shadow-2xs cursor-pointer"
                title="Log out from dashboard"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Segmented Center Tabs (Full width on mobile, auto on desktop) */}
          <div className="flex items-center justify-center bg-[#F2ECE1] p-1 rounded-full border border-[#E2D7BD] w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-[#C9A84C] text-white shadow-xs'
                  : 'text-[#8B7355] hover:text-[#291418]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>Cards &amp; RSVPs ({invitations.length})</span>
            </button>
            <button
              type="button"
              onClick={handleStartCreateNewCard}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'builder'
                  ? 'bg-[#C9A84C] text-white shadow-xs'
                  : 'text-[#8B7355] hover:text-[#291418]'
              }`}
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>New Card (₹99)</span>
            </button>
          </div>

          {/* Desktop-only User Info & Logout on Right */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3 shrink-0">
            {hostUser && (
              <div className="hidden lg:block text-right text-xs">
                <span className="text-[#291418] font-semibold block truncate max-w-[150px]">{hostUser.name}</span>
                <span className="text-[11px] text-[#8B7355] block truncate max-w-[150px]">{hostUser.email}</span>
              </div>
            )}
            <button
              type="button"
              onClick={async () => {
                await DataService.logoutHost();
                router.replace('/login');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white border border-[#E2D7BD] hover:bg-rose-50 hover:border-rose-200 text-[#8B7355] hover:text-rose-700 transition-all text-xs font-semibold shadow-2xs cursor-pointer"
              title="Log out from dashboard"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Log Out</span>
            </button>
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
          {/* Section 1: WooowInvites Editorial Host Workspace */}
          <section className="space-y-6">
            {/* Workspace Header ("Your wedding invitations") */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6EEDB] border border-[#E2D7BD] text-[11px] font-medium text-[#8B7355] mb-2.5">
                  <Sparkles className="w-3 h-3 text-[#C9A84C]" />
                  <span>Host Workspace &bull; Flat ₹99 / Card</span>
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#291418] leading-tight">
                  Your wedding{' '}
                  <span className="italic text-[#C9A84C]">invitations</span>
                </h1>
                <p className="text-sm text-[#8B7355] mt-1">
                  Every wedding card &amp; live guest RSVP you&apos;re managing, in one place.
                </p>
              </div>

              <button
                type="button"
                onClick={handleStartCreateNewCard}
                className="button-shine inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors cursor-pointer shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Invitation</span>
              </button>
            </div>

            {/* 3 Clean WooowInvites Workspace KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white border border-[#E2D7BD]/90 p-5 flex items-center gap-4 editorial-card-shadow">
                <div className="w-11 h-11 rounded-xl bg-[#F6EEDB] text-[#C9A84C] flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xl font-semibold text-[#291418] block leading-none">
                    {invitations.length}
                  </span>
                  <span className="text-xs text-[#8B7355] block mt-1">
                    Total invitations
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-[#E2D7BD]/90 p-5 flex items-center gap-4 editorial-card-shadow">
                <div className="w-11 h-11 rounded-xl bg-[#F6EEDB] text-[#C9A84C] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xl font-semibold text-[#291418] block leading-none">
                    {invitations.filter((c) => c.is_published).length}
                  </span>
                  <span className="text-xs text-[#8B7355] block mt-1">
                    Active / live (30-Day)
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-[#E2D7BD]/90 p-5 flex items-center gap-4 editorial-card-shadow">
                <div className="w-11 h-11 rounded-xl bg-[#F6EEDB] text-[#C9A84C] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xl font-semibold text-[#291418] block leading-none">
                    {allGuests
                      .filter((g) => g.rsvp?.status === 'attending')
                      .reduce((sum, g) => sum + (g.rsvp?.headcount || 0), 0)}
                  </span>
                  <span className="text-xs text-[#8B7355] block mt-1">
                    Confirmed RSVP guests
                  </span>
                </div>
              </div>
            </div>

            {/* Clean Search Filter Input (Only when user has created cards) */}
            {invitations.length > 0 && (
              <div className="max-w-md relative">
                <Search className="w-4 h-4 text-[#8B7355] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={cardSearchQuery}
                  onChange={(e) => setCardSearchQuery(e.target.value)}
                  placeholder="Search by couple, reveal style, or venue..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-[#E2D7BD] text-sm text-[#291418] placeholder:text-[#A5947E] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
            )}

            {/* Empty State when no real cards exist yet */}
            {!loading && invitations.length === 0 ? (
              <div className="rounded-2xl bg-white border border-dashed border-[#E2D7BD] p-10 sm:p-14 text-center space-y-4 editorial-card-shadow">
                <div className="w-14 h-14 rounded-2xl bg-[#F6EEDB] text-[#C9A84C] flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#291418]">
                    No wedding invitations yet
                  </h3>
                  <p className="text-sm text-[#8B7355]">
                    Create your first bespoke 3D wedding card — customize your names, venue, and theme, then publish for flat ₹99 (valid 30 days).
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleStartCreateNewCard}
                    className="button-shine inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Your First Wedding Card</span>
                  </button>
                </div>
              </div>
            ) : (
            /* WooowInvites Sleek Horizontal Invitation Rows */
            <div className="space-y-3">
              {invitations
                .filter((card) => {
                  const q = cardSearchQuery.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    `${card.design_config.couple_names.partner1} ${card.design_config.couple_names.partner2}`
                      .toLowerCase()
                      .includes(q) ||
                    card.title.toLowerCase().includes(q) ||
                    card.venue_details.venue_name.toLowerCase().includes(q) ||
                    card.slug.toLowerCase().includes(q)
                  );
                })
                .map((card) => {
                  const isSelected = card.id === selectedInvitation?.id;
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
                      className={`rounded-2xl bg-white border px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#C9A84C] ring-1 ring-[#C9A84C] shadow-[0_10px_30px_-12px_rgba(201,168,76,0.35)]'
                          : 'border-[#E2D7BD]/90 hover:border-[#C9A84C]/70 hover:shadow-xs'
                      }`}
                    >
                      {/* Left: Crest + Couple Name + Active Badge + Event Subline */}
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center font-serif font-bold text-xs text-white shrink-0 border border-[#D4AF37]/40 shadow-2xs"
                          style={{ backgroundColor: theme.previewColor }}
                        >
                          {card.design_config.wax_seal_initial || 'E&V'}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-serif text-xl font-semibold text-[#291418] leading-none">
                              {card.design_config.couple_names.partner1} &amp;{' '}
                              {card.design_config.couple_names.partner2}
                            </h3>
                            {card.is_paid && daysRemaining > 0 && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>Live • Active ({daysRemaining}d left)</span>
                              </span>
                            )}
                            {card.is_paid && daysRemaining <= 0 && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                <span>Expired (Pass Ended)</span>
                              </span>
                            )}
                            {!card.is_paid && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                <span>Draft • Unpaid</span>
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E2D7BD] text-[#5A4636] text-[10px] font-medium">
                              {isFrostedBlur ? (
                                <>
                                  <Eye className="w-3 h-3 text-[#C9A84C]" />
                                  <span>Frosted-Blur Veil</span>
                                </>
                              ) : isGates ? (
                                <>
                                  <DoorOpen className="w-3 h-3 text-[#C9A84C]" />
                                  <span>3D Palace Gates</span>
                                </>
                              ) : (
                                <>
                                  <Mail className="w-3 h-3 text-[#C9A84C]" />
                                  <span>3D Royal Lifafa</span>
                                </>
                              )}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8B7355]">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#C9A84C]" />
                              <span>
                                {new Date(card.event_date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </span>
                            <span className="inline-flex items-center gap-1 truncate max-w-[240px]">
                              <MapPin className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                              <span className="truncate">{card.venue_details.venue_name}</span>
                            </span>
                            <span>&bull;</span>
                            <span>
                              {cardGuests.length} invited &middot; {cardOpened} opened &middot;{' '}
                              <strong className="text-emerald-700 font-semibold">{cardAttending} attending</strong>
                            </span>
                            <span className="hidden xl:inline text-[#A5947E]">
                              ({optionalCount} optional blocks)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: WooowInvites Action Row (Preview · Edit · Gold Manage) */}
                      <div
                        className="flex flex-wrap items-center gap-2 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/invite/${card.slug}${
                            cardGuests[0] ? `?guest=${cardGuests[0].unique_token}` : ''
                          }`}
                          target="_blank"
                          className="px-3.5 py-2 rounded-md bg-white hover:bg-[#FAF7F2] border border-[#E2D7BD] text-[#5A4636] text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#8B7355]" />
                          <span>Preview</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleEditExistingCard(card)}
                          className="px-3.5 py-2 rounded-md bg-white hover:bg-[#FAF7F2] border border-[#E2D7BD] text-[#291418] text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#8B7355]" />
                          <span>Edit</span>
                        </button>

                        {card.is_paid && daysRemaining <= 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setCheckoutMode('pay-existing');
                              setCheckoutCard(card);
                            }}
                            className="px-3.5 py-2 rounded-md bg-[#291418] hover:bg-[#3e1f25] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-[#E6CFA0]" />
                            <span>Reactivate (₹99)</span>
                          </button>
                        )}

                        {!card.is_paid && (
                          <button
                            type="button"
                            onClick={() => {
                              setCheckoutMode('pay-existing');
                              setCheckoutCard(card);
                            }}
                            className="px-4 py-2 rounded-md bg-[#291418] hover:bg-[#3e1f25] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-[#E6CFA0]" />
                            <span>Pay ₹99 &amp; Publish</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInvitation(card);
                            const el = document.getElementById('rsvp-manager');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-4 py-2 rounded-md bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          <span>{isSelected ? 'Managing RSVPs' : 'Manage'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyLink(getCardPublicUrl(card), card.id)}
                          className="p-2 rounded-md border border-[#E2D7BD] bg-white hover:bg-[#FAF7F2] text-[#8B7355] hover:text-[#291418] transition-colors cursor-pointer"
                          title="Copy Public Card Link"
                        >
                          {copiedId === card.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-2 rounded-md hover:bg-rose-50 text-[#A5947E] hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
            )}
          </section>

          {/* Section 2: RSVP Tracker for Selected Card */}
          {selectedInvitation && (
          <section id="rsvp-manager" className="space-y-5 pt-8 border-t border-[#E2D7BD]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold block mb-0.5">
                  Selected Invitation &bull; Live RSVP Manager
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#291418]">
                  Guest List &amp; RSVPs &mdash;{' '}
                  <span className="italic text-[#C9A84C]">
                    {selectedInvitation.design_config.couple_names.partner1} &amp;{' '}
                    {selectedInvitation.design_config.couple_names.partner2}
                  </span>
                </h2>
                <p className="text-xs text-[#8B7355] mt-0.5">
                  Track read receipts, confirmed attendance, and share personalized WhatsApp links.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2.5 rounded-md bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Guest</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 rounded-md bg-white hover:bg-[#F6EEDB] border border-[#E2D7BD] text-[#291418] text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* 4 Clean Summary Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-[#E2D7BD]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-[#8B7355]">Invited Parties</span>
                  <Users className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <div className="text-2xl font-semibold text-[#291418]">{totalInvitedParties}</div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#E2D7BD]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-[#8B7355]">Links Opened</span>
                  <Eye className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <div className="text-2xl font-semibold text-[#291418]">{linksOpenedCount}</div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#E2D7BD]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-[#8B7355]">Confirmed Headcount</span>
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-semibold text-emerald-700">
                  {totalConfirmedHeadcount}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#E2D7BD]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-[#8B7355]">Declined / Pending</span>
                  <Clock className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <div className="text-2xl font-semibold text-[#291418]">
                  {declinedCount} <span className="text-sm font-normal text-[#8B7355]">/ {pendingCount}</span>
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
          )}
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
                onClick={handleSaveDraft}
                className="px-3.5 py-2 rounded-lg bg-white hover:bg-[#FAF7F2] border border-[#E2D7BD] text-[#5A4636] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Save draft to dashboard without paying now"
              >
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                onClick={handleSaveCard}
                className="px-4 py-2 rounded-lg bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {!editingCardId && <CreditCard className="w-3.5 h-3.5" />}
                <span>{editingCardId ? 'Save Changes' : 'Pay ₹99 & Publish'}</span>
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
                      placeholder="Enter Bride Name"
                      onChange={(e) => {
                        const p1 = e.target.value;
                        const p2 = draftCard.design_config.couple_names.partner2;
                        const initial =
                          p1.trim() || p2.trim()
                            ? `${p1.trim()?.[0]?.toUpperCase() || 'E'}&${p2.trim()?.[0]?.toUpperCase() || 'V'}`
                            : 'E&V';
                        setDraftCard({
                          ...draftCard,
                          design_config: {
                            ...draftCard.design_config,
                            couple_names: { partner1: p1, partner2: p2 },
                            wax_seal_initial: initial,
                          },
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
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
                      placeholder="Enter Groom Name"
                      onChange={(e) => {
                        const p1 = draftCard.design_config.couple_names.partner1;
                        const p2 = e.target.value;
                        const initial =
                          p1.trim() || p2.trim()
                            ? `${p1.trim()?.[0]?.toUpperCase() || 'E'}&${p2.trim()?.[0]?.toUpperCase() || 'V'}`
                            : 'E&V';
                        setDraftCard({
                          ...draftCard,
                          design_config: {
                            ...draftCard.design_config,
                            couple_names: { partner1: p1, partner2: p2 },
                            wax_seal_initial: initial,
                          },
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
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
                      placeholder="e.g., Nikah & Walima Celebration"
                      onChange={(e) => setDraftCard({ ...draftCard, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
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
                      placeholder="Enter Venue Name"
                      onChange={(e) =>
                        setDraftCard({
                          ...draftCard,
                          venue_details: {
                            ...draftCard.venue_details,
                            venue_name: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Google Maps Link (Optional)
                    </label>
                    <input
                      type="text"
                      value={draftCard.venue_details.maps_url}
                      placeholder="https://maps.google.com/..."
                      onChange={(e) =>
                        setDraftCard({
                          ...draftCard,
                          venue_details: { ...draftCard.venue_details, maps_url: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
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
                      placeholder="Enter full venue address"
                      onChange={(e) =>
                        setDraftCard({
                          ...draftCard,
                          venue_details: { ...draftCard.venue_details, address: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
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

                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-neutral-800">
                      Card Color &amp; Hero Artwork Theme (8 Signature Designs)
                    </label>
                    <span className="text-[11px] text-[#8B7355]">
                      Matches Landing Page Samples
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {ORDERED_THEME_IDS.map((tKey) => {
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
                                  tKey === 'pearl-veil' || tKey === 'kashmir-lotus'
                                    ? 'frosted-blur'
                                    : tKey === 'blush-floral'
                                    ? 'palace-gates'
                                    : draftCard.design_config.opening_style || 'lifafa',
                              },
                            });
                            setReplayTrigger((p) => p + 1);
                          }}
                          className={`group relative p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between overflow-hidden shadow-2xs ${
                            active
                              ? 'border-[#C9A84C] bg-[#FAF6EE] ring-2 ring-[#C9A84C]'
                              : 'border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-xs'
                          }`}
                        >
                          {/* 3D Visual Card Image Preview */}
                          <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-neutral-100 mb-2">
                            <img
                              src={t.heroImg || '/assets/tuscan-haveli/hero-haveli-courtyard.jpg'}
                              alt={t.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                            {t.badge && (
                              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/65 backdrop-blur-xs text-[8px] font-semibold text-[#FFF4CF]">
                                {t.badge}
                              </div>
                            )}
                            {active && (
                              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C9A84C] text-white flex items-center justify-center shadow-xs">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                            <div className="absolute bottom-1 left-1 flex items-center gap-1 max-w-[90%]">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-white shadow-xs shrink-0"
                                style={{ backgroundColor: t.previewColor }}
                              />
                              <span className="text-[10px] font-semibold text-white drop-shadow-xs truncate">
                                {t.name}
                              </span>
                            </div>
                          </div>

                          <div className="px-0.5 space-y-0.5">
                            <div className="text-[11px] font-semibold text-neutral-900 truncate">
                              {t.name}
                            </div>
                            <div className="text-[9px] text-neutral-500 line-clamp-1">
                              {tKey === 'shahi-crimson'
                                ? 'Crimson Velvet & 24K Gold'
                                : tKey === 'jodhpur-sapphire'
                                ? 'Royal Sapphire & Marigold'
                                : tKey === 'pearl-veil' || tKey === 'kashmir-lotus'
                                ? '3D Frosted-Blur Reveal'
                                : tKey === 'blush-floral'
                                ? '3D Palace Double Gates'
                                : '3D Embossed Royal Lifafa'}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Wedding Music Selection & Audio Player */}
                <div className="rounded-xl bg-white border border-neutral-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#FAF3E0] text-[#B8860B] flex items-center justify-center">
                        <Music className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900">
                          Wedding Background Music
                        </h4>
                        <p className="text-xs text-neutral-500">
                          Plays continuously from the moment guest taps to open card (Listen samples or use custom song)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5 Curated Tracks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {MUSIC_TRACKS.map((track) => {
                      const isSelected =
                        (draftCard.design_config.music_track || 'wedding-nasheed') === track.id &&
                        !draftCard.design_config.custom_music_url;
                      const isPlaying = previewTrackId === track.id;

                      return (
                        <div
                          key={track.id}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'border-[#B8860B] bg-[#FFFBF0] ring-1 ring-[#B8860B]'
                              : 'border-neutral-200 hover:border-neutral-300 bg-white'
                          }`}
                          onClick={() => {
                            setDraftCard({
                              ...draftCard,
                              design_config: {
                                ...draftCard.design_config,
                                music_track: track.id,
                                custom_music_url: '',
                              },
                            });
                            setReplayTrigger((p) => p + 1);
                          }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isSelected ? 'bg-[#B8860B]' : 'bg-neutral-300'
                                }`}
                              />
                              <div className="text-xs font-semibold text-neutral-900 truncate">
                                {track.name}
                              </div>
                            </div>
                            <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                              {track.mood}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleAudioPreview(track.id);
                            }}
                            className={`p-1.5 px-2.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors shrink-0 ${
                              isPlaying
                                ? 'bg-[#B8860B] text-white border-[#B8860B]'
                                : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                            }`}
                            title={isPlaying ? 'Pause' : 'Listen Sample'}
                          >
                            <Volume2
                              className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse' : ''}`}
                            />
                            <span className="text-[10px]">{isPlaying ? 'Stop' : 'Listen'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom Music Upload & URL */}
                  <div className="pt-2 border-t border-neutral-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span>Add Custom Wedding Song (Bride &amp; Groom Choice)</span>
                      </label>
                      {draftCard.design_config.custom_music_url && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                          Custom Song Active
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Upload MP3 from device */}
                      <label className="border border-dashed border-neutral-300 hover:border-[#B8860B] rounded-xl p-3 flex items-center gap-2.5 cursor-pointer bg-neutral-50 hover:bg-[#FFFDF7] transition-all">
                        <Upload className="w-4 h-4 text-neutral-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-neutral-800 truncate">
                            Upload Song (MP3, M4A, etc.)
                          </div>
                          <div className="text-[10px] text-neutral-500">
                            Select custom audio file (up to 25MB)
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg,.opus,.webm,.weba,audio/mp3,audio/mpeg,audio/m4a,audio/x-m4a,audio/mp4,video/mp4"
                          className="hidden"
                          onChange={handleCustomAudioFileUpload}
                        />
                      </label>

                      {/* Direct Audio URL */}
                      <div className="flex items-center gap-1.5">
                        <input
                          type="url"
                          value={
                            draftCard.design_config.custom_music_url?.startsWith('data:')
                              ? 'Custom Audio File Uploaded'
                              : draftCard.design_config.custom_music_url || ''
                          }
                          disabled={Boolean(
                            draftCard.design_config.custom_music_url?.startsWith('data:')
                          )}
                          onChange={(e) => handleCustomAudioUrlChange(e.target.value)}
                          placeholder="Paste MP3 Audio URL (https://...)"
                          className="flex-1 px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#B8860B]"
                        />
                        {draftCard.design_config.custom_music_url && (
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleAudioPreview(
                                draftCard.design_config.custom_music_url!
                              )
                            }
                            className="p-2 rounded-xl bg-[#B8860B] text-white text-xs hover:bg-[#996F08] shrink-0"
                            title="Listen Custom Music"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
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

              <div className="pt-2 space-y-2">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-lg bg-white hover:bg-[#FAF7F2] border border-[#E2D7BD] text-[#5A4636] text-xs font-semibold cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-2xs transition-colors shrink-0"
                  >
                    <span>Save Draft</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 w-full py-3.5 rounded-lg bg-[#C9A84C] hover:bg-[#B8963B] text-white text-sm font-semibold cursor-pointer inline-flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    {!editingCardId && <CreditCard className="w-4 h-4" />}
                    <span>
                      {editingCardId ? 'Save Updated Card' : 'Pay ₹99 & Publish Wedding Card'}
                    </span>
                  </button>
                </div>
                {!editingCardId && (
                  <p className="text-[11px] text-center text-[#8B7355]">
                    Complete ₹99 Razorpay payment (or apply a coupon code) to create &amp; publish your 30-day card.
                  </p>
                )}
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
                      invitation={previewDraftCard}
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
              invitation={previewDraftCard}
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
                  className="px-4 py-2 rounded-md bg-[#C9A84C] hover:bg-[#B8963B] text-white text-xs font-semibold cursor-pointer"
                >
                  Add &amp; Generate Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Razorpay + Coupon Checkout Modal */}
      <RazorpayCheckoutModal
        card={checkoutCard}
        mode={checkoutMode}
        defaultEmail={hostUser?.email || ''}
        onClose={() => setCheckoutCard(null)}
        onSuccess={async (createdCard) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('ev_builder_draft_card');
          }
          await loadData();
          if (createdCard) {
            setSelectedInvitation(createdCard);
            setSaveToast('Payment verified! Your new 3D wedding card is now live.');
            setActiveTab('overview');
            setTimeout(() => setSaveToast(null), 4000);
          }
        }}
      />
      </div>
    </div>
  );
}
