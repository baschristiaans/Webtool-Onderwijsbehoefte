# Webtool Profielduiding Hoogbegaafdheid

React/Vite-tool op basis van de matrices van Betts en Neihart.

## Structuur

- `src/App.jsx`: hoofdapp met invoer, analyse, popup en export
- `src/main.jsx`: React entrypoint
- `src/styles.css`: vormgeving
- `src/data/profiles.js`: profielinhoud, Matrix 1 en Matrix 2
- `src/data/observationItems.js`: observatie-items en antwoordschalen
- `src/lib/analysis.js`: profielbasis, interpretatielaag en prestatiebeeld
- `src/lib/buildPersonalizedAdvice.js`: advieslaag op basis van Matrix 2

## Gebruik

1. Installeer dependencies met `npm install`
2. Start lokaal met `npm run dev`
3. Maak een productiebuild met `npm run build`

Als PowerShell `npm` blokkeert door het scriptbeleid, gebruik dan:

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run build
```

## Inhoudelijk uitgangspunt

- De tool ondersteunt leerkrachten bij het vormen van een werkhypothese.
- Observeerbaar functioneren vormt de stabiele profielbasis.
- Context, thuissituatie, ZOOV+ en toetsgegevens vormen een aparte interpretatielaag.
- De ruwe profielscore komt alleen uit observaties in de schoolcontext.
- Matrix 1 is zichtbaar via het vraagtekenknopje bij het best passende profiel.
- Matrix 2 vormt de basis voor de geprioriteerde onderwijsbehoeften en concrete leerkrachtadviezen.
- De uitkomst blijft een interpretatiekader en geen diagnose.
