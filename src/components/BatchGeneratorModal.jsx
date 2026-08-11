import React, { useState } from 'react';
import { X, Calendar, Sparkles, Copy, Download, Check, Play, Bookmark } from 'lucide-react';
import { aiGenerator } from '../services/aiGenerator';
import { storageService } from '../services/storageService';
import { LANGUAGES } from '../data/regionalData';
import confetti from 'canvas-confetti';

export default function BatchGeneratorModal({
  isOpen,
  onClose,
  isPro,
  onOpenPricing,
  onOpenScriptInStudio,
  showToast
}) {
  const [theme, setTheme] = useState('Chai Tapri & Desi Business Growth');
  const [language, setLanguage] = useState('hindi');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentPack, setContentPack] = useState(null);
  const [copiedDay, setCopiedDay] = useState(null);

  if (!isOpen) return null;

  const handleGenerateBatch = async () => {
    if (!theme.trim()) {
      showToast('Please enter a theme for your 7-day content pack', 'error');
      return;
    }

    if (!isPro) {
      onOpenPricing();
      showToast('7-Day Batch Packs is a Pro feature! Upgrade to unlock.', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const pack = await aiGenerator.generate7DayContentPack({
        theme,
        language
      });
      setContentPack(pack);
      showToast('🎉 7-Day Content Pack Generated!', 'sparkle');
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch {
        // ignore
      }
    } catch (e) {
      console.error(e);
      showToast('Error generating pack', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyDayScript = async (dayItem, idx) => {
    const s = dayItem.scriptPackage;
    const text = `🎬 ${dayItem.dayName}: ${dayItem.focusArea}\n\n[HOOK]: "${s.hook?.dialogue}"\n\n[BODY]:\n${s.body?.map((b, i) => `#${i+1} ${b.dialogue}`).join('\n')}\n\n[CTA]: "${s.cta?.dialogue}"\n\n[CAPTION]:\n${s.caption}\n\n[TAGS]:\n${(s.hashtags || []).join(' ')}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedDay(idx);
      showToast(`${dayItem.dayName} Script Copied!`, 'success');
      setTimeout(() => setCopiedDay(null), 2000);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const copyAll7Days = async () => {
    if (!contentPack) return;
    let fullText = `🔥 7-DAY CONTENT PACK: "${contentPack.theme}" (${contentPack.language.toUpperCase()})\n=========================================\n\n`;
    contentPack.days.forEach((d) => {
      const s = d.scriptPackage;
      fullText += `📅 ${d.dayName} [${d.focusArea}]\n-----------------------------------------\n`;
      fullText += `[HOOK]: "${s.hook?.dialogue}"\n`;
      fullText += `[BODY]:\n${s.body?.map(b => `* ${b.dialogue}`).join('\n')}\n`;
      fullText += `[CTA]: "${s.cta?.dialogue}"\n`;
      fullText += `[CAPTION]: ${s.caption}\n`;
      fullText += `[TAGS]: ${(s.hashtags || []).join(' ')}\n\n`;
    });

    try {
      await navigator.clipboard.writeText(fullText);
      showToast('Full 7-Day Content Pack Copied!', 'sparkle');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const saveAllToLibrary = () => {
    if (!contentPack) return;
    contentPack.days.forEach(d => {
      storageService.saveScript({
        ...d.scriptPackage,
        title: `${d.dayName} - ${d.focusArea} (${contentPack.theme})`
      });
    });
    showToast('Saved all 7 scripts to My Scripts library!', 'success');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3>
            <Calendar size={20} color="#FF6B00" />
            <span>7-Day Content Pack Generator</span>
          </h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Generate a complete week (Monday to Sunday) of viral, high-retention short scripts on your niche in 1 single tap!
          </p>

          {!contentPack ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="field-group">
                <div className="field-label">
                  <span>Weekly Niche / Central Theme</span>
                </div>
                <input
                  type="text"
                  className="input-topic"
                  placeholder="e.g. Gym Muscle Gain & Diet, Chai Tapri Hustle, Real Estate Sales..."
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                />
              </div>

              <div className="field-group">
                <div className="field-label">
                  <span>Target Regional Language</span>
                </div>
                <select
                  className="input-topic"
                  style={{ cursor: 'pointer' }}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.id} value={l.id} style={{ background: '#131926' }}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-primary btn-lg"
                onClick={handleGenerateBatch}
                disabled={isGenerating}
                style={{ width: '100%', marginTop: '6px' }}
              >
                {isGenerating ? (
                  <>
                    <div className="spinner" />
                    <span>Writing 7 Daily Scripts...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Full 7-Day Pack ✨</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setContentPack(null)}
                >
                  &larr; New Pack
                </button>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="btn btn-cyan btn-sm"
                    onClick={copyAll7Days}
                  >
                    <Copy size={13} />
                    <span>Copy All 7 Days</span>
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={saveAllToLibrary}
                    title="Save all to library"
                  >
                    <Bookmark size={13} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {contentPack.days.map((dayItem, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)' }}>
                        {dayItem.dayName} • {dayItem.focusArea}
                      </span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                          onClick={() => copyDayScript(dayItem, idx)}
                        >
                          {copiedDay === idx ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedDay === idx ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          className="btn btn-cyan btn-sm"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                          onClick={() => {
                            onOpenScriptInStudio(dayItem.scriptPackage);
                            onClose();
                          }}
                        >
                          <span>Open</span>
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                      ⚡ Hook: "{dayItem.scriptPackage.hook?.dialogue}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
