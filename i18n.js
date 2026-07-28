/** ترجمات مركزية — تُستخدم مع LANGUAGES في app.js و platform.js */

export const LANDMARK_I18N = {
  jubbah_rock:     { en: 'Jubbah Rock Art', fr: 'Art rupestre de Jubbah', ur: 'جبہ کی صخری نقش و نگار' },
  shuwaymis:       { en: 'Al-Shuwaymis Heritage', fr: 'Patrimoine Al-Shuwaymis', ur: 'آثار الشویمس' },
  airif_fort:      { en: 'Airif Fort', fr: 'Fort Airif', ur: 'قلعہ عیرف' },
  barzan_palace:   { en: 'Barzan Palace', fr: 'Palais Barzan', ur: 'قصر برزان' },
  aishiyah_palace: { en: 'Aishiyah Palace', fr: 'Palais Aishiyah', ur: 'قصر العشیہ' },
  hail_museum:     { en: 'Hail Regional Museum', fr: 'Musée régional de Hail', ur: 'حائل علاقائی عجائب گھر' },
  qishlah:         { en: 'Qishlah Palace', fr: 'Palais Qishlah', ur: 'قصر القشلہ' },
};

export const BADGE_I18N = {
  jubbah_rock: {
    nameFr: 'Explorateur de Jubbah', nameUr: 'جبہ کا مُستکشف',
    descFr: 'Attribué après la reconnaissance des gravures de Jubbah — l\'un des plus grands sites rupestres d\'Arabie.',
    descUr: 'جبہ کی صخری نقش و نگار کی پہچان پر ملتا ہے — جزیرہ نما عرب کے اہم ترین ثقافتی مقامات میں سے ایک۔',
  },
  shuwaymis: {
    nameFr: 'Historien de Shuwaymis', nameUr: 'الشویمس کا مؤرخ',
    descFr: 'Pour ceux qui découvrent le patrimoine rupestre de Shuwaymis et son histoire ancienne.',
    descUr: 'الشویمس کے ثقافتی مقام کی پہچان پر — علاقے کی قدیم تاریخ کے محافظ کے طور پر۔',
  },
  airif_fort: {
    nameFr: 'Gardien d\'Airif', nameUr: 'عیرف کا محافظ',
    descFr: 'Après la reconnaissance de la forteresse d\'Airif — symbole des remparts historiques de Hail.',
    descUr: 'قلعہ عیرف کی پہچان پر — حائل کی تاریخی فصیلوں کا نشان۔',
  },
  barzan_palace: {
    nameFr: 'Invité de Barzan', nameUr: 'برزان کا مہمان',
    descFr: 'Après la visite du palais Barzan — emblème de l\'architecture najdite.',
    descUr: 'قصر برزان کی پہچان پر — نجدی ثقافتی عمارت کا نشان۔',
  },
  aishiyah_palace: {
    nameFr: 'Conteur d\'Aishiyah', nameUr: 'العشیہ کا قصہ گو',
    descFr: 'Pour les visiteurs qui ressentent l\'esprit des majlis traditionnels.',
    descUr: 'قصر العشیہ کی پہچان پر — روایتی مجلسوں کی یاد دلاتا ہے۔',
  },
  hail_museum: {
    nameFr: 'Chercheur du musée', nameUr: 'عجائب گھر کا محقق',
    descFr: 'Première étape pour comprendre l\'histoire vivante de la région.',
    descUr: 'حائل عجائب گھر کی پہچان پر — علاقے کی تاریخ سمجھنے کا آغاز۔',
  },
  qishlah: {
    nameFr: 'Chevalier de Qishlah', nameUr: 'القشلہ کا شہسوار',
    descFr: 'Honneur pour les visiteurs de ce palais historique au cœur de Hail.',
    descUr: 'قصر القشلہ کی پہچان پر — حائل کے اس تاریخی مقام کے معزز زائرین کے لیے۔',
  },
};

export function badgeLabel(badge, lang) {
  if (lang === 'en') return badge.nameEn;
  if (lang === 'fr') return BADGE_I18N[badge.id]?.nameFr || badge.nameEn;
  if (lang === 'ur') return BADGE_I18N[badge.id]?.nameUr || badge.nameEn;
  return badge.nameAr;
}

export function badgeDesc(badge, lang) {
  if (lang === 'en') return badge.descEn;
  if (lang === 'fr') return BADGE_I18N[badge.id]?.descFr || badge.descEn;
  if (lang === 'ur') return BADGE_I18N[badge.id]?.descUr || badge.descEn;
  return badge.descAr;
}

export function landmarkLabel(landmark, lang) {
  if (!landmark) return '';
  if (lang === 'ar') return landmark.nameAr;
  return LANDMARK_I18N[landmark.id]?.[lang] || landmark.nameAr;
}
