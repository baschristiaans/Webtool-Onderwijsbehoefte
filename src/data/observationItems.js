import { normalizeText } from './analysis';

const PROFILE_PRIORITY_AREAS = {
  type1: [
    'Leerstof en opdrachten',
    'Feedback',
    'Leerkracht',
    'Instructie',
    'Leeractiviteiten'
  ],
  type2: [
    'Leerkracht',
    'Leerstof en opdrachten',
    'Feedback',
    'Leeromgeving',
    'Leeractiviteiten'
  ],
  type3: [
    'Leeromgeving',
    'Feedback',
    'Leeractiviteiten',
    'Leerkracht',
    'Groepsgenoten'
  ],
  type4: [
    'Leerkracht',
    'Leeromgeving',
    'Leerstof en opdrachten',
    'Feedback',
    'Leeractiviteiten'
  ],
  type5: [
    'Instructie',
    'Leerstof en opdrachten',
    'Leeractiviteiten',
    'Feedback',
    'Leerkracht'
  ],
  type6: [
    'Leerstof en opdrachten',
    'Leeractiviteiten',
    'Feedback',
    'Leerkracht',
    'Instructie'
  ]
};

const AREA_BOOSTS = {
  underachievement: ['Leerkracht', 'Leeromgeving', 'Leerstof en opdrachten'],
  twiceExceptional: ['Instructie', 'Leerstof en opdrachten', 'Leeractiviteiten'],
  oralWrittenGap: ['Instructie', 'Leeractiviteiten', 'Feedback'],
  socialVisibility: ['Leeromgeving', 'Feedback', 'Groepsgenoten'],
  selfDirection: ['Leerstof en opdrachten', 'Leeractiviteiten', 'Leerkracht']
};

const CONTEXT_SIGNAL_AREA_WEIGHTS = {
  'ctx-small-group-stronger': {
    Leeromgeving: 4,
    Groepsgenoten: 3,
    Feedback: 1
  },
  'ctx-opens-up-with-choice': {
    Leeractiviteiten: 3,
    'Leerstof en opdrachten': 2,
    Instructie: 1
  },
  'ctx-peer-match-helps': {
    Groepsgenoten: 3,
    Leeromgeving: 2
  },
  'ctx-drops-with-repetition': {
    'Leerstof en opdrachten': 3,
    Leeractiviteiten: 2,
    Instructie: 1
  },
  'ctx-oral-written-gap': {
    Instructie: 3,
    Leeractiviteiten: 2,
    Feedback: 2
  }
};

function unique(items) {
  return [...new Set(items)];
}

function getNeedMap(profile) {
  return Object.fromEntries(profile.needs.map((need) => [need.area, need]));
}

function createAreaScoreMap() {
  return {
    Instructie: 0,
    'Leerstof en opdrachten': 0,
    Leeractiviteiten: 0,
    Feedback: 0,
    Leeromgeving: 0,
    Groepsgenoten: 0,
    Leerkracht: 0,
    'Thuissituatie / ouders': 0
  };
}

function boostAreas(areaScores, areas, amount) {
  areas.forEach((area) => {
    if (area in areaScores) {
      areaScores[area] += amount;
    }
  });
}

function summarizeObservations(observations) {
  return observations
    .slice(0, 3)
    .map((item) => normalizeText(item.prompt).toLowerCase())
    .join('; ');
}

function getContextStrengthMultiplier(strength) {
  if (strength === 3) return 1;
  if (strength === 2) return 0.75;
  return 0.5;
}

function applyWeightedContextBoost(areaScores, signal) {
  const areaWeights = CONTEXT_SIGNAL_AREA_WEIGHTS[signal.id];
  if (!areaWeights) return;

  const multiplier = getContextStrengthMultiplier(signal.strength);

  Object.entries(areaWeights).forEach(([area, weight]) => {
    if (area in areaScores) {
      areaScores[area] += Math.round(weight * 3 * multiplier);
    }
  });
}

function getPrimaryContextArea(signalId) {
  const weights = CONTEXT_SIGNAL_AREA_WEIGHTS[signalId];
  if (!weights) return null;

  return Object.entries(weights).sort((left, right) => right[1] - left[1])[0][0];
}

