import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/api';

export default function PricingModal({
  isOpen,
  onClose,
  isPro,
  onUpgradePro,
  onResetFree,
  quota,
  showToast
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayCheckout = async () => {
    setIsProcessing(true);
    try {
      // 1. Fetch Razorpay order from backend
      const res = await fetch(`${BACKEND_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 9900, plan: 'creator_pro_monthly' })
      });

      const order = await res.json();

      // If backend is in test/simulation mode
      if (order.isSimulation || !order.id) {
        setTimeout(() => {
          setIsProcessing(false);
          onUpgradePro();
          try {
            confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          showToast('🎉 ReelVani Creator PRO Activated! (Test Mode)', 'sparkle');
          onClose();
        }, 1000);
        return;
      }

      // 2. Load SDK for real checkout
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setIsProcessing(false);
        showToast('Could not load Razorpay gateway', 'error');
        return;
      }

      // 3. Open Razorpay modal
      const options = {
        key: order.keyId || 'rzp_test_placeholder',
        amount: order.amount,
        currency: 'INR',
        name: 'ReelVani AI',
        description: 'Creator Pro Monthly Plan (Unlimited Generations)',
        order_id: order.id,
        theme: { color: '#FF6B00' },
        handler: async function (response) {
          // 4. Verify payment on backend
          const verifyRes = await fetch(`${BACKEND_URL}/payment/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.verified) {
            onUpgradePro();
            try {
              confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
            } catch {
              // ignore
            }
            showToast('🎉 Payment Successful! Creator PRO Activated!', 'sparkle');
            onClose();
          } else {
            showToast('Payment verification failed', 'error');
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      // Fallback instant activation for development testing
      onUpgradePro();
      showToast('🎉 Creator PRO Activated! (Development Mode)', 'sparkle');
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3>
            <Crown size={20} color="#FFA500" />
            <span>ReelVani Creator Pro</span>
          </h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Current Quota Status */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Current Plan Status</span>
              <h4 style={{ fontSize: '15px', color: isPro ? '#C084FC' : '#FFA500', fontWeight: 800 }}>
                {isPro ? '💎 PRO CREATOR (Unlimited)' : `Free Tier (${quota.remaining} of ${quota.limit} Left Today)`}
              </h4>
            </div>
            {!isPro && (
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                Resets at 12:00 AM
              </span>
            )}
          </div>

          {/* Pro Card */}
          <div className="pricing-card-pro">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', alignSelf: 'center', background: 'rgba(255,107,0,0.2)', padding: '4px 12px', borderRadius: 'var(--radius-full)', color: '#FF8C00', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
              <Sparkles size={13} />
              <span>Recommended for Daily Creators</span>
            </div>

            <div className="pricing-price">
              ₹99 <span>/ month</span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Unlock unlimited viral short-video generation in all 10+ regional Indian languages.
            </p>

            <ul className="perks-list">
              <li>
                <Check size={16} color="#10B981" />
                <span><strong>Unlimited</strong> AI Script Generations Every Day</span>
              </li>
              <li>
                <Check size={16} color="#10B981" />
                <span><strong>3 Hook Variations</strong> per Generation</span>
              </li>
              <li>
                <Check size={16} color="#10B981" />
                <span><strong>7-Day Weekly Content Packs</strong> (Monday to Sunday Batch)</span>
              </li>
              <li>
                <Check size={16} color="#10B981" />
                <span><strong>All 10+ Regional Languages</strong> (Bhojpuri, Haryanvi, Marathi, Punjabi, Gujarati, etc.)</span>
              </li>
              <li>
                <Check size={16} color="#10B981" />
                <span><strong>Weekly VIP Trending Hooks</strong> & Sound Template Layer</span>
              </li>
              <li>
                <Check size={16} color="#10B981" />
                <span><strong>Instant Teleprompter</strong> Mode for 1-Tap Shoot Rehearsal</span>
              </li>
            </ul>

            {isPro ? (
              <button
                className="btn btn-secondary"
                onClick={onResetFree}
                style={{ fontSize: '13px', opacity: 0.8 }}
              >
                Switch Back to Free Tier (For Testing)
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg"
                onClick={handleRazorpayCheckout}
                disabled={isProcessing}
                style={{ width: '100%', marginTop: '8px' }}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner" />
                    <span>Connecting to Razorpay UPI...</span>
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    <span>Pay ₹99 via UPI / Cards (Instant)</span>
                  </>
                )}
              </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-dim)' }}>
              <ShieldCheck size={14} color="#10B981" />
              <span>Razorpay Secured 256-bit Checkout • Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
