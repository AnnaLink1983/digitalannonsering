# mb-ica-buttonicon

Ikonknapp med valfri text. Används för sekundära actions och toolbars.

## När ska du använda buttonicon?

- Stäng-knappar (med `mb-ica-icon-cross` inuti)
- Toolbar-actions (redigera, ta bort, info)
- Sekundära actions med ikon + textlänk
- Filter-dialogens custom header (X-knapp)

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `accent` | boolean | false | Add accented color to the icon |
| `enhanced` | boolean | false | Renders a visually more prominent component (uppercases text) |
| `disabled` | boolean | false | Render as disabled |
| `text` | string | — | A text to render in the button |
| `textfirst` | boolean | false | Place the text before the icon |
| `textpassive` | boolean | false | Visually decrease font weight |
| `light` | boolean | false | Lighten the color of the link |
| `nogrow` | boolean | false | Prevent the click area from growing outside element. Works when there is no text |
| `arialabel` | string | — | Set an aria-label |
| `ariaexpanded` | boolean | — | Set aria-expanded |
| `type` | string | "button" | Html type-attribute. Allowed: `submit`, `cancel`, `button`. **OBS:** Sätt alltid `type="button"` inuti formulär om knappen inte ska submitta |
| `name` | string | — | Set an html name |

## Slots

| Name | Description |
|------|-------------|
| `default` | Placera en ikon-komponent här |

## Kodexempel

Stäng-knapp:
```html
<mb-ica-button-icon arialabel="Stäng" @click="close">
  <mb-ica-icon-cross></mb-ica-icon-cross>
</mb-ica-button-icon>
```

Ikon med text:
```html
<mb-ica-button-icon text="Redigera" @click="edit">
  <mb-ica-icon-pen></mb-ica-icon-pen>
</mb-ica-button-icon>
```

Text före ikon:
```html
<mb-ica-button-icon text="Lägg till" textfirst @click="add">
  <mb-ica-icon-plus-circle></mb-ica-icon-plus-circle>
</mb-ica-button-icon>
```

## Vanliga misstag

- **Glöm aldrig `arialabel`** på knappar utan synlig text — krävs för tillgänglighet
- **Ikonen placeras i default slot** — inte som attribut
