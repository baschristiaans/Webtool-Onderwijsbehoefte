import React, { useEffect, useMemo, useState } from 'react';
import profiles from './data/profiles';
import observationItems, {
  OBSERVATION_SCORE_OPTIONS
} from './data/observationItems';
import {
  analyzeProfileBase,
  analyzeRichInterpretation,
  buildProfileScoreOverview,
  normalizeText
} from './lib/analysis';
import buildPersonalizedAdvice from './lib/buildPersonalizedAdvice';

const TEST_OPTIONS = [
  { value: 'unknown', label: 'Niet ingevuld' },
  { value: 'veryStrong', label: 'Zeer sterk' },
  { value: 'strong', label: 'Sterk' },
  { value: 'average', label: 'Gemiddeld' },
  { value: 'vulnerable', label: 'Kwetsbaar' },
  { value: 'weak', label: 'Zwak' }
];

const ZOOV_OPTIONS = [
  { value: 'unknown', label: 'Niet ingevuld' },
  { value: 'yes', label: 'Ja, ZOOV+ geeft een startsignaal' },
  { value: 'no', label: 'Nee, geen ZOOV+ startsignaal' }
];

const CHALLENGE_RESPONSE_OPTIONS = [
  { value: 'unknown', label: 'Niet ingevuld' },
  {
    value: 'De leerling laat meer betrokkenheid zien wanneer het werk compact en echt uitdagend is.',
    label: 'Meer betrokken bij compacte, uitdagende taken'
  },
  {
    value: 'De leerling laat meer weerstand zien wanneer taken herhalend of te makkelijk zijn.',
    label: 'Meer weerstand bij herhaling of makkelijke taken'
  },
  {
    value: 'De leerling laat juist meer stabiliteit zien wanneer taken voorspelbaar en duidelijk begrensd zijn.',
    label: 'Stabieler bij voorspelbare, begrensde taken'
  }
];

const SETTING_OPTIONS = [
  { value: 'unknown', label: 'Niet ingevuld' },
  {
    value: 'De leerling laat in een kleiner of veiliger verband meer zien dan in de hele groep.',
    label: 'Laat in klein of veilig verband meer zien'
  },
  {
    value: 'De leerling laat juist in verrijking of bij sterke peers meer initiatief en inhoud zien.',
    label: 'Laat bij verrijking of sterke peers meer zien'
  },
  {
    value: 'Het zichtbare functioneren verschilt sterk per les, taak of setting.',
    label: 'Functioneren verschilt sterk per setting'
  }
];

const EXPRESSION_OPTIONS = [
  { value: 'unknown', label: 'Niet ingevuld' },
  {
    value: 'oral-stronger',
    label: 'Mondeling duidelijk sterker dan schriftelijk'
  },
  {
    value: 'written-stronger',
    label: 'Schriftelijk duidelijk sterker dan mondeling'
  },
  {
    value: 'mixed',
    label: 'Verschil wisselt per taak'
  }
];

const HOME_PATTERN_OPTIONS = [
  { value: 'unknown', label: 'Niet ingevuld' },
  {
    value: 'confirm',
    label: 'Thuissituatie lijkt het schoolbeeld grotendeels te bevestigen'
  },
  {
    value: 'contrast',
    label: 'Thuissituatie contrasteert met het schoolbeeld'
  }
];

const TEST_FIELD_LABELS = {
  dmt: 'DMT',
  avi: 'AVI',
  begrijpendLezen: 'Begrijpend lezen',
  rekenen: 'Rekenen',
  spelling: 'Spelling'
};

const TEST_EXPORT_LABELS = Object.fromEntries(
  TEST_OPTIONS.map((option) => [option.value, option.label])
);

const HOME_PATTERN_LABELS = {
  unknown: 'Niet ingevuld',
  confirm: 'Thuissituatie lijkt het schoolbeeld grotendeels te bevestigen',
  contrast: 'Thuissituatie contrasteert met het schoolbeeld'
};

const STUDENT_INITIAL = {
  name: '',
  group: '',
  observer: '',
  date: ''
};

const ZOOV_INITIAL = {
  status: 'unknown',
  note: ''
};

