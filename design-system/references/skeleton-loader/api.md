# mb-ica-skeleton-loader

Skeleton-loader som visar en laddningsanimation medan data hämtas.

## När ska du använda skeleton-loader?

- Som laddningstillstånd innan en lista eller vy har fått data
- Istället för en spinner — ger bättre UX genom att visa en förhandsglimt av layouten
- Kombinera med `v-if` för att visa/dölja baserat på loading-state

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `loader` | string | "" | Typ av skeleton. Allowed: `list` (visar list-rader), `card`, `text` |

## Kodexempel

Laddningstillstånd för en lista:
```html
<mb-ica-skeleton-loader v-if="loading" loader="list" />
<div v-else>
  <!-- Faktiskt listinnehåll -->
</div>
```

## Vanliga misstag

- **Använd `v-if`/`v-else`** — visa antingen skeleton ELLER innehåll, aldrig båda samtidigt
- **Välj rätt `loader`-typ** — `list` för listor, matchar card-row-layouten
