# mb-ica-input-time

Tidsinmatningsfält.

## När ska du använda input-time?

- Alla fält för tidsinmatning (HH:MM)
- Med `step="3600"` för att låsa till heltimmar (mobil)

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | "" | The input label |
| `disabled` | boolean | false | Mark input as disabled |
| `value` | string | "" | Value of the component |
| `invalid` | boolean | false | When true, display validationmessage |
| `validationmessage` | string | "" | Helpful error message. Displayed when `invalid` is true |
| `step` | number | — | Input step attribute. Set to 3600 to lock to hours. Only works on mobile |

## Events

| Event | Description |
|-------|-------------|
| `change` | Fires on value change |
| `focus` | Fires on focus |
| `blur` | Fires on blur |

## Kodexempel

```html
<mb-ica-input-time
  label="Leveranstid"
  :value="deliveryTime"
  @change="onTimeChange"
></mb-ica-input-time>
```
