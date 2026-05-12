# Design System Patterns

Denna fil beskriver sammansatta mönster som involverar flera komponenter.
Läs alltid relevant sektion här innan du implementerar något av dessa mönster.

---

## Sidnavigering inuti dialog (undersidor)

Använd `mb-ica-transition-slide` med `preset`-attributet.

### Regler
- Använd ALDRIG en enda wrapper med v-if/toggle — det ger sekventiell animation, inte simultan
- Använd ALDRIG `mb-ica-transition-panel` — det projektet inte använder Vue Router
- Använd ALLTID `preset` för simultana animationer
- Wrapperelementet behöver alltid `position: relative` och `overflow: hidden`
- Två instanser av `mb-ica-transition-slide` behövs alltid — en för utgående vy, en för inkommande

### Preset-värden
| Navigering | Utgående vy | Inkommande vy |
|------------|-------------|---------------|
| Framåt (djupare) | `preset="out-left"` | `preset="in-right"` |
| Bakåt | `preset="out-right"` | `preset="in-left"` |

### Korrekt implementation i Vue

```vue
<template>
  <div style="position: relative; overflow: hidden;">

    <!-- Startsida -->
    <mb-ica-transition-slide :preset="view === 'main' ? null : 'out-left'">
      <div v-if="view === 'main'">
        <mb-ica-header heading="Titel" leftaction="close" />
        <!-- Startsidans innehåll -->
      </div>
    </mb-ica-transition-slide>

    <!-- Undersida -->
    <mb-ica-transition-slide :preset="view === 'sub' ? 'in-right' : 'out-right'">
      <div v-if="view === 'sub'">
        <mb-ica-header heading="Undersida" leftaction="back" @leftactionclick="view = 'main'" />
        <!-- Undersidans innehåll -->
      </div>
    </mb-ica-transition-slide>

  </div>
</template>

<script setup>
import { ref } from 'vue'
const view = ref('main')
</script>
```

### Vanliga fel
- Bygga en enda wrapper med toggle → ger sekventiell animation (fel)
- Använda `inactive`-attributet manuellt istället för `preset` → ger inkonsekvent animation
- Glömma `position: relative` och `overflow: hidden` på wrapperelementet → vyer syns utanför sin container
- Använda `transition-panel` utan Vue Router → fungerar inte

---

## Sök + Filter — layoutmönster

`mb-ica-filter` har en odokumenterad `left`-slot. Sökfältet placeras där
så att filter-komponenten styr hela layouten. Bygg ALDRIG sök och filter
som separata block under varandra.

### Variant A: Sök + Filter (samma vy)

Sökfältet i `left`-sloten → filter-knappen hamnar till höger om sökfältet.
Shortcuts renderas på en egen rad under.

```
Rad 1: [Sökfält                    ] [Filter-knapp]
Rad 2: [Shortcut A] [Shortcut B] [Shortcut C]
```

```html
<mb-ica-filter
  :incard="false"
  :shortcuts='JSON.stringify([
    { id: "avdelning", text: "Avdelning" },
    { id: "status", text: "Status" }
  ])'
  :filters='JSON.stringify(activeFilters)'
  @filterclick="openFilterDialog"
  @shortcutclick="onShortcutClick"
  @filterremove="onFilterRemove"
>
  <mb-ica-input-search
    slot="left"
    label="Sök artikel..."
    :value="searchQuery"
    @input="onSearch"
    @clear="searchQuery = ''"
  ></mb-ica-input-search>
</mb-ica-filter>
```

### Variant B: Enbart filter (ingen sök)

Utan `left`-slot sitter filter-knapp och shortcuts på samma rad.

```
Rad 1: [Filter-knapp] [Shortcut A] [Shortcut B] [Shortcut C]
```

```html
<mb-ica-filter
  :incard="false"
  :shortcuts='JSON.stringify([...])'
  :filters='JSON.stringify(activeFilters)'
  @filterclick="openFilterDialog"
  @shortcutclick="onShortcutClick"
  @filterremove="onFilterRemove"
></mb-ica-filter>
```

