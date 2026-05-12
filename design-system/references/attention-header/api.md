# mb-ica-attention-header

Varnings- eller informationsheader som används i action-dialoger för bekräftelser.

## När ska du använda attention-header?

- I `mb-ica-dialog` med `variation="action"` — bekräftelsedialoger, varningar
- När användaren behöver bekräfta en destruktiv åtgärd (ta bort, avbryt)
- Renderar en ikon (varning/info) med centrerad rubriktext

> **OBS:** Attention-header placeras direkt i dialogens **default slot** — inte i `slot="header"`.
> `slot="header"` är reserverat för `mb-ica-header` i vanliga dialoger.

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `variation` | string | "" | Visuell variant. Allowed: `warning` (gul varningsikon), `info` |
| `label` | string | "" | Rubriktexten som visas centrerat under ikonen |
| `focustrap` | boolean | false | Fångar fokus i komponenten — använd i dialoger för tillgänglighet |

## Kodexempel

I en bekräftelsedialog (action):
```html
<mb-ica-dialog :open="showConfirm" variation="action" @closed="showConfirm = false">
  <mb-ica-attention-header
    variation="warning"
    label="Är du säker att du vill ta bort denna lastbärare?"
    focustrap
  ></mb-ica-attention-header>
  <mb-ica-button
    slot="buttons"
    text="Ta bort"
    fullwidth
    :loading="loading"
    :hasloader="loading"
    :disabled="loading"
    @click="confirmDelete"
  />
  <mb-ica-button slot="buttons" text="Stäng" fullwidth @click="showConfirm = false" />
</mb-ica-dialog>
```

Utan dialog (inline varning):
```html
<mb-ica-attention-header variation="warning" label="Lastbärare utan innehåll" />
```

## Vanliga misstag

- **Placera aldrig attention-header i `slot="header"`** — den hör hemma i default slot. `slot="header"` ger fel layout och döljer ikonen
- **Använd alltid `focustrap` i dialoger** — utan detta kan fokus lämna dialogen via tab-tangenten
- **Attention-header ersätter mb-ica-header i action-dialoger** — använd aldrig båda i samma dialog
