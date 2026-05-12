# mb-ica-checkbox

Kryssruta för enstaka eller flerval.

## När ska du använda checkbox?

- Filterdialoger, flervalssituationer i formulär, selectable rows i listor
- Alltid med `label` eller `arialabel` för tillgänglighet

### Beslutsregel för card-row + checkbox

Antalet klickytor i raden avgör var checkboxen placeras:

| Klickytor | Card-row | Checkbox-placering | Label-texten ägs av |
|-----------|----------|--------------------|---------------------|
| **EN** (raden togglar bara val) | `noninteractive` | **default slot** | checkboxens egen default slot (`mb-ica-meta` som child) |
| **FLERA** (välj + chevron/action) | `noninteractive` | **`left`-slot** | card-rowens default slot (separat `mb-ica-meta` bredvid checkboxen) |

Tekniken bakom: i en-klickytsfallet omsluter checkboxens interna `<label>` hela
radens innehåll, så hela raden blir samma klickmål. I fler-klickytsfallet är
checkbox och övrigt innehåll syskon i card-rowens grid och äger varsin yta.

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | boolean | false | Set checked state |
| `disabled` | boolean | false | Set disabled state |
| `multiple` | boolean | false | Display checkbox in multiple-select-mode |
| `id` | string | uniqueId() | Set the input id |
| `name` | string | — | Set the input name |
| `value` | string | — | Set the input value |
| `label` | string | "" | Label text. May also be supplied using default slot |
| `row` | boolean | false | Displays the checkbox in a row |
| `arialabel` | string | — | Set aria-label |

## Events

| Event | Description |
|-------|-------------|
| `change` | Fires when checked state changes |

## Kodexempel

Selectable row — EN klickyta (checkbox i card-rowens default slot):
```html
<mb-ica-card-row noninteractive>
  <mb-ica-checkbox :checked="isSelected" @change="toggle">
    <mb-ica-meta heading="Chark & Deli" />
  </mb-ica-checkbox>
</mb-ica-card-row>
```
> Använd när raden ENDAST togglar val. Checkboxens egen `<label>` blir hela
> radens klickyta. Lägg till `border` på card-row om raden ligger i en lista
> med flera selectable rows; utelämna `border` för en fristående rad.

Card-row med checkbox + sekundär action — FLERA klickytor (left slot):
```html
<mb-ica-card-row noninteractive>
  <mb-ica-checkbox slot="left" :checked="isSelected" @change="toggle" arialabel="Välj"></mb-ica-checkbox>
  <mb-ica-meta heading="Artikel"></mb-ica-meta>
  <!-- t.ex. chevron-ikon eller action-knapp som äger sin egen klickyta -->
</mb-ica-card-row>
```
> Använd `left`-sloten ENDAST när raden har flera klickytor (välj + navigera/action).
> Här ligger label-texten i card-rowens default slot, INTE i checkboxen — checkboxen
> får istället `arialabel` för tillgänglighet.

Med rik label via default slot (mb-ica-meta som barn):
```html
<mb-ica-checkbox
  id="multiplePackages"
  name="multiplePackages"
  :checked="hasParcels"
  :disabled="loading || mode !== 'edit'"
  @change="handleMultiplePackages"
>
  <mb-ica-meta heading="Lastbäraren innehåller flera paket utan egna etiketter" />
</mb-ica-checkbox>
```
> **OBS:** Label-texten kan anges via `label`-attributet ELLER via default slot.
> När label-texten behöver mer struktur (heading/subheading/text), placera
> `mb-ica-meta` som barn istället för att använda `label`-attributet.

Fristående:
```html
<mb-ica-checkbox label="Godkänn villkoren" :checked="accepted" @change="onAccept"></mb-ica-checkbox>
```

## Vanliga misstag

- **Välj rätt label-metod** — `label`-attributet för enkel text, default slot med `mb-ica-meta` för strukturerad text. Använd aldrig båda samtidigt
- **Glöm inte `id` och `name`** — krävs för formulärdata och tillgänglighet
- **Lägg inte checkbox i card-rowens `left`-slot om raden bara har EN klickyta** — det skapar två visuella ytor (raden + checkboxen) där det egentligen bara finns ett klickmål. Använd selectable row-mönstret istället: `noninteractive` card-row + checkbox i default slot + label via checkboxens egen default slot. Se beslutsregeln ovan