### Regler

- Sökfältet ska ALLTID in i filter-komponentens `left`-slot — aldrig som separat element
- Använd ALLTID `:incard="false"` — ingen card-wrapper runt filter
- Lägg ALDRIG till wrapper-divs, extra padding eller margin runt filter-komponenten
- Placera ALDRIG sökfält och filter som separata block under varandra

### Vanliga fel

- ❌ Sökfält som eget element ovanför filter → ger fel layout och extra spacing
- ❌ Wrappa sökfältet i en `<div class="search-row">` → bryter filter-komponentens interna layout
- ❌ `incard="true"` (default) → ger oönskad card-wrapping med skugga
- ❌ Bygga custom flex-rad med sök + filter-knapp → filter-komponenten hanterar detta redan

## Desktop navigation (≥ 767px)

Top-navigation som ersätter bottom-nav när viewport är ≥ 767px. Återskapar
MinButik-appens site-header visuellt för prototyp-ändamål.

### Fasta värden — ändra aldrig dessa

| Egenskap | Värde |
|----------|-------|
| Höjd | `48px` |
| Position | `position: sticky; top: 0` (endast ≥ 767px) |
| z-index | `300` |
| Bakgrund | `#fff` |
| Röd linje överst | `border-top: 4px solid var(--ica-red)` (inferens — verifiera) |
| Grid-layout | `grid-template-columns: max-content 1fr max-content 1fr max-content` |
| Breakpoint | ≥ 767px visas, < 767px döljs via `@media` |

### Fasta meny-items — alltid dessa 4 i denna ordning

| Position | Label | Ikon | HTML-tagg |
|----------|-------|------|-----------|
| 1 | HEM | `mb-ica-icon-home` | `mb-ica-button-icon` (accent enhanced) |
| 2 | APPAR | `mb-ica-icon-view-image` | `mb-ica-button-icon` (accent enhanced) |
| 3 | GENVÄGAR | `mb-ica-icon-rate` | `mb-ica-button-icon` (accent enhanced) |
| 4 | [aktiv app] | app-specifik ikon | `<a>` med `class="desktop-nav__active-page-link"` |

Alla ikoner är **outlined** enligt designsystem-regeln. Se `components.md`.

### Aktiv app — strukturellt annorlunda

Det fjärde item:et (aktiva appen) använder **inte** `mb-ica-button-icon` utan
ett `<a>`-element med bakgrundsfärg från `--application-color`. Varje app har
egen färg — Order & Leverans = `#176473` (teal).

### Komponent i stället för inline HTML

Till skillnad från bottom-nav bygger agenten inte desktop-navigationens HTML
inline. Använd den färdiga Vue-komponenten:

```vue
<template>
  <div id="app">
    <DesktopNav />
    <!-- vyer under -->
  </div>
</template>

<script setup>
import DesktopNav from './components/DesktopNav.vue'
</script>
```

Props (aktiv app, färg, user-info) finns dokumenterade i
`prototyp/.claude/context/desktop-nav.md`.

### Synlighet

- Bottom nav visas ENDAST < 767px
- DesktopNav visas ENDAST ≥ 767px (inbyggt `@media` i komponenten)
- **Aldrig båda samtidigt** — de är ömsesidigt uteslutande
- Dialoger (Teleport z-index 1000+) ligger ovanpå båda

### Vanliga fel

- ❌ Bygga egen top-nav HTML i stället för att använda `DesktopNav.vue`
- ❌ Dölja bottom-nav på desktop-vyer utan att lägga till `DesktopNav`
- ❌ Använda filled-ikoner (`bell`, `grid`, `star-filled`) — använd outlined
- ❌ Ändra meny-items eller ordning — de är fasta
- ❌ Använda ICA-röd som aktiv app-färg — varje app har en egen teal/blå/etc.

### Referens

- Komponent: `prototyp/app/src/components/DesktopNav.vue`
- Kontext och props: `prototyp/.claude/context/desktop-nav.md`
- Integration i App.vue: `prototyp/.claude/context/app-structure.md` → "Desktop-vyer"