function getForcedContextAreas(signal) {
  if (signal.strength < 2) return [];

  if (signal.id === 'ctx-small-group-stronger') {
    return ['Leeromgeving', 'Groepsgenoten'];
  }

  const primaryArea = getPrimaryContextArea(signal.id);
  return primaryArea ? [primaryArea] : [];
}

function buildPrioritizedAreaNames(areaScores, activeContextSignals) {
  const sortedAreas = Object.entries(areaScores)
    .filter(([area]) => area !== 'Thuissituatie / ouders')
    .sort((left, right) => right[1] - left[1])
    .map(([area]) => area);

  const prioritized = sortedAreas.slice(0, 4);

  const forcedAreas = unique(
    activeContextSignals.flatMap((signal) => getForcedContextAreas(signal))
  );

  forcedAreas.forEach((forcedArea) => {
    if (prioritized.includes(forcedArea)) return;

    const replaceIndex = prioritized
      .map((area, index) => ({ area, index, score: areaScores[area] }))
      .sort((left, right) => left.score - right.score)
      .find((item) => !forcedAreas.includes(item.area))?.index;

    if (replaceIndex !== undefined) {
      prioritized[replaceIndex] = forcedArea;
    }
  });

  return unique(prioritized).slice(0, 4);
}

function lowerCaseFirst(text) {
  const clean = normalizeText(text);
  if (!clean) return clean;
  return clean.charAt(0).toLowerCase() + clean.slice(1);
}

function buildAdviceText(primaryNeed, overlapNeed) {
  const primaryAdvice = normalizeText(primaryNeed.advice);

  if (!overlapNeed) {
    return primaryAdvice;
  }

  const overlapAdvice = normalizeText(overlapNeed.advice);

  if (primaryAdvice === overlapAdvice) {
    return primaryAdvice;
  }

  return `${primaryAdvice} Ook helpend: ${lowerCaseFirst(overlapAdvice)}`;
}

