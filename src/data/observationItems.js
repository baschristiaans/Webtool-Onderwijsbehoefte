export const OBSERVATION_SCORE_OPTIONS = [
  { value: 0, label: 'Niet waargenomen' },
  { value: 1, label: 'Soms zichtbaar' },
  { value: 2, label: 'Regelmatig zichtbaar' },
  { value: 3, label: 'Duidelijk en consistent zichtbaar' }
];

const observationItems = [
  {
    id: 'obs-seeks-confirmation',
    domain: 'task-approach',
    domainLabel: 'Taakaanpak en leerhouding',
    prompt:
      'De leerling zoekt al vroeg bevestiging over de kwaliteit of aanpak van het werk.',
    category: 'core',
    profileIds: ['type1']
  },
  {
    id: 'obs-safe-approach',
    domain: 'task-approach',
    domainLabel: 'Taakaanpak en leerhouding',
    prompt:
      'De leerling kiest meestal voor een veilige en bekende aanpak.',
    category: 'core',
    profileIds: ['type1']
  },
  {
    id: 'obs-avoids-harder-task',
    domain: 'task-approach',
    domainLabel: 'Taakaanpak en leerhouding',
    prompt:
      'De leerling doet niet meer dan gevraagd wordt.',
    category: 'supporting',
    profileIds: ['type1']
  },

  {
    id: 'obs-reacts-to-unfairness',
    domain: 'response-challenge',
    domainLabel: 'Reactie op aanbod en uitdaging',
    prompt:
      'De leerling reageert sterk op ervaren onrecht, inconsequente regels of ongelijke behandeling.',
    category: 'supporting',
    profileIds: ['type2']
  },
  {
    id: 'obs-critical-rules',
    domain: 'response-challenge',
    domainLabel: 'Reactie op aanbod en uitdaging',
    prompt:
      'De leerling stelt kritische vragen over regels, werkwijzen of aanpak.',
    category: 'core',
    profileIds: ['type2']
  },
  {
    id: 'obs-original-ideas',
    domain: 'response-challenge',
    domainLabel: 'Reactie op aanbod en uitdaging',
    prompt:
      'De leerling komt met onverwachte of originele ideeën.',
    category: 'core',
    profileIds: ['type2']
  },
  {
    id: 'obs-discussion-overtakes-task',
    domain: 'response-challenge',
    domainLabel: 'Reactie op aanbod en uitdaging',
    prompt:
      'De leerling houdt de leerkracht of de groep bezig wanneer er te weinig uitdaging is.',
    category: 'core',
    profileIds: ['type2']
  },

  {
    id: 'obs-hides-strong-insights',
    domain: 'social-visibility',
    domainLabel: 'Sociale zichtbaarheid en afstemming',
    prompt:
      'De leerling houdt sterke antwoorden of inzichten geregeld op de achtergrond, waardoor het functioneren minder opvallend overkomt.',
    category: 'core',
    profileIds: ['type3']
  },
  {
    id: 'obs-withdraws-when-visible',
    domain: 'social-visibility',
    domainLabel: 'Sociale zichtbaarheid en afstemming',
    prompt:
      'De leerling trekt zich zichtbaar terug wanneer een sterk antwoord, uitdaging of apart aanbod hem of haar sociaal opvallend maakt.',
    category: 'core',
    profileIds: ['type3']
  },
  {
    id: 'obs-wants-same-work-as-group',
    domain: 'social-visibility',
    domainLabel: 'Sociale zichtbaarheid en afstemming',
    prompt:
      'De leerling wil liever hetzelfde werk doen als de rest van de groep, ook wanneer meer uitdaging passend lijkt.',
    category: 'supporting',
    profileIds: ['type3']
  },

  {
    id: 'obs-resistant-schoolwork',
    domain: 'engagement',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    prompt:
      'De leerling laat weerstand zien bij schoolwerk.',
    category: 'supporting',
    profileIds: ['type4']
  },
  {
    id: 'obs-incomplete-work',
    domain: 'engagement',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    prompt:
      'De leerling rondt werk regelmatig beperkt of onvolledig af.',
    category: 'core',
    profileIds: ['type4']
  },
  {
    id: 'obs-low-effort-low-meaning',
    domain: 'engagement',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    prompt:
      'De leerling toont weinig inzet zolang de taak voor hem of haar weinig betekenis heeft.',
    category: 'core',
    profileIds: ['type2', 'type4']
  },
  {
    id: 'obs-engages-when-meaningful',
    domain: 'engagement',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    prompt:
      'De leerling haakt merkbaar aan wanneer een taak betekenisvol of passend uitdagend is.',
    category: 'supporting',
    profileIds: ['type2', 'type4']
  },
  {
    id: 'obs-better-with-trusted-adult',
    domain: 'engagement',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    prompt:
      'De leerling steekt zichtbaar meer energie in buitenschoolse interesses dan in schooltaken.',
    category: 'supporting',
    profileIds: ['type4']
  },

  {
    id: 'obs-planning-organization',
    domain: 'execution',
    domainLabel: 'Uitvoering en leerproduct',
    prompt:
      'De leerling is ongeorganiseerd in het werk.',
    category: 'core',
    profileIds: ['type5']
  },
  {
    id: 'obs-written-less-than-thinking',
    domain: 'execution',
    domainLabel: 'Uitvoering en leerproduct',
    prompt:
      'De leerling laat mondeling of in gesprek meer zien dan in schriftelijk werk.',
    category: 'core',
    profileIds: ['type5']
  },
  {
    id: 'obs-inconsistent-quality',
    domain: 'execution',
    domainLabel: 'Uitvoering en leerproduct',
    prompt:
      'De leerling is niet altijd taakgericht.',
    category: 'supporting',
    profileIds: ['type5']
  },
  {
    id: 'obs-strong-insight-weak-product',
    domain: 'execution',
    domainLabel: 'Uitvoering en leerproduct',
    prompt:
      'De kwaliteit van het werk past niet altijd bij wat de leerling mondeling of tijdens het denken laat zien.',
    category: 'core',
    profileIds: ['type5']
  },
  {
    id: 'obs-strong-problem-solving',
    domain: 'execution',
    domainLabel: 'Uitvoering en leerproduct',
    prompt:
      'De leerling laat sterk probleemoplossend denken zien.',
    category: 'supporting',
    profileIds: ['type5']
  },

  {
    id: 'obs-seeks-extra-challenge',
    domain: 'self-direction',
    domainLabel: 'Zelfsturing en ambitie',
    prompt:
      'De leerling zoekt uit zichzelf extra uitdaging.',
    category: 'core',
    profileIds: ['type6']
  },
  {
    id: 'obs-sets-goals',
    domain: 'self-direction',
    domainLabel: 'Zelfsturing en ambitie',
    prompt:
      'De leerling werkt zelfstandig zonder bevestiging te zoeken.',
    category: 'core',
    profileIds: ['type6']
  },
  {
    id: 'obs-uses-errors-for-learning',
    domain: 'self-direction',
    domainLabel: 'Zelfsturing en ambitie',
    prompt:
      'De leerling gebruikt fouten zichtbaar als onderdeel van leren en bijstellen.',
    category: 'core',
    profileIds: ['type6']
  },
  {
    id: 'obs-sustains-challenging-task',
    domain: 'self-direction',
    domainLabel: 'Zelfsturing en ambitie',
    prompt:
      'De leerling werkt langere tijd zelfstandig door aan een uitdagende taak.',
    category: 'core',
    profileIds: ['type6']
  },

  {
    id: 'ctx-peer-match-helps',
    domain: 'school-context',
    domainLabel: 'Contextsignalen in school',
    prompt:
      'De leerling functioneert sterker wanneer hij of zij samenwerkt met cognitief of inhoudelijk passende peers.',
    category: 'context',
    profileIds: ['type3', 'type6']
  },
  {
    id: 'ctx-oral-written-gap',
    domain: 'school-context',
    domainLabel: 'Contextsignalen in school',
    prompt:
      'De leerling laat in gesprek of mondeling meer zien dan in schriftelijk werk.',
    category: 'context',
    profileIds: ['type5']
  }
];

export default observationItems;