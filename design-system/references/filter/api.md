# mb-ica-filter

Filterkontroll med shortcuts (chips) och filterknapp. Renderar en horisontell rad med filter-chips.

## När ska du använda filter?

- Listor eller tabeller som behöver filtrering
- Alltid i kombination med `mb-ica-drawer` för filterpanelen (inte dialog)
- Shortcuts för snabbval som alltid är synliga
- Filters med `removable: true` för aktiva filterval som kan tas bort

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `filters` | string | `JSON.stringify([])` | JSON.stringified array av filter `{ id, text, removable }`. För filter utan close-ikon, sätt `removable: false` tillsammans med `shortcuts` |
| `shortcuts` | string | — | JSON.stringified array av förinställda shortcuts `{ id, text }`. **OBS!** Måste alltid sättas som en stringifierad array (tom eller ifylld) för att shortcuts ska användas istället för gamla filters-metoden |
| `incard` | boolean | true | Render filter med wrappande card |
| `filterbuttonarialabel` | string | "Visa filter" | Aria-label för filter-knappen |
| `deletefilterarialabel` | string | "Ta bort filter" | Aria-label för delete filter-knappen |
| `id` | string | uniqueId() | Sätt filter-id |

## Events

| Event | Description |
|-------|-------------|
| `filterbuttonclick` | Fires when filter button (tratt-ikon) is clicked |
| `shortcutitemclick` | Fires when a shortcut chip is clicked. `event.detail` contains the shortcut object (e.g. `{ id: 'dairy' }`) |
| `filteritemdelete` | Fires when a removable filter chip is removed. `event.detail` contains the filter object (e.g. `{ id: '211' }`) |

## Kodexempel

Filter med shortcuts och tom filterlista:
```html
<mb-ica-filter
  :shortcuts='JSON.stringify([
    { id: "avdelningar", text: "Avdelningar" },
    { id: "status", text: "Status" },
    { id: "datum", text: "Datum" }
  ])'
  :filters='JSON.stringify([])'
  @filterbuttonclick="openFilterDialog"
  @shortcutitemclick="onShortcutClick"
></mb-ica-filter>
```

Filter med aktiva val (removable chips):
```html
<mb-ica-filter
  :shortcuts='JSON.stringify([
    { id: "avdelningar", text: "Avdelningar" },
    { id: "status", text: "Status" }
  ])'
  :filters='JSON.stringify([
    { id: "chark", text: "Chark & Deli", removable: true },
    { id: "aktiv", text: "Aktiv", removable: true }
  ])'
  @filteritemdelete="removeFilter"
></mb-ica-filter>
```

## Filter-drawer — komplett mönster

Filterpanelen byggs med `mb-ica-drawer` + `mb-ica-header` + `mb-ica-accordion`.

Headern ska ha en "Rensa"-åtgärd till höger som nollställer alla filter.
`mb-ica-header` `actions` renderar **bara ikoner** — inte text.
Därför byggs "Rensa" som ett separat textelement i `slot="head"`, **bredvid** headern:

```html
<mb-ica-drawer :open="filterOpen" @close="filterOpen = false" style="--IcaDrawer--header-height: 44px">
  <div slot="head" class="filter-drawer-head">
    <mb-ica-header
      variant="dialog"
      heading="Filter"
      leftaction="close"
      @leftactionclick="filterOpen = false"
    />
    <button class="filter-drawer-head__clear" @click="clearFilters">Rensa</button>
  </div>

  <!-- Filtersektioner — selectable row-mönstret (EN klickyta per rad) -->
  <mb-ica-accordion heading="Avdelningar" :expanded="expandedSection === 'avdelningar'">
    <mb-ica-card-row v-for="dept in departments" :key="dept.id" noninteractive truncate>
      <mb-ica-checkbox :checked="dept.selected" @change="toggleDept(dept)">
        <mb-ica-meta :heading="dept.name" />
      </mb-ica-checkbox>
    </mb-ica-card-row>
  </mb-ica-accordion>

  <mb-ica-accordion heading="Status">
    <mb-ica-card-row v-for="status in statuses" :key="status.id" noninteractive truncate>
      <mb-ica-checkbox :checked="status.selected" @change="toggleStatus(status)">
        <mb-ica-meta :heading="status.name" />
      </mb-ica-checkbox>
    </mb-ica-card-row>
  </mb-ica-accordion>

  <!-- Knappar -->
  <mb-ica-button slot="buttons" text="Visa" fullwidth @click="applyFilters" />
  <mb-ica-button slot="buttons" text="Spara filter" fullwidth variation="secondary" @click="saveFilter" />
</mb-ica-drawer>
```

