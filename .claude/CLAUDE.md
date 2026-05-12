# Desktop Template — ICA Elements Prototyping (Desktop-Only)

> Desktop-prototyper med ICA Elements. **Endast desktop-vyer (≥ 1024px).**
> Ingen responsiv brytning, ingen bottom-nav, inga slide-transitions.
> Bygger du för mobil eller mixed: använd `mobile-template/` respektive
> `project-template/`.

---

## Innan du svarar på något — kör auto-bootstrap

Kör `./setup.sh` som första åtgärd i varje session — INNAN du svarar
användaren på något. Scriptet är idempotent: snabbt när allt redan funkar
(< 2 sek), läker automatiskt om något är trasigt (saknad node, fel
plattform-bindings i node_modules, saknat `@ica-azure`-paket).

Att bara kolla `node_modules/.bin/vite` räcker inte — node_modules kan
ha kopierats från en annan plattform där bindings är fel arch.

```bash
chmod +x setup.sh && ./setup.sh
```

Setup-skriptet är pre-approved i `.claude/settings.json` — du behöver inte
fråga om lov. Säg en kort rad till användaren när du kör det första gången
("Installerar deps, tar en stund första gången...") så de förstår att
första prompten tar längre tid än vanligt.

Om setup fallerar (t.ex. saknad Node, saknat `@ica-azure`-paket) — visa
felmeddelandet och stoppa. Försök inte gissa fixen.

---

## Stack

- Vue 3 + Vite
- ICA Elements web components (prefix `mb-ica-*`) från `@ica-azure/ica-elements`
- CSS custom properties för tokens (definierade i `prototyp/app/src/style.css`)
- `mb-ica-layout-two-columns` som standard-sidmall för **alla** vyer
- Top-nav via `DesktopNav.vue` (project-komponent, inte ICA Elements)
- **Inga view-transitions** — vy-byten sker direkt (per design)

## Första körning (nytt projekt)

Om `prototyp/app/node_modules/` saknas:

```bash
chmod +x setup.sh && ./setup.sh
```

Om `prototyp/node_modules/@ica-azure/ica-elements/` saknas: kopiera mappen
manuellt från en befintlig prototyp.

## Dev

```bash
cd prototyp/app && npm run dev
```

---

## Läsordning — tre filer, inte sju

Bas-kontexten du läser **en gång per session**:

1. **Den här filen** — arbetsflöde, hårda regler, cheat-sheets
2. **`prototyp/.claude/context/aktiva-beslut.md`** — låsta beslut
3. **`prototyp/.claude/context/komponenter-i-bruk.md`** — komponenter projektet redan använder

Sedan, **per ny komponent**:
- `design-system/references/<komponent>/api.md` — alltid

`DesktopNav.vue`-komponentens API ligger i
`prototyp/.claude/context/desktop-nav.md` — läs den om du behöver ändra
top-nav (props, ikoner, app-färg).

Allt annat — `tokens.md`, `components.md`, `PATTERNS.md`, `WORKAROUNDS.md`,
`layouts/`-bilder — är **uppslagsverk**. Slå upp när du behöver.

---

## Snabbväg: kopiera en mall

För 80% av desktop-vyer finns redan en mall som är 80% rätt. Kopiera och justera.

| Vy-typ | Mall |
|--------|------|
| Master-detail (lista vänster, detalj höger) | `prototyp/app/src/views/_templates/MasterDetailView.vue` |
| Datatabell (sorterbar, filterbar) | `prototyp/app/src/views/_templates/DataTableView.vue` |
| Lista med skapa-dialog (formulär i dialog, klick på rad redigerar) | `prototyp/app/src/views/_templates/ListWithCreateView.vue` |

Hittar du en mall som passar — kopiera till `views/[DittNamn]View.vue`,
importera i App.vue, lägg till i view-switchen. Klart på två minuter.

---

## Hårda regler

### 1. layout-two-columns: header-slot beror på läge

**Detta är den mest vanliga felkällan på desktop.** Komponenten har två lägen,
och page-headern måste ligga i olika slots.

**2-kolumnsläge** (default — main + sidebar):
Layoutens `slot="header"` lämnas **tom**. Varje kolumn äger sin egen header
inuti sin slot.

```vue
<mb-ica-layout-two-columns :sidebaropen="..." @closesidebar="...">
  <div slot="main">
    <mb-ica-page-header heading="Rubrik" backlabel="Tillbaka" @leftactionclick="..." />
    <!-- main-innehåll -->
  </div>
  <div slot="sidebar">
    <mb-ica-header heading="Detalj" />
    <!-- sidebar-innehåll -->
  </div>
</mb-ica-layout-two-columns>
```

