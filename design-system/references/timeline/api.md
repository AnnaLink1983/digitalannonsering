# mb-ica-timeline

Tidslinje som visar händelser i kronologisk ordning.

## När ska du använda timeline?

- Visa historik eller logg (t.ex. orderstatus, leveranshändelser)
- Stegvisa processer med tidsstämplar

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `items` | string | `JSON.stringify([])` | JSON.stringified array av tidslinje-items |

> **OBS:** Den här filen är en stub — fullständig API-dokumentation saknas.
> Verifiera alla props, events och slots mot Storybook innan du använder komponenten.
> Se screenshot i den här mappen för visuell referens.

## Kodexempel

```html
<mb-ica-timeline
  :items='JSON.stringify([
    { text: "Order skapad", date: "2026-04-01 08:00" },
    { text: "Leverans skickad", date: "2026-04-02 14:30" },
    { text: "Mottagen i butik", date: "2026-04-03 07:15" }
  ])'
></mb-ica-timeline>
```
