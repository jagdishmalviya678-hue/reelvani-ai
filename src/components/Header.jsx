import React from 'react';
import { Flame, Bookmark, Settings, Crown, Sparkles } from 'lucide-react';

export default function Header({ 
  quota, 
  onOpenTrending, 
  onOpenSaved, 
  onOpenSettings, 
  onOpenPricing 
}) {
  return (
    <header className="app-header">
      <div className="logo-wrap">
        <div className="logo-badge">
          🎬
        </div>
        <div className="logo-text-wrap">
          <h1 className="font-display">ReelVani AI</h1>
          <span>देसी Reels & Shorts</span>
        </div>
      </div>

      <div className="header-actions">
        {/* Daily Quota / Pro Status Pill */}
        <button 
          className={`quota-badge ${quota.isPro ? 'pro' : ''}`}
          onClick={onOpenPricing}
          title="Daily generation quota or upgrade to Pro"
        >
          {quota.isPro ? (
            <>
              <Crown size={14} />
              <span>PRO UNLIMITED</span>
            </>
          ) : (
            <>
              <Sparkles size={14} />
              <span>{quota.remaining}/{quota.limit} Free Left</span>
            </>
          )}
        </button>

        {/* Trending Hooks Trigger */}
        <button 
          className="btn btn-secondary btn-icon"
          onClick={onOpenTrending}
          title="Trending Hooks Library"
        >
          <Flame size={18} color="#FF6B00" />
        </button>

        {/* Saved History Trigger */}
        <button 
          className="btn btn-secondary btn-icon"
          onClick={onOpenSaved}
          title="My Saved Scripts"
        >
          <Bookmark size={18} />
        </button>

        {/* Settings Trigger */}
        <button 
          className="btn btn-secondary btn-icon"
          onClick={onOpenSettings}
          title="Settings & API Keys"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
