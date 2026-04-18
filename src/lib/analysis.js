import observationItems from '../data/observationItems';

export const PROFILE_IDS = [
  'type1',
  'type2',
  'type3',
  'type4',
  'type5',
  'type6'
];

export const PROFILE_DIRECTION_THRESHOLDS = {
  minimumTopScore: 12,
  clearDifference: 5,
  cautiousDifference: 2
};

const CATEGORY_POINTS = {
  core: [0, 2, 4, 6],
  supporting: [0, 1, 2, 3]
};

const TEST_LEVEL_MAP = {
  unknown: null,
  veryStrong: 4,
  strong: 3,
  average: 2,
  vulnerable: 1,
  weak: 0
};

export function normalizeText(text) {
  if (typeof text !== 'string') return text;

  return text
    .replaceAll('ÃƒÆ’Ã‚Â«', 'ë')
    .replaceAll('ÃƒÆ’Ã‚Â©', 'é')
    .replaceAll('ÃƒÆ’Ã‚Â¯', 'ï')
    .replaceAll('ÃƒÆ’Ã‚Â¼', 'ü')
    .replaceAll('ÃƒÆ’Ã‚Â¶', 'ö')
    .replaceAll('ÃƒÆ’Ã‚Â¡', 'á')
    .replaceAll('ÃƒÆ’Ã‚Â¨', 'è')
    .replaceAll('ÃƒÆ’', 'à')
    .replaceAll('ÃƒÂ«', 'ë')
    .replaceAll('ÃƒÂ©', 'é')
    .replaceAll('ÃƒÂ¯', 'ï')
    .replaceAll('ÃƒÂ¼', 'ü')
    .replaceAll('ÃƒÂ¶', 'ö')
    .replaceAll('ÃƒÂ¡', 'á')
    .replaceAll('ÃƒÂ¨', 'è')
    .replaceAll('Ã«', 'ë')
    .replaceAll('Ã©', 'é')
    .replaceAll('Ã¯', 'ï')
    .replaceAll('Ã¼', 'ü')
    .replaceAll('Ã¶', 'ö')
    .replaceAll('Ã¡', 'á')
    .replaceAll('Ã¨', 'è')
    .replaceAll('Ã³', 'ó')
    .replaceAll('â€™', "'")
    .replaceAll('â€“', '–')
    .replaceAll('â€”', '—')
    .replaceAll('â€œ', '"')
    .replaceAll('â€', '"');
}

function createEmptyProfileMap(initialValueFactory) {
  return Object.fromEntries(
    PROFILE_IDS.map((profileId) => [profileId, initialValueFactory(profileId)])
  );
}

function resolveDirectionLabel(topScore, secondScore) {
  if (topScore < PROFILE_DIRECTION_THRESHOLDS.minimumTopScore) {
    return 'nog onvoldoende richting';
  }

  const difference = topScore - secondScore;

  if (difference >= PROFILE_DIRECTION_THRESHOLDS.clearDifference) {
    return 'relatief duidelijke profielrichting';
  }

  if (difference >= PROFILE_DIRECTION_THRESHOLDS.cautiousDifference) {
    return 'voorzichtige profielrichting';
  }

  return 'meerdere profielen liggen dicht bij elkaar';
}

function describeStrength(answerValue) {
  if (answerValue === 3) return 'sterk zichtbaar';
  if (answerValue === 2) return 'duidelijk zichtbaar';
  if (answerValue === 1) return 'licht zichtbaar';
  return 'niet waargenomen';
}

export function analyzeProfileBase(observationAnswers) {
  const scoresByProfile = createEmptyProfileMap(() => 0);
  const supportingObservationsByProfile = createEmptyProfileMap(() => []);
  const scoreItems = observationItems.filter((item) => item.category !== 'context');
  const contextSignals = [];

  observationItems.forEach((item) => {
    const answerValue = Number(observationAnswers[item.id] ?? 0);
    if (answerValue <= 0) return;

    if (item.category === 'context') {
      contextSignals.push({
        id: item.id,
        prompt: normalizeText(item.prompt),
        strength: answerValue,
        linkedProfiles: item.profileIds
      });
      return;
    }

    const points = CATEGORY_POINTS[item.category][answerValue];
    item.profileIds.forEach((profileId) => {
      scoresByProfile[profileId] += points;
      supportingObservationsByProfile[profileId].push({
        id: item.id,
        prompt: normalizeText(item.prompt),
        category: item.category,
        scoreContribution: points,
        strength: answerValue,
        strengthLabel: describeStrength(answerValue)
      });
    });
  });

  const sortedProfiles = PROFILE_IDS.map((profileId) => ({
    profileId,
    score: scoresByProfile[profileId],
    evidence: supportingObservationsByProfile[profileId].sort(
      (left, right) => right.scoreContribution - left.scoreContribution
    )
  })).sort((left, right) => right.score - left.score);

  const topProfile = sortedProfiles[0];
  const secondProfile = sortedProfiles[1];

  return {
    scoreItems,
    scoresByProfile,
    sortedProfiles,
    topProfileId: topProfile.profileId,
    overlapProfileId:
      topProfile.score > 0 &&
      secondProfile.score > 0 &&
      topProfile.score - secondProfile.score < PROFILE_DIRECTION_THRESHOLDS.clearDifference
        ? secondProfile.profileId
        : null,
    profileDirectionLabel: resolveDirectionLabel(topProfile.score, secondProfile.score),
    topScore: topProfile.score,
    secondScore: secondProfile.score,
    contextSignals,
    strongestObservations: topProfile.evidence.slice(0, 5)
  };
}

