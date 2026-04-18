export const OBSERVATION_SCORE_OPTIONS = [
  { value: 0, label: 'Niet waargenomen' },
  { value: 1, label: 'Licht zichtbaar' },
  { value: 2, label: 'Duidelijk zichtbaar' },
  { value: 3, label: 'Sterk zichtbaar' }
];

const observationItems = [
  // =========================================================
  // Taakaanpak en leerhouding
  // =========================================================
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
      'De leerling kiest niet snel uit zichzelf voor een moeilijkere taak wanneer de basis al lukt.',
    category: 'supporting',
    profileIds: ['type1']
  },
  {
    id: 'obs-careful-meets-expectations',
    domain: 'task-approach',
    domainLabel: 'Taakaanpak en leerhouding',
    prompt:
      'De leerling werkt zichtbaar zorgvuldig en volgens de gegeven verwachtingen.',
    category: 'supporting',
    profileIds: ['type1']
  },

  // =========================================================
  // Reactie op aanbod en uitdaging
  // =========================================================
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
    id: 'obs-direct-when-illogical',
    domain: 'response-challenge',
    domainLabel: 'Reactie op aanbod en uitdaging',
    prompt:
      'De leerling reageert snel en uitgesproken wanneer een taak of regel onlogisch voelt.',
    category: 'core',
    profileIds: ['type2']
  },
  {
    id: 'obs-discussion-overtakes-task',
    domain: 'response-challenge',
    domainLabel: 'Reactie op aanbod en uitdaging',
    prompt:
      'De leerling raakt gemakkelijk in discussie over de opdracht, waardoor de taak soms naar de achtergrond schuift.',
    category: 'core',
    profileIds: ['type2']
  },
  {
    id: 'obs-avoids-visible-enrichment',
    domain: 'response-challenge',
    domainLabel: 'Reactie op aanbod en uitdaging',
    prompt:
      'De leerling wijst verrijking of extra uitdaging af wanneer dit hem of haar zichtbaar onderscheidt van de groep.',
    category: 'core',
    profileIds: ['type3']
  },
  {
    id: 'obs-own-original-approach',
    domain: 'response-challenge',
    domainLabel: 'Reactie op aanbod en uitdaging',
    prompt:
      'De leerling zoekt actief naar een eigen of originele aanpak binnen de opdracht.',
    category: 'supporting',
    profileIds: ['type2']
  },

  // =========================================================
  // Sociale zichtbaarheid en afstemming
  // =========================================================
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
    id: 'obs-belonging-over-performing',
    domain: 'social-visibility',
    domainLabel: 'Sociale zichtbaarheid en afstemming',
    prompt:
      'De leerling lijkt sociaal erbij horen belangrijker te vinden dan zichtbaar sterk presteren.',
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

  // =========================================================
  // Betrokkenheid en schoolverbinding
  // =========================================================
  {
    id: 'obs-resistant-schoolwork',
    domain: 'engagement',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    prompt:
      'De leerling reageert afwerend of oppositioneel op schoolwerk.',
    category: 'supporting',
    profileIds: ['type2', 'type4']
  },
  {
    id: 'obs-incomplete-work',
    domain: 'engagement',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    prompt:
      'De leerling rondt werk regelmatig beperkt of onvolledig af.',
    category: 'core',
    profileIds: ['type4', 'type5']
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
      'De leerling werkt merkbaar beter wanneer een vertrouwde volwassene nabij of beschikbaar is.',
    category: 'supporting',
    profileIds: ['type4']
  },

  // =========================================================
  // Uitvoering en leerproduct
  // =========================================================
  {
    id: 'obs-planning-organization',
    domain: 'execution',
    domainLabel: 'Uitvoering en leerproduct',
    prompt:
      'De leerling heeft zichtbaar moeite met planning of werkorganisatie.',
    category: 'core',
    profileIds: ['type5']
  },
  {
    id: 'obs-written-less-than-thinking',
    domain: 'execution',
    domainLabel: 'Uitvoering en leerproduct',
    prompt:
      'In schriftelijke uitwerking laat de leerling minder zien dan in denken of mondeling redeneren.',
    category: 'core',
    profileIds: ['type5']
  },
  {
    id: 'obs-inconsistent-quality',
    domain: 'execution',
    domainLabel: 'Uitvoering en leerproduct',
    prompt:
      'De leerling laat wisselende kwaliteit zien tussen begrijpen, denken en uitvoeren.',
    category: 'supporting',
    profileIds: ['type5']
  },

  // =========================================================
  // Zelfsturing en ambitie
  // =========================================================
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
      'De leerling stelt zelf doelen of bewaakt zichtbaar de eigen voortgang.',
    category: 'core',
    profileIds: ['type6']
  },
  {
    id: 'obs-starts-independently',
    domain: 'self-direction',
    domainLabel: 'Zelfsturing en ambitie',
    prompt:
      'De leerling gaat zelfstandig aan het werk zonder eerst bevestiging te zoeken.',
    category: 'supporting',
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

  // =========================================================
  // Contextsignalen in school
  // Let op: deze ids moeten gelijk blijven vanwege de advieslogica.
  // =========================================================
  {
    id: 'ctx-small-group-stronger',
    domain: 'school-context',
    domainLabel: 'Contextsignalen in school',
    prompt:
      'De leerling laat in een klein groepje of in een veiligere setting meer zien dan in de hele groep.',
    category: 'context',
    profileIds: ['type3', 'type5']
  },
  {
    id: 'ctx-opens-up-with-choice',
    domain: 'school-context',
    domainLabel: 'Contextsignalen in school',
    prompt:
      'De leerling toont meer betrokkenheid wanneer er keuzevrijheid is.',
    category: 'context',
    profileIds: ['type2', 'type6']
  },
  {
    id: 'ctx-peer-match-helps',
    domain: 'school-context',
    domainLabel: 'Contextsignalen in school',
    prompt:
      'De leerling functioneert sterker bij cognitief of inhoudelijk passende peers.',
    category: 'context',
    profileIds: ['type2', 'type3', 'type6']
  },
  {
    id: 'ctx-drops-with-repetition',
    domain: 'school-context',
    domainLabel: 'Contextsignalen in school',
    prompt:
      'De leerling zakt zichtbaar weg bij herhalende of te makkelijke taken.',
    category: 'context',
    profileIds: ['type2', 'type4']
  },
  {
    id: 'ctx-oral-written-gap',
    domain: 'school-context',
    domainLabel: 'Contextsignalen in school',
    prompt:
      'De leerling laat in gesprek meer zien dan in schriftelijk werk.',
    category: 'context',
    profileIds: ['type2', 'type5']
  }
];

export default observationItems;