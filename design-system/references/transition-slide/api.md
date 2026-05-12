# TransitionSlide

`mb-ica-transition-slide`

Animerar innehåll in/ut genom att glida från en kant. Används för sidnavigering (framåt/bakåt) och paneler.

---

## Attribut

| Attribut | Typ | Default | Beskrivning |
|----------|-----|---------|-------------|
| `origin` | `string` | `right` | Varifrån innehållet glider in. Allowed: `top`, `right`, `bottom`, `left` |
| `inactive` | `boolean` | `false` | Om komponenten är utanför skärmen. `true` = off screen |
| `preset` | `string` | — | Override för att animera in/ut samtidigt. Allowed: `in-left`, `out-left`, `in-right`, `out-right` |
| `offset` | `css-length` | `100%` | Hur långt utanför skärmen. Använd aldrig negativa värden — `origin` styr riktningen |

## Slot

| Slot | Beskrivning |
|------|-------------|
| `default` | Innehållet som ska animeras |

## CSS Custom Properties

| Property | Default | Beskrivning |
|----------|---------|-------------|
| `--IcaTransitionSlide--z-index` | `unset` | Z-index för transition-lagret |
| `--IcaTransitionSlide--duration` | `0.7s` | Animationens längd |
| `--IcaTransitionSlide--timing` | `ease` | Timing-funktion |

## Events

| Event | Beskrivning |
|-------|-------------|
| `transitionstart:out` | Fires on closing transition start |
| `transitionstart:in` | Fires on opening transition start |
| `transitionend:out` | Fires when closing transition is completed |
| `transitionend:in` | Fires when opening transition is completed |

---

## Användning

### Enkel slide från höger

```html
<mb-ica-transition-slide origin="right" :inactive="!showPanel">
  <div>Panel-innehåll</div>
</mb-ica-transition-slide>
```

### Preset för samtidig in/ut (sidnavigering)

`preset` överrider `origin`/`inactive` och är tänkt för att animera två vyer samtidigt — en ut och en in:

```html
<!-- Vy som lämnar -->
<mb-ica-transition-slide preset="out-left">
  <div>Gammal vy</div>
</mb-ica-transition-slide>

<!-- Vy som kommer in -->
<mb-ica-transition-slide preset="in-right">
  <div>Ny vy</div>
</mb-ica-transition-slide>
```

---

## Vanliga misstag

1. **Använd aldrig negativa värden på `offset`** — riktningen styrs av `origin`
2. **Wrappa inte innehåll i extra divs som bryter layout** — TransitionSlide är en web component som inte påverkar barnens layout (sticky, flex etc.)
3. **Använd `preset` för sidnavigering** — det säkerställer att in/ut-animationer synkas korrekt
