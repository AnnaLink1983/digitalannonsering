# Prototyp — projektspecifik kontext

> Föräldrans regler i `../../.claude/CLAUDE.md` gäller alltid.
> Den här filen lägger till **projektspecifika** beslut, vyer och datamodeller
> ovanpå dem. När den är tom (i fresh template) — populära den allt eftersom
> projektet växer.

---

## Syfte

_(Beskriv vad den här prototypen ska visa.)_

---

## Vyer

| Vy | Typ | Layout | Mall som kopierades |
|----|-----|--------|----------------------|
| menu | Toppnivå (hub) | `nosidebar` | (inline i App.vue) |

---

## Datamodeller

_(Lägg till mock-typer här när du skapar vyer.)_

---

## Aktiv app i DesktopNav

| Prop | Värde |
|------|-------|
| `activeAppLabel` | `"TESTAPP"` (default) — byt till t.ex. "ORDER & LEVERANS" för riktig app |
| `activeAppColor` | `#626262` (default) — varje app har egen färg, t.ex. `#176473` för Order & Leverans |
| `activeAppIconTag` | `mb-ica-icon-play` (default) — t.ex. `mb-ica-icon-home-delivery` för Order & Leverans |

Defaults i `DesktopNav.vue` är en generisk "TESTAPP" — byt till rätt
label/färg/ikon för den app du faktiskt prototypar.

---

## Låsta beslut

_Format:_ `**[ÅÅÅÅ-MM-DD] Rubrik** — vad som gäller. Varför._

_(Tomt i fresh template.)_
