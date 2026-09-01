# FiveM Frameworks IntelliSense

<div dir="rtl" align="right">

إكستنشن لـ VS Code يجمع لك دوال فريمويركات فايف ام كلها في مكان واحد، وأنت
تكتب يطلع لك الاقتراح والشرح والباراميترات — بدون ما تفتح الدوكيومنتيشن ولا
تروح تدوّر في `qb-core` وش اسم الدالة بالضبط.

يدعم ثلاث فريمويركات — **QBCore** و **Qbox (qbx_core)** و **ESX** — وخمسة
موارد تستخدمها كل يوم: **ox_lib** و **ox_inventory** و **qb-target** و
**qb-menu** و **qb-inventory**. وتجي معه دوال فايف ام الأصلية (natives).

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

عدد الدوال المغطّاة الحين: **‏١١٠٢ دالة** و **‏٢٠٣ صنف** — بدون احتساب الـ natives.

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

### Qbox — ‏١٣٦ دالة و ‏٤٦ صنف

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

### ESX — ‏٣٤٣ دالة و ‏٣٨ صنف

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

### الموارد

مو بس الفريمويركات — الموارد اللي تقعد فيها أكثر من الفريمويرك نفسه:

</div>

| المورد | التغطية | تكتب |
|---|---|---|
| **ox_lib** | ‏٢٥٧ دالة · ‏٨٧ صنف | `lib.` |
| **ox_inventory** | ‏٩٩ دالة · ‏١١ صنف | `exports.ox_inventory:` |
| **qb-target** | ‏٥٦ تصدير | `exports['qb-target']:` |
| **qb-inventory** | ‏٣٢ تصدير | `exports['qb-inventory']:` |
| **qb-menu** | ‏٣ تصديرات | `exports['qb-menu']:` |

<div dir="rtl" align="right">

`ox_lib` أغنى واحد فيهم من ناحية التوثيق — أغنى حتى من الفريمويركات:

</div>

```lua
lib.notify({ title = 'تم', type = 'success' })
lib.callback.await('my:callback', false)
lib.inputDialog('العنوان', { 'الحقل' })
```

<div dir="rtl" align="right">

> **ox_target غير مدعوم** — يسجّل تصديراته داخل حلقة (`exports(index, value)`)
> فأسماؤها ما تنوجد إلا وقت التشغيل، ولا يمكن استخراجها من الكود.

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

| لو لقى مجلد | يحمّل تعريفات |
|---|---|
| `qb-core` | QBCore |
| `qbx_core` | Qbox |
| `es_extended` | ESX |
| `ox_lib` | ox_lib |
| `ox_inventory` | ox_inventory |
| `qb-target` | qb-target |
| `qb-menu` | qb-menu |
| `qb-inventory` | qb-inventory |

كل واحد يُكتشف لحاله — يعني لو سيرفرك QBCore + ox_lib، تجيك تعريفات
الاثنين بس، بدون ضجيج ESX ولا Qbox.

ولو ما لقى ولا واحد، يحمّلها كلها عشان ما تقعد بلا إكمال.

تبي تختار بنفسك؟ من الإعدادات:

</div>

```jsonc
{
  // "auto" أو أي مزيج من:
  // "qbcore" · "qbx" · "esx" · "ox_lib" · "ox_inventory"
  // "qb_target" · "qb_menu" · "qb_inventory"
  "fivemFrameworks.frameworks": ["qbcore", "ox_lib"]
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

| Resource | Source |
|---|---|
| QBCore | [`qbcore-fivem/qb-core`](https://github.com/qbcore-fivem/qb-core) |
| Qbox | [`Qbox-project/qbx_core`](https://github.com/Qbox-project/qbx_core) |
| ESX | [`esx-framework/esx_core`](https://github.com/esx-framework/esx_core) |
| ox_lib | [`overextended/ox_lib`](https://github.com/overextended/ox_lib) |
| ox_inventory | [`overextended/ox_inventory`](https://github.com/overextended/ox_inventory) |
| qb-target | [`qbcore-fivem/qb-target`](https://github.com/qbcore-fivem/qb-target) |
| qb-menu | [`qbcore-fivem/qb-menu`](https://github.com/qbcore-fivem/qb-menu) |
| qb-inventory | [`qbcore-fivem/qb-inventory`](https://github.com/qbcore-fivem/qb-inventory) |

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

VS Code إصدار `1.80` أو أحدث — وبس. الباقي يتركّب معه تلقائيًا:

</div>

| يتركّب معه | ليش |
|---|---|
| [Lua](https://marketplace.visualstudio.com/items?itemName=sumneko.lua) — `sumneko` | محرّك الإكمال والتنسيق. **إجباري**، بدونه ما فيه شي |
| [cfxlua-vscode](https://marketplace.visualstudio.com/items?itemName=overextended.cfxlua-vscode) | دوال فايف ام الأصلية (natives) مثل `GetEntityCoords`. تقدر تشيله لو ما تبيه |

<div dir="rtl" align="right">

يعني تركيب واحد يعطيك: **الفريمويركات + الـ natives + التنسيق**.

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

A VS Code extension that bundles the APIs of the three major FiveM frameworks
and the resources you actually spend your day in — into one install.

1,102 functions and 203 classes with completion, hover documentation, signature
help, go-to-definition and formatting. Every function is tagged `[server]` or
`[client]` so you never call one on the wrong side.

| | Coverage |
|---|---|
| **QBCore** | 144 functions — `QBCore.Functions.*`, `QBCore.Player.*`, `QBCore.Shared.*`, and player methods typed through `GetPlayer` |
| **Qbox** | 136 functions, 46 classes — `exports.qbx_core:*` and the `qbx.*` utility library |
| **ESX** | 343 functions, 38 classes — `ESX.*`, `xPlayer.*`, `ESX.Game.*`, `ESX.UI.*` |
| **ox_lib** | 257 functions, 87 classes — the whole `lib.*` surface |
| **ox_inventory** | 99 functions, 11 classes — `exports.ox_inventory:*` |
| **qb-target** · **qb-inventory** · **qb-menu** | 91 exports |

Definitions are generated straight from each project's official repository
rather than written by hand, so an upstream update is one command away
(`node tools/generate.js`). Open any folder containing an `fxmanifest.lua` and
whatever it contains is detected and loaded — nothing else.

`ox_target` is not covered: it registers its exports in a loop, so the names
exist only at runtime and cannot be read out of the source.

One install covers frameworks, natives and formatting. Completion and
formatting come from the
[Lua](https://marketplace.visualstudio.com/items?itemName=sumneko.lua)
language server, and FiveM's own natives from
[cfxlua-vscode](https://marketplace.visualstudio.com/items?itemName=overextended.cfxlua-vscode);
both install alongside this extension, and the natives one can be removed if
you would rather not have it.

Built by **Rayan Athlawi** ([Ryanathlawi](https://github.com/Ryanathlawi)), a
FiveM script and server developer, out of the daily annoyance of digging
through `qb-core` and `es_extended` to remember a function name. MIT licensed —
[issues and requests welcome](https://github.com/Ryanathlawi/fivem-frameworks/issues).
