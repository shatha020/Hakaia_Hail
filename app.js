/**
 * ═══════════════════════════════════════════════════════════════
 *  حكايا حائل — app.js
 *  المنطق الرئيسي: كاميرا → تصنيف → Gemini → صوت → بطاقات
 * ═══════════════════════════════════════════════════════════════
 *
 *  ▶ النشر على Vercel:
 *    1. اربط الم repo بـ Vercel
 *    2. أضف GEMINI_API_KEY في Environment Variables
 *    3. المنصة: https://your-app.vercel.app
 *    4. لوحة الأثر: https://your-app.vercel.app/admin.html
 *
 *  ▶ محلياً: انسخ .env.example إلى .env وضع المفتاح، ثم python server.py
 *    http://localhost:3003
 */

import { GoogleGenAI } from 'https://esm.run/@google/genai';
import { CUSTOM_STORIES } from './custom-stories.js';
import {
  initPlatform,
  onLandmarkScanned,
  refreshPlatformLanguage,
  switchTab,
} from './platform.js';
import { BUSINESS_TYPE_I18N, pickLocale, REGION_I18N, getProductLabels, translateBusiness } from './locale-data.js';
import { landmarkLabel } from './i18n.js';

/* ─────────────────────────────────────────────
   ⚙️ الإعدادات — ضع مفتاحك وبياناتك هنا
   ───────────────────────────────────────────── */
const CONFIG = {
  // 🔑 للتشغيل المحلي: ضع المفتاح في ملف .env (انظر .env.example)
  // على Vercel: يُقرأ من Environment Variables عبر /api/chat
  GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE',

  // 🤖 نموذج Gemini — gemini-1.5-flash مع بدائل عند الفشل
  GEMINI_MODEL: 'gemini-2.5-flash-lite',
  GEMINI_FALLBACK_MODELS: ['gemini-flash-lite-latest', 'gemini-2.5-flash', 'gemini-flash-latest'],

  // 🤖 رابط نموذج Teachable Machine (اختياري)
  // إذا تركته فارغاً، يعمل النظام في وضع العرض التجريبي (DEMO)
  // مثال: 'https://teachablemachine.withgoogle.com/models/XXXXX/'
  TEACHABLE_MACHINE_MODEL_URL: 'https://teachablemachine.withgoogle.com/models/pSvhrkVzZ/',

  // 🎯 false = تعرف حقيقي عبر Teachable Machine (قابل للترقية إلى YOLOv8)
  DEMO_MODE: false,

  // 🧠 محرك الرؤية — Teachable Machine + ml5 (يعمل في المتصفح للعرض)
  VISION_ENGINE: 'Teachable Machine AI',

  // 🗣️ إعدادات الصوت (Web Speech API — مجاني)
  SPEECH: {
    rate: 0.9,
    pitch: 1.0,
  },
};

/* ─────────────────────────────────────────────
   🌐 اللغات المدعومة
   ───────────────────────────────────────────── */
