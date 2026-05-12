# mb-ica-color-indicator

Liten statusfärgprick som visar tillstånd.

## När ska du använda color-indicator?

- I `card-row` **default slot** — som del av en flex-div med statustext + chevron-ikon
- Bredvid text för att indikera tillstånd (aktiv, varning, fel)
- Används automatiskt av `mb-ica-header` via `status`-attributet

> **OBS:** Placera INTE color-indicator i `slot="right"` på card-row.
> `right`-sloten lägger till en visuell separator som inte hör hemma i status-mönstret.
> Se card-row/api.md för korrekt kodexempel.

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | string | "disabled" | Set theme. Allowed: `notice`, `success`, `failure`, `disabled` |

## Kodexempel

I en card-row (statustext + color-indicator + chevron):
```html
<mb-ica-card-row>
  <mb-ica-meta heading="Leverans #4821" text="2026-04-01"></mb-ica-meta>
  <div style="display:flex; align-items:center; column-gap:0.5rem;">
    <span>Mottagen</span>
    <mb-ica-color-indicator theme="success" style="display:inline-flex;"></mb-ica-color-indicator>
    <mb-ica-icon-angle-right style="color:#cf2e05;"></mb-ica-icon-angle-right>
  </div>
</mb-ica-card-row>
```

Fristående:
```html
<mb-ica-color-indicator theme="failure"></mb-ica-color-indicator>
```
