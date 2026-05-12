# mb-ica-segment

Sektion med rubrik som grupperar relaterat innehåll.

## När ska du använda segment?

- Gruppering av listrader under en rubrik (t.ex. "Leveranser", "Ordrar")
- Sektionsavdelare med heading och valfri högertext
- Variant `table-category` för desktop-tabellrubriker
- **Kolumn-header-rad i responsiva tabell→lista-vyer på mobil** — använd `heading` (vänster, t.ex. "ARTIKEL") och `headingright` (höger, dynamiskt namn på aktiv sort-kolumn som "STATUS"). Bygg ALDRIG en custom div för denna rad. Se `PATTERNS.md` → "Responsiv tabell"

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | string | "" | Heading text |
| `headingright` | string | "" | Heading right text |
| `truncate` | boolean | true | Truncate heading and subheading text |
| `noinset` | boolean | false | Remove inset for heading |
| `nomargin` | boolean | false | Remove top margin |
| `variant` | string | "default" | Display heading with default styles or table category styles (for desktop). Allowed: `default`, `table-category` |

## Slots

| Name | Description |
|------|-------------|
| `default` | Place segment content here |
| `left` | Place an ica-checkbox or ica-icon here |

## Kodexempel

Sektion med rubrik:
```html
<mb-ica-segment heading="Aktiva leveranser">
  <mb-ica-card-row chevron>
    <mb-ica-meta heading="Leverans #4821"></mb-ica-meta>
  </mb-ica-card-row>
</mb-ica-segment>
```

Med antal till höger:
```html
<mb-ica-segment heading="Varor" headingright="12 st">
  <!-- innehåll -->
</mb-ica-segment>
```

Utan top margin (tight layout):
```html
<mb-ica-segment heading="Filter" nomargin>
  <!-- innehåll -->
</mb-ica-segment>
```
