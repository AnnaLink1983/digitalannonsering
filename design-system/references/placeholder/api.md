# mb-ica-placeholder

Tom-state-meddelande som visas när en lista eller vy är tom.

## När ska du använda placeholder?

- Tomma listor ("Inga leveranser hittades")
- Sökresultat utan träffar
- Vyer som väntar på data

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | "" | Informative text of what's expected to appear or why nothing shows |
| `align` | string | "center" | Text alignment. Allowed: `left`, `center`, `right` |
| `compact` | boolean | false | Display a smaller one-row version of the layout |

## Slots

| Name | Description |
|------|-------------|
| `default` | Ikon eller illustration ovanför texten |
| `content` | Brödtext under huvudtexten — för längre beskrivningar |

## Kodexempel

Tom lista:
```html
<mb-ica-placeholder text="Inga leveranser hittades. Prova att ändra din sökning."></mb-ica-placeholder>
```

Med ikon och brödtext (slot="content"):
```html
<mb-ica-placeholder text="Lägg till returer" align="center">
  <p slot="content">Placera en etikett på en valfri lastbärare och skanna för att lägga till retur.</p>
  <mb-ica-icon-return-rights />
</mb-ica-placeholder>
```
> **OBS:** Ikonen placeras i default slot, brödtexten i `slot="content"`.
> `text`-attributet är rubriken, `slot="content"` är den längre beskrivningen.

Kompakt i en sektion:
```html
<mb-ica-placeholder text="Inga avvikelser" compact></mb-ica-placeholder>
```

## Vanliga misstag

- **Använd `slot="content"` för brödtext** — inte en `<p>` i default slot. Default slot är reserverat för ikon/illustration
- **`text`-attributet är rubriken** — inte all text. Längre beskrivningar hör hemma i `slot="content"`
