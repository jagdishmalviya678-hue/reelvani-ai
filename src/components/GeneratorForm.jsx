import React from 'react';
import { Sparkles, Flame, Wand2, X, BookOpen, Calendar, Mic, Type } from 'lucide-react';
import { LANGUAGES, CONTENT_TYPES, TONES, DURATIONS, PLATFORMS, TOPIC_INSPIRATIONS } from '../data/regionalData';

export default function GeneratorForm({
  formData,
  setFormData,
  onGenerate,
  isLoading,
  onOpenTrending,
  onOpenTemplates,
  onOpenBatch
}) {
  const handleTopicChipClick = (chip) => {
    setFormData((prev) => ({
      ...prev,
      topic: chip.topic,
      language: chip.lang || prev.language,
      contentType: chip.type || prev.contentType
    }));
  };

  const handleLanguageChange = (langId) => {
    setFormData((prev) => ({ ...prev, language: langId }));
  };

  const handleTypeChange = (typeId) => {
    setFormData((prev) => ({ ...prev, contentType: typeId }));
  };

  const handleToneChange = (toneId) => {
    setFormData((prev) => ({ ...prev, tone: toneId }));
  };

  const handleDurationChange = (durId) => {
    setFormData((prev) => ({ ...prev, duration: durId }));
  };

  const handlePlatformChange = (platId) => {
    setFormData((prev) => ({ ...prev, platform: platId }));
  };

  const handleScriptModeChange = (mode) => {
    setFormData((prev) => ({ ...prev, scriptMode: mode }));
  };

  const clearTrendingHook = (e) => {
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      includeTrendingHook: false,
      trendingHookText: ''
    }));
  };

  return (
    <div className="form-section">
      {/* Quick Hero Banner */}
      <div className="hero-card">
        <div>
          <div className="hero-tag">
            <Sparkles size={13} />
            <span>AI Short-Video Director</span>
          </div>
          <h2>Regional Reels & Shorts Studio</h2>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            className="hero-trending-btn"
            onClick={onOpenTemplates}
            title="Open Niche Templates"
          >
            📚 Templates
          </button>
          <button 
            className="hero-trending-btn"
            onClick={onOpenBatch}
            title="7-Day Content Calendar"
            style={{ background: 'rgba(255,107,0,0.2)', borderColor: 'var(--color-primary)' }}
          >
            📅 7-Day Pack
          </button>
        </div>
      </div>

      {/* 1. Topic / Niche Input */}
      <div className="field-group">
        <div className="field-label">
          <span>1. Topic / Niche (किस विषय पर रील बनानी है?)</span>
          <span className="label-tag">Free Text</span>
        </div>
        <div className="input-topic-wrap">
          <input
            type="text"
            className="input-topic"
            placeholder="e.g. Gym motivation, Chai tapri business, Bihari swag, College life..."
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && formData.topic.trim()) {
                onGenerate();
              }
            }}
          />
        </div>

        {/* Quick Topic Suggestion Chips */}
        <div className="topic-chips-scroll">
          {TOPIC_INSPIRATIONS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              className="topic-chip"
              onClick={() => handleTopicChipClick(chip)}
            >
              + {chip.topic}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Platform Selector (Reels / Shorts / WhatsApp Status) */}
      <div className="field-group">
        <div className="field-label">
          <span>2. Target Platform (कहाँ पोस्ट करना है?)</span>
        </div>
        <div className="pill-selector">
          {PLATFORMS.map((p) => {
            const isActive = (formData.platform || 'reels') === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`selector-pill ${isActive ? 'active' : ''}`}
                onClick={() => handlePlatformChange(p.id)}
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Regional Language Selection */}
      <div className="field-group">
        <div className="field-label">
          <span>3. Regional Language (क्षेत्रीय भाषा चुनें)</span>
          <span className="label-tag">Native Slang</span>
        </div>
        <div className="lang-grid">
          {LANGUAGES.map((lang) => {
            const isActive = formData.language === lang.id;
            return (
              <div
                key={lang.id}
                className={`lang-card ${isActive ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.id)}
              >
                <div className="lang-header">
                  <span className="lang-flag">{lang.flag}</span>
                  <span className="lang-name">{lang.name.split(' ')[0]}</span>
                </div>
                <span className="lang-native">{lang.native}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Voice-Over vs Text-Overlay Style Switcher */}
      <div className="field-group">
        <div className="field-label">
          <span>4. Script Style & Delivery Mode</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            type="button"
            className={`type-card ${(formData.scriptMode || 'voiceover') === 'voiceover' ? 'active' : ''}`}
            onClick={() => handleScriptModeChange('voiceover')}
          >
            <Mic size={18} color="#FF6B00" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Voice-Over Mode</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Spoken rhythm & pauses</div>
            </div>
          </button>

          <button
            type="button"
            className={`type-card ${formData.scriptMode === 'text_overlay' ? 'active' : ''}`}
            onClick={() => handleScriptModeChange('text_overlay')}
          >
            <Type size={18} color="#00E5FF" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Text Overlay Mode</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Fast on-screen captions</div>
            </div>
          </button>
        </div>
      </div>

      {/* 5. Content Type Selector */}
      <div className="field-group">
        <div className="field-label">
          <span>5. Content Category (रील का प्रकार)</span>
        </div>
        <div className="type-grid">
          {CONTENT_TYPES.map((cat) => {
            const isActive = formData.contentType === cat.id;
            return (
              <div
                key={cat.id}
                className={`type-card ${isActive ? 'active' : ''}`}
                onClick={() => handleTypeChange(cat.id)}
              >
                <span className="type-icon">{cat.icon}</span>
                <span className="type-label">{cat.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Tone & Duration Selectors */}
      <div className="field-group">
        <div className="field-label">
          <span>6. Creator Tone (अंदाज़) & Duration</span>
        </div>
        <div className="pill-selector" style={{ marginBottom: '6px' }}>
          {TONES.map((t) => {
            const isActive = formData.tone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                className={`selector-pill ${isActive ? 'active' : ''}`}
                onClick={() => handleToneChange(t.id)}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="pill-selector">
          {DURATIONS.map((d) => {
            const isActive = formData.duration === d.id;
            return (
              <button
                key={d.id}
                type="button"
                className={`selector-pill ${isActive ? 'active' : ''}`}
                onClick={() => handleDurationChange(d.id)}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Trending Hook Attachment Layer */}
      {formData.includeTrendingHook && formData.trendingHookText ? (
        <div className="trending-toggle-box">
          <div className="trending-toggle-info">
            <Flame size={16} color="#FF6B00" />
            <div>
              <span>Attached Trending Hook:</span>
              <p>"{formData.trendingHookText}"</p>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-close"
            onClick={clearTrendingHook}
            title="Remove trending hook"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div 
          className="trending-toggle-box" 
          style={{ cursor: 'pointer' }}
          onClick={onOpenTrending}
        >
          <div className="trending-toggle-info">
            <Flame size={16} color="#FF6B00" />
            <div>
              <span>Attach Viral Hook From Library</span>
              <p>Pick from 2026 weekly updated trending dialogues</p>
            </div>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 700 }}>
            Pick Hook &rarr;
          </span>
        </div>
      )}

      {/* 8. Master 1-Tap Generate Button */}
      <div className="generate-btn-wrap">
        <button
          type="button"
          className="btn btn-generate"
          onClick={onGenerate}
          disabled={isLoading || !formData.topic.trim()}
        >
          {isLoading ? (
            <>
              <div className="spinner" />
              <span>Crafting 3 Script Variations...</span>
            </>
          ) : (
            <>
              <Wand2 size={20} />
              <span>Generate Reel Studio Package ✨</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
