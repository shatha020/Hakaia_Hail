/**
 * حكايا حائل — platform.js
 * السوق، المسارات، الإنجازات، لوحة الأثر، الدفع
 */

import { getProductLabels, getRouteStops } from './locale-data.js';
import { badgeLabel, badgeDesc } from './i18n.js';

const PLATFORM_CONFIG = {
  COMMISSION_RATE: 0.05,
  BADGES_FOR_COUPON: 5,
  COUPON_DISCOUNT: 10,
  STATS_KEY: 'hakaia_platform_stats_v1',
  BADGES_KEY: 'hakaia_badges_v1',
  COUPON_KEY: 'hakaia_coupon_v1',
};

/* ── منتجات السوق (Mock) ── */
export const MARKETPLACE_PRODUCTS = [
  { id: 'p1', name: 'سدو يدوي — نقوش جبة', family: 'حرفيات جبة', price: 350, rating: 4.9, region: 'جبة', type: 'حرف يدوية', featured: true, emoji: '🧶', landmark: 'jubbah_rock' },
  { id: 'p2', name: 'فخار حائل التقليدي', family: 'أسرة أم سعد', price: 120, rating: 4.7, region: 'القشلة', type: 'حرف يدوية', featured: false, emoji: '🏺', landmark: 'qishlah' },
  { id: 'p3', name: 'كليجا حائل بالتمر', family: 'مطبخ الجبلين', price: 45, rating: 4.8, region: 'جبة', type: 'مأكولات', featured: true, emoji: '🍪', landmark: 'jubbah_rock' },
  { id: 'p4', name: 'تمر حلوة حائل فاخر', family: 'تمور الفيد', price: 85, rating: 5.0, region: 'الشويمس', type: 'منتجات زراعية', featured: false, emoji: '🌴', landmark: 'shuwaymis' },
  { id: 'p5', name: 'مبخرة خشبية منحوتة', family: 'منحوتات عيرف', price: 95, rating: 4.6, region: 'قلعة عيرف', type: 'حرف يدوية', featured: false, emoji: '🪵', landmark: 'airif_fort' },
  { id: 'p6', name: 'قهوة حائل بالزعفران', family: 'دلال حائل', price: 55, rating: 4.8, region: 'الشويمس', type: 'مشروبات', featured: true, emoji: '☕', landmark: 'shuwaymis' },
  { id: 'p7', name: 'وشاح سدو مطرّز', family: 'حرفيات القشلة', price: 280, rating: 4.9, region: 'القشلة', type: 'حرف يدوية', featured: false, emoji: '🧣', landmark: 'qishlah' },
  { id: 'p8', name: 'حمضيات حائل المجفّفة', family: 'مزارع وادي حائل', price: 40, rating: 4.5, region: 'حائل', type: 'منتجات زراعية', featured: false, emoji: '🍊', landmark: null },
];

export const BADGE_DEFS = {
  jubbah_rock: {
    id: 'jubbah_rock', nameAr: 'مستكشف جبة', nameEn: 'Jubbah Explorer',
    icon: 'fa-mountain', color: '#c5a059',
    descAr: 'يُمنح عند مسح نقوش جبة الصخرية بالكاميرا. أنت من أوائل من اكتشفوا هذا الموقع العالمي للفن الصخري.',
    descEn: 'Awarded when you scan Jubbah Rock Art. You explored one of Arabia\'s greatest open-air heritage sites.',
  },
  shuwaymis: {
    id: 'shuwaymis', nameAr: 'مؤرخ الشويمس', nameEn: 'Shuwaymis Historian',
    icon: 'fa-scroll', color: '#0c6f6e',
    descAr: 'يُمنح عند التعرف على آثار الشويمس. وسام لمن يحمل معرفة تاريخ النقوش والكتابة الأولى في المنطقة.',
    descEn: 'Awarded when Shuwaymis is recognized. For explorers who uncover the region\'s ancient rock history.',
  },
  airif_fort: {
    id: 'airif_fort', nameAr: 'حارس عيرف', nameEn: 'Airif Guardian',
    icon: 'fa-fort-awesome', color: '#3e2723',
    descAr: 'يُمنح عند مسح قلعة عيرف. شارة لمن وقف على أسوار حائل التاريخية واستمع لقصتها.',
    descEn: 'Awarded when Airif Fort is scanned. For guardians of Hail\'s historic fortress legacy.',
  },
  barzan_palace: {
    id: 'barzan_palace', nameAr: 'ضيف برزان', nameEn: 'Barzan Guest',
    icon: 'fa-landmark', color: '#7a5c20',
    descAr: 'يُمنح عند مسح قصر برزان. وسام ضيافة في قلب العمارة النجدية التراثية.',
    descEn: 'Awarded when Barzan Palace is scanned. A guest badge of Najdi heritage architecture.',
  },
  aishiyah_palace: {
    id: 'aishiyah_palace', nameAr: 'سامر العشية', nameEn: 'Aishiyah Storyteller',
    icon: 'fa-moon', color: '#5c4080',
    descAr: 'يُمنح عند مسح قصر العشية. للمستكشفين الذين عاشوا أجواء المجالس والسمر التراثي.',
    descEn: 'Awarded when Aishiyah Palace is scanned. For those who feel the spirit of heritage gatherings.',
  },
  hail_museum: {
    id: 'hail_museum', nameAr: 'باحث المتحف', nameEn: 'Museum Scholar',
    icon: 'fa-building-columns', color: '#095654',
    descAr: 'يُمنح عند مسح متحف حائل. بداية رحلة التعلّم عن تراث وتاريخ المنطقة.',
    descEn: 'Awarded when Hail Museum is scanned. Your first step into the region\'s living history.',
  },
  qishlah: {
    id: 'qishlah', nameAr: 'فارس القشلة', nameEn: 'Qishlah Knight',
    icon: 'fa-chess-rook', color: '#9e4a28',
    descAr: 'يُمنح عند مسح قصر القشلة. وسام شرف لزوار هذا الصرح التاريخي في قلب حائل.',
    descEn: 'Awarded when Qishlah Palace is scanned. An honor badge for visitors of this historic landmark.',
  },
};

