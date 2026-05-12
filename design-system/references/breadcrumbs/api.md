# mb-ica-breadcrumbs

Brödsmulor för att visa hierarkisk navigation.

## När ska du använda breadcrumbs?

- Visa var i sidstrukturen användaren befinner sig
- Navigation tillbaka till överordnade nivåer

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `items` | string | `JSON.stringify([])` | JSON.stringified array av breadcrumb-items: `[{ text: 'Start', href: '/' }]` |

> **OBS:** Den här filen är en stub — fullständig API-dokumentation saknas.
> Verifiera alla props, events och slots mot Storybook innan du använder komponenten.

## Kodexempel

```html
<mb-ica-breadcrumbs
  :items='JSON.stringify([
    { text: "Hem", href: "/" },
    { text: "Order & Leverans", href: "/order" },
    { text: "Returrätt" }
  ])'
></mb-ica-breadcrumbs>
```
