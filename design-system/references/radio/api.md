# mb-ica-radio

Radioknapp för exklusiva val (ett val ur en grupp).

## När ska du använda radio?

- Exklusiva val där bara ett alternativ kan väljas
- I card-row left slot som alternativ till checkbox
- Med `columns` för horisontell layout

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `selected` | string | — | Value of selected IcaRadio. **Required** |
| `columns` | boolean | false | Displays the radio options in columns |

## Kodexempel

I en card-row:
```html
<mb-ica-card-row noninteractive>
  <mb-ica-radio slot="left" :selected="selectedReason" value="damaged"></mb-ica-radio>
  <mb-ica-meta heading="Skadad vara"></mb-ica-meta>
</mb-ica-card-row>
<mb-ica-card-row noninteractive>
  <mb-ica-radio slot="left" :selected="selectedReason" value="wrong"></mb-ica-radio>
  <mb-ica-meta heading="Felaktig vara"></mb-ica-meta>
</mb-ica-card-row>
```
