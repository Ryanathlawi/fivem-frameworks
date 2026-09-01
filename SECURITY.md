# الأمان

<div dir="rtl" align="right">

## الأسرار التي يحتاجها المشروع

للمشروع سرٌّ واحد فقط، ويُستخدم عند النشر لا عند التشغيل:

</div>

| السر | الغرض | من أين يُقرأ |
|---|---|---|
| `VSCE_PAT` | نشر الإكستنشن على Visual Studio Marketplace | متغيّر بيئة، أو إدخال يدوي عند تشغيل `vsce publish` |

<div dir="rtl" align="right">

هذا التوكن هو **Personal Access Token** من Azure DevOps بصلاحية
`Marketplace → Manage`. من يملكه يستطيع نشر أي إصدار باسم الناشر، بما فيها
إصدار خبيث يُثبَّت تلقائيًا على أجهزة كل من ركّب الإكستنشن. تعامل معه
معاملة كلمة المرور.

## ما الذي يجب ألّا يدخل git أبدًا

</div>

| الشيء | لماذا |
|---|---|
| `VSCE_PAT` أو أي ملف `.env` | نشر باسمك بيد غيرك |
| `.pat` · `.vsce-token` | نفس السبب |
| `node_modules/` | لا سبب لوجوده، ويضخّم المستودع |
| `*.vsix` | مخرَج بناء، يُولَّد بأمر واحد |

<div dir="rtl" align="right">

كلها مغطّاة في `.gitignore` منذ أول commit — راجعه قبل أي إضافة جديدة.

## كيف تُدوَّر المفاتيح عند التسريب

لو ظهر `VSCE_PAT` في commit أو في لقطة شاشة أو في سجلّ CI:

</div>

1. <div dir="rtl" align="right">افتح `dev.azure.com` ← <code>User settings</code> ← <code>Personal Access Tokens</code>.</div>
2. <div dir="rtl" align="right">اضغط <code>Revoke</code> على التوكن المكشوف — قبل أي خطوة أخرى.</div>
3. <div dir="rtl" align="right">أنشئ توكنًا جديدًا بنفس الصلاحية <code>Marketplace → Manage</code>.</div>
4. <div dir="rtl" align="right">افحص إصدارات الإكستنشن على <code>marketplace.visualstudio.com/manage</code> وتأكد ألّا يوجد إصدار لم تنشره أنت.</div>
5. <div dir="rtl" align="right">لو وُجد إصدار غريب: أزله فورًا وانشر إصدارًا أعلى نظيفًا.</div>

<div dir="rtl" align="right">

> إزالة السطر من الكود ودفع commit جديد **لا تكفي** — التاريخ يحتفظ به،
> وأي شخص نسخ المستودع يملكه. الإبطال أولًا، دائمًا.

## سطح الهجوم في الإكستنشن نفسه

الإكستنشن لا يفتح شبكة ولا يشغّل عمليات فرعية ولا يقرأ ملفات المستخدم.
كل ما يفعله وقت التشغيل:

</div>

- <div dir="rtl" align="right">قراءة إعداد <code>fivemFrameworks.frameworks</code>.</div>
- <div dir="rtl" align="right">البحث عن <code>fxmanifest.lua</code> داخل مساحة العمل.</div>
- <div dir="rtl" align="right">تعديل مفتاحين في الإعدادات: <code>Lua.workspace.library</code> و <code>Lua.runtime.version</code>.</div>

<div dir="rtl" align="right">

ملفات `library/*.lua` تبدأ كلها بـ `---@meta`، ومعنى ذلك أن خادم اللغة
يقرؤها كتعريفات أنواع ولا ينفّذها أبدًا. لا يوجد `eval` ولا تحميل ديناميكي.

**النقطة الوحيدة التي تستحق الانتباه:** المولّد `tools/generate.js` يُنزّل
كودًا من الإنترنت. هو أداة تطوير لا تُشحن مع الحزمة، لكن لا تشغّله إلا
على المستودعات الرسمية المذكورة في `FRAMEWORKS` داخل الملف، وراجع
`git diff` على `library/` قبل أي نشر — التعريفات المولّدة يجب أن تحتوي
تعليقات وتواقيع فقط، لا كودًا قابلًا للتنفيذ.

## انكشاف معروف قائم

لا يوجد حاليًا.

</div>
