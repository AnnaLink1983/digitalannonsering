# ICA Elements — Komponenter (desktop)

Alla komponenter importeras från `@ica-azure/ica-elements`. Web components
använder prefixet `mb-ica-*` i HTML.

> **Desktop-template:** Komponenter listas grupperade i **Core** (vad du
> använder till 80% av vyerna) och **Extra** (specialfall). `api.md` finns
> under `references/<komponent>/` för båda — grupperingen är bara här för
> orientering.

## Import

```js
// Komponenter
import '@ica-elements/IcaLayoutTwoColumns.js'
import '@ica-elements/IcaPageHeader.js'

// Ikoner
import '@ica-elements/IcaIconSearch.js'

// CSS
import '@ica-elements/fonts.css'
import '@ica-elements/variables.css'
import '@ica-elements/typography-base.css'
import '@ica-elements/typography-text.css'
```

---

## Core — räcker till 80% av desktop-vyer

| Komponent | HTML-tagg | Användning | Referens |
|-----------|-----------|------------|----------|
| IcaLayoutTwoColumns | `mb-ica-layout-two-columns` | **Standard sidmall.** 2-kol default, `nosidebar` för 1-kol. **Header-slot beror på läge** (se CLAUDE.md regel 1). | `references/layout-two-columns/` |
| IcaPageHeader | `mb-ica-page-header` | Page-header (med `backlabel`, `actions`). Sätts i `slot="main"` (2-kol) eller `slot="header"` (nosidebar). | `references/page-header/` |
| IcaHeader | `mb-ica-header` | Sidebar-header och dialog-header (`variant="dialog"`). | `references/header/` |
| IcaTable | `mb-ica-table` | Datatabell. **Rader = `mb-ica-card-row` med matchande grid** (se CLAUDE.md regel 2). | `references/table/` |
| IcaCardRow | `mb-ica-card-row` | Klickbar listrad. Också tabellrad inuti `mb-ica-table`. | `references/card-row/` |
| IcaMediaObject | `mb-ica-media-object` | Bild + text i `card-row` (utanför tabeller). | `references/media-object/` |
| IcaMeta | `mb-ica-meta` | Strukturerad text (heading/subheading/text). | `references/meta/` |
| IcaSegment | `mb-ica-segment` | Sektion med versal rubrik. | `references/segment/` |
| IcaButton | `mb-ica-button` | Standard knapp (primary/secondary). | `references/button/` |
| IcaButtonIcon | `mb-ica-button-icon` | Ikonknapp. Används i DesktopNav och som action-knappar. | `references/buttonicon/` |
| IcaInputSearch | `mb-ica-input-search` | Sökfält (i `slot="left"` på filter). | `references/input-search/` |
| IcaInput | `mb-ica-input` | Standard textfält. | `references/input/` |
| IcaCheckbox | `mb-ica-checkbox` | Kryssruta. Också i tabellens `slot="left"` för välj-alla. | `references/checkbox/` |
| IcaFilter | `mb-ica-filter` | Filterkontroll med chips. **Sätt `:incard="false"`.** | `references/filter/` |
| IcaDrawer | `mb-ica-drawer` | Filterpanel. **Filter öppnas alltid i drawer, inte dialog.** | `references/drawer/` |
| IcaAccordion | `mb-ica-accordion` | Expanderbar sektion (filter-grupper). | `references/accordion/` |
| IcaDialog | `mb-ica-dialog` | Modal (för bekräftelser, formulär i overlay). | `references/dialog/` |
| IcaBreadcrumbs | `mb-ica-breadcrumbs` | Brödsmulor i page-header (vid djup navigation). | `references/breadcrumbs/` |
| IcaPlaceholder | `mb-ica-placeholder` | Tom-state med ikon + text. | `references/placeholder/` |
| IcaColorIndicator | `mb-ica-color-indicator` | Statusprick (grön/gul/röd) i tabeller. | `references/color-indicator/` |
| **DesktopNav** (project) | `<DesktopNav>` | Top-nav, alltid synlig. Inte ICA Elements — Vue-import. | `prototyp/.claude/context/desktop-nav.md` |

---

## Extra — slå upp vid behov

### Strukturella
| Komponent | HTML-tagg | Referens |
|-----------|-----------|----------|
| IcaCard | `mb-ica-card` | `references/card/` |