const OFFLINE_ROUTES = {
  '6h-آثار': [
    { time: '08:00', title: 'نقوش جبة الصخرية', type: 'آثار', desc: 'جولة في أكبر متحف صخري مفتوح' },
    { time: '10:30', title: 'مطبخ الجبلين — غداء', type: 'مأكولات', desc: 'كبيبا حائلية وأطباق شعبية' },
    { time: '12:00', title: 'حرفيات جبة — سوق محلي', type: 'تسوق', desc: 'سدو يدوي وهدايا تذكارية' },
    { time: '14:00', title: 'قلعة عيرف', type: 'آثار', desc: 'إطلالة بانorama على حائل' },
    { time: '16:00', title: 'مقهى البادية — استراحة', type: 'مقهى', desc: 'قهوة بالهيل وتمور محلية' },
  ],
  '1d-مغامرات': [
    { time: '06:00', title: 'انطلاق — آثار الشويمس', type: 'آثار', desc: 'استكشاف النقوش الصخرية' },
    { time: '09:00', title: 'فطور بدوي — تمور الفيد', type: 'مأكولات', desc: 'تمر حلوة حائل وقهوة' },
    { time: '11:00', title: 'تخييم معتمد — وادي حائل', type: 'مغامرة', desc: 'تجربة بدوية أصيلة' },
    { time: '15:00', title: 'جولة صحراوية', type: 'مغامرة', desc: 'ركوب جمال ومشاهدة الغروب' },
    { time: '19:00', title: 'عشاء تراثي', type: 'مأكولات', desc: 'جريش ومرقوق حائلية' },
  ],
  default: [
    { time: '09:00', title: 'متحف حائل الإقليمي', type: 'آثار', desc: 'مدخل لتاريخ المنطقة' },
    { time: '11:00', title: 'قصر القشلة', type: 'آثار', desc: 'عمارة نجدية تراثية' },
    { time: '13:00', title: 'غداء — أسر منتجة', type: 'مأكولات', desc: 'منتجات محلية معتمدة' },
    { time: '15:00', title: 'سوق حائل الذكي', type: 'تسوق', desc: 'حرف يدوية ومأكولات' },
    { time: '17:00', title: 'قهوة واسترخاء', type: 'استرخاء', desc: 'مقهى محلي بجوار المعلم' },
  ],
};

/* ── Stats & Storage ── */
function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(PLATFORM_CONFIG.STATS_KEY) || '{}');
  } catch { return {}; }
}

function saveStats(stats) {
  localStorage.setItem(PLATFORM_CONFIG.STATS_KEY, JSON.stringify(stats));
}

export function getStats() {
  const defaults = {
    scans: 847,
    salesTotal: 12450,
    orders: 156,
    landmarkVisits: { jubbah_rock: 312, shuwaymis: 198, airif_fort: 145, qishlah: 89, barzan_palace: 56, hail_museum: 34, aishiyah_palace: 13 },
    sentiment: { positive: 87, neutral: 10, negative: 3 },
  };
  const saved = loadStats();
  return { ...defaults, ...saved, landmarkVisits: { ...defaults.landmarkVisits, ...saved.landmarkVisits } };
}

export function recordScan(landmarkId) {
  const stats = getStats();
  stats.scans = (stats.scans || 0) + 1;
  stats.landmarkVisits = stats.landmarkVisits || {};
  stats.landmarkVisits[landmarkId] = (stats.landmarkVisits[landmarkId] || 0) + 1;
  saveStats(stats);
}

export function recordSale(amount) {
  const stats = getStats();
  stats.salesTotal = (stats.salesTotal || 0) + amount;
  stats.orders = (stats.orders || 0) + 1;
  saveStats(stats);
}

function loadBadges() {
  try {
    return JSON.parse(localStorage.getItem(PLATFORM_CONFIG.BADGES_KEY) || '[]');
  } catch { return []; }
}

function saveBadges(badges) {
  localStorage.setItem(PLATFORM_CONFIG.BADGES_KEY, JSON.stringify(badges));
}

export function getEarnedBadges() {
  return loadBadges();
}

