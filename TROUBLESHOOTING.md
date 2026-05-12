# Felsökning

Logg över fel som dykt upp i projektet och hur de löstes. Lägg till nya
inlägg överst när nya problem uppstår.

---

## 2026-04-24 — `Cannot find native binding` vid start av dev-server

### Symptom

Dev-servern vägrade starta på en kollegas dator med följande fel:

```
Failed to start preview server:
.../prototyp/app/node_modules/rolldown/dist/shared/binding-CkWPGrSM.mjs:507
throw new Error("Cannot find native binding. npm has a bug related to
optional dependencies (https://github.com/npm/cli/issues/4828). Please
try `npm i` again after removing both package-lock.json and node_modules
directory.")
```

### Orsak

Hela projektmappen (inklusive `prototyp/app/node_modules/`) hade kopierats
från en annan dator. Native bindings som `rolldown` och `lightningcss` är
**plattformsspecifika** — de prebuild-binärer (`.node`-filer) som ligger
i `node_modules` på ursprungsmaskinen matchar inte nödvändigtvis den nya
maskinens OS/arkitektur. Rolldown-loadern hittar då ingen fungerande
binding och kastar felet ovan.

Detta är ett känt npm-beteende kring optional dependencies, dokumenterat i
[npm/cli#4828](https://github.com/npm/cli/issues/4828).

### Lösning (manuell)

Rensa `node_modules` och lockfilen i app-mappen, och installera om med
lokal npm. **Rör inte** `prototyp/node_modules/` — det är där det privata
paketet `@ica-azure/ica-elements` ligger, och det kan inte hämtas via npm.

```bash
cd prototyp/app
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Lösning (automatisk — nuvarande)

`setup.sh` i projektroten detekterar nu det här fallet automatiskt.
Scriptet kollar om rolldowns plattformsspecifika binding-fil finns för
den aktuella maskinens `uname -s` / `uname -m`. Saknas den → rensas
`node_modules` + `package-lock.json` och `npm install` körs om.

Kör helt enkelt:

```bash
./setup.sh
```

### Relaterade fel som setup.sh också hanterar

- **Node.js saknas** — tydligt meddelande med installationsalternativ
  (nvm, Homebrew, direktnedladdning).
- **Node < v20** — varning om att Vite 8 kräver v20.19+.
- **`@ica-azure/ica-elements` saknas** — exit med instruktion om att
  kopiera mappen manuellt från en annan prototyp (paketet ligger på
  ICAs privata registry).

---

## Mall för nya inlägg

```
## YYYY-MM-DD — Kort beskrivning av symtomet

### Symptom
(felmeddelande, beteende)

### Orsak
(root cause)

### Lösning
(stegen som fixade det — manuellt, och automatiskt om relevant)
```
