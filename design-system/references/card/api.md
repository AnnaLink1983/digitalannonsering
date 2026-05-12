# mb-ica-card

Innehållskort med skugga eller ram. Wrapper för grupperat innehåll.

## När ska du använda card?

- Gruppering av relaterade element (t.ex. statistik, sammanfattning)
- Visuell avgränsning av innehållsblock
- Med `border` för platt stil, med `cornerradius` för rundade hörn
- Med `inverted` för subtil bakgrund (grå/inset)

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `gutters` | string | "" | Gutters. Allowed: `side` |
| `nogutters` | boolean | false | Disable gutters |
| `inverted` | boolean | false | A bit darker and inset instead of elevated |
| `subtle` | boolean | false | Display variation: subtle |
| `pointer` | boolean | false | Add a pointer for a tooltip-ish look |
| `pointerside` | string | "top" | Which side to display the pointer on. Allowed: `top`, `left`, `bottom`, `right` |
| `small` | boolean | false | Render in small variation |
| `large` | boolean | false | Render in large variation |
| `flat` | boolean | false | Bottom inset instead of drop shadow |
| `flexlayout` | boolean | false | Enable flex layout for card content, used for widgets |
| `label` | string | "" | Label shown to the right of the header. Only visible if header slot is present |
| `border` | boolean | false | Full border instead of drop shadow |
| `cornerradius` | string | "" | Display card with rounded corners. Combine with `border` for flat rounded bordered card. Allowed: `small`, `large` |

> ⚠️ Bilden var avskuren i toppen — de första attributen kan saknas. Komplettera när fler screenshots finns.

## Kodexempel

Standard card:
```html
<mb-ica-card>
  <mb-ica-key-value keytext="Antal kolli" valuetext="14"></mb-ica-key-value>
  <mb-ica-key-value keytext="Leveransdatum" valuetext="2026-04-01"></mb-ica-key-value>
</mb-ica-card>
```

Card med border och rundade hörn:
```html
<mb-ica-card border cornerradius="small">
  <mb-ica-meta heading="Sammanfattning" text="3 avvikelser"></mb-ica-meta>
</mb-ica-card>
```

Inverterad bakgrund:
```html
<mb-ica-card inverted>
  <!-- innehåll med subtil grå bakgrund -->
</mb-ica-card>
```