export function awardBadge(landmarkId) {
  const badges = loadBadges();
  if (badges.includes(landmarkId)) return null;
  badges.push(landmarkId);
  saveBadges(badges);
  recordScan(landmarkId);
  return BADGE_DEFS[landmarkId] || null;
}

export function hasCoupon() {
  return localStorage.getItem(PLATFORM_CONFIG.COUPON_KEY) === 'active';
}

function unlockCoupon() {
  if (!hasCoupon()) localStorage.setItem(PLATFORM_CONFIG.COUPON_KEY, 'active');
}

/* ── Platform Init ── */
let platformCtx = {};
let currentTab = 'narrator';
let pendingCheckout = null;

export function initPlatform(ctx) {
  platformCtx = ctx;
  bindNavigation();
  bindCheckoutModal();
  bindRoutesForm();
  bindInterestChips();
  bindPartnerCta();
  renderMarketplace();
  renderBadgesPassport();
  applyPlatformStrings();
}

function applyPlatformStrings() {
  const lang = platformCtx.getLang?.()?.id || 'ar';
  const strings = PLATFORM_STRINGS[lang] || PLATFORM_STRINGS.ar;
  document.querySelectorAll('[data-platform]').forEach(el => {
    const key = el.dataset.platform;
    const val = strings[key];
    if (typeof val === 'string') el.textContent = val;
  });
}

function bindInterestChips() {
  document.querySelectorAll('.interest-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
    });
  });
}

function bindPartnerCta() {
  document.getElementById('partnerCtaBtn')?.addEventListener('click', () => {
    alert(pt('partnerAlert'));
  });
}

function pt(key, ...args) {
  const lang = platformCtx.getLang?.()?.id || 'ar';
  const bundle = PLATFORM_STRINGS[lang] || PLATFORM_STRINGS.en || PLATFORM_STRINGS.ar;
  const val = bundle[key];
  return typeof val === 'function' ? val(...args) : (val ?? key);
}

