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
  overlapDifference: 2,
  clearDifference: 4,
  minimumType5Score: 4
};

const CATEGORY_POINTS = {
  coreUnique: [0, 1, 2, 3],
  coreShared: [0, 1, 1, 2],
  supportingUnique: [0, 1, 1, 2],
  supportingShared: [0, 0, 1, 1]
};

const TEST_LEVEL_MAP = {
  unknown: null,
  veryStrong: 4,
  strong: 3,
  average: 2,
  vulnerable: 1,
  weak: 0
};

const TYPE2_ANCHOR_ITEMS = [
  'obs-critical-rules',
  'obs-original-ideas',
  'obs-discussion-overtakes-task'
];

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

function describeStrength(answerValue) {
  if (answerValue === 3) return 'duidelijk en consistent zichtbaar';
  if (answerValue === 2) return 'regelmatig zichtbaar';
  if (answerValue === 1) return 'soms zichtbaar';
  return 'niet waargenomen';
}

function createEvidenceFlags() {
  return {
    type5: {
      hasStrengthIndicator: false,
      hasExecutionMismatchIndicator: false,
      hasKnownSupportInfoContext: false
    }
  };
}

function getPointKey(item) {
  const isShared = item.profileIds.length > 1;

  if (item.category === 'core') {
    return isShared ? 'coreShared' : 'coreUnique';
  }

  return isShared ? 'supportingShared' : 'supportingUnique';
}

function applyContraIndicators(scoresByProfile, observationAnswers) {
  const strongType6Items = [
    'obs-seeks-extra-challenge',
    'obs-sets-goals',
    'obs-uses-errors-for-learning',
    'obs-sustains-challenging-task'
  ];

  const strongType6Count = strongType6Items.filter(
    (id) => Number(observationAnswers[id] ?? 0) >= 2
  ).length;

  if (strongType6Count >= 2) {
    scoresByProfile.type1 = Math.max(0, scoresByProfile.type1 - 1);
    scoresByProfile.type4 = Math.max(0, scoresByProfile.type4 - 1);
  }

  const strongType1Items = ['obs-seeks-confirmation', 'obs-safe-approach'];
  const strongType1Count = strongType1Items.filter(
    (id) => Number(observationAnswers[id] ?? 0) >= 2
  ).length;

  if (strongType1Count >= 2) {
    scoresByProfile.type6 = Math.max(0, scoresByProfile.type6 - 1);
  }
}

function applyType2AnchorRule(scoresByProfile, observationAnswers) {
  const strongAnchorCount = TYPE2_ANCHOR_ITEMS.filter(
    (id) => Number(observationAnswers[id] ?? 0) >= 2
  ).length;

  if (strongAnchorCount === 0) {
    scoresByProfile.type2 = Math.max(0, scoresByProfile.type2 - 3);
    return;
  }

  if (strongAnchorCount === 1) {
    scoresByProfile.type2 = Math.max(0, scoresByProfile.type2 - 1);
  }
}

function validateProfileEligibility(profileId, evidenceFlags, score) {
  if (profileId !== 'type5') {
    return {
      status: 'regular'
    };
  }

  const flags = evidenceFlags.type5;

  if (
    flags.hasKnownSupportInfoContext &&
    flags.hasStrengthIndicator &&
    flags.hasExecutionMismatchIndicator &&
    score >= PROFILE_DIRECTION_THRESHOLDS.minimumType5Score
  ) {
    return {
      status: 'regular'
    };
  }

  return {
    status: 'insufficient'
  };
}

function applyEligibilityAdjustments(scoresByProfile, evidenceFlags) {
  const flags = evidenceFlags.type5;

  const type5Eligible =
    flags.hasKnownSupportInfoContext &&
    flags.hasStrengthIndicator &&
    flags.hasExecutionMismatchIndicator &&
    scoresByProfile.type5 >= PROFILE_DIRECTION_THRESHOLDS.minimumType5Score;

  if (!type5Eligible) {
    scoresByProfile.type5 = 0;
  }
}

function buildEvidenceQuality(topProfile, secondProfile) {
  if (!topProfile || topProfile.score <= 0) return 'low';

  const topEvidenceCount = topProfile.evidence.length;
  const secondScore = secondProfile?.score ?? 0;
  const scoreGap = topProfile.score - secondScore;

  if (topProfile.status.status === 'insufficient') {
    return 'low';
  }

  if (topProfile.score >= 8 && scoreGap >= 3 && topEvidenceCount >= 3) {
    return 'high';
  }

  if (topProfile.score >= 5 && topEvidenceCount >= 2) {
    return 'medium';
  }

  return 'low';
}

