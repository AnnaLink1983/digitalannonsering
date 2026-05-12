# Desktop-navigation (DesktopNav.vue)

> Kontextfil för agenten. Beskriver hur desktop-navigeringen är uppbyggd,
> när den renderas och hur den komponeras i prototypen.

---

## Vad är det?

`src/components/DesktopNav.vue` återskapar **MinButik-appens site-header** för desktop-vyer. Den är en **prototyping-komponent**, inte en ICA Elements-webbkomponent, och finns bara för att prototyper ska se ut "som på riktigt" när de testas i desktop-bredd.

- **Inte** importerbar från `@ica-azure/ica-elements`
- **Inte** dokumenterad i `design-system/references/` (det är reserverat för ICA Elements-komponenter)
- **Inte** produktionsklar — ingen logik för routing, notiser eller user-fetch

Se komponentfilens header-kommentar för verifierade vs. inferrerade CSS-detaljer.

---

## När renderas den?

Följer projektets tre-nivås responsiva modell:

| Viewport | Navigation |
|----------|-----------|
| < 767px | **Bottom nav** (mobilens 5-tabs-pattern, se `design-system/PATTERNS.md`) |
| ≥ 767px | **DesktopNav** — bottom nav ska då inte visas |

Komponenten har `@media (max-width: 766px) { display: none }` inbyggt, så den döljer sig själv på mobilen. I App.vue kan du antingen rendera den alltid (den försvinner automatiskt) eller villkorligt rendera via en `isSmall`-computed för cleaner markup.

---

## Struktur

```
<header class="desktop-nav">
  <div data-mb-theme="turquoise-dark" class="desktop-nav__theme">
    <div class="desktop-nav__inner">        ← 5-kolumns-grid
      <div class="desktop-nav__first">…logo…</div>
      [spacer — 1fr]
      <div class="desktop-nav__mid">
        <ul class="desktop-nav__menu-items">
          <li>HEM</li>
          <li>APPAR</li>
          <li>GENVÄGAR</li>
          <li class="--active">TESTAPP</li>
        </ul>
      </div>
      [spacer — 1fr]
      <div class="desktop-nav__last">
        <ul class="desktop-nav__eyebrow">
          <li>bell</li>
          <li>user</li>
        </ul>
      </div>
    </div>
  </div>
</header>
```

Grid-mallen `max-content 1fr max-content 1fr max-content` på `__inner` centrerar menyn visuellt — de två `1fr`-kolumnerna äter upp resterande bredd jämnt på båda sidor.

---

## Meny-items

Tre **fasta** items plus den **aktiva appens** item:

| Position | Label | Ikon | Komponent-struktur |
|----------|-------|------|--------------------|
| 1 | HEM | `mb-ica-icon-home` | `<mb-ica-button-icon accent enhanced text="HEM">` |
| 2 | APPAR | `mb-ica-icon-view-image` | `<mb-ica-button-icon accent enhanced text="APPAR">` |
| 3 | GENVÄGAR | `mb-ica-icon-rate` | `<mb-ica-button-icon accent enhanced text="GENVÄGAR">` |
| 4 | [aktiv app] | [app-specifik] | `<a href="#" aria-current="page" class="desktop-nav__active-page-link">` |

**Viktigt:** Det aktiva item:et använder **inte** `mb-ica-button-icon` — det är ett `<a>`-element med egen styling. Det är en strukturell skillnad från produktionskällan och ska inte ändras.

Alla ikoner är **outlined** enligt designsystemets regel (se `design-system/components.md`).

---

## Props

Alla props har defaults för en generisk **TESTAPP** — byt via props för att matcha en riktig app:

| Prop | Default | Beskrivning |
|------|---------|-------------|
| `userName` | `'Namn Efternamn'` | Namn som visas bredvid user-ikonen |
| `butik` | `'Testbutik, Kvantum'` | Butik och format, andra raden i user-sektionen |
| `activeAppLabel` | `'TESTAPP'` | Text på aktiv meny-knapp (versaler) |
| `activeAppColor` | `'#626262'` | Bakgrundsfärg på aktiv knapp (TESTAPP = neutral grå) |
| `activeAppIconTag` | `'mb-ica-icon-delivery-truck'` | Ikon-tagg för aktiv app. Måste vara en outlined-ikon från paketet. |

---

## Färg-mappning per app

Färgen sätts via prop eller CSS custom property `--application-color`. Nuvarande kända värden:

| App | Färg | Ikon |
|-----|------|------|
| TESTAPP (template default) | `#626262` (neutral grå) | `mb-ica-icon-play` |
| Order & Leverans | `#176473` (teal) | `mb-ica-icon-delivery-truck` |
| Sortiment | TBD (ursprungligen blå i produktion) | TBD (basket-liknande) |
| Andra appar | TBD | TBD |

När fler appar ska stödjas: utöka tabellen ovan och skapa ev. en helper-konstant i komponentfilen som mappar app-id → `{ label, color, iconTag }`.

**OBS:** `#176473` är **samma teal-färg** som redan är etablerad i `aktiva-beslut.md` för Order & Leverans-headers (`--IcaHeader--border-color`). Överväg att extrahera till en projektvariabel (`--ica-app-color-order-leverans`) så alla referenser hålls synkade.

---

## Integration i App.vue

När en desktop-vy ska byggas:

```vue
<template>
  <div id="app">
    <DesktopNav />
    <!-- vyer, t.ex. LayoutTwoColumns här under -->
  </div>
</template>

<script setup>
import DesktopNav from './components/DesktopNav.vue'
</script>
```

Props kan skickas in för att byta aktiv app:

```vue
<DesktopNav
  active-app-label="SORTIMENT"
  active-app-color="#0073A6"
  active-app-icon-tag="mb-ica-icon-some-outlined-icon"
/>
```

Komponenten döljer sig själv under 767px så villkorlig rendering behövs inte, men får användas för cleanare markup.

---

## Kända avgränsningar

- **Ingen routing** — `<a href="#">` är placeholder, inga klick gör något
- **Ingen notis-state** — bell-knappen är ren visuell
- **Ingen user-menu** — user-knappen är bara visuell
- **Ingen app-bytare** — APPAR-knappen gör inget
- **Inga hover-states utöver brightness på aktiv app** — vi lägger till om det krävs

Det här matchar projektets premiss: **visuell trohet, inte funktionell imitation**.

---

## Ikoner som krävs (redan importerade i `main.js`)

- `IcaIconHome`
- `IcaIconViewImage`
- `IcaIconRate`
- `IcaIconDeliveryTruck`
- `IcaIconAlarm`
- `IcaIconUserInternet`

Om en ny app behöver en ny ikon — lägg till motsvarande `import '@ica-elements/IcaIcon<Namn>.js'` i `main.js`, och verifiera att den är **outlined** (se regel i `components.md`).

---

## Inferenser att verifiera

Dessa detaljer bygger på observation av produktionsrenderingen — de står kommenterade i komponentens `<style>`-block också:

1. **Röda linjen överst** är implementerad som `border-top: 4px solid var(--ica-red)` på outer `<header>`. Källan kan ha den på annat element eller som pseudo — verifiera om visuellt fel.
2. **Dividers mellan eyebrow-items** är `border-left: 1px solid var(--ica-border)`. Kan vara pseudo-element i produktionen.
3. **`--header-height: 48px`** är satt explicit. Källan använder en variabel med samma namn — 48px matchar computed styles.
