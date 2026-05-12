# mb-ica-input-table

Inline-editering i tabellkontext med sparstatus.

## När ska du använda input-table?

- Inline-editering direkt i tabellrader
- Fält som behöver visa sparstatus (`saving`, `saved`, `error`)
- Tabeller med editerbara celler

## Attributes

> ⚠️ Bilden var avskuren i toppen — de första attributen kan saknas. Komplettera när fler screenshots finns.

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | "" | Input label |
| `disabled` | boolean | false | Input disabled |
| `required` | boolean | false | Input required |
| `currentstate` | string | "default" | Current state. Allowed: `default`, `saving`, `saved`, `error` |
| `id` | string | uniqueId() | Input id |
| `value` | string/number | "" | Input value |
| `type` | string | "text" | Input type |
| `autofocus` | boolean | false | Set autofocus on input |
| `selectonfocus` | boolean | false | Attempt to select the input text on focus |
| `autocomplete` | string | "off" | Hint for form autofill feature |
| `inputmode` | string | — | Hints at the type of data entered. Affects mobile keyboard. Allowed: `none`, `text`, `decimal`, `numeric`, `tel`, `search`, `email`, `url` |
| `pattern` | string | "" | Input pattern regex |

## Kodexempel

```html
<mb-ica-input-table
  label="Antal"
  :value="row.quantity"
  :currentstate="row.saveState"
  type="number"
  inputmode="numeric"
  @change="onSave(row)"
></mb-ica-input-table>
```