const LANGUAGES = {
  ar: {
    id: 'ar',
    htmlLang: 'ar',
    dir: 'rtl',
    speechLang: 'ar-SA',
    ui: {
      langLabel: '🌐 اللغة',
      siteTitle: 'حكايا حائل',
      pageTitle: 'حكايا حائل | راوي حائل',
      tagline: 'منصة تراثية ذكية — راوي، سوق، مسارات، وإنجازات',
      visionBadge: 'رؤية حاسوبية AI',
      stepCapture: 'التصوير',
      stepRecognize: 'التعرف',
      stepStory: 'السرد الصوتي',
      stepLocal: 'الدعم المحلي',
      cameraTitle: 'اكتشف المعلم التاريخي',
      cameraDesc: 'وجّه الكاميرا أو ارفع صورة — يتعرّف النظام على النقوش والمعالم ويحكي قصتها.',
      placeholder: 'اضغط «تشغيل الكاميرا» أو «رفع صورة»',
      btnStartCamera: 'تشغيل الكاميرا',
      btnStartCameraActive: 'الكاميرا تعمل',
      btnCapture: 'التقاط وتحليل',
      btnUpload: 'رفع صورة',
      resultTitle: 'المعلم المكتشف',
      storyTitle: 'راوي حائل يحكي...',
      chatTitle: 'اسأل راوي حائل',
      chatDesc: 'اسأل عن تاريخ المعلم، أفضل وقت للزيارة، أو الأسر المنتجة القريبة.',
      chatPlaceholder: 'اكتب سؤالك هنا...',
      chatWelcome: (name) => `يا هلا! أنا راوي حائل — اسألني أي شي عن «${name}».`,
      chatThinking: 'راوي حائل يفكر...',
      chatError: 'تعذّر الرد — جرّب مرة أخرى.',
      chatOfflineNotice: 'رد محلي — حصة Gemini محدودة مؤقتاً',
      btnDirections: 'توجيه',
      btnOrder: 'طلب / حجز',
      storyLoading: 'راوي حائل يجهّز القصة...',
      servicesTitle: 'أسر منتجة ومقاهي قريبة',
      servicesDesc: 'اكتشف المنتجات المحلية والمقاهي بجوار هذا المعلم',
      footer: 'مشروع هاكاثون <strong>جادة حائل</strong> — حكايا حائل يربط التراث بالتقنية والمجتمع المحلي',
      confidence: (n) => `دقة التعرف: ${n}%`,
      overlayCapture: 'جاري التقاط الصورة...',
      overlayAnalyze: 'جاري تحليل الصورة...',
      overlayDemo: 'وضع تجريبي — جاري تحضير القصة...',
      statusCameraRequest: 'جاري طلب إذن الكاميرا...',
      statusCameraReady: 'الكاميرا جاهزة — وجّهها نحو المعلم واضغط «التقاط»',
      statusCameraError: 'تعذّر الوصول للكاميرا. تأكد من الإذن أو استخدم localhost.',
      statusRecognized: (name) => `تم التعرّف على: ${name}`,
      statusNeedCamera: 'شغّل الكاميرا أو ارفع صورة',
      statusAnalysisError: 'حدث خطأ أثناء التحليل. راجع Console.',
      servicesNearGeneral: 'خدمات متاحة قرب المعالم الأثرية',
      servicesNear: (region, count) => `قريب من ${region} — ${count} ${count === 1 ? 'خدمة' : 'خدمات'}`,
      callNow: 'اتصل الآن',
      offlineStoryNotice: 'قصة محلية جاهزة — حصة Gemini انتهت مؤقتاً',
      customStoryNotice: 'قصة راوي حائل الأصلية',
      fallbackStory: (name) => `يا هلا! ${name} معلم عظيم في حائل، بس صار في مشكلة بالاتصال. جرّب بعد شوي.`,
      statusModelLoading: 'جاري تحميل نموذج التعرف... انتظر قليلاً',
      statusModelReady: 'نموذج الرؤية الحاسوبية جاهز — Teachable Machine AI',
      statusModelReadyMobile: 'MobileNet جاهز (للتجربة — يُفضَّل نموذج Teachable Machine)',
      statusUnrecognized: (label) => `لم أتعرّف على المعلم (${label}). جرّب زاوية أوضح أو درّب نموذج Teachable Machine.`,
      statusClassifierNotReady: 'نموذج التعرف لم يكتمل التحميل — حدّث الصفحة وانتظر «نموذج الرؤية جاهز»',
      configApiKeyWarning: 'انتظر لحظات …',
      deliveryInstant: 'متاح للتوصيل الفوري للموقع',
      serviceSingular: 'خدمة',
      servicePlural: 'خدمات',
      adminLink: 'لوحة الأثر',
      mapsCity: 'حائل',
      geminiErrorApiKey: 'مفتاح API غير صالح أو منتهي — تحقق من المفتاح في Google AI Studio',
      geminiErrorQuota: 'تم تجاوز حصة Gemini المجانية — انتظر دقيقة أو أنشئ مفتاحاً في مشروع جديد',
      geminiErrorModel: (model) => `النموذج "${model}" غير متاح — راجع Console للتفاصيل`,
      geminiErrorNetwork: 'مشكلة شبكة — تأكد من الاتصال بالإنترنت',
      geminiErrorCors: 'مشكلة CORS — شغّل المشروع عبر localhost (python server.py)',
      geminiErrorGeneric: (msg) => msg?.slice(0, 120) || 'تعذّر جلب البيانات من Gemini',
    },
    chatContextSuffix: (name) => `أجب على أسئلة السائح عن معلم "${name}" في حائل. إجابات قصيرة (2–4 جمل). بدون markdown.`,
    routePrompt: (duration, interests) => `أنشئ مساراً سياحياً في حائل لمدة ${duration} باهتمامات: ${interests.join('، ') || 'آثار'}.
أعد JSON فقط كمصفوفة من 4-6 محطات، كل محطة: {"time":"HH:MM","title":"...","type":"آثار|مأكولات|تسوق|مقهى|مغامرة|استرخاء","desc":"..."}
اربط معالم حقيقية (جبة، الشويمس، عيرف، القشلة) بأسر منتجة محلية.`,
    systemPrompt: `أنت «راوي حائل» — راوٍ مضياف من أهل حائل، تحكي قصص المعالم التاريخية للسياح.

قواعد مهمة:
- اكتب باللهجة السعودية الحائلية المحلية (دافئة، مألوفة، كأنك تكلم ضيف في سوق حائل).
- استخدم تعابير حائلية طبيعية مثل: "يا هلا"، "حيّاك الله"، "مرحبتين"، "تفضل"، "الله يعطيك العافية".
- القصة قصيرة: 4–6 جمل فقط، مشوقة ومليئة بالتفاصيل التاريخية.
- لا تستخدم markdown ولا قوائم — نص متصل فقط.
- ابدأ بتحية حائلية واذكر اسم المعلم في البداية.
- لا تخترع معلومات غير مؤكدة — إذا لم تكن متأكداً، قل "يقولون..." أو "يروي الأجداد..."`,
    storyPrompt: (name) => `احكِ لي قصة مشوقة عن معلم "${name}" في مدينة حائل، باللهجة الحائلية المحلية.`,
  },
  en: {
    id: 'en',
    htmlLang: 'en',
    dir: 'ltr',
    speechLang: 'en-US',
    ui: {
      langLabel: '🌐 Language',
      siteTitle: 'Hakaia Hail',
      pageTitle: 'Hakaia Hail | Storyteller',
      tagline: 'Smart heritage platform — narrator, market, routes & badges',
      visionBadge: 'AI Computer Vision',
      stepCapture: 'Capture',
      stepRecognize: 'Recognize',
      stepStory: 'Storytelling',
      stepLocal: 'Local Support',
      cameraTitle: 'Discover the Historic Landmark',
      cameraDesc: 'Use the camera or upload a photo — AI identifies landmarks and tells their story.',
      placeholder: 'Start camera or upload a photo',
      btnStartCamera: 'Start Camera',
      btnStartCameraActive: 'Camera Active',
      btnCapture: 'Capture & Analyze',
      btnUpload: 'Upload Photo',
      resultTitle: 'Landmark Detected',
      storyTitle: 'Hail Storyteller says...',
      chatTitle: 'Ask Hail Storyteller',
      chatDesc: 'Ask about history, best visit times, or nearby local businesses.',
      chatPlaceholder: 'Type your question...',
      chatWelcome: (name) => `Welcome! Ask me anything about "${name}".`,
      chatThinking: 'Thinking...',
      chatError: 'Could not reply — try again.',
      chatOfflineNotice: 'Local reply — Gemini quota temporarily limited',
      btnDirections: 'Directions',
      btnOrder: 'Order / Book',
      storyLoading: 'Preparing your story...',
      servicesTitle: 'Local Businesses Nearby',
      servicesDesc: 'Discover local products and cafés near this landmark',
      footer: 'Jada Hail Hackathon — <strong>Hakaia Hail</strong> connects heritage, tech & community',
      confidence: (n) => `Confidence: ${n}%`,
      overlayCapture: 'Capturing image...',
      overlayAnalyze: 'Analyzing image...',
      overlayDemo: 'Demo mode — preparing story...',
      statusCameraRequest: 'Requesting camera access...',
      statusCameraReady: 'Camera ready — point at a landmark and capture',
      statusCameraError: 'Could not access camera. Use localhost.',
      statusRecognized: (name) => `Recognized: ${name}`,
      statusNeedCamera: 'Start camera or upload a photo',
      statusAnalysisError: 'Analysis error. Check Console.',
      servicesNearGeneral: 'Services available near archaeological sites',
      servicesNear: (region, count) => `Near ${region} — ${count} service${count === 1 ? '' : 's'}`,
      callNow: 'Call now',
      offlineStoryNotice: 'Local story ready — Gemini quota temporarily exceeded',
      customStoryNotice: 'Original Hail storyteller tale',
      fallbackStory: (name) => `${name} is a magnificent landmark in Hail. Connection issue — try again soon.`,
      statusModelLoading: 'Loading recognition model... please wait',
      statusModelReady: 'Computer vision model ready — Teachable Machine AI',
      statusModelReadyMobile: 'MobileNet ready (demo — Teachable Machine model preferred)',
      statusUnrecognized: (label) => `Landmark not recognized (${label}). Try a clearer angle or train the model.`,
      statusClassifierNotReady: 'Model still loading — refresh and wait for «vision model ready»',
      configApiKeyWarning: 'Wait a moment…',
      deliveryInstant: 'Instant delivery to your location',
      serviceSingular: 'service',
      servicePlural: 'services',
      adminLink: 'Impact dashboard',
      mapsCity: 'Hail',
      geminiErrorApiKey: 'Invalid or expired API key — check your key in Google AI Studio',
      geminiErrorQuota: 'Gemini free quota exceeded — wait a minute or create a key in a new project',
      geminiErrorModel: (model) => `Model "${model}" unavailable — check Console for details`,
      geminiErrorNetwork: 'Network issue — check your internet connection',
      geminiErrorCors: 'CORS issue — run the project via localhost (python server.py)',
      geminiErrorGeneric: (msg) => msg?.slice(0, 120) || 'Could not fetch data from Gemini',
    },
    chatContextSuffix: (name) => `Answer tourist questions about "${name}" in Hail, Saudi Arabia. Short answers (2–4 sentences). No markdown.`,
    routePrompt: (duration, interests) => `Create a tourism route in Hail for ${duration} with interests: ${interests.join(', ') || 'heritage'}.
Return JSON only as an array of 4-6 stops, each: {"time":"HH:MM","title":"...","type":"Heritage|Food|Shopping|Café|Adventure|Relax","desc":"..."}
Link real landmarks (Jubbah, Shuwaymis, Airif, Qishlah) with local productive families. Write all text in English.`,
    systemPrompt: `You are "Hail Storyteller" — a warm local narrator sharing historic landmarks of Hail, Saudi Arabia.
- Write in clear, engaging English for tourists.
- Keep the story to 4–6 sentences.
- No markdown — plain text only.
- Start with a friendly greeting.`,
    storyPrompt: (name) => `Tell me an engaging story about the landmark "${name}" in Hail city, Saudi Arabia.`,
  },
  fr: {
    id: 'fr',
    htmlLang: 'fr',
    dir: 'ltr',
    speechLang: 'fr-FR',
    ui: {
      langLabel: '🌐 Langue',
      siteTitle: 'Hakaia Hail',
      pageTitle: 'Hakaia Hail | Le conteur',
      tagline: 'Plateforme patrimoniale — conteur, marché, parcours & badges',
      visionBadge: 'Vision par ordinateur IA',
      stepCapture: 'Capture',
      stepRecognize: 'Reconnaissance',
      stepStory: 'Récit audio',
      stepLocal: 'Soutien local',
      cameraTitle: 'Découvrez le monument historique',
      cameraDesc: 'Utilisez la caméra ou téléversez une photo — l\'IA identifie le monument et raconte son histoire.',
      placeholder: 'Démarrez la caméra ou téléversez une photo',
      btnStartCamera: 'Démarrer la caméra',
      btnStartCameraActive: 'Caméra active',
      btnCapture: 'Capturer et analyser',
      btnUpload: 'Téléverser une photo',
      resultTitle: 'Monument détecté',
      storyTitle: 'Le conteur de Hail raconte...',
      chatTitle: 'Interrogez le conteur',
      chatDesc: 'Posez vos questions sur l\'histoire, la visite ou les commerces locaux.',
      chatPlaceholder: 'Écrivez votre question...',
      chatWelcome: (name) => `Bienvenue ! Posez-moi des questions sur « ${name} ».`,
      chatThinking: 'Réflexion en cours...',
      chatError: 'Impossible de répondre — réessayez.',
      chatOfflineNotice: 'Réponse locale — quota Gemini temporairement limité',
      btnDirections: 'Itinéraire',
      btnOrder: 'Commander',
      storyLoading: 'Préparation de l\'histoire...',
      servicesTitle: 'Commerces locaux à proximité',
      servicesDesc: 'Découvrez les produits locaux et cafés près de ce monument',
      footer: 'Hackathon Jada Hail — <strong>Hakaia Hail</strong> patrimoine & technologie',
      confidence: (n) => `Confiance : ${n}%`,
      overlayCapture: 'Capture en cours...',
      overlayAnalyze: 'Analyse en cours...',
      overlayDemo: 'Mode démo — préparation...',
      statusCameraRequest: 'Demande d\'accès à la caméra...',
      statusCameraReady: 'Caméra prête — pointez vers un monument',
      statusCameraError: 'Accès caméra impossible.',
      statusRecognized: (name) => `Reconnu : ${name}`,
      statusNeedCamera: 'Démarrez la caméra ou téléversez une photo',
      statusAnalysisError: 'Erreur d\'analyse.',
      servicesNearGeneral: 'Services disponibles près des sites archéologiques',
      servicesNear: (region, count) => `Près de ${region} — ${count} service${count === 1 ? '' : 's'}`,
      callNow: 'Appeler',
      offlineStoryNotice: 'Histoire locale — quota Gemini temporairement dépassé',
      customStoryNotice: 'Histoire originale du conteur de Hail',
      fallbackStory: (name) => `${name} est un magnifique monument à Hail. Problème de connexion — réessayez.`,
      statusModelLoading: 'Chargement du modèle de reconnaissance...',
      statusModelReady: 'Modèle de vision prêt — Teachable Machine AI',
      statusModelReadyMobile: 'MobileNet prêt (démo — modèle Teachable Machine recommandé)',
      statusUnrecognized: (label) => `Monument non reconnu (${label}). Essayez un meilleur angle.`,
      statusClassifierNotReady: 'Modèle en cours de chargement — actualisez la page',
      configApiKeyWarning: 'Veuillez patienter…',
      deliveryInstant: 'Livraison instantanée sur place',
      serviceSingular: 'service',
      servicePlural: 'services',
      adminLink: 'Tableau de bord',
      mapsCity: 'Hail',
      geminiErrorApiKey: 'Clé API invalide ou expirée — vérifiez dans Google AI Studio',
      geminiErrorQuota: 'Quota Gemini gratuit dépassé — attendez une minute ou créez une nouvelle clé',
      geminiErrorModel: (model) => `Modèle "${model}" indisponible — voir la Console`,
      geminiErrorNetwork: 'Problème réseau — vérifiez votre connexion',
      geminiErrorCors: 'Problème CORS — lancez via localhost (python server.py)',
      geminiErrorGeneric: (msg) => msg?.slice(0, 120) || 'Impossible de récupérer les données Gemini',
    },
    chatContextSuffix: (name) => `Répondez aux questions des touristes sur « ${name} » à Hail. Réponses courtes (2–4 phrases). Pas de markdown.`,
    routePrompt: (duration, interests) => `Créez un parcours touristique à Hail pour ${duration} avec intérêts: ${interests.join(', ') || 'patrimoine'}.
Retournez uniquement du JSON: tableau de 4-6 étapes, chaque: {"time":"HH:MM","title":"...","type":"Patrimoine|Gastronomie|Shopping|Café|Aventure|Détente","desc":"..."}
Liez les monuments réels (Jubbah, Shuwaymis, Airif, Qishlah) aux familles productives. Texte en français.`,
    systemPrompt: `Tu es « le conteur de Hail » — un narrateur chaleureux qui raconte les monuments historiques de Hail, Arabie Saoudite.
- Écris en français clair et engageant pour les touristes.
- Histoire courte : 4–6 phrases.
- Pas de markdown — texte continu.`,
    storyPrompt: (name) => `Raconte une histoire captivante sur le monument "${name}" à Hail, Arabie Saoudite.`,
  },
  ur: {
    id: 'ur',
    htmlLang: 'ur',
    dir: 'rtl',
    speechLang: 'ur-PK',
    ui: {
      langLabel: '🌐 زبان',
      siteTitle: 'حکايا حائل',
      pageTitle: 'حکايا حائل | حائل کا راوی',
      tagline: 'ثقافتی پلیٹ فارم — راوی، بازار، راستے اور کامیابیاں',
      visionBadge: 'AI کمپیوٹر ویژن',
      stepCapture: 'تصویر',
      stepRecognize: 'پہچان',
      stepStory: 'کہانی',
      stepLocal: 'مقامی معاونت',
      cameraTitle: 'تاریخی مقام دریافت کریں',
      cameraDesc: 'کیمرہ استعمال کریں یا تصویر اپ لوڈ کریں — AI مقام پہچان کر کہانی سناتا ہے۔',
      placeholder: 'کیمرہ چالو کریں یا تصویر اپ لوڈ کریں',
      btnStartCamera: 'کیمرہ چالو کریں',
      btnStartCameraActive: 'کیمرہ چالو',
      btnCapture: 'تصویر اور تجزیہ',
      btnUpload: 'تصویر اپ لوڈ',
      resultTitle: 'دریافت شدہ مقام',
      storyTitle: 'حائل کا راوی کہتا ہے...',
      chatTitle: 'راوی سے پوچھیں',
      chatDesc: 'تاریخ، دورے کا وقت، یا قریبی کاروبار کے بارے میں پوچھیں۔',
      chatPlaceholder: 'سوال لکھیں...',
      chatWelcome: (name) => `خوش آمدید! «${name}» کے بارے میں کچھ بھی پوچھیں۔`,
      chatThinking: 'سوچ رہا ہے...',
      chatError: 'جواب نہیں ملا — دوبارہ کوشش کریں۔',
      chatOfflineNotice: 'مقامی جواب — Gemini کوٹہ عارضی طور پر محدود',
      btnDirections: 'راستہ',
      btnOrder: 'آرڈر / بکنگ',
      storyLoading: 'کہانی تیار ہو رہی ہے...',
      servicesTitle: 'قریبی مقامی کاروبار',
      servicesDesc: 'اس مقام کے قریب مقامی مصنوعات اور کیفے دریافت کریں',
      footer: 'جada حائل ہیکاتھون — <strong>حکايا حائل</strong>',
      confidence: (n) => `درستگی: ${n}%`,
      overlayCapture: 'تصویر لے رہے ہیں...',
      overlayAnalyze: 'تجزیہ جاری ہے...',
      overlayDemo: 'ڈیمو موڈ — کہانی تیار...',
      statusCameraRequest: 'کیمرہ کی اجازت مانگ رہے ہیں...',
      statusCameraReady: 'کیمرہ تیار — مقام کی طرف کریں',
      statusCameraError: 'کیمرہ تک رسائی نہیں۔',
      statusRecognized: (name) => `پہچانا گیا: ${name}`,
      statusNeedCamera: 'کیمرہ چالو کریں یا تصویر اپ لوڈ کریں',
      statusAnalysisError: 'تجزیے میں خرابی۔',
      servicesNearGeneral: 'آثار قدیمہ کے قریب خدمات',
      servicesNear: (region, count) => `${region} کے قریب — ${count} خدمات`,
      callNow: 'ابھی کال کریں',
      offlineStoryNotice: 'مقامی کہانی — Gemini کوٹہ عارضی طور پر ختم',
      customStoryNotice: 'حائل کے راوی کی اصل کہانی',
      fallbackStory: (name) => `${name} حائل کا عظیم مقام ہے۔ رابطے میں مسئلہ — بعد میں کوشش کریں۔`,
      statusModelLoading: 'پہچان ماڈل لوڈ ہو رہا ہے...',
      statusModelReady: 'کمپیوٹر ویژن ماڈل تیار — Teachable Machine AI',
      statusModelReadyMobile: 'MobileNet تیار (ڈیمو — Teachable Machine بہتر)',
      statusUnrecognized: (label) => `مقام نہیں پہچانا (${label})۔ واضح زاویہ آزمائیں۔`,
      statusClassifierNotReady: 'ماڈل ابھی لوڈ ہو رہا ہے — صفحہ refresh کریں',
      configApiKeyWarning: 'براہ کرم انتظار کریں…',
      deliveryInstant: 'فوری ڈilivery مقام پر',
      serviceSingular: 'سروس',
      servicePlural: 'خدمات',
      adminLink: 'اثر ڈیش بورڈ',
      mapsCity: 'حائل',
      geminiErrorApiKey: 'API key غلط یا ختم — Google AI Studio میں چیک کریں',
      geminiErrorQuota: 'Gemini مفت کوٹہ ختم — ایک منٹ انتظار یا نئی key بنائیں',
      geminiErrorModel: (model) => `ماڈل "${model}" دستیاب نہیں — Console دیکھیں`,
      geminiErrorNetwork: 'نیٹ ورک مسئلہ — انternet چیک کریں',
      geminiErrorCors: 'CORS مسئلہ — localhost پر چلائیں (python server.py)',
      geminiErrorGeneric: (msg) => msg?.slice(0, 120) || 'Gemini سے ڈیٹا نہیں ملا',
    },
    chatContextSuffix: (name) => `«${name}» کے بارے میں سیاحوں کے سوالات کا جواب دیں (حائل)۔ مختصر جواب (2–4 جمل)۔ markdown نہیں۔`,
    routePrompt: (duration, interests) => `حائل میں ${duration} کے لیے سیاحتی راستہ بنائیں، دلچسپیاں: ${interests.join(', ') || 'heritage'}۔
صرف JSON واپس کریں: 4-6 اسٹاپس، ہر: {"time":"HH:MM","title":"...","type":"ثقافت|کھana|خریداری|کیفے|مہم|آرام","desc":"..."}
حقیقی مقامات (جبہ، الشویمس، عیرf، القشلہ) سے جوڑیں۔ متن اردو میں۔`,
    systemPrompt: `آپ «حائل کا راوی» ہیں — مقامی راوی جو حائل کے تاریخی مقامات کی کہانیاں سناتے ہیں۔
- سادہ اردو میں لکھیں، سیاحوں کے لیے۔
- کہانی 4–6 جملوں کی ہو۔
- markdown نہیں — مسلسل متن۔`,
    storyPrompt: (name) => `"${name}" مقام کے بارے میں حائل شہر، سعودی عرب میں دلچسپ کہانی سنائیں۔`,
  },
};

