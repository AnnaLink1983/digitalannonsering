# mb-ica-input-switch

Toggle/switch för att slå av och på funktioner.

## När ska du använda input-switch?

- Binära on/off-inställningar
- Funktionstogglar i inställningsvyer
- Fristående eller i en card-row

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | boolean | false | Set checked state |
| `disabled` | boolean | false | Set disabled state |
| `loading` | boolean | false | Set loading state |
| `id` | string | uniqueId() | Set the input id |
| `name` | string | — | Set the input name |
| `label` | string | "" | Label text. May also be supplied using default slot |
| `arialabel` | string | "" | Set aria-label |

## Kodexempel

Enkel toggle:
```html
<mb-ica-input-switch
  label="Aktivera notiser"
  :checked="notificationsEnabled"
  @change="toggleNotifications"
></mb-ica-input-switch>
```

I en card-row:
```html
<mb-ica-card-row noninteractive>
  <mb-ica-meta heading="Push-notiser"></mb-ica-meta>
  <mb-ica-input-switch slot="right" :checked="pushEnabled" @change="togglePush"></mb-ica-input-switch>
</mb-ica-card-row>
```
