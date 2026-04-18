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

const PROFILE_ANCHOR_BOOSTS = {
  type1: {
    'Leerstof en opdrachten': 2,
    Feedback: 2,
    Leerkracht: 1
  },
  type2: {
    Leerkracht: 3,
    'Leerstof en opdrachten': 3,
    Feedback: 2,
    Leeractiviteiten: 1
  },
  type3: {
    Leeromgeving: 3,
    Feedback: 2,
    Groepsgenoten: 2,
    Leerkracht: 1
  },
  type4: {
    Leerkracht: 3,
    Leeromgeving: 3,
    'Leerstof en opdrachten': 2,
    Feedback: 1
  },
  type5: {
    Instructie: 4,
    'Leerstof en opdrachten': 4,
    Leeractiviteiten: 3,
    Feedback: 2,
    Leerkracht: 1
  },
  type6: {
    'Leerstof en opdrachten': 3,
    Leeractiviteiten: 3,
    Feedback: 2,
    Leerkracht: 1
  }
};

const AREA_BOOSTS = {
  underachievement: ['Leerkracht', 'Leeromgeving', 'Leerstof en opdrachten'],
  twiceExceptional: ['Instructie', 'Leerstof en opdrachten', 'Leeractiviteiten', 'Feedback'],
  oralWrittenGap: ['Instructie', 'Leeractiviteiten', 'Feedback'],
  socialVisibility: ['Leeromgeving', 'Feedback', 'Groepsgenoten'],
  selfDirection: ['Leerstof en opdrachten', 'Leeractiviteiten', 'Leerkracht']
};

