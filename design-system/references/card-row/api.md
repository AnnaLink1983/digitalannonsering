# mb-ica-card-row

Klickbar listrad som används för navigation och val i listor.

## När ska du använda card-row?

- Alla klickbara listrader som navigerar eller triggar en action
- Listor med upprepande poster (leveranser, produkter, ordrar)
- Alltid med `chevron=true` om raden navigerar vidare till en ny vy
- Med `noninteractive=true` för rader som bara visar information

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | boolean | false | Disable the button |
| `active` | boolean | false | Renders a visually active version of the component |
| `focused` | boolean | false | Renders a visually focused version of the component |
| `noninteractive` | boolean | false | Renders a div instead of button — use when row should not be interactive |
| `type` | string | "button" | Set an html type-attribute, e.g. `submit`, `cancel` |
| `odd` | boolean | false | Use in tables for alternating row color |
| `nogutter` | boolean | false | Remove side gutters on the card-row |
| `transparent` | boolean | false | Renders on transparent background |
| `accent` | boolean | false | Display with red text |
| `truncate` | boolean | false | Truncate overflowing text |
| `highlight` | boolean | false | Highlight row with green animation |
| `chevron` | boolean | false | Show chevron to the right |
| `chevrontext` | string | "" | Chevron text |
| `stickyright` | boolean | false | Make the right slot sticky |
| `border` | boolean | false | Display card with flat border instead of shadow |
| `cornerradius` | string | "" | Rounded corners. Combine with `border` for flat rounded bordered card. Allowed: `small` |
| `id` | string | uniqueId() | Set an html id |
| `ariaexpanded` | boolean | — | Set aria-expanded |
| `arialabel` | string | — | Set aria-label |

## Slots

| Name | Description |
|------|-------------|
| `default` | Huvudinnehåll — element fördelas horisontellt med gutter. Fyll med `mb-ica-meta`, `mb-ica-media-object`, eller inputkomponenter (t.ex. `mb-ica-input-number-stepper`) sida vid sida |
| `left` | ENDAST för interaktiva element vid **flera klickytor** i raden (t.ex. checkbox + chevron/action). Aldrig ikoner. Om raden bara har EN klickyta — placera checkboxen i default-sloten istället, se "Selectable row" nedan |
| `right` | ⚠️ **Använd aldrig utan explicit instruktion.** Renderar innehåll till höger med en visuell separator. Om du överväger att använda `right`-sloten — bygg istället en flex-div i default-sloten (se kodexempel nedan). Använd `right` ENBART om användaren explicit ber om det eller om en designreferens visar en visuell separator |

## Kodexempel

Enkel navigeringsrad:
```html
<mb-ica-card-row chevron>
  <mb-ica-meta heading="Leveranser" text="12 aktiva"></mb-ica-meta>
</mb-ica-card-row>
```

Rad med bild och strukturerad text:
```html
<mb-ica-card-row chevron>
  <mb-ica-media-object>
    <img slot="first" src="produkt.jpg" alt="Produkt" style="width:48px;height:48px;object-fit:cover;border-radius:4px" />
    <mb-ica-meta slot="last" heading="Produktnamn" subheading="EAN: 07330060019801" text="3 st"></mb-ica-meta>
  </mb-ica-media-object>
</mb-ica-card-row>
```

Selectable row — checkbox togglar hela radens val (EN klickyta):
```html
<mb-ica-card-row noninteractive>
  <mb-ica-checkbox :checked="isSelected" @change="toggle">
    <mb-ica-meta heading="Title" subheading="Subtitle"></mb-ica-meta>
  </mb-ica-checkbox>
</mb-ica-card-row>
```
> **Beslutsregel:** Använd detta mönster när raden ENDAST togglar val.
> Card-row är `noninteractive`, checkboxen ligger i **default-sloten** (inte `left`),
> och checkboxens EGEN default slot håller `mb-ica-meta`. Då omsluter checkboxens
> interna `<label>` hela radens innehåll → en klickyta totalt.
>
> **Border:** Lägg till `border` om raden ligger i en lista med **flera** selectable rows.
> Utelämna `border` om det är en **fristående** selectable row.

Rad med checkbox + sekundär action (left slot, FLERA klickytor):
```html
<mb-ica-card-row noninteractive>
  <mb-ica-checkbox slot="left" :checked="isSelected" @change="toggle" arialabel="Välj"></mb-ica-checkbox>
  <mb-ica-meta heading="Artikel"></mb-ica-meta>
  <!-- t.ex. chevron-ikon eller action-knapp som äger sin egen klickyta -->
</mb-ica-card-row>
```
> **Beslutsregel:** Använd `left`-sloten för checkbox ENDAST när raden har flera
> klickytor (t.ex. välj + navigera/öppna meny/radera). Card-row är `noninteractive`,
> checkbox äger sin yta i `left`-sloten, övrig action ägs av separat element i
> default-sloten. Label-texten ligger i card-rowens default slot, INTE i checkboxen.

