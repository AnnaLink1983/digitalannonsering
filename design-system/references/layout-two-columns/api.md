# mb-ica-layout-two-columns

Layout-komponent för desktop-vyer — delar upp sidans innehåll i två kolumner (main + sidebar) eller en kolumn (`nosidebar`), med inbyggt responsivt beteende och två distinkta renderings-lägen.

## När ska du använda layout-two-columns?

- Alla vyer som körs i **desktop-läge** (viewport ≥ 767px). Både 2-kolumnsvyer (t.ex. lista + detaljkort) och 1-kolumnsvyer (t.ex. formulär som tar hela bredden).
- **Använd INTE i mobila vyer** (viewport < 767px / `isSmall`). Mobila vyer använder projektets 430px-frame-flöden utan layout-komponent. Se `prototyp/.claude/context/responsive.md` (om finns) eller fråga innan du blandar.
- Både 2-kol och 1-kol är **samma komponent** — byt mellan lägena med `nosidebar`-attributet, inte olika komponenter.

## Arkitektur — två lägen med olika header-strategi

Komponenten har två distinkta renderings-lägen. Skillnaden ligger i **var page-headern placeras** — detta är den viktigaste regeln att förstå korrekt.

| Läge | Attribut | Modifier-klass | Header-strategi |
|------|----------|----------------|-----------------|
| **2-kolumn** | inget (default) | `IcaLayoutTwoColumns--sidebar-open` (när sidebar synlig < 1024px) | Varje kolumn äger sin **egen** header inuti sin slot. Layoutens `header`-slot lämnas **tom**. Kolumnerna scrollar separat. |
| **1-kolumn** | `nosidebar` | `IcaLayoutTwoColumns--with-full-header` (sätts automatiskt när `header`-slot har content) | Layoutens **`header`-slot** används — en delad page-header spänner över hela bredden. |

### Vanligt fel att undvika

Om du byter läge utan att flytta page-headern hamnar den på fel plats:

- I **2-kol**: sätt `mb-ica-page-header` inuti `slot="main"` och `mb-ica-header` inuti `slot="sidebar"`. Layoutens egen `header`-slot används inte.
- I **nosidebar**: sätt `mb-ica-page-header` med `slot="header"` (alltså i layoutens egen header-slot) och bara innehåll i `slot="main"`.

Layouten mäter headerns faktiska höjd och exponerar den som `--IcaLayoutTwoColumns--header-height` automatiskt — sätt inte detta manuellt.

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `nosidebar` | boolean | false | 1-kolumnsläge. `sidebar`- och `sidebar-buttons`-slotarna renderas inte. Aktiverar `--with-full-header`-modifier när `header`-slot är fylld. |
| `sidebaropen` | boolean | false | Styr om sidebar ska vara öppen när viewport är **< 1024px** (overlay-läget). Över 1024px syns sidebaren alltid — attributet påverkar inget där. |

## Slots