let currentLang = localStorage.getItem('hakaia_lang') || 'ar';
if (currentLang === 'ar-hail') currentLang = 'ar';

function t(key, ...args) {
  const ui = LANGUAGES[currentLang]?.ui ?? LANGUAGES.ar.ui;
  const val = ui[key];
  return typeof val === 'function' ? val(...args) : (val ?? key);
}

function getLang() {
  return LANGUAGES[currentLang] ?? LANGUAGES.ar;
}

function getLandmarkName(landmarkOrId) {
  const lm = typeof landmarkOrId === 'string' ? LANDMARKS[landmarkOrId] : landmarkOrId;
  return landmarkLabel(lm, currentLang);
}

function translateRegion(regionKey) {
  return pickLocale(REGION_I18N[regionKey], currentLang) || regionKey;
}

function translateBusinessType(typeKey) {
  return pickLocale(BUSINESS_TYPE_I18N[typeKey], currentLang) || typeKey;
}

/* ─────────────────────────────────────────────
   📍 قاعدة بيانات المعالم (يمكنك توسيعها)
   ───────────────────────────────────────────── */
const LANDMARKS = {
  'jubbah_rock': {
    id: 'jubbah_rock',
    nameAr: 'نقوش جبة الصخرية',
    nameEn: 'Jubbah Rock Art',
    nameFr: 'Art rupestre de Jubbah',
    nameUr: 'جبہ کی صخری نقش و نگار',
    aliases: ['jubbah', 'جبة', 'rock art', 'petroglyphs', 'نقوش جبة'],
    description: 'نقوش صخرية عمرها آلاف السنين',
  },
  'shuwaymis': {
    id: 'shuwaymis',
    nameAr: 'آثار الشويمس',
    nameEn: 'Al-Shuwaymis Heritage',
    nameFr: 'Patrimoine Al-Shuwaymis',
    nameUr: 'آثار الشویمس',
    aliases: ['shuwaymis', 'الشويمس', 'شويمس', 'al shuwaymis'],
    description: 'موقع أثري وصخري في منطقة حائل',
  },
  'airif_fort': {
    id: 'airif_fort',
    nameAr: 'قلعة عيرف',
    aliases: ['airif', 'عيرف', 'عريف', 'qasr airif', 'airif fort', 'قلعة عيرف', 'قصر عيرف'],
    description: 'قلعة تاريخية في قلب حائل',
  },
  'barzan_palace': {
    id: 'barzan_palace',
    nameAr: 'قصر برزان',
    aliases: ['barzan', 'برزان', 'barzan palace'],
    description: 'قصر أثري من الطين يعود للعصر العثماني',
  },
  'aishiyah_palace': {
    id: 'aishiyah_palace',
    nameAr: 'قصر العشية',
    aliases: ['aishiyah', 'العشية', 'aishiyah palace'],
    description: 'أحد القصور التاريخية في حائل',
  },
  'hail_museum': {
    id: 'hail_museum',
    nameAr: 'متحف حائل الإقليمي',
    aliases: ['museum', 'متحف', 'hail museum'],
    description: 'يعرض تراث وتاريخ منطقة حائل',
  },
  'qishlah': {
    id: 'qishlah',
    nameAr: 'قصر القشلة',
    aliases: ['qishlah', 'القشلة', 'قشلة', 'qishla palace'],
    description: 'قصر تراثي تاريخي في حائل',
  },
};

