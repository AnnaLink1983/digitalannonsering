# mb-ica-media-object

Grid-layout som kombinerar bild + text (t.ex. meta) sida vid sida.

## När ska du använda media-object?

- I `card-row` default slot när raden innehåller bild + strukturerad text
- Produktlistor med bild och artikelinformation
- Alla rader som kombinerar en visuell element (bild, ikon) med textinnehåll

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `align` | string | "center" | Vertikal justering. Allowed: `start`, `center`, `end` |
| `truncate` | boolean | false | Truncate overflowing text i slottade element |

## Slots

| Name | Description |
|------|-------------|
| `first` | Första kolumnen — typiskt en bild eller ikon |
| `last` | Andra kolumnen — typiskt `mb-ica-meta` med heading/subheading/text |

## CSS Custom Properties

| Name | Default | Description |
|------|---------|-------------|
| `--IcaMediaObject--template-columns` | `auto auto` | Grid column template |

## Kodexempel

Produktrad med bild:
```html
<mb-ica-card-row chevron>
  <mb-ica-media-object>
    <img slot="first" src="produkt.jpg" alt="Produkt" style="width:48px;height:48px;object-fit:cover;border-radius:4px" />
    <mb-ica-meta slot="last" heading="Bregott 600g" subheading="EAN: 07330060019801" text="Mejeri"></mb-ica-meta>
  </mb-ica-media-object>
</mb-ica-card-row>
```

Med ikon istället för bild:
```html
<mb-ica-media-object>
  <mb-ica-icon-recall slot="first"></mb-ica-icon-recall>
  <mb-ica-meta slot="last" heading="Återkallelse" text="2 produkter"></mb-ica-meta>
</mb-ica-media-object>
```

## Vanliga misstag

- **Bygg aldrig custom div-strukturer med img + text** — använd media-object istället
- **`first` slot = bild/ikon, `last` slot = mb-ica-meta** — blanda aldrig
- **Lägg aldrig wrapper-divs runt slottade element** — placera direkt i slots