> **OBS:** Filterpanelen öppnas i en **drawer** — inte i en dialog.
> Headern är en riktig `mb-ica-header` med `variant="dialog"`.
> "Rensa"-knappen wrappas i samma `slot="head"`-div eftersom
> `mb-ica-header` `actions` bara stödjer ikoner, inte text.
>
> **Filterval använder selectable row-mönstret** — checkbox i card-rowens
> default slot, `mb-ica-meta` som child av checkboxen, ingen `border` på
> card-row (accordion ger gruppering, card-rows inbyggda box-shadow ger
> separator). `truncate` på card-row så lång text inte wrappar. Se
> `card-row/api.md` för full beslutsregel.

## Vanliga misstag

- **Aktiva filter-tags kan vidga sidan** — om filtrets förälder-container (t.ex. `mb-ica-transition-slide` i en grid) saknar `min-width: 0`, expanderar filter-taggarna bortom viewport. Fixas på container-nivå, inte på filter-elementet
- **Använd `mb-ica-drawer` — inte `mb-ica-dialog`** — filterpanelen ska öppnas som en drawer, inte som en bottom sheet/modal
- **Headern ska vara `mb-ica-header` med `variant="dialog"`** — inte en custom div med flex-layout
- **Filter chips använder outlined-varianten med primary color** — inte default grey filled
- **Bygg aldrig egna filter-knappar eller chip-rader** — använd alltid `mb-ica-filter` med `shortcuts` och `filters`
- **"Visa"-knappen ska alltid ha `fullwidth`** — placera den i drawerns `buttons`-slot
- **Expandera rätt accordion-sektion** — när en shortcut-chip klickas ska den matchande accordion-sektionen vara expanderad när drawern öppnas
- **Sätt alltid shortcuts som stringifierad array** — även om den är tom (`JSON.stringify([])`) — annars faller komponenten tillbaka till det gamla filter-beteendet
- **Två knappar i botten** — "Visa" (primary) + "Spara filter" (secondary)
- **"Rensa" i headern** — `mb-ica-header` `actions` renderar bara ikoner, inte text. Wrappa headern och en `<button>` i en `<div slot="head">` och positionera "Rensa" absolute till höger
- **Filterval är selectable rows (EN klickyta)** — placera ALDRIG checkbox i `slot="left"` på filterrader. Checkboxen ligger i card-rowens default slot med `mb-ica-meta` som child. Ingen `border`, använd `truncate`. Det gamla mönstret med `<mb-ica-checkbox slot="left">` + syskon-`<mb-ica-meta>` är fel
- **`--IcaDrawer--header-height: 44px`** — sätt alltid denna variabel på drawern när `slot="head"` använder en wrapper-div, annars hamnar knapparna inte i botten
- **Importera `IcaDrawer.js`** — glöm inte att lägga till `import '@ica-elements/IcaDrawer.js'` i `main.js`, annars renderas drawern som ett vanligt HTML-element utan beteende

### CSS för "Rensa"-knappen i head-slot

```css
.filter-drawer-head {
  position: relative;
}

.filter-drawer-head__clear {
  position: absolute;
  right: var(--ica-spacing-md);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--ica-red);
  font-size: 1rem;
  font-family: 'ICATextNy', sans-serif;
  cursor: pointer;
}
```