| Slot | Syfte | När används | Innehållskomponent |
|------|-------|-------------|---------------------|
| `header` | Sidtäckande header överst, spänner hela bredden | Typiskt i `nosidebar`-läge. Lämnas tom i 2-kol där varje kolumn har egen header. | `mb-ica-page-header` |
| `main` | Huvudkolumn (vänster i 2-kol, hela bredden i `nosidebar`) | Alltid | Valfritt — typiskt egen header + scroll-wrappad content |
| `sidebar` | Sidokolumn (höger) | Alltid utom i `nosidebar`-läge | Valfritt — typiskt egen header + scroll-wrappad content |
| `main-buttons` | Sticky knapp-rad i botten av main-kolumnen | När main behöver fasta bottom actions | `mb-ica-button`(s) |
| `sidebar-buttons` | Sticky knapp-rad i botten av sidebar-kolumnen | När sidebar behöver fasta bottom actions | `mb-ica-button`(s) |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--IcaLayoutTwoColumns--max-width` | `85rem` (1360px) | Max-bredd på layoutens inre container. Över detta får du tomrum på sidorna (layouten är centrerad med `margin: auto`). |
| `--IcaLayoutTwoColumns--gutters` | `12px` | Horisontell padding på layoutens inre container. |
| `--IcaLayoutTwoColumns--column-height` | `var(--minbutik-content-height, 100vh)` | Kolumnens höjd. Sätt `--minbutik-content-height` globalt på `:root` i App.vue om 100vh inte passar. |
| `--IcaLayoutTwoColumns--header-height` | auto-mätt | Sätts automatiskt av komponenten till `header`-slotens renderade höjd. **Sätt inte manuellt.** |
| `--IcaLayoutTwoColumns--mainButtonslot-height` | auto-mätt | Sätts automatiskt till `main-buttons`-slotens höjd. Används för main-kolumnens scroll-area. |
| `--IcaLayoutTwoColumns--sidebarButtonslot-height` | auto-mätt | Sätts automatiskt till `sidebar-buttons`-slotens höjd. |
| `--IcaLayoutTwoColumns--sidebar-z-index` | `2` | z-index på sidebar i overlay-läget. |
| `--IcaLayoutTwoColumns--sidebar-duration` | `0.7s` | Transition-duration för sidebar-slide. OBS: default är långsammare än projektets konvention (0.3s för `transition-slide`). Överväg att sätta `0.3s` för konsistens. |
| `--IcaLayoutTwoColumns--sidebar-timing` | cubic-bezier | Timing-function för sidebar-slide. |
| `--IcaLayoutTwoColumns--overlay-z-index` | `1` | z-index på overlay-elementet bakom sidebar i overlay-läget. |
| `--IcaLayoutTwoColumns--overlay-fade-duration` | `0.3s` | Fade-duration på overlay-elementet. |

### Auto-togglade modifier-klasser

Komponenten sätter dessa klasser automatiskt baserat på slot-innehåll och state. Använd dem inte manuellt — de är informativa för debugging.

| Klass | Sätts när |
|-------|-----------|
| `IcaLayoutTwoColumns--sidebar-open` | `sidebaropen="true"` och viewport < 1024px |
| `IcaLayoutTwoColumns--with-full-header` | `header`-sloten har content (automatisk detektion) |
| `IcaLayoutTwoColumns--has-main-buttons-slot` | `main-buttons`-sloten har content |
| `IcaLayoutTwoColumns--has-sidebar-buttons-slot` | `sidebar-buttons`-sloten har content |

## Events

| Event | Description |
|-------|-------------|
| `closesidebar` | Fires when user clicks the overlay-bakgrunden i overlay-läget (< 1024px med sidebar öppen). Consumer sätter typiskt `sidebaropen = false` i response. |

## Responsivt beteende

Komponenten har två breakpoints inbyggda, som matchar projektets tre-nivås responsiva modell.

| Viewport | Projekt-läge | Beteende |
|----------|-------------|----------|
| < 767px | `isSmall` (mobil) | Bör **inte** användas här. Använd 430px-frame-flöden. |
| 767–1023px | medium / tablet | Main fyller full bredd. Sidebar är dold per default, slider in som **overlay** med dimmad bakgrund när `sidebaropen="true"` sätts. `closesidebar`-eventet triggas vid klick på overlay-bakgrunden. |
| ≥ 1024px | desktop | **Båda kolumnerna permanent synliga** bredvid varandra. `sidebaropen` ignoreras. Layouten är centrerad, max 1360px bred. |

### Sidebar-toggle (overlay-läget)

Komponenten har **inget inbyggt toggle-UI**. I overlay-läget (< 1024px) ansvarar konsumenten för att öppna sidebar via `sidebaropen`-propen, typiskt från:

- Klick på en `mb-ica-card-row` i main-kolumnen
- Klick på en rad i en `mb-ica-table` i main-kolumnen

Se kodexempel nedan.

> **Obekräftad detalj:** Breakpointen 1024px är hämtad från kompilerad CSS i `@ica-azure/ica-elements` v20.15.1. Storybook visade 1260px — möjlig version-mismatch. Verifiera mot dev-server vid osäkerhet.

## Projekt-konventioner

### Scroll-wrapper per kolumn

Varje kolumns innehåll wrappas i en `<div>` med egen overflow-hantering. Annars får kolumnen fel höjd och innehållet klipps eller scrollar hela sidan.

**Main-kolumn** (använder `--List-header-height` som projektet sätter på yttre wrappern):
```html
<div slot="main">
  <mb-ica-page-header heading="..." backlabel="Tillbaka" actions="..."></mb-ica-page-header>
  <div style="overflow: auto; max-height: calc(var(--minbutik-content-height, 100vh) - var(--List-header-height));">
    <!-- scrollbar content, t.ex. tabell eller lista -->
  </div>
</div>
```

**Sidebar-kolumn** (subtraherar typiskt 44px för sin interna header):
```html
<div slot="sidebar">
  <mb-ica-header heading="..." actions="..."></mb-ica-header>
  <div style="overflow: auto; max-height: calc(100vh - 44px);">
    <!-- scrollbar content -->
  </div>
</div>
```

### `--List-header-height`

Sätts på layoutens yttre wrapper (utanför `mb-ica-layout-two-columns`) när main-kolumnens scroll-wrapper behöver veta headerns höjd:

```html
<div style="--List-header-height: 56px;">
  <mb-ica-layout-two-columns ...>...</mb-ica-layout-two-columns>
