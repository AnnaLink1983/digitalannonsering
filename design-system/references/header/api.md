# mb-ica-header

Sidheader med titel, valfri tillbaka-/stäng-knapp och action-ikoner.

## När ska du använda header?

- Obligatorisk i alla full-screen vyer — headern är ett strukturellt skal, inte ett tillval
- Navigeringsheader med tillbaka-knapp (`leftaction="back"`)
- Dialogheader med stäng-knapp (`leftaction="close"`)
- Variant `pageheader` för sidor med grå bakgrund och svart linje

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | string | "" | Set the heading |
| `subheading` | string | "" | Set the subheading |
| `status` | string | "" | Status theme, passed on to ica-color-indicator. Allowed: `notice`, `success`, `failure`, `disabled` |
| `leftaction` | string | "" | Set left action. Allowed: `back`, `close` |
| `actions` | string | `JSON.stringify([])` | JSON.stringified array av actions: `[{ icon: 'circle', label: 'Maybe', disabled: false, id: 'for callback', badge: 1 }]`. `label`, `id` och `icon` är obligatoriska |
| `variant` | string | "" | Header variant. Allowed: `pageheader` (renders with grey background and black border-bottom) |
| `actionmenu` | boolean | false | Set action menu regardless of how many options |
| `prioritizeactions` | boolean | false | Always display action icons. If more than two actions, first icon shows while rest are grouped in meatball menu. Approved icons: `plus-circle`, `pen`, `trash`, `cog`, `info` |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--IcaHeader--border-color` | black | Färgen på border-bottom (divider-linjen längst ner) |
| `--IcaHeader__heading--alignment` | center | Justering av heading |
| `--IcaHeader__actions-drop-down` | 10 | z-index för actions dropdown |

## Events

| Event | Description |
|-------|-------------|
| `leftactionclick` | Fires when left action is clicked |
| `rightactionclick` | Fires when right action is clicked. `event.detail` contains action id |

## Kodexempel

Enkel header med tillbaka-knapp:
```html
<mb-ica-header
  heading="Leveranser"
  leftaction="back"
  @leftactionclick="goBack"
></mb-ica-header>
```

Header med röd divider-linje (ICA-stil):
```html
<mb-ica-header
  heading="Varumottagning"
  leftaction="back"
  style="--IcaHeader--border-color: var(--ica-red)"
  @leftactionclick="goBack"
></mb-ica-header>
```

Dialog-header med villkorliga actions:
```html
<mb-ica-header
  slot="header"
  variant="dialog"
  :heading="mode === 'edit' ? 'Lägg till returer' : 'Returer'"
  leftaction="close"
  :actions="JSON.stringify([mode === 'edit' && { icon: 'trash', label: 'Ta bort', id: 'delete', disabled: loading }])"
  @leftactionclick="handleClose"
  @rightactionclick="handleAction"
/>
```
> **OBS:** Villkorliga actions använder `&&` — om villkoret är `false` blir
> elementet `false` i arrayen, och JSON.stringify + komponenten ignorerar det.
> `disabled: loading` gråar ut ikonen under pågående asynkron operation.

Header med action-ikoner:
```html
<mb-ica-header
  heading="Detaljer"
  leftaction="back"
  :actions='JSON.stringify([
    { icon: "pen", label: "Redigera", id: "edit" },
    { icon: "trash", label: "Ta bort", id: "delete" }
  ])'
  @rightactionclick="onAction"
></mb-ica-header>
```

Pageheader-variant:
```html
<mb-ica-header
  heading="Översikt"
  variant="pageheader"
></mb-ica-header>
```

Enkel dialog-header utan actions:
```html
<mb-ica-header
  slot="header"
  variant="dialog"
  heading="Ändra lastbärartyp"
  leftaction="close"
  @leftactionclick="handleClose"
/>
```

## Vanliga misstag

- **Använd `variant="dialog"` i dialoger** — inte default-varianten. Dialog-varianten ger rätt höjd och styling för `mb-ica-dialog` header slot
- **Bygg aldrig custom headers med HTML och egna spacing-tokens** — headern hanterar höjd, padding och centrering via shadow DOM. Dessa värden kan inte matchas med gissade CSS-värden
- **`actions`-attributet renderar alltid ikoner, inte textlänkar** — om designen visar text (t.ex. "Rensa"), använd ett separat textelement istället för `actions`
- **Headern har alltid en divider-linje längst ner** — anpassa färgen via `--IcaHeader--border-color`
- **Inkludera alltid header i full-screen layouts** — den är obligatorisk, inte valfri
- **Villkorliga actions med `&&`** — använd `[condition && { icon, label, id }]` för att visa/dölja actions baserat på state. Falsy-värden ignoreras automatiskt
