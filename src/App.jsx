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
  { value: 'yes', label: 'Ja, ZOOV+ gaf aanleiding tot nadere observatie' },
  { value: 'no', label: 'Nee, geen ZOOV+ startsignaal' }
];

const SETTING_OPTIONS = [
  { value: 'unknown', label: 'Niet ingevuld' },
  {
    value: 'De leerling laat in een kleiner of veiliger verband meer zien dan in de hele groep.',
    label: 'Laat in klein of veilig verband meer zien'
  },
  {
    value: 'Het zichtbare functioneren verschilt sterk per les, taak of setting.',
    label: 'Functioneren verschilt sterk per setting'
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

const KNOWN_SUPPORT_INFO_OPTIONS = [
  { value: 'unknown', label: 'Niet ingevuld' },
  {
    value: 'yes',
    label: 'Ja, er is al bekende relevante ondersteuningsinformatie'
  },
  {
    value: 'no',
    label: 'Nee, er is geen bekende relevante ondersteuningsinformatie'
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

const ZOOV_EXPORT_LABELS = Object.fromEntries(
  ZOOV_OPTIONS.map((option) => [option.value, option.label])
);

const HOME_PATTERN_LABELS = {
  unknown: 'Niet ingevuld',
  confirm: 'Thuissituatie lijkt het schoolbeeld grotendeels te bevestigen',
  contrast: 'Thuissituatie contrasteert met het schoolbeeld'
};

const KNOWN_SUPPORT_INFO_LABELS = {
  unknown: 'Niet ingevuld',
  yes: 'Ja, er is bekende relevante ondersteuningsinformatie',
  no: 'Nee, er is geen bekende relevante ondersteuningsinformatie'
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
  settingDifference: 'unknown',
  knownSupportInfoPresence: 'unknown',
  knownSupportInfoNote: '',
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
  observationItems.map((item) => [item.id, null])
);

function toDisplay(text) {
  return normalizeText(text);
}

function buildProfilesById() {
  return Object.fromEntries(profiles.map((profile) => [profile.id, profile]));
}

function formatProfileHeading(profile) {
  return `${toDisplay(profile.shortTitle)} - ${toDisplay(profile.title)}`;
}

function formatStrength(strength) {
  if (strength === 3) return 'duidelijk en consistent zichtbaar';
  if (strength === 2) return 'regelmatig zichtbaar';
  if (strength === 1) return 'soms zichtbaar';
  return 'niet waargenomen';
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
    'Webtool profiel en onderwijsbehoefte',
    '',
    'Leerlinggegevens',
    `Naam: ${student.name || '-'}`,
    `Groep: ${student.group || '-'}`,
    `Ingevuld door: ${student.observer || '-'}`,
    `Datum: ${student.date || '-'}`,
    '',
    'Aanleiding',
    `ZOOV+: ${ZOOV_EXPORT_LABELS[zoovSignal.status] || zoovSignal.status}`,
    `Notitie: ${zoovSignal.note || '-'}`,
    '',
    'Context',
    `Verschillen tussen settings: ${contextInput.settingDifference}`,
    `Bekende ondersteuningsinformatie: ${
      KNOWN_SUPPORT_INFO_LABELS[contextInput.knownSupportInfoPresence] ||
      contextInput.knownSupportInfoPresence
    }`,
    `Dossiernotitie: ${contextInput.knownSupportInfoNote || '-'}`,
    `Schoolcontext notitie: ${contextInput.note || '-'}`,
    '',
    'Thuissituatie',
    `Patroon: ${HOME_PATTERN_LABELS[homeInput.pattern] || homeInput.pattern}`,
    `Samenvatting: ${homeInput.summary || '-'}`,
    '',
    'Toetsgegevens',
    ...Object.entries(testScores).map(
      ([key, value]) =>
        `${TEST_FIELD_LABELS[key]}: ${TEST_EXPORT_LABELS[value] || value}`
    ),
    '',
    'Profielbeeld',
    `Best passend profiel: ${formatProfileHeading(bestProfile)}`,
    `Overlap: ${overlapProfile ? formatProfileHeading(overlapProfile) : '-'}`,
    '',
    'Score-overzicht per profiel',
    ...scoreOverview.map(
      (item) =>
        `${item.shortTitle} - ${item.title}: ${item.score} (${item.status.label})`
    ),
    '',
    'Prestatiebeeld',
    interpretation.performanceSummary,
    '',
    'Discrepantiesignalen',
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
    'Werkhypothese',
    advice.workHypothesis,
    advice.shortInterpretation,
    '',
    'Geprioriteerde onderwijsbehoeften',
    ...advice.prioritizedNeeds.flatMap((item) => [
      `${item.area}${item.sharedByOverlap ? ' (extra relevant bij overlap)' : ''}`,
      `Onderwijsbehoefte: ${item.need}`,
      `Advies: ${item.advice}`,
      `Waarom: ${item.reason}`
    ]),
    '',
    'Vervolg',
    ...advice.followUpSteps,
    '',
    'Notities',
    notes || '-',
    '',
    'Kanttekening',
    advice.caution,
    'Dit is geen diagnose.',
    'Context, dossierinformatie, thuissituatie, ZOOV+ en toetsgegevens tellen niet mee in de ruwe profielscore.'
  ];

  return lines.join('\n');
}
function App() {
  const profilesById = useMemo(buildProfilesById, []);

  const [student, setStudent] = useState(STUDENT_INITIAL);
  const [zoovSignal, setZoovSignal] = useState(ZOOV_INITIAL);
  const [contextInput, setContextInput] = useState(CONTEXT_INITIAL);
  const [homeInput, setHomeInput] = useState(HOME_INITIAL);
  const [testScores, setTestScores] = useState(TESTS_INITIAL);
  const [observationAnswers, setObservationAnswers] = useState(EMPTY_OBSERVATIONS);
  const [notes, setNotes] = useState(NOTES_INITIAL);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentObservationIndex, setCurrentObservationIndex] = useState(0);
  const [isChecklistConfirmed, setIsChecklistConfirmed] = useState(false);
  const [isDisclaimerConfirmed, setIsDisclaimerConfirmed] = useState(false);

  const answeredObservationCount = useMemo(
    () =>
      Object.values(observationAnswers).filter(
        (value) => value !== null && value !== undefined
      ).length,
    [observationAnswers]
  );

  const profileBase = useMemo(
    () => analyzeProfileBase(observationAnswers, contextInput),
    [observationAnswers, contextInput]
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
        homeInput
      }),
    [profileBase, interpretation, profilesById, contextInput, homeInput]
  );

  const bestProfile = profilesById[profileBase.topProfileId];
  const overlapProfile = profileBase.overlapProfileId
    ? profilesById[profileBase.overlapProfileId]
    : null;

  const steps = useMemo(
    () => [
      {
        key: 'student',
        title: 'Leerlinggegevens en aanleiding',
        shortTitle: 'Stap 1'
      },
      {
        key: 'tests',
        title: 'Toetsgegevens',
        shortTitle: 'Stap 2'
      },
      {
        key: 'context',
        title: 'Aanvullende context',
        shortTitle: 'Stap 3'
      },
      {
        key: 'observations',
        title: 'Observaties',
        shortTitle: 'Stap 4'
      },
      {
        key: 'review',
        title: 'Controle en disclaimer',
        shortTitle: 'Stap 5'
      },
      {
        key: 'results',
        title: 'Uitkomst',
        shortTitle: 'Stap 6'
      }
    ],
    []
  );

  const reviewStepIndex = steps.findIndex((step) => step.key === 'review');
  const resultStepIndex = steps.findIndex((step) => step.key === 'results');
  const observationsStepIndex = steps.findIndex((step) => step.key === 'observations');
  const currentStepConfig = steps[currentStep];

  const isObservationPhase = currentStepConfig?.key === 'observations';
  const currentObservationItem = observationItems[currentObservationIndex] || null;
  const currentObservationValue = currentObservationItem
    ? observationAnswers[currentObservationItem.id]
    : null;
  const observationProgressPercent = Math.round(
    ((currentObservationIndex + 1) / observationItems.length) * 100
  );

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
    setCurrentStep(0);
    setCurrentObservationIndex(0);
    setIsChecklistConfirmed(false);
    setIsDisclaimerConfirmed(false);
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

  const handlePrintObservationForm = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) return;

    const groupedItems = observationItems.reduce((groups, item) => {
      const groupLabel = toDisplay(item.domainLabel);
      if (!groups[groupLabel]) {
        groups[groupLabel] = [];
      }
      groups[groupLabel].push(item);
      return groups;
    }, {});

    const groupedHtml = Object.entries(groupedItems)
      .map(
        ([groupLabel, items]) => `
          <section class="observation-group">
            <h2 class="group-title">${groupLabel}</h2>
            ${items
              .map(
                (item) => `
                  <div class="question-block">
                    <div class="question-text">${toDisplay(item.prompt)}</div>
                    <div class="question-options">
                      <label><input type="checkbox" /> Niet waargenomen</label>
                      <label><input type="checkbox" /> Soms zichtbaar</label>
                      <label><input type="checkbox" /> Regelmatig zichtbaar</label>
                      <label><input type="checkbox" /> Duidelijk en consistent zichtbaar</label>
                    </div>
                  </div>
                `
              )
              .join('')}
          </section>
        `
      )
      .join('');
          const html = `
      <html>
        <head>
          <title>Printbaar observatieformulier</title>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: Arial, sans-serif;
              color: #1f2a37;
              margin: 28px;
              line-height: 1.4;
              font-size: 14px;
            }
            h1 { font-size: 24px; margin: 0 0 6px 0; }
            .subtitle { margin: 0 0 20px 0; color: #526274; }
            .meta {
              margin-bottom: 24px;
              padding: 16px;
              border: 1px solid #d9e1ea;
              border-radius: 8px;
              background: #f8fafc;
            }
            .meta-row { margin-bottom: 10px; }
            .meta-row:last-child { margin-bottom: 0; }
            .line {
              display: inline-block;
              min-width: 260px;
              border-bottom: 1px solid #6b7280;
              margin-left: 8px;
              height: 18px;
              vertical-align: bottom;
            }
            .observation-group { margin-bottom: 28px; }
            .group-title {
              font-size: 18px;
              margin: 0 0 12px 0;
              page-break-after: avoid;
              break-after: avoid;
            }
            .question-block {
              margin-bottom: 16px;
              padding: 12px;
              border: 1px solid #d9e1ea;
              border-radius: 8px;
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .question-text { font-weight: 600; margin-bottom: 10px; }
            .question-options {
              display: flex;
              flex-wrap: wrap;
              gap: 14px 18px;
            }
            .question-options label {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              white-space: nowrap;
            }
          </style>
        </head>
        <body>
          <h1>Printbaar observatieformulier</h1>
          <p class="subtitle">Webtool profiel en onderwijsbehoefte</p>
          <div class="meta">
            <div class="meta-row"><strong>Naam leerling:</strong><span class="line"></span></div>
            <div class="meta-row"><strong>Groep:</strong><span class="line"></span></div>
            <div class="meta-row"><strong>Datum:</strong><span class="line"></span></div>
            <div class="meta-row"><strong>Ingevuld door:</strong><span class="line"></span></div>
          </div>
          ${groupedHtml}
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  function isStepComplete(step) {
    if (!step) return false;

    if (step.key === 'student') {
      return Boolean(
        student.name.trim() && student.group.trim() && student.observer.trim()
      );
    }

    if (step.key === 'tests') return true;
    if (step.key === 'context') return true;

    if (step.key === 'observations') {
      return currentObservationValue !== null && currentObservationValue !== undefined;
    }

    if (step.key === 'review') {
      return isChecklistConfirmed && isDisclaimerConfirmed;
    }

    if (step.key === 'results') return true;

    return true;
  }

  const canGoNext = isStepComplete(currentStepConfig);
  const canGoBack =
    currentStep > 0 || (isObservationPhase && currentObservationIndex > 0);

  const handleNext = () => {
    if (!canGoNext) return;

    if (currentStepConfig.key === 'observations') {
      if (currentObservationIndex < observationItems.length - 1) {
        setCurrentObservationIndex((value) => value + 1);
        return;
      }
      setCurrentStep(reviewStepIndex);
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((value) => value + 1);
    }
  };

  const handlePrevious = () => {
    if (!canGoBack) return;

    if (currentStepConfig.key === 'review') {
      setCurrentStep(observationsStepIndex);
      setCurrentObservationIndex(observationItems.length - 1);
      return;
    }

    if (currentStepConfig.key === 'observations') {
      if (currentObservationIndex > 0) {
        setCurrentObservationIndex((value) => value - 1);
        return;
      }
      setCurrentStep((value) => value - 1);
      return;
    }

    if (currentStep > 0) {
      setCurrentStep((value) => value - 1);
    }
  };

  function renderStudentStep() {
    return (
      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="section-label">Stap 1</p>
            <h2>Leerlinggegevens en aanleiding</h2>
          </div>

          <button
            type="button"
            className="ghost-button"
            onClick={handlePrintObservationForm}
          >
            Print observatieformulier
          </button>
        </div>

        <div className="field-grid two-columns">
          <label className="field">
            <span>Naam leerling</span>
            <input
              type="text"
              value={student.name}
              onChange={(event) => handleStudentChange('name', event.target.value)}
            />
          </label>
          <label className="field">
            <span>Groep</span>
            <input
              type="text"
              value={student.group}
              onChange={(event) => handleStudentChange('group', event.target.value)}
            />
          </label>
          <label className="field">
            <span>Ingevuld door</span>
            <input
              type="text"
              value={student.observer}
              onChange={(event) => handleStudentChange('observer', event.target.value)}
            />
          </label>
          <label className="field">
            <span>Datum</span>
            <input
              type="date"
              value={student.date}
              onChange={(event) => handleStudentChange('date', event.target.value)}
            />
          </label>
        </div>

        <div className="secondary-block">
          <p className="section-label">Aanleiding</p>
          <div className="field-grid">
            <label className="field">
              <span>ZOOV+</span>
              <select
                value={zoovSignal.status}
                onChange={(event) => handleZoovChange('status', event.target.value)}
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
                onChange={(event) => handleZoovChange('note', event.target.value)}
              />
            </label>
          </div>
        </div>
      </article>
    );
  }
    function renderTestsStep() {
    return (
      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="section-label">Stap 2</p>
            <h2>Toetsgegevens</h2>
          </div>
        </div>

        <p className="helper-text">
          Vul hier het prestatiebeeld in. Deze gegevens tellen niet mee in de ruwe
          profielscore, maar worden wel gebruikt voor het prestatiebeeld en eventuele
          discrepantiesignalen.
        </p>

        <div className="field-grid two-columns">
          {Object.entries(TEST_FIELD_LABELS).map(([key, label]) => (
            <label className="field" key={key}>
              <span>{label}</span>
              <select
                value={testScores[key]}
                onChange={(event) => handleTestChange(key, event.target.value)}
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
    );
  }

  function renderContextStep() {
    return (
      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="section-label">Stap 3</p>
            <h2>Aanvullende context</h2>
          </div>
        </div>

        <div className="field-grid">
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
            <span>Bekende relevante ondersteuningsinformatie</span>
            <select
              value={contextInput.knownSupportInfoPresence}
              onChange={(event) =>
                handleContextChange('knownSupportInfoPresence', event.target.value)
              }
            >
              {KNOWN_SUPPORT_INFO_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {contextInput.knownSupportInfoPresence === 'yes' && (
            <label className="field">
              <span>Korte dossiernotitie</span>
              <textarea
                rows="3"
                value={contextInput.knownSupportInfoNote}
                onChange={(event) =>
                  handleContextChange('knownSupportInfoNote', event.target.value)
                }
              />
            </label>
          )}

          <label className="field">
            <span>Aanvullende schoolcontext</span>
            <textarea
              rows="3"
              value={contextInput.note}
              onChange={(event) => handleContextChange('note', event.target.value)}
            />
          </label>
        </div>

        <div className="secondary-block">
          <p className="section-label">Thuissituatie</p>
          <div className="field-grid">
            <label className="field">
              <span>Verhouding tot schoolbeeld</span>
              <select
                value={homeInput.pattern}
                onChange={(event) => handleHomeChange('pattern', event.target.value)}
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
                onChange={(event) => handleHomeChange('summary', event.target.value)}
              />
            </label>
          </div>
        </div>
      </article>
    );
  }

  function renderObservationStep(item) {
    if (!item) return null;

    return (
      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="section-label">Stap 4</p>
            <h2>Observaties</h2>
            <p className="helper-text">
              Vraag {currentObservationIndex + 1} van {observationItems.length}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              width: '100%',
              height: '10px',
              background: '#e8eef5',
              borderRadius: '999px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${observationProgressPercent}%`,
                height: '100%',
                background: '#4f7cff',
                borderRadius: '999px',
                transition: 'width 0.2s ease'
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '0.5rem',
              fontSize: '0.9rem',
              color: '#5b6b7f'
            }}
          >
            <span>{toDisplay(item.domainLabel)}</span>
            <span>{observationProgressPercent}% voltooid</span>
          </div>
        </div>

        <article className="observation-card">
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
                    handleObservationChange(item.id, event.target.value)
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </article>
      </article>
    );
  }

  function renderReviewStep() {
    return (
      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="section-label">Stap 5</p>
            <h2>Controle en disclaimer</h2>
          </div>
        </div>

        <div className="field-grid">
          <div className="secondary-card">
            <strong>Samenvatting</strong>
            <p>Naam: {student.name || '-'}</p>
            <p>Groep: {student.group || '-'}</p>
            <p>Ingevuld door: {student.observer || '-'}</p>
            <p>{answeredObservationCount} observaties ingevuld</p>
          </div>

          <label className="field">
            <span>Aanvullende notities</span>
            <textarea
              rows="5"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>

          <label className="option-card">
            <input
              type="checkbox"
              checked={isChecklistConfirmed}
              onChange={(event) => setIsChecklistConfirmed(event.target.checked)}
            />
            <span>Ik heb gecontroleerd dat de ingevulde informatie klopt.</span>
          </label>

          <div className="secondary-card">
            <strong>Belangrijke kanttekening</strong>
            <p>
              Deze tool ondersteunt bij profielduiding en onderwijsafstemming.
              De uitkomst is een werkhypothese en geen diagnose of classificatie.
            </p>
          </div>

          <label className="option-card">
            <input
              type="checkbox"
              checked={isDisclaimerConfirmed}
              onChange={(event) => setIsDisclaimerConfirmed(event.target.checked)}
            />
            <span>
              Ik begrijp dat deze tool een hulpmiddel is en geen diagnostische tool.
            </span>
          </label>
        </div>
      </article>
    );
  }

  function renderResultsStep() {
    return (
      <div className="output-column">
        <article className="panel result-panel">
          <div className="panel-head">
            <div>
              <p className="section-label">Profielbeeld</p>
              <h2>{formatProfileHeading(bestProfile)}</h2>
              <p className="helper-text">
                {profileBase.profileStatusById[bestProfile.id]?.label}
              </p>
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
          {overlapProfile && (
            <div className="meta-pills">
              <span className="pill subtle-pill">
                Overlap met {toDisplay(overlapProfile.shortTitle)}
              </span>
            </div>
          )}
        </article>

        <article className="panel">
          <p className="section-label">Samenvatting</p>
          <h3>Werkhypothese</h3>
          <p>{advice.workHypothesis}</p>
          <p>{advice.shortInterpretation}</p>
        </article>

        <article className="panel">
          <p className="section-label">Score-overzicht</p>
          <div className="score-list">
            {scoreOverview.map((item) => (
              <div className="score-row" key={item.profileId}>
                <div>
                  <strong>{item.shortTitle}</strong>
                  <span>{item.title}</span>
                  <small>{item.status.label}</small>
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
          <p className="section-label">Aanvullende signalen</p>
          {profileBase.contextSignals.length > 0 ||
          interpretation.interpretationSignals.length > 0 ? (
            <ul className="list">
              {interpretation.interpretationSignals.map((signal) => (
                <li key={signal.id}>{toDisplay(signal.prompt)}</li>
              ))}
            </ul>
          ) : (
            <p className="helper-text">
              Nog geen aanvullende signalen ingevuld.
            </p>
          )}
        </article>

        <article className="panel">
          <p className="section-label">Discrepantiesignalen</p>
          {interpretation.discrepancySignals.length > 0 ? (
            <ul className="list">
              {interpretation.discrepancySignals.map((signal) => (
                <li key={signal}>{toDisplay(signal)}</li>
              ))}
            </ul>
          ) : (
            <p className="helper-text">
              Op basis van de huidige invoer zijn er nog geen expliciete discrepantiesignalen zichtbaar.
            </p>
          )}
        </article>

        <article className="panel">
          <p className="section-label">Onderwijsbehoeften en adviezen</p>
          <div className="advice-list">
            {advice.prioritizedNeeds.map((item) => (
              <article className="advice-card" key={item.area}>
                <span className="area-label">{item.area}</span>
                <p>
                  <strong>Onderwijsbehoefte:</strong> {item.need}
                </p>
                <p>
                  <strong>Advies:</strong> {item.advice}
                </p>
                <p>
                  <strong>Waarom:</strong> {item.reason}
                </p>
                {item.sharedByOverlap && (
                  <span className="pill subtle-pill">Extra relevant bij overlap</span>
                )}
              </article>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="section-label">Vervolg</p>
          <ul className="list">
            {advice.followUpSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
            {advice.homeAttention && (
              <li>Thuissituatie als aandachtspunt: {advice.homeAttention}</li>
            )}
          </ul>
        </article>

        <article className="panel caution-panel">
          <p className="section-label">Kanttekening</p>
          <p>{advice.caution}</p>
        </article>

        <article className="panel action-panel">
          <button type="button" className="ghost-button" onClick={handleReset}>
            Nieuwe invoer starten
          </button>
          <button type="button" className="primary-button" onClick={handleExport}>
            Exporteer werkhypothese
          </button>
        </article>
      </div>
    );
  }

  function renderCurrentStep() {
    if (currentStepConfig.key === 'student') return renderStudentStep();
    if (currentStepConfig.key === 'tests') return renderTestsStep();
    if (currentStepConfig.key === 'context') return renderContextStep();
    if (currentStepConfig.key === 'observations') {
      return renderObservationStep(currentObservationItem);
    }
    if (currentStepConfig.key === 'review') return renderReviewStep();
    if (currentStepConfig.key === 'results') return renderResultsStep();
    return null;
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="container hero-layout single-hero">
          <div className="hero-main">
            <p className="eyebrow">Webtool profiel en onderwijsbehoefte</p>
            <h1>HB Profiel & Onderwijsbehoefte</h1>
            <p className="intro">
              Deze tool ondersteunt leerkrachten stap voor stap bij het vormen van een
              werkhypothese over profiel, overlap, prestatiebeeld en passende
              onderwijsbehoeften.
            </p>
            <div className="meta-pills">
              <span className="pill">
                {answeredObservationCount} observaties ingevuld
              </span>
              <span className="pill">
                Stap {currentStep + 1} van {steps.length}
              </span>
              {isObservationPhase && (
                <span className="pill">
                  Vraag {currentObservationIndex + 1} van {observationItems.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container app-layout">
        <section className="input-column">
          <div className="progress-strip">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isDone = index < currentStep;

              return (
                <div
                  key={step.key}
                  className={`progress-step ${isActive ? 'is-active' : ''} ${
                    isDone ? 'is-done' : ''
                  }`}
                >
                  <span>{index + 1}</span>
                  <div>
                    <strong>{step.shortTitle}</strong>
                    <small>{step.title}</small>
                  </div>
                </div>
              );
            })}
          </div>

          {renderCurrentStep()}

          {currentStep < resultStepIndex && (
            <article className="panel action-panel">
              <button
                type="button"
                className="ghost-button"
                onClick={handlePrevious}
                disabled={!canGoBack}
              >
                Vorige
              </button>

              <div className="wizard-status">
                {currentStepConfig.key !== 'review' && currentStepConfig.key !== 'results' && (
                  <span className="helper-text">
                    {canGoNext
                      ? currentStepConfig.key === 'observations'
                        ? 'Je kunt doorgaan naar de volgende vraag.'
                        : 'Je kunt doorgaan naar de volgende stap.'
                      : 'Vul eerst de benodigde informatie in om verder te gaan.'}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="primary-button"
                onClick={handleNext}
                disabled={!canGoNext}
              >
                {currentStepConfig.key === 'observations'
                  ? currentObservationIndex === observationItems.length - 1
                    ? 'Naar controle'
                    : 'Volgende vraag'
                  : currentStep === reviewStepIndex
                    ? 'Toon uitkomst'
                    : 'Volgende'}
              </button>
            </article>
          )}
        </section>
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
                  Dit profiel helpt bij het begrijpen van het zichtbare functioneren in school. Het is geen diagnose.
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
                <strong>Signalen in school</strong>
                <p>{toDisplay(bestProfile.matrix1.signalen)}</p>
              </div>
              <div className="modal-section">
                <strong>Richting van begeleiding</strong>
                <p>{toDisplay(bestProfile.matrix1.begeleiding)}</p>
              </div>
              <div className="modal-section">
                <strong>Contextnoot</strong>
                <p>
                  Dossierinformatie, thuissituatie, toetsgegevens en verschillen tussen settings kunnen dit
                  profielbeeld versterken of nuanceren, maar tellen niet mee in de ruwe profielscore.
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