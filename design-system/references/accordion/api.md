# mb-ica-accordion

Expanderbar sektion med heading-rad som kan öppnas/stängas.

## När ska du använda accordion?

- Filtersektioner i filter-drawer (en accordion per filterkategori)
- FAQ-listor eller expanderbara detaljer
- Gruppering av innehåll som ska kunna döljas

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `expanded` | boolean | false | Expand content from outside. Is also set internally on user interaction |
| `heading` | string | "" | Set heading text |
| `stickytop` | boolean | false | Sticks the top row to top on scroll |

## Slots

| Name | Description |
|------|-------------|
| `default` | Innehåll som expanderas/minimeras |
| `right` | Innehåll till höger om heading-raden |

## Kodexempel

Enkel accordion (filtersektion med selectable rows):
```html
<mb-ica-accordion heading="Avdelningar">
  <mb-ica-card-row noninteractive truncate>
    <mb-ica-checkbox :checked="dept.selected" @change="toggle(dept)">
      <mb-ica-meta :heading="dept.name" />
    </mb-ica-checkbox>
  </mb-ica-card-row>
  <!-- fler rader… -->
</mb-ica-accordion>
```
> **Filterval i accordion = EN klickyta per rad.** Använd selectable
> row-mönstret: `noninteractive` card-row, checkbox i **default slot**,
> `mb-ica-meta` som child av checkboxen. **Ingen `border`** på card-row inuti
> accordion — card-row har inbyggd 1px box-shadow-divider undertill som ger
> separatorn mellan rader gratis. `truncate` är standard för filterval (lång
> text wrappar annars). Se `card-row/api.md` och `checkbox/api.md` för full
> beslutsregel.

Programmatiskt expanderad (t.ex. efter shortcut-klick):
```html
<mb-ica-accordion heading="Status" :expanded="expandedSection === 'status'">
  <!-- filterval -->
</mb-ica-accordion>
```

Med räknare till höger:
```html
<mb-ica-accordion heading="Avdelningar">
  <span slot="right" style="color:var(--ica-text-secondary)">3 valda</span>
  <!-- innehåll -->
</mb-ica-accordion>
```

## Vanliga misstag

- **Använd alltid `heading`-attributet** — bygg aldrig en custom heading-rad
- **I filter-drawer: expandera rätt sektion** — när en shortcut-chip klickas ska den matchande accordion-sektionen vara `expanded` när drawern öppnas
- **Filterval = EN klickyta → checkbox i default slot, INTE left slot** — selectable row-mönstret är standard för filtreringsval i accordion. `left`-slot för checkbox är reserverat för rader med flera klickytor (se `card-row/api.md`)