---

## Filtrering

Filter-mönstret är en **komposition** av flera komponenter som arbetar tillsammans.
Läs alltid denna sektion OCH `references/filter/api.md` innan du bygger filtrering.

### Steg 1: Välj variant

| Kontext | Variant | Öppnar | Referens |
|---------|---------|--------|----------|
| **Standard** | **Drawer-filter** | **`mb-ica-drawer`** | **Se "Filter-drawer" nedan** |
| Redan inuti en modal/dialog | Nivå-filter | Ny vy inuti dialogen via `mb-ica-transition-slide` | Se "Filter inuti modal" nedan |
| Enkelt val, få alternativ | Tag-filter | Ingen — taggar filtrerar direkt | Se "Tag-filter" nedan |

> **Filterpanelen öppnas alltid i en `mb-ica-drawer`** — inte i en `mb-ica-dialog`.
> Detta gäller oavsett skärmstorlek (mobil och desktop).

### Steg 2: Placering i vyn — spacing är kritiskt

Filter-bar, sökfält och lista sitter **tätt ihop**. De bildar ett visuellt block.

```
┌──────────────────────────────┐
│  mb-ica-header              │
├──────────────────────────────┤  ← ingen padding mellan header och sök
│  mb-ica-input-search        │  ← padding: 0 var(--ica-spacing-md)
├──────────────────────────────┤  ← ingen gap mellan sök och filter
│  mb-ica-filter              │  ← incard="false"
├──────────────────────────────┤  ← ingen extra gap
│  Sortering (om det finns)    │
├──────────────────────────────┤
│  Lista (card-rows)           │
└──────────────────────────────┘
```

Regler:
- `mb-ica-filter` ska ha `incard="false"` — default `true` skapar en card-wrapper
  med skugga/ram som bryter det täta blocket
- Sökfältet ska ha `--IcaInputSearch--max-width: 100%` så det fyller hela bredden
- Inga extra wrapper-divs med padding mellan sök, filter och lista
- Om sökfältet behöver sidopadding, använd padding på sökfältets container —
  inte en wrapper runt hela blocket

### Filter-drawer (standard)

Fullständig komponentsammansättning — se `references/filter/api.md` för kodexempel.

```
mb-ica-drawer
  ├─ slot="head"
  │   └─ mb-ica-header (variant="dialog", heading="Filter",
  │       leftaction="close", @leftactionclick="stängDrawer")
  ├─ default slot
  │   ├─ mb-ica-accordion (heading="Avdelningar", :expanded) × N
  │   │   └─ mb-ica-card-row (noninteractive, truncate) × N
  │   │       └─ mb-ica-checkbox (default slot, EN klickyta)
  │   │           └─ mb-ica-meta (heading="Filterval", child av checkbox)
  │   └─ ... fler accordion-sektioner
  └─ slot="buttons"
      ├─ mb-ica-button (fullwidth, text="Visa")
      └─ mb-ica-button (fullwidth, variation="secondary", text="Spara filter")
```

Kritiska detaljer:
- Headern är `mb-ica-header` med `variant="dialog"` — inte en custom div
- Drawern öppnas vid klick på filter-knappen (`@filterbuttonclick`) eller shortcut-chip (`@shortcutitemclick`)
- När en shortcut-chip klickas: öppna drawern med matchande accordion redan expanderad
- Två knappar i botten: "Visa" (primary) + "Spara filter" (secondary)
- Bakgrunden bakom drawern dimmad (overlay)

### Filter inuti modal

När filtret sitter inuti en redan öppen dialog (t.ex. en sökning-i-sökning):

- Använd INTE en ny `mb-ica-dialog` — det ger staplad modal-problematik
- Navigera istället till en ny vy inuti den befintliga dialogen med
  `mb-ica-transition-slide` (se "Sidnavigering inuti dialog" ovan)
- Filtervyn ersätter modalens innehåll temporärt, inte lägger sig ovanpå

### Tag-filter (alternativ till filterdialog)

När det finns få alternativ (3–6 st) som inte behöver en dialog.

