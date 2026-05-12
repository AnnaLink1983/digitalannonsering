# mb-ica-swipe-action

Wrapper som ger swipe-to-action-funktionalitet (t.ex. svep för att ta bort).

## När ska du använda swipe-action?

- Runt `mb-ica-card-row` i listor där objekt kan tas bort eller ha snabbåtgärder
- Mobila listor med destruktiva actions (ta bort, arkivera)
- Villkorsaktiverad — använd `:disabled` för att stänga av på desktop

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `actions` | string | `JSON.stringify([])` | JSON.stringified array av actions: `[{ icon: 'trash', text: 'Ta bort', id: 'remove', variation: 'warning' }]`. `icon`, `text`, `id` och `variation` |
| `disabled` | boolean | false | Inaktivera swipe-funktionaliteten (t.ex. på desktop) |

## Events

| Event | Description |
|-------|-------------|
| `fullswipe` | Firas vid fullständig svep (hela vägen). Använd `.stop` modifier |
| `actionclick` | Firas vid klick på en action-knapp. Använd `.stop` modifier |

> **OBS:** Använd alltid `.stop`-modifier på båda events för att förhindra
> att klicket propagerar till det underliggande card-row-elementet.

## Kodexempel

Svep-för-att-ta-bort i en lista:
```html
<mb-ica-swipe-action
  :disabled="!isMobile"
  :actions="JSON.stringify([{ icon: 'trash', text: 'Ta bort', id: 'remove', variation: 'warning' }])"
  @fullswipe.stop="() => handleDelete(item.id)"
  @actionclick.stop="() => handleDelete(item.id)"
>
  <mb-ica-card-row :highlight="item.isNew" @click="() => openItem(item)">
    <mb-ica-media-object>
      <img slot="first" :src="item.image" :alt="item.name" style="width:48px;height:48px;object-fit:cover;border-radius:4px" />
      <mb-ica-meta slot="last" :heading="item.name" :subheading="item.code" :text="item.quantity" />
    </mb-ica-media-object>
  </mb-ica-card-row>
</mb-ica-swipe-action>
```

## Vanliga misstag

- **`actions` måste vara `JSON.stringify()`** — aldrig en plain array. Komponenten parsar strängen internt
- **Använd alltid `.stop` på `@fullswipe` och `@actionclick`** — utan detta triggas även card-rows `@click`-event, vilket öppnar detaljvyn samtidigt som objektet tas bort
- **Inaktivera på desktop** — `:disabled="!isSmall"` eller liknande. Swipe fungerar inte med mus och knapparna syns inte
- **Wrappa alltid card-row** — swipe-action är en wrapper, inte en standalone-komponent. Innehållet ska vara en card-row
