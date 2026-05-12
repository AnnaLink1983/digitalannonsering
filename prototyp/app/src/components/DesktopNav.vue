<!--
  DesktopNav.vue
  ─────────────────────────────────────────────────────────────────────────
  Visuell efterliknelse av MinButik-appens site-header för desktop-vyer.
  Ersätter bottom-nav när viewport är ≥ 767px.

  Detta är INTE en ICA Elements web component — det är en ren prototyping-
  komponent som återskapar produktionsstilen visuellt. Ingen produktions-
  logik (routing, notis-state, user-fetch) implementeras.

  Se prototyp/.claude/context/desktop-nav.md för användning och props.

  Inferenser som inte verifierats mot CSS-källan (justera om fel):
  - Röda linjen längst upp = border-top: 4px solid var(--ica-red)
  - Dividers mellan eyebrow-items = border-left: 1px solid var(--ica-border)
  - --header-height = 48px (från computed styles, ej källa)
-->

<template>
  <header
    class="desktop-nav"
    :style="{ '--application-color': activeAppColor }"
  >
    <div data-mb-theme="turquoise-dark" class="desktop-nav__theme">
      <div class="desktop-nav__inner">
        <!-- VÄNSTER: Logo -->
        <div class="desktop-nav__first">
          <a href="#" aria-label="Gå till hem" class="desktop-nav__logo">
            <img
              :src="logoUrl"
              alt="ICA MinButik"
              class="desktop-nav__logo-img"
            />
          </a>
        </div>

        <!-- MITTEN: Meny-items -->
        <div class="desktop-nav__mid">
          <ul class="desktop-nav__menu-items">
            <li class="desktop-nav__menu-item">
              <mb-ica-button-icon
                accent
                enhanced
                text="HEM"
                arialabel="Gå till Hem"
                style="--IcaButtonIcon--text-margin-left: .25rem;"
              >
                <mb-ica-icon-home></mb-ica-icon-home>
              </mb-ica-button-icon>
            </li>
            <li class="desktop-nav__menu-item">
              <mb-ica-button-icon
                accent
                enhanced
                text="APPAR"
                arialabel="Gå till Appar"
                style="--IcaButtonIcon--text-margin-left: .25rem;"
              >
                <mb-ica-icon-view-image></mb-ica-icon-view-image>
              </mb-ica-button-icon>
            </li>
            <li class="desktop-nav__menu-item">
              <mb-ica-button-icon
                accent
                enhanced
                text="GENVÄGAR"
                arialabel="Gå till Genvägar"
                style="--IcaButtonIcon--text-margin-left: .25rem;"
              >
                <mb-ica-icon-rate></mb-ica-icon-rate>
              </mb-ica-button-icon>
            </li>

            <!-- AKTIV APP — strukturellt annorlunda: <a> i stället för mb-ica-button-icon -->
            <li class="desktop-nav__menu-item desktop-nav__menu-item--active">
              <a
                href="#"
                aria-current="page"
                class="desktop-nav__active-page-link"
                @click.prevent="$emit('navigate', 'menu')"
              >
                <component :is="activeAppIconTag"></component>
                <span>{{ activeAppLabel }}</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Mellanrums-spacer (motsvarar mb-site-header__div-to-even-out-grid) -->
        <div class="desktop-nav__spacer"></div>

        <!-- HÖGER: eyebrow med notis + user -->
        <div class="desktop-nav__last">
          <ul class="desktop-nav__eyebrow">
            <li class="desktop-nav__eyebrow-item">
              <button
                type="button"
                aria-label="Visa och göm notiscenter"
                class="desktop-nav__eyebrow-button"
              >
                <mb-ica-icon-alarm></mb-ica-icon-alarm>
              </button>
            </li>
            <li class="desktop-nav__eyebrow-item desktop-nav__eyebrow-item--user">
              <button type="button" class="desktop-nav__user">
                <mb-ica-icon-user-internet
                  class="desktop-nav__user-icon"
                ></mb-ica-icon-user-internet>
                <span class="desktop-nav__user-info">
                  <span class="desktop-nav__user-name">{{ userName }}</span>
                  <span class="desktop-nav__user-butik">{{ butik }}</span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import logoUrl from '../assets/images/MinButik-Logo.png'

defineEmits(['navigate'])

/**
 * Props matchar det som typiskt varieras mellan prototyper. Defaults är
 * en generisk "TESTAPP" — byt via props i App.vue till den app du
 * faktiskt prototypar (t.ex. Order & Leverans = '#176473' + 'home-delivery').
 *
 * Tips: Om du lägger till stöd för fler appar, mappa app-id →
 * label/icon/color i desktop-nav.md och skicka in via props.
 */
defineProps({
  // Namn som visas bredvid user-ikonen. Placeholder enligt projekt-beslut.
  userName: {
    type: String,
    default: 'Namn Efternamn'
  },
  // Butik och format, visas som andra rad i user-sektionen.
  butik: {
    type: String,
    default: 'Testbutik, Kvantum'
  },
  // Label på den aktiva meny-knappen (stora bokstäver enligt design).
  activeAppLabel: {
    type: String,
    default: 'TESTAPP'
  },
  // Bakgrundsfärg på aktiv knapp — varje app har sin egen. TESTAPP = neutral grå.
  activeAppColor: {
    type: String,
    default: '#626262'
  },
  // Ikon-tagg för aktiv app. Default = play (generisk placeholder för TESTAPP).
  activeAppIconTag: {
    type: String,
    default: 'mb-ica-icon-play'
  }
})
</script>