| Typ | Beteende | Användning |
|-----|----------|------------|
| Choice tags | En aktiv åt gången (radio) | Alternativ till segment-control |
| Selection tags | Multipelt val (checkbox) | Snabbfilter ovanför lista |

Regler:
- Taggar ska alltid ligga i en horisontell rad
- Om de inte får plats: **horisontell scroll** — aldrig wrap till ny rad
- Wrap ger ett rörigt intryck och tar mer vertikal plats

```html
<!-- Choice tags (en åt gången) — wrappa i scrollbar container -->
<div style="display:flex;gap:var(--ica-spacing-xs);overflow-x:auto;padding:var(--ica-spacing-sm) var(--ica-spacing-md)">
  <mb-ica-tag v-for="tag in tags" :key="tag.id"
    :text="tag.name"
    :active="tag.id === activeTag"
    interactive
    @click="activeTag = tag.id"
  ></mb-ica-tag>
</div>
```

### Interaktionsflöde — steg för steg

```
1. Användaren ser filter-bar (mb-ica-filter med shortcuts)
   └─ Inga aktiva filter → bara shortcut-chips synliga

2. Klickar "Filter"-knappen (tratt-ikon) ELLER en shortcut-chip
   └─ filterclick → öppna dialog/drawer
   └─ shortcutclick → öppna dialog/drawer med matchande sektion expanderad

3. Inuti dialogen: väljer checkboxar
   └─ "Visa X resultat"-knappen uppdateras i realtid

4. Klickar "Visa (X)"
   └─ Dialog/drawer stängs
   └─ Filter-bar visar aktiva val som removable chips
   └─ Listan filtreras

5. Användaren tar bort en aktiv filter-chip (klickar X på chippen)
   └─ filterremove → ta bort filtret, uppdatera listan
```

### Vanliga fel

- ❌ **Använda `mb-ica-dialog` för filter** — använd alltid `mb-ica-drawer`
- ❌ Lägga till padding/gap mellan sökfält och filter-bar — de ska sitta tätt
- ❌ Lämna `incard` på default (`true`) — ger card-wrapper med skugga
- ❌ Bygga custom header-div i filter-drawern — använd `mb-ica-header` med `variant="dialog"`
- ❌ Öppna en ny dialog inuti en redan öppen dialog — navigera med transition-slide istället
- ❌ Wrappa filter-taggar till ny rad — de ska scrolla horisontellt
- ❌ Bygga custom filter-chips med egna `<div>` + `<span>` — använd `mb-ica-filter`
- ❌ Glömma att expandera rätt accordion-sektion vid shortcutclick
- ❌ Bara en knapp i botten — det ska vara "Visa" (primary) + "Spara filter" (secondary)

### Referens
Se `references/filter/api.md` för komponent-API och fullständiga kodexempel.
Figma: "Patterns" → "Filter" → "Placement" och "Examples" sektionerna.

---

## Layout-two-columns — sidmall för desktop-vyer

`mb-ica-layout-two-columns` är desktop-templatens **standard sidmall**. Använd
i alla vyer — både master-detail (default) och 1-kolumns (`nosidebar`).

### Två lägen, två header-strategier

Den enskilt vanligaste felkällan är att lägga page-header i fel slot.

| Läge | Attribut | Header-placering |
|------|----------|------------------|
| **2-kolumn** (default) | inget | Layoutens `slot="header"` lämnas TOM. Varje kolumn äger sin egen header inuti sin slot. |
| **1-kolumn** | `nosidebar` | Layoutens egen `slot="header"` används — delad page-header spänner hela bredden. |

### 2-kolumnsläge (master-detail)

```vue
<mb-ica-layout-two-columns
  :sidebaropen="selectedId !== null"
  @closesidebar="selectedId = null"
>
  <!-- INGEN content i slot="header" -->

  <div slot="main">
    <mb-ica-page-header
      heading="Rubrik"
      backlabel="Tillbaka"
      @leftactionclick="goBack"
    ></mb-ica-page-header>
    <!-- main-innehåll -->
  </div>

  <div slot="sidebar">
    <mb-ica-header :heading="sidebarHeading" />
    <!-- sidebar-innehåll -->
  </div>
</mb-ica-layout-two-columns>
```

