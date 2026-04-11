const observationItems = [
  {
    id: 'obs-confirmation',
    domain: 'taakaanpak',
    domainLabel: 'Taakaanpak en leerhouding',
    category: 'core',
    prompt: 'De leerling zoekt vaak bevestiging voordat hij of zij begint.',
    profileIds: ['type1']
  },
  {
    id: 'obs-avoid-errors',
    domain: 'taakaanpak',
    domainLabel: 'Taakaanpak en leerhouding',
    category: 'core',
    prompt:
      'De leerling kiest liever taken met een voorspelbare uitkomst dan taken met een grotere kans op fouten.',
    profileIds: ['type1', 'type3']
  },
  {
    id: 'obs-safe-route',
    domain: 'taakaanpak',
    domainLabel: 'Taakaanpak en leerhouding',
    category: 'supporting',
    prompt: 'De leerling kiest meestal voor een veilige en bekende aanpak.',
    profileIds: ['type1']
  },
  {
    id: 'obs-seeks-reassurance',
    domain: 'taakaanpak',
    domainLabel: 'Taakaanpak en leerhouding',
    category: 'supporting',
    prompt:
      'De leerling zoekt al vroeg bevestiging over de kwaliteit of aanpak van het werk.',
    profileIds: ['type1']
  },
  {
    id: 'obs-avoids-harder-option',
    domain: 'taakaanpak',
    domainLabel: 'Taakaanpak en leerhouding',
    category: 'supporting',
    prompt:
      'De leerling kiest niet snel uit zichzelf voor een moeilijkere taak wanneer de basis al lukt.',
    profileIds: ['type1']
  },
  {
    id: 'obs-works-carefully-to-expectation',
    domain: 'taakaanpak',
    domainLabel: 'Taakaanpak en leerhouding',
    category: 'supporting',
    prompt:
      'De leerling werkt zichtbaar zorgvuldig en volgens de gegeven verwachtingen.',
    profileIds: ['type1']
  },
  {
    id: 'obs-questions-rules',
    domain: 'reactie-op-aanbod',
    domainLabel: 'Reactie op aanbod en uitdaging',
    category: 'core',
    prompt: 'De leerling stelt kritische vragen over regels, werkwijzen of aanpak.',
    profileIds: ['type2']
  },
  {
    id: 'obs-original-ideas',
    domain: 'reactie-op-aanbod',
    domainLabel: 'Reactie op aanbod en uitdaging',
    category: 'supporting',
    prompt: 'De leerling komt met onverwachte of originele ideeën.',
    profileIds: ['type2', 'type6', 'type5']
  },
  {
    id: 'obs-impulsive-response',
    domain: 'reactie-op-aanbod',
    domainLabel: 'Reactie op aanbod en uitdaging',
    category: 'supporting',
    prompt:
      'De leerling reageert snel en uitgesproken wanneer een taak of regel onlogisch voelt.',
    profileIds: ['type2']
  },
  {
    id: 'obs-creative-discussion',
    domain: 'reactie-op-aanbod',
    domainLabel: 'Reactie op aanbod en uitdaging',
    category: 'supporting',
    prompt:
      'De leerling raakt gemakkelijk in discussie over de opdracht, waardoor de taak soms naar de achtergrond schuift.',
    profileIds: ['type2']
  },
  {
    id: 'obs-rejects-challenge',
    domain: 'reactie-op-aanbod',
    domainLabel: 'Reactie op aanbod en uitdaging',
    category: 'supporting',
    prompt: 'De leerling gaat extra uitdaging of verrijking niet gemakkelijk aan.',
    profileIds: ['type3', 'type4']
  },
  {
    id: 'obs-constructive-original-approach',
    domain: 'reactie-op-aanbod',
    domainLabel: 'Reactie op aanbod en uitdaging',
    category: 'supporting',
    prompt:
      'De leerling zoekt actief naar een eigen of originele aanpak binnen de opdracht.',
    profileIds: ['type2']
  },
  {
    id: 'obs-hide-answers',
    domain: 'sociale-zichtbaarheid',
    domainLabel: 'Sociale zichtbaarheid en afstemming',
    category: 'core',
    prompt: 'De leerling houdt sterke antwoorden of inzichten geregeld op de achtergrond.',
    profileIds: ['type3']
  },
  {
    id: 'obs-belonging-over-performance',
    domain: 'sociale-zichtbaarheid',
    domainLabel: 'Sociale zichtbaarheid en afstemming',
    category: 'supporting',
    prompt:
      'De leerling lijkt sociaal erbij horen belangrijker te vinden dan zichtbaar sterk presteren.',
    profileIds: ['type3']
  },
  {
    id: 'obs-withdrawn-average',
    domain: 'sociale-zichtbaarheid',
    domainLabel: 'Sociale zichtbaarheid en afstemming',
    category: 'supporting',
    prompt:
      'De leerling toont de sterke kant terughoudend, waardoor het functioneren minder opvallend overkomt.',
    profileIds: ['type3', 'type5']
  },
  {
    id: 'obs-shows-strength-when-safe',
    domain: 'sociale-zichtbaarheid',
    domainLabel: 'Sociale zichtbaarheid en afstemming',
    category: 'supporting',
    prompt:
      'De leerling laat sterke ideeën of antwoorden wel zien wanneer de setting veilig voelt.',
    profileIds: ['type3']
  },
  {
    id: 'obs-disengages',
    domain: 'betrokkenheid',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    category: 'core',
    prompt:
      'De betrokkenheid van de leerling neemt duidelijk af bij herhalende of weinig betekenisvolle taken.',
    profileIds: ['type4', 'type2']
  },
  {
    id: 'obs-oppositional-school',
    domain: 'betrokkenheid',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    category: 'supporting',
    prompt: 'De leerling reageert afwerend of oppositioneel op schoolwerk.',
    profileIds: ['type4']
  },
  {
    id: 'obs-low-output',
    domain: 'betrokkenheid',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    category: 'supporting',
    prompt: 'De leerling rondt werk regelmatig beperkt of onvolledig af.',
    profileIds: ['type4', 'type5']
  },
  {
    id: 'obs-relation-entry',
    domain: 'betrokkenheid',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    category: 'supporting',
    prompt:
      'De leerling werkt merkbaar beter wanneer een vertrouwde volwassene nabij of beschikbaar is.',
    profileIds: ['type4']
  },
  {
    id: 'obs-little-purpose',
    domain: 'betrokkenheid',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    category: 'supporting',
    prompt:
      'De leerling toont weinig inzet zolang de taak voor hem of haar weinig betekenis heeft.',
    profileIds: ['type4']
  },
  {
    id: 'obs-reengages-with-meaning',
    domain: 'betrokkenheid',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    category: 'supporting',
    prompt:
      'De leerling haakt merkbaar aan wanneer een taak betekenisvol of passend uitdagend is.',
    profileIds: ['type4']
  },
  {
    id: 'obs-uneven-output',
    domain: 'uitvoering',
    domainLabel: 'Uitvoering en leerproduct',
    category: 'core',
    prompt:
      'De leerling laat wisselende kwaliteit zien tussen denken, begrijpen en uitvoeren.',
    profileIds: ['type5']
  },
  {
    id: 'obs-organization',
    domain: 'uitvoering',
    domainLabel: 'Uitvoering en leerproduct',
    category: 'core',
    prompt: 'De leerling heeft zichtbaar moeite met planning of werkorganisatie.',
    profileIds: ['type5']
  },
  {
    id: 'obs-writing-blocks-thinking',
    domain: 'uitvoering',
    domainLabel: 'Uitvoering en leerproduct',
    category: 'supporting',
    prompt:
      'In schriftelijke uitwerking laat de leerling minder zien dan in denken of mondeling redeneren.',
    profileIds: ['type5']
  },
  {
    id: 'obs-verbal-insight-outpaces-output',
    domain: 'uitvoering',
    domainLabel: 'Uitvoering en leerproduct',
    category: 'supporting',
    prompt:
      'De leerling laat in gesprek of mondeling redeneren sterke inhoud zien die in het werk niet altijd zichtbaar wordt.',
    profileIds: ['type5']
  },
  {
    id: 'obs-self-directed',
    domain: 'zelfsturing',
    domainLabel: 'Zelfsturing en ambitie',
    category: 'core',
    prompt: 'De leerling zoekt uit zichzelf extra uitdaging.',
    profileIds: ['type6']
  },
  {
    id: 'obs-goal-setting',
    domain: 'zelfsturing',
    domainLabel: 'Zelfsturing en ambitie',
    category: 'supporting',
    prompt: 'De leerling stelt zelf doelen of bewaakt zichtbaar de eigen voortgang.',
    profileIds: ['type6']
  },
  {
    id: 'obs-learning-from-errors',
    domain: 'zelfsturing',
    domainLabel: 'Zelfsturing en ambitie',
    category: 'supporting',
    prompt:
      'De leerling gebruikt fouten zichtbaar als onderdeel van leren en bijstellen.',
    profileIds: ['type6']
  },
  {
    id: 'obs-independent-stamina',
    domain: 'zelfsturing',
    domainLabel: 'Zelfsturing en ambitie',
    category: 'core',
    prompt:
      'De leerling werkt langere tijd zelfstandig door aan een uitdagende taak.',
    profileIds: ['type6']
  },
  {
    id: 'ctx-oral-written-gap',
    domain: 'contextsignalen',
    domainLabel: 'Contextsignalen in school',
    category: 'context',
    prompt: 'De leerling laat in gesprek meer zien dan in schriftelijk werk.',
    profileIds: ['type5', 'type4']
  },
  {
    id: 'ctx-small-group-stronger',
    domain: 'contextsignalen',
    domainLabel: 'Contextsignalen in school',
    category: 'context',
    prompt: 'De leerling laat in een klein groepje meer zien dan klassikaal.',
    profileIds: ['type3', 'type5']
  },
  {
    id: 'ctx-opens-up-with-choice',
    domain: 'contextsignalen',
    domainLabel: 'Contextsignalen in school',
    category: 'context',
    prompt: 'De leerling toont meer betrokkenheid wanneer er keuzevrijheid is.',
    profileIds: ['type2', 'type6', 'type1']
  },
  {
    id: 'ctx-drops-with-repetition',
    domain: 'contextsignalen',
    domainLabel: 'Contextsignalen in school',
    category: 'context',
    prompt: 'De leerling zakt zichtbaar weg bij herhalende of te makkelijke taken.',
    profileIds: ['type1', 'type2', 'type4']
  },
  {
    id: 'ctx-peer-match-helps',
    domain: 'contextsignalen',
    domainLabel: 'Contextsignalen in school',
    category: 'context',
    prompt:
      'De leerling functioneert sterker bij cognitief of inhoudelijk passende peers.',
    profileIds: ['type1', 'type2', 'type3', 'type6']
  }
];

export const OBSERVATION_SCORE_OPTIONS = [
  { value: 0, label: '0 = niet waargenomen' },
  { value: 1, label: '1 = licht zichtbaar' },
  { value: 2, label: '2 = duidelijk zichtbaar' },
  { value: 3, label: '3 = sterk zichtbaar' }
];

export default observationItems;