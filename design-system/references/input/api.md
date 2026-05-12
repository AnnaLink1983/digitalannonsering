# mb-ica-input

Textfält för formulärinmatning.

## När ska du använda input?

- Alla textinmatningsfält i formulär
- Med `type="number"` för numeriska fält
- Med validering via `invalid` + `validationmessage`
- Använd `mb-ica-input-search` istället om det är ett sökfält

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | — | The input label/placeholder. **Required** |
| `invalid` | boolean | false | When true, display validationmessage |
| `validationmessage` | string | "" | Helpful error message. Displayed when `invalid` is true |
| `helptext` | string | "" | Helpful text. Displayed when `invalid` is NOT true |
| `selectonfocus` | boolean | false | Attempt to select input text on focus. Does not work with `autofocus` |
| `small` | boolean | false | **Deprecated** — all textareas now have the same height |
| `maxheight` | string | — | Limit textarea height. Allowed: `small`, `large` |
| `disabled` | boolean | false | Mark input as disabled |
| `loading` | boolean | false | Mark input as implicitly submitting |
| `id` | string | uniqueId() | ID for input |
| `maxlength` | number | — | Set input maxlength |
| `required` | boolean | false | Display a required marker in label. Does not work as native require attribute in forms |
| `type` | string | "text" | Type of input form control |
| `value` | string/number | "" | The input value |
| `autofocus` | boolean | false | Set autofocus on input. Does not work with `selectonfocus` |
| `autocomplete` | string | "off" | Hint for form autofill feature |
| `pattern` | string | — | Pattern the value must match. For types: password, text, tel |
| `decimal` | boolean | false | Forces number to display as decimal. Only works with `type=number` |
| `max` | number | — | Maximum value (for numeric types) |
| `min` | number | — | Minimum value (for numeric types) |
| `step` | number | — | Incremental values that are valid (for numeric types) |
| `inputmode` | string | — | Hints at data type, affects mobile keyboard. Allowed: `none`, `text`, `decimal`, `numeric`, `tel`, `search`, `email`, `url` |

## Slots

| Name | Description |
|------|-------------|
| `actions` | Position: far right (unless invalid). Use to customize an input icon |

## Kodexempel

Textfält med validering:
```html
<mb-ica-input
  label="Artikelnamn"
  :value="name"
  :invalid="!isValid"
  validationmessage="Fältet får inte vara tomt"
  required
  @input="onInput"
></mb-ica-input>
```

Numeriskt fält:
```html
<mb-ica-input
  label="Antal"
  type="number"
  inputmode="numeric"
  :value="quantity"
  :min="0"
  :max="999"
></mb-ica-input>
```

Med hjälptext:
```html
<mb-ica-input
  label="EAN-kod"
  helptext="13 siffror"
  :maxlength="13"
></mb-ica-input>
```
