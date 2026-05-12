# mb-ica-alert-message

Notifikation/alert som visas temporärt eller persistent.

## När ska du använda alert-message?

- Bekräftelsemeddelanden efter en action (t.ex. "Sparat!") — `alarmtype="success"`
- Felmeddelanden — `alarmtype="failure"`
- Varningar — `alarmtype="warning"`
- Information — `alarmtype="info"`
- Med `persistencetype="persistent"` för meddelanden som kräver uppmärksamhet

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `persistencetype` | string | "temporary" | Whether the message persists or disappears. Allowed: `temporary`, `persistent` |
| `alarmtype` | string | "info" | Type of alert. Allowed: `success`, `failure`, `info`, `warning` |
| `displayinseconds` | number | 3 | Seconds the message is displayed |
| `title` | string | "" | Bolder title displayed above the text |
| `text` | string | "" | Main text message. HTML content is allowed |
| `actiontext` | string | "" | Custom action text. If present, emits `actionclick` event when clicked |
| `noclose` | boolean | false | Message cannot be closed by user. Only applies to `persistent` type |
| `prominencetype` | string | "strong" | Background prominence. Allowed: `strong`, `subtle` |
| `align` | string | "left" | Text alignment. Allowed: `left`, `center` |

## Events

| Event | Description |
|-------|-------------|
| `actionclick` | Fires when action text is clicked |
| `close` | Fires when alert is closed |

## Kodexempel

Temporärt success-meddelande:
```html
<mb-ica-alert-message
  alarmtype="success"
  text="Varumottagning slutförd"
  :displayinseconds="3"
></mb-ica-alert-message>
```

Persistent felmeddelande med action:
```html
<mb-ica-alert-message
  alarmtype="failure"
  persistencetype="persistent"
  title="Kunde inte spara"
  text="Kontrollera nätverksanslutningen"
  actiontext="Försök igen"
  @actionclick="retry"
></mb-ica-alert-message>
```

Subtil info-banner:
```html
<mb-ica-alert-message
  alarmtype="info"
  prominencetype="subtle"
  text="Du har 3 ej hanterade avvikelser"
  persistencetype="persistent"
></mb-ica-alert-message>
```