<style scoped>
/* ─── Outer header ──────────────────────────────────────────────────── */

.desktop-nav {
  /* INFERENS: röda linjen längst upp. Verifiera mot produktionskällan. */
  border-top: 4px solid var(--ica-red);
  border-bottom: 1px solid var(--ica-border);
  position: sticky;
  top: 0;
  z-index: 300;
  background: #fff;
  /* --header-height driver höjden på både __inner och __menu-items */
  --header-height: 48px;
}

.desktop-nav__theme {
  /* data-mb-theme="turquoise-dark" tillåter app-färgen att plockas upp
     av ärvande CSS-variabler. Vi sätter den via inline style i template. */
}

/* ─── Inner grid ────────────────────────────────────────────────────── */

.desktop-nav__inner {
  height: var(--header-height);
  display: grid;
  /* 5-kolumns-layout: logo | spacer | menu | spacer | right-side.
     1fr-kolumnerna centrerar menyn visuellt. */
  grid-template-columns: max-content 1fr max-content 1fr max-content;
  align-items: center;
  /* Sido-padding för logon/eyebrow */
  padding: 0 var(--ica-spacing-md);
}

/* ─── Logo (vänster) ────────────────────────────────────────────────── */

.desktop-nav__first {
  display: flex;
  align-items: center;
}

.desktop-nav__logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: var(--ica-text);
}

.desktop-nav__logo-img {
  width: 131.76px;
  height: 20px;
  display: block;
}

/* ─── Meny (mitten) ─────────────────────────────────────────────────── */

.desktop-nav__mid {
  display: flex;
  align-items: center;
}

.desktop-nav__menu-items {
  height: var(--header-height);
  display: grid;
  grid-auto-flow: column;
  padding: 0 1.75rem;
  margin: 0;
  grid-column-gap: 24px;
  list-style: none;
  align-items: center;
}

.desktop-nav__menu-item {
  list-style: none;
  display: grid;
  position: relative;
  align-items: center;
}

/* Aktiv app — struktur skiljer sig (a i stället för mb-ica-button-icon) */
.desktop-nav__active-page-link {
  display: grid;
  grid-auto-flow: column;
  justify-content: center;
  align-items: center;
  column-gap: 8px;
  height: 36px;
  padding: 0 12px;
  border-radius: 4px;
  background-color: var(--application-color, #626262);
  color: #fff;
  font-family: 'ICATextNy', sans-serif;
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.desktop-nav__active-page-link:hover {
  filter: brightness(1.1);
}

.desktop-nav__active-page-link :deep(mb-ica-icon-play),
.desktop-nav__active-page-link :deep(mb-ica-icon-home-delivery),
.desktop-nav__active-page-link :deep(mb-ica-icon-delivery-truck),
.desktop-nav__active-page-link :deep(mb-ica-icon-home),
.desktop-nav__active-page-link :deep(mb-ica-icon-view-image),
.desktop-nav__active-page-link :deep(mb-ica-icon-rate),
.desktop-nav__active-page-link :deep(mb-ica-icon-alarm) {
  font-size: 18px;
  color: inherit;
}

/* ─── Mellanrums-spacer (pushar eyebrow till höger) ─────────────────── */

.desktop-nav__spacer {
  /* Grid-positioneringen gör jobbet — denna div är en placeholder för
     den fjärde grid-kolumnen. Ingen synlig styling behövs. */
}

/* ─── Eyebrow (höger) ───────────────────────────────────────────────── */

.desktop-nav__last {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  justify-self: end;
}

.desktop-nav__eyebrow {
  height: var(--header-height);
  display: grid;
  grid-auto-flow: column;
  margin: 0;
  padding: 0;
  list-style: none;
  align-items: stretch;
}

.desktop-nav__eyebrow-item {
  display: grid;
  align-items: stretch;
  list-style: none;
  /* INFERENS: vertikala avdelar-streck mellan eyebrow-items. */
  border-left: 1px solid var(--ica-border);
}

.desktop-nav__eyebrow-button {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  background: transparent;
  border: none;
  color: var(--ica-red);
  cursor: pointer;
  font-size: 18px;
}

.desktop-nav__eyebrow-button :deep(mb-ica-icon-alarm) {
  font-size: 20px;
}

.desktop-nav__user {
  height: 48px;
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: var(--ica-spacing-xs);
  padding: 0 var(--ica-spacing-md);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
}

.desktop-nav__user-icon {
  font-size: 20px;
  color: var(--ica-red);
}

.desktop-nav__user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.desktop-nav__user-name {
  font-family: 'ICATextNy', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: var(--ica-text);
}

.desktop-nav__user-butik {
  font-family: 'ICATextNy', sans-serif;
  font-size: 13px;
  color: var(--ica-text-secondary);
}

/* ─── Dold under 767px ──────────────────────────────────────────────── */

@media (max-width: 766px) {
  .desktop-nav {
    display: none;
  }
}
</style>
