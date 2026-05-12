# Komponenter i bruk

> Listar de komponenter som faktiskt används i det här projektet.
> En **delmängd** av `design-system/components.md`.
> Uppdatera när nya komponenter introduceras.

---

## Strukturella

| Komponent | HTML-tagg | Används i |
|-----------|-----------|-----------|
| IcaLayoutTwoColumns | `mb-ica-layout-two-columns` | menu (App.vue), MasterDetailView, DataTableView |
| IcaPageHeader | `mb-ica-page-header` | menu (App.vue), MasterDetailView, DataTableView |
| IcaHeader | `mb-ica-header` | MasterDetailView (sidebar + drawer), DataTableView (drawer) |
| IcaSegment | `mb-ica-segment` | menu (App.vue), MasterDetailView |
| IcaDrawer | `mb-ica-drawer` | MasterDetailView, DataTableView (filter) |
| IcaDialog | `mb-ica-dialog` | ListWithCreateView (skapa/redigera) |
| IcaAccordion | `mb-ica-accordion` | MasterDetailView, DataTableView (filter-grupper) |

---

## Listor och rader

| Komponent | HTML-tagg | Används i |
|-----------|-----------|-----------|
| IcaCardRow | `mb-ica-card-row` | menu (App.vue), MasterDetailView, DataTableView |
| IcaMeta | `mb-ica-meta` | menu (App.vue), MasterDetailView, DataTableView |
| IcaKeyValue | `mb-ica-key-value` | MasterDetailView (detaljpanel) |
| IcaTable | `mb-ica-table` | DataTableView |
| IcaMediaObject | `mb-ica-media-object` | DataTableView (rad-cell med bild + text) |

---

## Formulär och filter

| Komponent | HTML-tagg | Används i |
|-----------|-----------|-----------|
| IcaInput | `mb-ica-input` | ListWithCreateView (formulär i dialog) |
| IcaInputSearch | `mb-ica-input-search` | MasterDetailView, DataTableView |
| IcaCheckbox | `mb-ica-checkbox` | MasterDetailView (filter), DataTableView (filter + radval) |
| IcaFilter | `mb-ica-filter` | MasterDetailView, DataTableView |

## Knappar

| Komponent | HTML-tagg | Används i |
|-----------|-----------|-----------|
| IcaButton | `mb-ica-button` | MasterDetailView, DataTableView (drawer-actions) |

## Feedback

| Komponent | HTML-tagg | Används i |
|-----------|-----------|-----------|
| IcaPlaceholder | `mb-ica-placeholder` | MasterDetailView, DataTableView (tom-state) |
| IcaColorIndicator | `mb-ica-color-indicator` | DataTableView (statusprick i tabellrad) |

## Project-komponenter

| Komponent | Fil | Används i | Syfte |
|-----------|-----|-----------|-------|
| DesktopNav | `components/DesktopNav.vue` | App.vue | Top-nav (alltid synlig). API i `prototyp/.claude/context/desktop-nav.md`. |

---

## Notering

En komponent som inte finns här är inte förbjuden — men agenten ska läsa
dess `api.md` extra noggrant och bekräfta med användaren om det är ett
nytt tillägg.

Vy-mallarna i `prototyp/app/src/views/_templates/` använder fler komponenter
(table, filter, drawer, accordion, input-search, input, checkbox, button,
button-icon, dialog, breadcrumbs, color-indicator, media-object) — när du
kopierar en mall, lägg till de komponenter den använder här.
