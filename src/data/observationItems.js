const observationItems = [
  {
    id: 'obs-confirmation',
    domain: 'taakaanpak',
    domainLabel: 'Taakaanpak en leerhouding',
    category: 'core',
    prompt: 'De leerling zoekt vaak bevestiging voordat hij begint.',
    profileIds: ['type1']
  },
  {
    id: 'obs-avoid-errors',
    domain: 'taakaanpak',
    domainLabel: 'Taakaanpak en leerhouding',
    category: 'core',
    prompt: 'De leerling vermijdt taken waarin fouten zichtbaar kunnen worden.',
    profileIds: ['type1', 'type3']
  },
  {
    id: 'obs-safe-route',
    domain: 'taakaanpak',
    domainLabel: 'Taakaanpak en leerhouding',
    category: 'supporting',
    prompt: 'De leerling kiest meestal voor de veilige standaardroute.',
    profileIds: ['type1']
  },
  {
    id: 'obs-seeks-reassurance',
    domain: 'taakaanpak',
    domainLabel: 'Taakaanpak en leerhouding',
    category: 'supporting',
    prompt: 'De leerling vraagt snel of iets goed genoeg is.',
    profileIds: ['type1']
  },
  {
    id: 'obs-avoids-harder-option',
    domain: 'taakaanpak',
    domainLabel: 'Taakaanpak en leerhouding',
    category: 'supporting',
    prompt: 'De leerling kiest niet uit zichzelf voor een moeilijkere taak als de basis lukt.',
    profileIds: ['type1']
  },
  {
    id: 'obs-questions-rules',
    domain: 'reactie-op-aanbod',
    domainLabel: 'Reactie op aanbod en uitdaging',
    category: 'core',
    prompt: 'De leerling stelt kritische vragen over regels of aanpak.',
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
    prompt: 'De leerling reageert direct of scherp als iets onlogisch of onnodig voelt.',
    profileIds: ['type2']
  },
  {
    id: 'obs-creative-discussion',
    domain: 'reactie-op-aanbod',
    domainLabel: 'Reactie op aanbod en uitdaging',
    category: 'supporting',
    prompt: 'De leerling raakt in discussie over de opdracht waardoor de taak naar de achtergrond schuift.',
    profileIds: ['type2']
  },
  {
    id: 'obs-rejects-challenge',
    domain: 'reactie-op-aanbod',
    domainLabel: 'Reactie op aanbod en uitdaging',
    category: 'supporting',
    prompt: 'De leerling wijst extra uitdaging of verrijking af.',
    profileIds: ['type3', 'type4']
  },
  {
    id: 'obs-hide-answers',
    domain: 'sociale-zichtbaarheid',
    domainLabel: 'Sociale zichtbaarheid en afstemming',
    category: 'core',
    prompt: 'De leerling wil niet opvallen met sterke antwoorden.',
    profileIds: ['type3']
  },
  {
    id: 'obs-belonging-over-performance',
    domain: 'sociale-zichtbaarheid',
    domainLabel: 'Sociale zichtbaarheid en afstemming',
    category: 'supporting',
    prompt: 'De leerling lijkt erbij horen belangrijker te vinden dan zichtbaar sterk presteren.',
    profileIds: ['type3']
  },
  {
    id: 'obs-withdrawn-average',
    domain: 'sociale-zichtbaarheid',
    domainLabel: 'Sociale zichtbaarheid en afstemming',
    category: 'supporting',
    prompt: 'De leerling houdt zich klein en oogt daardoor eerder gemiddeld dan opvallend sterk.',
    profileIds: ['type3', 'type5']
  },
  {
    id: 'obs-disengages',
    domain: 'betrokkenheid',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    category: 'core',
    prompt: 'De leerling haakt af bij herhalende of weinig betekenisvolle taken.',
    profileIds: ['type4', 'type2']
  },
  {
    id: 'obs-oppositional-school',
    domain: 'betrokkenheid',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    category: 'supporting',
    prompt: 'De leerling laat oppositioneel of afwerend gedrag zien richting schoolwerk.',
    profileIds: ['type4']
  },
  {
    id: 'obs-low-output',
    domain: 'betrokkenheid',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    category: 'supporting',
    prompt: 'De leerling levert regelmatig weinig of onvolledig werk in.',
    profileIds: ['type4', 'type5']
  },
  {
    id: 'obs-relation-entry',
    domain: 'betrokkenheid',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    category: 'supporting',
    prompt: 'De leerling werkt merkbaar beter als een vertrouwde volwassene dichtbij blijft.',
    profileIds: ['type4']
  },
  {
    id: 'obs-little-purpose',
    domain: 'betrokkenheid',
    domainLabel: 'Betrokkenheid en schoolverbinding',
    category: 'supporting',
    prompt: 'De leerling toont weinig inzet zolang de taak voor hem weinig betekenis heeft.',
    profileIds: ['type4']
  },
  {
    id: 'obs-uneven-output',
    domain: 'uitvoering',
    domainLabel: 'Uitvoering en leerproduct',
    category: 'core',
    prompt: 'De leerling laat wisselende kwaliteit zien tussen denken en uitvoeren.',
    profileIds: ['type5']
  },
  {
    id: 'obs-organization',
    domain: 'uitvoering',
    domainLabel: 'Uitvoering en leerproduct',
    category: 'core',
    prompt: 'De leerling loopt vast op planning of werkorganisatie.',
    profileIds: ['type5']
  },
  {
    id: 'obs-writing-blocks-thinking',
    domain: 'uitvoering',
    domainLabel: 'Uitvoering en leerproduct',
    category: 'supporting',
    prompt: 'Schriftelijke uitwerking belemmert zichtbaar wat de leerling inhoudelijk kan laten zien.',
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
    prompt: 'De leerling gebruikt fouten als onderdeel van leren in plaats van ze te vermijden.',
    profileIds: ['type6']
  },
  {
    id: 'obs-independent-stamina',
    domain: 'zelfsturing',
    domainLabel: 'Zelfsturing en ambitie',
    category: 'core',
    prompt: 'De leerling werkt langere tijd zelfstandig door aan een uitdagende taak.',
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
    prompt: 'De leerling functioneert sterker bij cognitief of inhoudelijk passende peers.',
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