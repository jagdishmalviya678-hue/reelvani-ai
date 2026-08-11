import { storageService } from './storageService';

const SYSTEM_PROMPT_TEMPLATE = `You are "ReelVani AI", the ultimate Indian short-video (Reels/Shorts/Status) scriptwriting director and regional copywriter.
Your job is to generate a viral, ready-to-shoot short-video package in the user's requested regional Indian language.

CRITICAL RULES:
1. REGIONAL NATURALNESS: Do NOT use robotic literal translation. Write in 100% natural, authentic regional slang, punchy everyday phrasing, and colloquial idioms used on Instagram and YouTube by native speakers.
2. 3 SCRIPT VARIATIONS:
   - Variation A: Question / Curiosity Hook (e.g. "Kya aap bhi ye galti karte hain?")
   - Variation B: Shocking Fact / Bold Statement Hook (e.g. "99% log is sach se anjaan hain!")
   - Variation C: Relatable Story / Street Drama Hook (e.g. "Bhai kal mere saath aisi ghatna hui...")
3. SCRIPT STRUCTURE FOR EACH VARIATION:
   - Hook Line (First 0-3s): Attention grabber with visual/actor cue in brackets [like this].
   - Body Beats (3-20s): 2 to 3 crisp, high-impact bullet points to say or show. Include visual cues in brackets.
   - Call To Action (20-30s): Catchy, natural closing line prompting users to follow, comment, or share.
4. SCRIPT MODES:
   - Voice-Over Mode: Include natural spoken pauses like [PAUSE 1s] and breathing rhythm.
   - Text-Overlay Mode: Include [TEXT ON SCREEN: ...] cues for fast visual reading.
5. PLATFORM CUSTOMIZATION:
   - Reels: Relatable aesthetic caption with emojis and hashtags.
   - Shorts: Punchy subscribe CTA and quick value pacing.
   - WhatsApp Status: Intimate, direct emotion suitable for status forwards.
6. CAPTION & HASHTAGS: Ready-to-paste caption matching the tone + exactly 10-15 hashtags.

OUTPUT MUST BE VALID JSON ONLY with this exact structure:
{
  "title": "Catchy title in regional tone",
  "estimatedDuration": "30s",
  "selectedPlatform": "reels",
  "scriptMode": "voiceover",
  "variations": [
    {
      "id": "var_a",
      "styleName": "Question / Curiosity Hook",
      "hook": {
        "visualCue": "[Camera close-up, curious expression]",
        "dialogue": "Question hook dialogue in regional language",
        "voiceOverText": "Dialogue with [PAUSE 0.5s] rhythm cues",
        "screenOverlayText": "[TEXT ON SCREEN: Hook keyword]"
      },
      "body": [
        {
          "beatNumber": 1,
          "visualCue": "[Action cue]",
          "dialogue": "Point 1 dialogue",
          "voiceOverText": "Point 1 with pauses",
          "screenOverlayText": "[TEXT ON SCREEN: Point 1 Summary]"
        },
        {
          "beatNumber": 2,
          "visualCue": "[Action cue]",
          "dialogue": "Point 2 dialogue",
          "voiceOverText": "Point 2 with pauses",
          "screenOverlayText": "[TEXT ON SCREEN: Point 2 Summary]"
        },
        {
          "beatNumber": 3,
          "visualCue": "[Action cue]",
          "dialogue": "Point 3 dialogue",
          "voiceOverText": "Point 3 with pauses",
          "screenOverlayText": "[TEXT ON SCREEN: Point 3 Summary]"
        }
      ],
      "cta": {
        "visualCue": "[Gesture to follow/subscribe]",
        "dialogue": "Call to action dialogue in regional slang",
        "voiceOverText": "CTA with pause",
        "screenOverlayText": "[TEXT ON SCREEN: Follow @YourHandle]"
      }
    },
    {
      "id": "var_b",
      "styleName": "Shocking Fact / Bold Hook",
      "hook": {
        "visualCue": "[Shocked look, zoom in]",
        "dialogue": "Shocking fact hook dialogue",
        "voiceOverText": "Bold dialogue with [PAUSE 1s]",
        "screenOverlayText": "[TEXT ON SCREEN: SHOCKING FACT]"
      },
      "body": [
        { "beatNumber": 1, "visualCue": "[Action cue]", "dialogue": "Point 1", "voiceOverText": "Point 1", "screenOverlayText": "[TEXT: Point 1]" },
        { "beatNumber": 2, "visualCue": "[Action cue]", "dialogue": "Point 2", "voiceOverText": "Point 2", "screenOverlayText": "[TEXT: Point 2]" },
        { "beatNumber": 3, "visualCue": "[Action cue]", "dialogue": "Point 3", "voiceOverText": "Point 3", "screenOverlayText": "[TEXT: Point 3]" }
      ],
      "cta": {
        "visualCue": "[Pointing cue]",
        "dialogue": "CTA dialogue",
        "voiceOverText": "CTA",
        "screenOverlayText": "[TEXT: Share with friends]"
      }
    },
    {
      "id": "var_c",
      "styleName": "Story / Street Drama Hook",
      "hook": {
        "visualCue": "[Confidential storytelling lean-in]",
        "dialogue": "Story hook dialogue",
        "voiceOverText": "Story dialogue with [PAUSE 0.8s]",
        "screenOverlayText": "[TEXT ON SCREEN: True Story]"
      },
      "body": [
        { "beatNumber": 1, "visualCue": "[Action cue]", "dialogue": "Point 1", "voiceOverText": "Point 1", "screenOverlayText": "[TEXT: Point 1]" },
        { "beatNumber": 2, "visualCue": "[Action cue]", "dialogue": "Point 2", "voiceOverText": "Point 2", "screenOverlayText": "[TEXT: Point 2]" },
        { "beatNumber": 3, "visualCue": "[Action cue]", "dialogue": "Point 3", "voiceOverText": "Point 3", "screenOverlayText": "[TEXT: Point 3]" }
      ],
      "cta": {
        "visualCue": "[Smiles and points]",
        "dialogue": "CTA dialogue",
        "voiceOverText": "CTA",
        "screenOverlayText": "[TEXT: Follow for more]"
      }
    }
  ],
  "platformFormats": {
    "reels": {
      "caption": "Instagram optimized caption with emojis",
      "hashtags": ["#ReelsIndia", "#ViralReels", "#DesiCreator"]
    },
    "shorts": {
      "caption": "YouTube Shorts description with subscribe trigger",
      "hashtags": ["#Shorts", "#YouTubeShorts", "#ViralShorts"]
    },
    "status": {
      "caption": "WhatsApp Status short caption for WhatsApp sharing",
      "hashtags": ["#DesiStatus", "#ViralStatus"]
    }
  },
  "creatorTip": "1 pro tip for delivery and camera lighting"
}`;

