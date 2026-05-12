# mb-ica-file-tree

Trädkomponent för nästlade filter. Renderar en hierarkisk lista med checkboxar eller radioknappar,
expanderbara grenar och valfria höger-labels (t.ex. antal).

> Text och subText renderas via en intern Meta-komponent och accepterar HTML-innehåll
> (t.ex. `mb-ica-tag` i subText).
>
> Hjälpfunktion för avancerad uppdatering finns i dist-mappen som `updateNestedFilters.js`.

## När ska du använda file-tree?

- **Bara när användaren explicit ber om det** — file-tree är inte standardmönstret för filter
- När en specifik filterkategori har djupt nästlade underkategorier (t.ex. avdelning → kategori → underkategori)
- Hierarkiska flerval med checkbox (default) eller enkeltval med radio
- Med `stickytopparents` i långa listor så toppnivå-noder fastnar vid scroll

> **OBS:** Standardmönstret för filter-accordions är checkbox-rader (se `filter/api.md`).
> Använd file-tree bara när användaren explicit efterfrågar nästlade kategorier
> med expanderbara grenar.

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `items` | string | `JSON.stringify([])` | JSON.stringified array av `FileTreeItem`-objekt (se interface nedan) |
| `openitemids` | string | `JSON.stringify([])` | JSON.stringified array av item-id:n som ska vara öppna. Överskriver internt öppna grenar |
| `type` | string | `"checkbox"` | Typ av input. Allowed: `checkbox`, `radio` |
| `stickytopparents` | boolean | false | Gör toppnivå-föräldrar sticky vid scroll |
| `parent` | number | 0 | **Använd inte** — exporteras bara för interna nästlade komponenter |

## FileTreeItem interface

```typescript
interface FileTreeItem {
  id: string;
  text: string;              // Rubriktext (accepterar HTML)
  subText: string;           // Undertext (accepterar HTML, t.ex. mb-ica-tag)
  checked: boolean;          // Är noden vald?
  multiple: boolean;         // Flerval aktiverat?
  labelRight: string;        // Text till höger (t.ex. antal: "3330")
  level: number;             // Nästlingsnivå (0 = rot, 1 = barn, 2 = barnbarn)
  disabled: boolean;         // Inaktiverad?
  nonSelectable: boolean;    // Visa utan checkbox/radio (rubrik-nod)
  isLink: boolean;           // Renderas som länk istället för checkbox/radio
  children: FileTreeItem[];  // Barn-noder (skapar expanderbar gren)
  rightActions: {            // Åtgärdsknappar till höger (t.ex. "..." meny)
    label: string;
    icon: string;
    id: number;
    disabled?: boolean;
  }[];
}
```

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `filetreechanged` | `{ id: string, checked: boolean, parent: number }` | Firas vid klick på en checkbox/radio-nod |
| `filetreebranchtoggled` | `{ id: string, open: boolean, parent: number }` | Firas vid klick på expand-pilen för en nod med children |
| `itemlinkclicked` | `{ id: string, checked: boolean, parent: number }` | Firas vid klick på en länk-nod (`isLink: true`) |
| `itemactionrightclicked` | `{ id: string, action: { icon: string, id: number, label: string } }` | Firas vid klick på en höger-action |

## Kodexempel

Enkel kategori-filter med checkboxar:
```html
<mb-ica-file-tree
  :items="JSON.stringify([
    {
      id: '1',
      text: 'Flowers, veggies and fruit',
      checked: false,
      labelRight: '3330',
      level: 0,
      children: [
        {
          id: '12',
          text: 'Flowers',
          checked: false,
          labelRight: '2',
          level: 1,
          children: [
            { id: '21', text: 'Arrangements', checked: false, labelRight: '1', level: 2 }
          ]
        },
        { id: '13', text: 'Fresh produce', checked: false, labelRight: '2776', level: 1 }
      ]
    },
    { id: '2', text: 'Colonial', checked: false, labelRight: '3151', level: 0 },
    { id: '3', text: 'Nearfood', checked: false, labelRight: '1613', level: 0 }
  ])"
  type="checkbox"
  stickytopparents
  @filetreechanged="onFilterChanged"
  @filetreebranchtoggled="onBranchToggled"
/>
```

Med radio (enkeltval):
```html
<mb-ica-file-tree
  :items="JSON.stringify(categoryItems)"
  type="radio"
  @filetreechanged="onSingleSelect"
/>
```

Non-selectable parent med subText och rightActions:
```html
<mb-ica-file-tree
  :items="JSON.stringify([
    {
      id: '1',
      text: 'Special',
      subText: 'Housewares, home textiles, cleaning and electricity <mb-ica-tag text=\"Changed\" background=\"green\" style=\"color:white\"></mb-ica-tag>',
      nonSelectable: true,
      labelRight: '20961',
      level: 0,
      rightActions: [{ label: 'More', icon: 'more', id: 1 }],
      children: [...]
    }
  ])"
  @itemactionrightclicked="onAction"
/>
```

## I en accordion inuti filter-drawer

File-tree kan placeras i en accordions default slot när just den kategorin
behöver nästlade underkategorier:

```html
<mb-ica-accordion heading="Avdelningar" :expanded="expandedSection === 'avdelningar'">
  <mb-ica-file-tree
    :items="JSON.stringify(departmentTree)"
    type="checkbox"
    stickytopparents
    @filetreechanged="onFilterChanged"
    @filetreebranchtoggled="onBranchToggled"
  />
</mb-ica-accordion>
```
> **OBS:** Andra accordion-sektioner i samma filter kan använda vanliga
> checkbox-rader — file-tree behövs bara där det finns nästlad hierarki.

## Vanliga misstag

- **`items` måste vara `JSON.stringify()`** — aldrig en plain array. Komponenten parsar strängen internt
- **Sätt `level` korrekt** — 0 för rot, 1 för barn, 2 för barnbarn osv. Felaktig level ger fel indentering
- **Förälder-noders `checked` styrs av barnen** — om alla barn är checked blir föräldern checked. Sätt inte `checked: true` på föräldrar manuellt om barnen inte är checked
- **Använd `stickytopparents` i långa listor** — toppnivå-noder fastnar vid scroll så användaren alltid ser vilken kategori de är i
- **`disabled: true` på en förälder** — innebär att föräldern inte kan av/bockas direkt, men barnen kan fortfarande interageras med
- **`nonSelectable` för rubrik-noder** — när en nod bara är en grupperings-rubrik utan egen checkbox
