/** ترجمات المحتوى الديناميكي — سوق، مسارات، أنواع الأنشطة */

export function pickLocale(map, lang) {
  if (!map) return '';
  return map[lang] || map.en || map.ar || '';
}

export const BUSINESS_TYPE_I18N = {
  'أطعمة شعبية':       { ar: 'أطعمة شعبية', en: 'Traditional food', fr: 'Cuisine traditionnelle', ur: 'روایتی کھانا' },
  'حرف يدوية':         { ar: 'حرف يدوية', en: 'Handicrafts', fr: 'Artisanat', ur: 'دستکاری' },
  'منتجات زراعية':     { ar: 'منتجات زراعية', en: 'Farm products', fr: 'Produits agricoles', ur: 'زرعی مصنوعات' },
  'مشروبات وضيافة':    { ar: 'مشروبات وضيافة', en: 'Coffee & hospitality', fr: 'Boissons & hospitalité', ur: 'مشروبات و مہمان نوازی' },
  'فود تراك ومشروبات': { ar: 'فود تراك ومشروبات', en: 'Food truck & drinks', fr: 'Food truck & boissons', ur: 'فوڈ ٹرک و مشروبات' },
  'هدايا تذكارية':     { ar: 'هدايا تذكارية', en: 'Souvenirs', fr: 'Souvenirs', ur: 'یادگاریں' },
};

export const REGION_I18N = {
  'جبة': { ar: 'جبة', en: 'Jubbah', fr: 'Jubbah', ur: 'جبہ' },
  'الشويمس': { ar: 'الشويمس', en: 'Shuwaymis', fr: 'Shuwaymis', ur: 'الشویمس' },
  'قلعة عيرف': { ar: 'قلعة عيرف', en: 'Airif Fort', fr: 'Fort Airif', ur: 'قلعہ عیرف' },
  'القشلة': { ar: 'القشلة', en: 'Qishlah', fr: 'Qishlah', ur: 'القشلہ' },
  'حائل': { ar: 'حائل', en: 'Hail', fr: 'Hail', ur: 'حائل' },
  'آثار عامة': { ar: 'آثار عامة', en: 'General heritage sites', fr: 'Sites patrimoniaux', ur: 'عام ثقافتی مقامات' },
};


