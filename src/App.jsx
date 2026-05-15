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
    summary: 'begaafdheid met andere ondersteuningsbehoeften'
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

const CHALLENGE_RESPONSE_OPTIONS = [
  { value: 'unknown', label: 'Niet ingevuld' },
  {
    value:
      'De leerling laat meer betrokkenheid zien wanneer het werk compact en echt uitdagend is.',
    label: 'Meer betrokken bij compacte, uitdagende taken'
  },
  {
    value:
      'De leerling laat meer weerstand zien wanneer taken herhalend of te makkelijk zijn.',
    label: 'Meer weerstand bij herhaling of makkelijke taken'
  },
  {
    value:
      'De leerling laat juist meer stabiliteit zien wanneer taken voorspelbaar en duidelijk begrensd zijn.',
    label: 'Stabieler bij voorspelbare, begrensde taken'
  }
];

const SETTING_OPTIONS = [
  { value: 'unknown', label: 'Niet ingevuld' },
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
  challengeResponse: 'unknown',
  settingDifference: 'unknown',
  expressionDifference: 'unknown',
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
  if (strength === 3) return 'duidelijk zichtbaar';
  if (strength === 2) return 'regelmatig zichtbaar';
  if (strength === 1) return 'soms zichtbaar';
  return 'niet waargenomen';
}

function replaceRoleText(text) {
  if (!text) return text;
  return text.replace(/intern begeleider/gi, 'intern begeleider / kwaliteitscoördinator');
}

function getCategoryLabel(category) {
  if (category === 'core') return 'Kernobservatie';
  if (category === 'supporting') return 'Ondersteunend signaal';
  return 'Contextsignaal';
}

function getCategoryHelpText(category) {
  if (category === 'core') {
    return 'Kernobservatie = sterk profielonderscheidend signaal.';
  }
  if (category === 'supporting') {
    return 'Ondersteunend signaal = telt mee, maar is minder doorslaggevend.';
  }
  return 'Contextsignaal = geeft aanvullende duiding, maar telt niet mee in de ruwe profielscore.';
}

function getOverlapSupportItems(profileBase) {
  if (!profileBase.overlapProfileId || !profileBase.sortedProfiles) return [];

  const overlapProfile = profileBase.sortedProfiles.find(
    (item) => item.profileId === profileBase.overlapProfileId
  );

  if (!overlapProfile?.evidence?.length) return [];

  const strongestIds = new Set(
    (profileBase.strongestObservations || []).map((item) => item.id)
  );

  const filtered = overlapProfile.evidence.filter((item) => !strongestIds.has(item.id));
  const source = filtered.length > 0 ? filtered : overlapProfile.evidence;

  return source.slice(0, 3);
}

