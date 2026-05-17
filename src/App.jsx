import React, { useEffect, useMemo, useRef, useState } from 'react';
import profiles from './data/profiles.js';
import observationItems, {
  OBSERVATION_SCORE_OPTIONS
} from './data/observationItems.js';
import {
  analyzeProfileBase,
  analyzeRichInterpretation,
  normalizeText
} from './lib/analysis.js';
import buildPersonalizedAdvice from './lib/buildPersonalizedAdvice.js';
import {
  buildTrackingPayload,
  createSessionId,
  saveTrackingRecord
} from './lib/tracking.js';
import {
  downloadPdfReport,
  downloadWordReport
} from './lib/exportReport.js';

const PROFILE_CARD_SUMMARIES = [
  {
    id: 'type1',
    title: 'Type 1 – aangepast succesvol',
    summary: 'presteert goed maar vermijdt risico’s'
  },
  {
    id: 'type2',
    title: 'Type 2 – uitdagend creatief',
    summary: 'creatief, kritisch en uitdagend gedrag'
  },
  {
    id: 'type3',
    title: 'Type 3 – onderduikend',
    summary: 'past zich aan om niet op te vallen'
  },
  {
    id: 'type4',
    title: 'Type 4 – risicoleerling',
    summary: 'sterke onderprestatie en schoolvervreemding'
  },
  {
    id: 'type5',
    title: 'Type 5 – dubbel bijzonder',
    summary: 'combinatie van begaafdheid en andere ondersteuningsbehoeften'
  },
  {
    id: 'type6',
    title: 'Type 6 – zelfsturend autonoom',
    summary: 'zelfstandig, doelgericht en intrinsiek gemotiveerd'
  }
];

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

function replaceRoleText(text) {
  if (!text) return text;
  return text.replace(
    /intern begeleider/gi,
    'intern begeleider / kwaliteitscoördinator'
  );
}

function getCategoryLabel(category) {
  if (category === 'core') return 'Kernobservatie';
  if (category === 'supporting') return 'Ondersteunend signaal';
  return 'Contextsignaal';
}

function getCategoryHelpText(category) {
  if (category === 'core') {
    return 'Kernobservatie = observatie die sterk past bij een profiel.';
  }
  if (category === 'supporting') {
    return 'Ondersteunend signaal = observatie die meeweegt, maar minder doorslaggevend is.';
  }
  return 'Contextsignaal = extra duiding, maar telt niet mee in de ruwe profielscore.';
}

