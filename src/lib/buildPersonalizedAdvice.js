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
  socialVisibility: ['Leeromgeving', 'Feedback', 'Groepsgenoten'],
  selfDirection: ['Leerstof en opdrachten', 'Leeractiviteiten', 'Leerkracht']
};

const CONTEXT_SIGNAL_AREA_WEIGHTS = {
  'ctx-small-group-stronger': {
    Leeromgeving: 4,
    Feedback: 2
  },
  'ctx-opens-up-with-choice': {
    Leeractiviteiten: 3,
    'Leerstof en opdrachten': 2,
    Instructie: 1
  },
  'ctx-peer-match-helps': {
    Groepsgenoten: 1
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
      areaScores[area] += Math.round(weight * multiplier * alignmentMultiplier);
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
    return topProfileId === 'type3' ? ['Leeromgeving'] : [];
  }

  if (signal.id === 'ctx-peer-match-helps') {
    return [];
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
    areaScores['Leerstof en opdrachten'] += 2;
    areaScores.Leeractiviteiten += 1;
    areaScores.Feedback += 1;
  }

  if (
    contextInput.settingDifference ===
    'Het zichtbare functioneren verschilt sterk per les, taak of setting.'
  ) {
    areaScores.Leerkracht += 2;
    areaScores.Leeromgeving += 2;
  }
}

function applyProfileAreaGuards(areaScores, topProfileId) {
  if (topProfileId === 'type2') {
    areaScores.Groepsgenoten = Math.max(0, areaScores.Groepsgenoten - 3);
    areaScores.Feedback += 1;
  }

  if (topProfileId === 'type5') {
    areaScores.Leeromgeving = Math.max(0, areaScores.Leeromgeving - 4);
    areaScores.Groepsgenoten = Math.max(0, areaScores.Groepsgenoten - 4);
    areaScores.Instructie += 1;
    areaScores['Leerstof en opdrachten'] += 2;
    areaScores.Feedback += 1;
  }

  if (topProfileId === 'type6') {
    areaScores.Groepsgenoten = Math.max(0, areaScores.Groepsgenoten - 3);
    areaScores.Feedback += 1;
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
      signal.toLowerCase().includes('sterke kanten en bekende ondersteuningsinformatie')
    )
  ) {
    boostAreas(areaScores, AREA_BOOSTS.twiceExceptional, 4);
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
  applyProfileAreaGuards(areaScores, topProfile.id);

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
      contextInput.knownSupportInfoPresence === 'yes' &&
      topProfile.id === 'type5'
    ) {
      reasonParts.push(
        'Bekende dossierinformatie vraagt om combinatie van uitdaging en passende ondersteuning.'
      );
    }

    return {
      area,
      need: primaryNeed?.need || '',
      advice: primaryNeed?.advice || '',
      reason: reasonParts.join(' '),
      sharedByOverlap: Boolean(overlapIsTight && overlapNeed)
    };
  });

  let workHypothesis = topProfile.interpretation;
  let shortInterpretation = `De observaties wijzen vooral in de richting van ${normalizeText(
    topProfile.shortTitle
  ).toLowerCase()} (${normalizeText(topProfile.title).toLowerCase()}).`;

  if (profileBase.profileStatusById[topProfile.id]?.status === 'cautious') {
    shortInterpretation +=
      ' Deze uitkomst vraagt terughoudende interpretatie en kan voorlopig alleen als signaleringsrichting worden gelezen.';
  }

  if (profileBase.profileStatusById[topProfile.id]?.status === 'insufficient') {
    shortInterpretation +=
      ' Deze uitkomst is op basis van de huidige informatie nog onvoldoende onderbouwd als profielrichting.';
  }

  if (
    contextInput.knownSupportInfoPresence === 'yes' &&
    topProfile.id === 'type5'
  ) {
    shortInterpretation +=
      ' Lees deze uitkomst in samenhang met bekende dossierinformatie; de tool stelt geen ondersteuningsbehoefte of diagnose vast.';
  }

  const followUpSteps = [
    'Bespreek de werkhypothese met collega’s of intern begeleider.',
    'Kijk welke onderwijsaanpassingen direct in de klas uitgeprobeerd kunnen worden.',
    'Evalueer na een periode opnieuw of de gekozen aanpak het functioneren zichtbaar verandert.'
  ];

  if (
    ['type1', 'type2', 'type6'].includes(topProfile.id) &&
    interpretation.discrepancySignals.some((signal) =>
      signal.toLowerCase().includes('lagere of wisselende resultaten')
    )
  ) {
    followUpSteps.push(
      'Verken waardoor de lagere of wisselende prestaties ontstaan voordat hieraan conclusies over profiel of ondersteuningsinformatie worden verbonden.'
    );
  }

  const caution =
    topProfile.id === 'type5'
      ? 'Type 5 wordt in deze tool alleen terughoudend gelezen. De tool signaleert patronen in schoolfunctioneren, maar stelt geen diagnose of oorzaak vast.'
      : 'Deze uitkomst is een werkhypothese op basis van schoolse observaties en aanvullende contextinformatie. Het is geen diagnose.';

  const homeAttention =
    homeInput.pattern === 'contrast'
      ? 'Het schoolbeeld contrasteert met de thuissituatie; neem dit verschil expliciet mee in verdere duiding.'
      : '';

  return {
    prioritizedNeeds,
    workHypothesis,
    shortInterpretation,
    followUpSteps,
    caution,
    homeAttention
  };
}