const PLATFORM_STRINGS = {
  ar: {
    navNarrator: 'الراوي',
    navRoutes: 'المسارات',
    navMarket: 'سوق حائل',
    navBadges: 'إنجازاتي',
    marketTitle: 'سوق حائل الذكي',
    marketDesc: 'منتجات الأسر المنتجة والحرفيين المعتمدين من بنك التنمية الاجتماعية',
    featured: 'موصى به',
    preOrder: 'طلب مسبق',
    buyNow: 'شراء الآن',
    nearLandmark: (name) => `قريب من ${name}`,
    partnerCta: 'هل تملك متجراً؟ انضم كشريك مميز',
    routesTitle: 'مسارات سياحية ذكية',
    routesDesc: 'مسار مخصص بالذكاء الاصطناعي يربط المعالم بالأسر المنتجة',
    durationLabel: 'مدة الزيارة',
    interestsLabel: 'اهتماماتك',
    generateRoute: 'ولّد مساري',
    generatingRoute: 'جاري إنشاء المسار...',
    badgesTitle: 'جواز المستكشف',
    badgesDesc: 'اجمع الأختام بمسح المعالم التاريخية',
    badgeTapHint: 'اضغط على البطاقة لمعرفة معنى الوسام',
    badgeHowToEarn: 'كيف تحصل عليه؟',
    stampsCollected: (n, total) => `${n} من ${total} أختام`,
    couponUnlocked: 'كوبون خصم 10% — سوق الأسر المنتجة',
    couponLocked: (need) => `اجمع ${need} أختام إضافية للحصول على كوبون`,
    badgeEarned: 'مبروك! حصلت على وسام',
    badgeCoupon: 'خصم 10% في سوق الأسر المنتجة',
    checkoutTitle: 'تأكيد الطلب',
    productPrice: 'سعر المنتج/الخدمة',
    platformFee: 'رسوم خدمة منصة حكايا حائل (5%)',
    total: 'الإجمالي',
    confirmPay: 'تأكيد الطلب (تجريبي)',
    cancel: 'إلغاء',
    orderSuccess: 'تم تأكيد طلبك بنجاح!',
    adminTitle: 'لوحة الأثر والاستدامة',
    adminDesc: 'بيانات حية لدعم متخذي القرار والاستدامة',
    economicImpact: 'الأثر الاقتصادي',
    totalSales: 'إجمالي الموجّه للأسر المنتجة',
    successfulScans: 'مسوحات ناجحة',
    totalOrders: 'طلبات عبر المنصة',
    landmarksRankingTitle: 'أكثر المعالم زيارةً',
    landmarksRankingDesc: 'ترتيب المعالم حسب عدد المسوحات عبر المنصة',
    visitLabel: 'زيارة',
    visitsLabel: 'زيارات',
    shareLabel: 'من الإجمالي',
    sentimentTitle: 'تحليل انطباعات الزوار',
    positive: 'إيجابي',
    neutral: 'محايد',
    negative: 'سلبي',
    exportReport: 'تصدير تقرير (PDF تجريبي)',
    geofenceHint: 'بناءً على موقعك قرب',
    sar: 'ر.س',
    interestArchaeology: 'آثار',
    interestAdventure: 'مغامرات',
    interestCafes: 'مقاهي',
    interestRelax: 'استرخاء',
    dur6h: '6 ساعات',
    dur1d: 'يوم واحد',
    dur2d: 'يومان',
    locked: 'لم تُكتسب بعد',
    earned: 'مكتسب',
    goToMarket: 'تسوق الآن',
    close: 'إغلاق',
    adminLink: 'لوحة الأثر',
    backToSite: '← العودة للمنصة',
    adminOnlyBadge: 'دخول إداري',
    couponDiscount: 'كوبون خصم 10%',
    partnerAlert: 'انضم كشريك مميز في حكايا حائل\n\nباقات الترقية: Featured Pin — 199 ر.س/شهر\n\n(عرض تجريبي للهاكاثون)',
    exportAlertTitle: 'تقرير حكايا حائل — بيانات سياحية واقتصادية',
  },
  en: {
    navNarrator: 'Narrator',
    navRoutes: 'Routes',
    navMarket: 'Market',
    navBadges: 'Badges',
    marketTitle: 'Hail Smart Market',
    marketDesc: 'Products from local productive families certified by Social Development Bank',
    featured: 'Featured',
    preOrder: 'Pre-order',
    buyNow: 'Buy Now',
    nearLandmark: (name) => `Near ${name}`,
    partnerCta: 'Own a shop? Join as a featured partner',
    routesTitle: 'Smart Tourism Routes',
    routesDesc: 'AI-generated itinerary linking landmarks to local businesses',
    durationLabel: 'Visit duration',
    interestsLabel: 'Your interests',
    generateRoute: 'Generate my route',
    generatingRoute: 'Creating route...',
    badgesTitle: 'Explorer Passport',
    badgesDesc: 'Collect stamps by scanning landmarks',
    badgeTapHint: 'Tap a card to learn what the badge means',
    badgeHowToEarn: 'How to earn it',
    stampsCollected: (n, total) => `${n} of ${total} stamps`,
    couponUnlocked: '10% discount coupon — Local market',
    couponLocked: (need) => `Collect ${need} more stamps for a coupon`,
    badgeEarned: 'Congratulations! You earned a badge',
    badgeCoupon: '10% off at the local market',
    checkoutTitle: 'Confirm Order',
    productPrice: 'Product/Service price',
    platformFee: 'Hakaia Hail platform fee (5%)',
    total: 'Total',
    confirmPay: 'Confirm (Demo)',
    cancel: 'Cancel',
    orderSuccess: 'Order confirmed successfully!',
    adminTitle: 'Impact & Sustainability Dashboard',
    adminDesc: 'Live data for decision makers and sustainability',
    economicImpact: 'Economic Impact',
    totalSales: 'Total directed to local families',
    successfulScans: 'Successful scans',
    totalOrders: 'Platform orders',
    landmarksRankingTitle: 'Most Visited Landmarks',
    landmarksRankingDesc: 'Ranked by scans through the platform',
    visitLabel: 'visit',
    visitsLabel: 'visits',
    shareLabel: 'of total',
    sentimentTitle: 'Visitor Sentiment Analysis',
    positive: 'Positive',
    neutral: 'Neutral',
    negative: 'Negative',
    exportReport: 'Export report (Demo PDF)',
    geofenceHint: 'Based on your location near',
    sar: 'SAR',
    interestArchaeology: 'Heritage',
    interestAdventure: 'Adventure',
    interestCafes: 'Cafés',
    interestRelax: 'Relaxation',
    dur6h: '6 hours',
    dur1d: '1 day',
    dur2d: '2 days',
    locked: 'Not earned yet',
    earned: 'Earned',
    goToMarket: 'Shop now',
    close: 'Close',
    adminLink: 'Impact dashboard',
    backToSite: '← Back to platform',
    adminOnlyBadge: 'Admin access',
    couponDiscount: '10% discount coupon',
    partnerAlert: 'Join as a featured Hakaia Hail partner\n\nFeatured Pin plan — 199 SAR/month\n\n(Hackathon demo)',
    exportAlertTitle: 'Hakaia Hail report — tourism & economic data',
  },
};