### 1-kolumnsläge (`nosidebar`)

```vue
<mb-ica-layout-two-columns nosidebar>
  <mb-ica-page-header
    slot="header"
    heading="Rubrik"
    backlabel="Tillbaka"
    @leftactionclick="goBack"
  ></mb-ica-page-header>

  <div slot="main">
    <!-- innehåll -->
  </div>
</mb-ica-layout-two-columns>
```

### Övriga regler

- Sätt **aldrig** `--IcaLayoutTwoColumns--header-height` manuellt —
  komponenten mäter själv.
- Per-kolumn-scroll: wrappa kolumnernas innehåll i `<div>` med
  `overflow: auto` och `max-height: calc(100vh - <header-height>)`.
  Annars scrollar hela sidan.
- Sidebar-toggle finns **inte inbyggt** — `sidebaropen`-propen styrs från
  rad-klick i main (`@click="selectedId = row.id"`), och `@closesidebar`
  återställer (`selectedId = null`).
- I desktop-template (≥ 1024px) syns sidebaren alltid — `sidebaropen`
  påverkar inte. Hantera tomt sidebar-innehåll med en `mb-ica-placeholder`
  med `onlytext`.
- Override sidebar-duration till 0.3s för konsistens med projektets snappy
  feel: `style="--IcaLayoutTwoColumns--sidebar-duration: 0.3s"`.

### Vanliga fel

- ❌ Page-header i `slot="header"` även i 2-kolumnsläge (renderas på fel plats)
- ❌ Header-height satt manuellt (ger fel scroll-höjd)
- ❌ Glömma scroll-wrapper per kolumn (sidan scrollar i stället för kolumnen)
- ❌ Bygga eget toggle-UI (öppna sidebar via rad-klick i main istället)
- ❌ Lägga `<DesktopNav>` inuti layouten (DesktopNav ska vara *ovanför*
  layouten, i App.vue)

### Referens

Komplett api-doc: `references/layout-two-columns/api.md` (med fler
kodexempel och alla CSS custom properties).

---

## Datatabell — `mb-ica-table` med `mb-ica-card-row` som rader

Desktop-tabeller är **inte HTML-tables**. `mb-ica-table` är en wrapper kring
kolumn-headers; rader är **`mb-ica-card-row` med matchande grid**.

### Grundstruktur

```vue
<mb-ica-table
  :style="{ '--IcaTable--header-columns': gridCols }"
  :headeritems="JSON.stringify(headers)"
  @headeritemclick="onHeaderClick"
>
  <!-- Valfri välj-alla-checkbox i tabellens egen slot="left" -->
  <mb-ica-checkbox
    slot="left"
    :checked="allSelected"
    @change="toggleAll"
  ></mb-ica-checkbox>

  <!-- Rader: mb-ica-card-row med samma grid-template-columns -->
  <mb-ica-card-row
    v-for="(row, i) in rows"
    :key="row.id"
    :odd="i % 2 === 0"
    :style="{ '--IcaCardRow--grid-template-columns': gridCols }"
  >
    <mb-ica-checkbox
      slot="left"
      :checked="row.selected"
      @change="toggleRow(row)"
    ></mb-ica-checkbox>

    <!-- En direkt cell per kolumn — inga div-grids, inga <td> -->
    <div>{{ row.col1 }}</div>
    <div>{{ row.col2 }}</div>
    <div>{{ row.col3 }}</div>
  </mb-ica-card-row>
</mb-ica-table>
```

### Single source of truth: `headers[].sortdirection`

```js
const headers = ref([
  { label: 'Artikel', column: 1, sortdirection: 'desc', id: 'title' },
  { label: 'Pris', column: 2, sortdirection: 'default', id: 'price' },
  // ...
])

function onHeaderClick(e) {
  const { id, sortdirection } = e.detail
  const next = sortdirection === 'default' ? 'desc'
             : sortdirection === 'desc' ? 'asc'
             : 'default'
  headers.value = headers.value.map(h => ({
    ...h,
    sortdirection: h.id === id ? next : 'default',
  }))
}
```

