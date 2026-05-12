# TransitionPanel

`mb-ica-transition-panel`

Enkel wrapper som anger om innehållet håller på att animeras in eller ut. Används tillsammans med TransitionSlide för att koordinera riktning.

---

## Attribut

| Attribut | Typ | Default | Beskrivning |
|----------|-----|---------|-------------|
| `direction` | `string` | `in` | Om det är en entering eller leaving animation. Allowed: `in`, `out` |

## Slot

| Slot | Beskrivning |
|------|-------------|
| `default` | Innehållet som ska animeras |

---

## Användning

```html
<mb-ica-transition-panel direction="in">
  <mb-ica-transition-slide origin="right">
    <div>Vy-innehåll</div>
  </mb-ica-transition-slide>
</mb-ica-transition-panel>
```