PLATFORM_STRINGS.fr = {
  ...PLATFORM_STRINGS.en,
  navNarrator: 'Conteur', navRoutes: 'Parcours', navMarket: 'Marché Hail', navBadges: 'Badges',
  marketTitle: 'Marché intelligent de Hail', marketDesc: 'Produits des familles productives locales',
  featured: 'Recommandé', preOrder: 'Précommande', buyNow: 'Acheter',
  partnerCta: 'Vous avez une boutique ? Devenez partenaire',
  routesTitle: 'Parcours touristiques intelligents', routesDesc: 'Itinéraire IA reliant monuments et commerces locaux',
  durationLabel: 'Durée de visite', interestsLabel: 'Vos intérêts', generateRoute: 'Générer mon parcours',
  generatingRoute: 'Création du parcours...',
  badgesTitle: 'Passeport de l\'explorateur', badgesDesc: 'Collectez des tampons en scannant les monuments',
  badgeTapHint: 'Appuyez sur une carte pour voir la signification', badgeHowToEarn: 'Comment l\'obtenir ?',
  stampsCollected: (n, total) => `${n} sur ${total} tampons`,
  couponUnlocked: 'Coupon -10% — Marché local', couponLocked: (need) => `Collectez ${need} tampons de plus`,
  badgeEarned: 'Félicitations ! Vous avez gagné un badge', badgeCoupon: '-10% au marché local',
  checkoutTitle: 'Confirmer la commande', productPrice: 'Prix produit/service',
  platformFee: 'Frais plateforme Hakaia Hail (5%)', total: 'Total', confirmPay: 'Confirmer (Démo)',
  cancel: 'Annuler', orderSuccess: 'Commande confirmée !',
  adminTitle: 'Tableau d\'impact & durabilité', adminDesc: 'Données en direct pour les décideurs',
  totalSales: 'Total versé aux familles', successfulScans: 'Scans réussis', totalOrders: 'Commandes',
  landmarksRankingTitle: 'Monuments les plus visités', landmarksRankingDesc: 'Classement par scans sur la plateforme',
  visitLabel: 'visite', visitsLabel: 'visites', shareLabel: 'du total',
  sentimentTitle: 'Analyse des sentiments', positive: 'Positif', neutral: 'Neutre', negative: 'Négatif',
  exportReport: 'Exporter le rapport (Démo)', geofenceHint: 'Près de', sar: 'SAR',
  interestArchaeology: 'Patrimoine', interestAdventure: 'Aventure', interestCafes: 'Cafés', interestRelax: 'Détente',
  dur6h: '6 heures', dur1d: '1 jour', dur2d: '2 jours', locked: 'Pas encore obtenu', earned: 'Obtenu',
  goToMarket: 'Acheter', close: 'Fermer', adminLink: 'Tableau d\'impact', backToSite: '← Retour à la plateforme', adminOnlyBadge: 'Accès admin', couponDiscount: 'Coupon -10%',
  partnerAlert: 'Devenez partenaire Hakaia Hail\n\nForfait Featured Pin — 199 SAR/mois\n\n(Démo hackathon)',
  exportAlertTitle: 'Rapport Hakaia Hail — Données touristiques',
};

PLATFORM_STRINGS.ur = {
  ...PLATFORM_STRINGS.en,
  navNarrator: 'راوی', navRoutes: 'راستے', navMarket: 'حائل بازار', navBadges: 'کامیابیاں',
  marketTitle: 'حائل smart market', marketDesc: 'مقامی پیداواری خاندانوں کی مصنوعات',
  featured: 'تجویز شدہ', preOrder: 'پیشگی آرڈر', buyNow: 'خریدیں',
  partnerCta: 'اپنی دکان ہے؟ شریک بنیں',
  routesTitle: 'سمارٹ سیاحتی راستے', routesDesc: 'AI کا ذاتی راستہ — مقامات اور مقامی کاروبار',
  durationLabel: 'دورے کی مدت', interestsLabel: 'آپ کی دلچسپیاں', generateRoute: 'میرا راستہ بنائیں',
  generatingRoute: 'راستہ تیار ہو رہا ہے...',
  badgesTitle: 'مُستکشف کا پاسپورٹ', badgesDesc: 'تاریخی مقامات scan کر کے مہریں جمع کریں',
  badgeTapHint: 'مطلب جاننے کے لیے کارڈ دبائیں', badgeHowToEarn: 'کیسے حاصل کریں؟',
  stampsCollected: (n, total) => `${total} میں سے ${n} مہریں`,
  couponUnlocked: '10% رعایت — مقامی بازار', couponLocked: (need) => `${need} مزید مہریں درکار`,
  badgeEarned: 'مبارک ہو! آپ کو بیج ملا', badgeCoupon: 'مقامی بازار میں 10% رعایت',
  checkoutTitle: 'آرڈر کی تصدیق', productPrice: 'مصنوعات/سروس کی قیمت',
  platformFee: 'حکايا حائل پلیٹ فارم فیس (5%)', total: 'کل', confirmPay: 'تصدیق (ڈیمو)',
  cancel: 'منسوخ', orderSuccess: 'آرڈر کامیاب!',
  adminTitle: 'اثر اور پائیداری ڈیش بورڈ', adminDesc: 'فیصلہ سازوں کے لیے live ڈیٹا',
  totalSales: 'خاندانوں کو موصول', successfulScans: 'کامیاب scans', totalOrders: 'آرڈرز',
  landmarksRankingTitle: 'سب سے زیادہ دیکhe گئے مقامات', landmarksRankingDesc: 'پلیٹ فارم scans کے لحاظ سے',
  visitLabel: 'زیارت', visitsLabel: 'زیارتیں', shareLabel: 'کل میں سے',
  sentimentTitle: 'سیاحوں کے جذبات', positive: 'مثبت', neutral: 'غیر جانبدار', negative: 'منفی',
  exportReport: 'رپورٹ برآمد (ڈیمو)', geofenceHint: 'آپ کے مقام کے قریب', sar: 'SAR',
  interestArchaeology: 'ثقافت', interestAdventure: 'مہم جوئی', interestCafes: 'کیفے', interestRelax: 'آرام',
  dur6h: '6 گھنٹے', dur1d: '1 دن', dur2d: '2 دن', locked: 'ابھی نہیں ملا', earned: 'حاصل شدہ',
  goToMarket: 'خریداری', close: 'بند', adminLink: 'اثر ڈیش بورڈ', backToSite: '← پلیٹ فارم پر واپس', adminOnlyBadge: 'ایڈمن رسائی', couponDiscount: '10% رعایت',
  partnerAlert: 'حکايا حائل میں شریک بنیں\n\nFeatured Pin — 199 SAR/ماہ\n\n(ہیکاتھون ڈیمو)',
  exportAlertTitle: 'حکايا حائل رپورٹ — سیاحتی و اقتصادی ڈیٹا',
};