### Regler

- **Grid-cols måste matcha** mellan tabellens header och rader. Använd en
  enda `gridCols`-konstant som sätts på både `--IcaTable--header-columns`
  och `--IcaCardRow--grid-template-columns`.
- **`headers[].sortdirection`** är single source of truth. Cykel:
  `default → desc → asc → default`.
- **Status-celler** kombinerar `mb-ica-color-indicator` + text:
  ```vue
  <div class="status-cell">
    <mb-ica-color-indicator :theme="statusTheme(row.status)" />
    <span>{{ row.status }}</span>
  </div>
  ```
- **Chevron-cell** sist (om radklick navigerar): `<mb-ica-icon-angle-right />`
  i en cell med `text-align: right`.
- **`:odd="i % 2 === 0"`** ger zebra-striping. Tabellen sköter resten.

### Vanliga fel

- ❌ Bygga rader med `<tr>`/`<td>` (mb-ica-table är inte HTML-table)
- ❌ Bygga rader med custom `<div>` + `display: grid` (bryter komponentens
  inbyggda hover, focus och striping)
- ❌ Olika grid-template-columns på header och rader (kolumnerna linjerar inte)
- ❌ Sätta `selected`-state utanför `headers`-arrayen (multipelaktiv sort)

### Referens

Komplett api-doc: `references/table/api.md`.

---

## Tekniska workarounds — shadow DOM och stacking context

ICA Elements bygger på Svelte web components, vilket innebär shadow DOM. Det
påverkar hur `position: fixed`, `transform` och slottad content interagerar.

### Dialog-knappar (`slot="buttons"`) renderar inte visuellt

`mb-ica-dialog` placerar `slot="buttons"` inuti content-slotens
`overflow: hidden auto`. Knapparna finns i DOM men syns inte.

**Workaround:** Placera knapparna utanför dialogen med
`position: fixed; bottom: 0; z-index: 1001`, gated med `v-if="open"`.

### Header text-actions (t.ex. "Skicka", "Ta bort", "Rensa")

`actions`-attributet renderar alltid ikoner, aldrig text. För text-actions
(röd text till höger i headern), wrappa headern i en `<div slot="header">`
med en absolute-positionerad `<button>` — samma mönster som filterdialogen
använder för "Rensa".

### Card-komponentens slot-namn

`mb-ica-card` har slot-namn `heading` (inte `header`) och `action` för card
med heading och action-länk. `onlytext` på `mb-ica-placeholder` döljer ikonen.

### Använd inte `h()` render-funktioner för custom-element-markup

När du vill dela upprepad template-markup med `mb-ica-*`-komponenter mellan
flera vyer, frestelsen är att skapa en render-funktion-komponent:

```js
// Funkar inte pålitligt för custom elements
const DetailContent = {
  render() {
    return h('mb-ica-segment', { heading: 'DETALJER' }, [
      h('mb-ica-card-row', { noninteractive: true }, [/* ... */])
    ])
  }
}
```

**Problem:** Vue:s `h()` sätter props som **properties** på custom elements,
inte som **attributes**. Web components läser ofta sin konfiguration från
attribut (`hasAttribute('noninteractive')`, `getAttribute('heading')`) — och
får då ingen data. Resultat: komponenten renderar tomt.

**Lösning:** Duplicera template-markupen i båda branches, eller extrahera
till en `.vue`-SFC om det blir stor mängd duplicering.

### Layout-two-columns inuti transition-slide

Lägg inte `mb-ica-layout-two-columns` inuti `mb-ica-transition-slide` utan
att testa. Transition-slide har `transform` i shadow DOM som skapar stacking
context — overlay/sidebar kan fångas. Vid problem: teleportera overlay till
body, eller avstå från nestlingen. (Mindre relevant i desktop-template
eftersom vi inte kör vy-transitions, men gäller om du har transition-slide
inuti en dialog.)
