# Stubs

Prototyp-mockningar för interna paket som finns i produktion men saknas här.

Varje fil speglar det produktions-API den ersätter och är opt-in — du importerar
bara den när en vy behöver den. Vite-aliasen i `vite.config.js` pekar
produktionsspecifikt importnamn (t.ex. `shared-utils/src/scanner`) till
stub-filen, så att kod som kopieras från produktion fungerar utan ändring.

| Stub | Ersätter | Används för |
|------|----------|-------------|
| `scanner.ts` | `shared-utils/src/scanner` | Mockad streckkodsläsare. Exponerar `window.__simulateScan('...')` i devtools för att trigga en scan. Auto-triggar efter 2s när kamera-scan startar. |
| `imageUtils.ts` | `shared-utils/src/imageUtils` | Bildstorlekar + `handleImageLoadError` |
| `shared-components.ts` | `shared-components` | Re-exporterar prototypens `TechnicalError.vue` |

## När ska du använda en stub?

- **Du kopierar en vy/komponent från produktion** som importerar från ett av
  paketen ovan → lämna importen orörd, stubben tar över.
- **Du prototypar en interaktion som i produktion går via scanner/kamera** →
  importera `useScanner` från `shared-utils/src/scanner` som i produktion.

## När ska du INTE skapa nya stubs?

Skapa inte en stub "för säkerhets skull". Lägg mocken direkt i vy-filen
första gången mönstret uppstår och lyft ut till `stubs/` eller `utils/` först
när en andra vy återanvänder samma logik.

## Produktionsöverlämning

När prototypen lämnas över till utvecklare: ta bort raderna i
`vite.config.js` som pekar om paketen till stubs. Stub-filerna behöver
inte raderas — aliasen gör så att de bara används i dev.