### Listor och rader
| Komponent | HTML-tagg | Användning | Referens |
|-----------|-----------|------------|----------|
| IcaKeyValue | `mb-ica-key-value` | Nyckel-värde-par i detaljvyer | `references/key-value/` |
| IcaTimeline | `mb-ica-timeline` | Tidslinje | `references/timeline/` |
| IcaSwipeAction | `mb-ica-swipe-action` | Sällsynt på desktop. `actions` måste vara `JSON.stringify([...])`. | `references/swipe-action/` |

### Formulär och input
| Komponent | HTML-tagg | Referens |
|-----------|-----------|----------|
| IcaInputNumberStepper | `mb-ica-input-number-stepper` | `references/input-number-stepper/` |
| IcaInputSwitch | `mb-ica-input-switch` | `references/input-switch/` |
| IcaInputTime | `mb-ica-input-time` | `references/input-time/` |
| IcaInputTable | `mb-ica-input-table` | Inline-editering i tabell | `references/input-table/` |
| IcaRadio | `mb-ica-radio` | `references/radio/` |
| IcaSelectDropdown | `mb-ica-select-dropdown` | `references/select-dropdown/` |

### Tabs
| Komponent | HTML-tagg | Referens |
|-----------|-----------|----------|
| IcaSegmentControl | `mb-ica-segment-control` | `references/segment-control/` |

### Feedback och status
| Komponent | HTML-tagg | Referens |
|-----------|-----------|----------|
| IcaAlertMessage | `mb-ica-alert-message` | `references/alert-message/` |
| IcaBadge | `mb-ica-badge` | `references/badge/` |
| IcaTag | `mb-ica-tag` | `references/tag/` |
| IcaProgressBar | `mb-ica-progress-bar` | `references/progress-bar/` |
| IcaSkeletonLoader | `mb-ica-skeleton-loader` | `references/skeleton-loader/` |
| IcaTooltip | `mb-ica-tooltip` | Hjälptext vid hover (desktop-only-mönster). | `references/tooltip/` |
| IcaAttentionHeader | `mb-ica-attention-header` | För bekräftelse/varningsdialoger | `references/attention-header/` |
| IcaFileTree | `mb-ica-file-tree` | Hierarkisk file-tree-vy | `references/file-tree/` |

### Typografi
| Komponent | HTML-tagg | Referens |
|-----------|-----------|----------|
| IcaTypographyBase | `mb-ica-typography-base` | `references/typography-base/` |

---

## Avlägsnade i desktop-template

Följande komponenter har `api.md` kvar under `references/` men ska **inte
användas** i desktop-vyer. De är mobil-mönster eller routing-komponenter:

| Komponent | Varför inte | Använd istället |
|-----------|-------------|------------------|
| `mb-ica-button-icon-vertical` | Mobil bottom-nav-tab | DesktopNav top-nav |
| `mb-ica-sorting-drop-down` | Mobil-mönster för sortering | Klick på `mb-ica-table` kolumn-headers (`@headeritemclick`) |
| `mb-ica-transition-slide` | Vy-transitions (desktop byter vyer direkt) | Inget — använd `currentView`-switch i App.vue |
| `mb-ica-transition-panel` | Kräver Vue Router | Inget |

---

## Ikoner

> **Designsystem-regel (hård):** Alla ikoner ska vara **outlined**, aldrig
> **filled**. När det finns både outlined- och filled-variant (t.ex.
> `star-filled` vs. `rate`, `bell` vs. `alarm`, `grid` vs. `view-image`)
> — välj alltid outlined.

Alla ikoner importeras som separata moduler:

```js
import '@ica-elements/IcaIconSearch.js'    // → <mb-ica-icon-search>
```

DesktopNav använder dessa 6 (outlined):

| Plats i DesktopNav | Ikon |
|-------------------|------|
| HEM | `mb-ica-icon-home` |
| APPAR | `mb-ica-icon-view-image` (inte `grid` — filled) |
| GENVÄGAR | `mb-ica-icon-rate` (inte `star-filled`) |
| Notiser (eyebrow) | `mb-ica-icon-alarm` (inte `bell`) |
| User-sektion | `mb-ica-icon-user-internet` |
| Aktiv app (default = TESTAPP) | `mb-ica-icon-play` |

Övriga vanliga ikoner (urval): `search`, `cross`, `angle-left`, `angle-right`,
`pen`, `trash`, `info`, `reload`, `recall`, `return-rights`, `media-return`,
`find-item`, `files`, `delivery-truck`, `pallet`. Lägg till nya i `main.js`
när en vy använder dem.