export default function buildPersonalizedAdvice({
  profileBase,
  interpretation,
  profilesById,
  contextInput,
  homeInput
}) {
  const topProfile = profilesById[profileBase.topProfileId];
  const overlapProfile = profileBase.overlapProfileId
    ? profilesById[profileBase.overlapProfileId]
    : null;
  const topNeedMap = getNeedMap(topProfile);
  const overlapNeedMap = overlapProfile ? getNeedMap(overlapProfile) : {};
  const areaScores = createAreaScoreMap();

  const activeContextSignals = profileBase.contextSignals.filter(
    (signal) => signal.id in CONTEXT_SIGNAL_AREA_WEIGHTS
  );

  PROFILE_PRIORITY_AREAS[topProfile.id].forEach((area, index) => {
    areaScores[area] += 10 - index;
  });

  if (overlapProfile) {
    PROFILE_PRIORITY_AREAS[overlapProfile.id].forEach((area, index) => {
      areaScores[area] += 4 - Math.min(index, 3);
    });
  }

  if (
    interpretation.discrepancySignals.some((signal) =>
      signal.toLowerCase().includes('onderprestatie')
    )
  ) {
    boostAreas(areaScores, AREA_BOOSTS.underachievement, 4);
  }

  if (
    interpretation.discrepancySignals.some((signal) =>
      signal.toLowerCase().includes('dubbel-bijzonder')
    )
  ) {
    boostAreas(areaScores, AREA_BOOSTS.twiceExceptional, 4);
  }

  if (
    interpretation.discrepancySignals.some((signal) =>
      signal.toLowerCase().includes('mondeling functioneren')
    )
  ) {
    boostAreas(areaScores, AREA_BOOSTS.oralWrittenGap, 3);
  }

  if (topProfile.id === 'type3') {
    boostAreas(areaScores, AREA_BOOSTS.socialVisibility, 2);
  }

  if (topProfile.id === 'type6') {
    boostAreas(areaScores, AREA_BOOSTS.selfDirection, 2);
  }

  activeContextSignals.forEach((signal) => {
    applyWeightedContextBoost(areaScores, signal);
  });

  if (contextInput.settingDifference !== 'unknown') {
    areaScores.Leeromgeving += 1;
    areaScores.Groepsgenoten += 1;
  }

  const prioritizedAreaNames = buildPrioritizedAreaNames(
    areaScores,
    activeContextSignals
  );

  const prioritizedNeeds = prioritizedAreaNames.map((area) => {
    const primaryNeed = topNeedMap[area];
    const overlapNeed = overlapNeedMap[area];

    return {
      area,
      need: normalizeText(primaryNeed.need),
      advice: buildAdviceText(primaryNeed, overlapNeed),
      sharedByOverlap: Boolean(overlapNeed)
    };
  });

  const strongestObservationText =
    profileBase.strongestObservations.length > 0
      ? summarizeObservations(profileBase.strongestObservations)
      : 'er zijn nog te weinig sterke observaties ingevuld';

  const workHypothesis = overlapProfile
    ? `Werkhypothese: ${normalizeText(topProfile.shortTitle)} - ${normalizeText(
        topProfile.title
      )} past op dit moment het best, met inhoudelijke overlap naar ${normalizeText(
        overlapProfile.shortTitle
      )} - ${normalizeText(overlapProfile.title)}.`
    : `Werkhypothese: ${normalizeText(topProfile.shortTitle)} - ${normalizeText(
        topProfile.title
      )} past op dit moment het best bij het observeerbare functioneren in school.`;

  const shortInterpretationParts = [
    `Deze richting wordt vooral ondersteund door observaties zoals ${strongestObservationText}.`
  ];

  if (interpretation.interpretationSummary) {
    shortInterpretationParts.push(
      normalizeText(interpretation.interpretationSummary)
    );
  }

  if (interpretation.discrepancySignals.length > 0) {
    shortInterpretationParts.push(
      `Daarnaast vraagt het discrepantiebeeld aandacht: ${interpretation.discrepancySignals
        .slice(0, 2)
        .map((signal) => normalizeText(signal))
        .join(' ')}`
    );
  }

  const teacherActions = prioritizedNeeds.map((need) => ({
    area: need.area,
    action: need.advice,
    sharedByOverlap: need.sharedByOverlap
  }));

  const followUpSteps = [];

  if (profileBase.profileDirectionLabel === 'nog onvoldoende richting') {
    followUpSteps.push(
      'Observeer nog gerichter in meerdere lessituaties voordat een stevige profielrichting wordt aangehouden.'
    );
  }

  if (
    interpretation.discrepancySignals.some((signal) =>
      signal.toLowerCase().includes('schriftelijke output')
    )
  ) {
    followUpSteps.push(
      'Leg mondeling functioneren, schriftelijk werk en taakuitvoering naast elkaar om te bepalen waar de uitvoering vastloopt.'
    );
  }

  if (
    interpretation.discrepancySignals.some(
      (signal) =>
        signal.toLowerCase().includes('onderprestatie') ||
        signal.toLowerCase().includes('dubbel-bijzonder')
    )
  ) {
    followUpSteps.push(
      'Plan een gerichte leerlingbespreking met observaties, toetsgegevens en verschillen tussen taaksoorten of settings naast elkaar.'
    );
  }

  if (homeInput.pattern !== 'unknown' || homeInput.summary.trim()) {
    followUpSteps.push(
      'Neem informatie van thuis mee als context voor verdere duiding, zonder die informatie direct mee te laten tellen in de profielscore.'
    );
  }

  const homeAttention =
    homeInput.pattern !== 'unknown' || homeInput.summary.trim()
      ? normalizeText(
          topNeedMap['Thuissituatie / ouders']?.need ||
            'Thuissituatie is hier vooral een aandachtspunt voor afstemming en nadere analyse.'
        )
      : null;

  return {
    workHypothesis,
    shortInterpretation: shortInterpretationParts.join(' '),
    prioritizedNeeds,
    teacherActions,
    followUpSteps: unique(followUpSteps).slice(0, 4),
    homeAttention,
    caution:
      'Dit blijft een werkhypothese. Observeerbaar functioneren vormt de profielbasis; context, thuissituatie, ZOOV+ en toetsgegevens scherpen alleen de interpretatie aan.'
  };
}