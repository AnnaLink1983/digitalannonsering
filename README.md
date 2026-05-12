# Desktop Template — ICA Elements Prototyping (Desktop-Only)

Skal för att skapa **desktop-prototyper** med ICA Elements designsystem.
Optimerat för att gå snabbt från prompt till klickbar desktop-vy med en
kodagent.

> Behöver du mobilstöd? Använd `mobile-template/`. Behöver du både/responsivt?
> Använd `project-template/`. Den här templaten bygger inga mobila vyer, har
> ingen bottom-nav, inga slide-transitions och antar viewport ≥ 1024px.

---

## Kom igång

1. Kopiera hela den här mappen och döp om den till ditt projektnamn
2. Öppna den nya mappen i Claude Code
3. Börja prototypa — agenten sköter setup automatiskt vid första start

```bash
chmod +x setup.sh && ./setup.sh
cd prototyp/app && npm run dev
```

Vid första körning startar appen direkt med en meny-hub som länkar till tre
demo-mallar (master-detail, datatabell, formulär). Klicka runt i webbläsaren
för att se att DesktopNav, layout-two-columns och tabellen fungerar.

---

## Vad gör den här templaten snabbare?

Jämfört med `project-template/`:

- **Desktop-only.** Inga mobila vyer, inga responsiva brytpunkter under
  1024px, inga slide-transitions, ingen bottom-nav. App.vue är ~110 rader
  istället för 762.
- **3 färdiga vy-mallar** under `prototyp/app/src/views/_templates/`:
  `MasterDetailView.vue`, `DataTableView.vue`, `ListWithCreateView.vue`. Lyfta från
  `project-template`s `TwoColumnView.vue` och `TabellView.vue` (med
  mobile-grenarna borttagna) plus en ny ListWithCreateView (lista + skapa-dialog).
- **En CLAUDE.md istället för tre + två SKILL.md.** Hela bas-kontexten är
  ~470 rader istället för ~2 500.
- **Inbyggda cheat-sheets.** Tokens, event-namn, OCH de två desktop-fällorna
  (layout-two-columns header-slot + tabellrad = card-row) ligger som hårda
  regler med kodexempel direkt i CLAUDE.md.
- **Core/Extra-split i `components.md`.** 21 Core-komponenter listade först
  — de räcker till ~80% av vyerna. Resten finns kvar som "slå upp vid behov".

---

## Vad ingår

```
desktop-template/
├── .claude/
│   └── CLAUDE.md            ← agentens enda ingångsfil (~320 rader)
├── design-system/
│   ├── README.md            ← navigation
│   ├── components.md        ← Core + Extra-tabeller (21 Core)
│   ├── tokens.md            ← färger, spacing, typografi
│   ├── PATTERNS.md          ← layout-two-columns, datatabell, sök+filter,
│   │                          dialoger, desktop-nav, workarounds
│   ├── WORKAROUNDS.md       ← stub (folded i PATTERNS.md)
│   ├── layouts/             ← layout-referensbilder + index
│   └── references/          ← api.md per komponent
├── prototyp/
│   ├── .claude/CLAUDE.md    ← projektspecifik (vyer, beslut)
│   ├── .claude/context/
│   │   ├── aktiva-beslut.md
│   │   ├── komponenter-i-bruk.md
│   │   └── desktop-nav.md   ← API för DesktopNav-komponenten
│   ├── node_modules/@ica-azure/ica-elements/  ← privat designsystem-paket
│   └── app/                 ← Vue 3 + Vite app-skal
│       └── src/
│           ├── App.vue              ← DesktopNav + v-if-baserad vy-switch
│           ├── main.js              ← ICA Elements imports
│           ├── style.css            ← tokens i :root
│           ├── views/
│           │   └── _templates/      ← 3 mall-vyer att kopiera
│           ├── components/
│           │   └── DesktopNav.vue   ← top-nav (project-komponent)
│           ├── utils/
│           └── stubs/
├── README.md                ← den här filen
├── TROUBLESHOOTING.md       ← felsökning (delas mellan templates)
└── setup.sh                 ← installer
```

---

## DesktopNav — top-nav-komponenten

`DesktopNav.vue` är inte en ICA Elements web component utan en
projekt-specifik Vue-komponent som visuellt efterliknar MinButik-appens
site-header.

Den har props för aktiv app — labelt, färg och ikon — så samma komponent
kan återanvändas mellan prototyper för olika MinButik-appar:

```vue
<DesktopNav
  active-app-label="TESTAPP"
  active-app-color="#626262"
  active-app-icon-tag="mb-ica-icon-play"
/>
```

Defaults matchar Order & Leverans. Fullständig API: se
`prototyp/.claude/context/desktop-nav.md`.

---

## Ny dator / byter maskin

Kör `./setup.sh` från projektroten. Scriptet detekterar automatiskt om
`node_modules/` installerades på en annan maskin och installerar om med
lokal npm om så behövs.

## Felsökning

**Dev-servern kraschar med "Cannot find native binding"**
`prototyp/app/node_modules/` har kopierats från en annan dator — native
bindings (rolldown, lightningcss) är plattformsspecifika och måste
installeras om på den lokala maskinen. Kör `./setup.sh` från roten.

**`@ica-azure/ica-elements` saknas**
Paketet ligger på ICAs privata registry och kan inte hämtas via npm.
Kopiera mappen `prototyp/node_modules/@ica-azure/` manuellt från en
befintlig prototyp.

**Node.js saknas eller är för gammal**
Vite 8 kräver Node 20.19+. Installera via [nvm](https://github.com/nvm-sh/nvm),
Homebrew (`brew install node`) eller [nodejs.org](https://nodejs.org/).

Mer detaljerad logg i `TROUBLESHOOTING.md`.