const CONTEXT_INITIAL = {
  challengeResponse: 'unknown',
  settingDifference: 'unknown',
  expressionDifference: 'unknown',
  note: ''
};

const HOME_INITIAL = {
  pattern: 'unknown',
  summary: ''
};

const TESTS_INITIAL = {
  dmt: 'unknown',
  avi: 'unknown',
  begrijpendLezen: 'unknown',
  rekenen: 'unknown',
  spelling: 'unknown'
};

const NOTES_INITIAL = '';

const EMPTY_OBSERVATIONS = Object.fromEntries(
  observationItems.map((item) => [item.id, 0])
);

function toDisplay(text) {
  return normalizeText(text);
}

function buildProfilesById() {
  return Object.fromEntries(profiles.map((profile) => [profile.id, profile]));
}

function groupObservationItems() {
  const groups = [];

  observationItems.forEach((item) => {
    const existingGroup = groups.find((group) => group.domain === item.domain);
    if (existingGroup) {
      existingGroup.items.push(item);
      return;
    }

    groups.push({
      domain: item.domain,
      label: item.domainLabel,
      items: [item]
    });
  });

  return groups;
}

function formatProfileHeading(profile) {
  return `${toDisplay(profile.shortTitle)} - ${toDisplay(profile.title)}`;
}

function formatStrength(strength) {
  if (strength === 3) return 'sterk zichtbaar';
  if (strength === 2) return 'duidelijk zichtbaar';
  return 'licht zichtbaar';
}

function buildExportText({
  student,
  zoovSignal,
  contextInput,
  homeInput,
  testScores,
  profileBase,
  interpretation,
  advice,
  scoreOverview,
  profilesById,
  notes
}) {
  const bestProfile = profilesById[profileBase.topProfileId];
  const overlapProfile = profileBase.overlapProfileId
    ? profilesById[profileBase.overlapProfileId]
    : null;

  const lines = [
    'Webtool profielduiding hoogbegaafdheid',
    '',
    'Leerlinggegevens',
    `Naam: ${student.name || '-'}`,
    `Groep: ${student.group || '-'}`,
    `Ingevuld door: ${student.observer || '-'}`,
    `Datum: ${student.date || '-'}`,
    '',
    'ZOOV+ startsignaal',
    `Status: ${zoovSignal.status}`,
    `Notitie: ${zoovSignal.note || '-'}`,
    '',
    'Context',
    `Reactie op uitdaging: ${contextInput.challengeResponse}`,
    `Verschillen tussen settings: ${contextInput.settingDifference}`,
    `Mondeling / schriftelijk: ${contextInput.expressionDifference}`,
    `Schoolcontext notitie: ${contextInput.note || '-'}`,
    '',
    'Thuissituatie',
    `Patroon: ${HOME_PATTERN_LABELS[homeInput.pattern] || homeInput.pattern}`,
    `Samenvatting: ${homeInput.summary || '-'}`,
    '',
    'Toetsgegevens',
    ...Object.entries(testScores).map(
      ([key, value]) => `${TEST_FIELD_LABELS[key]}: ${TEST_EXPORT_LABELS[value] || value}`
    ),
    '',
    'Profieluitkomst',
    `Voorlopig best passend profiel: ${formatProfileHeading(bestProfile)}`,
    `Profieloverlap: ${overlapProfile ? formatProfileHeading(overlapProfile) : '-'}`,
    `Profielduidelijkheid: ${profileBase.profileDirectionLabel}`,
    '',
    'Score-overzicht per profiel',
    ...scoreOverview.map(
      (item) => `${item.shortTitle} - ${item.title}: ${item.score}`
    ),
    '',
    'Prestatiebeeld',
    interpretation.performanceSummary,
    '',
    'Discrepantiebeeld',
    ...(interpretation.discrepancySignals.length > 0
      ? interpretation.discrepancySignals
      : ['Geen expliciete discrepantiesignalen op basis van de huidige invoer.']),
    '',
    'Contextsignalen',
    ...(profileBase.contextSignals.length > 0
      ? profileBase.contextSignals.map(
          (signal) => `${toDisplay(signal.prompt)} (${formatStrength(signal.strength)})`
        )
      : ['Geen contextsignalen ingevuld.']),
    '',
    'Sterkst scorende observaties',
    ...(profileBase.strongestObservations.length > 0
      ? profileBase.strongestObservations.map(
          (item) =>
            `${toDisplay(item.prompt)} (${item.strengthLabel}; bijdrage ${item.scoreContribution})`
        )
      : ['Nog geen observaties die de profielrichting dragen.']),
    '',
    'Werkhypothese onderwijsbehoeften',
    advice.workHypothesis,
    advice.shortInterpretation,
    '',
    'Geprioriteerde onderwijsbehoeften',
    ...advice.prioritizedNeeds.flatMap((item) => [
      `${item.area}`,
      `Onderwijsbehoefte: ${item.need}`,
      `Advies: ${item.advice}`,
      `Waarom nu: ${item.reason}`
    ]),
    '',
    'Concrete leerkrachtadviezen',
    ...advice.teacherActions.map((item) => `${item.area}: ${item.action}`),
    '',
    'Vervolgstappen',
    ...advice.followUpSteps,
    '',
    'Notities',
    notes || '-',
    '',
    'Kanttekening',
    'Dit is een werkhypothese.',
    'Dit is geen diagnose.',
    'Context, thuissituatie, ZOOV+ en toetsgegevens tellen niet mee in de ruwe profielscore.'
  ];

  return lines.join('\n');
}

