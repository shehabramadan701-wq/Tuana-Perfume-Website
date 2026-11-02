# TUANA — موقع عطور عربية (Node.js + React + MySQL)

متجر عطور عربي (عود، خمرة، عطور، بخور) بألوان فاتحة وروح عربية أصيلة، عربي وإنجليزي (الإنجليزي بذوق إيطالي).
فيه **مقدمة متحركة** لزجاجة البرفان وهي نازلة من السما مع اسم البراند، و**صفحة دفع بالفيزا/ماستركارد**، و**داشبورد** للحسابات بفلاتر وتصدير Excel.

---

## 📁 تنظيم الفولدرات

```
Tuana-Perfume-Website/
├── database/
│   └── schema.sql            ← قاعدة البيانات + منتجات وطلبات تجريبية
│
├── server/                   ← الباك إند (Node.js + Express)
│   ├── index.js              ← نقطة تشغيل السيرفر
│   ├── db.js                 ← الاتصال بـ MySQL
│   ├── .env.example          ← الإعدادات (انسخه باسم .env)
│   ├── middleware/auth.js    ← حماية الداشبورد بتسجيل الدخول
│   ├── services/payment.js   ← بوابة الدفع (مخفية عن العميل)
│   └── routes/
│       ├── products.js       ← جلب المنتجات
│       ├── orders.js         ← إنشاء الطلب وتأكيد الدفع
│       └── admin.js          ← الداشبورد + الفلاتر + Excel
│
└── client/                   ← الفرونت إند (React)
    ├── index.html            ← الخطوط (Aref Ruqaa / Amiri / Italiana / Cormorant)
    └── src/
        ├── App.jsx           ← الصفحات والروابط
        ├── api.js            ← الاتصال بالسيرفر + تنسيق الأسعار
        ├── i18n/
        │   └── translations.js  ← كل نصوص الموقع عربي وإنجليزي ✏️
        ├── context/          ← الحقيبة (السلة) + إعدادات المحل
        ├── components/       ← Intro (المقدمة) / Navbar / ProductCard / Bottle ...
        │   └── payment/      ← فورم الفيزا
        ├── pages/            ← Home / Checkout / Success
        │   └── admin/        ← Login / Dashboard
        └── styles/
            ├── main.css      ← ألوان وشكل الموقع 🎨
            └── admin.css     ← شكل الداشبورد
```

---

## 🔗 لينك أونلاين تبعته للعميل (GitHub Pages — مجاني وشغال على طول)

**اللينك:** https://shehabramadan701-wq.github.io/Tuana-Perfume-Website/

نسخة عرض (Demo) من الموقع بتشتغل من غير سيرفر ولا MySQL: العميل يقدر يتفرج على الموقع، يضيف للحقيبة، يجرب الدفع (من غير خصم فلوس)،
ويدخل الداشبورد من `/#/admin` (بيانات الدخول مكتوبة لوحدها).
الطلبات اللي بتتعمل في النسخة دي بتتحفظ في متصفح الشخص نفسه بس.

**التفعيل (مرة واحدة بس):**
1. في صفحة الريبو على GitHub ← **Settings** ← **Pages**.
2. تحت **Build and deployment** ← **Source** اختار **GitHub Actions**.
3. روح تبويب **Actions** ← **Online preview (GitHub Pages)** ← **Run workflow**.
4. بعد دقيقتين اللينك يشتغل. وبعد كده أي تعديل ترفعه بيتحدّث في اللينك لوحده.

> ملفات النسخة دي: `client/src/demo/mockApi.js` (بيانات العرض) و `.github/workflows/pages.yml` (الرفع التلقائي).
> الموقع الحقيقي (بالدفع والـ MySQL) مش بيستخدم الملفات دي خالص.

---

## ☁️ تشغيل الموقع من GitHub مباشرة (Codespaces) — من غير ما تسطب حاجة

1. افتح اللينك ده:
   https://codespaces.new/shehabramadan701-wq/Tuana-Perfume-Website/tree/claude/compassionate-fermi-sip98n
2. اضغط **Create codespace**.
3. استنى 3-5 دقايق أول مرة (بيسطب MySQL و Node وكل حاجة لوحده).
4. الموقع بيفتح لوحده — ولو مفتحش: تبويب **PORTS** تحت ← port **5000** ← اضغط على أيقونة الكرة 🌐.
   - الداشبورد: نفس اللينك + `/admin`  (الإيميل `admin@tuana.com` والباسورد `change-me-123`)
   - عشان تبعت اللينك لحد تاني: كليك يمين على 5000 ← **Port Visibility** ← **Public**.