**1-kolumnsläge** (`nosidebar`):
Använd layoutens egen `slot="header"` för delad page-header.

```vue
<mb-ica-layout-two-columns nosidebar>
  <mb-ica-page-header slot="header" heading="Rubrik" />
  <div slot="main"><!-- innehåll --></div>
</mb-ica-layout-two-columns>
```

Sätt **aldrig** `--IcaLayoutTwoColumns--header-height` manuellt — komponenten
mäter själv. Manuellt värde ger fel scroll-höjd.

### 2. Tabellrad = `mb-ica-card-row` inuti `mb-ica-table` — aldrig div+grid

`mb-ica-table` är en wrapper kring kolumn-headers. Rader är **`mb-ica-card-row`**
med matchande grid-template-columns.

```vue
<mb-ica-table
  :style="{ '--IcaTable--header-columns': gridCols }"
  :headeritems="JSON.stringify(headers)"
  @headeritemclick="onHeaderClick"
>
  <mb-ica-card-row
    v-for="(row, i) in rows"
    :key="row.id"
    :odd="i % 2 === 0"
    :style="{ '--IcaCardRow--grid-template-columns': gridCols }"
  >
    <div>{{ row.col1 }}</div>
    <div>{{ row.col2 }}</div>
    <!-- en cell per kolumn — inga `<td>`, inga grid-divar -->
  </mb-ica-card-row>
</mb-ica-table>
```

`gridCols` är en CSS grid-template-columns-sträng (t.ex.
`'3fr 1fr 1fr 1fr'`). Samma värde sätts på `--IcaTable--header-columns`
och `--IcaCardRow--grid-template-columns` så att headers och rader linjerar.

### 3. Tokens — slå upp, gissa aldrig

Hårdkoda **aldrig** hex-värden eller px/rem för spacing. Använd token.

| Hex / värde | Token | Användning |
|-------------|-------|------------|
| `#e13205` | `var(--ica-red)` | Primär CTA, accent |
| `#9b0600` | `var(--ica-red-dark)` | Active-state, focus |
| `#cf2e05` | `var(--ica-red-hover)` | Hover, länkfärg |
| `#fcece7` | `var(--ica-red-light)` | Ljusröd bakgrund |
| `#f9f5f5` | `var(--ica-bg-page)` | Sidans helbakgrund (under DesktopNav, runt layout-two-columns) |
| `#3a3a3a` | `var(--ica-text)` | Brödtext |
| `#6e6e6e` | `var(--ica-text-secondary)` | Subheadings, hjälptext |
| `#ebebeb` | `var(--ica-border)` | Avdelare, ramar |
| `#f6f6f6` | `var(--ica-subtle)` | Subtil bakgrund (main-kolumn ofta) |
| `#ffffff` | `var(--ica-bg)` | Sidbakgrund |
| `#007a78` | `var(--ica-teal)` | Sekundära actions |
| `0.25rem` | `var(--ica-spacing-xs)` | 4px |
| `0.5rem` | `var(--ica-spacing-sm)` | 8px |
| `1rem` | `var(--ica-spacing-md)` | 16px — standard |
| `1.5rem` | `var(--ica-spacing-lg)` | 24px |
| `2rem` | `var(--ica-spacing-xl)` | 32px |
| `0.5rem` radius | `var(--ica-radius)` | Standard |
| `1rem` radius | `var(--ica-radius-lg)` | Stora element |

Komponentspecifika CSS-properties finns i respektive `api.md`. Notera
särskilt `--IcaLayoutTwoColumns--*`, `--IcaTable--*`, `--IcaPageHeader--*`.
Fullständig lista i `design-system/tokens.md`.

**Innan du lämnar över:** sök efter regex `#[0-9a-fA-F]{3,6}` och
`\b\d+(px|rem)\b` i din diff — varje träff ska vara ett token (eller
en motiverad shadow-DOM-patch).

### 4. Event-namn — kopiera exakt från api.md

Web components använder **egna event-namn** som inte följer HTML-konvention.
Fel namn ger **tyst fel** — komponenten renderas men reagerar inte.