function buildPrintReportHtml({
  student,
  zoovSignal,
  contextInput,
  homeInput,
  testScores,
  profileBase,
  interpretation,
  advice,
  bestProfile,
  overlapProfile
}) {
  const strongestItems = profileBase.strongestObservations || [];
  const overlapItems = getOverlapSupportItems(profileBase);
  const printableAdvice = advice.prioritizedNeeds || [];
  const printableFollowUp = (advice.followUpSteps || []).map(replaceRoleText);
  const printableHomeAttention = replaceRoleText(advice.homeAttention || '');
  const printableCaution = replaceRoleText(advice.caution || '');

  const testRows = Object.entries(testScores)
    .map(
      ([key, value]) => `
        <tr>
          <td>${TEST_FIELD_LABELS[key]}</td>
          <td>${TEST_EXPORT_LABELS[value] || value}</td>
        </tr>
      `
    )
    .join('');

  const strongestHtml = strongestItems.length
    ? strongestItems
        .map(
          (item) => `
            <li>
              ${toDisplay(item.prompt)}
              <span class="print-meta">(${item.strengthLabel})</span>
            </li>
          `
        )
        .join('')
    : '<li>Er zijn nog geen observaties die een duidelijke profielrichting dragen.</li>';

  const overlapHtml = overlapProfile
    ? `
      <div class="print-block compact-note">
        <strong>Overlap</strong>
        <p>
          Meerdere profielen kunnen kenmerken delen. Profieloverlap komt in de praktijk regelmatig voor.
          De tool gebruikt profielen als interpretatiekader en niet als diagnose.
        </p>
      </div>
      <div class="print-block">
        <strong>Signalen die overlap ondersteunen</strong>
        <ul>
          ${
            overlapItems.length
              ? overlapItems
                  .map(
                    (item) => `<li>${toDisplay(item.prompt)} <span class="print-meta">(${item.strengthLabel})</span></li>`
                  )
                  .join('')
              : '<li>De overlap wordt vooral zichtbaar in het totaalbeeld van de observaties.</li>'
          }
        </ul>
      </div>
    `
    : '';

  const discrepancyHtml = interpretation.discrepancySignals.length
    ? interpretation.discrepancySignals
        .map((signal) => `<li>${toDisplay(signal)}</li>`)
        .join('')
    : '<li>Er zijn op basis van de huidige invoer nog geen expliciete discrepantiesignalen zichtbaar.</li>';

  const adviceHtml = printableAdvice
    .map(
      (item) => `
        <div class="print-card">
          <div class="print-area-row">
            <strong>${item.area}</strong>
            ${item.sharedByOverlap ? '<span class="print-tag">Extra relevant bij overlap</span>' : ''}
          </div>
          <p><strong>Onderwijsbehoefte:</strong> ${replaceRoleText(item.need)}</p>
          <p><strong>Advies:</strong> ${replaceRoleText(item.advice)}</p>
        </div>
      `
    )
    .join('');

  return `
    <html>
      <head>
        <title>Werkhypothese profiel en onderwijsbehoefte</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: Inter, Arial, sans-serif;
            color: #1f2937;
            margin: 28px;
            line-height: 1.45;
            font-size: 14px;
            background: #ffffff;
          }
          h1, h2, h3, p { margin: 0; }
          h1 { font-size: 24px; margin-bottom: 6px; }
          h2 { font-size: 18px; margin-bottom: 10px; }
          .subtle { color: #4b5563; }
          .section { margin-top: 22px; }
          .print-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .print-block, .print-card {
            border: 1px solid #dbe3ec;
            border-radius: 12px;
            padding: 14px;
            margin-top: 10px;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .compact-note { background: #f8fafc; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
          }
          td {
            border-bottom: 1px solid #e5e7eb;
            padding: 8px 0;
            vertical-align: top;
          }
          ul { margin: 8px 0 0 18px; padding: 0; }
          li { margin-bottom: 6px; }
          .print-meta { color: #6b7280; font-size: 12px; }
          .print-tag {
            display: inline-block;
            border: 1px solid #dbe3ec;
            border-radius: 999px;
            padding: 4px 8px;
            font-size: 12px;
            color: #355f86;
            background: #eef4fa;
          }
          .print-area-row {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: flex-start;
            margin-bottom: 8px;
          }
          .print-card p + p { margin-top: 8px; }
          @media print {
            body { margin: 16mm; }
            .print-grid { grid-template-columns: 1fr 1fr; }
          }
        </style>
      </head>
      <body>
        <h1>Werkhypothese profiel en onderwijsbehoefte</h1>
        <p class="subtle">Print- en PDF-weergave voor bespreking met collega’s, ouders of andere betrokkenen.</p>

        <div class="section print-grid">
          <div class="print-block">
            <h2>Leerlinggegevens</h2>
            <p><strong>Naam:</strong> ${student.name || '-'}</p>
            <p><strong>Groep:</strong> ${student.group || '-'}</p>
            <p><strong>Ingevuld door:</strong> ${student.observer || '-'}</p>
            <p><strong>Datum:</strong> ${student.date || '-'}</p>
          </div>
          <div class="print-block">
            <h2>Aanleiding</h2>
            <p><strong>ZOOV+:</strong> ${ZOOV_EXPORT_LABELS[zoovSignal.status] || zoovSignal.status}</p>
            <p><strong>Notitie:</strong> ${zoovSignal.note || '-'}</p>
          </div>
        </div>

        <div class="section">
          <div class="print-block">
            <h2>Profielbeeld</h2>
            <p><strong>Best passend profiel:</strong> ${bestProfile ? formatProfileHeading(bestProfile) : 'Geen duidelijke profielrichting zichtbaar'}</p>
            ${overlapProfile ? `<p><strong>Overlap:</strong> ${formatProfileHeading(overlapProfile)}</p>` : ''}
            <p style="margin-top:10px;"><strong>Werkhypothese:</strong> ${replaceRoleText(advice.workHypothesis)}</p>
            <p style="margin-top:8px;">${replaceRoleText(advice.shortInterpretation)}</p>
          </div>
          ${overlapHtml}
        </div>

        <div class="section print-grid">
          <div class="print-block">
            <h2>Waarom deze uitkomst?</h2>
            <ul>${strongestHtml}</ul>
          </div>
          <div class="print-block">
            <h2>Toetsgegevens</h2>
            <table>${testRows}</table>
          </div>
        </div>

        <div class="section print-block">
          <h2>Prestatiebeeld en discrepanties</h2>
          <p>${toDisplay(interpretation.performanceSummary)}</p>
          <p style="margin-top:10px;" class="subtle">
            Verschillen tussen observaties en toetsgegevens kunnen wijzen op onderpresteren, wisselend functioneren of maskering van mogelijkheden of ondersteuningsbehoeften. Deze duiding is ondersteunend en niet-diagnostisch.
          </p>
          <ul>${discrepancyHtml}</ul>
        </div>

        <div class="section">
          <h2>Onderwijsbehoeften en adviezen</h2>
          ${adviceHtml}
        </div>

        <div class="section print-block">
          <h2>Vervolg</h2>
          <ul>
            ${printableFollowUp.map((step) => `<li>${step}</li>`).join('')}
            ${printableHomeAttention ? `<li>Thuissituatie als aandachtspunt: ${printableHomeAttention}</li>` : ''}
          </ul>
        </div>

        <div class="section print-block compact-note">
          <h2>Kanttekening</h2>
          <p>${printableCaution}</p>
          <p style="margin-top:8px;">Dit is geen diagnose.</p>
        </div>
      </body>
    </html>
  `;
}