/* ── قصص محلية جاهزة (تُستخدم عند انتهاء حصة Gemini) ── */
const OFFLINE_STORIES = {
  jubbah_rock: {
    ar: 'يا هلا ومرحبتين! هذا نقوش جبة الصخرية، يقولون عمرها آلاف السنين وترسم لنا حياة أجدادنا في الصحراء. تشوف رسم الجمال والصيد والرقص على الصخر، كأنهم يسولفون لنا عن أيامهم. جبة من أقدم مواقع الفن الصخري في الجزيرة، واليونيسكو اعترفت فيها. حيّاك الله، تفضل وتمشّى بين النقوش ولا تنسى تاخذ صور.',
    en: 'Welcome to Jubbah Rock Art! These ancient carvings are thousands of years old and show us how desert communities once lived, hunted, and celebrated. You can see camels, hunters, and dancers etched into the sandstone — like messages from the ancestors. Jubbah is one of Arabia\'s greatest open-air galleries and a UNESCO World Heritage site. Take your time and walk among the rocks — every panel tells a story.',
    fr: 'Bienvenue aux gravures rupestres de Jubbah ! Ces sculptures datent de milliers d\'années et nous montrent la vie, la chasse et les célébrations des anciens habitants du désert. On y voit des chameaux, des chasseurs et des danses gravés dans la roche — comme des messages laissés par nos ancêtres. Jubbah est l\'un des plus grands sites d\'art rupestre d\'Arabie, inscrit au patrimoine mondial de l\'UNESCO.',
    ur: 'خوش آمدید! جبة کی صخری نقش و نگار ہزاروں سال پرانی ہیں اور صحرائی زندگی، شکار اور تہواروں کی کہانی سناتی ہیں۔ پتھر پر اونٹ، شکار اور رقص کے مناظر کندہ ہیں — جیسے آباؤ اجداد کا پیغام۔ جبة جزیرہ نما عرب کے اہم ترین کھلے فن کے مقامات میں سے ایک ہے اور UNESCO کی ورلڈ ہیریٹیج سائٹ ہے۔',
  },
  shuwaymis: {
    ar: 'حيّاك الله! آثار الشويمس موقع صخري عظيم شمال حائل، يروي الأجداد عن بدايات الكتابة والرسم في المنطقة. النقوش هنا تبيّن لنا صيد وحروب ومواسم المطر، وكل صخرة فيها حكاية. يقولون الشويمس من أهم مواقع التراث في المملكة. الله يعطيك العافية، خذ وقتك واستكشف المكان بهدوء.',
    en: 'Welcome to Al-Shuwaymis! This archaeological rock-art site north of Hail preserves some of the region\'s earliest visual stories. The carvings depict hunting scenes, symbols, and daily life from long ago — each stone feels like a page of history. Shuwaymis is considered one of Saudi Arabia\'s most important heritage landscapes. Walk slowly, look closely, and let the rocks speak.',
    fr: 'Bienvenue à Al-Shuwaymis ! Ce site archéologique au nord de Hail conserve certaines des plus anciennes images gravées de la région. Les scènes de chasse, les symboles et la vie quotidienne racontent l\'histoire des premiers habitants. Shuwaymis compte parmi les paysages patrimoniaux les plus importants d\'Arabie saoudite.',
    ur: 'الشويمس میں خوش آمدید! یہ شمالی حائل کا اہم آثار قدیمہ اور صخری فن کا مقام ہے۔ نقش و نگار شکار، علامات اور قدیم زندگی کے مناظر دکھاتے ہیں — ہر پتھر ایک صفحہ تاریخ لگتا ہے۔ الشويمس سعودی عرب کے اہم ترین ثقافتی مقامات میں سے ایک ہے۔',
  },
  airif_fort: {
    ar: 'يا هلا! قلعة عيرف من أشهر معالم حائل، تقف شامخة فوق التل وتحكي عن أيام الحصون والدفاع. يقولون بنوها من الطين والحجر عشان تحمي أهل المدينة وتراقب الطرق القديمة. من فوقها تشوف حائل بمنظر جميل، خصوصاً وقت الغروب. مرحبتين فيك، تصوّر واستمتع بأجواء التراث.',
    en: 'Welcome to Airif Fort! This historic mud-brick fortress rises above Hail and recalls the days when cities needed strong walls and watchful guards. Built from local stone and clay, it protected travelers and overlooked ancient trade routes. From the top you get a beautiful view of the city, especially at sunset. Step inside and feel the spirit of old Hail.',
    fr: 'Bienvenue à la forteresse d\'Airif ! Cette citadelle en briques de terre domine Hail et rappelle l\'époque où les villes devaient se défendre et surveiller les routes. Construite en pierre et en argile locale, elle protégeait les habitants et les voyageurs. Du sommet, la vue sur la ville est magnifique, surtout au coucher du soleil.',
    ur: 'قلعہ عیرف میں خوش آمدید! یہ حائل کی مشہور تاریخی قلعہ ہے جو مٹی اور پتھر سے بنی اور شہر کی حفاظت کرتی تھی۔ یہ قدیم راستوں پر نگہبانی کرتی تھی اور آج بھی حائل کی شان ہے۔ اوپر سے شہر کا خوبصورت منظر ملتا ہے، خاص طور پر غروب آفتاب پر۔',
  },
  barzan_palace: {
    ar: 'مرحبتين! قصر برزان قصر تراثي من الطين في قلب حائل، يبيّن لنا فن العمارة النجدية القديمة. يقولون كان مقراً للحكم والاستقبال في العهد العثماني، وله أبراج وأروقة تعكس ذوق أهل المنطقة. اليوم يذكّرنا بأن التراث مو بس حكاية، بل هوية نفتخر فيها. تفضل وتمشّى حوله وشوف تفاصيل البناء.',
    en: 'Welcome to Barzan Palace! This heritage mud palace in the heart of Hail showcases classic Najdi architecture with its towers, courtyards, and thick earthen walls. It once served as an administrative and reception center during the Ottoman era. Today it reminds us that heritage is not just history — it is identity. Walk around and notice the craftsmanship in every wall.',
    fr: 'Bienvenue au palais Barzan ! Ce palais patrimonial en terre, au cœur de Hail, illustre l\'architecture najdite avec ses tours, ses cours et ses épais murs. Il servait autrefois de centre administratif à l\'époque ottomane. Aujourd\'hui, il rappelle que le patrimoine est une identité vivante.',
    ur: 'قصر برزان میں خوش آمدید! یہ حائل کے مرکز میں مٹی کا تاریخی قصر ہے جو نجدی فن تعمیر کی مثال ہے۔ عثمانی دور میں یہ انتظامی اور مہمان نوازی کا مرکز تھا۔ آج یہ ثقافتی شناخت کی یاد دہانی ہے — ہر دیوار میں حرفت نظر آتی ہے۔',
  },
  aishiyah_palace: {
    ar: 'يا هلا! قصر العشية من القصور التاريخية في حائل، يحكي عن أيام الضيافة والمجالس في البادية والحاضر. بناؤه من الطين والحجر يعكس بساطة أهلنا وقوة تصميمهم. يروي الأجداد إن مثل هذه القصور كانت مراكز للقاء والسمر. الله يحييك، قعد شوي وتخيّل أيام راوي الحكايا.',
    en: 'Welcome to Aishiyah Palace! This historic Hail palace reflects the hospitality and gathering traditions of the region. Built from mud and stone, it shows how local families combined simplicity with strong, clever design. Elders say places like this were centers for meetings, stories, and warm welcomes. Sit for a moment and imagine the storytellers of old Hail.',
    fr: 'Bienvenue au palais Aishiyah ! Ce palais historique de Hail rappelle les traditions d\'hospitalité et de réunion de la région. Construit en terre et en pierre, il montre un design local à la fois simple et solide. On dit que de tels palais étaient des lieux de rencontre et de récits.',
    ur: 'قصر العشیہ میں خوش آمدید! یہ حائل کا تاریخی قصر مہمان نوازی اور اجتماعی روایات کی یاد دلاتا ہے۔ مٹی اور پتھر سے بنی یہ عمارت سادگی اور مضبوط ڈیزائن دونوں دکھاتی ہے۔ کہا جاتا ہے ایسے محلات ملاقات اور کہانی سنانے کے مراکز تھے۔',
  },
  hail_museum: {
    ar: 'حيّاك الله! متحف حائل الإقليمي بابك على تاريخ المنطقة من أدوات الحياة القديمة إلى الحرف والزي التراثي. كل قاعة فيها قطعة تحكي عن أجدادنا وطريقة عيشهم في الصحراء والواحات. مكان ممتاز للزائر اللي يبي يفهم حائل قبل ما يتمشى بين معالمها. تفضل واستمتع بالجولة.',
    en: 'Welcome to Hail Regional Museum! This museum opens a door to the region\'s history — from ancient tools and crafts to traditional dress and daily life. Each hall tells how people lived in the desert and oases across the centuries. It is the perfect starting point before exploring Hail\'s landmarks. Enjoy your visit!',
    fr: 'Bienvenue au musée régional de Hail ! Ce musée ouvre la porte à l\'histoire de la région — outils anciens, artisanat, costumes traditionnels et vie quotidienne. Chaque salle raconte la vie dans le désert et les oasis. C\'est un excellent point de départ avant de visiter les monuments de Hail.',
    ur: 'حائل علاقائی عجائب گھر میں خوش آمدید! یہاں علاقے کی تاریخ، قدیم اوزار، دستکاری اور روایتی لباس دیکھنے کو ملتا ہے۔ ہر گیلری صحرا اور واحات کی زندگی کی کہانی سناتی ہے۔ حائل کے مقامات دیکھنے سے پہلے یہ بہترین آغاز ہے۔',
  },
  qishlah: {
    ar: 'يا هلا! قصر القشلة من أبرز المعالم التراثية في حائل — قصر طيني تاريخي يعكس فن العمارة النجدية وعمق تاريخ المنطقة. كان مقراً للحكم والاستقبال، وله أبراج وأروقة تعكس ذوق أهل حائل. اليوم يذكّرنا بأن التراث هوية نفتخر فيها.',
    en: 'Welcome to Qishlah Palace! A historic mud-brick palace in Hail showcasing classic Najdi architecture and the region\'s rich heritage.',
    fr: 'Bienvenue au palais Qishlah ! Palais patrimonial en terre au cœur de Hail, symbole de l\'architecture najdite.',
    ur: 'قصر القشلہ میں خوش آمدید! حائل کا تاریخی مٹی کا قصر جو نجدی ثقافت کی علامت ہے۔',
  },
};

function getCustomStory(landmarkId, langId = currentLang) {
  const stories = CUSTOM_STORIES[landmarkId];
  if (!stories) return null;
  if (stories[langId]) return stories[langId];
  return langId === 'ar' ? (stories.ar ?? null) : null;
}

function getOfflineStory(landmarkId, langId = currentLang) {
  return getCustomStory(landmarkId, langId)
    ?? OFFLINE_STORIES[landmarkId]?.[langId]
    ?? OFFLINE_STORIES[landmarkId]?.ar
    ?? null;
}

