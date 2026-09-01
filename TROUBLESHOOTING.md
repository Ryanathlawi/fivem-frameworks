# حلّ المشكلات

<div dir="rtl" align="right">

## للمستخدم

### ركّبت الإكستنشن وما يطلع لي إكمال

راجع بالترتيب:

</div>

| افحص | كيف |
|---|---|
| هل إضافة Lua مركّبة؟ | ابحث عن `sumneko.lua` في تبويب Extensions |
| هل المجلد المفتوح فيه `fxmanifest.lua`؟ | الإكستنشن لا يُفعَّل بدونه |
| هل حُمّلت التعريفات؟ | `Ctrl+Shift+P` ← `FiveM: Reload framework definitions` — يعرض الفريمويركات المحمّلة |
| هل المسار في الإعدادات؟ | افحص `Lua.workspace.library` في `settings.json` |

<div dir="rtl" align="right">

### الإكمال يشتغل بس يعطيني دوال فريمويرك ثاني

معناها أن الاكتشاف التلقائي ما لقى فريمويركًا محدّدًا فحمّلها كلها. حدّدها
بنفسك:

</div>

```jsonc
{ "fivemFrameworks.frameworks": ["qbx"] }
```

<div dir="rtl" align="right">

### `Ctrl+Space` بعد `Player.` ما يعطي شي في QBCore

تأكد أن المتغيّر جاي من دالة معروفة:

</div>

```lua
local Player = QBCore.Functions.GetPlayer(source)  -- ✅ يعرف النوع
local Player = SomeCustomGetter(source)            -- ❌ نوعه مجهول
```

<div dir="rtl" align="right">

في الحالة الثانية اكتب النوع بنفسك فوق السطر:

</div>

```lua
---@type QBCorePlayer
local Player = SomeCustomGetter(source)
```

<div dir="rtl" align="right">

### يجيني تحذير `undefined-global` على دوال فايف ام الأصلية

الـ natives تأتي من `cfxlua-vscode` وهو يُركَّب تلقائيًا مع هذا الإكستنشن.
لو ظهر التحذير فالأرجح أنك أزلته — أعد تركيبه:

</div>

```bash
code --install-extension overextended.cfxlua-vscode
```

<div dir="rtl" align="right">

### التنسيق ما يشتغل مع `Shift+Alt+F`

المنسّق يأتي من `sumneko.lua`. لو كان عندك إضافة Lua أخرى تتنازع عليه،
اضبطه صراحة:

</div>

```jsonc
{ "[lua]": { "editor.defaultFormatter": "sumneko.lua" } }
```

---

<div dir="rtl" align="right">

## للمطوّر

### `tar` يفشل بـ `status: 2` عند التوليد

**العرَض:** `execFileSync('tar', [...])` يرمي خطأ بلا رسالة واضحة.

**السبب:** نسخة GNU tar المرفقة مع Git for Windows تقرأ المسار
`C:\Users\...` على أنه `host:path` أي أرشيف على جهاز بعيد، فتحاول الاتصال
وتفشل. النقطتان في `C:` هي المشكلة.

**الحل المطبَّق:** تشغيل `tar` بـ `cwd` مضبوط ومسارات نسبية بلا نقطتين.
يعمل مع GNU tar و bsdtar معًا.

### `check.js` يقول `duplicate definitions` في `qbx_exports.lua`

**السبب:** Qbox يسجّل نفس اسم التصدير على السيرفر والكلاينت
(`Notify` و `GetPlayerData` وغيرها)، فتخرج مرتين.

**الحل المطبَّق:** التصديرات تُفهرَس باسمها، وما تكرّر على الجهتين يُوسَم
`[client/server]`. والدوال العامة تُفهرَس بـ `side:name` حتى لا تختلط
نسخة الكلاينت بنسخة السيرفر.

### عدد الدوال انهار بعد التوليد

معناه أن فريمويركًا غيّر أسلوب كتابته وتوقّفت التعبيرات النمطية عن
المطابقة. `tools/check.js` يمسك هذا قبل النشر. افتح المصدر الجديد، شوف
النمط الجديد، وأضفه إلى `DEF_DOTTED` أو `DEF_ASSIGN` أو `DEF_GLOBAL`.

### `vsce package` يشتكي من ملفات ناقصة

تأكد من وجود `README.md` و `LICENSE` و `icon.png`. الأخير يُولَّد بـ:

</div>

```bash
node tools/icon.js
```

<div dir="rtl" align="right">

### أبي أختبر التعريفات بدون ما أفتح المحرّر

خادم اللغة يملك وضع فحص من سطر الأوامر. أنشئ مجلدًا فيه `.luarc.json`
يشير إلى `library/` وملف Lua يستدعي دوال الفريمويرك، ثم:

</div>

```bash
lua-language-server --check <folder> --checklevel=Warning --logpath=<logs>
```

<div dir="rtl" align="right">

الملف التنفيذي داخل مجلد إضافة `sumneko.lua` تحت `server/bin/`.

</div>