function openPrintWindow(html) {
  const printWindow = window.open('', '_blank', 'width=1000,height=1200');
  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => {
    printWindow.print();
  };
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

  const bestProfile =
    profileBase.directionKey === 'no_signal' || !profileBase.topProfileId
      ? null
      : profilesById[profileBase.topProfileId];

  const overlapProfile =
    profileBase.directionKey === 'overlap' && profileBase.overlapProfileId
      ? profilesById[profileBase.overlapProfileId]
      : null;

  const steps = useMemo(
    () => [
      { key: 'intro', title: 'Introductie', shortTitle: 'Start' },
      { key: 'student', title: 'Leerlinggegevens en aanleiding', shortTitle: 'Stap 1' },
      { key: 'tests', title: 'Toetsgegevens', shortTitle: 'Stap 2' },
      { key: 'context', title: 'Context en thuissituatie', shortTitle: 'Stap 3' },
      { key: 'observations', title: 'Observaties', shortTitle: 'Stap 4' },
      { key: 'review', title: 'Controle en disclaimer', shortTitle: 'Stap 5' },
      { key: 'results', title: 'Uitkomst', shortTitle: 'Resultaat' }
    ],
    []
  );

  const reviewStepIndex = steps.findIndex((step) => step.key === 'review');
  const resultStepIndex = steps.findIndex((step) => step.key === 'results');
  const currentStepConfig = steps[currentStep];
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
    setCurrentStep(0);
    setCurrentObservationIndex(0);
    setIsChecklistConfirmed(false);
    setIsDisclaimerConfirmed(false);
    lastTrackedSignatureRef.current = null;
  };

  const handlePrintReport = () => {
    openPrintWindow(
      buildPrintReportHtml({
        student,
        zoovSignal,
        contextInput,
        homeInput,
        testScores,
        profileBase,
        interpretation,
        advice,
        bestProfile,
        overlapProfile
      })
    );
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

    if (currentStepConfig?.key === 'review') {
      setCurrentStep((value) => value - 1);
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
            <strong>Observeerbaar functioneren eerst</strong>
            <p>De tool ondersteunt bij het interpreteren van observeerbaar functioneren in de schoolcontext.</p>
          </div>
          <div className="secondary-card compact-card">
            <strong>Vertaling naar onderwijsbehoeften</strong>
            <p>De tool helpt signalen te vertalen naar mogelijke onderwijsbehoeften en handelingssuggesties.</p>
          </div>
          <div className="secondary-card compact-card">
            <strong>Profielen als interpretatiekader</strong>
            <p>De profielen van Betts &amp; Neihart zijn richtinggevend en geen labels of diagnose.</p>
          </div>
          <div className="secondary-card compact-card">
            <strong>Overlap is mogelijk</strong>
            <p>Meerdere profielen kunnen tegelijk zichtbaar zijn. Profieloverlap komt in de praktijk regelmatig voor.</p>
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
            <h2>Context en thuissituatie</h2>
          </div>
        </div>

        <div className="field-grid">
          <label className="field">
            <span>Reactie op uitdaging</span>
            <select
              value={contextInput.challengeResponse}
              onChange={(event) => handleContextChange('challengeResponse', event.target.value)}
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
            <span>Mondeling en schriftelijk functioneren</span>
            <select
              value={contextInput.expressionDifference}
              onChange={(event) => handleContextChange('expressionDifference', event.target.value)}
            >
              {EXPRESSION_OPTIONS.map((option) => (
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
              onChange={(event) => handleContextChange('knownSupportInfoPresence', event.target.value)}
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
              onChange={(event) => handleContextChange('knownSupportInfoNote', event.target.value)}
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

        <p className="helper-text compact-helper">
          {getCategoryHelpText(currentObservationItem.category)}
        </p>

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
    const overlapSupportItems = getOverlapSupportItems(profileBase);

    return (
      <div className="output-column">
        <article className="panel result-panel">
          <div className="panel-head">
            <div>
              <p className="section-label">Profielbeeld</p>
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

          {overlapProfile && (
            <div className="result-note-block">
              <strong>Overlap</strong>
              <p>
                Meerdere profielen kunnen kenmerken delen. Profieloverlap komt in de praktijk regelmatig voor. De tool gebruikt profielen als interpretatiekader en niet als diagnose.
              </p>
            </div>
          )}
        </article>

        <article className="panel">
          <p className="section-label">Waarom deze uitkomst?</p>
          <div className="why-block">
            <div className="why-section">
              <strong>Observaties die het zwaarst meewogen</strong>
              <ul className="list compact-list">
                {(profileBase.strongestObservations || []).length > 0 ? (
                  profileBase.strongestObservations.slice(0, 5).map((item) => (
                    <li key={item.id}>
                      {toDisplay(item.prompt)}
                      <span className="inline-meta"> ({item.strengthLabel})</span>
                    </li>
                  ))
                ) : (
                  <li>Er zijn nog geen observaties die een duidelijke profielrichting dragen.</li>
                )}
              </ul>
            </div>

            {overlapProfile && (
              <div className="why-section">
                <strong>Signalen die overlap ondersteunen</strong>
                <ul className="list compact-list">
                  {overlapSupportItems.length > 0 ? (
                    overlapSupportItems.map((item) => (
                      <li key={item.id}>
                        {toDisplay(item.prompt)}
                        <span className="inline-meta"> ({item.strengthLabel})</span>
                      </li>
                    ))
                  ) : (
                    <li>De overlap wordt vooral zichtbaar in het totale patroon van observaties.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </article>

        <article className="panel">
          <p className="section-label">Prestatiebeeld en discrepanties</p>
          <h3>{toDisplay(interpretation.performanceLabel)}</h3>
          <p>{toDisplay(interpretation.performanceSummary)}</p>
          <p className="helper-text discrepancy-helper">
            Verschillen tussen observaties en toetsgegevens kunnen wijzen op onderpresteren, wisselend functioneren of maskering van mogelijkheden of ondersteuningsbehoeften. Deze duiding is ondersteunend en niet-diagnostisch.
          </p>
          {interpretation.discrepancySignals.length > 0 ? (
            <ul className="list compact-list">
              {interpretation.discrepancySignals.map((signal) => (
                <li key={signal}>{toDisplay(signal)}</li>
              ))}
            </ul>
          ) : (
            <p className="helper-text">Op basis van de huidige invoer zijn er nog geen expliciete discrepantiesignalen zichtbaar.</p>
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
          <button type="button" className="primary-button" onClick={handlePrintReport}>
            Print / PDF
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
              Deze tool ondersteunt leerkrachten stap voor stap bij het vormen van een werkhypothese over profiel, overlap, prestatiebeeld en passende onderwijsbehoeften.
            </p>
            <div className="meta-pills">
              <span className="pill">{answeredObservationCount} observaties ingevuld</span>
              {currentStepConfig.key === 'observations' ? (
                <span className="pill">Vraag {currentObservationIndex + 1} van {observationItems.length}</span>
              ) : (
                <span className="pill">Stap {currentStep + 1} van {steps.length}</span>
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
        <div className="modal-backdrop" onClick={() => setIsProfileModalOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
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
    </div>
  );
}

export default App;