function App() {
  const profilesById = useMemo(buildProfilesById, []);
  const observationGroups = useMemo(groupObservationItems, []);

  const [student, setStudent] = useState(STUDENT_INITIAL);
  const [zoovSignal, setZoovSignal] = useState(ZOOV_INITIAL);
  const [contextInput, setContextInput] = useState(CONTEXT_INITIAL);
  const [homeInput, setHomeInput] = useState(HOME_INITIAL);
  const [testScores, setTestScores] = useState(TESTS_INITIAL);
  const [observationAnswers, setObservationAnswers] = useState(EMPTY_OBSERVATIONS);
  const [notes, setNotes] = useState(NOTES_INITIAL);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const answeredObservationCount = useMemo(
    () => Object.values(observationAnswers).filter((value) => value > 0).length,
    [observationAnswers]
  );

  const profileBase = useMemo(
    () => analyzeProfileBase(observationAnswers),
    [observationAnswers]
  );

  const interpretation = useMemo(
    () =>
      analyzeRichInterpretation({
        profileBase,
        zoovSignal,
        contextInput,
        homeInput,
        testScores,
        notes
      }),
    [profileBase, zoovSignal, contextInput, homeInput, testScores, notes]
  );

  const scoreOverview = useMemo(
    () => buildProfileScoreOverview(profileBase, profilesById),
    [profileBase, profilesById]
  );

  const advice = useMemo(
    () =>
      buildPersonalizedAdvice({
        profileBase,
        interpretation,
        profilesById,
        contextInput,
        homeInput,
        zoovSignal
      }),
    [profileBase, interpretation, profilesById, contextInput, homeInput, zoovSignal]
  );

  const bestProfile = profilesById[profileBase.topProfileId];
  const overlapProfile = profileBase.overlapProfileId
    ? profilesById[profileBase.overlapProfileId]
    : null;

  useEffect(() => {
    if (!isProfileModalOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsProfileModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isProfileModalOpen]);

  const handleStudentChange = (field, value) => {
    setStudent((current) => ({ ...current, [field]: value }));
  };

  const handleZoovChange = (field, value) => {
    setZoovSignal((current) => ({ ...current, [field]: value }));
  };

  const handleContextChange = (field, value) => {
    setContextInput((current) => ({ ...current, [field]: value }));
  };

  const handleHomeChange = (field, value) => {
    setHomeInput((current) => ({ ...current, [field]: value }));
  };

  const handleTestChange = (field, value) => {
    setTestScores((current) => ({ ...current, [field]: value }));
  };

  const handleObservationChange = (itemId, value) => {
    setObservationAnswers((current) => ({
      ...current,
      [itemId]: Number(value)
    }));
  };

  const handleReset = () => {
    setStudent(STUDENT_INITIAL);
    setZoovSignal(ZOOV_INITIAL);
    setContextInput(CONTEXT_INITIAL);
    setHomeInput(HOME_INITIAL);
    setTestScores(TESTS_INITIAL);
    setObservationAnswers(EMPTY_OBSERVATIONS);
    setNotes(NOTES_INITIAL);
    setIsProfileModalOpen(false);
  };

  const handleExport = () => {
    const exportText = buildExportText({
      student,
      zoovSignal,
      contextInput,
      homeInput,
      testScores,
      profileBase,
      interpretation,
      advice,
      scoreOverview,
      profilesById,
      notes
    });
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profielduiding-${student.name || 'leerling'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-shell">
<header className="hero">
  <div className="container hero-layout single-hero">
    <div className="hero-main">
      <p className="eyebrow">Webtool profielduiding</p>
      <h1>HB Profiel & Onderwijsbehoefte</h1>
      <p className="intro">
        Deze tool ondersteunt leerkrachten bij het vormen van een
        werkhypothese over profielrichting, overlap, prestatiebeeld en
        onderwijsbehoeften. De ruwe profielscore komt alleen voort uit
        observeerbaar functioneren in de schoolcontext.
      </p>
      <div className="meta-pills">
        <span className="pill">
          {answeredObservationCount} observaties ingevuld
        </span>
        <span className="pill">{profileBase.profileDirectionLabel}</span>
      </div>
    </div>
  </div>
</header>

      <main className="container app-layout">
        <section className="input-column">
          <article className="panel">
            <div className="panel-head">
              <div>
                <p className="section-label">Leerlinggegevens</p>
                <h2>Basisgegevens</h2>
              </div>
            </div>
            <div className="field-grid two-columns">
              <label className="field">
                <span>Naam leerling</span>
                <input
                  type="text"
                  value={student.name}
                  onChange={(event) =>
                    handleStudentChange('name', event.target.value)
                  }
                />
              </label>
              <label className="field">
                <span>Groep</span>
                <input
                  type="text"
                  value={student.group}
                  onChange={(event) =>
                    handleStudentChange('group', event.target.value)
                  }
                />
              </label>
              <label className="field">
                <span>Ingevuld door</span>
                <input
                  type="text"
                  value={student.observer}
                  onChange={(event) =>
                    handleStudentChange('observer', event.target.value)
                  }
                />
              </label>
              <label className="field">
                <span>Datum</span>
                <input
                  type="date"
                  value={student.date}
                  onChange={(event) =>
                    handleStudentChange('date', event.target.value)
                  }
                />
              </label>
            </div>
          </article>

          <article className="panel">
            <p className="section-label">ZOOV+ startsignaal</p>
            <h2>Startsituatie</h2>
            <div className="field-grid">
              <label className="field">
                <span>ZOOV+</span>
                <select
                  value={zoovSignal.status}
                  onChange={(event) =>
                    handleZoovChange('status', event.target.value)
                  }
                >
                  {ZOOV_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Korte notitie</span>
                <textarea
                  rows="3"
                  value={zoovSignal.note}
                  onChange={(event) =>
                    handleZoovChange('note', event.target.value)
                  }
                />
              </label>
            </div>
          </article>

          <article className="panel">
            <p className="section-label">Context</p>
            <h2>Rijke interpretatielaag</h2>
            <div className="field-grid">
              <label className="field">
                <span>Reactie op uitdaging</span>
                <select
                  value={contextInput.challengeResponse}
                  onChange={(event) =>
                    handleContextChange('challengeResponse', event.target.value)
                  }
                >
                  {CHALLENGE_RESPONSE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Verschillen tussen settings</span>
                <select
                  value={contextInput.settingDifference}
                  onChange={(event) =>
                    handleContextChange('settingDifference', event.target.value)
                  }
                >
                  {SETTING_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Mondeling en schriftelijk functioneren</span>
                <select
                  value={contextInput.expressionDifference}
                  onChange={(event) =>
                    handleContextChange('expressionDifference', event.target.value)
                  }
                >
                  {EXPRESSION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Aanvullende schoolcontext</span>
                <textarea
                  rows="3"
                  value={contextInput.note}
                  onChange={(event) =>
                    handleContextChange('note', event.target.value)
                  }
                />
              </label>
            </div>
          </article>

          <article className="panel">
            <p className="section-label">Thuissituatie</p>
            <h2>Context voor verdere duiding</h2>
            <div className="field-grid">
              <label className="field">
                <span>Verhouding tot schoolbeeld</span>
                <select
                  value={homeInput.pattern}
                  onChange={(event) =>
                    handleHomeChange('pattern', event.target.value)
                  }
                >
                  {HOME_PATTERN_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Korte samenvatting thuissituatie</span>
                <textarea
                  rows="3"
                  value={homeInput.summary}
                  onChange={(event) =>
                    handleHomeChange('summary', event.target.value)
                  }
                />
              </label>
            </div>
          </article>

          <article className="panel">
            <p className="section-label">Toetsgegevens</p>
            <h2>Prestatiebeeld en discrepantie</h2>
            <div className="field-grid two-columns">
              {Object.entries(TEST_FIELD_LABELS).map(([key, label]) => (
                <label className="field" key={key}>
                  <span>{label}</span>
                  <select
                    value={testScores[key]}
                    onChange={(event) =>
                      handleTestChange(key, event.target.value)
                    }
                  >
                    {TEST_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </article>

          <article className="panel">
            <p className="section-label">Observatieblokken</p>
            <h2>Stabiele profielbasis</h2>
            <p className="helper-text">
              Alleen deze observaties tellen mee in de ruwe profielscore.
              Contextsignalen uit het laatste blok worden wel opgeslagen, maar
              niet meegeteld in de profielsom.
            </p>

            <div className="observation-groups">
              {observationGroups.map((group) => (
                <section className="observation-group" key={group.domain}>
                  <div className="observation-group-head">
                    <h3>{toDisplay(group.label)}</h3>
                    <span className="group-note">
                      {group.items[0].category === 'context'
                        ? 'Contextsignalen'
                        : 'Scorebepalende observaties'}
                    </span>
                  </div>

                  <div className="observation-list">
                    {group.items.map((item) => (
                      <article className="observation-card" key={item.id}>
                        <div className="observation-card-head">
                          <p>{toDisplay(item.prompt)}</p>
                          <span className={`chip chip-${item.category}`}>
                            {item.category === 'core'
                              ? 'Kernobservatie'
                              : item.category === 'supporting'
                                ? 'Ondersteunend'
                                : 'Contextsignaal'}
                          </span>
                        </div>
                        <div className="option-row">
                          {OBSERVATION_SCORE_OPTIONS.map((option) => (
                            <label className="option-card" key={option.value}>
                              <input
                                type="radio"
                                name={item.id}
                                value={option.value}
                                checked={observationAnswers[item.id] === option.value}
                                onChange={(event) =>
                                  handleObservationChange(
                                    item.id,
                                    event.target.value
                                  )
                                }
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>

          <article className="panel">
            <p className="section-label">Notities</p>
            <h2>Vrije observatienotities</h2>
            <label className="field">
              <span>Aanvullende notities</span>
              <textarea
                rows="5"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </label>
          </article>

          <article className="panel action-panel">
            <button type="button" className="ghost-button" onClick={handleReset}>
              Reset alles
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={handleExport}
            >
              Exporteer werkhypothese
            </button>
          </article>
        </section>

        <aside className="output-column">
          <article className="panel result-panel">
            <div className="panel-head">
              <div>
                <p className="section-label">Voorlopig best passend profiel</p>
                <h2>{formatProfileHeading(bestProfile)}</h2>
              </div>
              <button
                type="button"
                className="info-button"
                onClick={() => setIsProfileModalOpen(true)}
                aria-label="Open profieluitleg"
              >
                ?
              </button>
            </div>
            <p className="lead-text">{toDisplay(bestProfile.interpretation)}</p>
            <div className="meta-pills">
              <span className="pill">{profileBase.profileDirectionLabel}</span>
              {overlapProfile && (
                <span className="pill subtle-pill">
                  Overlap met {toDisplay(overlapProfile.shortTitle)}
                </span>
              )}
            </div>
          </article>

          <article className="panel">
            <p className="section-label">Analyse / interpretatie</p>
            <h3>Werkhypothese</h3>
            <p>{advice.workHypothesis}</p>
            <p>{advice.shortInterpretation}</p>
          </article>

          <article className="panel">
            <p className="section-label">Score-overzicht per profiel</p>
            <div className="score-list">
              {scoreOverview.map((item) => (
                <div className="score-row" key={item.profileId}>
                  <div>
                    <strong>{item.shortTitle}</strong>
                    <span>{item.title}</span>
                  </div>
                  <strong>{item.score}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <p className="section-label">Prestatiebeeld</p>
            <h3>{interpretation.performanceLabel}</h3>
            <p>{interpretation.performanceSummary}</p>
          </article>

          <article className="panel">
            <p className="section-label">Contextsignalen</p>
            {profileBase.contextSignals.length > 0 ||
            interpretation.interpretationSignals.length > 0 ? (
              <ul className="list">
                {interpretation.interpretationSignals.map((signal) => (
                  <li key={signal.id}>{toDisplay(signal.prompt)}</li>
                ))}
              </ul>
            ) : (
              <p className="helper-text">
                Nog geen contextsignalen of aanvullende interpretatiesignalen
                ingevuld.
              </p>
            )}
          </article>

          <article className="panel">
            <p className="section-label">Discrepantiesignalen uit toetsgegevens</p>
            {interpretation.discrepancySignals.length > 0 ? (
              <ul className="list">
                {interpretation.discrepancySignals.map((signal) => (
                  <li key={signal}>{toDisplay(signal)}</li>
                ))}
              </ul>
            ) : (
              <p className="helper-text">
                Op basis van de huidige invoer zijn er nog geen expliciete
                discrepantiesignalen zichtbaar.
              </p>
            )}
          </article>

          <article className="panel">
            <p className="section-label">Werkhypothese onderwijsbehoeften</p>
            <div className="advice-list">
              {advice.prioritizedNeeds.map((item) => (
                <article className="advice-card" key={item.area}>
                  <span className="area-label">{item.area}</span>
                  <p>
                    <strong>Onderwijsbehoefte:</strong> {item.need}
                  </p>
                  <p>
                    <strong>Concreet advies:</strong> {item.advice}
                  </p>
                  <p className="helper-text">{item.reason}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="panel">
            <p className="section-label">Vervolgstap / nadere analyse</p>
            <ul className="list">
              {advice.followUpSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
              {advice.homeAttention && (
                <li>
                  Thuissituatie als aandachtspunt: {advice.homeAttention}
                </li>
              )}
            </ul>
          </article>

          <article className="panel caution-panel">
            <p className="section-label">Belangrijke kanttekening</p>
            <p>{advice.caution}</p>
          </article>
        </aside>
      </main>

      {isProfileModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsProfileModalOpen(false)}
        >
          <div
            className="modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-head">
              <div>
                <p className="section-label">Profieluitleg</p>
                <h2>{formatProfileHeading(bestProfile)}</h2>
                <p className="helper-text">
                  Dit is een profielbeschrijving en interpretatiekader op basis
                  van Matrix 1. Het is geen diagnose.
                </p>
              </div>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setIsProfileModalOpen(false)}
              >
                Sluiten
              </button>
            </div>

            <div className="modal-sections">
              <div className="modal-section">
                <strong>Gevoelens en houding</strong>
                <p>{toDisplay(bestProfile.matrix1.gevoelens)}</p>
              </div>
              <div className="modal-section">
                <strong>Gedrag</strong>
                <p>{toDisplay(bestProfile.matrix1.gedrag)}</p>
              </div>
              <div className="modal-section">
                <strong>Behoeften</strong>
                <p>{toDisplay(bestProfile.matrix1.behoeften)}</p>
              </div>
              <div className="modal-section">
                <strong>Signalen in de schoolcontext</strong>
                <p>{toDisplay(bestProfile.matrix1.signalen)}</p>
              </div>
              <div className="modal-section">
                <strong>Richting van begeleiding</strong>
                <p>{toDisplay(bestProfile.matrix1.begeleiding)}</p>
              </div>
              <div className="modal-section">
                <strong>Contextnoot</strong>
                <p>
                  Thuissituatie, toetsgegevens en verschillen tussen settings
                  kunnen dit profielbeeld versterken of nuanceren, maar tellen
                  niet mee in de ruwe profielscore.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
