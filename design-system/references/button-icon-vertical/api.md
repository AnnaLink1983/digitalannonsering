# mb-ica-button-icon-vertical

Vertikal ikonknapp med text under. Används i bottom navigation.

**OBS:** Denna komponent har `mb-`-prefix (inte `mb-ica-`). Tagnamnet är `mb-ica-button-icon-vertical`.

## När ska du använda button-icon-vertical?

- Bottom navigation (tabs med ikon ovanför text)
- Vertikal action-knapp där ikon och label ska staplas

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | — | A text to render in the button |
| `arialabel` | string | — | aria-label for the button |
| `type` | string | `submit` | Set an html type. Allowed: `submit`, `reset` |
| `name` | string | — | Set an html name |
| `id` | string | `uniqueId()` | Set an html id |
| `variation` | string | `action` | Style variation. Allowed: `action`, `warning`, `inherit` |

## Slots

| Name | Description |
|------|-------------|
| `default` | Place icon here |

## Events

| Name | Description |
|------|-------------|
| `click` | Fires on click |

## Ikonstorlek i slot

Ikonen som placeras i default slot renderas med:
```css
font-size: 1.3rem;
margin-bottom: -4px;
margin-top: -4px;
```
Dessa värden sätts internt av komponenten — skriv inte egen CSS för detta.

## Textstil

Texten renderas med:
```css
font-size: 10px;
font-family: ICATextNy, sans-serif;
font-weight: 700; /* bold */
color: #626262;
```
**OBS:** font-weight är `700` (bold), inte `400`.

## Vanlig användning

### Bottom navigation item
Se `design-system/PATTERNS.md` → "Bottom navigation (mobil)" för komplett HTML, CSS och ikonval.

### Aktiv tab i navigation
Aktiv-markering styrs av parent-elementet (`mb-navigation-bottom__item--active` klass på `<li>`), inte av button-icon-vertical själv.

## Shadow DOM-struktur

Internt renderar komponenten:
```html
<button class="IcaButtonIconVertical IcaButtonIconVertical--inherit">
  <slot></slot>  <!-- ikon -->
  <span>text</span>
</button>
```

## Vanliga misstag

- ❌ Bygg aldrig custom HTML (`<button>` + `<span>` + ikon) för vertikal ikon+text — använd denna komponent
- ❌ Använd aldrig `variation="action"` i navigation — det ger röd färg. Använd `variation="inherit"`
- ❌ Förväxla inte med `mb-ica-buttonicon` (horisontell ikonknapp) — det är en annan komponent

## Import

```js
import '@user-components/MbIcaButtonIconVertical.js'
```

## OBS: mb-prefix

Denna komponent tillhör en uppsättning `mb-`-prefixade komponenter som används i app-skalet (navigation, header). De följer samma mönster som `mb-ica-`-komponenterna men har ett annat prefix.
