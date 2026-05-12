# mb-ica-button

Standardknapp med flera visuella varianter.

## När ska du använda button?

- Primära actions (spara, bekräfta) — `variation="primary"`
- Sekundära actions (avbryt, alternativ) — `variation="secondary"`
- Mindre framträdande actions — `variation="tertiary"` eller `variation="subtle"`
- I dialog `buttons`-slot — alltid med `fullwidth`
- CTA-knappar i botten av vyer — med `block` (fullbredd mobil, centrerad desktop)

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | "" | The text rendered in the button |
| `variation` | string | "primary" | Button type. Allowed: `primary`, `secondary`, `tertiary`, `subtle` |
| `id` | string | uniqueId() | Set an html id |
| `name` | string | "" | Set an html name |
| `arialabel` | string | "" | Set an aria-label |
| `type` | string | "button" | Html type-attribute. Allowed: `submit`, `cancel`, `button`. **OBS:** Sätt alltid `type="button"` inuti formulär om knappen inte ska submitta |
| `disabled` | boolean | false | Disable the button |
| `hasloader` | boolean | false | Allows a loading state on the button |
| `loading` | boolean | false | Renders a loading state |
| `block` | boolean | false | Fullbredd på mobil (max 343px), centrerad på desktop |
| `fullwidth` | boolean | false | Fullbredd alltid, oavsett skärmstorlek |
| `round` | boolean | false | Rund knapp som bara accepterar ikon |

## Kodexempel

Primär knapp:
```html
<mb-ica-button text="Spara" @click="save"></mb-ica-button>
```

Sekundär knapp:
```html
<mb-ica-button text="Avbryt" variation="secondary" @click="cancel"></mb-ica-button>
```

Fullbredd i dialog:
```html
<mb-ica-button slot="buttons" text="Visa 24 resultat" fullwidth @click="apply"></mb-ica-button>
```

Block-knapp (responsiv):
```html
<mb-ica-button text="Gå vidare" block @click="next"></mb-ica-button>
```

Med laddningsindikator (loading-trio):
```html
<mb-ica-button
  text="Ta bort"
  fullwidth
  :loading="loading"
  :hasloader="loading"
  :disabled="loading"
  @click="deleteItem"
/>
```
> **OBS:** Använd alltid alla tre props tillsammans, bundna till samma reaktiva
> variabel: `:loading`, `:hasloader` och `:disabled`. `hasloader` aktiverar
> loader-overlays, `loading` visar den, och `disabled` förhindrar dubbeltryck.

Knapp med ikon (slot="first"):
```html
<mb-ica-button
  :variation="isPrimary ? 'primary' : 'secondary'"
  block
  :disabled="loading"
  text="Scanna ny retur"
  @click="startCamera"
>
  <mb-ica-icon-self-scan slot="first" />
</mb-ica-button>
```

## Slots

| Name | Description |
|------|-------------|
| `first` | Ikon före texten |
| `last` | Ikon efter texten |

## Vanliga misstag

- **Använd alltid loading-trion** — `:loading`, `:hasloader` och `:disabled` bundna till samma variabel. Utelämna aldrig `hasloader` eller `disabled` — utan dem kan användaren dubbelklicka och loadern visas inte
- **Glöm aldrig `type="button"` i formulär** — utan detta submittas formuläret oavsiktligt
- **Använd `fullwidth` i dialog `buttons`-slot** — inte `block`
- **Skillnaden mellan `block` och `fullwidth`**: `block` = fullbredd på mobil men centrerad med max 343px på desktop. `fullwidth` = fullbredd alltid
- **Ändra aldrig `text` under loading** — behåll originaltexten, loadern visas som en overlay