export const LOCAL_BUSINESS_I18N = {
  'مطبخ الجبلين للأكلات الشعبية': {
    en: { name: 'Al-Jebelain Traditional Kitchen', specialty: 'Hail kibbeh and jareesh', owner: 'Umm Ahmad Al-Haili', distance: '500 m' },
    fr: { name: 'Cuisine traditionnelle Al-Jebelain', specialty: 'Kibbeh et jareesh de Hail', owner: 'Umm Ahmad Al-Haili', distance: '500 m' },
    ur: { name: 'الجبلین روایتی باورچی', specialty: 'حail کی کبےبا اور جریش', owner: 'ام احمد حaili', distance: '500 میٹر' },
  },
  'حرفيات جبة للنسيج والسدو': {
    en: { name: 'Jubbah Weaving & Sadu Crafts', specialty: 'Handwoven Sadu inspired by Thamudic rock art', owner: 'Productive Family — Umm Mishal', distance: '1.2 km' },
    fr: { name: 'Artisanat textile de Jubbah', specialty: 'Sadu tissé inspiré des gravures thamoudéennes', owner: 'Famille productive — Umm Mishal', distance: '1,2 km' },
    ur: { name: 'جبہ کی بُنai اور سدو', specialty: 'Thamudic نقشوں سے متاثر دستی سدو', owner: 'پیداواری خاندان — ام مشعل', distance: '1.2 کلومیٹر' },
  },
  'تمور الفيد الفاخرة': {
    en: { name: 'Al-Faid Premium Dates', specialty: 'Premium Al-Hulwa dates and natural date molasses', owner: 'Farmer Abu Saleh', distance: '800 m' },
    fr: { name: 'Dattes premium Al-Faid', specialty: 'Dattes Al-Hulwa et mélasse de dattes', owner: 'Fermier Abu Saleh', distance: '800 m' },
    ur: { name: 'تمور الفید فاخر کھجور', specialty: 'فاخر حلوہ کھجور اور قدرتی شیرہ', owner: 'کسان ابو صالح', distance: '800 میٹر' },
  },
  'مقهى ومحمصة دلال حائل': {
    en: { name: 'Dalal Hail Café & Roastery', specialty: 'Saudi cardamom coffee, saffron coffee & local dates', owner: 'Local young entrepreneur', distance: '1.5 km' },
    fr: { name: 'Café & torréfacteur Dalal Hail', specialty: 'Café saoudien au cardamome, safran et dattes locales', owner: 'Jeune entrepreneur local', distance: '1,5 km' },
    ur: { name: 'دلال حائل کیفے اور روسٹری', specialty: 'الائچی والی سعودی coffee، زعفرan coffee اور مقامی کھجور', owner: 'مقامی نوجوان کاروباری', distance: '1.5 کلومیٹر' },
  },
  'منحوتات عيرف الخشبية': {
    en: { name: 'Airif Wood Carvings', specialty: 'Hand-carved wooden incense burners and traditional Hail vessels', owner: 'Craftsman Abu Fahd', distance: '300 m' },
    fr: { name: 'Sculptures sur bois d\'Airif', specialty: 'Encensoirs et objets traditionnels de Hail sculptés à la main', owner: 'Artisan Abu Fahd', distance: '300 m' },
    ur: { name: 'عیرf کی لکڑی کی کاری', specialty: 'دستی کندہ شدہ لکڑی کے بخور دان اور روایتی برتن', owner: 'دستکار ابو فهد', distance: '300 میٹر' },
  },
  'عربة شاي الجمر والنعناع الحائلي': {
    en: { name: 'Ember & Hail Mint Tea Cart', specialty: 'Signature ember tea with Hail mint and local snacks', owner: 'Entrepreneur — Raed', distance: '150 m' },
    fr: { name: 'Chariot thé au charbon & menthe de Hail', specialty: 'Thé au charbon à la menthe de Hail et collations locales', owner: 'Entrepreneur — Raed', distance: '150 m' },
    ur: { name: 'جمر اور حائل پudina چائے کی گاڑی', specialty: 'حائل پudina والی جمر چائے اور مقامی ناشتہ', owner: 'کاروباری — رaed', distance: '150 میٹر' },
  },
  'حرفيات القشلة للسدو والنسيج': {
    en: { name: 'Qishlah Sadu & Weaving', specialty: 'Traditional Hail Sadu and embroidered shawls', owner: 'Umm Saad Family', distance: '200 m' },
    fr: { name: 'Sadu & tissage de Qishlah', specialty: 'Sadu traditionnel de Hail et châles brodés', owner: 'Famille Umm Saad', distance: '200 m' },
    ur: { name: 'القشلہ سدو اور بُنai', specialty: 'روایتی حائل سدو اور کڑھai والے شال', owner: 'ام سعد کا خاندان', distance: '200 میٹر' },
  },
  'مقهى البادية — القشلة': {
    en: { name: 'Al-Badiya Café — Qishlah', specialty: 'Hail cardamom coffee and local dates', owner: 'Local entrepreneur', distance: '350 m' },
    fr: { name: 'Café Al-Badiya — Qishlah', specialty: 'Café de Hail au cardamome et dattes locales', owner: 'Entrepreneur local', distance: '350 m' },
    ur: { name: 'البادیہ کیفے — القشلہ', specialty: 'الائچی والی حائل coffee اور مقامی کھجور', owner: 'مقامی کاروباری', distance: '350 میٹر' },
  },
  'متجر تراث حائل الرقمي': {
    en: { name: 'Hail Heritage Digital Store', specialty: 'Mini heritage pieces representing Hail identity', owner: 'Hail Productive Families Association', distance: 'Instant delivery to your location' },
    fr: { name: 'Boutique numérique du patrimoine de Hail', specialty: 'Pièces patrimoniales miniatures représentant l\'identité de Hail', owner: 'Association des familles productives de Hail', distance: 'Livraison instantanée sur place' },
    ur: { name: 'حائل Heritage ڈیجیٹل اسٹور', specialty: 'حائل کی شناخت ظاہر کرنے والے ثقافتی چھوٹے تحفے', owner: 'حائل پیداواری خاندانوں کی asso', distance: 'فوری ڈilivery مقام پر' },
  },
};

