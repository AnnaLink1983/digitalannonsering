# mb-ica-page-header

Sidrubrik med brödtext, status och actions. Större än `mb-ica-header`.

## När ska du använda page-header?

- Detaljsidor med rubrik, status och actions
- Sidor som behöver tillbaka-navigation via `backlabel`
- Skiljer sig från `mb-ica-header` — page-header är för innehållsrubriker, header är för appens navigation

## Attributes

> ⚠️ Bilden var avskuren i toppen — de första attributen kan saknas. Komplettera vid behov.

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | string | "" | Heading text |
| `subheading` | string | "" | Subheading text |
| `backlabel` | string | "" | Label for navigating back |
| `status` | string | "" | Status theme, passed on to ica-color-indicator. Allowed: `notice`, `success`, `failure`, `disabled` |
| `statustext` | string | "" | Status text, displayed next to status color |
| `actions` | string | `JSON.stringify([])` | JSON.stringified array av actions: `[{ icon: 'circle', label: 'Edit', disabled: false, id: 'for callback', badge: 1 }]` |
| `prioritizeactions` | boolean | false | Display actions as long as space is available, instead of being grouped |
| `maxactions` | number | — | Max number of actions to display. Use together with `prioritizeactions` |
| `compact` | boolean | false | Render a compact version of the header |

## Slots

| Name | Description |
|------|-------------|
| `heading` | Use when heading/subheading props is not enough |
| `top` | Slot for use above heading |
| `left` | Slot for carousel left toggle |
| `right` | Slot for carousel right toggle |

## Events

> Verifierat mot bundlat Svelte-källa i `@ica-azure/ica-elements/IcaPageHeader.js`.
> api.md saknade tidigare events — fyll på här om fler upptäcks.

| Event | Trigger | Detail-payload |
|-------|---------|---------------|
| `leftactionclick` | Klick på back-knappen (visas när `backlabel` är satt) | `{ label: <backlabel> }` |
| `rightactionclick` | Klick på en action i `actions`-arrayen (utom när Fler-meny stängs) | `{ icon, label, id, ... }` (action-objektet) |

### Vanligt fel

```vue
<!-- ❌ Fel — backclick existerar inte, eventet fyrar aldrig -->
<mb-ica-page-header backlabel="Tillbaka" @backclick="goBack" />

<!-- ✅ Rätt -->
<mb-ica-page-header backlabel="Tillbaka" @leftactionclick="goBack" />
```

Mönstret är konsekvent med `mb-ica-header` — vänster-knappen i headern skickar
alltid `leftactionclick`, höger-actions skickar `rightactionclick`.

## Kodexempel

```html
<mb-ica-page-header
  heading="Leverans #4821"
  subheading="ICA Kvantum Mobilia"
  status="success"
  statustext="Mottagen"
  backlabel="Tillbaka till leveranser"
></mb-ica-page-header>
```

Kompakt version:
```html
<mb-ica-page-header
  heading="Order #1234"
  compact
></mb-ica-page-header>
```