function bindNavigation() {
  document.querySelectorAll('.bottom-nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

export function switchTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('hidden', p.dataset.tab !== tabId);
  });
  document.querySelectorAll('.bottom-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  const journey = document.querySelector('.journey-steps');
  if (journey) journey.classList.toggle('hidden', tabId !== 'narrator');
  if (tabId === 'badges') renderBadgesPassport();
  if (tabId === 'marketplace') renderMarketplace();
}

/* ── Marketplace ── */
export function renderMarketplace(filterLandmarkId = null) {
  const grid = document.getElementById('marketplaceGrid');
  if (!grid) return;

  const lang = platformCtx.getLang?.()?.id || 'ar';
  let products = [...MARKETPLACE_PRODUCTS];
  const nearLabel = document.getElementById('geofenceLabel');

  if (filterLandmarkId || platformCtx.currentLandmarkId) {
    const lid = filterLandmarkId || platformCtx.currentLandmarkId;
    const landmark = platformCtx.LANDMARKS?.[lid];
    const lmName = platformCtx.getLandmarkName?.(lid) || landmark?.nameAr || '';
    if (landmark && nearLabel) {
      nearLabel.textContent = `${pt('geofenceHint')} «${lmName}»`;
      nearLabel.classList.remove('hidden');
    }
    const nearby = products.filter(p => p.landmark === lid);
    const others = products.filter(p => p.landmark !== lid);
    products = [...nearby, ...others];
  } else if (nearLabel) {
    nearLabel.classList.add('hidden');
  }

  grid.innerHTML = products.map(p => {
    const labels = getProductLabels(p.id, lang);
    return `
      <article class="product-card ${p.featured ? 'featured' : ''}">
        ${p.featured ? `<span class="featured-badge"><i class="fa-solid fa-star"></i> ${pt('featured')}</span>` : ''}
        <div class="product-emoji">${p.emoji}</div>
        <span class="product-type">${labels.type || p.type}</span>
        <h4>${labels.name || p.name}</h4>
        <p class="product-family"><i class="fa-solid fa-house-chimney"></i> ${labels.family || p.family}</p>
        <div class="product-meta">
          <span class="product-rating"><i class="fa-solid fa-star"></i> ${p.rating}</span>
          <span class="product-price">${p.price} ${pt('sar')}</span>
        </div>
        <p class="product-region"><i class="fa-solid fa-location-dot"></i> ${labels.region || p.region}</p>
        <div class="product-actions">
          <button class="btn btn-primary btn-sm" data-action="buy" data-id="${p.id}">
            <i class="fa-solid fa-cart-shopping"></i> ${pt('buyNow')}
          </button>
          <button class="btn btn-secondary btn-sm" data-action="preorder" data-id="${p.id}">
            <i class="fa-solid fa-truck-fast"></i> ${pt('preOrder')}
          </button>
        </div>
      </article>`;
  }).join('');

  grid.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = MARKETPLACE_PRODUCTS.find(p => p.id === btn.dataset.id);
      if (product) openCheckout({ type: 'product', item: product, preOrder: btn.dataset.action === 'preorder' });
    });
  });
}

/* ── Routes ── */
function bindRoutesForm() {
  document.getElementById('generateRouteBtn')?.addEventListener('click', generateRoute);
}

async function generateRoute() {
  const timeline = document.getElementById('routeTimeline');
  const loading = document.getElementById('routeLoading');
  if (!timeline) return;

  const duration = document.getElementById('routeDuration')?.value || '6h';
  const interests = [...document.querySelectorAll('.interest-chip.active')].map(c => c.dataset.interest);
  const interestKey = interests[0] || 'heritage';
  const lang = platformCtx.getLang?.()?.id || 'ar';

  loading?.classList.remove('hidden');
  timeline.innerHTML = '';

  let stops = getRouteStops(`${duration}-${interestKey}`, lang) || getRouteStops('default', lang);

  try {
    if (platformCtx.callGeminiRoute) {
      const aiStops = await platformCtx.callGeminiRoute(duration, interests);
      if (aiStops?.length) stops = aiStops;
    }
  } catch (err) {
    console.warn('[Platform] Route AI fallback:', err);
  }

  loading?.classList.add('hidden');
  timeline.innerHTML = stops.map((stop, i) => `
    <div class="route-stop" style="animation-delay:${i * 0.08}s">
      <div class="route-time">${stop.time}</div>
      <div class="route-dot"></div>
      <div class="route-content">
        <span class="route-type">${stop.type}</span>
        <h4>${stop.title}</h4>
        <p>${stop.desc}</p>
      </div>
    </div>`).join('');
}

