import React, { useState } from 'react';
import { X, BookOpen, Sparkles, ArrowRight, Check } from 'lucide-react';
import { NICHE_TEMPLATES } from '../data/regionalData';

export default function TemplateLibraryModal({
  isOpen,
  onClose,
  onSelectTemplate
}) {
  const [selectedNiche, setSelectedNiche] = useState(NICHE_TEMPLATES[0].id);

  if (!isOpen) return null;

  const currentNiche = NICHE_TEMPLATES.find(n => n.id === selectedNiche) || NICHE_TEMPLATES[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3>
            <BookOpen size={20} color="#00E5FF" />
            <span>Creator Niche Template Library</span>
          </h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Never start with a blank screen! Choose your creator category and tap any pre-built viral topic to load it instantly.
          </p>

          {/* Niche Categories Pill Selector */}
          <div className="pill-selector">
            {NICHE_TEMPLATES.map((niche) => (
              <button
                key={niche.id}
                className={`selector-pill ${selectedNiche === niche.id ? 'active' : ''}`}
                onClick={() => setSelectedNiche(niche.id)}
              >
                <span>{niche.icon}</span>
                <span>{niche.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Topics List for Active Niche */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentNiche.topics.map((t, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  onSelectTemplate(t.prompt);
                  onClose();
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                    {t.title}
                  </h4>
                  <button 
                    className="btn btn-cyan btn-sm"
                    style={{ padding: '4px 10px', fontSize: '11px' }}
                  >
                    <span>Use &rarr;</span>
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  "{t.prompt}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
