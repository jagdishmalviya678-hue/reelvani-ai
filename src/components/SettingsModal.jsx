import React, { useState, useEffect } from 'react';
import { X, Settings, Key, User, BarChart2, Check, RefreshCw } from 'lucide-react';
import { storageService } from '../services/storageService';
import { LANGUAGES } from '../data/regionalData';

export default function SettingsModal({
  isOpen,
  onClose,
  showToast
}) {
  const [settings, setSettings] = useState(storageService.getSettings());
  const [stats, setStats] = useState({ totalGenerations: 0, regenerations: 0, copies: 0 });

  useEffect(() => {
    if (isOpen) {
      setSettings(storageService.getSettings());
      const raw = localStorage.getItem('reelvani_regen_stats_v1');
      if (raw) {
        setStats(JSON.parse(raw));
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    storageService.saveSettings(settings);
    showToast('Settings saved successfully!', 'success');
    onClose();
  };

  const regenRate = stats.totalGenerations > 0 
    ? Math.round((stats.regenerations / stats.totalGenerations) * 100) 
    : 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3>
            <Settings size={20} color="#00E5FF" />
            <span>Studio Settings & AI Keys</span>
          </h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* AI Engines Config */}
          <div className="field-group">
            <div className="field-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={14} color="#FF6B00" />
                <span>Google Gemini API Key (Optional)</span>
              </span>
              <span className="label-tag">Free Tier Supported</span>
            </div>
            <input
              type="password"
              className="input-topic"
              placeholder="Paste AI Studio Gemini Key (AIzaSy...)"
              value={settings.geminiApiKey || ''}
              onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
            />
            <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
              Note: If left blank, ReelVani automatically uses its built-in Native Regional Engine for instant generation!
            </p>
          </div>

          <div className="field-group">
            <div className="field-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={14} color="#10B981" />
                <span>OpenAI API Key (Optional)</span>
              </span>
              <span className="label-tag">GPT-4o-mini</span>
            </div>
            <input
              type="password"
              className="input-topic"
              placeholder="Paste OpenAI API Key (sk-...)"
              value={settings.openaiApiKey || ''}
              onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
            />
          </div>

          {/* Creator Profile */}
          <div className="field-group">
            <div className="field-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} />
                <span>Default Regional Language</span>
              </span>
            </div>
            <select
              className="input-topic"
              style={{ cursor: 'pointer' }}
              value={settings.preferredLanguage || 'hindi'}
              onChange={(e) => setSettings({ ...settings, preferredLanguage: e.target.value })}
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id} style={{ background: '#131926' }}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Key Metric Analytics Box (From User Spec) */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--color-secondary)' }}>
              <BarChart2 size={15} />
              <span>Studio Quality Analytics (Post-Launch Metric)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', marginTop: '4px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>{stats.totalGenerations || 0}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Total Runs</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFA500' }}>{stats.regenerations || 0}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Regenerates</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981' }}>{regenRate}%</div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Regen Rate</div>
              </div>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
              Target: Keep Regen Rate under 25% for high user satisfaction with script output.
            </p>
          </div>

          {/* Save Button */}
          <button
            className="btn btn-primary"
            onClick={handleSave}
            style={{ width: '100%', marginTop: '6px' }}
          >
            <Check size={16} />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
}
