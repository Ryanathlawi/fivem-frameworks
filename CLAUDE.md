# تعليمات المشروع

<div dir="rtl" align="right">

## ما هذا المشروع

إكستنشن VS Code يوفّر إكمالًا تلقائيًا وشرحًا وتنسيقًا لفريمويركات فايف ام
الثلاثة. اقرأ `ARCHITECTURE.md` قبل أي تعديل — البنية غير بديهية عمدًا.

## القاعدة الأولى

**الإكستنشن حزمة بيانات، لا خادم لغة.**

كل الإكمال والشرح والتواقيع والتنسيق تأتي من `sumneko.lua`. لا تكتب
`CompletionItemProvider` ولا `HoverProvider` ولا `DocumentFormattingEditProvider`.
إن بدت ميزة ناقصة، الأرجح أنها تُحلّ بتحسين التعريفات في `library/` أو
بوسم `---@` أدق، لا بكود جديد في `extension.js`.

## القاعدة الثانية

**`library/*.lua` مولّدة — لا تحرّرها بيدك.**

أي تعديل يدوي يضيع عند أول `node tools/generate.js`. التعديل يكون في
المولّد نفسه. لو احتجت حالة خاصة لفريمويرك واحد، اتبع نمط
`typeQbPlayers()` و `qbPlayerAlias()`: دالة صغيرة مسمّاة تُستدعى لذلك
الفريمويرك وحده، مع تعليق يشرح لماذا انحرفنا عن المصدر.

## قبل أي دفعة

</div>

```bash
node tools/generate.js && node tools/check.js
```

<div dir="rtl" align="right">

`check.js` هو الحارس الوحيد. الحدود الدنيا لعدد الدوال فيه ليست تجميلًا:
لو غيّر فريمويرك أسلوب كتابته وتوقّفت التعبيرات النمطية عن المطابقة،
ينهار العدد ويفشل الفحص بدل أن تُنشر تعريفات فارغة. **لا تخفّض الحدود
لتمرير الفحص** — أصلح النمط.

## عند التحقق من عمل التعريفات

لا تكتفِ بالنظر إلى الملف المولّد. شغّل خادم اللغة نفسه:

</div>

```bash
lua-language-server --check <folder> --checklevel=Warning --logpath=<logs>
```

<div dir="rtl" align="right">

المجلد فيه `.luarc.json` يشير إلى `library/` وملف Lua يستدعي دوال
الفريمويرك. الملف التنفيذي داخل إضافة `sumneko.lua` تحت `server/bin/`.
تفاصيل أكثر في `TROUBLESHOOTING.md`.

## عادات المستودع

</div>

| العادة | التفصيل |
|---|---|
| التوثيق | ثلاثة عشر ملفًا عربيًا تُحدَّث مع العمل لا بعده |
| `README.md` | عامية سعودية — هو صفحة Marketplace وأول ما يُقرأ |
| commits | صغيرة ومتقاربة، لا دفعة ضخمة في الآخر |
| النسبة | لا تُنسب المساهمة لأي أداة، في أي commit أو وصف أو توثيق |
| الأسرار | `VSCE_PAT` لا يدخل git أبدًا — راجع `SECURITY.md` |

<div dir="rtl" align="right">

## قبل رفع إصدار

</div>

1. <div dir="rtl" align="right"><code>node tools/generate.js && node tools/check.js</code></div>
2. <div dir="rtl" align="right">راجع <code>git diff</code> على <code>library/</code> — يجب أن يكون تعليقات وتواقيع فقط، لا كودًا قابلًا للتنفيذ.</div>
3. <div dir="rtl" align="right">ارفع رقم الإصدار في <code>package.json</code>.</div>
4. <div dir="rtl" align="right">حدّث <code>STATE.md</code> و <code>LOGS.md</code>.</div>
5. <div dir="rtl" align="right"><code>npx vsce package</code> ثم ثبّت الـ <code>.vsix</code> محليًا وجرّبه فعليًا.</div>
6. <div dir="rtl" align="right">‏<code>npx vsce publish</code>.</div>

<div dir="rtl" align="right">

## ما لا يُضاف بلا طلب

natives فايف ام، وملفات snippets، وموارد غير الفريمويركات
(`ox_lib` وغيرها)، وأي اعتمادية جديدة. الأسباب في `GOAL.md` تحت
«خارج النطاق» وفي `DECISIONS.md`. كل واحدة منها رُفضت بقرار، لا سهوًا.

</div>
