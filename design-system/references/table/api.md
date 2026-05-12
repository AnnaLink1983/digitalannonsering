# mb-ica-table

Datatabell med sorterbara kolumnrubriker och rader som består av `mb-ica-card-row`.

## När ska du använda table?

- Strukturerad data i rader och kolumner där kolumnrubriker är meningsfulla
- Jämförelser eller listor med flera datapunkter per rad som ska justeras i kolumner
- Sorterbar data (headeritemclick används för att sortera)
- När kolumnerna bör ha tooltips, actions eller kompakt-läge

> Om du inte behöver kolumnrubriker → använd bara `mb-ica-card-row` direkt.

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | `""` | Id för tabellen |
| `headeritems` | string | `"[]"` | JSON.stringified array av `HeaderItem` (se interface nedan) |
| `compact` | boolean | false | Renderar en kompakt variant av tabellen |
| `compacttoggle` | boolean | false | Visar en toggle i tabellheadern som växlar kompakt-läge |

### HeaderItem interface

```ts
interface HeaderItem {
  label: string;                                    // Kolumnrubrik (UPPERCASE i UI)
  longLabel?: string;                               // Längre variant (tooltip/utfälld?)
  subLabel?: string;                                // Sekundär rad under label — observerad i example + visuell referens men EJ listad i interface i Storybook. Verifiera.
  column?: number;                                  // 1-indexerad kolumn-ordning
  sortdirection?: 'desc' | 'asc' | 'default';      // 'default' = osorterad (visar dubbel-chevron upp/ner)
  id?: string;                                      // Id för event.detail.id
  tooltipText?: string;                             // Hovra-tooltip på headern
  tooltipCritical?: boolean;                        // Röd/varningsvariant av tooltip
  actions?: string;                                 // JSON.stringify av Array<{ icon: string; label: string; id: string }> — dropdown-actions per header
}
```

## Slots

| Name | Description |
|------|-------------|
| `default` | Tabellens radinnehåll. Lägg `mb-ica-card-row`-element här (direkt eller i en wrapper-div — t.ex. för `v-for`-listor). Varje cell är en direkt child av card-rowen och kan vara valfritt element (`<div>`, `<p>`, `<span>`, `mb-ica-media-object` m.fl.) |
| `left` | Master-kolumn i tabellheadern. Användningsfall: en `mb-ica-checkbox` för **select-all** när varje rad också har en checkbox i sitt eget `left`-slot. Motsvarar den extra kolumnen till vänster om headerrubrikerna |

## CSS Custom Properties

| Name | Default | Description |
|------|---------|-------------|
| `--IcaTable--header-columns` | — | **Primär layout-driver.** grid-template-columns-syntax som definierar kolumnbredderna, t.ex. `4fr 2fr 2fr 2fr 2fr 2fr 1.5fr 1fr 1.5rem`. Varje `mb-ica-card-row` inuti tabellen MÅSTE sätta `--IcaCardRow--grid-template-columns` till samma värde för att aligna mot headern |
| `--IcaTable__header-items-top` | `0` | Top-offset för sticky kolumnrubriker — sätt om tabellen ligger under en sticky header |
| `--IcaTable__header-items-z-index` | `1` | Z-index för kolumnrubriker. Höj om chevron/transform-element i raderna visuellt överlappar headern |

### Layout-regel (kritisk)

Tabellens och radernas kolumnbredder styrs av **matchande CSS custom properties**:

```html
<mb-ica-table style="--IcaTable--header-columns: 4fr 2fr 2fr 1.5rem;">
  <mb-ica-card-row style="--IcaCardRow--grid-template-columns: 4fr 2fr 2fr 1.5rem;">
    <!-- 4 celler, exakt samma antal tracks som grid-template-columns -->
  </mb-ica-card-row>
</mb-ica-table>
```

Antal cell-element i raden ≠ antal `headeritems`. Extra tracks kan reserveras för ex. chevron-utrymme (`1.5rem`) eller action-kolumn.

## Events

| Name | event.detail | Description |
|------|--------------|-------------|
| `headeritemclick` | `{ label, column, sortdirection, id }` | Click på en header som inte är disabled — använd för att sortera listan |
| `compacttoggleclick` | — | Toggle för kompakt-läge klickad (när `compacttoggle` är satt) |
| `headeritemactionclick` | — | Action i en headers `actions`-dropdown klickad |

## Kodexempel

### Enkel tabell med två kolumner

```html
<mb-ica-table
  style="--IcaTable--header-columns: 1fr 1fr;"
  :headeritems='JSON.stringify([
    { label: "Kolumn1", subLabel: "Sublabel", column: 1, sortdirection: "desc", id: "column1" },
    { label: "Kolumn2", subLabel: "Sublabel med lång text", column: 2, sortdirection: "default", id: "column2" }
  ])'
>
  <mb-ica-card-row style="--IcaCardRow--grid-template-columns: 1fr 1fr;">
    <span>Rad 1, Column 1</span>
    <span>Rad 1, Column 2</span>
  </mb-ica-card-row>
  <mb-ica-card-row style="--IcaCardRow--grid-template-columns: 1fr 1fr;">
    <span>Rad 2, Column 1</span>
    <span>Rad 2, Column 2</span>
  </mb-ica-card-row>
</mb-ica-table>
```

