# Layout-referenser (desktop)

Helskärmslayouter i desktop-format (≥ 1024px) som visar färdiga ICA-mönster.
Använd som **facit** när du bygger en vy — inte inspiration.

> **Workflow:** Identifiera vy-typen → hitta matchande layout nedan →
> studera bilden pixel för pixel → kopiera närmaste mall i
> `prototyp/app/src/views/_templates/` → justera tills ditt resultat matchar
> referensen.

---

## Index

> **Tabellen behöver fyllas i.** Den initiala uppsättningen kopierades från
> `project-template/` och har datum-baserade filnamn. När du verifierar en
> layout, döp om filen till något beskrivande och fyll i raden:
>
> `| filnamn.png | Vy-typ | När använda | Mall som matchar |`

| Filnamn | Vy-typ | När använda | Närmaste mall |
|---------|--------|-------------|---------------|
| Skärmavbild 2026-04-01 kl. 14.07.04.png | _att klassificera_ | _att fylla i_ | _att fylla i_ |
| Skärmavbild 2026-04-01 kl. 14.07.59.png | _att klassificera_ | _att fylla i_ | _att fylla i_ |
| Skärmavbild 2026-04-01 kl. 14.08.22.png | _att klassificera_ | _att fylla i_ | _att fylla i_ |
| Skärmavbild 2026-04-01 kl. 14.09.14.png | _att klassificera_ | _att fylla i_ | _att fylla i_ |
| Skärmavbild 2026-04-01 kl. 14.09.30.png | _att klassificera_ | _att fylla i_ | _att fylla i_ |
| Skärmavbild 2026-04-01 kl. 14.10.10.png | _att klassificera_ | _att fylla i_ | _att fylla i_ |
| Skärmavbild 2026-04-01 kl. 14.10.35.png | _att klassificera_ | _att fylla i_ | _att fylla i_ |
| Skärmavbild 2026-04-01 kl. 14.11.03.png | _att klassificera_ | _att fylla i_ | _att fylla i_ |
| Skärmavbild 2026-04-01 kl. 14.11.36.png | _att klassificera_ | _att fylla i_ | _att fylla i_ |
| Skärmavbild 2026-04-01 kl. 14.11.51.png | _att klassificera_ | _att fylla i_ | _att fylla i_ |

---

## Konventioner när du lägger till nya layouts

1. **Filnamn ska vara beskrivande**, inte datum-baserade. Exempel:
   `master-detail.png`, `data-table-with-filter.png`, `form-two-column.png`.
2. **Lägg in en rad i tabellen ovan** med samma format.
3. **En PNG per vy-typ.** Behöver du visa flera tillstånd (laddning, tomt,
   fyllt) — använd suffix: `master-detail--empty.png`, `master-detail--loaded.png`.
4. **Desktop-bredd:** rendera helst i 1280–1440px viewport för att likna
   typiska arbetsplatser.