> الـ Codespace بيقفل لوحده لو مفيش استخدام (حوالي 30 دقيقة). لما تفتحه تاني من github.com/codespaces بيرجع يشتغل.

---

## 🚀 التشغيل لأول مرة على جهازك

المطلوب: **Node.js 18+** و **MySQL** (مثلاً XAMPP).

### 1) قاعدة البيانات
- شغّل MySQL من XAMPP.
- افتح http://localhost/phpmyadmin ← **Import** ← اختار ملف `database/schema.sql` ← **Go**.
  (أو من الـ terminal: `mysql -u root -p < database/schema.sql`)

### 2) الإعدادات
انسخ ملف `server/.env.example` وسمّيه `server/.env`، وعدّل فيه:
- بيانات MySQL (`DB_USER` و `DB_PASSWORD`)
- إيميل وباسورد الداشبورد (`ADMIN_EMAIL` و `ADMIN_PASSWORD`)
- `JWT_SECRET` اكتب أي كلام طويل عشوائي

### 3) تسطيب وتشغيل
من فولدر المشروع الرئيسي:

```bash
npm run setup
```

```bash
npm run dev
```

- الموقع: http://localhost:3000
- الداشبورد: http://localhost:3000/admin  (بالإيميل والباسورد اللي في `.env`)

> المقدمة المتحركة بتظهر مرة واحدة في كل زيارة. عشان تشوفها تاني افتح الموقع في تاب جديد.

---

## 💳 الدفع

العميل بيشوف بس فورم **فيزا / ماستركارد** باسم موقعك — مفيش اسم بوابة دفع ظاهر.

| الوضع | الإعداد في `.env` | الوصف |
|---|---|---|
| تجريبي | `PAYMENT_MODE=demo` | للتجربة، مفيش فلوس بتتخصم. اكتب أي رقم كارت 16 رقم (مثلاً `4242 4242 4242 4242`). |
| حقيقي | `PAYMENT_MODE=stripe` | دفع حقيقي. حط مفاتيح Stripe في `STRIPE_SECRET_KEY` و `STRIPE_PUBLISHABLE_KEY`. |

**مع Stripe:** خانات رقم الكارت والتاريخ والـ CVC بتكون خانات آمنة من Stripe بس متظبطة بنفس شكل وخط موقعك،
فالعميل مش بيحس إنه خرج من الموقع. رقم الكارت **مش بيعدّي على السيرفر بتاعك خالص** — وده مهم جداً للأمان (قانون PCI)،
وبيوفر عليك مسؤولية حماية بيانات الكروت.

للتجربة على Stripe بمفاتيح `sk_test_` / `pk_test_` استخدم الكارت `4242 4242 4242 4242` بأي تاريخ مستقبلي وأي CVC.

> ⚠️ **ملاحظة مهمة:** Stripe مش بيفتح حسابات لشركات مسجلة في مصر. لو شغلك من مصر، بوابة **Paymob** هي الأنسب.
> كل كود البوابة في ملف واحد بس: `server/services/payment.js` (دالتين: `createPayment` و `checkPayment`)،
> فلو حبيت تغيّر لـ Paymob بتعدّل الملف ده + فورم الكارت في `client/src/components/payment/`.

---

## ✏️ تعديلات سريعة

| عايز تغيّر | فين |
|---|---|
| النصوص (عربي/إنجليزي) | `client/src/i18n/translations.js` |
| الألوان | أول الملف `client/src/styles/main.css` (`--gold`, `--oud`, `--ivory` ...) |
| اسم البراند في المقدمة | `client/src/components/Intro.jsx` |
| رقم التليفون والإيميل | `client/src/components/Footer.jsx` |
| العملة | `CURRENCY` في `server/.env` |
| المنتجات | جدول `products` من phpMyAdmin |

**صور المنتجات:** لو مفيش صورة، الموقع بيرسم زجاجة بلون المنتج (عمود `color`).
لو عندك صورة حطها في `client/public/images/` واكتب في عمود `image_url` مثلاً `/images/oud.png`.

**مسح الطلبات التجريبية** قبل ما تفتح المحل (من phpMyAdmin ← SQL):
```sql
DELETE FROM orders;
```

---

## 🌍 الرفع على سيرفر (Production)

```bash
npm run build
```

```bash
npm start
```

السيرفر بيشغّل الموقع والـ API مع بعض على البورت اللي في `PORT` (افتراضي 5000).

قبل الرفع: غيّر `ADMIN_PASSWORD` و `JWT_SECRET`، وخلي `PAYMENT_MODE=stripe`.
