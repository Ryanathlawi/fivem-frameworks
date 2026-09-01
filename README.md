# FiveM Frameworks IntelliSense

<div dir="rtl" align="right">

إكستنشن لـ VS Code يجمع لك دوال فريمويركات فايف ام كلها في مكان واحد، وأنت
تكتب يطلع لك الاقتراح والشرح والباراميترات — بدون ما تفتح الدوكيومنتيشن ولا
تروح تدوّر في `qb-core` وش اسم الدالة بالضبط.

يدعم ثلاث فريمويركات: **QBCore** و **Qbox (qbx_core)** و **ESX**.

</div>

<div dir="rtl" align="right">

## وش يسوي بالضبط

| الشي | التفاصيل |
|---|---|
| **إكمال تلقائي** | تكتب `QBCore.Functions.` ويطلع لك كل الدوال مع شرحها |
| **شرح عند الوقوف** | توقف على أي دالة يجيك الوصف والباراميترات وش ترجّع |
| **مساعدة التواقيع** | تفتح قوس ويوريك الباراميترات وحدة وحدة وأنت تكتب |
| **الانتقال للتعريف** | `F12` على أي دالة يوديك لتعريفها |
| **تنسيق الكود** | `Shift+Alt+F` ينسّق ملف اللوا كامل |
| **سيرفر ولا كلاينت** | كل دالة مكتوب فوقها `[server]` أو `[client]` عشان ما تناديها بالغلط |

عدد الدوال المغطّاة الحين: **أكثر من ٧٣٠ دالة** موزّعة على الفريمويركات الثلاثة.

</div>

<div dir="rtl" align="right">

## وش يدعم بالتفصيل

### QBCore — ‏١٤٤ دالة

</div>

| تكتب | يطلع لك |
|---|---|
| `QBCore.Functions.` | جلب اللاعبين · الكولباكات · المركبات · الأغراض · البَكِتس |
| `QBCore.Player.` | تسجيل الدخول والخروج · الحفظ · الشخصيات |
| `QBCore.Shared.` | الأغراض والوظائف والعصابات والأسلحة |
| `Player.Functions.` | الفلوس · الوظيفة · العصابة · الميتاداتا · السمعة |
| `QBCore.Commands.` | إضافة الأوامر وحذفها |

<div dir="rtl" align="right">

كائن اللاعب موصول تلقائيًا — أول ما تكتب:

</div>

```lua
local Player = QBCore.Functions.GetPlayer(source)
Player.Functions.       -- ← يعرف نوعه ويكمّل لك دواله
```

<div dir="rtl" align="right">

### Qbox — ‏١٦٤ دالة و ‏١٠٠ تصدير و ‏٤٦ صنف

</div>

| تكتب | يطلع لك |
|---|---|
| `exports.qbx_core:` | كل تصديرات Qbox، سيرفر وكلاينت |
| `qbx.` | مكتبة الأدوات: `string` · `math` · `table` · `array` |

<div dir="rtl" align="right">

Qbox هو الأغنى بالأنواع — الأصناف والقوائم المحدودة محمّلة كلها، فلو كتبت
نوع إشعار غلط ينبّهك قبل ما تشغّل السيرفر:

</div>

```lua
exports.qbx_core:Notify('تم', 'succes')  -- ← ينبّهك: 'success' مو 'succes'
```

<div dir="rtl" align="right">

### ESX — ‏٤٢٣ دالة و ‏٣٨ صنف

</div>

| تكتب | يطلع لك |
|---|---|
| `ESX.` | اللاعبين · الكولباكات · الأوامر · الأغراض القابلة للاستخدام |
| `xPlayer.` | الفلوس والحسابات · المخزون · الوظيفة · الأسلحة |
| `ESX.Game.` · `ESX.UI.` | أدوات الكلاينت والواجهات |

<div dir="rtl" align="right">

ESX أدقّ فريمويرك في توثيقه، فتجي معه أنواع كاملة مثل `ESXAccount` و
`ESXJob` و `ESXInventoryItem`، ويمسك أخطاء حقيقية:

</div>

```lua
local xPlayer = ESX.GetPlayerFromId(source)
xPlayer.setJob('police', 2)   -- ← ينبّهك: الرتبة string مو رقم
```

<div dir="rtl" align="right">

</div>

<div dir="rtl" align="right">

## التركيب

من داخل VS Code: افتح تبويب **Extensions** ودوّر:

</div>

```
FiveM Frameworks IntelliSense
```

<div dir="rtl" align="right">

ركّبه وخلاص. بيركّب معه تلقائيًا إكستنشن **Lua** حق `sumneko` لأنه هو اللي
يشغّل الإكمال والتنسيق — ما تحتاج تسوي شي.

بعدها افتح مجلد سيرفرك أو مجلد السكربت (أي مجلد فيه `fxmanifest.lua`)
والإكستنشن يشتغل لحاله.

</div>

<div dir="rtl" align="right">

## كيف يعرف أي فريمويرك عندك

يشوف الموارد الموجودة في المجلد المفتوح:

