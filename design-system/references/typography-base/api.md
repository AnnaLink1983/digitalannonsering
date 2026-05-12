# mb-ica-typography-base

Wrapper-komponent som applicerar designsystemets typografiska grundstilar på innehållet.

## När ska du använda typography-base?

- I `mb-ica-dialog` med `variation="action"` — för brödtext under `mb-ica-attention-header`
- När du behöver designsystemets typografi på vanlig HTML-text (paragrafer, listor)
- Wrappas runt `<p>`, `<ul>`, `<ol>` och annan textbaserad HTML

> **OBS:** Använd typography-base istället för rena `<div>` eller `<p>` för textinnehåll
> i dialoger. Det säkerställer konsistent typografi med designsystemets tokens.

## Slots

| Name | Description |
|------|-------------|
| `default` | HTML-text som ska få typografiska stilar (paragrafer, listor etc.) |

## Kodexempel

I en action-dialog:
```html
<mb-ica-dialog :open="showError" variation="action" @closed="showError = false">
  <mb-ica-attention-header variation="warning" label="Ogiltigt format" focustrap />
  <mb-ica-typography-base>
    <p style="padding: 0.5rem 1.5rem 1.5rem 1.5rem">
      SSCC ska vara 18 siffror lång, dubbelkolla att du skannar SSCC. Du har skannat: {{ scannedSscc }}.
    </p>
  </mb-ica-typography-base>
  <mb-ica-button slot="buttons" text="Stäng" fullwidth @click="showError = false" />
</mb-ica-dialog>
```

## Vanliga misstag

- **Använd alltid typography-base i dialoger för brödtext** — en ren `<p>` utan wrapper får inte designsystemets typografi
- **Padding sätts på det inre elementet** — inte på typography-base. Standarden i produktionen är `padding: 0.5rem 1.5rem 1.5rem 1.5rem`
