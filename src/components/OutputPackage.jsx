import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  RotateCcw, 
  Bookmark, 
  BookmarkCheck, 
  Play, 
  Share2, 
  Sparkles, 
  Volume2, 
  ArrowLeft,
  Flame,
  Layers,
  Mic,
  Type
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PLATFORMS } from '../data/regionalData';

export default function OutputPackage({
  packageData,
  onRegenerate,
  onSave,
  isSaved,
  onOpenTeleprompter,
  onBackToEdit,
  showToast,
  isLoading
}) {
  const [copiedSection, setCopiedSection] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedVariationIdx, setSelectedVariationIdx] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState(packageData.selectedPlatform || 'reels');
  const [viewMode, setViewMode] = useState(packageData.scriptMode || 'voiceover'); // 'voiceover' | 'text_overlay'

  if (!packageData) return null;

  const variations = packageData.variations || [
    {
      id: 'var_a',
      styleName: 'Default Variation',
      hook: packageData.hook,
      body: packageData.body,
      cta: packageData.cta
    }
  ];

  const currentVar = variations[selectedVariationIdx] || variations[0];

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {
      // ignore
    }
  };

  const copyToClipboard = async (text, sectionName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionName);
      showToast(`${sectionName} Copied!`, 'success');
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      showToast('Could not copy directly to clipboard', 'error');
    }
  };

  const getActiveCaption = () => {
    if (packageData.platformFormats && packageData.platformFormats[selectedPlatform]) {
      return packageData.platformFormats[selectedPlatform].caption;
    }
    return packageData.caption || '';
  };

  const getActiveHashtags = () => {
    if (packageData.platformFormats && packageData.platformFormats[selectedPlatform]) {
      return packageData.platformFormats[selectedPlatform].hashtags;
    }
    return packageData.hashtags || [];
  };

  const getFullScriptText = () => {
    const isVO = viewMode === 'voiceover';
    let script = `🎬 [HOOK (0-3s)] (${currentVar.styleName})\n${currentVar.hook?.visualCue || ''}\n${isVO ? currentVar.hook?.voiceOverText || currentVar.hook?.dialogue : currentVar.hook?.screenOverlayText || currentVar.hook?.dialogue}\n\n`;
    script += `🎥 [BODY BEATS]\n`;
    currentVar.body?.forEach((b, i) => {
      script += `Beat #${i + 1}: ${b.visualCue || ''}\n${isVO ? b.voiceOverText || b.dialogue : b.screenOverlayText || b.dialogue}\n\n`;
    });
    script += `📢 [CALL TO ACTION (20-30s)]\n${currentVar.cta?.visualCue || ''}\n${isVO ? currentVar.cta?.voiceOverText || currentVar.cta?.dialogue : currentVar.cta?.screenOverlayText || currentVar.cta?.dialogue}`;
    return script;
  };

  const getCompletePackageText = () => {
    const fullScript = getFullScriptText();
    const caption = getActiveCaption();
    const hashtags = getActiveHashtags().join(' ');

    return `🔥 ${packageData.title || 'ReelVani AI Script'} [${selectedPlatform.toUpperCase()}]\n\n=== 🎬 READY-TO-SHOOT SCRIPT (${currentVar.styleName}) ===\n${fullScript}\n\n=== 📝 CAPTION ===\n${caption}\n\n=== 🏷️ HASHTAGS ===\n${hashtags}`;
  };

  const handleCopyComplete = () => {
    copyToClipboard(getCompletePackageText(), 'Complete Package');
    triggerConfetti();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: packageData.title || 'ReelVani Script',
          text: getCompletePackageText()
        });
        showToast('Shared successfully!', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyComplete();
        }
      }
    } else {
      handleCopyComplete();
    }
  };

  const playSpeechPreview = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis not supported in this browser', 'error');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const spokenText = `${currentVar.hook?.dialogue || ''}. ${currentVar.body?.map(b => b.dialogue).join('. ') || ''}. ${currentVar.cta?.dialogue || ''}`;
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="output-container">
      {/* Header Bar */}
      <div className="output-header-bar">
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onBackToEdit}
        >
          <ArrowLeft size={14} />
          <span>Edit Topic</span>
        </button>

        <div className="output-meta-chips">
          <span className="meta-chip font-display">
            ⏱️ {packageData.estimatedDuration || '30s'}
          </span>
          <span className="meta-chip" style={{ color: 'var(--color-primary)', textTransform: 'capitalize' }}>
            {packageData.language || 'Hindi'}
          </span>
        </div>
      </div>

      {/* 3 Hook Variations Switcher */}
      <div className="field-group" style={{ marginBottom: '4px' }}>
        <div className="field-label">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} color="#00E5FF" />
            <span>3 Hook Angle Variations:</span>
          </span>
          <span className="label-tag">Select Style</span>
        </div>
        <div className="pill-selector">
          {variations.map((v, idx) => (
            <button
              key={idx}
              className={`selector-pill ${selectedVariationIdx === idx ? 'active' : ''}`}
              onClick={() => setSelectedVariationIdx(idx)}
            >
              <span>{idx === 0 ? '❓' : idx === 1 ? '⚡' : '🎭'}</span>
              <span>Var {String.fromCharCode(65 + idx)}: {v.styleName.split('/')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Platform & Script Mode Switcher Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        {/* Platform Selector */}
        <div className="pill-selector" style={{ flex: 1 }}>
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              className={`selector-pill ${selectedPlatform === p.id ? 'active' : ''}`}
              style={{ padding: '5px 10px', fontSize: '11px' }}
              onClick={() => setSelectedPlatform(p.id)}
            >
              <span>{p.icon}</span>
              <span>{p.name.split(' ')[1] || p.name}</span>
            </button>
          ))}
        </div>

        {/* Voice-Over vs Text Overlay Mode */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className={`btn btn-sm ${viewMode === 'voiceover' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '5px 8px', fontSize: '11px' }}
            onClick={() => setViewMode('voiceover')}
            title="Voice-Over Reading Mode"
          >
            <Mic size={12} />
            <span>VO</span>
          </button>
          <button
            className={`btn btn-sm ${viewMode === 'text_overlay' ? 'btn-cyan' : 'btn-secondary'}`}
            style={{ padding: '5px 8px', fontSize: '11px' }}
            onClick={() => setViewMode('text_overlay')}
            title="On-Screen Text Mode"
          >
            <Type size={12} />
            <span>Text</span>
          </button>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="quick-action-bar">
        <button 
          className="btn btn-cyan btn-sm"
          onClick={handleCopyComplete}
        >
          <Copy size={15} />
          <span>Copy All</span>
        </button>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={onOpenTeleprompter}
        >
          <Play size={15} color="#00E5FF" />
          <span>Rehearse</span>
        </button>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={onSave}
          style={isSaved ? { borderColor: 'var(--color-accent-green)', color: '#34D399' } : {}}
        >
          {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* 1. Structured Script Card */}
      <div className="script-card">
        <div className="script-card-header">
          <div className="script-card-title">
            <span>🎬 {currentVar.styleName} ({viewMode === 'voiceover' ? 'Voice-Over' : 'On-Screen Text'})</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              className="copy-mini-btn"
              onClick={playSpeechPreview}
              title="Listen to audio reading preview"
            >
              <Volume2 size={13} />
              <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
            </button>
            <button 
              className="copy-mini-btn"
              onClick={() => copyToClipboard(getFullScriptText(), 'Script')}
            >
              {copiedSection === 'Script' ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedSection === 'Script' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="script-content-body">
          {/* Hook (0-3s) */}
          <div className="script-block hook-block">
            <div className="block-tag">
              <span>⚡ Hook (0-3s Attention Grabber)</span>
            </div>
            {currentVar.hook?.visualCue && (
              <span className="block-cue">{currentVar.hook.visualCue}</span>
            )}
            <p className="block-text">
              {viewMode === 'voiceover' 
                ? (currentVar.hook?.voiceOverText || currentVar.hook?.dialogue)
                : (currentVar.hook?.screenOverlayText || currentVar.hook?.dialogue)}
            </p>
          </div>

          {/* Body Beats (3-20s) */}
          {currentVar.body?.map((beat, idx) => (
            <div key={idx} className="script-block body-block">
              <div className="block-tag">
                <span>🎥 Beat #{idx + 1} ({idx === 0 ? 'Core Point' : idx === 1 ? 'Proof/Value' : 'Punch'})</span>
              </div>
              {beat.visualCue && (
                <span className="block-cue">{beat.visualCue}</span>
              )}
              <p className="block-text">
                {viewMode === 'voiceover'
                  ? (beat.voiceOverText || beat.dialogue)
                  : (beat.screenOverlayText || beat.dialogue)}
              </p>
            </div>
          ))}

          {/* CTA / Closing (20-30s) */}
          <div className="script-block cta-block">
            <div className="block-tag">
              <span>📢 Closing / Call to Action</span>
            </div>
            {currentVar.cta?.visualCue && (
              <span className="block-cue">{currentVar.cta.visualCue}</span>
            )}
            <p className="block-text">
              {viewMode === 'voiceover'
                ? (currentVar.cta?.voiceOverText || currentVar.cta?.dialogue)
                : (currentVar.cta?.screenOverlayText || currentVar.cta?.dialogue)}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Caption Card (Platform-Tailored) */}
      <div className="caption-card">
        <div className="card-top-bar">
          <span className="card-top-title">
            📝 {selectedPlatform.toUpperCase()} Caption
          </span>
          <button 
            className="copy-mini-btn"
            onClick={() => copyToClipboard(getActiveCaption(), 'Caption')}
          >
            {copiedSection === 'Caption' ? <Check size={13} /> : <Copy size={13} />}
            <span>{copiedSection === 'Caption' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="caption-text-area">
          {getActiveCaption()}
        </div>
      </div>

      {/* 3. Hashtags Card */}
      <div className="hashtags-card">
        <div className="card-top-bar">
          <span className="card-top-title">
            🏷️ {selectedPlatform.toUpperCase()} Hashtags ({getActiveHashtags().length})
          </span>
          <button 
            className="copy-mini-btn"
            onClick={() => copyToClipboard(getActiveHashtags().join(' '), 'Hashtags')}
          >
            {copiedSection === 'Hashtags' ? <Check size={13} /> : <Copy size={13} />}
            <span>{copiedSection === 'Hashtags' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="hashtag-wrap">
          {getActiveHashtags().map((tag, idx) => (
            <span 
              key={idx} 
              className="hashtag-pill"
              onClick={() => copyToClipboard(tag, tag)}
              title="Click to copy single tag"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Creator Pro Tip Card */}
      {packageData.creatorTip && (
        <div className="tip-card">
          <div className="card-top-bar">
            <span className="card-top-title" style={{ color: '#F59E0B' }}>
              💡 Shooting & Hook Delivery Tip
            </span>
          </div>
          <p className="tip-text">{packageData.creatorTip}</p>
        </div>
      )}

      {/* Bottom Action Row: Regenerate / Share */}
      <div className="output-bottom-actions">
        <button 
          className="btn btn-regen"
          onClick={onRegenerate}
          disabled={isLoading}
        >
          <RotateCcw size={16} className={isLoading ? 'spinner' : ''} />
          <span>{isLoading ? 'Regenerating...' : 'Regenerate'}</span>
        </button>

        <button 
          className="btn btn-primary btn-copy-all"
          onClick={handleShare}
        >
          <Share2 size={17} />
          <span>Share / Export</span>
        </button>
      </div>
    </div>
  );
}
