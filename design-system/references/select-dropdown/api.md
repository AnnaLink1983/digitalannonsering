# mb-ica-select-dropdown

Dropdown-väljare för val ur en lista.

## När ska du använda select-dropdown?

- Val ur en förinställd lista (t.ex. avdelning, kategori)
- Med `multiple` för flerval
- Öppnar native dialog på mobil

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | "" | Left label, placeholder for the select dropdown |
| `placeholder` | string | "" | Right label. Displayed when value is not set |
| `multiple` | boolean | false | Supports multiple selections. When true, dropdown does not close on selection |
| `disabled` | boolean | false | Mark dropdown as disabled |
| `sublabel` | string | "" | Extra text displayed underneath label |
| `heading` | string | "" | Heading for mobile dialog |
| `value` | string | "" | The selected option/options text representation |
| `direction` | string | "down" | Direction dropdown options display. Allowed: `down`, `up` |

## Slots

| Name | Description |
|------|-------------|
| `default` | Place card-row options here |
| `meta` | **Deprecated** — use `sublabel` property instead |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--IcaSelectDropDown-z-index` | 10 | |
| `--IcaSelectDropDown--mobile-content-offset` | 0px | Offset content if items become hidden in mobile view |

## Kodexempel

Enkel dropdown:
```html
<mb-ica-select-dropdown label="Avdelning" placeholder="Välj..." heading="Välj avdelning" :value="selectedDept">
  <mb-ica-card-row @click="selectDept('chark')">
    <mb-ica-meta heading="Chark & Deli"></mb-ica-meta>
  </mb-ica-card-row>
  <mb-ica-card-row @click="selectDept('mejeri')">
    <mb-ica-meta heading="Mejeri"></mb-ica-meta>
  </mb-ica-card-row>
</mb-ica-select-dropdown>
```

Flerval:
```html
<mb-ica-select-dropdown label="Kategorier" multiple heading="Välj kategorier">
  <!-- card-row options -->
</mb-ica-select-dropdown>
```
