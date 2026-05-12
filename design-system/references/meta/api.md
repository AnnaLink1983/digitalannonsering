# mb-ica-meta

Strukturerad text med heading, subheading och text. Ersätter alla custom div/span-strukturer.

## När ska du använda meta?

- Alltid i `mb-ica-card-row` default slot för strukturerad text
- I `mb-ica-media-object` (slot="last") bredvid bilder
- Överallt där du behöver titel + undertitel + beskrivning
- Bygg aldrig custom HTML för denna typ av textstruktur

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | string | "" | Heading text. HTML content is allowed |
| `subheading` | string | "" | Subheading text. HTML content is allowed |
| `text` | string | "" | Normal text. HTML content is allowed |
| `theme` | string | "" | Theme. Allowed: `disabled`, `accent` |
| `jumbo` | boolean | false | Use page header font sizes |
| `layout` | string | "" | Layout. Allowed: `centered` |
| `truncate` | boolean | false | Truncate overflowing text |
| `compact` | boolean | false | Renders compact version with all three texts in one row |

## Kodexempel

I en card-row:
```html
<mb-ica-card-row chevron>
  <mb-ica-meta heading="Leverans #4821" subheading="ICA Kvantum Mobilia" text="2026-04-01 · 14 kolli"></mb-ica-meta>
</mb-ica-card-row>
```

I en media-object:
```html
<mb-ica-media-object>
  <img slot="first" src="produkt.jpg" alt="" style="width:48px;height:48px;object-fit:cover;border-radius:4px" />
  <mb-ica-meta slot="last" heading="Bregott 600g" subheading="EAN: 07330060019801" text="Mejeri"></mb-ica-meta>
</mb-ica-media-object>
```

Accent-tema (röd text):
```html
<mb-ica-meta heading="Avvikelse" text="3 artiklar saknas" theme="accent"></mb-ica-meta>
```

Kompakt variant (en rad):
```html
<mb-ica-meta heading="Antal:" subheading="12 st" compact></mb-ica-meta>
```

Centrerad layout:
```html
<mb-ica-meta heading="Inga resultat" text="Ändra din sökning" layout="centered"></mb-ica-meta>
```

## Vanliga misstag

- **Bygg aldrig custom div/span-strukturer för titel + undertitel** — använd alltid `mb-ica-meta`
- **Fyll card-row:s default slot med meta, inte godtycklig HTML** — meta hanterar typografi och spacing korrekt
- **Använd `subheading` för sekundär information** — inte `text`. `text` är för beskrivande text i en tredje rad
- **Lägg aldrig meta i en wrapper-div** — placera direkt i slotten