export function translateBusiness(biz, lang) {
  const pack = LOCAL_BUSINESS_I18N[biz.name];
  if (!pack || lang === 'ar') return biz;
  const labels = pack[lang] || pack.en || {};
  return { ...biz, ...labels };
}

export const MARKETPLACE_I18N = {
  p1: {
    ar: { name: 'سدو يدوي — نقوش جبة', family: 'حرفيات جبة', type: 'حرف يدوية', region: 'جبة' },
    en: { name: 'Handwoven Sadu — Jubbah motifs', family: 'Jubbah Craftswomen', type: 'Handicrafts', region: 'Jubbah' },
    fr: { name: 'Sadu tissé — motifs de Jubbah', family: 'Artisanes de Jubbah', type: 'Artisanat', region: 'Jubbah' },
    ur: { name: 'دستی سدو — جبہ کے نقش', family: 'جبہ کی دستکار عورتیں', type: 'دستکاری', region: 'جبہ' },
  },
  p2: {
    ar: { name: 'فخار حائل التقليدي', family: 'أسرة أم سعد', type: 'حرف يدوية', region: 'القشلة' },
    en: { name: 'Traditional Hail pottery', family: 'Umm Saad Family', type: 'Handicrafts', region: 'Qishlah' },
    fr: { name: 'Poterie traditionnelle de Hail', family: 'Famille Umm Saad', type: 'Artisanat', region: 'Qishlah' },
    ur: { name: 'روایتی حائل کی مٹی کی برتن', family: 'ام سعد کا خاندان', type: 'دستکاری', region: 'القشلہ' },
  },
  p3: {
    ar: { name: 'كليجا حائل بالتمر', family: 'مطبخ الجبلين', type: 'مأكولات', region: 'جبة' },
    en: { name: 'Hail Kleija with dates', family: 'Al-Jebelain Kitchen', type: 'Food', region: 'Jubbah' },
    fr: { name: 'Kleija de Hail aux dattes', family: 'Cuisine Al-Jebelain', type: 'Gastronomie', region: 'Jubbah' },
    ur: { name: 'حائل کی کليجا کھجور کے ساتھ', family: 'الجبلین کی باورچی', type: 'کھانا', region: 'جبہ' },
  },
  p4: {
    ar: { name: 'تمر حلوة حائل فاخر', family: 'تمور الفيد', type: 'منتجات زراعية', region: 'الشويمس' },
    en: { name: 'Premium Hail Al-Hulwa dates', family: 'Al-Faid Dates', type: 'Farm products', region: 'Shuwaymis' },
    fr: { name: 'Dattes Al-Hulwa premium', family: 'Dattes Al-Faid', type: 'Produits agricoles', region: 'Shuwaymis' },
    ur: { name: 'فاخر حائل حلوہ کھجور', family: 'تمور الفید', type: 'زرعی مصنوعات', region: 'الشویمس' },
  },
  p5: {
    ar: { name: 'مبخرة خشبية منحوتة', family: 'منحوتات عيرف', type: 'حرف يدوية', region: 'قلعة عيرف' },
    en: { name: 'Carved wooden incense burner', family: 'Airif Woodcraft', type: 'Handicrafts', region: 'Airif' },
    fr: { name: 'Encensoir en bois sculpté', family: 'Sculptures Airif', type: 'Artisanat', region: 'Airif' },
    ur: { name: 'کندہ شدہ لکڑی کا بخورد', family: 'عیرف کی لکڑی کی کاری', type: 'دستکاری', region: 'عیرف' },
  },
  p6: {
    ar: { name: 'قهوة حائل بالزعفران', family: 'دلال حائل', type: 'مشروبات', region: 'الشويمس' },
    en: { name: 'Hail saffron coffee', family: 'Dalal Hail', type: 'Beverages', region: 'Shuwaymis' },
    fr: { name: 'Café de Hail au safran', family: 'Dalal Hail', type: 'Boissons', region: 'Shuwaymis' },
    ur: { name: 'زعفران والی حائل کیoffee', family: 'دلال حائل', type: 'مشروبات', region: 'الشویمس' },
  },
  p7: {
    ar: { name: 'وشاح سدو مطرّز', family: 'حرفيات القشلة', type: 'حرف يدوية', region: 'القشلة' },
    en: { name: 'Embroidered Sadu shawl', family: 'Qishlah Craftswomen', type: 'Handicrafts', region: 'Qishlah' },
    fr: { name: 'Châle Sadu brodé', family: 'Artisanes Qishlah', type: 'Artisanat', region: 'Qishlah' },
    ur: { name: 'کڑھai والا سدو شال', family: 'القشلہ کی دستکار', type: 'دستکاری', region: 'القشلہ' },
  },
  p8: {
    ar: { name: 'حمضيات حائل المجفّفة', family: 'مزارع وادي حائل', type: 'منتجات زراعية', region: 'حائل' },
    en: { name: 'Dried Hail citrus', family: 'Hail Valley Farms', type: 'Farm products', region: 'Hail' },
    fr: { name: 'Agrumes séchés de Hail', family: 'Fermes de la vallée', type: 'Produits agricoles', region: 'Hail' },
    ur: { name: 'خشک حائل کے کھٹے', family: 'وادی حائل کے کھیت', type: 'زرعی مصنوعات', region: 'حائل' },
  },
};

