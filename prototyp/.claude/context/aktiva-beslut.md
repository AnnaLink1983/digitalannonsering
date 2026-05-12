# Aktiva beslut

> Logg över designbeslut som är låsta. Agenten ska ALDRIG ifrågasätta eller
> omvärdera beslut som finns här. Lägg till nya beslut löpande — datera dem.
>
> Format: `**[ÅÅÅÅ-MM-DD] Rubrik** — vad som gäller. Varför (valfritt).`

---

## Rekommenderade utgångspunkter — desktop

Mönster som validerats i tidigare prototyper. **Inte låsta** — anpassa efter
behov, men börja härifrån om inget annat kräver avvikelse.

**Sidmall**
Alla vyer använder `mb-ica-layout-two-columns`. Master-detail-vyer kör
default (2-kolumn), enkla vyer kör `nosidebar`. Bygg inte vyer utanför
layout-two-columns — det skapar inkonsistent spacing och saknar centrering.

**Header-strategi**
- 2-kolumn: `mb-ica-page-header` i `slot="main"`, `mb-ica-header` i
  `slot="sidebar"`. Layoutens egen `header`-slot lämnas tom.
- 1-kolumn (`nosidebar`): `mb-ica-page-header` i `slot="header"`.

**Inga view-transitions**
Vy-byten sker direkt via `currentView.value = view` i App.vue. Slide-animationer
matchar inte produktionen och känns fel i desktop-paradigmet.

**Bottom-nav existerar inte**
DesktopNav som top-nav är enda navigationen. Bygg aldrig bottom-nav-mönster
("dölj på dialoger" osv. behövs inte heller).

**Filter som drawer**
Filterpanel öppnas alltid i `mb-ica-drawer` — aldrig `mb-ica-dialog`. Drawern
har header med stäng-knapp och två knappar i botten: "Visa X resultat" (primär)
+ "Spara filter" (sekundär).

**Filter-chips utan card-wrapper**
`mb-ica-filter` med `:incard="false"`. Sök och filter sitter tätt ihop.

**Sortering = klick på tabell-header**
`mb-ica-table` med `headeritems` och `@headeritemclick`. `headers[].sortdirection`
är single source of truth.

**Layout-two-columns sidebar-duration**
Override default 0.7s → 0.3s med
`style="--IcaLayoutTwoColumns--sidebar-duration: 0.3s"`. Snappigare overlay
på 767-1023px. (I desktop-template bygger vi bara för 1024+, så overlay-läget
syns sällan, men koll på det om du krymper browsern.)

---

## Beslut

_(Tomt i fresh template. Lägg till låsta beslut nedan när de fattas.)_