/** ردود شات محلية — تعمل لأي سؤال تقريباً عند فشل Gemini */
const OFFLINE_CHAT = {
  ar: {
    time: (n) => `يا هلا! أفضل وقت لزيارة «${n}» من نوفمبر إلى مارس — الجو معتدل والإضاءة حلوة للتصوير. تجنّب ظهر الصيف.`,
    history: (n, tip) => `«${n}» ${tip || 'من أهم معالم حائل التاريخية.'} يروي الأجداد أن المنطقة شهدت حضارات عريقة تركت آثاراً ما زالت حيّة إلى اليوم.`,
    food: (n) => `قريب من «${n}» تلقى أسر منتجة — كليجا، تمر حلوة، ومأكولات شعبية. شوف قسم «الدعم المحلي» تحت للطلب والتواصل.`,
    directions: (n) => `«${n}» في منطقة حائل — استخدم زر «توجيه» في بطاقات الأسر المنتجة، أو ابحث في خرائط Google عن المعلم. معظم المعالم قريبة من مدينة حائل.`,
    ticket: (n) => `«${n}» — يُفضّل التأكد من ساعات العمل والرسوم الحالية عبر الهيئة أو المرشد المحلي. كثير من مواقع حائل التراثية فيها دخول ميسّر للزوار.`,
    photo: (n) => `«${n}» مكان رائع للتصوير! أفضل إضاءة الصباح الباكر أو قبل الغروب. حافظ على الموقع — لا تلمس النقوش ولا تتسلق الصخور.`,
    family: (n) => `«${n}» مناسب للعائلات والأطفال — جولة هادئة وتعليمية. خذ مظلة وماء، خصوصاً في الصيف، وامشِ ببطء بين المعالم.`,
    duration: (n) => `«${n}» — ساعتين إلى 3 ساعات تكفي لجولة مريحة. إذا حاب تستكشف أكثر، ربطها بسوق حائل أو مقهى محلي يزيد المتعة.`,
    weather: (n) => `حائل صحراوية — «${n}» في الشتاء معتدل (15–25°)، والصيف حار. البس لباساً مريحاً وحذاءً مناسباً للمشي.`,
    general: (n, tip) => `سؤال جميل عن «${n}»! ${tip || ''} هذا المعلم جزء من هوية حائل التراثية. تقدر تسأل عن: أفضل وقت، التاريخ، الأسر المنتجة، التصوير، أو مدة الزيارة — وأنا أساعدك.`,
  },
  en: {
    time: (n) => `Best time to visit "${n}" is November–March — mild weather and great light. Avoid midday summer heat.`,
    history: (n, tip) => `"${n}" ${tip || 'is a key heritage site in Hail.'} Ancient communities left landmarks and stories that still live today.`,
    food: (n) => `Near "${n}" you'll find productive families — Kleija, premium dates, and traditional dishes. See Local Support below.`,
    directions: (n) => `"${n}" is in the Hail region — use Directions on local business cards or search the landmark on Google Maps.`,
    ticket: (n) => `For "${n}", check current opening hours and fees with local guides. Many Hail heritage sites offer accessible visitor entry.`,
    photo: (n) => `"${n}" is great for photography! Best light: early morning or before sunset. Please don't touch rock art or climb on sites.`,
    family: (n) => `"${n}" suits families — a calm, educational visit. Bring water and sun protection in summer.`,
    duration: (n) => `Plan 2–3 hours for a comfortable visit to "${n}". Add a local café or the smart market for a fuller day.`,
    weather: (n) => `Hail is desert climate — "${n}" is mild in winter (15–25°C), hot in summer. Wear comfortable walking shoes.`,
    general: (n, tip) => `Great question about "${n}"! ${tip || ''} Ask about visit time, history, local food, photos, or how long to stay — I'm here to help.`,
  },
  fr: {
    time: (n) => `Meilleure période pour « ${n} » : novembre à mars. Évitez midi en été.`,
    history: (n, tip) => `« ${n} » ${tip || 'est un site patrimonial majeur de Hail.'} Des civilisations anciennes y ont laissé art et monuments.`,
    food: (n) => `Près de « ${n} », familles productives : Kleija, dattes, plats traditionnels. Voir Soutien local.`,
    directions: (n) => `« ${n} » se trouve dans la région de Hail — utilisez Google Maps ou le bouton Itinéraire.`,
    ticket: (n) => `Pour « ${n} », vérifiez horaires et tarifs sur place. Nombreux sites accessibles aux visiteurs.`,
    photo: (n) => `« ${n} » est idéal pour la photo — lumière matinale ou crépusculaire. Ne touchez pas les gravures.`,
    family: (n) => `« ${n} » convient aux familles — visite calme et éducative. Eau et protection solaire en été.`,
    duration: (n) => `Comptez 2–3 h pour « ${n} ». Ajoutez un café ou le marché local.`,
    weather: (n) => `Hail : climat désertique. Hiver doux, été chaud. Chaussures confortables recommandées.`,
    general: (n, tip) => `Bonne question sur « ${n} » ! ${tip || ''} Demandez : horaire, histoire, gastronomie, photo, durée.`,
  },
  ur: {
    time: (n) => `«${n}» کا بہترین وقت نومبر–مارچ۔ گرمی میں دوپہر سے بچیں۔`,
    history: (n, tip) => `«${n}» ${tip || 'حائل کا اہم ثقافتی مقام ہے۔'} قدیم آبادیوں نے یہاں آثار چھوڑے۔`,
    food: (n) => `«${n}» کے قریب پیداواری خاندان — کليجا، کھجور، روایتی کھana۔`,
    directions: (n) => `«${n}» حائل میں ہے — Google Maps یا راستہ بٹن استعمال کریں۔`,
    ticket: (n) => `«${n}» — اوقات و فیس مقامی گائیڈ سے پوچھیں۔`,
    photo: (n) => `«${n}» تصویر کے لیے بہترین — صبح یا غروب۔ نقشوں کو مت چھوئیں۔`,
    family: (n) => `«${n}» خاندانوں کے لیے موزوں — پانی اور سورج سے بچاؤ لائیں۔`,
    duration: (n) => `«${n}» کے لیے 2–3 گھنٹے کافی۔`,
    weather: (n) => `حائل صحرائی — سردی میں معتدل، گرمی میں گرم۔`,
    general: (n, tip) => `«${n}» کے بارے میں اچھا سوال! ${tip || ''} وقت، تاریخ، کھana، تصویر پوچھیں۔`,
  },
};

const OFFLINE_LANDMARK_TIPS = {
  jubbah_rock: {
    ar: 'موقع فن صخري عالمي (UNESCO) شمال حائل — نقوش تمثّل صيد وحياة قديمة.',
    en: 'a UNESCO rock-art site north of Hail with ancient hunting scenes.',
    fr: 'site d\'art rupestre UNESCO au nord de Hail.',
    ur: 'حائل کے شمال میں UNESCO صخری فن کی سائٹ۔',
  },
  shuwaymis: {
    ar: 'من أقدم مواقع النقوش في الجزيرة — شمال حائل.',
    en: 'one of Arabia\'s earliest rock-art landscapes, north of Hail.',
    fr: 'l\'un des plus anciens sites rupestres d\'Arabie.',
    ur: 'جزیرہ نما عرب کے قدیم ترین صخری مقامات میں سے۔',
  },
  airif_fort: {
    ar: 'قلعة تاريخية في قلب حائل بإطلالة بانorama على المدينة.',
    en: 'a historic fort in central Hail with panoramic city views.',
    fr: 'fort historique au cœur de Hail avec vue panoramique.',
    ur: 'حائل کے مرکز میں تاریخی قلعہ۔',
  },
  qishlah: {
    ar: 'قصر طيني نجدي في وسط حائل — عمارة تراثية أيقونية.',
    en: 'iconic Najdi mud-brick palace in downtown Hail.',
    fr: 'palais en briques de boue najdi au centre de Hail.',
    ur: 'حائل کے مرکز میں نجدی فن تعمیر۔',
  },
  barzan_palace: {
    ar: 'قصر طيني من العصر العثماني — نموذج للعمارة النجدية.',
    en: 'Ottoman-era mud palace — classic Najdi architecture.',
    fr: 'palais en boue de l\'ère ottomane.',
    ur: 'عثمانی دور کا الطین قصر۔',
  },
  aishiyah_palace: {
    ar: 'قصر تراثي يعكس مجالس وسمر حائل القديم.',
    en: 'heritage palace reflecting traditional Hail gatherings.',
    fr: 'palais reflétant les majlis traditionnels de Hail.',
    ur: 'حائل کے روایتی مجلسوں کی عکاسی۔',
  },
  hail_museum: {
    ar: 'مدخل ممتاز لتاريخ وتراث منطقة حائل.',
    en: 'the best gateway to Hail regional history and heritage.',
    fr: 'portail idéal pour l\'histoire de Hail.',
    ur: 'حائل کی تاریخ کا بہترین آغاز۔',
  },
};

function getOfflineChatReply(question, landmarkName, langId = currentLang, landmarkId = currentLandmarkId) {
  const pack = OFFLINE_CHAT[langId] || OFFLINE_CHAT.ar;
  const tip = OFFLINE_LANDMARK_TIPS[landmarkId]?.[langId]
    || OFFLINE_LANDMARK_TIPS[landmarkId]?.ar
    || '';
  const q = question.toLowerCase();

  if (/وقت|متى|when|best time|quand|کتne|season|زيارة|visite|دور|month|موسم|شت|صيف|winter|summer/i.test(q)) return pack.time(landmarkName);
  if (/تاريخ|history|histoire|تاریخ|story|heritage|تراث|patrimoine|قدi|ancient|unesco|نقوش|صخر/i.test(q)) return pack.history(landmarkName, tip);
  if (/طعام|food|مأكول|أكل|أسر|local|product|کھana|restaurant|café|مقه|market|سوق|تمر|kleija|اكل|غد|فطور|عش/i.test(q)) return pack.food(landmarkName);
  if (/وين|أين|اين|where|location|موقع|directions|كيف\s*أ|كيف\s*ا|اوصل|أروح|map|خرائ|GPS|مسار/i.test(q)) return pack.directions(landmarkName);
  if (/مجان|free|gratuit|ticket|تذك|سعر|price|رسوم|fee|دخول|entry|pay|فلوس/i.test(q)) return pack.ticket(landmarkName);
  if (/صور|photo|camera|تصوير|picture|snap|instagram|انست/i.test(q)) return pack.photo(landmarkName);
  if (/عائ|أسرة|أطف|children|family|kids|famille|طفل|baby|ولد/i.test(q)) return pack.family(landmarkName);
  if (/كم\s*(ساع|وقت)|how long|duration|مدة|ساع|وقت\s*الز|stay|visit take/i.test(q)) return pack.duration(landmarkName);
  if (/جو|weather|météo|طقس|hot|cold|حر|barid|rain|مطر|حرار|temperature/i.test(q)) return pack.weather(landmarkName);
  if (/مرح|سلام|hello|hi|هلا|who|من\s*انت|انت\s*مين|help|مساعد/i.test(q)) return pack.general(landmarkName, tip);

  return pack.general(landmarkName, tip);
}

const STORY_CACHE_KEY = 'hakaia_story_cache_v2';

function getStoryCache(landmarkId, langId) {
  try {
    const cache = JSON.parse(localStorage.getItem(STORY_CACHE_KEY) || '{}');
    return cache[`${landmarkId}_${langId}`] || null;
  } catch {
    return null;
  }
}

