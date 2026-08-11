import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import Razorpay from 'razorpay';
import { SYSTEM_PROMPT_TEMPLATE, buildUserPrompt } from './prompt.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

let razorpayInstance = null;
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  });
  console.log('Razorpay payment gateway initialized successfully.');
} else {
  console.warn('WARNING: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set in server/.env — payments will run in simulation mode.');
}

if (!GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY is not set in server/.env — /api/generate will fallback to mock/offline mode.');
}

// Abuse protection rate limiter
const generateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Daily generation limit reached from this network. Upgrade to Pro for unlimited.' }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    ok: true, 
    hasGeminiKey: Boolean(GEMINI_API_KEY),
    hasRazorpay: Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET)
  });
});

// Returns public Razorpay key ID to frontend
app.get('/api/payment/config', (req, res) => {
  res.json({
    keyId: RAZORPAY_KEY_ID || '',
    isLive: Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET)
  });
});

// Create Razorpay Order for ₹99 Pro Plan
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { plan = 'creator_pro_monthly', amount = 9900 } = req.body || {}; // 9900 paise = ₹99

    if (!razorpayInstance) {
      // Simulation Order ID for testing when API keys are not added yet
      return res.json({
        id: 'order_sim_' + Date.now(),
        amount: amount,
        currency: 'INR',
        isSimulation: true
      });
    }

    const options = {
      amount: amount, // in paise (e.g. ₹99 = 9900 paise)
      currency: 'INR',
      receipt: `rcpt_${Date.now().toString().slice(-8)}`,
      notes: { plan: plan }
    };

    const order = await razorpayInstance.orders.create(options);
    return res.json({
      ...order,
      isSimulation: false
    });
  } catch (err) {
    console.error('Failed to create Razorpay order:', err);
    return res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// Verify Payment Signature
app.post('/api/payment/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isSimulation } = req.body || {};

    if (isSimulation || !RAZORPAY_KEY_SECRET) {
      return res.json({
        verified: true,
        isPro: true,
        message: 'Payment simulation verified successfully!'
      });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      return res.json({
        verified: true,
        isPro: true,
        paymentId: razorpay_payment_id,
        message: 'Payment verified successfully! ReelVani Pro activated.'
      });
    } else {
      return res.status(400).json({ verified: false, error: 'Invalid payment signature' });
    }
  } catch (err) {
    console.error('Error verifying payment:', err);
    return res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Script Generation API
app.post('/api/generate', generateLimiter, async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(503).json({ error: 'Server AI key not configured. Using client fallback.' });
  }

  const {
    topic,
    language = 'hindi',
    contentType = 'motivational',
    tone = 'street_desi',
    duration = '30s',
    platform = 'reels',
    scriptMode = 'voiceover',
    includeTrendingHook = false,
    trendingHookText = ''
  } = req.body || {};

  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return res.status(400).json({ error: 'topic is required' });
  }

  const userPrompt = buildUserPrompt({
    topic: topic.trim().slice(0, 300),
    language,
    contentType,
    tone,
    duration,
    platform,
    scriptMode,
    includeTrendingHook,
    trendingHookText
  });

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${SYSTEM_PROMPT_TEMPLATE}\n\n${userPrompt}` }] }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.85
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);
      return res.status(502).json({ error: `AI provider error (${response.status})` });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(502).json({ error: 'AI provider returned an empty response' });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseErr) {
      console.error('Failed to parse AI JSON output:', parseErr, rawText);
      return res.status(502).json({ error: 'AI provider returned malformed JSON' });
    }

    parsed.id = 'pkg_' + Date.now();
    parsed.topic = topic.trim();
    parsed.language = language;
    parsed.generatedAt = new Date().toISOString();
    parsed.source = 'gemini-backend';

    return res.json(parsed);
  } catch (err) {
    console.error('Generation failed:', err);
    return res.status(500).json({ error: 'Internal server error while generating script' });
  }
});

app.listen(PORT, () => {
  console.log(`ReelVani backend running on http://localhost:${PORT}`);
});