/*
  Gewogen contextkoppeling:
  - primary = gebied dat het meest direct geraakt wordt
  - secondary = logisch volgend gebied
  - tertiary = ondersteunend gebied
*/
const CONTEXT_SIGNAL_AREA_WEIGHTS = {
  'ctx-small-group-stronger': {
    Leeromgeving: 4,
    Feedback: 2,
    Groepsgenoten: 1
  },
  'ctx-opens-up-with-choice': {
    Leeractiviteiten: 3,
    'Leerstof en opdrachten': 2,
    Instructie: 1
  },
  'ctx-peer-match-helps': {
    Groepsgenoten: 3,
    Leeromgeving: 1
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

const CONTEXT_SIGNAL_REASON_TEXT = {
  'ctx-small-group-stronger':
    'De leerling laat in een kleinere of veiligere setting meer zien.',
  'ctx-opens-up-with-choice':
    'De leerling toont meer betrokkenheid wanneer er keuzevrijheid is.',
  'ctx-peer-match-helps':
    'De leerling functioneert sterker bij cognitief of inhoudelijk passende peers.',
  'ctx-drops-with-repetition':
    'De leerling zakt zichtbaar weg bij herhalende of te makkelijke taken.',
  'ctx-oral-written-gap':
    'De leerling laat in gesprek meer zien dan in schriftelijk werk.'
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

function applyAnchorBoosts(areaScores, profileId) {
  const boosts = PROFILE_ANCHOR_BOOSTS[profileId] || {};
  Object.entries(boosts).forEach(([area, amount]) => {
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

function signalMatchesProfiles(signal, topProfileId, overlapProfileId) {
  const linked = signal.linkedProfiles || [];
  return linked.includes(topProfileId) || (overlapProfileId && linked.includes(overlapProfileId));
}

function applyWeightedContextBoost(areaScores, signal, topProfileId, overlapProfileId) {
  const areaWeights = CONTEXT_SIGNAL_AREA_WEIGHTS[signal.id];
  if (!areaWeights) return;

  const multiplier = getContextStrengthMultiplier(signal.strength);
  const alignmentMultiplier = signalMatchesProfiles(signal, topProfileId, overlapProfileId)
    ? 1
    : 0.5;

  Object.entries(areaWeights).forEach(([area, weight]) => {
    if (area in areaScores) {
      areaScores[area] += Math.round(weight * 1.5 * multiplier * alignmentMultiplier);
    }
  });
}

function getPrimaryContextArea(signalId) {
  const weights = CONTEXT_SIGNAL_AREA_WEIGHTS[signalId];
  if (!weights) return null;

  return Object.entries(weights).sort((left, right) => right[1] - left[1])[0][0];
}

function getForcedContextAreas(signal, topProfileId, overlapProfileId) {
  if (signal.strength !== 3) return [];
  if (!signalMatchesProfiles(signal, topProfileId, overlapProfileId)) return [];

  if (signal.id === 'ctx-small-group-stronger') {
    return ['Leeromgeving'];
  }

  const primaryArea = getPrimaryContextArea(signal.id);
  return primaryArea ? [primaryArea] : [];
}

function findRelevantContextSignalForArea(contextSignals, area) {
  const matchingSignals = contextSignals.filter((signal) =>
    Object.prototype.hasOwnProperty.call(
      CONTEXT_SIGNAL_AREA_WEIGHTS[signal.id] || {},
      area
    )
  );

  if (matchingSignals.length === 0) return null;

  return matchingSignals.sort((left, right) => {
    const leftWeight =
      (CONTEXT_SIGNAL_AREA_WEIGHTS[left.id] || {})[area] || 0;
    const rightWeight =
      (CONTEXT_SIGNAL_AREA_WEIGHTS[right.id] || {})[area] || 0;

    if (rightWeight !== leftWeight) return rightWeight - leftWeight;
    return right.strength - left.strength;
  })[0];
}

function buildPrioritizedAreaNames(areaScores, activeContextSignals, topProfileId, overlapProfileId) {
  const sortedAreas = Object.entries(areaScores)
    .filter(([area]) => area !== 'Thuissituatie / ouders')
    .sort((left, right) => right[1] - left[1])
    .map(([area]) => area);

  const prioritized = sortedAreas.slice(0, 4);

  const forcedAreas = unique(
    activeContextSignals.flatMap((signal) =>
      getForcedContextAreas(signal, topProfileId, overlapProfileId)
    )
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

function applyStep3Boosts(areaScores, contextInput) {
  if (
    contextInput.challengeResponse ===
    'De leerling laat meer betrokkenheid zien wanneer het werk compact en echt uitdagend is.'
  ) {
    areaScores['Leerstof en opdrachten'] += 2;
    areaScores.Leeractiviteiten += 2;
  }

  if (
    contextInput.challengeResponse ===
    'De leerling laat meer weerstand zien wanneer taken herhalend of te makkelijk zijn.'
  ) {
    areaScores['Leerstof en opdrachten'] += 2;
    areaScores.Leeractiviteiten += 2;
    areaScores.Instructie += 1;
  }

  if (
    contextInput.challengeResponse ===
    'De leerling laat juist meer stabiliteit zien wanneer taken voorspelbaar en duidelijk begrensd zijn.'
  ) {
    areaScores.Instructie += 2;
    areaScores.Leeromgeving += 2;
  }

  if (
    contextInput.settingDifference ===
    'De leerling laat in een kleiner of veiliger verband meer zien dan in de hele groep.'
  ) {
    areaScores.Leeromgeving += 2;
    areaScores.Feedback += 1;
  }

  if (
    contextInput.settingDifference ===
    'De leerling laat juist in verrijking of bij sterke peers meer initiatief en inhoud zien.'
  ) {
    areaScores.Groepsgenoten += 2;
    areaScores['Leerstof en opdrachten'] += 2;
    areaScores.Leeractiviteiten += 1;
  }

  if (
    contextInput.settingDifference ===
    'Het zichtbare functioneren verschilt sterk per les, taak of setting.'
  ) {
    areaScores.Leerkracht += 2;
    areaScores.Leeromgeving += 2;
  }
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

  applyAnchorBoosts(areaScores, topProfile.id);

  const overlapDifference = profileBase.topScore - profileBase.secondScore;
  const overlapIsTight = overlapProfile && overlapDifference <= 2;
  const overlapIsRelevant = overlapProfile && overlapDifference <= 4;

  if (overlapIsRelevant) {
    PROFILE_PRIORITY_AREAS[overlapProfile.id].forEach((area, index) => {
      const contribution = overlapIsTight
        ? [2, 2, 1, 1, 0][index] ?? 0
        : [1, 1, 0, 0, 0][index] ?? 0;

      areaScores[area] += contribution;
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
    applyWeightedContextBoost(
      areaScores,
      signal,
      topProfile.id,
      overlapProfile?.id || null
    );
  });

  applyStep3Boosts(areaScores, contextInput);

  const prioritizedAreaNames = buildPrioritizedAreaNames(
    areaScores,
    activeContextSignals,
    topProfile.id,
    overlapProfile?.id || null
  );

  const prioritizedNeeds = prioritizedAreaNames.map((area) => {
    const primaryNeed = topNeedMap[area];
    const overlapNeed = overlapNeedMap[area];
    const reasonParts = [
      `Sluit aan bij ${normalizeText(topProfile.shortTitle).toLowerCase()}.`
    ];

    if (overlapIsTight && overlapNeed) {
      reasonParts.push(
        `Wordt extra relevant door overlap met ${normalizeText(
          overlapProfile.shortTitle
        ).toLowerCase()}.`
      );
    }

    const relevantContextSignal = findRelevantContextSignalForArea(
      activeContextSignals,
      area
    );

    if (relevantContextSignal) {
      reasonParts.push(
        CONTEXT_SIGNAL_REASON_TEXT[relevantContextSignal.id] ||
          normalizeText(relevantContextSignal.prompt)
      );
    }

    if (
      area === 'Instructie' &&
      interpretation.discrepancySignals.some((signal) =>
        signal.toLowerCase().includes('schriftelijke output')
      )
    ) {
      reasonParts.push(
        'Helpt om denken zichtbaar te maken zonder dat schriftelijke uitvoering direct blokkeert.'
      );
    }

    if (
      area === 'Leeromgeving' &&
      contextInput.settingDifference !== 'unknown'
    ) {
      reasonParts.push(
        'De setting lijkt invloed te hebben op wat deze leerling laat zien.'
      );
    }

    if (
      area === 'Leerkracht' &&
      interpretation.discrepancySignals.some((signal) =>
        signal.toLowerCase().includes('onderprestatie')
      )
    ) {
      reasonParts.push(
        'Een beschikbare en heldere leerkracht is hier waarschijnlijk de ingang tot herstel van betrokkenheid.'
      );
    }

    const adviceText = overlapIsTight && overlapNeed
      ? `${normalizeText(primaryNeed.advice)} Daarnaast is het helpend om ook mee te nemen dat ${normalizeText(
          overlapNeed.advice
        )
          .charAt(0)
          .toLowerCase()}${normalizeText(overlapNeed.advice).slice(1)}`
      : normalizeText(primaryNeed.advice);

    return {
      area,
      need: normalizeText(primaryNeed.need),
      advice: adviceText,
      reason: reasonParts.join(' '),
      sharedByOverlap: Boolean(overlapIsTight && overlapNeed)
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
    action: need.advice
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