</div>
```

Värdet är tillämpningsspecifikt — matcha headerns faktiska höjd.

### `--minbutik-content-height`

Global custom property som sätts av MinButik-skalet. Ärvs av `--IcaLayoutTwoColumns--column-height`. Om prototypen inte har MinButik-skalet aktivt faller det tillbaka till `100vh`.

## Kodexempel

### 2-kolumnsvy med per-kolumn-headers (vanligaste mönstret)

```vue
<template>
  <div :style="{ '--List-header-height': '56px' }">
    <mb-ica-layout-two-columns :sidebaropen="sidebarOpen" @closesidebar="sidebarOpen = false">
      <!-- VÄNSTER KOLUMN: lista + egen page-header -->
      <div slot="main">
        <mb-ica-page-header
          heading="Kund- & kampanjrapporter"
          subheading="Subtitle"
          backlabel="Tillbaka"
          :actions='JSON.stringify([
            { icon: "send", label: "Skicka", id: "send" },
            { icon: "edit", label: "Redigera", id: "edit" }
          ])'
          @leftactionclick="goBack"
          @rightactionclick="onAction"
        ></mb-ica-page-header>

        <div
          style="overflow: auto; max-height: calc(var(--minbutik-content-height, 100vh) - var(--List-header-height));"
        >
          <mb-ica-table :rows="rows" @rowclick="openDetail"></mb-ica-table>
        </div>
      </div>

      <!-- HÖGER KOLUMN: detaljvy med egen header -->
      <div slot="sidebar">
        <mb-ica-header
          heading="Kund- & kampanjrapporter"
          :actions='JSON.stringify([
            { icon: "send", label: "Skicka", id: "send" }
          ])'
          @rightactionclick="onSidebarAction"
        ></mb-ica-header>
        <div style="overflow: auto; max-height: calc(100vh - 44px);">
          <!-- sidebar-content -->
        </div>
      </div>
    </mb-ica-layout-two-columns>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const sidebarOpen = ref(false)
const rows = ref([/* ... */])
function openDetail(row) {
  /* välj rad och öppna sidebar i overlay-läget */
  sidebarOpen.value = true
}
function goBack() { /* ... */ }
function onAction(e) { /* e.detail = action id */ }
function onSidebarAction(e) { /* ... */ }
</script>
```

> **Notera:** Layoutens egen `header`-slot är **inte** använd här. Varje kolumn äger sin header inuti sin slot.

### 1-kolumnsvy med delad header (`nosidebar`)

```vue
<template>
  <mb-ica-layout-two-columns nosidebar>
    <!-- LAYOUTENS egen header-slot används här -->
    <mb-ica-page-header
      slot="header"
      heading="Kund- & kampanjrapporter"
      subheading="Subtitle"
      backlabel="Tillbaka"
      :actions='JSON.stringify([
        { icon: "send", label: "Skicka", id: "send" },
        { icon: "edit", label: "Redigera", id: "edit" },
        { icon: "home-delivery", label: "Leverans", id: "ship" }
      ])'
      @leftactionclick="goBack"
      @rightactionclick="onAction"
    ></mb-ica-page-header>

    <div slot="main">
      <!-- main-content -->
      <mb-ica-card-row v-for="item in items" :key="item.id" ...></mb-ica-card-row>
    </div>
  </mb-ica-layout-two-columns>
</template>
```

### Toggle sidebar från en rad-klick (overlay-läget)

```vue
<template>
  <mb-ica-layout-two-columns
    :sidebaropen="selectedId !== null"
    @closesidebar="selectedId = null"
  >
    <div slot="main">
      <mb-ica-page-header heading="Leveranser" backlabel="Tillbaka" @leftactionclick="goBack" />
      <div style="overflow: auto; max-height: calc(100vh - 56px);">
        <mb-ica-card-row
          v-for="row in rows"
          :key="row.id"
          :heading="row.name"
          interactive
          @click="selectedId = row.id"
        />
      </div>
    </div>

    <div slot="sidebar">
      <mb-ica-header :heading="selectedRow?.name ?? ''" />
      <div style="overflow: auto; max-height: calc(100vh - 44px);">
        <!-- detaljer för selectedRow -->
      </div>
    </div>
  </mb-ica-layout-two-columns>
</template>

