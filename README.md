# 🎬 ReelVani AI (देसी Reels & Shorts Script Generator)

A mobile-first web app built specifically for Indian content creators and small business owners to generate ready-to-shoot 15-30s Reels/Shorts scripts, captions, and viral hashtags in authentic regional languages (**Hindi, Bhojpuri, Haryanvi, Marathi, Punjabi, Gujarati, Tamil, Telugu, and Hinglish**).

---

## 🚀 How to Run the App

This project now has TWO parts that must both run: the **backend** (holds your AI key safely, calls Gemini) and the **frontend** (the UI). Real AI generation will not work unless the backend is running with a valid key — without it, every user falls back to the same canned templates.

### 1. Set up and start the backend (do this first)
```bash
cd server
npm install
copy .env.example .env        (Windows)   |   cp .env.example .env   (Mac/Linux)
```
Open `server/.env` and paste your real Gemini API key (get one free at https://aistudio.google.com/apikey):
```
GEMINI_API_KEY=your_actual_key_here
```
Then start it:
```bash
npm start
```
You should see: `ReelVani backend running on http://localhost:5000`

### 2. Start the frontend (in a second terminal, from the project root)
```bash
npm install
npm run dev
```
Open the displayed URL: `http://localhost:3000`

The frontend automatically forwards AI requests to your backend — no per-user API key needed. The old "Settings → paste your own API key" option still exists for power users, but it's now a fallback, not a requirement.

### Important before you launch this publicly
- **Never commit `server/.env`** to git — it contains your real key. It's already excluded via the pattern in `.gitignore` (add one if missing: `server/.env`).
- The backend has a basic per-IP daily rate limit (30 generations/day) to stop one visitor from running up your API bill — tune `max` in `server/index.js` once you see real usage.
- The ₹99/mo "Pro" upgrade is still **simulated only** — no real payment is collected yet. Wire up Razorpay before charging anyone real money.
- Deploy the backend somewhere it can run persistently (Railway, Render, etc.) — it will not work if only your laptop is running it and the laptop is off.

---

## ✨ Features Included

### 1. 1-Screen Input Studio
- **Topic / Niche Input**: Free text or fast one-tap inspiration chips (Gym motivation, Chai tapri business, Bihari swag, Haryanvi diet, Puneri sarcasm, etc.).
- **Regional Language Selector**:
  - Hindi (हिंदी)
  - Bhojpuri (भोजपुरी)
  - Haryanvi (हरियाणवी)
  - Marathi (मराठी)
  - Punjabi (ਪੰਜਾਬੀ)
  - Gujarati (ગુજરાતી)
  - Hinglish (Urban Indian)
  - Bengali, Tamil, Telugu
- **Content Category**: Motivational, Comedy / Relatable, Business Promo, Educational Hacks, Viral Trend.
- **Creator Tone**: देसी / Street Style, Punchy & Bold, Emotional, Sarcastic / Roasting.
- **Target Duration**: 15s (Quick Punch), 30s (Standard Viral), 60s (Story Mode).

### 2. Output Package (1-Tap Everything)
- **⚡ Structured Script (15-30s)**:
  - **Hook Line (0-3s)**: Scrolling stopper with visual/actor cue.
  - **Body Beats (3-20s)**: 2-3 punchy bullet points with b-roll/action suggestions.
  - **Closing CTA (20-30s)**: Authentic regional follow & comment call to action.
- **📝 Ready-to-Post Caption**: Complete with emojis, regional question, and hook.
- **🏷️ Hashtags**: 10-15 curated tags (Trending + Regional + Niche) with 1-tap copy.
- **🎙️ Speech Synthesis Preview**: Listen to an audio rehearsal of the script directly in your browser.

### 3. Productivity & Studio Tools
- **1-Tap Copy**: Individual copy buttons for Script, Caption, and Hashtags + "Copy Complete Package".
- **🎙️ Fullscreen Teleprompter**: Practice or shoot with real-time autoscrolling speed control (1x, 2x, 3x).
- **💾 My Saved Scripts**: Save, search, filter, and export scripts as JSON.
- **🔥 Trending Hooks Layer**: Weekly curated viral hooks and audio vibe recommendations with 1-click script injection.
- **💎 Monetization & Daily Quota**: 5 free generations/day + simulated ₹99/mo Creator Pro upgrade with unlimited generations.
- **⚙️ Dual AI Engine**: Connects to Google Gemini API or OpenAI API, with a built-in Native Dialect Engine for 100% offline instant generation.

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Lucide Icons, Canvas Confetti
- **Styling**: Vanilla CSS Design System with Glassmorphism, Neon Saffron/Cyan Indian accents, and Google Fonts (`Outfit`, `Plus Jakarta Sans`, `Rozha One`)
- **Storage**: LocalStorage with automatic daily quota reset at midnight