function setStoryCache(landmarkId, langId, story) {
  try {
    const cache = JSON.parse(localStorage.getItem(STORY_CACHE_KEY) || '{}');
    cache[`${landmarkId}_${langId}`] = story;
    localStorage.setItem(STORY_CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* ignore quota errors */
  }
}

/* ─────────────────────────────────────────────
   🔗 ربط المعالم المكتشفة بمناطق الأعمال المحلية
   ───────────────────────────────────────────── */
const LANDMARK_TO_BUSINESS_KEY = {
  jubbah_rock:     'جبة',
  shuwaymis:       'الشويمس',
  airif_fort:      'قلعة عيرف',
  barzan_palace:   'آثار عامة',
  aishiyah_palace: 'آثار عامة',
  hail_museum:     'آثار عامة',
  qishlah:         'القشلة',
};

/* ─────────────────────────────────────────────
   🏪 الأسر المنتجة والمشاريع المحلية (Mock Data)
   ───────────────────────────────────────────── */
const localBusinesses = {
  'جبة': [
    {
      name: 'مطبخ الجبلين للأكلات الشعبية',
      type: 'أطعمة شعبية',
      distance: '500 متر',
      specialty: 'الكبيبا الحائلية والجريش',
      contact: '+966500000001',
      owner: 'أم أحمد الحائلية',
    },
    {
      name: 'حرفيات جبة للنسيج والسدو',
      type: 'حرف يدوية',
      distance: '1.2 كم',
      specialty: 'سدو يدوي وهدايا تذكارية مستوحاة من النقوش الثمودية',
      contact: '+966500000002',
      owner: 'الأسرة المنتجة - أم مشعل',
    },
  ],
  'الشويمس': [
    {
      name: 'تمور الفيد الفاخرة',
      type: 'منتجات زراعية',
      distance: '800 متر',
      specialty: 'تمر الحلوة (حلوة حائل) الفاخر ودبس التمر الطبيعي',
      contact: '+966500000003',
      owner: 'مزارع أبو صالح',
    },
    {
      name: 'مقهى ومحمصة دلال حائل',
      type: 'مشروبات وضيافة',
      distance: '1.5 كم',
      specialty: 'القهوة السعودية بالهيل والزعفران والتمر المحلي',
      contact: '+966500000004',
      owner: 'شاب ريادي محلي',
    },
  ],
  'قلعة عيرف': [
    {
      name: 'منحوتات عيرف الخشبية',
      type: 'حرف يدوية',
      distance: '300 متر',
      specialty: 'مباخر خشبية وأواني حائلية تراثية منحوتة يدوياً',
      contact: '+966500000005',
      owner: 'الحرفي أبو فهد',
    },
    {
      name: 'عربة شاي الجمر والنعناع الحائلي',
      type: 'فود تراك ومشروبات',
      distance: '150 متر',
      specialty: 'شاي جمر بنعناع حائل المميز وخفايف شعبية',
      contact: '+966500000006',
      owner: 'ريادي أعمال - رائد',
    },
  ],
  'القشلة': [
    {
      name: 'حرفيات القشلة للسدو والنسيج',
      type: 'حرف يدوية',
      distance: '200 متر',
      specialty: 'سدو حائلي تقليدي ووشاحات مطرزة',
      contact: '+966500000008',
      owner: 'أسرة أم سعد',
      lat: 27.511,
      lng: 41.690,
    },
    {
      name: 'مقهى البادية — القشلة',
      type: 'مشروبات وضيافة',
      distance: '350 متر',
      specialty: 'قهوة حائل بالهيل وتمور محلية',
      contact: '+966500000009',
      owner: 'ريادي محلي',
      lat: 27.512,
      lng: 41.691,
    },
  ],
  'آثار عامة': [
    {
      name: 'متجر تراث حائل الرقمي',
      type: 'هدايا تذكارية',
      distance: 'متاح للتوصيل الفوري للموقع',
      specialty: 'قطع تراثية مصغرة تعبر عن هوية حائل',
      contact: '+966500000007',
      owner: 'جمعية الأسر المنتجة بحائل',
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   DOM References
   ═══════════════════════════════════════════════════════════════ */
const DOM = {
  cameraFeed:         document.getElementById('cameraFeed'),
  uploadPreview:      document.getElementById('uploadPreview'),
  captureCanvas:      document.getElementById('captureCanvas'),
  cameraPlaceholder:  document.getElementById('cameraPlaceholder'),
  cameraOverlay:      document.getElementById('cameraOverlay'),
  overlayMessage:     document.getElementById('overlayMessage'),
  visionBadgeOverlay: document.getElementById('visionBadgeOverlay'),
  visionEngineLabel:  document.getElementById('visionEngineLabel'),
  btnStartCamera:     document.getElementById('btnStartCamera'),
  btnCapture:         document.getElementById('btnCapture'),
  imageUpload:        document.getElementById('imageUpload'),
  statusMessage:      document.getElementById('statusMessage'),
  journeyList:        document.getElementById('journeyList'),
  resultSection:      document.getElementById('resultSection'),
  capturedImage:      document.getElementById('capturedImage'),
  landmarkName:       document.getElementById('landmarkName'),
  landmarkConfidence: document.getElementById('landmarkConfidence'),
  confidenceBar:      document.getElementById('confidenceBar'),
  confidenceFill:     document.getElementById('confidenceFill'),
  storySection:       document.getElementById('storySection'),
  storyText:          document.getElementById('storyText'),
  storyLoading:       document.getElementById('storyLoading'),
  btnPlaySpeech:      document.getElementById('btnPlaySpeech'),
  btnPauseSpeech:     document.getElementById('btnPauseSpeech'),
  btnStopSpeech:        document.getElementById('btnStopSpeech'),
  chatSection:        document.getElementById('chatSection'),
  chatMessages:       document.getElementById('chatMessages'),
  chatForm:           document.getElementById('chatForm'),
  chatInput:          document.getElementById('chatInput'),
  servicesSection:    document.getElementById('servicesSection'),
  servicesGrid:       document.getElementById('servicesGrid'),
  langSelect:         document.getElementById('langSelect'),
};

/* ═══════════════════════════════════════════════════════════════
   State
   ═══════════════════════════════════════════════════════════════ */
let cameraStream = null;
let classifier = null;
let modelReady = false;
let currentStory = '';
let currentLandmarkId = null;
let currentLandmarkName = null;
let geminiClient = null;
let speechPaused = false;
let hasUploadedImage = false;
let chatHistory = [];

function setJourneyStep(step) {
  DOM.journeyList?.querySelectorAll('.journey-step').forEach(el => {
    const n = Number(el.dataset.step);
    el.classList.toggle('active', n === step);
    el.classList.toggle('done', n < step);
  });
}

function updateCameraBtnLabel() {
  const span = DOM.btnStartCamera?.querySelector('[data-i18n="btnStartCamera"]');
  if (span) span.textContent = cameraStream ? t('btnStartCameraActive') : t('btnStartCamera');
}

/** تهيئة عميل Gemini (lazy — يُنشأ عند أول طلب) */
function getGeminiClient() {
  if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('GEMINI_API_KEY غير مضبوط في CONFIG — ضع مفتاحك من Google AI Studio');
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: CONFIG.GEMINI_API_KEY });
    console.info('[حكايا حائل] Gemini client initialized (@google/genai)');
  }
  return geminiClient;
}

/* ═══════════════════════════════════════════════════════════════
   1️⃣  تهيئة التطبيق
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  DOM.btnStartCamera.addEventListener('click', startCamera);
  DOM.btnCapture.addEventListener('click', captureAndAnalyze);
  DOM.btnPlaySpeech?.addEventListener('click', () => speakText(currentStory));
  DOM.btnPauseSpeech?.addEventListener('click', pauseSpeech);
  DOM.btnStopSpeech?.addEventListener('click', stopSpeech);
  DOM.imageUpload?.addEventListener('change', handleImageUpload);
  DOM.chatForm?.addEventListener('submit', (e) => { e.preventDefault(); sendChatMessage(); });
  DOM.langSelect.addEventListener('change', onLanguageChange);

  if (DOM.visionEngineLabel) DOM.visionEngineLabel.textContent = CONFIG.VISION_ENGINE;
  setJourneyStep(1);
  applyLanguage(currentLang, false);
  initClassifier();
  checkConfig();

  initPlatform({
    t,
    getLang,
    getGeminiClient,
    CONFIG,
    LANDMARKS,
    getLandmarkName,
    get currentLandmarkId() { return currentLandmarkId; },
    callGeminiRoute,
  });
});

/** تطبيق اللغة على الواجهة */
function applyLanguage(langId, save = true) {
  if (!LANGUAGES[langId]) langId = 'ar';
  currentLang = langId;
  if (save) localStorage.setItem('hakaia_lang', langId);

  const lang = getLang();
  document.documentElement.lang = lang.htmlLang;
  document.documentElement.dir = lang.dir;
  DOM.langSelect.value = langId;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = lang.ui[key];
    if (typeof val === 'string') {
      if (key === 'footer') el.innerHTML = val;
      else el.textContent = val;
    }
  });

  if (DOM.chatInput) DOM.chatInput.placeholder = t('chatPlaceholder');
  updateCameraBtnLabel();
  document.querySelector('#storyLoading span').textContent = t('storyLoading');
  document.title = t('pageTitle');
  if (DOM.visionEngineLabel) DOM.visionEngineLabel.textContent = t('visionBadge');
  refreshPlatformLanguage();
  updateLandmarkUI();
}

function updateLandmarkUI() {
  if (!currentLandmarkId) return;
  const name = getLandmarkName(currentLandmarkId);
  currentLandmarkName = name;
  if (DOM.landmarkName) DOM.landmarkName.textContent = name;
}

/** عند تغيير اللغة — تحديث الواجهة وإعادة القصة إن وُجدت */
async function onLanguageChange() {
  stopSpeech();
  applyLanguage(DOM.langSelect.value);
  if (currentLandmarkId) {
    updateLandmarkUI();
    initChatForLandmark(currentLandmarkName);
    await fetchAndTellStory(currentLandmarkName);
    renderLocalServices(currentLandmarkId);
  }
}

/** تحذيرات الإعداد */
function checkConfig() {
  if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    setStatus(t('configApiKeyWarning'), 'error');
  } else {
    console.info('[حكايا حائل] Gemini model:', CONFIG.GEMINI_MODEL);
  }
  if (CONFIG.DEMO_MODE && !CONFIG.TEACHABLE_MACHINE_MODEL_URL) {
    console.info('[حكايا حائل] وضع DEMO مفعّل — سيُستخدم معلم تجريبي عند التقاط الصورة.');
  }
}

/* ═══════════════════════════════════════════════════════════════
   2️⃣  الكاميرا
   ═══════════════════════════════════════════════════════════════ */
async function startCamera() {
  try {
    setStatus(t('statusCameraRequest'));
    setJourneyStep(1);

    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });

    DOM.cameraFeed.srcObject = cameraStream;
    DOM.cameraPlaceholder.classList.add('hidden');
    DOM.visionBadgeOverlay?.classList.remove('hidden');
    DOM.btnCapture.disabled = !modelReady && !CONFIG.DEMO_MODE;
    updateCameraBtnLabel();
    DOM.btnStartCamera.disabled = true;

    setStatus(t('statusCameraReady'), 'success');
  } catch (err) {
    console.error('Camera error:', err);
    setStatus(t('statusCameraError'), 'error');
  }
}