function buildTestEvidenceEntries(testScores) {
  return Object.entries(testScores)
    .map(([key, value]) => ({
      key,
      value,
      numeric: TEST_LEVEL_MAP[value]
    }))
    .filter((entry) => entry.numeric !== null);
}

function summarizeTestLabels(entries) {
  return entries.map((entry) => `${entry.key}: ${entry.value}`).join(', ');
}

export function analyzeRichInterpretation({
  profileBase,
  zoovSignal,
  contextInput,
  homeInput,
  testScores,
  notes
}) {
  const knownTests = buildTestEvidenceEntries(testScores);
  const testValues = knownTests.map((entry) => entry.numeric);
  const averageScore =
    testValues.length > 0
      ? testValues.reduce((sum, value) => sum + value, 0) / testValues.length
      : null;
  const minScore = testValues.length > 0 ? Math.min(...testValues) : null;
  const maxScore = testValues.length > 0 ? Math.max(...testValues) : null;

  const discrepancySignals = [];
  const interpretationSignals = [...profileBase.contextSignals];

  if (contextInput.settingDifference !== 'unknown') {
    interpretationSignals.push({
      id: 'setting-difference',
      prompt: contextInput.settingDifference,
      strength: 2
    });
  }

  if (contextInput.challengeResponse !== 'unknown') {
    interpretationSignals.push({
      id: 'challenge-response',
      prompt: contextInput.challengeResponse,
      strength: 2
    });
  }

  if (homeInput.pattern !== 'unknown') {
    interpretationSignals.push({
      id: 'home-pattern',
      prompt:
        homeInput.pattern === 'contrast'
          ? 'Thuissituatie contrasteert met het schoolbeeld.'
          : 'Thuissituatie bevestigt het schoolbeeld grotendeels.',
      strength: 1
    });
  }

  let performanceLabel = 'onvoldoende toetsinformatie';
  let performanceSummary =
    'Er zijn nog te weinig toetsgegevens ingevuld om een prestatiebeeld te beschrijven.';

  if (knownTests.length > 0) {
    if (averageScore >= 3.4 && minScore >= 3) {
      performanceLabel = 'zichtbaar sterk prestatiebeeld';
    } else if (averageScore >= 2.6 && minScore >= 2) {
      performanceLabel = 'overwegend sterk prestatiebeeld';
    } else if (
      maxScore - minScore >= 3 ||
      (['begrijpendLezen', 'rekenen'].some(
        (key) => knownTests.find((entry) => entry.key === key)?.numeric >= 3
      ) &&
        ['dmt', 'avi', 'spelling'].some(
          (key) => knownTests.find((entry) => entry.key === key)?.numeric <= 1
        ))
    ) {
      performanceLabel = 'discrepantie tussen inzicht en basisvaardigheid';
    } else if (averageScore < 1.5) {
      performanceLabel = 'zwak of kwetsbaar prestatiebeeld';
    } else {
      performanceLabel = 'grillig of gemengd prestatiebeeld';
    }

    performanceSummary = `Toetsbeeld op basis van ingevulde gegevens: ${performanceLabel}. ${summarizeTestLabels(
      knownTests
    )}.`;
  }

  if (
    profileBase.topProfileId === 'type4' &&
    [
      'zwak of kwetsbaar prestatiebeeld',
      'grillig of gemengd prestatiebeeld',
      'discrepantie tussen inzicht en basisvaardigheid'
    ].includes(performanceLabel)
  ) {
    discrepancySignals.push(
      'Het profielbeeld en de toetsgegevens samen geven aanwijzingen voor mogelijke onderprestatie of mismatch met het aanbod.'
    );
  }

  if (
    profileBase.topProfileId === 'type5' &&
    ['discrepantie tussen inzicht en basisvaardigheid', 'grillig of gemengd prestatiebeeld'].includes(
      performanceLabel
    )
  ) {
    discrepancySignals.push(
      'Het profielbeeld en het toetspatroon geven aanwijzingen voor mogelijke dubbel-bijzonderheid.'
    );
  }

  if (contextInput.expressionDifference === 'oral-stronger') {
    discrepancySignals.push(
      'Er is een zichtbaar verschil tussen mondeling functioneren en schriftelijke output.'
    );
  }

  if (homeInput.pattern === 'contrast') {
    discrepancySignals.push(
      'Het beeld thuis contrasteert met het schoolbeeld en vraagt om nadere duiding in gesprek.'
    );
  }

  const interpretationSummaryParts = [];

  if (profileBase.strongestObservations.length > 0) {
    interpretationSummaryParts.push(
      `Sterkst meewegende observaties: ${profileBase.strongestObservations
        .slice(0, 3)
        .map((item) => item.prompt)
        .join('; ')}.`
    );
  }

  if (profileBase.overlapProfileId) {
    interpretationSummaryParts.push(
      'Er is inhoudelijke overlap zichtbaar met een tweede profiel, dus de werkhypothese vraagt om genuanceerde interpretatie.'
    );
  }

  if (contextInput.note.trim()) {
    interpretationSummaryParts.push(
      `Extra context uit school: ${normalizeText(contextInput.note.trim())}.`
    );
  }

  if (notes.trim()) {
    interpretationSummaryParts.push(
      `Notitie van de leerkracht: ${normalizeText(notes.trim())}.`
    );
  }

  return {
    performanceLabel,
    performanceSummary,
    discrepancySignals,
    interpretationSignals,
    interpretationSummary: interpretationSummaryParts.join(' '),
    knownTests
  };
}

export function buildProfileScoreOverview(profileBase, profilesById) {
  return profileBase.sortedProfiles.map((item) => ({
    profileId: item.profileId,
    title: normalizeText(profilesById[item.profileId].title),
    shortTitle: normalizeText(profilesById[item.profileId].shortTitle),
    score: item.score
  }));
}