function buildStrongestObservations(topProfile, secondProfile, includeOverlap) {
  if (!topProfile || topProfile.score <= 0) return [];

  const sourceItems = includeOverlap
    ? [...topProfile.evidence, ...(secondProfile?.evidence || [])]
    : [...topProfile.evidence];

  const uniqueById = new Map();

  sourceItems.forEach((item) => {
    const existing = uniqueById.get(item.id);

    if (!existing || item.scoreContribution > existing.scoreContribution) {
      uniqueById.set(item.id, item);
    }
  });

  return [...uniqueById.values()]
    .sort((left, right) => {
      if (right.scoreContribution !== left.scoreContribution) {
        return right.scoreContribution - left.scoreContribution;
      }

      return right.strength - left.strength;
    })
    .slice(0, 5);
}

function getMainProfiles(sortedProfiles) {
  return sortedProfiles.filter((item) => item.profileId !== 'type5');
}

export function analyzeProfileBase(observationAnswers, contextInput = {}) {
  const rawScoresByProfile = createEmptyProfileMap(() => 0);
  const scoresByProfile = createEmptyProfileMap(() => 0);
  const supportingObservationsByProfile = createEmptyProfileMap(() => []);
  const scoreItems = observationItems.filter((item) => item.category !== 'context');
  const contextSignals = [];
  const evidenceFlags = createEvidenceFlags();

  const positiveObservationCount = observationItems.filter(
    (item) => Number(observationAnswers[item.id] ?? 0) > 0
  ).length;

  if (contextInput.knownSupportInfoPresence === 'yes') {
    evidenceFlags.type5.hasKnownSupportInfoContext = true;
  }

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

      if (item.id === 'ctx-oral-written-gap') {
        evidenceFlags.type5.hasExecutionMismatchIndicator = true;
      }

      return;
    }

    if (
      item.id === 'obs-written-less-than-thinking' ||
      item.id === 'obs-strong-insight-weak-product'
    ) {
      evidenceFlags.type5.hasStrengthIndicator = true;
      evidenceFlags.type5.hasExecutionMismatchIndicator = true;
    }

    if (
      item.id === 'obs-planning-organization' ||
      item.id === 'obs-inconsistent-quality'
    ) {
      evidenceFlags.type5.hasExecutionMismatchIndicator = true;
    }

    const pointKey = getPointKey(item);
    const points = CATEGORY_POINTS[pointKey][answerValue];

    item.profileIds.forEach((profileId) => {
      rawScoresByProfile[profileId] += points;
      scoresByProfile[profileId] += points;
      supportingObservationsByProfile[profileId].push({
        id: item.id,
        prompt: normalizeText(item.prompt),
        category: item.category,
        scoreContribution: points,
        strength: answerValue,
        strengthLabel: describeStrength(answerValue),
        distinction: item.profileIds.length > 1 ? 'shared' : 'unique'
      });
    });
  });

  applyContraIndicators(scoresByProfile, observationAnswers);
  applyType2AnchorRule(scoresByProfile, observationAnswers);
  applyEligibilityAdjustments(scoresByProfile, evidenceFlags);

  const profileStatusById = Object.fromEntries(
    PROFILE_IDS.map((profileId) => [
      profileId,
      validateProfileEligibility(profileId, evidenceFlags, scoresByProfile[profileId])
    ])
  );

  const sortedProfiles = PROFILE_IDS.map((profileId) => ({
    profileId,
    rawScore: rawScoresByProfile[profileId],
    score: scoresByProfile[profileId],
    status: profileStatusById[profileId],
    evidence: supportingObservationsByProfile[profileId].sort(
      (left, right) => right.scoreContribution - left.scoreContribution
    )
  })).sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    if (left.status.status !== right.status.status) {
      const rank = { regular: 2, insufficient: 0 };
      return rank[right.status.status] - rank[left.status.status];
    }
    return right.rawScore - left.rawScore;
  });

  const mainProfiles = getMainProfiles(sortedProfiles);
  const mainTopProfile = mainProfiles[0] || null;
  const mainSecondProfile = mainProfiles[1] || null;
  const type5Profile = sortedProfiles.find((item) => item.profileId === 'type5');

  const type5Eligible =
    Boolean(type5Profile) &&
    type5Profile.status.status === 'regular' &&
    type5Profile.score > 0;

  let topProfile = null;
  let overlapProfile = null;
  let directionKey = 'no_signal';

  if (type5Eligible) {
    topProfile = type5Profile;
    overlapProfile =
      mainTopProfile && mainTopProfile.score > 0 ? mainTopProfile : null;
    directionKey = overlapProfile ? 'overlap' : 'single';
  } else if (mainTopProfile && mainTopProfile.score > 0) {
    const overlapDifference =
      mainTopProfile.score - (mainSecondProfile?.score ?? 0);

    const hasMeaningfulOverlap =
      (mainSecondProfile?.score ?? 0) > 0 &&
      overlapDifference <= PROFILE_DIRECTION_THRESHOLDS.overlapDifference;

    topProfile = mainTopProfile;
    overlapProfile = hasMeaningfulOverlap ? mainSecondProfile : null;
    directionKey = hasMeaningfulOverlap ? 'overlap' : 'single';
  }

  const hasNoProfileSignal =
    positiveObservationCount === 0 || !topProfile || topProfile.score <= 0;

  if (hasNoProfileSignal) {
    topProfile = null;
    overlapProfile = null;
    directionKey = 'no_signal';
  }

  const evidenceQuality = buildEvidenceQuality(topProfile, overlapProfile);
  const strongestObservations = buildStrongestObservations(
    topProfile,
    overlapProfile,
    Boolean(overlapProfile)
  );

  return {
    scoreItems,
    rawScoresByProfile,
    scoresByProfile,
    sortedProfiles,
    profileStatusById,
    evidenceFlags,
    positiveObservationCount,
    hasNoProfileSignal,
    hasMeaningfulOverlap: Boolean(overlapProfile),
    directionKey,
    topProfileId: topProfile ? topProfile.profileId : null,
    overlapProfileId: overlapProfile ? overlapProfile.profileId : null,
    topScore: topProfile ? topProfile.score : 0,
    secondScore: overlapProfile ? overlapProfile.score : 0,
    contextSignals,
    strongestObservations,
    evidenceQuality,
    overlapDifference:
      topProfile && overlapProfile ? topProfile.score - overlapProfile.score : 0
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

  if (contextInput.knownSupportInfoPresence === 'yes') {
    interpretationSignals.push({
      id: 'known-support-info',
      prompt:
        contextInput.knownSupportInfoNote?.trim()
          ? `Bekende dossierinformatie over relevante ondersteuningsinformatie: ${contextInput.knownSupportInfoNote.trim()}`
          : 'Er is bekende dossierinformatie over relevante ondersteuningsinformatie.',
      strength: 2
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
    contextInput.knownSupportInfoPresence === 'yes' &&
    ['discrepantie tussen inzicht en basisvaardigheid', 'grillig of gemengd prestatiebeeld'].includes(
      performanceLabel
    )
  ) {
    discrepancySignals.push(
      'Er zijn signalen die kunnen passen bij een profielrichting waarin sterke kanten en bekende ondersteuningsinformatie samen aandacht vragen.'
    );
  }

  if (
    ['type1', 'type2', 'type6'].includes(profileBase.topProfileId) &&
    ['zwak of kwetsbaar prestatiebeeld', 'grillig of gemengd prestatiebeeld'].includes(
      performanceLabel
    )
  ) {
    discrepancySignals.push(
      'De lagere of wisselende resultaten passen niet vanzelfsprekend bij deze profielrichting. Het is verstandig te verkennen waardoor deze prestaties ontstaan.'
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

  if (contextInput.knownSupportInfoPresence === 'yes') {
    interpretationSummaryParts.push(
      'Bekende dossierinformatie vraagt om terughoudende interpretatie van het profielbeeld en om afstemming tussen uitdaging en ondersteuning.'
    );
  }

  if (notes?.trim()) {
    interpretationSummaryParts.push(`Notities: ${notes.trim()}`);
  }

  return {
    knownTests,
    performanceLabel,
    performanceSummary,
    discrepancySignals,
    interpretationSignals,
    interpretationSummary: interpretationSummaryParts.join(' '),
    knownSupportInfoPresence: contextInput.knownSupportInfoPresence,
    knownSupportInfoNote: contextInput.knownSupportInfoNote || ''
  };
}

export function buildProfileScoreOverview(profileBase, profilesById) {
  return profileBase.sortedProfiles.map((item) => {
    const profile = profilesById[item.profileId];

    return {
      profileId: item.profileId,
      shortTitle: normalizeText(profile.shortTitle),
      title: normalizeText(profile.title),
      score: item.score,
      rawScore: item.rawScore,
      status: item.status
    };
  });
}