| لو لقى | يحمّل تعريفات |
|---|---|
| `qb-core` | QBCore |
| `qbx_core` | Qbox |
| `es_extended` | ESX |

ولو ما لقى ولا واحد، يحمّلها كلها عشان ما تقعد بلا إكمال.

تبي تختار بنفسك؟ من الإعدادات:

</div>

```jsonc
{
  // "auto" أو أي مزيج من: "qbcore", "qbx", "esx"
  "fivemFrameworks.frameworks": ["qbx"]
}
```

<div dir="rtl" align="right">

وفيه أمر جاهز من لوحة الأوامر (`Ctrl+Shift+P`):

</div>

```
FiveM: Reload framework definitions
```

<div dir="rtl" align="right">

## من وين جايّة التعريفات

مو مكتوبة بالإيد — تتسحب من مستودعات الفريمويركات الرسمية نفسها، وتتولّد
منها ملفات تعريف يفهمها Lua Language Server:

</div>

| Framework | Source |
|---|---|
| QBCore | [`qbcore-fivem/qb-core`](https://github.com/qbcore-fivem/qb-core) |
| Qbox | [`Qbox-project/qbx_core`](https://github.com/Qbox-project/qbx_core) |
| ESX | [`esx-framework/esx_core`](https://github.com/esx-framework/esx_core) |

<div dir="rtl" align="right">

يعني لمن يطلع تحديث لأي فريمويرك، تحديث التعريفات أمر واحد:

</div>

```bash
node tools/generate.js
```

<div dir="rtl" align="right">

وبعده تتأكد إن كل شي طلع سليم:

</div>

```bash
node tools/check.js
```

<div dir="rtl" align="right">

## المتطلبات

- VS Code إصدار `1.80` أو أحدث
- إكستنشن [Lua](https://marketplace.visualstudio.com/items?itemName=sumneko.lua) حق `sumneko` — يتركّب تلقائيًا معه

## ملاحظات

- الإكستنشن ما يغيّر إعداداتك إلا شيئين: يضيف مسار التعريفات لـ
  `Lua.workspace.library`، ويخلي `Lua.runtime.version` على `LuaJIT` لأن
  هذا اللي يشغّله فايف ام فعليًا.
- ما يفتح اتصال شبكة، وما يشغّل عمليات، وما يقرأ ملفاتك. ملفات التعريف
  موسومة `---@meta` يعني تُقرأ كأنواع ولا تُنفَّذ أبدًا.

## المطوّر

**ريان العذلوي** — مطوّر سكربتات وسيرفرات فايف ام.

سويت هذا الإكستنشن لأني أشتغل على أكثر من سيرفر وكل واحد على فريمويرك
مختلف، وتعبت وأنا أفتح مجلد `qb-core` و `es_extended` كل شوي أدوّر اسم
دالة أو ترتيب باراميتراتها. صار عندي فأحببت أنشره لغيري.

</div>

| | |
|---|---|
| **GitHub** | [Ryanathlawi](https://github.com/Ryanathlawi) |
| **المستودع** | [fivem-frameworks](https://github.com/Ryanathlawi/fivem-frameworks) |
| **الإبلاغ عن مشكلة** | [Issues](https://github.com/Ryanathlawi/fivem-frameworks/issues) |
| **الرخصة** | MIT — استخدمه وعدّله وانشره بحرّية |

<div dir="rtl" align="right">

لقيت خطأ في التعريفات؟ أو تبي فريمويرك ثاني يتدعّم؟ افتح Issue وأشوفها.

</div>

---

## In English

A VS Code extension that bundles the APIs of the three major FiveM frameworks —
**QBCore**, **Qbox (qbx_core)** and **ESX** — into one install.

Over 730 functions with completion, hover documentation, signature help,
go-to-definition and formatting. Every function is tagged `[server]` or
`[client]` so you never call one on the wrong side.

| Framework | Coverage |
|---|---|
| **QBCore** | 144 functions — `QBCore.Functions.*`, `QBCore.Player.*`, `QBCore.Shared.*`, and player methods typed through `GetPlayer` |
| **Qbox** | 164 functions, 100 exports, 46 classes — `exports.qbx_core:*` and the `qbx.*` utility library |
| **ESX** | 423 functions, 38 classes — `ESX.*`, `xPlayer.*`, `ESX.Game.*`, `ESX.UI.*` |

Definitions are generated straight from each framework's official repository
rather than written by hand, so a framework update is one command away
(`node tools/generate.js`). Open any folder containing an `fxmanifest.lua`
and the matching framework is detected and loaded automatically.

Completion and formatting are powered by the
[Lua](https://marketplace.visualstudio.com/items?itemName=sumneko.lua)
language server, which installs alongside this extension.

Built by **Rayan Athlawi** ([Ryanathlawi](https://github.com/Ryanathlawi)), a
FiveM script and server developer, out of the daily annoyance of digging
through `qb-core` and `es_extended` to remember a function name. MIT licensed —
[issues and requests welcome](https://github.com/Ryanathlawi/fivem-frameworks/issues).
