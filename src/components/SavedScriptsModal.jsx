import React, { useState } from 'react';
import { X, Bookmark, Trash2, Copy, Download, Search, Sparkles, ThumbsUp, ThumbsDown, Filter } from 'lucide-react';
import { storageService } from '../services/storageService';

export default function SavedScriptsModal({
  isOpen,
  onClose,
  savedScripts,
  onSelectScript,
  onDeleteScript,
  onUpdateScripts,
  showToast
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('all'); // 'all' | 'worked_well' | 'flopped' | 'untested'

  if (!isOpen) return null;

  const handleTagChange = (scriptId, newTag) => {
    const updated = storageService.setPerformanceTag(scriptId, newTag);
    if (onUpdateScripts) onUpdateScripts(updated);
    showToast(newTag === 'worked_well' ? 'Tagged as "Worked Well" 🔥' : newTag === 'flopped' ? 'Tagged as "Flopped" 📉' : 'Tag reset', 'success');
  };

  const filtered = savedScripts.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = (
      (s.title && s.title.toLowerCase().includes(q)) ||
      (s.topic && s.topic.toLowerCase().includes(q)) ||
      (s.language && s.language.toLowerCase().includes(q)) ||
      (s.hook?.dialogue && s.hook.dialogue.toLowerCase().includes(q))
    );
    const matchesTag = tagFilter === 'all' ? true : (s.performanceTag || 'untested') === tagFilter;
    return matchesSearch && matchesTag;
  });

  const exportAllAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedScripts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `reelvani_saved_scripts_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported scripts as JSON!', 'success');
  };

  const copyScriptText = async (script) => {
    const text = `🎬 ${script.title || 'Script'}\n\n[HOOK]: "${script.hook?.dialogue}"\n\n[BODY]:\n${script.body?.map((b, i) => `#${i+1} ${b.dialogue}`).join('\n')}\n\n[CTA]: "${script.cta?.dialogue}"\n\n[CAPTION]:\n${script.caption}\n\n[TAGS]:\n${(script.hashtags || []).join(' ')}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast('Script Copied!', 'success');
    } catch {
      showToast('Could not copy', 'error');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3>
            <Bookmark size={20} color="#FF6B00" />
            <span>My Scripts & Performance Tagging</span>
          </h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Performance Tagging Filter */}
          <div className="pill-selector">
            <button
              className={`selector-pill ${tagFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTagFilter('all')}
            >
              All ({savedScripts.length})
            </button>
            <button
              className={`selector-pill ${tagFilter === 'worked_well' ? 'active' : ''}`}
              onClick={() => setTagFilter('worked_well')}
              style={{ color: '#10B981' }}
            >
              🔥 Worked Well ({savedScripts.filter(s => s.performanceTag === 'worked_well').length})
            </button>
            <button
              className={`selector-pill ${tagFilter === 'flopped' ? 'active' : ''}`}
              onClick={() => setTagFilter('flopped')}
              style={{ color: '#F43F5E' }}
            >
              📉 Flopped ({savedScripts.filter(s => s.performanceTag === 'flopped').length})
            </button>
          </div>

          {/* Search and Export Bar */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Search saved scripts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  color: '#FFFFFF',
                  fontSize: '13px'
                }}
              />
              <Search size={15} style={{ position: 'absolute', left: '11px', top: '11px', color: 'var(--text-dim)' }} />
            </div>

            {savedScripts.length > 0 && (
              <button 
                className="btn btn-secondary btn-sm"
                onClick={exportAllAsJSON}
                title="Export all saved scripts"
              >
                <Download size={14} />
              </button>
            )}
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)' }}>
              <Bookmark size={36} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
              <p style={{ fontSize: '14px', fontWeight: 600 }}>No matching scripts found</p>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>Save scripts and tag them after posting on social media!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {item.language} • {item.estimatedDuration || '30s'}
                      </span>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                        {item.title || item.topic}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        className="btn btn-secondary btn-sm btn-icon"
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => copyScriptText(item)}
                        title="Copy Script"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        className="btn btn-secondary btn-sm btn-icon"
                        style={{ width: '32px', height: '32px', color: 'var(--color-accent-rose)' }}
                        onClick={() => onDeleteScript(item.id)}
                        title="Delete Script"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    "{item.hook?.dialogue}"
                  </p>

                  {/* Performance Tagging Bar */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    paddingTop: '8px', 
                    borderTop: '1px solid rgba(255,255,255,0.06)' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>After Posting:</span>
                      <button
                        className={`btn btn-sm ${item.performanceTag === 'worked_well' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '3px 8px', fontSize: '11px' }}
                        onClick={() => handleTagChange(item.id, item.performanceTag === 'worked_well' ? 'untested' : 'worked_well')}
                      >
                        <ThumbsUp size={11} />
                        <span>Worked Well</span>
                      </button>
                      <button
                        className={`btn btn-sm ${item.performanceTag === 'flopped' ? 'btn-secondary' : 'btn-secondary'}`}
                        style={{ 
                          padding: '3px 8px', 
                          fontSize: '11px',
                          color: item.performanceTag === 'flopped' ? '#F43F5E' : 'var(--text-muted)',
                          borderColor: item.performanceTag === 'flopped' ? '#F43F5E' : 'rgba(255,255,255,0.1)'
                        }}
                        onClick={() => handleTagChange(item.id, item.performanceTag === 'flopped' ? 'untested' : 'flopped')}
                      >
                        <ThumbsDown size={11} />
                        <span>Flopped</span>
                      </button>
                    </div>

                    <button
                      className="btn btn-cyan btn-sm"
                      style={{ padding: '5px 10px', fontSize: '11px' }}
                      onClick={() => {
                        onSelectScript(item);
                        onClose();
                      }}
                    >
                      <Sparkles size={12} />
                      <span>Open</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
