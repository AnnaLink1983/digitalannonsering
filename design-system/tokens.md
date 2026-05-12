# Design Tokens

## Två nivåer av tokens

### 1. Systemtokens (från `@ica-azure/ica-elements/variables.css`)

Dessa definieras av designsystemet och används internt av komponenterna:

| Token | Värde | Användning |
|-------|-------|------------|
| `--IcaElements__color_cta-primary-bg` | `#e13205` | Primär CTA-bakgrund (knappar, länkar) |
| `--IcaElements__color_border` | `#ebebeb` | Standard kantlinjefärg |
| `--IcaElements__color_subtle` | `#f6f6f6` | Subtil bakgrund |
| `--IcaElements__ui_box-shadow--floating-card` | `0 2px 10px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.05)` | Card-skugga |
| `--IcaElements__ui_header--height` | `2.75rem` | Headerns höjd (44px) |

### 2. Projekttokens (från `app/src/style.css`)

Dessa är projektets egna aliases, definierade i `:root`:

#### Färger

| Token | Värde | Användning |
|-------|-------|------------|
| `--ica-red` | `#e13205` | Primär varumärkesfärg, knappar, accent |
| `--ica-red-dark` | `#9b0600` | Mörkare röd, active-state, focus-outline |
| `--ica-red-light` | `#fcece7` | Ljusröd bakgrund, t.ex. alerts |
| `--ica-red-hover` | `#cf2e05` | Hover-state, länkfärg |
| `--ica-text` | `#3a3a3a` | Primär textfärg |
| `--ica-text-secondary` | `#6e6e6e` | Sekundär text, hjälptext, subheadings |
| `--ica-border` | `#ebebeb` | Ramar och avdelare |
| `--ica-subtle` | `#f6f6f6` | Subtil bakgrund, t.ex. inverted cards |
| `--ica-bg` | `#ffffff` | Sidans bakgrundsfärg (kort, sidebar, dialoger) |
| `--ica-bg-page` | `#f9f5f5` | Helbakgrund för hela appens vy (under DesktopNav, runt layout-two-columns) |
| `--ica-teal` | `#007a78` | Accent för sekundära actions |
| `--ica-status-warning` | `#f5a623` | Varningsstatus |
| `--ica-status-success` | `#4caf50` | Lyckad status |

#### Spacing

| Token | Värde | Användning |
|-------|-------|------------|
| `--ica-spacing-xs` | `0.25rem` (4px) | Minsta mellanrum, t.ex. mellan ikon och text |
| `--ica-spacing-sm` | `0.5rem` (8px) | Litet mellanrum, t.ex. inuti kompakta komponenter |
| `--ica-spacing-md` | `1rem` (16px) | Standard mellanrum mellan element |
| `--ica-spacing-lg` | `1.5rem` (24px) | Mellanrum mellan sektioner |
| `--ica-spacing-xl` | `2rem` (32px) | Stort mellanrum, t.ex. runt sidinnehåll |

#### Border radius

| Token | Värde | Användning |
|-------|-------|------------|
| `--ica-radius-sm` | `0.25rem` (4px) | Små element, t.ex. tags |
| `--ica-radius` | `0.5rem` (8px) | Standard radius, t.ex. cards |
| `--ica-radius-lg` | `1rem` (16px) | Stora element, t.ex. dialogs |

#### Skuggor

| Token | Värde |
|-------|-------|
| `--ica-shadow` | `0 2px 10px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.05)` |

---

## Typografi

### Fontfamiljer (från `@ica-azure/ica-elements/fonts.css`)

| Font | Vikter | Användning |
|------|--------|------------|
| **ICATextNy** | 300 (light), 400 (regular), 700 (bold), 900 (black) + italic | Brödtext, labels, UI-text |
| **ICARubrik** | 300 (light), 400, 500 (medium), 700 (bold), 900 (black) | Rubriker (h1–h4) |
| **ICATextNy-Siffror** | 400 | Siffror (tabellär data) |
| **ICATextNy-SiffrorCondensed** | 400 | Kondenserade siffror |
| **ICAHand** | 400 | Handskriven stil |
| **ICAPensel** | 400 | Penseldragen stil |
| **ICARubrikSkiss** | 400, 700 | Skissad rubrikstil |

### Typografisk skala (från `typography-base.css`)

| Element | Font | Storlek (mobil) | Storlek (desktop) | Vikt | Line-height |
|---------|------|-----------------|--------------------|----- |-------------|
| Body | ICATextNy | 1rem | 1rem | 400 | 1.5rem |
| h1 | ICARubrik | 2rem | 2.5rem | 900 | 2.5rem / 3rem |
| h2 | ICARubrik | 1.25rem | 1.5rem | 700 | 1.75rem / 2rem |
| h3 | ICARubrik | 1rem | 1.25rem | 500 | 1.5rem / 1.75rem |
| h4 | ICARubrik | 1rem | 1rem | 500 | 1.5rem |
| h5 | ICATextNy | 0.875rem | 0.875rem | 800 | 1.25rem |
| h6 | ICATextNy | 0.75rem | 0.75rem | 800 | 1rem |
| small | — | 0.875rem | — | — | — |

**OBS:** h5 och h6 renderas med `text-transform: uppercase`.

### Interaktiva färger (från typografi-CSS)

| Tillstånd | Färg |
|-----------|------|
| Länk | `#cf2e05` |
| Länk hover | `#f088b6` |
| Länk active | `#9b0600` |
| Focus outline | `0.125rem solid #9b0600` (med `outline-offset: 0.125rem`) |

---

## Komponentspecifika CSS properties

Vissa komponenter exponerar egna CSS custom properties för att anpassa utseende. Dessa dokumenteras i respektive komponents `api.md`. Exempel:

| Property | Komponent | Default |
|----------|-----------|---------|
| `--IcaHeader--border-color` | header | black |
| `--IcaHeader__heading--alignment` | header | center |
| `--IcaDialog--z-index` | dialog | 500 |
| `--IcaDialog--transition-duration` | dialog | 0.3s |
| `--IcaDialog--desktop-max-width` | dialog | 30rem |
| `--IcaDrawer--z-index` | drawer | 400 |
| `--IcaInputSearch--max-width` | input-search | 28rem |
| `--IcaSelectDropDown-z-index` | select-dropdown | 10 |
| `--IcaMediaObject--template-columns` | media-object | auto auto |
| `--IcaTag--elements--height` | tag | 1.75rem |
