# mb-ica-input-number-stepper

Nummerfält med steg-knappar (+/-) för att öka/minska värde.

## När ska du använda input-number-stepper?

- Antal-inmatning (t.ex. antal artiklar, kolli)
- När användaren ska justera ett värde stegvis
- Med `min`/`max` för att begränsa intervall

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `invalid` | boolean | false | When true, display input field as invalid |
| `disabled` | boolean | false | Disable the component |
| `selectonfocus` | boolean | false | Attempt to select the input text on focus |
| `arialabel` | string | — | Used as aria-label on input |
| `value` | number | "" | The value specified in the input |
| `min` | number | — | Minimum allowed value |
| `max` | number | — | Maximum allowed value |
| `step` | number | 1 | The granularity that the value must adhere to |
| `id` | string | uniqueId() | Id of the component |
| `unit` | string | "" | Postfixed unit |
| `decimal` | boolean | false | If the value should support decimals |
| `leftid` | string | uniqueId() | Custom id for left button |
| `rightid` | string | uniqueId() | Custom id for right button |

## Kodexempel

Antal-väljare:
```html
<mb-ica-input-number-stepper
  :value="quantity"
  :min="0"
  :max="99"
  unit="st"
  arialabel="Antal"
  @change="onQuantityChange"
></mb-ica-input-number-stepper>
```

Med decimaler:
```html
<mb-ica-input-number-stepper
  :value="weight"
  :step="0.1"
  decimal
  unit="kg"
></mb-ica-input-number-stepper>
```

I en card-row (default slot, bredvid meta):
```html
<mb-ica-card-row noninteractive>
  <mb-ica-meta heading="Antal Gråbackar" text="Låda SRS"></mb-ica-meta>
  <mb-ica-input-number-stepper value="0" min="0" max="99" unit="st" arialabel="Antal gråbackar"></mb-ica-input-number-stepper>
</mb-ica-card-row>
```

## Vanliga misstag

- **Placera aldrig steppern i card-row:s `right`-slot** — right-sloten renderas med visuell separator. Placera i default-sloten bredvid meta istället
