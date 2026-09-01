# FiveM Frameworks IntelliSense

<div dir="rtl" align="right">

إكستنشن لـ VS Code يجمع لك دوال فريمويركات فايف ام كلها في مكان واحد، وأنت
تكتب يطلع لك الاقتراح والشرح والباراميترات — بدون ما تفتح الدوكيومنتيشن ولا
تروح تدوّر في `qb-core` وش اسم الدالة بالضبط.

يدعم أربع فريمويركات: **QBCore** و **Qbox (qbx_core)** و **ESX** و **vRP**.

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

عدد الدوال المغطّاة الحين: **أكثر من ١٢٠٠ دالة** موزّعة على الفريمويركات الأربعة.

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
| `vrp` | vRP |

ولو ما لقى ولا واحد، يحمّلها كلها عشان ما تقعد بلا إكمال.

تبي تختار بنفسك؟ من الإعدادات:

</div>

```jsonc
{
  // "auto" أو أي مزيج من: "qbcore", "qbx", "esx", "vrp"
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
| vRP | [`vRP-framework/vRP`](https://github.com/vRP-framework/vRP) |

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

- تعريفات **vRP** مسحوبة من `vRP-framework/vRP` وهي نسخة vRP2 بأسلوب
  `vRP:method`. لو سيرفرك على vRP1 القديم بأسلوب `Proxy.getInterface`،
  قول وأضيفها.
- الإكستنشن ما يغيّر إعداداتك إلا شيئين: يضيف مسار التعريفات لـ
  `Lua.workspace.library`، ويخلي `Lua.runtime.version` على `LuaJIT` لأن
  هذا اللي يشغّله فايف ام فعليًا.

</div>

---

## In English

A VS Code extension that bundles the APIs of the four major FiveM frameworks —
**QBCore**, **Qbox (qbx_core)**, **ESX** and **vRP** — into one install.

Over 1,200 functions with completion, hover documentation, signature help,
go-to-definition and formatting. Every function is tagged `[server]` or
`[client]` so you never call one on the wrong side.

Definitions are generated straight from each framework's official repository
rather than written by hand, so a framework update is one command away
(`node tools/generate.js`). Open any folder containing an `fxmanifest.lua`
and the matching framework is detected and loaded automatically.

Completion and formatting are powered by the
[Lua](https://marketplace.visualstudio.com/items?itemName=sumneko.lua)
language server, which installs alongside this extension.
