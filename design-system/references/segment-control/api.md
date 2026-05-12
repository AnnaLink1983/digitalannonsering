# mb-ica-segment-control

Flikar/tabs för att byta mellan vyer eller innehållsfilter.

## När ska du använda segment-control?

- Byta mellan olika vyer inom samma sida (t.ex. "Alla" / "Butiksproducerade")
- Filtrera innehåll med tabs istället för dropdown
- Alltid med `fullwidth` om kontrollern ska fylla hela bredden

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | string | `JSON.stringify([])` | JSON.stringified array av tabs: `[{ title: 'Tab1', id: 'xxx', badge: 1 }]`. `title` och `id` är obligatoriska |
| `selected` | string | "" | ID för den valda tabben |
| `fullwidth` | boolean | false | Gör segment control full bredd av sin container |
| `id` | string | uniqueId() | Unikt id |

## Events

| Event | Description |
|-------|-------------|
| `segmentclick` | Fires when a tab is clicked. `event.detail` contains the tab object |

## Kodexempel

Tabs för listefiltrering:
```html
<mb-ica-segment-control
  :tabs='JSON.stringify([
    { id: "alla", title: "Alla" },
    { id: "butik", title: "Butiksproducerade" },
    { id: "lager", title: "Lager" }
  ])'
  :selected="activeTab"
  fullwidth
  @segmentclick="onTabChange"
></mb-ica-segment-control>
```

Med badge (notis-räknare):
```html
<mb-ica-segment-control
  :tabs='JSON.stringify([
    { id: "scanning", title: "Scanning" },
    { id: "lista", title: "Lista", badge: 5 }
  ])'
  selected="scanning"
></mb-ica-segment-control>
```

## Vanliga misstag

- **Skicka aldrig tabs som vanlig array** — måste vara `JSON.stringify([])`
- **Sätt alltid `selected` till ett giltigt tab-id** — aldrig `undefined` eller tomt