function App() {
  const profilesById = useMemo(buildProfilesById, []);
  const sessionId = useMemo(() => createSessionId(), []);
  const lastTrackedSignatureRef = useRef(null);

  const [student, setStudent] = useState(STUDENT_INITIAL);
  const [zoovSignal, setZoovSignal] = useState(ZOOV_INITIAL);
  const [contextInput, setContextInput] = useState(CONTEXT_INITIAL);
  const [homeInput, setHomeInput] = useState(HOME_INITIAL);
  const [testScores, setTestScores] = useState(TESTS_INITIAL);
  const [observationAnswers, setObservationAnswers] = useState(EMPTY_OBSERVATIONS);
  const [notes, setNotes] = useState(NOTES_INITIAL);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
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
        contextInput,
        homeInput,
        testScores,
        notes
      }),
    [profileBase, contextInput, homeInput, testScores, notes]
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

  const trackingSignature = useMemo(
    () =>
      JSON.stringify({
        topProfileId: profileBase.topProfileId,
        overlapProfileId: profileBase.overlapProfileId,
        directionKey: profileBase.directionKey,
        topScore: profileBase.topScore,
        secondScore: profileBase.secondScore,
        observationAnswers,
        contextInput,
        homeInput,
        testScores
      }),
    [
      profileBase.topProfileId,
      profileBase.overlapProfileId,
      profileBase.directionKey,
      profileBase.topScore,
      profileBase.secondScore,
      observationAnswers,
      contextInput,
      homeInput,
      testScores
    ]
  );

  const bestProfile = profileBase.topProfileId
    ? profilesById[profileBase.topProfileId]
    : null;

  const overlapProfile = profileBase.overlapProfileId
    ? profilesById[profileBase.overlapProfileId]
    : null;

  const steps = useMemo(
    () => [
      { key: 'intro', title: 'Startpagina', shortTitle: 'Start' },
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
        shortTitle: 'Resultaat'
      }
    ],
    []
  );

  const reviewStepIndex = steps.findIndex((step) => step.key === 'review');
  const resultStepIndex = steps.findIndex((step) => step.key === 'results');
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

  useEffect(() => {
    if (currentStepConfig?.key !== 'results') return;

    const canTrackResult =
      profileBase.directionKey === 'no_signal' || Boolean(profileBase.topProfileId);

    if (!canTrackResult) return;
    if (lastTrackedSignatureRef.current === trackingSignature) return;

    const payload = buildTrackingPayload({
      sessionId,
      student,
      zoovSignal,
      contextInput,
      homeInput,
      testScores,
      observationAnswers,
      profileBase,
      interpretation,
      advice
    });

    saveTrackingRecord(payload)
      .then((result) => {
        if (result.ok || result.skipped) {
          lastTrackedSignatureRef.current = trackingSignature;
        }
      })
      .catch((error) => {
        console.error('Opslaan van tool_run mislukt:', error);
      });
  }, [
    currentStepConfig?.key,
    trackingSignature,
    sessionId,
    student,
    zoovSignal,
    contextInput,
    homeInput,
    testScores,
    observationAnswers,
    profileBase,
    interpretation,
    advice
  ]);

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
    setIsExportModalOpen(false);
    setCurrentStep(0);
    setCurrentObservationIndex(0);
    setIsChecklistConfirmed(false);
    setIsDisclaimerConfirmed(false);
    lastTrackedSignatureRef.current = null;
  };

  const buildExportInput = () => ({
    student,
    zoovSignal,
    contextInput,
    homeInput,
    testScores,
    interpretation,
    advice,
    bestProfile,
    overlapProfile
  });

  const handleExportPdf = () => {
    downloadPdfReport(buildExportInput());
    setIsExportModalOpen(false);
  };

  const handleExportWord = () => {
    downloadWordReport(buildExportInput());
    setIsExportModalOpen(false);
  };

  function isStepComplete(step) {
    if (!step) return false;

    if (step.key === 'intro') return true;

    if (step.key === 'student') {
      return Boolean(student.name.trim() && student.group.trim() && student.observer.trim());
    }

    if (step.key === 'tests') return true;
    if (step.key === 'context') return true;
    if (step.key === 'observations') return currentObservationValue !== null;
    if (step.key === 'review') return isChecklistConfirmed && isDisclaimerConfirmed;
    if (step.key === 'results') return true;

    return true;
  }

  const canGoNext = isStepComplete(currentStepConfig);
  const canGoBack = currentStep > 0;

  const handleNext = () => {
    if (!canGoNext || currentStep >= steps.length - 1) return;

    if (currentStepConfig?.key === 'observations') {
      if (currentObservationIndex < observationItems.length - 1) {
        setCurrentObservationIndex((value) => value + 1);
        return;
      }
    }

    setCurrentStep((value) => value + 1);
  };

  const handlePrevious = () => {
    if (!canGoBack) return;

    if (currentStepConfig?.key === 'observations' && currentObservationIndex > 0) {
      setCurrentObservationIndex((value) => value - 1);
      return;
    }

    setCurrentStep((value) => value - 1);
  };

  function renderIntroStep() {
    return (
      <article className="panel intro-panel">
        <div className="panel-head">
          <div>
            <p className="section-label">Start</p>
            <h2>Waarvoor gebruik je deze tool?</h2>
          </div>
        </div>

        <div className="intro-points">
          <div className="secondary-card compact-card">
            <strong>Doel van de tool</strong>
            <p>
              Deze tool helpt leerkrachten om signalen van leerlingen te duiden en te vertalen
              naar passende onderwijsbehoeften.
            </p>
          </div>
          <div className="secondary-card compact-card">
            <strong>Ondersteunend en niet-diagnostisch</strong>
            <p>
              De tool ondersteunt de duiding van observeerbaar functioneren en stelt geen diagnose.
            </p>
          </div>
          <div className="secondary-card compact-card">
            <strong>Profielen als interpretatiekader</strong>
            <p>
              De profielen van Betts &amp; Neihart zijn richtinggevend en helpen om zichtbaar gedrag te begrijpen.
            </p>
          </div>
          <div className="secondary-card compact-card">
            <strong>Overlap is mogelijk</strong>
            <p>
              Meerdere profielen kunnen tegelijk zichtbaar zijn. Dat komt in de praktijk regelmatig voor.
            </p>
          </div>
        </div>

        <div className="profile-card-grid">
          {PROFILE_CARD_SUMMARIES.map((profile) => (
            <article className="profile-card" key={profile.id}>
              <strong>{profile.title}</strong>
              <p>{profile.summary}</p>
            </article>
          ))}
        </div>
      </article>
    );
  }

  function renderStudentStep() {
    return (
      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="section-label">Stap 1</p>
            <h2>Leerlinggegevens en aanleiding</h2>
          </div>
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
          Deze gegevens tellen niet mee in de ruwe profielscore, maar helpen wel om het prestatiebeeld en mogelijke discrepanties te duiden.
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
              onChange={(event) => handleContextChange('settingDifference', event.target.value)}
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

  function renderObservationStep() {
    if (!currentObservationItem) return null;

    return (
      <article className="panel observation-step-panel">
        <div className="panel-head">
          <div>
            <p className="section-label">Stap 4</p>
            <h2>Observaties</h2>
            <p className="helper-text">
              Vraag {currentObservationIndex + 1} van {observationItems.length}
            </p>
          </div>
          <div className="progress-badge">{observationProgressPercent}%</div>
        </div>

        <div className="observation-step-meta">
          <span className="pill">{toDisplay(currentObservationItem.domainLabel)}</span>
          <span className={`chip chip-${currentObservationItem.category}`}>
            {getCategoryLabel(currentObservationItem.category)}
          </span>
        </div>

        {currentObservationItem.category !== 'context' && (
          <p className="helper-text compact-helper">
            {getCategoryHelpText(currentObservationItem.category)}
          </p>
        )}

        <article className="observation-focus-card">
          <h3>{toDisplay(currentObservationItem.prompt)}</h3>
          <div className="option-row single-question-row">
            {OBSERVATION_SCORE_OPTIONS.map((option) => (
              <label className="option-card" key={option.value}>
                <input
                  type="radio"
                  name={currentObservationItem.id}
                  value={option.value}
                  checked={observationAnswers[currentObservationItem.id] === option.value}
                  onChange={(event) =>
                    handleObservationChange(currentObservationItem.id, event.target.value)
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
              Deze tool ondersteunt bij profielduiding en onderwijsafstemming. De uitkomst is een werkhypothese en geen diagnose of classificatie.
            </p>
          </div>

          <label className="option-card">
            <input
              type="checkbox"
              checked={isDisclaimerConfirmed}
              onChange={(event) => setIsDisclaimerConfirmed(event.target.checked)}
            />
            <span>Ik begrijp dat deze tool een hulpmiddel is en geen diagnostische tool.</span>
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
              <p className="section-label">Profielduiding</p>
              <h2>
                {bestProfile ? formatProfileHeading(bestProfile) : 'Geen duidelijke profielrichting zichtbaar'}
              </h2>
            </div>
            {bestProfile && (
              <button
                type="button"
                className="info-button"
                onClick={() => setIsProfileModalOpen(true)}
                aria-label="Open profieluitleg"
              >
                ?
              </button>
            )}
          </div>
          <p className="lead-text">{replaceRoleText(advice.workHypothesis)}</p>
        </article>

        {overlapProfile && (
          <article className="panel">
            <p className="section-label">Profieloverlap</p>
            <div className="result-note-block">
              <strong>Toelichting</strong>
              <p>
                Profieloverlap is mogelijk. Profielen zijn geen vaste labels. Deze uitkomst is bedoeld als ondersteuning bij interpretatie en handelen.
              </p>
            </div>
          </article>
        )}

        <article className="panel">
          <p className="section-label">Prestatiebeeld en discrepanties</p>
          <h3>{toDisplay(interpretation.performanceLabel)}</h3>
          <p>{toDisplay(interpretation.performanceSummary)}</p>
          <p className="helper-text discrepancy-helper">
            Verschillen tussen observaties en toetsgegevens kunnen wijzen op onderpresteren, wisselend functioneren of maskering. Deze duiding is ondersteunend en niet-diagnostisch.
          </p>
          {interpretation.discrepancySignals.length > 0 ? (
            <ul className="list compact-list">
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
                <div className="advice-card-headline">
                  <span className="area-label">{item.area}</span>
                  {item.sharedByOverlap && (
                    <span className="pill subtle-pill">Extra relevant bij overlap</span>
                  )}
                </div>
                <p>
                  <strong>Onderwijsbehoefte:</strong> {replaceRoleText(item.need)}
                </p>
                <p>
                  <strong>Advies:</strong> {replaceRoleText(item.advice)}
                </p>
              </article>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="section-label">Vervolg</p>
          <ul className="list compact-list">
            {(advice.followUpSteps || []).map((step) => (
              <li key={step}>{replaceRoleText(step)}</li>
            ))}
            {advice.homeAttention && (
              <li>Thuissituatie als aandachtspunt: {replaceRoleText(advice.homeAttention)}</li>
            )}
          </ul>
        </article>

        <article className="panel caution-panel">
          <p className="section-label">Kanttekening</p>
          <p>{replaceRoleText(advice.caution)}</p>
        </article>

        <article className="panel action-panel">
          <button type="button" className="ghost-button" onClick={handleReset}>
            Nieuwe invoer starten
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => setIsExportModalOpen(true)}
          >
            Exporteren
          </button>
        </article>
      </div>
    );
  }

  function renderCurrentStep() {
    if (currentStepConfig.key === 'intro') return renderIntroStep();
    if (currentStepConfig.key === 'student') return renderStudentStep();
    if (currentStepConfig.key === 'tests') return renderTestsStep();
    if (currentStepConfig.key === 'context') return renderContextStep();
    if (currentStepConfig.key === 'observations') return renderObservationStep();
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
            <h1>HB Profiel &amp; Onderwijsbehoefte</h1>
            <p className="intro">
              Deze tool helpt leerkrachten om signalen van leerlingen te duiden en te vertalen naar passende onderwijsbehoeften.
            </p>
            <div className="meta-pills">
              <span className="pill">{answeredObservationCount} observaties ingevuld</span>
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
                      ? 'Je kunt doorgaan naar de volgende stap.'
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
                {currentStep === reviewStepIndex
                  ? 'Toon uitkomst'
                  : currentStepConfig.key === 'observations' &&
                    currentObservationIndex === observationItems.length - 1
                    ? 'Naar controle'
                    : 'Volgende'}
              </button>
            </article>
          )}
        </section>
      </main>

      {isProfileModalOpen && bestProfile && (
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
                  Thuissituatie, toetsgegevens en verschillen tussen settings kunnen het profielbeeld versterken of nuanceren, maar tellen niet mee in de ruwe profielscore.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isExportModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsExportModalOpen(false)}
        >
          <div
            className="modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-head">
              <div>
                <p className="section-label">Exporteren</p>
                <h2>Kies een bestandsformaat</h2>
                <p className="helper-text">
                  Exporteer de rapportage direct als PDF of Word-document.
                </p>
              </div>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setIsExportModalOpen(false)}
              >
                Sluiten
              </button>
            </div>

            <div className="field-grid two-columns">
              <button
                type="button"
                className="primary-button"
                onClick={handleExportPdf}
              >
                Exporteer als PDF
              </button>

              <button
                type="button"
                className="ghost-button"
                onClick={handleExportWord}
              >
                Exporteer als Word
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;