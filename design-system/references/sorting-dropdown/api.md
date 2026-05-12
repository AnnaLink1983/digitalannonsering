# mb-ica-sorting-dropdown

Sorteringsväljare som renderar en kompakt dropdown.

## När ska du använda sorting-dropdown?

- Sortering av listor (t.ex. efter namn, datum, status)
- Placeras bredvid sökfält eller filter

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `options` | string | `JSON.stringify([])` | JSON.stringified array av sorteringsalternativ: `[{ id, value, selected }]` |
| `position` | string | "right" | Should follow if user is left or right handed. Only works with `small`. Allowed: `right`, `left` |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--IcaSortingDropDown--mobile-content-offset` | 0px | Offset content if items become hidden in mobile view |

## Events

| Event | Description |
|-------|-------------|
| `sortingchanged` | Fires when sorting changes. `event.detail` contains sorting options with details on selected sorting |

## Kodexempel

```html
<mb-ica-sorting-drop-down
  :options='JSON.stringify([
    { id: 1, value: "Datum (senast)", selected: true },
    { id: 2, value: "Datum (äldst)", selected: false },
    { id: 3, value: "Namn A-Ö", selected: false }
  ])'
  @sortingchanged="onSort"
></mb-ica-sorting-drop-down>
```

## Vanliga misstag

- **HTML-taggen är `mb-ica-sorting-drop-down`** (med bindestreck) — inte `mb-ica-sorting-dropdown`
- **Options måste vara JSON.stringify()** — aldrig en vanlig array
