export const LANGUAGES = [
  {
    id: 'hindi',
    name: 'Hindi (हिंदी)',
    native: 'हिंदी',
    flag: '🇮🇳',
    popular: true,
    tagline: 'देसी जोश, ट्रेंडिंग डायलॉग्स और वायरल हुक्स',
    sampleSlang: ['अरे सुनो भाई', 'एक बात गाँठ बाँध लो', 'ये जुगाड़ किसी ने नहीं बताया होगा', 'शेयर करो अपने उस दोस्त को']
  },
  {
    id: 'bhojpuri',
    name: 'Bhojpuri (भोजपुरी)',
    native: 'भोजपुरी',
    flag: '🔥',
    popular: true,
    tagline: 'कड़क भौकाल, मिजाज और देसी अंदाज़',
    sampleSlang: ['ए बबुआ ध्यान से सुनऽ', 'गजबे बात बा', 'का हो का हाल बा', 'सभे लाइक अउर शेयर ठोकऽ']
  },
  {
    id: 'haryanvi',
    name: 'Haryanvi (हरियाणवी)',
    native: 'हरियाणवी',
    flag: '⚡',
    popular: true,
    tagline: 'धाकड़ तेवर, सीधा प्रहार और रोला',
    sampleSlang: ['ओ भाई सुन ले लाडले', 'कति ज़हर बात', 'धुआं ठा दिया भाई ने', 'गाँव गुंडारा सबने शेयर करो']
  },
  {
    id: 'marathi',
    name: 'Marathi (मराठी)',
    native: 'मराठी',
    flag: '🚩',
    popular: true,
    tagline: 'लय भारी स्वैग, आपुलकी आणि कडक डायलॉग',
    sampleSlang: ['भावांनो लक्ष द्या', 'नाद करायचा पण आमचा कुठं', 'लय भारी जुगाड', 'आताच फॉलो करा']
  },
  {
    id: 'punjabi',
    name: 'Punjabi (ਪੰਜਾਬੀ)',
    native: 'ਪੰਜਾਬੀ',
    flag: '🚜',
    popular: true,
    tagline: 'ਫੁੱਲ ਚੜ੍ਹਾਈ, ਗੱਲਬਾਤ ਤੇ ਰੌਲਾ ਰੱਪਾ',
    sampleSlang: ['ਬਾਈ ਜੀ ਗੱਲ ਸੁਣੋ ਕੰਨ ਖੋਲ ਕੇ', 'ਸਿਰਾ ਲਾ ਤਾ', 'ਚੱਕ ਦੋ ਫੱਟੇ', 'ਸਾਰੇ ਸ਼ੇਅਰ ਠੋਕੋ']
  },
  {
    id: 'gujarati',
    name: 'Gujarati (ગુજરાતી)',
    native: 'ગુજરાતી',
    flag: '💼',
    popular: false,
    tagline: 'ધંધાની વાત, મોજ અને જલસો',
    sampleSlang: ['ભાઈ સાંભળો એક મસ્ત વાત', 'કામ થઈ ગયું સમજો', 'જલસો પડી જશે', 'જલ્દી સેવ કરી લેજો']
  },
  {
    id: 'bengali',
    name: 'Bengali (বাংলা)',
    native: 'বাংলা',
    flag: '🎭',
    popular: false,
    tagline: 'ফাটাফাটি কনসেপ্ট আর খাঁটি আবেগ',
    sampleSlang: ['একটু শোনো দাদা', 'ব্যাপারটা দারুণ', 'মিস করবেন না কিন্তু', 'সবাইকে শেয়ার করে দাও']
  },
  {
    id: 'tamil',
    name: 'Tamil (தமிழ்)',
    native: 'தமிழ்',
    flag: '🚀',
    popular: false,
    tagline: 'மாஸ் வசனங்கள் & ட்ரெண்டிங் ஹூக்ஸ்',
    sampleSlang: ['தம்பி இத நல்லா கேளு', 'மாஸ் காட்டிட்டோம்', 'மறக்காம ஃபாலோ பண்ணுங்க']
  },
  {
    id: 'telugu',
    name: 'Telugu (తెలుగు)',
    native: 'తెలుగు',
    flag: '💥',
    popular: false,
    tagline: 'మాస్ డైలాగ్స్ & వైరల్ హుక్స్',
    sampleSlang: ['బాస్ ఒక్క నిమిషం వినండి', 'సూపర్ ట్రిక్ ఇది', 'తప్పకుండా షేర్ చేయండి']
  },
  {
    id: 'hinglish',
    name: 'Hinglish (Urban Indian)',
    native: 'Hinglish',
    flag: '📱',
    popular: true,
    tagline: 'Gen-Z Metro vibe with natural Hindi-English mix',
    sampleSlang: ['Listen up guys', 'Bro you wont believe this', 'Stop scrolling right now', 'Save this reel immediately']
  }
];