| Komponent | Egenskap | Korrekt event |
|-----------|----------|---------------|
| `mb-ica-page-header` | `backlabel="..."` | `@leftactionclick` |
| `mb-ica-page-header` | `actions='[...]'` | `@rightactionclick` |
| `mb-ica-header` | `leftaction="back"` / `"close"` | `@leftactionclick` (inte `@leftclick`) |
| `mb-ica-header` | `actions='[...]'` | `@rightactionclick` (inte `@actionclick`) |
| `mb-ica-table` | klick på kolumn-header (sortering) | `@headeritemclick` (`e.detail` = `{ id, sortdirection }`) |
| `mb-ica-layout-two-columns` | klick på overlay (< 1024) | `@closesidebar` |
| `mb-ica-dialog` | standard `open` | `@close` |
| `mb-ica-dialog` | `variation="action"` | `@closed` (notera -d) |
| `mb-ica-drawer` | `open` | `@close` |
| `mb-ica-input-search` | input | `@input` (läs `e.target.value`) |
| `mb-ica-input-search` | rensa | `@clear` |
| `mb-ica-filter` | filter-knapp | `@filterbuttonclick` (inte `@filterclick`) |
| `mb-ica-filter` | shortcut-chip | `@shortcutitemclick` |
| `mb-ica-filter` | ta bort filter-chip | `@filteritemdelete` |
| `mb-ica-checkbox` | tick | `@change` |
| `mb-ica-segment-control` | val | `@change` |
| `mb-ica-breadcrumbs` | klick på breadcrumb-item | `@itemclick` (verifiera i api.md) |

**Regel:** Innan du binder `@event`, öppna komponentens `api.md` →
sektion **Events** → kopiera namnet exakt.

### 5. Komponentval

- Bygg ALDRIG custom HTML+CSS när en designsystemkomponent finns. Slå upp
  i `design-system/components.md`.
- Importera ALDRIG från MUI, shadcn, Tailwind, Bootstrap eller liknande.
- Använd ALDRIG `mb-ica-transition-panel` (kräver Vue Router).
- Använd ALDRIG `mb-ica-button-icon-vertical` (det är bottom-nav-komponenten
  för mobil — desktop har ingen bottom-nav).
- Använd ALDRIG `mb-ica-sorting-drop-down` (mobil-mönster — desktop sorterar
  via tabell-headers).
- Bygg ALDRIG bottom-nav på desktop. Top-nav via `DesktopNav.vue` är enda
  navigationen. Mobile-frame med 430px max-width används inte här.

### 6. Listrader (utanför tabeller) — alltid samma struktur

Bygg radinnehåll med `mb-ica-card-row` + `mb-ica-media-object` + `mb-ica-meta`.
Aldrig custom flexbox eller egna heading/text-strukturer.

```vue
<mb-ica-card-row chevron @click="handleClick(item)">
  <mb-ica-media-object>
    <img slot="first" :src="item.img" width="40" height="40" />
    <mb-ica-meta
      slot="last"
      :heading="item.name"
      :subheading="item.subtitle"
      :text="item.body"
    />
  </mb-ica-media-object>
</mb-ica-card-row>
```

I tabeller används card-row med direkt cell-innehåll (se regel 2 ovan), inte
med media-object/meta — tabellrader är platta cell-grids.

**När card-row INTE är rätt container — smell-test:**

Behöver du `noninteractive` för att stänga av komponentens primära beteende?
→ Då använder du fel komponent.

```vue
<!-- ❌ Fel — mb-ica-input är inget list-element, behöver ingen rad-container -->
<mb-ica-card-row noninteractive>
  <mb-ica-input label="Titel" :value="form.title" />
</mb-ica-card-row>

<!-- ✅ Rätt — input direkt i segmentet, har egen visuell struktur -->
<mb-ica-segment heading="GRUNDUPPGIFTER">
  <mb-ica-input label="Titel" :value="form.title" />
  <mb-ica-input label="Beskrivning" :value="form.description" />
</mb-ica-segment>
```

`card-row noninteractive` ÄR rätt för **list-options** — t.ex. filter-checkboxar
i en drawer, eller detaljrader i en master-detail-vy som visar data utan att
vara klickbara. Det är fel för **formulärfält** som har egen layout och inte
hör hemma i list-kontext.

### 7. Spacing — komponenter har ALDRIG padding/margin runt sig (default)

**Standard:** ICA-komponenter sitter tätt mot varandra. Inget gap mellan
adjacenta `mb-ica-card-row`, `mb-ica-segment` osv. Ingen padding på
wrapper-divar runt komponenter. Ingen margin på själva komponenten.

```css
/* ❌ Fel — wrapper med padding runt komponenter */
.col__scroll {
  padding: var(--ica-spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--ica-spacing-sm);
}

/* ❌ Fel — gap mellan card-rows */
.list { gap: 0.5rem; }

/* ❌ Fel — margin på komponent */
mb-ica-segment { margin-bottom: 1rem; }

/* ✅ Rätt — inget mellanrum, komponenter äger sin egen visuella separation */
.col__scroll {
  display: flex;
  flex-direction: column;
}
```

