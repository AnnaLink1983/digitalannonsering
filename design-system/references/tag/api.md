# mb-ica-tag

Etikett/statusmarkering för att visa kategorier eller tillstånd.

## När ska du använda tag?

- Statusindikatorer (t.ex. "Ny", "Aktiv", "Avslutad")
- Kategorietiketter
- Med `interactive` för klickbara tags
- Med `accent` för röd markering

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | "" | What text to display on the tag |
| `type` | string | "button" | If the tag is interactive, determines the button element type |
| `arialabel` | string | — | Aria label for the tag button |
| `active` | boolean | false | If the tag is considered active |
| `accent` | boolean | false | Display in accent colors |
| `subtle` | boolean | false | **Deprecated** — subtle colored tag is no longer recommended |
| `background` | string | — | Tag background color |
| `interactive` | boolean | false | If true, the tag renders as a button and issues click events |

## Slots

| Name | Description |
|------|-------------|
| `actions` | Insert actions here |
| `icons` | Insert icons here |

## CSS Custom Properties

| Property | Default |
|----------|---------|
| `--IcaTag--elements--height` | 1.75rem |

## Kodexempel

Status-tag:
```html
<mb-ica-tag text="Aktiv"></mb-ica-tag>
```

Pill-tag med custom bakgrundsfärg (statusindikator):
```html
<mb-ica-tag
  text="Inget innehåll"
  type="pill"
  background="#DB000B"
></mb-ica-tag>
```
> **OBS:** `type="pill"` ger avrundad pill-form. Kombinera med `background`
> för statusfärger som inte täcks av `accent`.

Accent (röd):
```html
<mb-ica-tag text="Avvikelse" accent></mb-ica-tag>
```

Interaktiv tag:
```html
<mb-ica-tag text="Mejeri" interactive @click="filterByCategory('mejeri')"></mb-ica-tag>
```

Med custom bakgrund:
```html
<mb-ica-tag text="Hög prioritet" background="#e13205" style="color:white"></mb-ica-tag>
```

## Vanliga misstag

- **Välj rätt type** — `type="pill"` för statusbadges, default för vanliga tags
- **Använd `background` för custom färger** — inte CSS-override. `background`-attributet hanterar kontrast och tillgänglighet korrekt