/* ── Badges / Gamification ── */
export function renderBadgesPassport() {
  const grid = document.getElementById('badgesGrid');
  const counter = document.getElementById('badgeCounter');
  const couponEl = document.getElementById('couponStatus');
  if (!grid) return;

  const earned = getEarnedBadges();
  const total = Object.keys(BADGE_DEFS).length;
  const lang = platformCtx.getLang?.()?.id || 'ar';

  if (counter) counter.textContent = pt('stampsCollected', earned.length, total);

  if (couponEl) {
    if (hasCoupon() || earned.length >= PLATFORM_CONFIG.BADGES_FOR_COUPON) {
      unlockCoupon();
      couponEl.innerHTML = `<i class="fa-solid fa-ticket"></i> ${pt('couponUnlocked')}`;
      couponEl.className = 'coupon-status unlocked';
    } else {
      couponEl.innerHTML = `<i class="fa-solid fa-lock"></i> ${pt('couponLocked', PLATFORM_CONFIG.BADGES_FOR_COUPON - earned.length)}`;
      couponEl.className = 'coupon-status locked';
    }
  }

  grid.innerHTML = Object.values(BADGE_DEFS).map(b => {
    const isEarned = earned.includes(b.id);
    const name = badgeLabel(b, lang);
    const desc = badgeDesc(b, lang);
    return `
      <button type="button" class="badge-flip-card ${isEarned ? 'earned' : 'locked'}" aria-label="${name}">
        <div class="badge-flip-inner">
          <div class="badge-face badge-front">
            <div class="badge-icon" style="--badge-color:${b.color}">
              <i class="fa-solid ${b.icon}"></i>
            </div>
            <h4>${name}</h4>
            <span class="badge-status">${isEarned ? pt('earned') : pt('locked')}</span>
          </div>
          <div class="badge-face badge-back">
            <p class="badge-back-label">${pt('badgeHowToEarn')}</p>
            <p class="badge-back-desc">${desc}</p>
          </div>
        </div>
      </button>`;
  }).join('');

  grid.querySelectorAll('.badge-flip-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
}

export function onLandmarkScanned(landmarkId) {
  const badge = awardBadge(landmarkId);
  if (badge) showBadgeModal(badge);
  renderBadgesPassport();
  renderMarketplace(landmarkId);
}

function showBadgeModal(badge) {
  const modal = document.getElementById('badgeModal');
  if (!modal) return;
  const lang = platformCtx.getLang?.()?.id || 'ar';
  const name = badgeLabel(badge, lang);
  document.getElementById('badgeModalTitle').textContent = pt('badgeEarned');
  document.getElementById('badgeModalName').textContent = name;
  document.getElementById('badgeModalIcon').innerHTML = `<i class="fa-solid ${badge.icon}"></i>`;
  document.getElementById('badgeModalIcon').style.background = badge.color;
  document.getElementById('badgeModalCoupon').textContent = pt('badgeCoupon');
  modal.classList.remove('hidden');

  document.getElementById('badgeModalMarket')?.addEventListener('click', () => {
    modal.classList.add('hidden');
    switchTab('marketplace');
  }, { once: true });
  document.getElementById('badgeModalClose')?.addEventListener('click', () => modal.classList.add('hidden'), { once: true });
}

/* ── Checkout Modal ── */
function bindCheckoutModal() {
  document.getElementById('checkoutClose')?.addEventListener('click', closeCheckout);
  document.getElementById('checkoutCancel')?.addEventListener('click', closeCheckout);
  document.getElementById('checkoutConfirm')?.addEventListener('click', confirmCheckout);
  document.getElementById('checkoutModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'checkoutModal') closeCheckout();
  });
}

function openCheckout(order) {
  pendingCheckout = order;
  const modal = document.getElementById('checkoutModal');
  const lang = platformCtx.getLang?.()?.id || 'ar';
  const rawItem = order.item;
  const labels = rawItem.id ? getProductLabels(rawItem.id, lang) : {};
  const item = { ...rawItem, name: labels.name || rawItem.name };
  const price = item.price;
  const fee = price * PLATFORM_CONFIG.COMMISSION_RATE;
  const total = price + fee;
  const discount = hasCoupon() ? total * (PLATFORM_CONFIG.COUPON_DISCOUNT / 100) : 0;
  const finalTotal = total - discount;

  document.getElementById('checkoutItemName').textContent = item.name || item.name;
  document.getElementById('checkoutPrice').textContent = `${price.toFixed(1)} ${pt('sar')}`;
  document.getElementById('checkoutFee').textContent = `${fee.toFixed(1)} ${pt('sar')}`;
  document.getElementById('checkoutTotal').textContent = `${finalTotal.toFixed(1)} ${pt('sar')}`;

  const discountRow = document.getElementById('checkoutDiscountRow');
  if (discountRow) {
    discountRow.classList.toggle('hidden', !discount);
    if (discount) {
      discountRow.querySelector('span:first-child').textContent = pt('couponDiscount');
      document.getElementById('checkoutDiscount').textContent = `-${discount.toFixed(1)} ${pt('sar')}`;
    }
  }

  if (order.preOrder) {
    document.getElementById('checkoutNote').textContent = platformCtx.currentLandmarkId
      ? `📍 ${pt('preOrder')} — ${pt('geofenceHint')} «${platformCtx.getLandmarkName?.(platformCtx.currentLandmarkId) || ''}»`
      : `📍 ${pt('preOrder')}`;
    document.getElementById('checkoutNote').classList.remove('hidden');
  } else {
    document.getElementById('checkoutNote')?.classList.add('hidden');
  }

  modal?.classList.remove('hidden');
}