<script setup>
import { ref, computed } from 'vue'
const selectedId = ref(null)
const rows = ref([/* ... */])
const selectedRow = computed(() => rows.value.find(r => r.id === selectedId.value))
</script>
```

> **Notera:** När `selectedId` är `null` är `sidebaropen=false` → sidebar dold på < 1024px, synlig med tomt innehåll på ≥ 1024px. Hantera det senare fallet med ett placeholder-content i sidebar-sloten om du vill undvika en tom högerkolumn på desktop.

## Vanliga misstag

- **Flytta inte page-header när du byter läge** — i 2-kol sitter den inuti `slot="main"` och `slot="sidebar"`, i `nosidebar` sitter den i `slot="header"`. Agenten får sin input från figma-to-prompt som ofta säger "header längst upp" — tänk efter vilket läge vyn är i innan du väljer slot.
- **Sätt inte `--IcaLayoutTwoColumns--header-height` manuellt** — komponenten mäter själv. Manuell värde ger fel scroll-höjd.
- **Glöm inte scroll-wrapper per kolumn** — utan `overflow: auto` + `max-height: calc(...)` scrollar hela sidan i stället för kolumnen, och sticky-buttons fungerar inte.
- **Använd inte `mb-ica-layout-two-columns` i mobila vyer (< 767px)** — projektet använder 430px-frame-flöden där. Om en Figma visar en 2-kolumnsvy som kompakteras till mobil, kompakteras det till en **annan vy** i projektet — inte till samma komponent med andra attribut.
- **Bygg inte eget toggle-UI i komponenten** — det finns ingen inbyggd togglelogik. Öppna sidebar från en `card-row`- eller tabellrad-klick i main, inte från en hamburgare i headern.
- **Blanda inte sidebar-slot och nosidebar** — i `nosidebar`-läget renderas `slot="sidebar"` inte alls. Att ha content där är bortkastad DOM.
- **Räkna inte med att `sidebaropen` påverkar desktop** — över 1024px syns sidebaren alltid. Använd inte attributet som visuell state-toggle på desktop; styr då content i sidebar-slot istället.
- **Lägg inte layouten inuti en `mb-ica-transition-slide`** utan att testa — transition-slide har `transform` i shadow DOM som skapar stacking context (se `design-system/WORKAROUNDS.md`). Vid problem: teleportera overlay/sidebar till body eller undvik nestlingen.
- **Matcha sidebar-transition med projektets konvention** — default är 0.7s, projektet kör 0.3s. Sätt `style="--IcaLayoutTwoColumns--sidebar-duration: 0.3s"` om du vill att sidebar-slide ska kännas lika snappig som `transition-slide` mellan vyer.

## Referens

- Import: `import '@ica-elements/IcaLayoutTwoColumns.js'` (verifiera sökväg mot projektets befintliga imports).
- Relaterade komponenter: `mb-ica-page-header`, `mb-ica-header`, `mb-ica-card-row`, `mb-ica-table`.
- Projekt-konventioner för responsiv: `prototyp/.claude/context/` (se när filen läggs till).
- Shadow DOM-gotchas: `design-system/WORKAROUNDS.md`.

## Visuella referenser

Bilder läggs i samma mapp som denna `api.md`. Filerna nedan är **förväntade namn** — spara skärmbilder från storybook och din prototyp med exakt dessa namn så aktiveras referenserna automatiskt. Om en bild saknas, hoppa rubriken.

### Storybook-dokumentation

| Filnamn | Visar |
|---------|-------|
| `storybook-preview.png` | Storybook:ens demo-visualisering av komponenten med placeholder-content i header/main/sidebar |
| `storybook-attributes-slots.png` | Storybook:ens tabell över attributes (`nosidebar`, `sidebaropen`) och slots (`header`, `main`, `sidebar`, `main-buttons`, `sidebar-buttons`) |
| `storybook-css-properties.png` | Storybook:ens tabell över CSS custom properties och det enda eventet (`closesidebar`) |

### Rendering i faktisk användning

| Filnamn | Visar |
|---------|-------|
| `example-2column-rendered.png` | 2-kolumnsläget: main med datatabell (inkl. selected och disabled row-states) + sidebar med grupperad lista |
| `example-nosidebar-rendered.png` | `nosidebar`-läget: delad page-header med actions och en enkel lista under |
| `example-sidebar-overlay.png` | Overlay-beteendet under 1024px: main fyller bredden, sidebar slider in ovanpå med dimmad bakgrund |

### DOM-struktur (för debugging och shadow-DOM-förståelse)

| Filnamn | Visar |
|---------|-------|
| `dom-2column.png` | DOM-trädet i 2-kol-läge: shadow-root med `__header` (tom) + `__Slots` grid (`__first` + `__last`) + `__overlay`, samt slottad content i `slot="main"` och `slot="sidebar"` |
| `dom-nosidebar.png` | DOM-trädet i `nosidebar`-läge: shadow-root med `__header` (fylld, höjd 141px) + `__Slots__no-sidebar` (inga grid-kolumner), samt slottad content i `slot="header"` och `slot="main"` |

### Kompilerad CSS

| Filnamn | Visar |
|---------|-------|
| `compiled-css-base.png` | `.IcaLayoutTwoColumns`-klassens bas-stilar: `max-width: 85rem`, `padding: 0 var(--gutters, 12px)`, `height: 100%`, `margin: auto` (centrering) |
