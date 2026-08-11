import React, { useState } from 'react';
import { X, Flame, Music, Video, PlusCircle, Check } from 'lucide-react';
import { TRENDING_HOOKS_LIBRARY, LANGUAGES } from '../data/regionalData';

export default function TrendingHooksModal({
  isOpen,
  onClose,
  onSelectHook,
  selectedHookText
}) {
  const [activeLangFilter, setActiveLangFilter] = useState('all');

  if (!isOpen) return null;

  const filteredHooks = activeLangFilter === 'all'
    ? TRENDING_HOOKS_LIBRARY
    : TRENDING_HOOKS_LIBRARY.filter(h => h.language === activeLangFilter);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3>
            <Flame size={20} color="#FF6B00" />
            <span>Trending Viral Hooks (Week 33)</span>
          </h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Curated 2026 short-video opening hooks and trending audio formats. Tap <strong>"Use Hook"</strong> to automatically inject it into your script generator!
          </p>

          {/* Language Filter */}
          <div className="pill-selector">
            <button
              className={`selector-pill ${activeLangFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveLangFilter('all')}
            >
              All Languages
            </button>
            {LANGUAGES.slice(0, 6).map((lang) => (
              <button
                key={lang.id}
                className={`selector-pill ${activeLangFilter === lang.id ? 'active' : ''}`}
                onClick={() => setActiveLangFilter(lang.id)}
              >
                {lang.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Hooks List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredHooks.map((item) => {
              const isSelected = selectedHookText === item.hookText;
              return (
                <div 
                  key={item.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 800, 
                      color: 'var(--color-primary)', 
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px'
                    }}>
                      {item.category} • {item.language.toUpperCase()}
                    </span>
                    
                    <button
                      className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => {
                        onSelectHook(item);
                        onClose();
                      }}
                    >
                      {isSelected ? <Check size={14} /> : <PlusCircle size={14} />}
                      <span>{isSelected ? 'Selected' : 'Use Hook'}</span>
                    </button>
                  </div>

                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.4 }}>
                    "{item.hookText}"
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--text-dim)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Music size={13} color="#00E5FF" />
                      <span>Audio Vibe: {item.audioVibe}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Video size={13} color="#A855F7" />
                      <span>Visual Format: {item.format}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
