# mb-ica-input-search

Sökfält med inbyggd sök-ikon och clear-knapp.

## När ska du använda input-search?

- Sökning i listor och tabeller
- Alltid ovanför filter-raden i sökbara vyer
- Placera filter trigger-knapp bredvid som separat element — inte i sökfältet

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | "Sök" | The input label/placeholder |
| `disabled` | boolean | false | Mark input as disabled |
| `invalid` | boolean | false | Mark input as invalid |
| `id` | string | uniqueId() | ID for input |
| `value` | string | "" | The input value |
| `autofocus` | boolean | false | Set autofocus on input |
| `selectonfocus` | boolean | false | Attempt to select the input text on focus |
| `autocomplete` | string | — | Hint for form autofill feature |
| `inputmode` | string | — | Hints at data type, affects mobile keyboard. Allowed: `none`, `text`, `decimal`, `numeric`, `tel`, `search`, `email`, `url` |
| `pattern` | string | — | The input pattern |
| `loading` | boolean | false | Renders a loading state |

## Slots

| Name | Description |
|------|-------------|
| `actions` | Custom actions slot (far right) |

## CSS Custom Properties

| Property | Default |
|----------|---------|
| `--IcaInputSearch--max-width` | 28rem |

## Events

| Event | Description |
|-------|-------------|
| `input` | Fires on every keystroke |
| `change` | Fires on value change |
| `clear` | Fires when clear button is clicked |

## Kodexempel

Sökfält i lista:
```html
<mb-ica-input-search
  label="Sök leverans..."
  :value="searchQuery"
  @input="onSearch"
></mb-ica-input-search>
```

Med laddningsindikator:
```html
<mb-ica-input-search
  label="Sök artikel"
  :loading="isSearching"
  @input="onSearch"
></mb-ica-input-search>
```

## Vanliga misstag

- **Placera aldrig filter-knappar inuti sökfältet** — filter trigger-knappar ska vara separata element bredvid sökfältet
