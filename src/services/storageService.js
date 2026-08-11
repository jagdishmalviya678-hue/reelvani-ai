const DAILY_LIMIT_FREE = 5;
const STORAGE_KEYS = {
  QUOTA: 'reelvani_quota_v1',
  SAVED_SCRIPTS: 'reelvani_saved_scripts_v1',
  SETTINGS: 'reelvani_settings_v1',
  IS_PRO: 'reelvani_is_pro_v1',
  REGEN_STATS: 'reelvani_regen_stats_v1'
};

export const storageService = {
  getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  },

  getQuotaStatus() {
    const isPro = this.isProUser();
    if (isPro) {
      return { used: 0, limit: Infinity, remaining: Infinity, isPro: true };
    }

    try {
      const today = this.getTodayKey();
      const raw = localStorage.getItem(STORAGE_KEYS.QUOTA);
      let quotaData = raw ? JSON.parse(raw) : {};

      if (quotaData.date !== today) {
        quotaData = { date: today, used: 0 };
        localStorage.setItem(STORAGE_KEYS.QUOTA, JSON.stringify(quotaData));
      }

      const used = quotaData.used || 0;
      const remaining = Math.max(0, DAILY_LIMIT_FREE - used);

      return {
        used,
        limit: DAILY_LIMIT_FREE,
        remaining,
        isPro: false
      };
    } catch {
      return { used: 0, limit: DAILY_LIMIT_FREE, remaining: DAILY_LIMIT_FREE, isPro: false };
    }
  },

  consumeQuota() {
    if (this.isProUser()) return true;
    const status = this.getQuotaStatus();
    if (status.remaining <= 0) {
      return false;
    }

    try {
      const today = this.getTodayKey();
      const newUsed = status.used + 1;
      localStorage.setItem(STORAGE_KEYS.QUOTA, JSON.stringify({ date: today, used: newUsed }));
      return true;
    } catch {
      return true;
    }
  },

  isProUser() {
    try {
      return localStorage.getItem(STORAGE_KEYS.IS_PRO) === 'true';
    } catch {
      return false;
    }
  },

  setProUser(status) {
    try {
      localStorage.setItem(STORAGE_KEYS.IS_PRO, status ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  },

  getSavedScripts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SAVED_SCRIPTS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveScript(scriptPackage) {
    try {
      const existing = this.getSavedScripts();
      const toSave = {
        ...scriptPackage,
        id: scriptPackage.id || 'script_' + Date.now(),
        performanceTag: scriptPackage.performanceTag || 'untested', // 'worked_well' | 'flopped' | 'untested'
        savedAt: new Date().toISOString()
      };
      
      const filtered = existing.filter(s => s.id !== toSave.id);
      const updated = [toSave, ...filtered];
      localStorage.setItem(STORAGE_KEYS.SAVED_SCRIPTS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  setPerformanceTag(id, tag) {
    try {
      const existing = this.getSavedScripts();
      const updated = existing.map(item => {
        if (item.id === id) {
          return { ...item, performanceTag: tag };
        }
        return item;
      });
      localStorage.setItem(STORAGE_KEYS.SAVED_SCRIPTS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  removeSavedScript(id) {
    try {
      const existing = this.getSavedScripts();
      const updated = existing.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.SAVED_SCRIPTS, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  getSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return raw ? JSON.parse(raw) : {
        geminiApiKey: '',
        openaiApiKey: '',
        creatorName: '',
        instagramHandle: '',
        preferredLanguage: 'hindi',
        theme: 'dark'
      };
    } catch {
      return {
        geminiApiKey: '',
        openaiApiKey: '',
        creatorName: '',
        instagramHandle: '',
        preferredLanguage: 'hindi',
        theme: 'dark'
      };
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  },

  trackRegenEvent(type) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REGEN_STATS);
      const stats = raw ? JSON.parse(raw) : { totalGenerations: 0, regenerations: 0, copies: 0 };
      if (type === 'gen') stats.totalGenerations++;
      if (type === 'regen') stats.regenerations++;
      if (type === 'copy') stats.copies++;
      localStorage.setItem(STORAGE_KEYS.REGEN_STATS, JSON.stringify(stats));
      return stats;
    } catch {
      return {};
    }
  }
};