export const CONTENT_TYPES = [
  { id: 'motivational', label: 'Motivational (जोश / प्रेरणा)', icon: '🔥', description: 'High energy, mindset shift, hustle inspiration' },
  { id: 'comedy', label: 'Comedy / Relatable (हँसी-मज़ाक)', icon: '😂', description: 'Funny observation, daily struggle, sarcastic take' },
  { id: 'business_promo', label: 'Business / Shop Promo (धंधा / दुकान)', icon: '💼', description: 'Customer hook, product offer, footfall booster' },
  { id: 'educational', label: 'Tips & Hacks (ज्ञान / टिप्स)', icon: '💡', description: 'Quick tutorial, 3 secret steps, money/tech hack' },
  { id: 'trend_based', label: 'Viral Trend (वायरल अंदाज़)', icon: '⚡', description: 'Ride current social audio tempo and meme hooks' }
];

export const TONES = [
  { id: 'street_desi', label: 'देसी / Street Style', desc: 'Raw, highly authentic local slang and everyday street charisma' },
  { id: 'punchy_bold', label: 'Punchy & Bold', desc: 'Fast-paced, aggressive, high-energy delivery' },
  { id: 'emotional', label: 'Emotional / Heartfelt', desc: 'Deep connection, touchy realization, soft impactful pauses' },
  { id: 'sarcastic', label: 'Sarcastic / Roasting', desc: 'Witty mockery, relatable roasting of friends/colleagues' }
];

export const DURATIONS = [
  { id: '15s', label: '15s (Quick Punch)', words: '~35-50 words', desc: 'Ultra-fast scroll stopper' },
  { id: '30s', label: '30s (Standard Viral)', words: '~70-90 words', desc: 'Sweet spot for algorithm retention' },
  { id: '60s', label: '60s (Story / Deep Dive)', words: '~130-160 words', desc: 'Detailed explanation or emotional story' }
];

export const PLATFORMS = [
  { id: 'reels', name: 'Instagram Reels', icon: '📸', desc: 'Fast visual hooks, relatable caption, viral hashtags' },
  { id: 'shorts', name: 'YouTube Shorts', icon: '▶️', desc: 'Direct problem-to-solution pacing, subscribe CTA' },
  { id: 'status', name: 'WhatsApp Status', icon: '💬', desc: 'Bite-sized high emotion, direct share to friends/family' }
];

export const TOPIC_INSPIRATIONS = [
  { topic: 'Gym Motivation & Cheat Day Regret', lang: 'hindi', type: 'comedy' },
  { topic: 'Chai Tapri Business Startup Formula', lang: 'hindi', type: 'business_promo' },
  { topic: 'Bihari Swag vs Metro Life in Bengaluru', lang: 'bhojpuri', type: 'comedy' },
  { topic: 'Haryanvi Bodybuilding Diet Secret', lang: 'haryanvi', type: 'motivational' },
  { topic: 'Marathi Puneri Sarcasm on Traffic & Potholes', lang: 'marathi', type: 'comedy' },
  { topic: 'Desi Freelancers earning in Dollars at home', lang: 'hinglish', type: 'educational' },
  { topic: 'Retail Cloth Store Special Festive Discount', lang: 'hindi', type: 'business_promo' },
  { topic: 'College Exam Night Preparation Struggle', lang: 'hindi', type: 'comedy' },
  { topic: 'Parents finding phone in your hand 24/7', lang: 'hinglish', type: 'comedy' }
];

