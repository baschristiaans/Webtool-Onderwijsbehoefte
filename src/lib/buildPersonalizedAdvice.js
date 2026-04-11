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

export default function buildPersonalizedAdvice({
  profileBase,
  interpretation,
  profilesById,
  contextInput,
  homeInput,
  zoovSignal
}) {
  const topProfile = profilesById[profileBase.topProfileId];
  const overlapProfile = profileBase.overlapProfileId
    ? profilesById[profileBase.overlapProfileId]
    : null;
  const topNeedMap = getNeedMap(topProfile);
  const overlapNeedMap = overlapProfile ? getNeedMap(overlapProfile) : {};
  const areaScores = createAreaScoreMap();

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

  if (contextInput.settingDifference !== 'unknown') {
    areaScores.Leeromgeving += 1;
    areaScores.Groepsgenoten += 1;
  }

  if (zoovSignal.status === 'yes') {
    areaScores.Leerkracht += 1;
  }

  const prioritizedAreaNames = unique(
    Object.entries(areaScores)
      .filter(([area]) => area !== 'Thuissituatie / ouders')
      .sort((left, right) => right[1] - left[1])
      .slice(0, 4)
      .map(([area]) => area)
  );

  const prioritizedNeeds = prioritizedAreaNames.map((area) => {
    const primaryNeed = topNeedMap[area];
    const overlapNeed = overlapNeedMap[area];
    const reasonParts = [`Sluit aan bij ${normalizeText(topProfile.shortTitle).toLowerCase()}.`];

    if (overlapNeed) {
      reasonParts.push(
        `Wordt extra relevant door overlap met ${normalizeText(overlapProfile.shortTitle).toLowerCase()}.`
      );
    }

    if (
      area === 'Instructie' &&
      interpretation.discrepancySignals.some((signal) =>
        signal.toLowerCase().includes('schriftelijke output')
      )
    ) {
      reasonParts.push('Helpt om denken zichtbaar te maken zonder dat schriftelijke uitvoering direct blokkeert.');
    }

    if (
      area === 'Leeromgeving' &&
      contextInput.settingDifference !== 'unknown'
    ) {
      reasonParts.push('De setting lijkt invloed te hebben op wat deze leerling laat zien.');
    }

    if (
      area === 'Leerkracht' &&
      interpretation.discrepancySignals.some((signal) =>
        signal.toLowerCase().includes('onderprestatie')
      )
    ) {
      reasonParts.push('Een beschikbare en heldere leerkracht is hier waarschijnlijk de ingang tot herstel van betrokkenheid.');
    }

    const adviceText = overlapNeed
      ? `${normalizeText(primaryNeed.advice)} Daarnaast is het helpend om ook mee te nemen dat ${normalizeText(
          overlapNeed.advice
        ).charAt(0).toLowerCase()}${normalizeText(overlapNeed.advice).slice(1)}`
      : normalizeText(primaryNeed.advice);

    return {
      area,
      need: normalizeText(primaryNeed.need),
      advice: adviceText,
      reason: reasonParts.join(' ')
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
    shortInterpretationParts.push(normalizeText(interpretation.interpretationSummary));
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

  if (zoovSignal.status === 'yes') {
    followUpSteps.push(
      'Gebruik ZOOV+ als startsignaal om observaties en toetsgegevens gericht naast elkaar te blijven leggen, niet als profielbewijs op zichzelf.'
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

