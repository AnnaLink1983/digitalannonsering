# mb-ica-drawer

Sidopanel som glider in från sidan.

## När ska du använda drawer?

- **Filterpaneler** — standardvalet för att öppna filter (inte dialog)
- Sekundärt innehåll som inte motiverar en helskärmsdialog
- Inställningspaneler eller detaljer
- Navigeringsmeny (hamburger menu)

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | false | Set open/close state |
| `id` | string | uniqueId() | Optionally set an id |

## Slots

| Name | Description |
|------|-------------|
| `head` | Header content |
| `default` | Slot for main content |
| `buttons` | Place fullwidth IcaButtons here |

## CSS Custom Properties

| Property | Default |
|----------|---------|
| `--IcaDrawer--z-index` | 400 |

## Events

| Event | Description |
|-------|-------------|
| `close` | Fires on close |
| `closed` | Fires when drawer is successfully closed |

## Kodexempel

Enkel drawer:
```html
<mb-ica-drawer :open="drawerOpen" @close="drawerOpen = false">
  <mb-ica-header slot="head" heading="Inställningar" leftaction="close" @leftactionclick="drawerOpen = false"></mb-ica-header>
  <div style="padding:var(--ica-spacing-md)">
    <!-- innehåll -->
  </div>
  <mb-ica-button slot="buttons" text="Spara" fullwidth @click="save"></mb-ica-button>
</mb-ica-drawer>
```

Filter-drawer (se även `references/filter/api.md`):
```html
<mb-ica-drawer :open="filterOpen" @close="filterOpen = false">
  <mb-ica-header
    slot="head"
    variant="dialog"
    heading="Filter"
    leftaction="close"
    @leftactionclick="filterOpen = false"
  />

  <mb-ica-accordion heading="Avdelningar" :expanded="true">
    <mb-ica-card-row v-for="dept in departments" :key="dept.id" noninteractive truncate>
      <mb-ica-checkbox :checked="dept.selected" @change="toggleDept(dept)">
        <mb-ica-meta :heading="dept.name" />
      </mb-ica-checkbox>
    </mb-ica-card-row>
  </mb-ica-accordion>

  <mb-ica-button slot="buttons" text="Visa" fullwidth @click="applyFilters" />
  <mb-ica-button slot="buttons" text="Spara filter" fullwidth variation="secondary" @click="saveFilter" />
</mb-ica-drawer>
```

## Knappars position — sticky bottom

Drawerns `buttons`-slot har `position: sticky; bottom: 0` och `margin-top: auto`
inuti shadow DOM. Den pushas automatiskt till botten av drawern i flex-layouten.

**Viktigt — `--IcaDrawer--header-height`:** Drawerns `content__inner` beräknar sin
höjd med `height: calc(100% - var(--IcaDrawer--header-height))`. Om denna variabel
inte sätts (t.ex. vid custom head-slot med wrapper-div) kollapsar content-arean och
knapparna hamnar direkt under innehållet istället för i botten.

**Fix:** Sätt alltid `--IcaDrawer--header-height: 44px` på drawern när du använder
`slot="head"` med en wrapper-div:

```html
<mb-ica-drawer :open="drawerOpen" style="--IcaDrawer--header-height: 44px">
  <div slot="head">...</div>
  ...
</mb-ica-drawer>
```

Om knapparna inte fastnar i botten, kontrollera att:
1. Du använder `slot="buttons"` (inte `slot="footer"` eller liknande)
2. `--IcaDrawer--header-height` är satt (44px för standard `mb-ica-header`)

## Z-index och stacking context — viktigt vid transitions

Drawern använder `position: fixed` inuti shadow DOM. Om drawern renderas inuti en
`mb-ica-transition-slide` (som har `transform` på sitt inre element) skapas en ny
stacking context som **fångar** drawerns fixed-positionering. Det gör att drawern
hamnar under bottom navigation (z-index 900) trots att drawern själv har z-index 1000.

**Fix:** Wrappa drawern i `<Teleport to="body">` så att den renderas utanför
transition-slide och deltar i root stacking context:

```html
<Teleport to="body">
  <mb-ica-drawer :open="drawerOpen" style="--IcaDrawer--z-index: 1000">
    ...
  </mb-ica-drawer>
</Teleport>
```

## Vanliga misstag

- **Använd `slot="head"` för headern** — inte `slot="header"` (som i dialog)
- **Drawer är standardval för filter** — använd inte `mb-ica-dialog` för filterpaneler
- **Knapparna sitter i botten** — de har `position: sticky; bottom: 0` i shadow DOM, du behöver inte positionera dem manuellt
- **Teleport vid transitions** — om drawern renderas i en vy med `mb-ica-transition-slide`, använd `<Teleport to="body">` annars hamnar drawern under bottom navigation