export const ROUTES_I18N = {
  '6h-heritage': {
    ar: [
      { time: '08:00', title: 'نقوش جبة الصخرية', type: 'آثار', desc: 'جولة في أكبر متحف صخري مفتوح' },
      { time: '10:30', title: 'مطبخ الجبلين — غداء', type: 'مأكولات', desc: 'كبيبا حائلية وأطباق شعبية' },
      { time: '12:00', title: 'حرفيات جبة — سوق محلي', type: 'تسوق', desc: 'سدو يدوي وهدايا تذكارية' },
      { time: '14:00', title: 'قلعة عيرف', type: 'آثار', desc: 'إطلالة panorama على حائل' },
      { time: '16:00', title: 'مقهى البادية — استراحة', type: 'مقهى', desc: 'قهوة بالهيل وتمور محلية' },
    ],
    en: [
      { time: '08:00', title: 'Jubbah Rock Art', type: 'Heritage', desc: 'Tour the greatest open-air rock museum' },
      { time: '10:30', title: 'Al-Jebelain Kitchen — Lunch', type: 'Food', desc: 'Hail traditional dishes' },
      { time: '12:00', title: 'Jubbah crafts market', type: 'Shopping', desc: 'Handwoven Sadu and souvenirs' },
      { time: '14:00', title: 'Airif Fort', type: 'Heritage', desc: 'Panoramic view over Hail' },
      { time: '16:00', title: 'Al-Badiya Café — Break', type: 'Café', desc: 'Cardamom coffee and local dates' },
    ],
    fr: [
      { time: '08:00', title: 'Art rupestre de Jubbah', type: 'Patrimoine', desc: 'Visite du plus grand musée rupestre' },
      { time: '10:30', title: 'Déjeuner traditionnel', type: 'Gastronomie', desc: 'Plats typiques de Hail' },
      { time: '12:00', title: 'Artisanat local Jubbah', type: 'Shopping', desc: 'Sadu et souvenirs' },
      { time: '14:00', title: 'Fort Airif', type: 'Patrimoine', desc: 'Vue panoramique sur Hail' },
      { time: '16:00', title: 'Pause café', type: 'Café', desc: 'Café aux dattes locales' },
    ],
    ur: [
      { time: '08:00', title: 'جبہ کی صخری فن', type: 'ثقافت', desc: 'کھلے فن کے عظیم ترین مقام کا دورہ' },
      { time: '10:30', title: 'الجبلین — دوپہر کا کھana', type: 'کھana', desc: 'حائل کے روایتی کھانے' },
      { time: '12:00', title: 'جبہ کی دستکاری', type: 'خریداری', desc: 'سدو اور یادگاریں' },
      { time: '14:00', title: 'قلعہ عیرf', type: 'ثقافت', desc: 'حائل کا خوبصورت منظر' },
      { time: '16:00', title: 'کیفے — آرام', type: 'کیفے', desc: 'الائچی کیoffee اور کھجور' },
    ],
  },
  default: {
    ar: [
      { time: '09:00', title: 'متحف حائل الإقليمي', type: 'آثار', desc: 'مدخل لتاريخ المنطقة' },
      { time: '11:00', title: 'قصر القشلة', type: 'آثار', desc: 'عمارة نجدية تراثية' },
      { time: '13:00', title: 'غداء — أسر منتجة', type: 'مأكولات', desc: 'منتجات محلية معتمدة' },
      { time: '15:00', title: 'سوق حائل الذكي', type: 'تسوق', desc: 'حرف يدوية ومأكولات' },
      { time: '17:00', title: 'قهوة واسترخاء', type: 'استرخاء', desc: 'مقهى محلي بجوار المعلم' },
    ],
    en: [
      { time: '09:00', title: 'Hail Regional Museum', type: 'Heritage', desc: 'Gateway to regional history' },
      { time: '11:00', title: 'Qishlah Palace', type: 'Heritage', desc: 'Classic Najdi architecture' },
      { time: '13:00', title: 'Local family lunch', type: 'Food', desc: 'Certified local products' },
      { time: '15:00', title: 'Hail Smart Market', type: 'Shopping', desc: 'Crafts and local food' },
      { time: '17:00', title: 'Coffee & relaxation', type: 'Relax', desc: 'Local café near landmarks' },
    ],
    fr: [
      { time: '09:00', title: 'Musée régional de Hail', type: 'Patrimoine', desc: 'Porte d\'entrée de l\'histoire' },
      { time: '11:00', title: 'Palais Qishlah', type: 'Patrimoine', desc: 'Architecture najdite' },
      { time: '13:00', title: 'Déjeuner local', type: 'Gastronomie', desc: 'Produits certifiés' },
      { time: '15:00', title: 'Marché intelligent', type: 'Shopping', desc: 'Artisanat et gastronomie' },
      { time: '17:00', title: 'Café & détente', type: 'Détente', desc: 'Café local' },
    ],
    ur: [
      { time: '09:00', title: 'حائل کا علاقائی عجائب گھر', type: 'ثقافت', desc: 'علاقے کی تاریخ کا آغاز' },
      { time: '11:00', title: 'قصر القشلہ', type: 'ثقافت', desc: 'نجدی فن تعمیر' },
      { time: '13:00', title: 'مقامی خاندانی دوپہر', type: 'کھana', desc: 'تصدیق شدہ مقامی مصنوعات' },
      { time: '15:00', title: 'حائل کا smart market', type: 'خریداری', desc: 'دستکاری اور کھana' },
      { time: '17:00', title: 'coffee اور آرام', type: 'آرام', desc: 'مقامی کیفے' },
    ],
  },
};


export function getProductLabels(productId, lang) {
  return MARKETPLACE_I18N[productId]?.[lang] || MARKETPLACE_I18N[productId]?.en || MARKETPLACE_I18N[productId]?.ar || {};
}

export function getRouteStops(routeKey, lang) {
  const pack = ROUTES_I18N[routeKey] || ROUTES_I18N.default;
  return pack[lang] || pack.en || pack.ar || [];
}