function enableCaptureIfReady() {
  if (modelReady && (cameraStream || hasUploadedImage)) {
    DOM.btnCapture.disabled = false;
  }
}

async function waitForModel(timeoutMs = 45000) {
  if (modelReady) return;
  setStatus(t('statusModelLoading'), 'success');
  const deadline = Date.now() + timeoutMs;
  while (!modelReady && Date.now() < deadline) {
    await delay(250);
  }
  if (!modelReady) throw new Error('Classifier not ready');
}

function initClassifier() {
  if (CONFIG.TEACHABLE_MACHINE_MODEL_URL) {
    const modelURL = CONFIG.TEACHABLE_MACHINE_MODEL_URL;
    classifier = ml5.imageClassifier(modelURL + 'model.json', () => {
      modelReady = true;
      enableCaptureIfReady();
      DOM.visionBadgeOverlay?.classList.remove('hidden');
      setStatus(t('statusModelReady'), 'success');
    });
  } else if (CONFIG.DEMO_MODE) {
    modelReady = true;
    enableCaptureIfReady();
    console.info('[حكايا حائل] DEMO mode — classifier skipped.');
  } else {
    classifier = ml5.imageClassifier('MobileNet', () => {
      modelReady = true;
      enableCaptureIfReady();
      setStatus(t('statusModelReadyMobile'), 'success');
    });
  }
}

function captureFrame() {
  const video = DOM.cameraFeed;
  const canvas = DOM.captureCanvas;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.85);
}

async function handleImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  setJourneyStep(1);
  showOverlay(t('overlayCapture'));

  const img = new Image();
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  img.onload = async () => {
    const canvas = DOM.captureCanvas;
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0);
    DOM.capturedImage.src = dataUrl;
    DOM.uploadPreview.src = dataUrl;
    DOM.uploadPreview.classList.remove('hidden');
    DOM.cameraPlaceholder.classList.add('hidden');
    DOM.visionBadgeOverlay?.classList.remove('hidden');
    hasUploadedImage = true;
    enableCaptureIfReady();
    try {
      await waitForModel();
      await analyzeCurrentImage(dataUrl);
    } catch (err) {
      hideOverlay();
      console.error('Upload analysis error:', err);
      setStatus(err.message === 'Classifier not ready'
        ? t('statusClassifierNotReady')
        : t('statusAnalysisError'), 'error');
    }
  };
  img.onerror = () => {
    hideOverlay();
    setStatus(t('statusAnalysisError'), 'error');
  };
  img.src = dataUrl;
  event.target.value = '';
}

async function captureAndAnalyze() {
  if (!cameraStream && !hasUploadedImage) {
    setStatus(t('statusNeedCamera'), 'error');
    return;
  }

  setJourneyStep(1);
  showOverlay(t('overlayCapture'));
  const imageDataUrl = cameraStream ? captureFrame() : DOM.capturedImage.src;
  if (cameraStream) DOM.capturedImage.src = imageDataUrl;
  await analyzeCurrentImage(imageDataUrl);
}

async function analyzeCurrentImage(imageDataUrl) {
  try {
    await waitForModel();
    let landmarkId, confidence, labelRaw;

    if (CONFIG.DEMO_MODE && !CONFIG.TEACHABLE_MACHINE_MODEL_URL) {
      await delay(1200);
      const keys = Object.keys(LANDMARKS);
      landmarkId = keys[Math.floor(Math.random() * keys.length)];
      confidence = 0.92;
      labelRaw = LANDMARKS[landmarkId].nameAr;
      showOverlay(t('overlayDemo'));
    } else {
      showOverlay(t('overlayAnalyze'));
      setJourneyStep(2);
      const results = await classifyImage(DOM.captureCanvas);
      const top = results[0];
      labelRaw = top.label;
      confidence = top.confidence;
      landmarkId = mapLabelToLandmark(labelRaw);
    }

    hideOverlay();

    if (!landmarkId) {
      setStatus(t('statusUnrecognized', labelRaw), 'error');
      return;
    }

    await showRecognitionResult(landmarkId, confidence, imageDataUrl);
  } catch (err) {
    hideOverlay();
    console.error('Analysis error:', err);
    setStatus(t('statusAnalysisError'), 'error');
  }
}

async function showRecognitionResult(landmarkId, confidence, imageDataUrl) {
  currentLandmarkId = landmarkId;
  const landmark = LANDMARKS[landmarkId];
  currentLandmarkName = getLandmarkName(landmark);

  DOM.capturedImage.src = imageDataUrl;
  DOM.landmarkName.textContent = currentLandmarkName;
  DOM.landmarkConfidence.textContent = t('confidence', (confidence * 100).toFixed(0));
  DOM.confidenceBar?.classList.remove('hidden');
  if (DOM.confidenceFill) DOM.confidenceFill.style.width = `${Math.min(confidence * 100, 100)}%`;

  DOM.resultSection.classList.remove('hidden');
  setJourneyStep(2);
  setStatus(t('statusRecognized', currentLandmarkName), 'success');

  initChatForLandmark(currentLandmarkName);
  await fetchAndTellStory(currentLandmarkName);
  renderLocalServices(landmarkId);
  onLandmarkScanned(landmarkId);
  setJourneyStep(4);
}

/** تصنيف باستخدام ml5 */
function classifyImage(canvas) {
  return new Promise((resolve, reject) => {
    if (!classifier) {
      reject(new Error('Classifier not ready'));
      return;
    }
    classifier.classify(canvas, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

/** ربط تسمية النموذج بمعلم من قاعدة البيانات */
function mapLabelToLandmark(label) {
  const normalized = label.toLowerCase().trim();
  for (const [id, data] of Object.entries(LANDMARKS)) {
    if (normalized.includes(id.replace('_', ' '))) return id;
    for (const alias of data.aliases) {
      if (normalized.includes(alias.toLowerCase())) return id;
    }
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════════
   4️⃣  Gemini API — @google/genai (مباشرة من المتصفح)
   ═══════════════════════════════════════════════════════════════ */

/** استخراج النص الكامل من رد Gemini (قد يأتي على أكثر من part) */
function extractGeminiText(response) {
  const direct = response?.text?.trim();
  if (direct && direct.length > 20) return direct;

  const parts = response?.candidates?.[0]?.content?.parts
    || response?.response?.candidates?.[0]?.content?.parts
    || [];
  const chunks = parts
    .filter(p => p?.text && !p?.thought)
    .map(p => p.text);
  const joined = (chunks.length ? chunks : parts.map(p => p?.text).filter(Boolean)).join('').trim();
  return joined || direct || '';
}

function isTruncatedReply(text) {
  if (!text || text.length < 20) return true;
  return /[،,.]\s?[ء-يA-Za-z]{1,2}$/.test(text.trim());
}

/** تسجيل تفاصيل الخطأ في Console للتشخيص */
function logGeminiError(error, context = {}) {
  console.group('[حكايا حائل] ❌ Gemini Error Details');
  console.error('Message:', error?.message ?? String(error));
  console.error('Name:', error?.name);
  if (error?.status) console.error('HTTP Status:', error.status);
  if (error?.statusText) console.error('Status Text:', error.statusText);
  if (error?.errorDetails) console.error('Error Details:', error.errorDetails);
  if (error?.cause) console.error('Cause:', error.cause);
  console.error('Context:', context);
  console.error('Full Error Object:', error);
  console.groupEnd();
}

/** تحويل الخطأ إلى رسالة مفهومة للمستخدم */
function getGeminiUserMessage(error) {
  const msg = (error?.message ?? '').toLowerCase();
  const status = error?.status;

  if (msg.includes('api key') || status === 401 || status === 403) {
    return t('geminiErrorApiKey');
  }
  if (status === 429 || msg.includes('quota') || msg.includes('resource_exhausted')) {
    return t('geminiErrorQuota');
  }
  if (msg.includes('not found') || status === 404) {
    return t('geminiErrorModel', CONFIG.GEMINI_MODEL);
  }
  if (msg.includes('failed to fetch') || msg.includes('network')) {
    return t('geminiErrorNetwork');
  }
  if (msg.includes('cors')) {
    return t('geminiErrorCors');
  }
  return t('geminiErrorGeneric', error?.message);
}

function showStory(story) {
  currentStory = story;
  DOM.storySection.classList.remove('hidden');
  DOM.storyText.textContent = story;
  DOM.storyLoading.classList.add('hidden');
  DOM.chatSection?.classList.remove('hidden');
  setJourneyStep(3);
  speakText(story);
}

function initChatForLandmark(landmarkName) {
  chatHistory = [];
  if (!DOM.chatMessages) return;
  DOM.chatMessages.innerHTML = '';
  appendChatMessage('bot', t('chatWelcome', landmarkName));
}

function appendChatMessage(role, text) {
  if (!DOM.chatMessages) return;
  const msg = document.createElement('div');
  msg.className = `chat-msg ${role}`;
  msg.textContent = text;
  DOM.chatMessages.appendChild(msg);
  DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
}

async function sendChatMessage() {
  const question = DOM.chatInput?.value?.trim();
  if (!question || !currentLandmarkName) return;

  DOM.chatInput.value = '';
  appendChatMessage('user', question);

  const loadingEl = document.createElement('div');
  loadingEl.className = 'chat-msg bot loading';
  loadingEl.textContent = t('chatThinking');
  DOM.chatMessages.appendChild(loadingEl);
  DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;

  try {
    const reply = await callGeminiChat(question, currentLandmarkName);
    if (isTruncatedReply(reply)) throw new Error('Truncated Gemini chat response');
    loadingEl.remove();
    appendChatMessage('bot', reply);
  } catch (err) {
    loadingEl.remove();
    logGeminiError(err, { chat: true, landmark: currentLandmarkName });
    const offline = getOfflineChatReply(question, currentLandmarkName, currentLang, currentLandmarkId);
    appendChatMessage('bot', offline);
    setStatus(t('chatOfflineNotice'), 'success');
  }
}

async function callGeminiChat(question, landmarkName) {
  const lang = getLang();
  const system = `${lang.systemPrompt}\n\n${lang.chatContextSuffix(landmarkName)}`;

  // Prefer server proxy (avoids CORS, keeps key on server)
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, systemInstruction: system }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    if (data.reply?.trim()) {
      const reply = data.reply.trim();
      if (isTruncatedReply(reply)) throw new Error('Truncated Gemini chat response');
      return reply;
    }
    throw new Error('Empty chat response');
  } catch (proxyErr) {
    console.warn('[حكايا حائل] Chat proxy failed, trying direct SDK:', proxyErr.message);
  }

  const ai = getGeminiClient();
  const modelsToTry = [CONFIG.GEMINI_MODEL, ...CONFIG.GEMINI_FALLBACK_MODELS];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: question,
        config: {
          systemInstruction: system,
          temperature: 0.75,
          maxOutputTokens: 1024,
        },
      });
      const text = extractGeminiText(response);
      if (text) return text;
      throw new Error(`Empty response from model "${model}"`);
    } catch (err) {
      lastError = err;
      if (err?.status === 429) throw err;
      const retryable = err?.status === 404 || err?.status === 503;
      if (retryable && model !== modelsToTry[modelsToTry.length - 1]) continue;
      throw err;
    }
  }

  throw lastError || new Error('Chat failed');
}

function pauseSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause();
    speechPaused = true;
  }
}

function stopSpeech() {
  if ('speechSynthesis' in window) {
    speechRequestId++;
    window.speechSynthesis.cancel();
    speechPaused = false;
  }
}

async function fetchAndTellStory(landmarkName) {
  DOM.storySection.classList.remove('hidden');
  DOM.storyLoading.classList.remove('hidden');
  DOM.storyText.textContent = '';

  const custom = currentLandmarkId ? getCustomStory(currentLandmarkId, currentLang) : null;
  if (custom) {
    showStory(custom);
    setStatus(t('customStoryNotice'), 'success');
    return;
  }

  const cached = currentLandmarkId ? getStoryCache(currentLandmarkId, currentLang) : null;
  if (cached) {
    showStory(cached);
    return;
  }

  try {
    const story = await callGeminiAPI(landmarkName);
    if (isTruncatedReply(story)) throw new Error('Truncated Gemini story response');
    if (currentLandmarkId) setStoryCache(currentLandmarkId, currentLang, story);
    showStory(story);
  } catch (err) {
    DOM.storyLoading.classList.add('hidden');
    logGeminiError(err, { landmarkName, model: CONFIG.GEMINI_MODEL });

    const offline = currentLandmarkId ? getOfflineStory(currentLandmarkId, currentLang) : null;
    showStory(offline || t('fallbackStory', landmarkName));
    setStatus(offline ? t('offlineStoryNotice') : getGeminiUserMessage(err), offline ? 'success' : 'error');
  }
}

/** استدعاء Gemini — القصة والصوت حسب اللغة المختارة (حائلية عند العربية) */
async function callGeminiAPI(landmarkName) {
  const ai = getGeminiClient();
  const lang = getLang();
  const userPrompt = lang.storyPrompt(landmarkName);
  const modelsToTry = [CONFIG.GEMINI_MODEL, ...CONFIG.GEMINI_FALLBACK_MODELS];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      console.info(`[حكايا حائل] Calling Gemini model: ${model}`);

      const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction: lang.systemPrompt,
          temperature: 0.85,
          maxOutputTokens: 1024,
        },
      });

      const text = extractGeminiText(response);
      if (!text) {
        throw new Error(`Empty response from model "${model}"`);
      }

      console.info(`[حكايا حائل] ✓ Story received (${text.length} chars) from ${model}`);
      return text;

    } catch (err) {
      lastError = err;
      logGeminiError(err, { landmarkName, model, attempt: modelsToTry.indexOf(model) + 1 });

      // 429 = نفس الحصة لكل النماذج — لا فائدة من إعادة المحاولة
      if (err?.status === 429) throw err;

      const retryable = err?.status === 404 || err?.status === 503;
      if (retryable && model !== modelsToTry[modelsToTry.length - 1]) {
        console.warn(`[حكايا حائل] Retrying with next model...`);
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

/* ═══════════════════════════════════════════════════════════════
   5️⃣  Web Speech API — نطق القصة (مجاني)
   ═══════════════════════════════════════════════════════════════ */
let speechRequestId = 0;

function ensureSpeechVoices() {
  return new Promise((resolve) => {
    if (window.speechSynthesis.getVoices().length) {
      resolve();
      return;
    }
    const onVoices = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
      resolve();
    };
    window.speechSynthesis.addEventListener('voiceschanged', onVoices);
    setTimeout(resolve, 350);
  });
}

function pickSpeechVoice(speechLang) {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const base = speechLang.split('-')[0];
  return (
    voices.find(v => v.lang === speechLang) ||
    voices.find(v => v.lang.startsWith(`${base}-`)) ||
    voices.find(v => v.lang.startsWith(base)) ||
    null
  );
}

function splitForSpeech(text) {
  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  if (paragraphs.length > 1) return paragraphs;
  if (text.length <= 280) return [text];
  const sentences = text.match(/[^.!?؟…]+[.!?؟…]+/g);
  return sentences?.map(s => s.trim()).filter(Boolean) ?? [text];
}

function speakChunk(text, lang, voice) {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang.speechLang;
    utterance.rate = CONFIG.SPEECH.rate;
    utterance.pitch = CONFIG.SPEECH.pitch;
    if (voice) utterance.voice = voice;
    utterance.onend = () => resolve();
    utterance.onerror = (event) => {
      console.warn('[حكايا حائل] Speech error:', event.error);
      resolve();
    };
    window.speechSynthesis.speak(utterance);
  });
}

async function speakText(text) {
  if (!text || !('speechSynthesis' in window)) {
    console.warn('Web Speech API not supported');
    return;
  }

  if (speechPaused && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    speechPaused = false;
    return;
  }

  const requestId = ++speechRequestId;
  await ensureSpeechVoices();
  if (requestId !== speechRequestId) return;

  window.speechSynthesis.cancel();
  await delay(120);
  if (requestId !== speechRequestId) return;

  const lang = getLang();
  const voice = pickSpeechVoice(lang.speechLang);
  const chunks = splitForSpeech(text);

  for (const chunk of chunks) {
    if (requestId !== speechRequestId) return;
    await speakChunk(chunk, lang, voice);
    await delay(80);
  }
}

// تحميل قائمة الأصوات (Chrome يحتاج هذا)
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

/* ═══════════════════════════════════════════════════════════════
   6️⃣  بطاقات الأسر المنتجة والمشاريع المحلية
   ═══════════════════════════════════════════════════════════════ */

/** أيقونة ولون حسب نوع النشاط */
const BUSINESS_TYPE_META = {
  'أطعمة شعبية':       { icon: 'fa-utensils', cssClass: 'food' },
  'حرف يدوية':         { icon: 'fa-palette', cssClass: 'crafts' },
  'منتجات زراعية':     { icon: 'fa-seedling', cssClass: 'agriculture' },
  'مشروبات وضيافة':    { icon: 'fa-mug-hot', cssClass: 'drinks' },
  'فود تراك ومشروبات': { icon: 'fa-truck', cssClass: 'food-truck' },
  'هدايا تذكارية':     { icon: 'fa-gift', cssClass: 'gifts' },
};

function mapsUrl(biz) {
  if (biz.lat && biz.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${biz.lat},${biz.lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(biz.name + ' ' + t('mapsCity'))}`;
}

/** فلترة الأعمال حسب المعلم المكتشف */
function getBusinessesForLandmark(landmarkId) {
  const regionKey = LANDMARK_TO_BUSINESS_KEY[landmarkId] || 'آثار عامة';
  const regional = localBusinesses[regionKey] || [];
  const general = localBusinesses['آثار عامة'] || [];

  // للمعالم المحددة: نعرض أعمال المنطقة + متجر التراث الرقمي (توصيل فوري)
  if (regionKey !== 'آثار عامة') {
    return [...regional, ...general];
  }
  return general;
}

function renderLocalServices(landmarkId) {
  const businesses = getBusinessesForLandmark(landmarkId);
  const regionKey = LANDMARK_TO_BUSINESS_KEY[landmarkId] || 'آثار عامة';

  DOM.servicesGrid.innerHTML = '';

  if (businesses.length === 0) {
    DOM.servicesSection.classList.add('hidden');
    return;
  }

  DOM.servicesSection.classList.remove('hidden');

  // عنوان فرعي يوضح المنطقة
  const regionLabel = document.createElement('p');
  regionLabel.className = 'services-region-label';
  regionLabel.textContent = regionKey === 'آثار عامة'
    ? t('servicesNearGeneral')
    : t('servicesNear', translateRegion(regionKey), businesses.length);
  DOM.servicesGrid.appendChild(regionLabel);

  businesses.forEach((biz, index) => {
    const b = translateBusiness(biz, currentLang);
    const meta = BUSINESS_TYPE_META[biz.type] || { icon: 'fa-store', cssClass: 'default' };
    const card = document.createElement('article');
    card.className = 'service-card';
    card.style.animationDelay = `${index * 0.08}s`;
    card.innerHTML = `
      <span class="service-type ${meta.cssClass}"><i class="fa-solid ${meta.icon}"></i> ${translateBusinessType(biz.type)}</span>
      <h4>${b.name}</h4>
      <p class="service-specialty">${b.specialty}</p>
      <p class="service-owner"><i class="fa-solid fa-user"></i> ${b.owner}</p>
      <div class="service-meta">
        <span class="service-distance"><i class="fa-solid fa-location-dot"></i> ${b.distance === 'متاح للتوصيل الفوري للموقع' ? t('deliveryInstant') : b.distance}</span>
      </div>
      <div class="service-actions">
        <a href="tel:${biz.contact.replace(/\s/g, '')}" class="service-btn call">
          <i class="fa-solid fa-phone"></i> ${t('callNow')}
        </a>
        <a href="${mapsUrl(biz)}" target="_blank" rel="noopener" class="service-btn map">
          <i class="fa-solid fa-route"></i> ${t('btnDirections')}
        </a>
        <button type="button" class="service-btn order" data-order-index="${index}">
          <i class="fa-solid fa-cart-shopping"></i> ${t('btnOrder')}
        </button>
      </div>
    `;
    DOM.servicesGrid.appendChild(card);
  });

  DOM.servicesGrid.querySelectorAll('[data-order-index]').forEach(btn => {
    btn.addEventListener('click', () => switchTab('marketplace'));
  });
}

/* ═══════════════════════════════════════════════════════════════
   🛠️  أدوات مساعدة
   ═══════════════════════════════════════════════════════════════ */
function setStatus(msg, type = '') {
  DOM.statusMessage.textContent = msg;
  DOM.statusMessage.className = 'status-message' + (type ? ` ${type}` : '');
}

function showOverlay(msg) {
  DOM.overlayMessage.textContent = msg;
  DOM.cameraOverlay.classList.remove('hidden');
}

function hideOverlay() {
  DOM.cameraOverlay.classList.add('hidden');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** توليد مسار سياحي عبر Gemini */
async function callGeminiRoute(duration, interests) {
  const ai = getGeminiClient();
  const lang = getLang();
  const prompt = lang.routePrompt(duration, interests);

  const response = await ai.models.generateContent({
    model: CONFIG.GEMINI_MODEL,
    contents: prompt,
    config: { temperature: 0.7, maxOutputTokens: 600 },
  });

  const text = response?.text?.trim() || '';
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return null;
  return JSON.parse(match[0]);
}
