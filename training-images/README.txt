═══════════════════════════════════════════════════════════
  حكايا حائل — صور التدريب (Teachable Machine)
═══════════════════════════════════════════════════════════

▶ الهيكل الحالي:

  jubbah/       → نقوش جبة الصخرية     (jubbah_01.png)
  shuwaymis/    → آثار الشويمس          (shuwaymis_01.png)
  airif/        → قلعة عيرف             (airif_01.png)

▶ أسماء الفئات في Teachable Machine (استخدمها حرفياً):
  jubbah  |  shuwaymis  |  airif

▶ بعد التدريب ضع الرابط في app.js:
  TEACHABLE_MACHINE_MODEL_URL: 'https://teachablemachine.withgoogle.com/models/XXXXX/'
  DEMO_MODE: false

▶ ملاحظة: تحتاج 15–30 صورة على الأقل لكل فئة للدقة الجيدة.
  أضف المزيد من الصور في نفس المجلدات ثم ارفعها في Teachable Machine.

▶ الربط في التطبيق:
  jubbah     → قصة + بطاقات جبة (مطبخ الجبلين، حرفيات السدو...)
  shuwaymis  → قصة + بطاقات الشويمس (تمور الفيد، مقهى دلال...)
  airif      → قصة + بطاقات قلعة عيرف (منحوتات عيرف، عربة شاي...)
