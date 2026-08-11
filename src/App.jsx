import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GeneratorForm from './components/GeneratorForm';
import OutputPackage from './components/OutputPackage';
import TeleprompterModal from './components/TeleprompterModal';
import TrendingHooksModal from './components/TrendingHooksModal';
import SavedScriptsModal from './components/SavedScriptsModal';
import TemplateLibraryModal from './components/TemplateLibraryModal';
import BatchGeneratorModal from './components/BatchGeneratorModal';
import PricingModal from './components/PricingModal';
import SettingsModal from './components/SettingsModal';
import Toast from './components/Toast';

import { aiGenerator } from './services/aiGenerator';
import { storageService } from './services/storageService';
import confetti from 'canvas-confetti';

export default function App() {
  const [formData, setFormData] = useState({
    topic: 'Gym motivation & cheat day regret',
    language: 'hindi',
    contentType: 'motivational',
    tone: 'street_desi',
    duration: '30s',
    platform: 'reels',
    scriptMode: 'voiceover',
    includeTrendingHook: false,
    trendingHookText: ''
  });

  const [currentPackage, setCurrentPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quota, setQuota] = useState(storageService.getQuotaStatus());
  const [savedScripts, setSavedScripts] = useState(storageService.getSavedScripts());

  // Modal States
  const [isTrendingOpen, setIsTrendingOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 2400);
  };

  const refreshQuota = () => {
    setQuota(storageService.getQuotaStatus());
  };

  const handleGenerate = async (isRegenerate = false) => {
    if (!formData.topic.trim()) {
      showToast('Please enter a topic or select a template!', 'error');
      return;
    }

    // Check Quota
    const currentQuota = storageService.getQuotaStatus();
    if (!currentQuota.isPro && currentQuota.remaining <= 0) {
      setIsPricingOpen(true);
      showToast('Daily 5 generations limit reached! Upgrade to Pro for unlimited.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const generated = await aiGenerator.generateScriptPackage({
        topic: formData.topic,
        language: formData.language,
        contentType: formData.contentType,
        tone: formData.tone,
        duration: formData.duration,
        platform: formData.platform,
        scriptMode: formData.scriptMode,
        includeTrendingHook: formData.includeTrendingHook,
        trendingHookText: formData.trendingHookText
      });

      storageService.consumeQuota();
      storageService.trackRegenEvent(isRegenerate ? 'regen' : 'gen');
      refreshQuota();

      setCurrentPackage(generated);
      showToast(isRegenerate ? 'New variations generated! 🔄' : '3 Script Angles Ready! ✨', 'sparkle');
      
      try {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.85 }
        });
      } catch {
        // ignore
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to generate script. Using native backup.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCurrentScript = () => {
    if (!currentPackage) return;
    const updated = storageService.saveScript(currentPackage);
    setSavedScripts(updated);
    showToast('Saved to My Scripts! 💾', 'success');
  };

  const handleDeleteSavedScript = (id) => {
    const updated = storageService.removeSavedScript(id);
    setSavedScripts(updated);
    showToast('Script removed from saved library', 'success');
  };

  const handleSelectSavedScript = (script) => {
    setCurrentPackage(script);
    setFormData((prev) => ({
      ...prev,
      topic: script.topic || script.title,
      language: script.language || prev.language,
      contentType: script.contentType || prev.contentType,
      tone: script.tone || prev.tone
    }));
    showToast(`Loaded "${script.title || 'Script'}" in studio!`, 'sparkle');
  };

  const handleSelectTrendingHook = (hookItem) => {
    setFormData((prev) => ({
      ...prev,
      language: hookItem.language || prev.language,
      includeTrendingHook: true,
      trendingHookText: hookItem.hookText
    }));
    showToast(`Attached viral hook: "${hookItem.hookText.slice(0, 30)}..."`, 'sparkle');
  };

  const handleSelectTemplate = (promptText) => {
    setFormData((prev) => ({
      ...prev,
      topic: promptText
    }));
    showToast('Loaded template prompt into Studio!', 'sparkle');
  };

  const isCurrentSaved = Boolean(
    currentPackage && savedScripts.some(s => s.id === currentPackage.id || s.title === currentPackage.title)
  );

  return (
    <div className="app-container">
      {/* Toast Feedback */}
      <Toast message={toast.message} type={toast.type} />

      {/* App Header Bar */}
      <Header
        quota={quota}
        onOpenTrending={() => setIsTrendingOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
      />

      {/* Main Studio Area */}
      <main className="main-content">
        {!currentPackage ? (
          /* Input Form View */
          <GeneratorForm
            formData={formData}
            setFormData={setFormData}
            onGenerate={() => handleGenerate(false)}
            isLoading={isLoading}
            onOpenTrending={() => setIsTrendingOpen(true)}
            onOpenTemplates={() => setIsTemplatesOpen(true)}
            onOpenBatch={() => setIsBatchOpen(true)}
          />
        ) : (
          /* Output View */
          <OutputPackage
            packageData={currentPackage}
            onRegenerate={() => handleGenerate(true)}
            onSave={handleSaveCurrentScript}
            isSaved={isCurrentSaved}
            onOpenTeleprompter={() => setIsTeleprompterOpen(true)}
            onBackToEdit={() => setCurrentPackage(null)}
            showToast={showToast}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <TrendingHooksModal
        isOpen={isTrendingOpen}
        onClose={() => setIsTrendingOpen(false)}
        onSelectHook={handleSelectTrendingHook}
        selectedHookText={formData.trendingHookText}
      />

      <TemplateLibraryModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <BatchGeneratorModal
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        isPro={quota.isPro}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenScriptInStudio={(script) => {
          setCurrentPackage(script);
          showToast('Loaded batch script in Studio!', 'sparkle');
        }}
        showToast={showToast}
      />

      <SavedScriptsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedScripts={savedScripts}
        onSelectScript={handleSelectSavedScript}
        onDeleteScript={handleDeleteSavedScript}
        onUpdateScripts={setSavedScripts}
        showToast={showToast}
      />

      <TeleprompterModal
        isOpen={isTeleprompterOpen}
        onClose={() => setIsTeleprompterOpen(false)}
        packageData={currentPackage}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        isPro={quota.isPro}
        quota={quota}
        onUpgradePro={() => {
          storageService.setProUser(true);
          refreshQuota();
        }}
        onResetFree={() => {
          storageService.setProUser(false);
          refreshQuota();
          showToast('Switched to Free Tier', 'success');
        }}
        showToast={showToast}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        showToast={showToast}
      />
    </div>
  );
}