export const NICHE_TEMPLATES = [
  {
    id: 'fitness',
    name: 'Fitness & Gym (जिम / फिटनेस)',
    icon: '💪',
    topics: [
      { title: 'Vegetarian High Protein Diet on a Budget (देसी डाइट)', prompt: 'Top 3 cheap vegetarian high protein sources for muscle gain in India under ₹50/day' },
      { title: 'Cheat Day Guilt & Fat Loss Truth', prompt: 'Why one cheat meal won\'t destroy your fitness if you follow this one rule' },
      { title: 'Early Morning Gym Motivation vs Sleep', prompt: 'How to defeat laziness and wake up at 5:30 AM for workout' }
    ]
  },
  {
    id: 'food',
    name: 'Street Food & Cafe (खाना-पीना)',
    icon: '🍲',
    topics: [
      { title: 'Secret Recipe / Special Masala Reveal', prompt: 'The secret spice combination that makes our special butter paneer / chai irresistible' },
      { title: 'Customer Reaction to Spicy Challenge', prompt: 'When a customer thought they could handle our spiciest chutney challenge' },
      { title: 'Behind the Scenes Morning Prep at Stall', prompt: 'What 6:00 AM looks like before opening the hottest breakfast point in the city' }
    ]
  },
  {
    id: 'business',
    name: 'Local Business & Dukaan (दुकान / धंधा)',
    icon: '🏪',
    topics: [
      { title: 'Why Online Shopping will fail against our Store', prompt: '3 things local retail shops give you that Amazon/Flipkart never can' },
      { title: 'Festive Mega Clearance Sale Offer', prompt: 'Buy 1 Get 2 Free offer announcement for this weekend only' },
      { title: 'Small Business Journey: From ₹500 to Full Store', prompt: 'How we started this shop from a small table with zero backing' }
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion & Styling (फैशन / कपड़े)',
    icon: '👗',
    topics: [
      { title: '3 Ways to Style 1 Kurta for College & Weddings', prompt: 'How to wear one classic black/white kurta in 3 completely different stunning looks' },
      { title: 'Cheap vs Expensive Outfit Test', prompt: 'How to look like a millionaire on a ₹1000 budget with simple color matching rules' },
      { title: 'Footwear Mistakes Indian Men/Women Make', prompt: 'Stop wearing these 2 shoes with traditional outfits' }
    ]
  },
  {
    id: 'education',
    name: 'Tech & Student Hacks (पढ़ाई / टेक टिप्स)',
    icon: '🎓',
    topics: [
      { title: 'Secret AI Tools Students Must Use in 2026', prompt: '3 free AI websites that will finish your assignments and resume in 5 minutes' },
      { title: 'How to Study 8 Hours Without Burnout', prompt: 'The 50/10 Pomodoro trick used by UPSC and IIT toppers' },
      { title: 'Smart Ways to Earn ₹10,000/month in College', prompt: '3 real online side-gigs college students can start today with zero investment' }
    ]
  },
  {
    id: 'comedy',
    name: 'Comedy & Daily Struggles (हँसी-मज़ाक)',
    icon: '🤣',
    topics: [
      { title: 'When Rishta Wale Come Home', prompt: 'The awkward 15 minutes when guests come to see you for marriage' },
      { title: 'Middle Class Parents Reaction to Buying iPhone', prompt: 'When you tell your desi parents you want an expensive phone' },
      { title: 'Salary Credited vs 5 Days Later', prompt: 'The emotional rollercoaster of salary day vs end of the month' }
    ]
  }
];

export const TRENDING_HOOKS_LIBRARY = [
  {
    id: 'hook-1',
    language: 'hindi',
    category: 'Educational / Hacks',
    hookText: 'अगर ये 3 गलतियाँ कर रहे हो, तो आज ही रुक जाओ!',
    audioVibe: 'Tense Cinematic Beat / Suspense Rise',
    format: 'Finger Pointing at screen + fast zoom'
  },
  {
    id: 'hook-2',
    language: 'bhojpuri',
    category: 'Comedy / Swag',
    hookText: 'का हो! काहे टेंशन में बाड़ा? ई जुगाड़ देखबऽ त माथा घूम जाई!',
    audioVibe: 'Desi Dholak + Trap remix bass boost',
    format: 'Gamcha fling / Close-up smile'
  },
  {
    id: 'hook-3',
    language: 'haryanvi',
    category: 'Motivational / Swagger',
    hookText: 'ओ लाडले! मेहनत इतनी खामोशी ते कर, के तेरी कामयाबी रोला ठा दे!',
    audioVibe: 'Heavy Haryanvi Drill Track',
    format: 'Walking towards camera in slow-mo'
  },
  {
    id: 'hook-4',
    language: 'marathi',
    category: 'Business / Promo',
    hookText: 'भावांनो! जर व्यवसाय मोठा करायचाय तर ही एक ट्रिक कधीच विसरू नका!',
    audioVibe: 'Energetic Puneri Dhol-Tasha Loop',
    format: 'Holding product / pointing to register'
  },
  {
    id: 'hook-5',
    language: 'punjabi',
    category: 'Motivational',
    hookText: 'ਜੇ ਸੁਪਨੇ ਵੱਡੇ ਨੇ ਤਾਂ ਨੀਂਦ ਦੀ ਕੁਰਬਾਨੀ ਦੇਣੀ ਹੀ ਪਊਗੀ!',
    audioVibe: 'Sidhu-style bass trumpet loop',
    format: 'Gym / Desk hustle b-roll transition'
  },
  {
    id: 'hook-6',
    language: 'hinglish',
    category: 'Relatable / Gen-Z',
    hookText: 'Stop scrolling! This 20-second hack will save you 2 hours every day.',
    audioVibe: 'Lo-fi Chill HipHop with snapping sound',
    format: 'Screen tap sound + Screen recording'
  },
  {
    id: 'hook-7',
    language: 'hindi',
    category: 'Business Promo',
    hookText: 'सस्ते के चक्कर में क्वालिटी भूल गए? इधर आओ, असली माल दिखाते हैं!',
    audioVibe: 'Upbeat Shopkeeper Folk Groove',
    format: 'Unboxing / Product reveal showcase'
  }
];
