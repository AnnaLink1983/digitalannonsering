# mb-ica-tooltip

Hjälptext som visas vid hover eller focus.

## När ska du använda tooltip?

- Förklara ikoner eller förkortningar
- Visa extra information utan att ta plats i layouten
- Aldrig för viktig information som användaren måste se

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | "" | Texten som visas i tooltipen |
| `position` | string | "top" | Var tooltipen placeras. Allowed: `top`, `right`, `bottom`, `left` |

> **OBS:** Den här filen är en stub — fullständig API-dokumentation saknas.
> Verifiera alla props, events och slots mot Storybook innan du använder komponenten.
> Se screenshot i den här mappen för visuell referens.

## Kodexempel

```html
<mb-ica-tooltip text="Klicka för att redigera">
  <mb-ica-button-icon>
    <mb-ica-icon-pen></mb-ica-icon-pen>
  </mb-ica-button-icon>
</mb-ica-tooltip>
```