Rad med statustext + color-indicator + chevron (default slot):
```html
<mb-ica-card-row>
  <mb-ica-meta heading="Order #1234" text="2026-04-01"></mb-ica-meta>
  <div style="display:flex; align-items:center; column-gap:0.5rem;">
    <span>Mottagen</span>
    <mb-ica-color-indicator theme="success" style="display:inline-flex;"></mb-ica-color-indicator>
    <mb-ica-icon-angle-right style="color:#cf2e05;"></mb-ica-icon-angle-right>
  </div>
</mb-ica-card-row>
```
> **OBS:** Använd INTE `chevron`-attributet eller `slot="right"` för detta mönster.
> Statustext + color-indicator + chevron-ikon byggs som en manuell flex-div i
> default-sloten, bredvid meta/media-object. Chevron-ikonen (`mb-ica-icon-angle-right`)
> läggs in manuellt med `style="color:#cf2e05;"`.
> Detta är det etablerade mönstret i produktionskoden (verifierat mot Storybook).

Rad med input-number-stepper (default slot):
```html
<mb-ica-card-row noninteractive>
  <mb-ica-meta heading="Rullcontainer"></mb-ica-meta>
  <mb-ica-input-number-stepper value="0" min="0" max="99" unit="st" arialabel="Antal rullcontainer"></mb-ica-input-number-stepper>
</mb-ica-card-row>
```

## Layout under huven

Default-sloten layoutas med **CSS Grid**, inte flex. Det påverkar vilka positioneringsmönster som fungerar på slottade children:

- **`margin-left: auto` fungerar inte** på direkta slot-children för att pusha ett element till höger. Card-row:s grid distribuerar redan media-object/meta (vänster) + flex-div med höger-innehåll (höger) naturligt — bygg höger-innehållet som en egen `display: flex`-div, inte via flex-box-tricks på outer scope.
- **`chevron`-attributet lägger på en shadow-DOM-klass** (`IcaCardRow--has-chevron`) som ändrar grid-layouten. Om du behöver statustext + indikator + manuell chevron-ikon, använd INTE `chevron`-attributet — bygg chevron som `mb-ica-icon-angle-right` inuti höger-flexdivven (se kodexemplet med statustext ovan).
- **`--IcaCardRow--grid-template-columns`** kan sättas för att anpassa kolumnbredder (används av `mb-ica-table` för att aligna celler mot header). För fristående card-rows behövs den inte — default-distributionen räcker.

## Vanliga misstag

- **Använd aldrig `left` slot för ikoner** — left slot är reserverat för interaktiva element (checkbox, radio). Ikoner placeras i default slot via `mb-ica-media-object`
- **Använd inte `left`-slot för checkbox när raden bara har EN klickyta** — då hör checkboxen i default-sloten med `mb-ica-meta` som child av checkboxen (se "Selectable row" ovan). `left`-slot för checkbox är reserverat för rader med FLERA klickytor (t.ex. välj + chevron). Antal klickytor avgör placeringen — inte vyns typ
- **Bygg aldrig custom HTML i default slot** — använd `mb-ica-meta` för strukturerad text eller `mb-ica-media-object` för bild + text
- **Lägg aldrig till wrapper-divs runt slottade element** — det skapar oönskade marginaler och bryter layouten. Placera slottade element direkt i rätt slot
- **Bevara alltid exakt radstruktur från designreferenser** — komprimera aldrig multi-line innehåll till en enda rad med separatorer
- **Utelämna aldrig visuella indikatorer** som badge-ikoner — om exakt komponent är okänd, använd en placeholder
- **Placera aldrig inputkomponenter (stepper, switch) i `right`-sloten** — de hör hemma i default-sloten bredvid meta
- **Placera aldrig color-indicator i `slot="right"`** — `right`-sloten renderar en visuell separator som inte hör hemma i status-mönstret. Bygg istället en flex-div i default-sloten med statustext + `mb-ica-color-indicator` + `mb-ica-icon-angle-right` (se kodexempel ovan)
- **Använd aldrig `chevron`-attributet tillsammans med manuell statustext** — om du har text + color-indicator + chevron-ikon, bygg hela höger-sidan manuellt i default-sloten. `chevron`-attributet är för enkla navigeringsrader utan status