// Backend URL: same-origin '/api' in production (proxied by vite.config.js in dev).
// This is where the SERVER holds the real API key — the browser never sees it.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/api';

export const aiGenerator = {
  async generateScriptPackage({
    topic,
    language = 'hindi',
    contentType = 'motivational',
    tone = 'street_desi',
    duration = '30s',
    platform = 'reels',
    scriptMode = 'voiceover',
    includeTrendingHook = false,
    trendingHookText = ''
  }) {
    // 1) PRIMARY PATH: call our own backend. Works for every user, no key needed from them.
    try {
      const response = await fetch(`${BACKEND_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic, language, contentType, tone, duration, platform,
          scriptMode, includeTrendingHook, trendingHookText
        })
      });

      if (response.ok) {
        return await response.json();
      }
      console.warn('Backend generate failed with status', response.status, '— falling back.');
    } catch (err) {
      console.warn('Backend unreachable, falling back:', err.message);
    }

    // 2) FALLBACK PATH: power users who've pasted their own key in Settings (optional, off by default).
    const settings = storageService.getSettings();
    const geminiKey = settings.geminiApiKey?.trim();
    const openaiKey = settings.openaiApiKey?.trim();

    if (geminiKey) {
      try {
        return await this.callGeminiAPI({
          geminiKey,
          topic,
          language,
          contentType,
          tone,
          duration,
          platform,
          scriptMode,
          includeTrendingHook,
          trendingHookText
        });
      } catch (err) {
        console.warn('Gemini API failed, using native regional engine:', err);
      }
    }

    if (openaiKey) {
      try {
        return await this.callOpenAIAPI({
          openaiKey,
          topic,
          language,
          contentType,
          tone,
          duration,
          platform,
          scriptMode,
          includeTrendingHook,
          trendingHookText
        });
      } catch (err) {
        console.warn('OpenAI API failed, using native regional engine:', err);
      }
    }

    // Native Regional Engine with 3 variations & platform formats
    await new Promise(r => setTimeout(r, 650));
    return this.generateNativePackage({
      topic,
      language,
      contentType,
      tone,
      duration,
      platform,
      scriptMode,
      includeTrendingHook,
      trendingHookText
    });
  },

  async generate7DayContentPack({ theme, language = 'hindi', targetNiche = 'fitness' }) {
    const days = [
      { day: 'Monday (Day 1)', focus: 'Motivation & Mindset Hook', topicSuffix: 'The Monday Morning Kickstart & Rule #1' },
      { day: 'Tuesday (Day 2)', focus: 'Quick Tip / Secret Hack', topicSuffix: 'The 3-Step Shortcut Nobody Tells You' },
      { day: 'Wednesday (Day 3)', focus: 'Relatable Mistake & Comedy', topicSuffix: 'Why Most People Fail at This (Comedy Roast)' },
      { day: 'Thursday (Day 4)', focus: 'Behind The Scenes / Real Story', topicSuffix: 'Raw Real Story & Lessons from Zero' },
      { day: 'Friday (Day 5)', focus: 'Weekend Challenge / High Energy', topicSuffix: 'Try This 48-Hour Weekend Gamechanger' },
      { day: 'Saturday (Day 6)', focus: 'Myth Buster & Truth Bomb', topicSuffix: 'Stop Believing This Common Fake Advice' },
      { day: 'Sunday (Day 7)', focus: 'Weekly Review & Community Q&A', topicSuffix: 'Sunday Reset: Answer This One Question' }
    ];

    const generatedDays = [];
    for (const d of days) {
      const topicText = `${theme}: ${d.topicSuffix}`;
      const pkg = this.generateNativePackage({
        topic: topicText,
        language: language,
        contentType: 'motivational',
        tone: 'street_desi',
        duration: '30s',
        platform: 'reels',
        scriptMode: 'voiceover',
        includeTrendingHook: false
      });
      generatedDays.push({
        dayName: d.day,
        focusArea: d.focus,
        scriptPackage: pkg
      });
    }

    return {
      id: 'pack_' + Date.now(),
      theme: theme,
      language: language,
      niche: targetNiche,
      totalDays: 7,
      createdAt: new Date().toISOString(),
      days: generatedDays
    };
  },

  async callGeminiAPI({ geminiKey, topic, language, contentType, tone, duration, platform, scriptMode, includeTrendingHook, trendingHookText }) {
    const userPrompt = `
Topic/Niche: "${topic}"
Target Language: ${language}
Content Category: ${contentType}
Tone: ${tone}
Duration: ${duration}
Target Platform: ${platform}
Script Mode: ${scriptMode}
${includeTrendingHook && trendingHookText ? `Incorporate this trending hook: "${trendingHookText}"` : ''}

Generate the complete JSON with 3 distinct hook variations (Question, Shocking Fact, Story), platform formats (Reels, Shorts, WhatsApp Status), Voice-Over pauses and On-Screen text cues.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
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

    if (!response.ok) throw new Error(`Gemini Error ${response.status}`);
    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(rawText);
  },

  async callOpenAIAPI({ openaiKey, topic, language, contentType, tone, duration, platform, scriptMode, includeTrendingHook, trendingHookText }) {
    const userPrompt = `
Topic/Niche: "${topic}"
Target Language: ${language}
Content Category: ${contentType}
Tone: ${tone}
Duration: ${duration}
Target Platform: ${platform}
Script Mode: ${scriptMode}
${includeTrendingHook && trendingHookText ? `Incorporate this trending hook: "${trendingHookText}"` : ''}

Generate the complete JSON with 3 variations (Question, Shocking Fact, Story), platform formats (Reels, Shorts, Status).`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT_TEMPLATE },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.85
      })
    });

    if (!response.ok) throw new Error(`OpenAI Error ${response.status}`);
    const data = await response.json();
    return JSON.parse(data.choices?.[0]?.message?.content);
  },

  // Native Dialect Engine with 3 Variations & Multi-Platform Formats
  generateNativePackage({ topic, language, contentType, tone, duration, platform = 'reels', scriptMode = 'voiceover', includeTrendingHook, trendingHookText }) {
    const cleanTopic = topic || 'देसी जुगाड़ और तरक्की';
    const langKey = (language || 'hindi').toLowerCase();

    const dialectData = {
      bhojpuri: {
        tagline: 'भोजपुरी भौकाल स्पेशल',
        varA: {
          style: 'Question / Curiosity Hook',
          hookCue: '[कैमरा के नजदीक आके भौंह नचावत]',
          hook: 'का रउआ भी ' + cleanTopic + ' में ई तीन गो गलती करत बानी?',
          vo: 'का रउआ भी... [PAUSE 0.5s] ' + cleanTopic + ' में ई तीन गो गलती करत बानी?',
          overlay: '[TEXT: ई गलती रउआ त ना करत बानी?]',
          b1: ['पहिले त ई समझ लीं कि बिना सही प्लानिंग के सब मेहनत बेकार हो जाई!', '[हाथ से 1 नंबर देखावत]', '[TEXT: नियम #1: सही प्लानिंग]'],
          b2: ['दू नम्बर— दुनिया के ताना सुनबऽ त आगे कइसे बढ़बऽ बबुआ?', '[सीना ठोक के जोश में]', '[TEXT: नियम #2: नो टेंशन]'],
          b3: ['तीसरा— आज से ही रोज 1 घंटा अपना लक्ष्य प लगावा!', '[उंगली से स्क्रीन प इशारा]', '[TEXT: नियम #3: डेली 1 घंटा]'],
          cta: 'काहे कि जब आपन समय आई ना, त भौकाल टाइट हो जाई! रील के अभी लाइक अउर शेयर ठोकऽ, अउर फॉलो कइल मत भूलिहऽ!',
          ctaOverlay: '[TEXT: Follow & Share @ReelVani]'
        },
        varB: {
          style: 'Shocking Fact / Bold Statement',
          hookCue: '[आँख फाड़ के देखत, गमछा झटकावत]',
          hook: '99% लोग ' + cleanTopic + ' के ई असली कड़वा सच नइखे जानत!',
          vo: '99% लोग... [PAUSE 0.8s] ' + cleanTopic + ' के ई असली सच नइखे जानत!',
          overlay: '[TEXT: 99% लोग अनज़ान बाड़े!]',
          b1: ['सच्चाई ई बा कि शॉर्टकट खोजे वाला हमेशा पीछे छूट जाला!', '[सिर हिलावत]', '[TEXT: शॉर्टकट = धोखा]'],
          b2: ['जब ले आपन हाथ से काम ना करबऽ, तब ले स्वाद ना आई!', '[हाथ पटकत]', '[TEXT: खुद के दम प भौकाल]'],
          b3: ['ई फॉर्मूला अपना ला, 30 दिन में रिजल्ट देखबऽ!', '[मुस्कुरा के थम्ब्स अप]', '[TEXT: 30 दिन का कमाल]'],
          cta: 'ई रील अपने जिगरी दोस्त के भेजिहऽ जे खाली सोचत रहेला! पेज के अभी फॉलो करीं!',
          ctaOverlay: '[TEXT: अभी शेयर करा]'
        },
        varC: {
          style: 'Relatable Story / Street Drama',
          hookCue: '[पास आके फुसफुसावत, देसी अंदाज़]',
          hook: 'अरे सुनो भाई! कल हमरा साथे ' + cleanTopic + ' के एगो गजबे किस्सा भइल!',
          vo: 'अरे सुनो भाई... [PAUSE 0.6s] कल हमरा साथे एगो गजबे किस्सा भइल!',
          overlay: '[TEXT: असली देसी कहानी]',
          b1: ['एगो लइका हमरा से पूछलक कि का भाई सच में एतना फायदा होला?', '[हँसत]', '[TEXT: असली सवाल]'],
          b2: ['हम कहलीं— फायदा तब होई जब रउआ बहाना बनाना बंद करब!', '[सीरियस लुक]', '[TEXT: बहाना बंद करो]'],
          b3: ['बस ऊ बात ओकरा दिमाग में बैठ गइल अउर आज ऊ खुश बा!', '[जोश में]', '[TEXT: जिंदगी बदल गइल]'],
          cta: 'अगर रउआ भी आपन किस्मत बदले के चाहत बानी त अभी फॉलो बटन दबाईं!',
          ctaOverlay: '[TEXT: Follow बटन दबावा]'
        },
        captions: {
          reels: `का हो! ${cleanTopic} के ई देसी फॉर्मूला कइसन लागल? 💥\n\nअगर बात दिल प लागल त ई रील के अभी SAVE कर लीं अउर दोस्त के SHARE करीं! ❤️\n\nकमेंट में बताईं रउआ कवन जिला से बानी? 👇`,
          shorts: `${cleanTopic} का सबसे कड़क भोजपुरी फॉर्मूला! 🔥 Subscribe for daily desi shorts!`,
          status: `का हो बबुआ! ${cleanTopic} देखऽ अउर बताओ कइसन बा? 💥 स्टेटस शेयर करा!`
        },
        tags: ['#BhojpuriReels', '#BhojpuriSwag', '#DesiPurvanchal', '#BhojpuriShorts', '#PatnaVibes', '#ReelVaniAI'],
        tip: 'भोजपुरी में पहले 3 सेकंड में आँखों का एक्सप्रेशन और बोली में वजन सबसे बड़ा गेमचेंजर है!'
      },
      haryanvi: {
        tagline: 'हरियाणवी धाकड़ रोला',
        varA: {
          style: 'Question / Curiosity Hook',
          hookCue: '[सीधा कैमरे में घूरते हुए, कड़क तेवर]',
          hook: 'ओ लाडले! के तूं भी ' + cleanTopic + ' में याही गलती कर रह्या सै?',
          vo: 'ओ लाडले! [PAUSE 0.5s] के तूं भी ' + cleanTopic + ' में याही गलती कर रह्या सै?',
          overlay: '[TEXT: या गलती तूं भी करै सै?]',
          b1: ['पहली बात— बिना पसीना बहाए कदे रोला कोनी उठता!', '[उंगली से 1 दिखाते हुए]', '[TEXT: नियम #1: पसीना बहाओ]'],
          b2: ['दूसरी बात— जो तेरे पे हँसे हैं, उननै अपने काम ते जवाब दे!', '[छाती तान के]', '[TEXT: नियम #2: काम ते जवाब]'],
          b3: ['तीसरी बात— रोज 1 घंटा अपने हुनर पै लगा, बाकी सब मोह-माया सै!', '[मुस्कुराते हुए]', '[TEXT: नियम #3: नो बहाने]'],
          cta: 'लाडले अगर बात में दम लाग्या हो तो रील नै सारे भाइयाँ धोरै शेयर ठोक दो अर पेज नै फॉलो कर लो!',
          ctaOverlay: '[TEXT: फॉलो ठोक दो लाडलो]'
        },
        varB: {
          style: 'Shocking Fact / Bold Statement',
          hookCue: '[हुक मारते हुए, तेज कदमों से आते हुए]',
          hook: 'ओ भाई! 99% बालक ' + cleanTopic + ' का यो असली सच कोनी जानते!',
          vo: 'ओ भाई! [PAUSE 0.7s] 99% बालक यो असली सच कोनी जानते!',
          overlay: '[TEXT: 99% बालकां नै नी बेरा!]',
          b1: ['सच्चाई या सै के किस्मत के भरोसे बैठण वाले खाली हाथ मलते रैह जांवैं!', '[हाथ हिलाते हुए]', '[TEXT: किस्मत नहीं, मेहनत]'],
          b2: ['दम अपने बाजुओं में होना चहिए, दुनिया तो अपने आप झुकैगी!', '[डोले दिखाते हुए]', '[TEXT: बाजुओं में दम]'],
          b3: ['यो नियम पकड़ ले, 30 दिन में थारी काया पलट ज्यागी!', '[कड़क लुक]', '[TEXT: 30 दिन का चैलेंज]'],
          cta: 'थारे भाई का वादा सै, रील नै SAVE कर ल्यो अर सारे यारां नै शेयर मार दो!',
          ctaOverlay: '[TEXT: शेयर मार दो भाई]'
        },
        varC: {
          style: 'Relatable Story / Street Drama',
          hookCue: '[पास आके हंसते हुए, दोस्ताना अंदाज]',
          hook: 'अरे रुक जा भाई! काल मेरे एक यार नै ' + cleanTopic + ' पै कति गजब बात कह दी!',
          vo: 'अरे रुक जा भाई... [PAUSE 0.6s] काल मेरे यार नै कति गजब बात कह दी!',
          overlay: '[TEXT: यार की खरी बात]',
          b1: ['बोला भाई— लोग तो कहवैं सै कि तूं कोनी कर सकदा!', '[मुस्कुरा के]', '[TEXT: दुनिया का काम बोलना]'],
          b2: ['मैंने कही— लाडले, बकण दे! जब शेर दहाड़ेगा तो गधा अपने आप चुप हो ज्यागा!', '[जोश में]', '[TEXT: शेर की दहाड़]'],
          b3: ['बस भाई, फेर उसने जी-जान लगा दी अर आज रिजल्ट सबके सामणै सै!', '[थम्स अप]', '[TEXT: रिजल्ट बोलै सै]'],
          cta: 'थारे भीतर भी आग सै तो नीचे दिए फॉलो बटन नै दबा दो अर रील शेयर करो!',
          ctaOverlay: '[TEXT: फॉलो करो लाडलो]'
        },
        captions: {
          reels: `लाडलो! ${cleanTopic} का यो देसी हरियाणवी मंत्र किसे लाग्या? ⚡\n\nमेहनत इतनी खामोशी ते करो के थारी कामयाबी रोला ठा दे! 🚜\n\nरील नै SAVE कर ल्यो अर अपने पक्के यारां नै SHARE कर दो! 👇`,
          shorts: `${cleanTopic} का धाकड़ हरियाणवी सच! ⚡ Subscribe for daily motivation!`,
          status: `लाडलो! ${cleanTopic} देख ल्यो अर बताओ कैसा लाग्या! 🚜 स्टेटस शेयर करो!`
        },
        tags: ['#HaryanviReels', '#HaryanviStatus', '#DesiHaryanvi', '#HaryanaSwag', '#GurgaonVibes', '#ReelVaniAI'],
        tip: 'हरियाणवी में स्पीड तेज और आवाज में बुलंद मर्दानगी टोन रखें!'
      },
      hindi: {
        tagline: 'देसी हिंदी वायरल मसाला',
        varA: {
          style: 'Question / Curiosity Hook',
          hookCue: '[कैमरे के एकदम पास आकर, गंभीर और जिज्ञासु नजरें]',
          hook: 'क्या आप भी ' + cleanTopic + ' में ये 3 गलतियाँ अनजाने में कर रहे हैं?',
          vo: 'क्या आप भी... [PAUSE 0.5s] ' + cleanTopic + ' में ये 3 गलतियाँ कर रहे हैं?',
          overlay: '[TEXT: ये 3 गलतियाँ तो नहीं कर रहे?]',
          b1: ['पहली गलती— शुरुआत में ही परफेक्ट बनने का इंतजार करना!', '[हाथ से 1 दिखाते हुए]', '[TEXT: #1 परफेक्शन का चक्कर छोड़ो]'],
          b2: ['दूसरी गलती— दूसरों की तरक्की देखकर खुद को कम आंकना!', '[छाती पर हाथ रख कर]', '[TEXT: #2 तुलना बंद करो]'],
          b3: ['और तीसरी बात— बिना कंसिस्टेंसी के बड़े रिजल्ट की उम्मीद लगाना!', '[उंगली से इशारा]', '[TEXT: #3 रोज 1% बेहतर बनो]'],
          cta: 'अगर बात सीधे दिल तक पहुँची हो, तो इस रील को तुरंत SAVE करें, अपने दोस्तों को SHARE करें और फॉलो करना मत भूलें!',
          ctaOverlay: '[TEXT: Save & Follow @ReelVani]'
        },
        varB: {
          style: 'Shocking Fact / Bold Statement',
          hookCue: '[चौंकने वाला एक्सप्रेशन, हाथ से स्क्रीन टैप]',
          hook: '99% लोग ' + cleanTopic + ' का ये कड़वा सच सुनकर यकीन नहीं करेंगे!',
          vo: '99% लोग... [PAUSE 0.7s] ' + cleanTopic + ' का ये सच सुनकर यकीन नहीं करेंगे!',
          overlay: '[TEXT: 99% लोग नहीं जानते!]',
          b1: ['सच्चाई ये है कि टैलेंट से 10 गुना ज्यादा ताकत रोज मेहनत करने में है!', '[गंभीर आवाज]', '[TEXT: टैलेंट < डेली मेहनत]'],
          b2: ['जो आज आपका मजाक उड़ा रहे हैं, कल वही आपसे मिलने का वक्त मांगेंगे!', '[कॉन्फिडेंट स्माइल]', '[TEXT: कामयाबी जवाब देगी]'],
          b3: ['बस 30 दिन बिना रुके काम करो, फर्क पूरी दुनिया देखेगी!', '[जोश में]', '[TEXT: 30 दिन का नियम]'],
          cta: 'अपने उस दोस्त को ये रील भेजो जिसे आज मोटिवेशन की सख्त जरूरत है! पेज को फॉलो करें!',
          ctaOverlay: '[TEXT: शेयर करो दोस्त को]'
        },
        varC: {
          style: 'Relatable Story / Street Drama',
          hookCue: '[रहस्यमयी अंदाज में आगे झुकते हुए]',
          hook: 'रुक जाओ! कल मेरे एक दोस्त के साथ ' + cleanTopic + ' को लेकर एक गजब वाकया हुआ:',
          vo: 'रुक जाओ... [PAUSE 0.6s] कल मेरे दोस्त के साथ एक गजब किस्सा हुआ:',
          overlay: '[TEXT: सच्ची देसी कहानी]',
          b1: ['वो मुझसे बोला— भाई मुझसे नहीं हो पाएगा, बहुत कम्पटीशन है!', '[धीमी आवाज]', '[TEXT: "मुझसे नहीं होगा?"]'],
          b2: ['मैंने सिर्फ एक बात बोली— कम्पटीशन बाहर नहीं, तेरे आलस में है!', '[आँखों में आँखें डाल कर]', '[TEXT: आलस ही असली दुश्मन]'],
          b3: ['उसने आज सुबह से काम शुरू कर दिया और पहला रिजल्ट मिल भी गया!', '[खुशी से मुस्कुराते हुए]', '[TEXT: एक्शन लो आज ही]'],
          cta: 'अगर आप भी बहाने छोड़ कर आगे बढ़ना चाहते हैं, तो अभी FOLLOW बटन दबाइए!',
          ctaOverlay: '[TEXT: Follow बटन दबाएं]'
        },
        captions: {
          reels: `क्या आप भी ${cleanTopic} में ये गलती कर रहे थे? 💥🔥\n\nअगर इस बात ने आपका हौसला बढ़ाया हो तो इस रील को अभी SAVE करें और दोस्तों के साथ SHARE करें! 🚀\n\nकमेंट में बताएं आपकी क्या राय है? 👇`,
          shorts: `${cleanTopic} का सबसे बड़ा सीक्रेट! 🚀 Subscribe for daily viral shorts!`,
          status: `ज़रूर देखें: ${cleanTopic} की असली सच्चाई! 💥 स्टेटस में शेयर करें!`
        },
        tags: ['#HindiReels', '#DesiMotivation', '#HindiShorts', '#ViralHindi', '#DesiJugaad', '#IndianCreators', '#ReelVaniAI'],
        tip: 'हुक लाइन बोलते समय पहले 3 सेकंड में विजुअल कट या जूम-इन इफेक्ट का इस्तेमाल करें!'
      }
    };

    const active = dialectData[langKey] || dialectData.hindi;
    const variations = [
      {
        id: 'var_a',
        styleName: active.varA.style,
        hook: {
          visualCue: active.varA.hookCue,
          dialogue: includeTrendingHook && trendingHookText ? trendingHookText : active.varA.hook,
          voiceOverText: active.varA.vo,
          screenOverlayText: active.varA.overlay
        },
        body: [
          { beatNumber: 1, visualCue: active.varA.b1[1], dialogue: active.varA.b1[0], voiceOverText: active.varA.b1[0], screenOverlayText: active.varA.b1[2] },
          { beatNumber: 2, visualCue: active.varA.b2[1], dialogue: active.varA.b2[0], voiceOverText: active.varA.b2[0], screenOverlayText: active.varA.b2[2] },
          { beatNumber: 3, visualCue: active.varA.b3[1], dialogue: active.varA.b3[0], voiceOverText: active.varA.b3[0], screenOverlayText: active.varA.b3[2] }
        ],
        cta: {
          visualCue: '[Follow button gesture]',
          dialogue: active.varA.cta,
          voiceOverText: active.varA.cta,
          screenOverlayText: active.varA.ctaOverlay
        }
      },
      {
        id: 'var_b',
        styleName: active.varB.style,
        hook: {
          visualCue: active.varB.hookCue,
          dialogue: active.varB.hook,
          voiceOverText: active.varB.vo,
          screenOverlayText: active.varB.overlay
        },
        body: [
          { beatNumber: 1, visualCue: active.varB.b1[1], dialogue: active.varB.b1[0], voiceOverText: active.varB.b1[0], screenOverlayText: active.varB.b1[2] },
          { beatNumber: 2, visualCue: active.varB.b2[1], dialogue: active.varB.b2[0], voiceOverText: active.varB.b2[0], screenOverlayText: active.varB.b2[2] },
          { beatNumber: 3, visualCue: active.varB.b3[1], dialogue: active.varB.b3[0], voiceOverText: active.varB.b3[0], screenOverlayText: active.varB.b3[2] }
        ],
        cta: {
          visualCue: '[Pointing cue]',
          dialogue: active.varB.cta,
          voiceOverText: active.varB.cta,
          screenOverlayText: active.varB.ctaOverlay
        }
      },
      {
        id: 'var_c',
        styleName: active.varC.style,
        hook: {
          visualCue: active.varC.hookCue,
          dialogue: active.varC.hook,
          voiceOverText: active.varC.vo,
          screenOverlayText: active.varC.overlay
        },
        body: [
          { beatNumber: 1, visualCue: active.varC.b1[1], dialogue: active.varC.b1[0], voiceOverText: active.varC.b1[0], screenOverlayText: active.varC.b1[2] },
          { beatNumber: 2, visualCue: active.varC.b2[1], dialogue: active.varC.b2[0], voiceOverText: active.varC.b2[0], screenOverlayText: active.varC.b2[2] },
          { beatNumber: 3, visualCue: active.varC.b3[1], dialogue: active.varC.b3[0], voiceOverText: active.varC.b3[0], screenOverlayText: active.varC.b3[2] }
        ],
        cta: {
          visualCue: '[Smiles and points]',
          dialogue: active.varC.cta,
          voiceOverText: active.varC.cta,
          screenOverlayText: active.varC.ctaOverlay
        }
      }
    ];

    return {
      id: 'pkg_' + Date.now(),
      title: `${cleanTopic} - ${active.tagline}`,
      estimatedDuration: duration || '30s',
      language: language,
      contentType: contentType,
      tone: tone,
      topic: cleanTopic,
      selectedPlatform: platform,
      scriptMode: scriptMode, // 'voiceover' | 'text_overlay'
      activeVariationIndex: 0,
      variations: variations,
      // Backward-compatible top-level pointers mapping to first variation
      hook: variations[0].hook,
      body: variations[0].body,
      cta: variations[0].cta,
      caption: active.captions[platform] || active.captions.reels,
      hashtags: active.tags,
      platformFormats: {
        reels: {
          caption: active.captions.reels,
          hashtags: active.tags
        },
        shorts: {
          caption: active.captions.shorts,
          hashtags: ['#Shorts', '#YouTubeShorts', '#ViralShorts', ...active.tags.slice(0, 5)]
        },
        status: {
          caption: active.captions.status,
          hashtags: ['#Status', '#ViralVideo', ...active.tags.slice(0, 3)]
        }
      },
      creatorTip: active.tip,
      generatedAt: new Date().toISOString()
    };
  }
};
