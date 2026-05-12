# mb-ica-key-value

Nyckel-värde-par för att visa metadata på en rad.

## När ska du använda key-value?

- Detaljvyer med metadata (t.ex. "Leveransdatum: 2026-04-01")
- Sammanfattningskort med nyckeltal
- Inuti `mb-ica-card` för strukturerad metadata

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `keytext` | string | "" | Key text, displayed on the left |
| `valuetext` | string | "" | Value text, displayed on the right |
| `align` | string | "space-between" | Text alignment. Allowed: `start`, `space-between`, `end` |

## Kodexempel

I ett detaljkort:
```html
<mb-ica-card>
  <mb-ica-key-value keytext="Leveransdatum" valuetext="2026-04-01"></mb-ica-key-value>
  <mb-ica-key-value keytext="Antal kolli" valuetext="14"></mb-ica-key-value>
  <mb-ica-key-value keytext="Leverantör" valuetext="Arla Foods"></mb-ica-key-value>
</mb-ica-card>
```

Vänsterjusterad:
```html
<mb-ica-key-value keytext="EAN" valuetext="07330060019801" align="start"></mb-ica-key-value>
```
