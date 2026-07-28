/**
 * لوحة الأثر — صفحة إدارية منفصلة (لا تظهر للزوار)
 * ▶ Vercel: https://your-app.vercel.app/admin.html
 * ▶ محلي: http://localhost:3003/admin.html
 */
import { initAdminPage } from './platform.js';
import { landmarkLabel } from './i18n.js';

const ADMIN_LANDMARKS = {
  jubbah_rock:     { id: 'jubbah_rock', nameAr: 'نقوش جبة الصخرية' },
  shuwaymis:       { id: 'shuwaymis', nameAr: 'آثار الشويمس' },
  airif_fort:      { id: 'airif_fort', nameAr: 'قلعة عيرف' },
  barzan_palace:   { id: 'barzan_palace', nameAr: 'قصر برزان' },
  aishiyah_palace: { id: 'aishiyah_palace', nameAr: 'قصر العشية' },
  hail_museum:     { id: 'hail_museum', nameAr: 'متحف حائل الإقليمي' },
  qishlah:         { id: 'qishlah', nameAr: 'قصر القشلة' },
};

function getAdminLang() {
  const id = localStorage.getItem('hakaia_lang') || 'ar';
  return {
    id,
    dir: id === 'ar' || id === 'ur' ? 'rtl' : 'ltr',
    htmlLang: id === 'ur' ? 'ur' : id,
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const lang = getAdminLang();
  document.documentElement.lang = lang.htmlLang;
  document.documentElement.dir = lang.dir;

  initAdminPage({
    getLang: getAdminLang,
    LANDMARKS: ADMIN_LANDMARKS,
    getLandmarkName: (id) => landmarkLabel(ADMIN_LANDMARKS[id], getAdminLang().id),
  });
});
