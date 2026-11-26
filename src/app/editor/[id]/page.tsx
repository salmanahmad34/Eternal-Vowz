'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DataService } from '@/lib/data-service';
import { Invitation, ThemeId, TimelineItem } from '@/types/database';
import { THEMES } from '@/lib/themes';
import { luxuryAudio } from '@/lib/audio';
import EnvelopeExperience from '@/components/envelope/EnvelopeExperience';
import { 
  Palette, 
  Clock, 
  Music, 
  Plus, 
  Trash2, 
  Save, 
  ExternalLink, 
  RotateCcw, 
  Smartphone, 
  Maximize2, 
  Check, 
  ChevronLeft,
  Heart,
  Volume2,
  Upload,
  Sparkles,
} from 'lucide-react';

export default function InvitationEditorPage() {
  const params = useParams();
  const id = (params?.id as string) || 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [activeTab, setActiveTab] = useState<'theme' | 'details' | 'schedule' | 'music'>('theme');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [replayCount, setReplayCount] = useState(0);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'full'>('mobile');
  const [audioPreviewPlaying, setAudioPreviewPlaying] = useState<string | null>(null);
  const [phoneScale, setPhoneScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (typeof window === 'undefined') return;
      const availH = window.innerHeight - 156; // Header 64px + top action bar + caption + padding
      setPhoneScale(Math.min(1, Math.max(0.58, availH / 688)));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Load invitation
  useEffect(() => {
    async function fetchInv() {
      const data = await DataService.getInvitationById(id);
      if (data) {
        setInvitation(data);
      }
    }
    fetchInv();
  }, [id]);

  if (!invitation) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <span className="font-serif italic text-stone-600">Loading editor studio...</span>
      </div>
    );
  }

  // Update handlers
  const handleUpdate = (updates: Partial<Invitation>) => {
    setInvitation((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const handleUpdateDesign = (updates: Partial<typeof invitation.design_config>) => {
    setInvitation((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        design_config: { ...prev.design_config, ...updates },
      };
    });
  };

  const handleUpdateVenue = (updates: Partial<typeof invitation.venue_details>) => {
    setInvitation((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        venue_details: { ...prev.venue_details, ...updates },
      };
    });
  };

  const handleSave = async () => {
    if (!invitation) return;
    setIsSaving(true);
    try {
      await DataService.updateInvitation(invitation.id, invitation);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save invitation:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTimelineItem = () => {
    const newItem: TimelineItem = {
      id: `time-${Date.now()}`,
      time: '6:00 PM',
      title: 'New Celebration Milestone',
      location: invitation.venue_details.venue_name || 'Main Hall',
      description: 'Add specific details about this segment of your celebration.',
      icon: 'Sparkles',
    };
    handleUpdateDesign({
      timeline: [...invitation.design_config.timeline, newItem],
    });
  };

  const handleRemoveTimelineItem = (index: number) => {
    const updated = invitation.design_config.timeline.filter((_, i) => i !== index);
    handleUpdateDesign({ timeline: updated });
  };

  const handleUpdateTimelineItem = (index: number, updates: Partial<TimelineItem>) => {
    const updated = [...invitation.design_config.timeline];
    updated[index] = { ...updated[index], ...updates };
    handleUpdateDesign({ timeline: updated });
  };

  const testMusicTrack = (trackIdOrUrl: string) => {
    const isNowPlaying = luxuryAudio.togglePreview(trackIdOrUrl);
    setAudioPreviewPlaying(isNowPlaying ? trackIdOrUrl : null);
  };

  const handleCustomAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      handleUpdateDesign({
        music_track: 'custom',
        custom_music_url: dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCustomAudioUrlChange = (url: string) => {
    handleUpdateDesign({
      music_track: 'custom',
      custom_music_url: url,
    });
  };

  return (
    <div className="w-full min-h-screen lg:h-screen lg:overflow-hidden bg-[#F7F5F0] flex flex-col font-sans">
      {/* =========================================================================
          TOP STUDIO NAVIGATION BAR
      ========================================================================= */}
      <header className="h-16 px-4 sm:px-6 bg-white border-b border-stone-200/90 flex items-center justify-between shrink-0 z-40 sticky top-0 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors inline-flex items-center gap-1 text-xs font-medium"
            title="Return to Dashboard"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="h-4 w-[1px] bg-stone-300 hidden sm:block" />
          <div>
            <h1 className="font-serif text-lg sm:text-xl font-semibold text-stone-900 line-clamp-1">
              {invitation.title}
            </h1>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold text-stone-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Studio Editor</span>
              <span>&bull;</span>
              <span>Slug: /invite/{invitation.slug}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Replay Animation Trigger */}
          <button
            onClick={() => setReplayCount((prev) => prev + 1)}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 hover:border-[#C5A059] bg-white text-stone-700 hover:text-[#C5A059] text-xs font-medium shadow-xs transition-colors"
            title="Replay Envelope Wax Seal sequence"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Envelope</span>
          </button>

          {/* View Live Public Link */}
          <Link
            href={`/invite/${invitation.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-medium shadow-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden sm:inline">Live Preview</span>
          </Link>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all ${
              saveSuccess ? 'bg-emerald-600' : 'bg-stone-900 hover:bg-stone-800'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* =========================================================================
          SPLIT-SCREEN MAIN WORKSPACE
      ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ---------------------------------------------------------------------
            LEFT PANEL: NO-CODE CONTROLS & TABS (Fixed/Scrollable Width)
        --------------------------------------------------------------------- */}
        <div className="w-full lg:w-[480px] xl:w-[540px] bg-white border-r border-stone-200/90 flex flex-col shrink-0 overflow-y-auto">
          {/* Tab Navigation */}
          <div className="flex border-b border-stone-200 bg-stone-50/70 p-1.5 gap-1 shrink-0 sticky top-0 z-10 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'theme'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Theme</span>
            </button>

            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'details'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Details</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'schedule'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Schedule</span>
            </button>

            <button
              onClick={() => setActiveTab('music')}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'music'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Music</span>
            </button>
          </div>

          {/* TAB 1: THEMES & COLORS */}
          {activeTab === 'theme' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900 mb-1">
                  Luxury Theme Collection
                </h3>
                <p className="text-xs text-stone-500">
                  Select a bespoke color palette with handcrafted paper finishes and matching wax seal stamps.
                </p>
              </div>

              {/* Theme Selector Cards */}
              <div className="space-y-3">
                {(Object.keys(THEMES) as ThemeId[]).map((themeKey) => {
                  const t = THEMES[themeKey];
                  const isSelected = invitation.theme_id === themeKey;

                  return (
                    <div
                      key={themeKey}
                      onClick={() => handleUpdate({ theme_id: themeKey })}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#C5A059] bg-[#C5A059]/5 shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          {/* Palette preview swatch */}
                          <div className="flex -space-x-1">
                            <span
                              className="w-5 h-5 rounded-full border border-white shadow-xs"
                              style={{ backgroundColor: t.colors.envelopeExterior }}
                            />
                            <span
                              className="w-5 h-5 rounded-full border border-white shadow-xs"
                              style={{ backgroundColor: t.accentGold }}
                            />
                            <span
                              className="w-5 h-5 rounded-full border border-white shadow-xs"
                              style={{ backgroundColor: t.colors.waxSealBackground }}
                            />
                          </div>
                          <span className="font-serif font-medium text-sm text-stone-900">
                            {t.name}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#C5A059] text-white flex items-center justify-center text-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {t.subtitle}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Wax Seal Initial / Monogram */}
              <div className="pt-4 border-t border-stone-200/80 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Embossed Wax Seal Monogram
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    maxLength={4}
                    value={invitation.design_config.wax_seal_initial || ''}
                    onChange={(e) => handleUpdateDesign({ wax_seal_initial: e.target.value })}
                    placeholder="S&A"
                    className="w-24 px-3.5 py-2.5 rounded-xl border border-stone-200 text-center font-serif text-lg font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 uppercase"
                  />
                  <div className="flex gap-2">
                    {['♔', '❀', '✦', 'S&A'].map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => handleUpdateDesign({ wax_seal_initial: sym })}
                        className="w-10 h-10 rounded-xl border border-stone-200 bg-white hover:border-[#C5A059] font-serif text-base flex items-center justify-center transition-colors"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-[11px] text-stone-400 block">
                  Displayed embossed inside the 3D wax seal button and card header crest.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: EVENT DETAILS */}
          {activeTab === 'details' && (
            <div className="p-6 space-y-5">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900 mb-1">
                  Couple &amp; Event Details
                </h3>
                <p className="text-xs text-stone-500">
                  Fill in the names, ceremony timing, venue address, and dress code.
                </p>
              </div>

              {/* Couple Names */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Partner 1
                  </label>
                  <input
                    type="text"
                    value={invitation.design_config.couple_names.partner1}
                    onChange={(e) =>
                      handleUpdateDesign({
                        couple_names: {
                          ...invitation.design_config.couple_names,
                          partner1: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-serif text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Partner 2
                  </label>
                  <input
                    type="text"
                    value={invitation.design_config.couple_names.partner2}
                    onChange={(e) =>
                      handleUpdateDesign({
                        couple_names: {
                          ...invitation.design_config.couple_names,
                          partner2: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-serif text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                  />
                </div>
              </div>

              {/* Event Title & Subtitle */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Honorific Subtitle
                </label>
                <input
                  type="text"
                  value={invitation.design_config.subtitle || ''}
                  onChange={(e) => handleUpdateDesign({ subtitle: e.target.value })}
                  placeholder="Together with their families, request the honor of your presence"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                />
              </div>

              {/* Date & Time */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Event Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={invitation.event_date ? new Date(invitation.event_date).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleUpdate({ event_date: new Date(e.target.value).toISOString() })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-sans text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                />
              </div>

              {/* Venue Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={invitation.venue_details.venue_name}
                  onChange={(e) => handleUpdateVenue({ venue_name: e.target.value })}
                  placeholder="The Grand St. Regis Palace"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                />
              </div>

              {/* Venue Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Full Street Address
                </label>
                <textarea
                  rows={2}
                  value={invitation.venue_details.address}
                  onChange={(e) => handleUpdateVenue({ address: e.target.value })}
                  placeholder="450 Palace Promenade, Beverly Hills, CA 90210"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                />
              </div>

              {/* Google Maps Link */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Google Maps Link
                </label>
                <input
                  type="url"
                  value={invitation.venue_details.maps_url}
                  onChange={(e) => handleUpdateVenue({ maps_url: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                />
              </div>

              {/* Dress Code */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Dress Code &amp; Attire Guidance
                </label>
                <input
                  type="text"
                  value={invitation.venue_details.dress_code || ''}
                  onChange={(e) => handleUpdateVenue({ dress_code: e.target.value })}
                  placeholder="Black Tie & Royal Elegance (Emerald touches welcomed)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                />
              </div>
            </div>
          )}

          {/* TAB 3: SCHEDULE & STORY */}
          {activeTab === 'schedule' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900 mb-1">
                  Story &amp; Celebration Itinerary
                </h3>
                <p className="text-xs text-stone-500">
                  Share your love journey and organize the events for the wedding day.
                </p>
              </div>

              {/* Story */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Our Love Story / Welcome Note
                </label>
                <textarea
                  rows={3}
                  value={invitation.design_config.story || ''}
                  onChange={(e) => handleUpdateDesign({ story: e.target.value })}
                  placeholder="Share a short sweet story of how you met..."
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs leading-relaxed text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                />
              </div>

              {/* Itinerary Timeline List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Day Schedule Timeline
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTimelineItem}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#C5A059] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Event</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {invitation.design_config.timeline.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2 relative group hover:bg-white transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveTimelineItem(idx)}
                        className="absolute top-2.5 right-2.5 text-stone-400 hover:text-rose-500 p-1 transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={item.time}
                          onChange={(e) => handleUpdateTimelineItem(idx, { time: e.target.value })}
                          placeholder="4:30 PM"
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold text-stone-900"
                        />
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateTimelineItem(idx, { title: e.target.value })}
                          placeholder="Welcome Reception"
                          className="col-span-2 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-medium text-stone-900"
                        />
                      </div>

                      <input
                        type="text"
                        value={item.location}
                        onChange={(e) => handleUpdateTimelineItem(idx, { location: e.target.value })}
                        placeholder="Location / Room Name"
                        className="w-full px-2.5 py-1 rounded-lg border border-stone-200 bg-white text-[11px] text-stone-600"
                      />

                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => handleUpdateTimelineItem(idx, { description: e.target.value })}
                        placeholder="Brief description..."
                        className="w-full px-2.5 py-1 rounded-lg border border-stone-200 bg-white text-[11px] text-stone-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM MUSIC ONLY */}
          {activeTab === 'music' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900 mb-1">
                  Custom Background Music (Optional)
                </h3>
                <p className="text-xs text-stone-500">
                  Preset tracks have been removed. Cards stay silent unless you upload your own MP3/M4A file or paste an audio URL.
                </p>
              </div>

              {/* Custom Wedding Music Section */}
              <div className="p-4 rounded-2xl border-2 border-stone-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <h4 className="font-serif font-medium text-sm text-stone-900">
                      Add Custom Couple Track
                    </h4>
                  </div>
                  {invitation.design_config.custom_music_url && (
                    <button
                      type="button"
                      onClick={() => {
                        luxuryAudio.stopPreview();
                        setAudioPreviewPlaying(null);
                        handleUpdateDesign({ music_track: '', custom_music_url: '' });
                      }}
                      className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium hover:bg-rose-100 cursor-pointer"
                    >
                      Remove Song
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <label className="border border-dashed border-stone-300 hover:border-[#C5A059] rounded-xl p-3 flex items-center gap-2.5 cursor-pointer bg-stone-50 hover:bg-[#FFFDF7] transition-all">
                    <Upload className="w-4 h-4 text-stone-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-stone-800 truncate">
                        Upload Song (MP3, M4A, etc.)
                      </div>
                      <div className="text-[10px] text-stone-500">
                        Select audio from phone / computer (up to 25MB)
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg,.opus,.webm,.weba,audio/mp3,audio/mpeg,audio/m4a,audio/x-m4a,audio/mp4,video/mp4"
                      className="hidden"
                      onChange={handleCustomAudioFileUpload}
                    />
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={
                        invitation.design_config.custom_music_url?.startsWith('data:')
                          ? 'Custom Audio File Uploaded'
                          : invitation.design_config.custom_music_url || ''
                      }
                      disabled={Boolean(
                        invitation.design_config.custom_music_url?.startsWith('data:')
                      )}
                      onChange={(e) => handleCustomAudioUrlChange(e.target.value)}
                      placeholder="Or paste direct MP3 link (https://...)"
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                    />
                    {invitation.design_config.custom_music_url && (
                      <button
                        type="button"
                        onClick={() => testMusicTrack(invitation.design_config.custom_music_url!)}
                        className="p-2 rounded-xl bg-[#C5A059] text-white hover:bg-[#B38F46] shrink-0 cursor-pointer"
                        title="Listen to Custom Song"
                      >
                        <Volume2 className={`w-4 h-4 ${audioPreviewPlaying ? 'animate-pulse' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                <span className="font-semibold block">Auto-play &amp; Mobile Compatibility:</span>
                <p className="leading-relaxed text-amber-800">
                  Browsers require a user interaction to begin audio. When a custom track is set, music begins smoothly as soon as the guest taps to open your invitation.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------------
            RIGHT PANEL: REAL-TIME INTERACTIVE MOBILE PHONE PREVIEW
        --------------------------------------------------------------------- */}
        <div className="flex-1 bg-stone-900/5 p-3 sm:p-4 flex flex-col items-center justify-center overflow-y-auto relative">
          
          {/* Top Frame Action Bar */}
          <div className="mb-2.5 flex items-center justify-between w-full max-w-[420px] px-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                  previewMode === 'mobile'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200'
                }`}
                title="Mobile Phone View"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">iPhone Frame</span>
              </button>

              <button
                onClick={() => setPreviewMode('full')}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                  previewMode === 'full'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200'
                }`}
                title="Expanded View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Full Canvas</span>
              </button>
            </div>

            {/* Replay Button */}
            <button
              onClick={() => setReplayCount((c) => c + 1)}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-medium inline-flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-[#C5A059]" />
              <span>Replay Opening</span>
            </button>
          </div>

          {/* Device Mockup Shell (Dynamically scaled for laptop viewport fit) */}
          {previewMode === 'mobile' ? (
            <div
              style={{
                width: 376,
                height: Math.round(688 * phoneScale),
                position: 'relative',
              }}
              className="shrink-0"
            >
              <div
                style={{
                  width: 376,
                  transform: `scale(${phoneScale})`,
                  transformOrigin: 'top center',
                }}
                className="relative h-[688px] bg-stone-900 rounded-[46px] p-3 shadow-2xl ring-1 ring-stone-900/50 flex flex-col"
              >
                {/* iPhone Titanium Perimeter Buttons */}
                <div className="absolute -left-[3px] top-[105px] w-[3px] h-[24px] bg-stone-700 rounded-l-sm" />
                <div className="absolute -left-[3px] top-[145px] w-[3px] h-[44px] bg-stone-700 rounded-l-sm" />
                <div className="absolute -left-[3px] top-[202px] w-[3px] h-[44px] bg-stone-700 rounded-l-sm" />
                <div className="absolute -right-[3px] top-[155px] w-[3px] h-[56px] bg-stone-700 rounded-r-sm" />

                {/* iPhone Inner Bezel Screen */}
                <div className="w-full h-full bg-[#FAF8F5] rounded-[36px] overflow-hidden relative flex flex-col shadow-inner">
                  {/* Dynamic Island Notch */}
                  <div className="w-24 h-1.5 bg-stone-800 rounded-full mx-auto mt-2 mb-1 shrink-0" />

                  {/* Live Synchronized Envelope Experience */}
                  <div className="w-full h-[640px] overflow-y-auto overflow-x-hidden relative">
                    <EnvelopeExperience
                      invitation={invitation}
                      guest={{
                        id: 'preview-guest',
                        invitation_id: invitation.id,
                        guest_name: 'Rahul & Priya Sharma',
                        unique_token: 'preview-token',
                        max_allowed_guests: 2,
                      }}
                      isPreview={true}
                      replayTrigger={replayCount}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Full canvas preview */
            <div className="w-full h-full max-w-4xl bg-[#FAF8F5] rounded-3xl border border-stone-200/90 shadow-lg overflow-y-auto p-4 sm:p-8">
              <EnvelopeExperience
                invitation={invitation}
                guest={{
                  id: 'preview-guest',
                  invitation_id: invitation.id,
                  guest_name: 'Rahul & Priya Sharma',
                  unique_token: 'preview-token',
                  max_allowed_guests: 2,
                }}
                isPreview={true}
                replayTrigger={replayCount}
              />
            </div>
          )}

          <div className="mt-3 text-center">
            <span className="text-[11px] font-sans text-stone-400">
              Interactive Live Preview &bull; Click the wax seal to test opening animations
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
