import { normalizeText } from './analysis.js';

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
  'ctx-peer-match-helps': {
    Groepsgenoten: 1
  }
};

const CONTEXT_SIGNAL_REASON_TEXT = {
  'ctx-small-group-stronger':
    'De leerling laat in een kleinere of veiligere setting meer zien.',
  'ctx-peer-match-helps':
    'De leerling functioneert sterker bij cognitief of inhoudelijk passende peers.'
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
    const leftWeight = (CONTEXT_SIGNAL_AREA_WEIGHTS[left.id] || {})[area] || 0;
    const rightWeight = (CONTEXT_SIGNAL_AREA_WEIGHTS[right.id] || {})[area] || 0;

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

function combineNeedText(primaryText, overlapText, overlapShortTitle) {
  if (!primaryText) return overlapText || '';
  if (!overlapText || primaryText === overlapText) return primaryText;

  return `${primaryText} Vanuit de overlap met ${normalizeText(
    overlapShortTitle
  ).toLowerCase()} vraagt dit daarnaast om: ${overlapText}`;
}

function combineAdviceText(primaryText, overlapText, overlapShortTitle) {
  if (!primaryText) return overlapText || '';
  if (!overlapText || primaryText === overlapText) return primaryText;

  return `${primaryText} Combineer dit, waar passend, met een aanpak die ook recht doet aan ${normalizeText(
    overlapShortTitle
  ).toLowerCase()}: ${overlapText}`;
}

function buildType5AccentAreaNames(overlapProfileId) {
  if (!overlapProfileId || !(overlapProfileId in PROFILE_PRIORITY_AREAS)) return [];

  return PROFILE_PRIORITY_AREAS[overlapProfileId].slice(0, 2);
}

function combineType5AccentText(primaryText, overlapText, overlapShortTitle) {
  if (!overlapText) return primaryText || '';
  if (!primaryText) return overlapText;

  return `${primaryText} Aanvullend vraagt de overlap met ${normalizeText(
    overlapShortTitle
  ).toLowerCase()} hier ook om: ${overlapText}`;
}

function buildGenericNoSignalAdvice() {
  return {
    prioritizedNeeds: [
      {
        area: 'Leerstof en opdrachten',
        need:
          'Er is nog geen specifieke profielrichting zichtbaar. Het helpt om te observeren wat er gebeurt wanneer de leerling compactere, betekenisvollere of uitdagendere taken krijgt.',
        advice:
          'Bied tijdelijk een kleine, duidelijk afgebakende verrijkings- of verdiepingsopdracht aan en kijk of betrokkenheid, initiatief of kwaliteit van denken dan verandert.',
        reason:
          'Zonder positieve profielsignalen zegt vooral de reactie op aangepast aanbod iets over verdere duiding.'
      },
      {
        area: 'Leeractiviteiten',
        need:
          'Er is behoefte aan zicht op hoe de leerling functioneert bij verschillende vormen van werken, zoals zelfstandig, in klein verband of mondeling.',
        advice:
          'Vergelijk doelgericht meerdere situaties: klassikaal, individueel, mondeling, schriftelijk en bij open of gesloten opdrachten.',
        reason:
          'Verschillen tussen situaties kunnen later richting geven aan profielduiding en onderwijsafstemming.'
      },
      {
        area: 'Leeromgeving',
        need:
          'Er is behoefte aan observaties in een omgeving waarin uitdaging en sociale veiligheid allebei aanwezig zijn.',
        advice:
          'Let erop of de leerling in een kleinere, veiligere of inhoudelijk passender setting ander gedrag laat zien dan in de hele groep.',
        reason:
          'Contextverschillen kunnen verklaren waarom profielsignalen in de gewone klassensituatie nog weinig zichtbaar zijn.'
      },
      {
        area: 'Leerkracht',
        need:
          'Er is behoefte aan gezamenlijke duiding van de observaties, zodat niet te snel een profiel wordt verondersteld of uitgesloten.',
        advice:
          'Bespreek de huidige observaties met collega of intern begeleider en spreek af welke aanvullende observaties of kleine interventies eerst worden uitgeprobeerd.',
        reason:
          'Een nulsituatie vraagt niet om forceren, maar om gerichte vervolgstappen.'
      }
    ],
    workHypothesis:
      'In de huidige observaties zijn geen duidelijke profielsignalen naar voren gekomen.',
    shortInterpretation:
      'Dat betekent niet dat er geen onderwijsbehoeften zijn, maar wel dat de ingevulde observaties op dit moment nog geen specifieke profielrichting dragen.',
    followUpSteps: [
      'Observeer opnieuw tijdens betekenisvolle of uitdagendere taken.',
      'Vergelijk het functioneren van de leerling in verschillende settings en werkvormen.',
      'Bespreek de observaties met collega of intern begeleider en bepaal welke aanvullende observaties nodig zijn.'
    ],
    caution:
      'Deze uitkomst is een werkhypothese op basis van schoolse observaties. De tool geeft hier bewust geen geforceerd profiel wanneer duidelijke profielsignalen ontbreken.',
    homeAttention: '',
    resultHeading: 'Geen duidelijke profielsignalen zichtbaar',
    resultLabel: 'Werkhypothese',
    useCombinedAdvice: false
  };
}

function buildInterpretationPrefix(profileBase, topProfile, overlapProfile) {
  if (profileBase.directionKey === 'overlap' && overlapProfile) {
    return `De observaties wijzen op een gecombineerd profielbeeld van ${normalizeText(
      topProfile.shortTitle
    ).toLowerCase()} en ${normalizeText(
      overlapProfile.shortTitle
    ).toLowerCase()}.`;
  }

  return `De observaties wijzen vooral in de richting van ${normalizeText(
    topProfile.shortTitle
  ).toLowerCase()}.`;
}

export default function buildPersonalizedAdvice({
  profileBase,
  interpretation,
  profilesById,
  contextInput,
  homeInput
}) {
  if (profileBase.directionKey === 'no_signal' || !profileBase.topProfileId) {
    return buildGenericNoSignalAdvice();
  }

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
  const overlapIsTight = overlapProfile && overlapDifference <= 1;
  const overlapIsRelevant = overlapProfile && overlapDifference <= 3;
  const hasOverlapProfile = Boolean(overlapProfile && profileBase.directionKey === 'overlap');
  const useLimitedType5Overlap = Boolean(hasOverlapProfile && topProfile.id === 'type5');
  const useCombinedAdvice = Boolean(hasOverlapProfile && !useLimitedType5Overlap);
  const type5AccentAreas = useLimitedType5Overlap
    ? buildType5AccentAreaNames(overlapProfile?.id)
    : [];

  if (overlapIsRelevant) {
    PROFILE_PRIORITY_AREAS[overlapProfile.id].forEach((area, index) => {
      const contribution = useLimitedType5Overlap
        ? [1, 1, 0, 0, 0][index] ?? 0
        : overlapIsTight
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

  if (useCombinedAdvice && overlapProfile) {
    applyProfileAreaGuards(areaScores, overlapProfile.id);
  }

  const prioritizedAreaNames = buildPrioritizedAreaNames(
    areaScores,
    activeContextSignals,
    topProfile.id,
    overlapProfile?.id || null
  );

  const prioritizedNeeds = prioritizedAreaNames.map((area) => {
    const primaryNeed = topNeedMap[area] || overlapNeedMap[area];
    const overlapNeed = overlapNeedMap[area];
    const hasType5Accent = Boolean(
      useLimitedType5Overlap &&
      overlapProfile &&
      overlapNeed &&
      type5AccentAreas.includes(area)
    );
    const reasonParts = [
      useCombinedAdvice && overlapProfile
        ? `Gebaseerd op de gecombineerde werkhypothese van ${normalizeText(
            topProfile.shortTitle
          ).toLowerCase()} en ${normalizeText(
            overlapProfile.shortTitle
          ).toLowerCase()}.`
        : `Sluit aan bij ${normalizeText(topProfile.shortTitle).toLowerCase()}.`
    ];

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
      (topProfile.id === 'type5' || overlapProfile?.id === 'type5')
    ) {
      reasonParts.push(
        'Bekende dossierinformatie vraagt om een combinatie van uitdaging en passende ondersteuning.'
      );
    }

    if (useLimitedType5Overlap && hasType5Accent && overlapProfile) {
      reasonParts.push(
        `De overlap met ${normalizeText(
          overlapProfile.shortTitle
        ).toLowerCase()} geeft op dit behoeftegebied aanvullende richting.`
      );
    }

    return {
      area,
      need:
        useCombinedAdvice && overlapProfile
          ? combineNeedText(
              primaryNeed?.need || '',
              overlapNeed?.need || '',
              overlapProfile.shortTitle
            )
          : hasType5Accent && overlapProfile
            ? combineType5AccentText(
                primaryNeed?.need || '',
                overlapNeed?.need || '',
                overlapProfile.shortTitle
              )
            : primaryNeed?.need || '',
      advice:
        useCombinedAdvice && overlapProfile
          ? combineAdviceText(
              primaryNeed?.advice || '',
              overlapNeed?.advice || '',
              overlapProfile.shortTitle
            )
          : hasType5Accent && overlapProfile
            ? combineType5AccentText(
                primaryNeed?.advice || '',
                overlapNeed?.advice || '',
                overlapProfile.shortTitle
              )
            : primaryNeed?.advice || '',
      reason: reasonParts.join(' '),
      sharedByOverlap: Boolean(
        (useCombinedAdvice && overlapNeed) || hasType5Accent
      )
    };
  });

  const intro = buildInterpretationPrefix(profileBase, topProfile, overlapProfile);

  let workHypothesis = topProfile.interpretation;
  let shortInterpretation = intro;

  if (useCombinedAdvice && overlapProfile) {
    workHypothesis = `${topProfile.interpretation} Daarnaast laat de overlap met ${normalizeText(
      overlapProfile.shortTitle
    ).toLowerCase()} zien dat ook deze lijn moet worden meegelezen: ${overlapProfile.interpretation}`;
  } else if (useLimitedType5Overlap && overlapProfile) {
    workHypothesis = `${topProfile.interpretation} Daarnaast laat het profielbeeld ook kenmerken zien die deels aansluiten bij ${normalizeText(
      overlapProfile.shortTitle
    ).toLowerCase()}. Die tweede lijn wordt in het advies alleen aanvullend gebruikt waar dat echt richting geeft.`;
  }

  if (
    contextInput.knownSupportInfoPresence === 'yes' &&
    (topProfile.id === 'type5' || overlapProfile?.id === 'type5')
  ) {
    shortInterpretation +=
      ' Lees deze uitkomst steeds in samenhang met bekende dossierinformatie; de tool ondersteunt duiding van schoolfunctioneren en stelt geen diagnose.';
  } else if (contextInput.knownSupportInfoPresence === 'yes') {
    shortInterpretation +=
      ' Bekende dossierinformatie moet als aanvullende nuance naast deze profielrichting worden gelezen.';
  }

  const followUpSteps = [];

  followUpSteps.push(
    'Bespreek de werkhypothese met collega’s of intern begeleider en vertaal deze naar een korte gezamenlijke aanpak.'
  );

  if (useCombinedAdvice && overlapProfile) {
    followUpSteps.push(
      `Probeer bewust interventies uit die passen bij zowel ${normalizeText(
        topProfile.shortTitle
      ).toLowerCase()} als ${normalizeText(
        overlapProfile.shortTitle
      ).toLowerCase()}, en kijk welke combinatie het functioneren verbetert.`
    );
  } else if (useLimitedType5Overlap && overlapProfile) {
    followUpSteps.push(
      `Gebruik ${normalizeText(
        overlapProfile.shortTitle
      ).toLowerCase()} alleen als aanvullende duidlijn naast type 5 en voorkom dat het tweede profiel de hoofdstructuur van het advies overneemt.`
    );
  } else {
    followUpSteps.push(
      'Kies één of twee concrete onderwijsaanpassingen en kijk in de komende periode wat dat zichtbaar verandert in betrokkenheid, taakaanpak en leerproduct.'
    );
  }

  if (topProfile.id === 'type5') {
    followUpSteps.push(
      'Werk aan bredere beeldvorming: onderzoek in samenhang hoe sterke cognitieve kanten, uitvoeringsproblemen, bestaande ondersteuningsinformatie en schoolprestaties over tijd zich tot elkaar verhouden.'
    );
    followUpSteps.push(
      'Betrek ouders, intern begeleider en waar nodig aanvullende specialistische expertise; deze werkhypothese vervangt geen nadere beeldvorming.'
    );
  }

  if (homeInput.pattern === 'contrast') {
    followUpSteps.push(
      'Neem het contrast tussen thuis en school expliciet mee in de vervolgbespreking.'
    );
  }

  let caution =
    'Deze uitkomst is een werkhypothese op basis van observaties, context en ingevulde aanvullende informatie. De tool ondersteunt duiding en vervangt geen professionele beeldvorming.';

  if (topProfile.id === 'type5') {
    caution =
      'Deze uitkomst is een werkhypothese op basis van schoolse signalen en bekende ondersteuningsinformatie. Bij type 5 is nadere brede beeldvorming belangrijk; de tool ondersteunt die duiding maar vervangt die niet.';
  }

  let homeAttention = '';

  if (homeInput.pattern === 'contrast') {
    homeAttention =
      'De thuissituatie contrasteert met het schoolbeeld. Dat verschil verdient expliciete aandacht in de interpretatie en vervolgstappen.';
  } else if (homeInput.pattern === 'match') {
    homeAttention =
      'Het thuissignaal bevestigt het schoolbeeld grotendeels. Dat maakt de huidige werkhypothese consistenter, maar niet definitief.';
  }

  const resultHeading =
    profileBase.directionKey === 'overlap' && overlapProfile
      ? `${normalizeText(topProfile.shortTitle)} met aanvullende lijn vanuit ${normalizeText(
          overlapProfile.shortTitle
        )}`
      : normalizeText(topProfile.shortTitle);

  return {
    prioritizedNeeds,
    workHypothesis,
    shortInterpretation,
    followUpSteps,
    caution,
    homeAttention,
    resultHeading,
    resultLabel: 'Werkhypothese',
    useCombinedAdvice
  };
}