function closeCheckout() {
  document.getElementById('checkoutModal')?.classList.add('hidden');
  pendingCheckout = null;
}

function confirmCheckout() {
  if (!pendingCheckout) return;
  const price = pendingCheckout.item.price;
  const total = price * (1 + PLATFORM_CONFIG.COMMISSION_RATE);
  recordSale(total);
  closeCheckout();
  alert(pt('orderSuccess'));
}

/* ── Admin Dashboard (صفحة admin.html فقط) ── */
export function updateAdminDashboard() {
  const stats = getStats();
  const fmt = n => n.toLocaleString('ar-SA');

  document.getElementById('statSales') && (document.getElementById('statSales').textContent = `${fmt(stats.salesTotal)} ${pt('sar')}`);
  document.getElementById('statScans') && (document.getElementById('statScans').textContent = fmt(stats.scans));
  document.getElementById('statOrders') && (document.getElementById('statOrders').textContent = fmt(stats.orders));

  const ranking = document.getElementById('landmarksRanking');
  if (ranking && platformCtx.LANDMARKS) {
    const visits = stats.landmarkVisits || {};
    const entries = Object.entries(platformCtx.LANDMARKS)
      .map(([id, lm]) => ({ id, name: platformCtx.getLandmarkName?.(id) || lm.nameAr, count: visits[id] || 0 }))
      .sort((a, b) => b.count - a.count);
    const total = entries.reduce((sum, e) => sum + e.count, 0) || 1;
    const max = entries[0]?.count || 1;

    ranking.innerHTML = entries.map((item, index) => {
      const pct = Math.round((item.count / total) * 100);
      const barWidth = Math.round((item.count / max) * 100);
      const visitWord = item.count === 1 ? pt('visitLabel') : pt('visitsLabel');
      return `
        <div class="ranking-row">
          <span class="ranking-num">${index + 1}</span>
          <div class="ranking-body">
            <div class="ranking-header">
              <span class="ranking-name">${item.name}</span>
              <span class="ranking-stats">
                <strong>${fmt(item.count)}</strong> ${visitWord}
                <span class="ranking-pct">(${pct}% ${pt('shareLabel')})</span>
              </span>
            </div>
            <div class="ranking-bar-track">
              <div class="ranking-bar-fill" style="width:${barWidth}%"></div>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  const sent = stats.sentiment || { positive: 87, neutral: 10, negative: 3 };
  document.getElementById('sentPositive') && (document.getElementById('sentPositive').style.width = `${sent.positive}%`);
  document.getElementById('sentNeutral') && (document.getElementById('sentNeutral').style.width = `${sent.neutral}%`);
  document.getElementById('sentNegative') && (document.getElementById('sentNegative').style.width = `${sent.negative}%`);
  const legPos = document.getElementById('sentLegendPositive');
  const legNeu = document.getElementById('sentLegendNeutral');
  const legNeg = document.getElementById('sentLegendNegative');
  if (legPos) legPos.textContent = `${sent.positive}%`;
  if (legNeu) legNeu.textContent = `${sent.neutral}%`;
  if (legNeg) legNeg.textContent = `${sent.negative}%`;
}

/** تهيئة لوحة الأثر — admin.html */
export function initAdminPage(ctx) {
  platformCtx = ctx;
  document.getElementById('exportReportBtn')?.addEventListener('click', () => {
    alert(`${pt('exportAlertTitle')}\n\n${JSON.stringify(getStats(), null, 2).slice(0, 500)}...\n\n(${pt('exportReport')})`);
  });
  document.getElementById('adminLangSelect')?.addEventListener('change', (e) => {
    const langId = e.target.value;
    localStorage.setItem('hakaia_lang', langId);
    document.documentElement.lang = langId === 'ur' ? 'ur' : langId;
    document.documentElement.dir = langId === 'ar' || langId === 'ur' ? 'rtl' : 'ltr';
    applyPlatformStrings();
    updateAdminDashboard();
  });
  const lang = platformCtx.getLang?.()?.id || localStorage.getItem('hakaia_lang') || 'ar';
  const sel = document.getElementById('adminLangSelect');
  if (sel) sel.value = lang;
  document.documentElement.lang = lang === 'ar' ? 'ar' : lang;
  document.documentElement.dir = lang === 'ar' || lang === 'ur' ? 'rtl' : 'ltr';
  applyPlatformStrings();
  updateAdminDashboard();
}

export function refreshPlatformLanguage() {
  applyPlatformStrings();
  renderMarketplace(platformCtx.currentLandmarkId);
  renderBadgesPassport();
  const timeline = document.getElementById('routeTimeline');
  if (timeline?.innerHTML.trim()) generateRoute();
}