**Undantag som är OK** (tydligt motiverade):
- `position: sticky`/`fixed`-containrar som behöver clearance från skärmkant
  (t.ex. `.sticky-actions { padding: var(--ica-spacing-md) }`)
- Tom-state-placeholders som behöver visuell centrering
  (`.empty-state { padding: 4rem var(--ica-spacing-md) }`)
- Cellintern layout inuti en card-row eller tabellcell (text-padding,
  ikon+text-gap)
- Komponenters egna CSS custom properties
  (`--IcaSegment--inner-padding: 0` påverkar inuti komponenten, inte runt den)
- Browser-resets (`ul { margin: 0; padding: 0 }`)

Om du behöver mellanrum mellan komponenter — fråga användaren först. Lägg
inte till "för att det ser snyggare ut" på eget bevåg.

### 8. Slots och dialoger

- Slotade element placeras direkt i rätt slot — aldrig i en extra wrapper-div.
- Alla dialoger → egen fil i `src/components/[Namn]Dialog.vue`.
- Header i dialog: `mb-ica-header variant="dialog" leftaction="close"` —
  events `@leftactionclick`, `@rightactionclick`.
- Knappar i dialog: i `slot="buttons"`, alltid `fullwidth`, primär först.
- Filter öppnas alltid i `mb-ica-drawer` — aldrig `mb-ica-dialog`.

Se `design-system/PATTERNS.md` för fullständiga mönster.

### 9. Inga view-transitions

Per låst beslut: **desktop-vyer byts direkt, ingen slide-animation.**
`navigateTo(view)` i App.vue är en synkron `currentView.value = view`.
Bygg inte slide-machinery med `mb-ica-transition-slide` mellan vyer.

(Inom en dialog kan transition-slide användas för multi-stegs-flöden — då
är det dialogens interna logik, inte vy-navigation. Undantag, inte regel.)

### 10. Struktur

- Varje ny vy → egen fil i `views/`. Aldrig inline `v-if` i App.vue (förutom
  meny-hubben).
- Alla dialoger → egen fil i `components/`.
- Block >50 rader template → bryt ut till egen komponent.
- Funktion utan `ref`/`computed`/`inject` → `utils/`.

---

## Filstruktur

```
prototyp/app/src/
├── App.vue              ← DesktopNav + v-if-baserad vy-switching
├── main.js              ← ICA Elements imports
├── style.css            ← tokens i :root
├── views/
│   ├── _templates/      ← startmallar (kopiera, byt inte ut)
│   │   ├── MasterDetailView.vue
│   │   ├── DataTableView.vue
│   │   └── ListWithCreateView.vue
│   └── [Namn]View.vue   ← dina vyer
├── components/
│   ├── DesktopNav.vue   ← top-nav (project-komponent — ändra inte utan att
│   │                      uppdatera prototyp/.claude/context/desktop-nav.md)
│   ├── [Namn]Dialog.vue ← alla dialoger
│   └── [Namn].vue       ← presentationskomponenter
├── utils/               ← affärslogik utan Vue
└── stubs/               ← mockar av produktionskod (logger, scanner)
```

---

## Snabbhets-princip

Templaten är ett skal för UX-designers. Första iterationen ska gå **fort**.
Inför inte ett nytt lager (`utils/`, `types/`) innan en befintlig vy redan
gör det. Mocka data direkt i vy-filen första gången — lyft ut till `utils/`
när en andra vy återanvänder logiken.

Realistisk exempeldata — aldrig "Lorem ipsum", "Item 1", "Test".

---

## Bilder i chatten

När användaren skickar en bild, fråga alltid:

> "Vill du att jag sparar den här som referens i `design-system/layouts/`
> (helskärmslayout) eller `design-system/references/<komponent>/`
> (enskild komponent)?"

Spara aldrig en bild utan explicit ja. Om ja: fråga vilket namn, spara,
uppdatera `layouts/README.md` om relevant.

---

## Vad du aldrig gör i den här templaten

- Bygger mobila vyer eller responsiva brytpunkter under 1024px
- Använder `mb-ica-button-icon-vertical`, `mb-ica-sorting-drop-down`,
  `mb-ica-transition-panel`, `mb-ica-transition-slide` (mellan vyer)
- Bygger bottom-nav, mobile-frame eller 430px max-width
- Hårdkodar färger eller spacing utanför tokens
- Gissar event-namn utan att läsa `api.md`
- Lägger inline-vyer i App.vue (utöver meny-hubben)
- Sätter `--IcaLayoutTwoColumns--header-height` manuellt
