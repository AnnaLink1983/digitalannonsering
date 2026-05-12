# mb-ica-dialog

Modal eller bottom sheet. Används för bekräftelser, formulär och detaljvyer.

## När ska du använda dialog?

- Bekräftelsedialoger (med `variation="action"`)
- Formulär som inte passar i huvudvyn
- Detaljvyer som öppnas ovanpå befintligt innehåll

> **OBS:** Använd INTE dialog för filterpaneler — använd `mb-ica-drawer` istället.
> Se `references/filter/api.md` och `references/drawer/api.md`.

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `desktopfullheight` | boolean | false | Render dialog in full height on desktop |
| `desktopfullwidth` | boolean | false | Render dialog in full width on desktop. Kombinera med `desktopfullheight` för fullskärm (med marginaler) |
| `snaptotop` | boolean | false | Fill screen and snap to top after resize |
| `open` | boolean | false | Is the dialog open? |
| `noresize` | boolean | false | Disable resizing (only mobile) |
| `variation` | string | "" | Allowed: `action` (no resize, no rounded corners), `inactive` (minimize to bottom, can't close — only mobile) |
| `inactivebottompercentage` | number | 25 | Snap to bottom threshold. Percentage of screen height (only mobile and inactive = true) |
| `id` | string | "" | Optionally set an id |
| `desktopcustomheight` | boolean | false | Override desktop height using CSS var `--IcaDialog--custom-height` |
| `minimizeafter` | number | — | Minimize if inactive, otherwise close after x seconds |

## Slots

| Name | Description |
|------|-------------|
| `header` | Placera `mb-ica-header` eller custom header här |
| `buttons` | Placera fullwidth `mb-ica-button` här |
| `default` | Huvudinnehåll |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--IcaDialog--z-index` | 500 | |
| `--IcaDialog--transition-duration` | 0.3s | |
| `--IcaDialog--desktop-max-width` | 30rem | |
| `--IcaDialog--custom-height` | `--IcaDialog--full-height` | Används med `desktopcustomheight` |
| `--IcaDialog--mobile-max-width` | 100vw | |
| `--IcaDialog--header-height` | — | |

## Events

| Event | Description |
|-------|-------------|
| `minimized` | Fires when dialog is minimized |
| `opened` | Fires when dialog is opened |
| `close` | Fires on close. Call `evt.preventDefault()` to prevent closing |
| `closed` | Fires when dialog is closed |

## `@close` vs `@closed` — viktigt

| Event | Används när |
|-------|------------|
| `@close` | Vanliga dialoger (formulär, detaljvyer). Firas *innan* dialogen stängs — anropa `evt.preventDefault()` för att avbryta |
| `@closed` | **Action-dialoger** (`variation="action"`). Firas *efter* att dialogen har stängts — t.ex. bekräftelse-/varningsdialoger |

> **Regel:** Bind `@closed` på `variation="action"`, bind `@close` på vanliga dialoger.

## Kodexempel

Bekräftelsedialog (action) med attention-header:
```html
<mb-ica-dialog :open="showConfirm" variation="action" @closed="showConfirm = false">
  <mb-ica-attention-header
    variation="warning"
    label="Är du säker att du vill ta bort denna lastbärare?"
    focustrap
  ></mb-ica-attention-header>
  <mb-ica-typography-base>
    <p style="padding: 0.5rem 1.5rem 1.5rem 1.5rem">
      Beskrivande text om konsekvensen av åtgärden.
    </p>
  </mb-ica-typography-base>
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
> **OBS:** Action-dialoger (`variation="action"`) använder `mb-ica-attention-header`
> direkt i default slot — inte `mb-ica-header` i `slot="header"`. Textinnehåll
> wrappas i `mb-ica-typography-base`.

Vanlig dialog med header (t.ex. formulär, detaljvy):
```html
<mb-ica-dialog :open="dialogOpen" snaptotop desktopfullheight @close="dialogOpen = false">
  <mb-ica-header
    slot="header"
    variant="dialog"
    heading="Lägg till returer"
    leftaction="close"
    :actions="JSON.stringify([showDelete && { icon: 'trash', label: 'Ta bort', id: 'delete', disabled: loading }])"
    @leftactionclick="dialogOpen = false"
    @rightactionclick="onHeaderAction"
  />

  <!-- Dialoginnehåll här -->

  <mb-ica-button slot="buttons" text="Spara" fullwidth :loading="loading" :hasloader="loading" :disabled="loading" @click="save" />
</mb-ica-dialog>
```

Desktop fullskärm:
```html
<mb-ica-dialog :open="open" desktopfullheight desktopfullwidth>
  <!-- innehåll -->
</mb-ica-dialog>
```

## Vanliga misstag

- **Använd `@closed` för action-dialoger, `@close` för vanliga** — fel event ger tyst fel (dialogen reagerar inte)
- **Action-dialoger ska ha `mb-ica-attention-header`** — inte `mb-ica-header`. Attention-header renderar varning/info-ikon med centrerad text, vilket är rätt mönster för bekräftelser
- **Textinnehåll i action-dialoger wrappas i `mb-ica-typography-base`** — inte en ren `<div>` eller `<p>`
- **Använd alltid `snaptotop` för fullhöjdsdialog** — utan detta öppnas dialogen inte i fullhöjd. Anta aldrig att default ger fullhöjd
- **Lägg aldrig knappar direkt i default-slot** — använd `buttons`-slotten för fullbreddsknappar
- **Använd INTE dialog för filter** — använd `mb-ica-drawer` istället (se `references/filter/api.md`)
- **Kombinera `desktopfullheight` + `desktopfullwidth`** för fullskärm på desktop
- **Knappar i action-dialog ska alltid ha loading-trio** — `:loading="loading" :hasloader="loading" :disabled="loading"` för att förhindra dubbeltryck