### Produktionsmönster: bild + text + flera värden + select-all

Motsvarar strukturen från MinButik-monorepot (BOB-teamet). Master-checkbox i tabellens `left`-slot väljer alla, rad-checkbox i varje card-rows `left`-slot väljer individuellt.

```html
<mb-ica-table
  :style="{ '--IcaTable--header-columns': gridCols }"
  :headeritems="JSON.stringify(headers)"
  @headeritemclick="onHeaderClick"
>
  <mb-ica-checkbox slot="left" :checked="allSelected" @change="toggleAll" arialabel="Välj alla"></mb-ica-checkbox>

  <!-- Wrapper-div är OK (praktiskt för v-for) -->
  <div class="table-body">
    <mb-ica-card-row
      v-for="row in sortedRows"
      :key="row.id"
      :style="{ '--IcaCardRow--grid-template-columns': gridCols }"
    >
      <mb-ica-checkbox slot="left" :checked="row.selected" @change="toggleRow(row)" arialabel="Välj rad"></mb-ica-checkbox>

      <!-- Cell 1: bild + text (t.ex. artikel) -->
      <div class="article-cell">
        <mb-ica-media-object>
          <img slot="first" :src="row.image" :alt="row.name" width="48" height="48" />
          <mb-ica-meta slot="last" :heading="row.name" :subheading="row.description"></mb-ica-meta>
        </mb-ica-media-object>
      </div>

      <!-- Cell 2-N: enkla textvärden (div, inte span) -->
      <div>{{ row.articleNr }}</div>
      <div class="cell--right">{{ row.price }}</div>
      <div class="cell--right">{{ row.margin ?? '--' }}</div>
    </mb-ica-card-row>
  </div>
</mb-ica-table>
```

```js
const gridCols = '4fr 2fr 2fr 2fr 1.5rem'  // matchar antal celler + ev. reserverat utrymme
```

**Pattern-regler:**
- Master-checkbox i tabellens `slot="left"` — triggas av `@change` på checkboxen
- Rad-checkbox i varje card-rows `slot="left"` — individuellt val
- `gridCols` lagras som variabel så tabell + rader synkas (en källa, två bindningar)
- Tomma/saknade värden renderas som `--` (dubbla tankstreck)
- Högerjustering av numeriska värden görs med projektspecifik CSS-klass (t.ex. `.cell--right { text-align: right }`)

### Sorteringsrotation

```html
<mb-ica-table
  :style="{ '--IcaTable--header-columns': gridCols }"
  :headeritems="JSON.stringify(headers)"
  @headeritemclick="onHeaderClick"
>
  <mb-ica-card-row
    v-for="row in sortedRows"
    :key="row.id"
    :style="{ '--IcaCardRow--grid-template-columns': gridCols }"
  >
    <span>{{ row.name }}</span>
    <span>{{ row.value }}</span>
  </mb-ica-card-row>
</mb-ica-table>
```

```js
function onHeaderClick(e) {
  const { id, sortdirection } = e.detail
  // Växla sortdirection: default → desc → asc → default
  const next = sortdirection === 'default' ? 'desc' : sortdirection === 'desc' ? 'asc' : 'default'
  headers.value = headers.value.map(h => ({
    ...h,
    sortdirection: h.id === id ? next : 'default'
  }))
}
```

### Tabell med compact-toggle

```html
<mb-ica-table
  :headeritems="JSON.stringify(headers)"
  compacttoggle
  :compact="isCompact"
  @compacttoggleclick="isCompact = !isCompact"
>
  <!-- rader -->
</mb-ica-table>
```

## Vanliga misstag

- **Bygg aldrig rader med custom `<table>`-HTML** — använd alltid `mb-ica-card-row` som barn av `mb-ica-table`. Kolumnbredd, padding och typografi hanteras via shadow DOM
- **Glöm aldrig `--IcaCardRow--grid-template-columns` på raderna** — utan matchande grid-template på card-rowen alignar inte cellerna mot headern. Tabellen styr header-kolumnerna; varje rad styr sin egen grid separat
- **Antalet celler i raden måste matcha antalet tracks i `grid-template-columns`** — inte antalet `headeritems`. En extra track kan reserveras för chevron, action eller padding
- **Cellinnehåll kan vara valfritt element** — `<div>`, `<p>`, `<span>`, `mb-ica-media-object`. Det som spelar roll är att varje cell är en direkt child av card-rowen (inte wrappad i en extra div som skulle hamna i fel grid-track)
- **Sätt alltid `id` på varje HeaderItem om du använder `headeritemclick`** — `event.detail.id` är hur du identifierar vilken kolumn som klickades
- **Skicka `headeritems` som JSON-sträng, inte som Vue-array** — komponenten parsar attributet som string. Använd `:headeritems='JSON.stringify([...])'` (notera enkla citationstecken runt v-bind-värdet)
- **`subLabel` är observerad i Storybook-exempel + produktionskod men inte i TypeScript-interface:t** — om den slutar fungera i en framtida version, kolla Storybook först
- **Använd aldrig `left`-sloten för annat än master-checkbox på tabellen** — i produktion är detta den etablerade användningen. Andra användningar är odokumenterade
