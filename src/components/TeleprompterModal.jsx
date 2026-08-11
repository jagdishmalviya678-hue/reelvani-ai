import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, FastForward } from 'lucide-react';

export default function TeleprompterModal({ isOpen, onClose, packageData }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2); // 1 = slow, 2 = medium, 3 = fast
  const scrollRef = useRef(null);

  useEffect(() => {
    let animationFrame;
    const scrollContainer = scrollRef.current;

    const autoScroll = () => {
      if (isPlaying && scrollContainer) {
        scrollContainer.scrollTop += speed * 0.8;
        if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 5) {
          setIsPlaying(false);
        }
      }
      if (isPlaying) {
        animationFrame = requestAnimationFrame(autoScroll);
      }
    };

    if (isPlaying) {
      animationFrame = requestAnimationFrame(autoScroll);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, speed]);

  if (!isOpen || !packageData) return null;

  const handleReset = () => {
    setIsPlaying(false);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content teleprompter-view" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header" style={{ background: '#000000', borderBottomColor: 'rgba(255,255,255,0.1)' }}>
          <h3>🎙️ Teleprompter & Shoot Rehearsal</h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Scrolling Prompt Lines */}
        <div className="teleprompter-scroll-area" ref={scrollRef}>
          <div style={{ height: '80px' }} />

          {/* Hook */}
          <div className="teleprompter-block">
            <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase' }}>
              ⚡ Hook (0-3s)
            </span>
            <p className="teleprompter-line highlight">
              "{packageData.hook?.dialogue}"
            </p>
          </div>

          {/* Body Beats */}
          {packageData.body?.map((beat, i) => (
            <div key={i} className="teleprompter-block">
              <span style={{ fontSize: '12px', color: 'var(--color-secondary)', fontWeight: 800, textTransform: 'uppercase' }}>
                🎬 Beat #{i + 1}
              </span>
              <p className="teleprompter-line">
                "{beat.dialogue}"
              </p>
            </div>
          ))}

          {/* CTA */}
          <div className="teleprompter-block">
            <span style={{ fontSize: '12px', color: 'var(--color-accent-purple)', fontWeight: 800, textTransform: 'uppercase' }}>
              📢 Closing CTA (20-30s)
            </span>
            <p className="teleprompter-line highlight">
              "{packageData.cta?.dialogue}"
            </p>
          </div>

          <div style={{ height: '180px' }} />
        </div>

        {/* Teleprompter Controls */}
        <div className="teleprompter-controls">
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span>{isPlaying ? 'Pause' : 'Start Scroll'}</span>
            </button>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleReset}
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>

          {/* Speed Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Speed:</span>
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                className={`btn btn-sm ${speed === s ? 'btn-cyan' : 'btn-secondary'}`}
                style={{ padding: '4px 10px', fontSize: '11px' }}
                onClick={() => setSpeed(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
