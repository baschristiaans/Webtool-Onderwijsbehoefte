import { supabase } from './supabaseClient.js';

export function createSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildTrackingPayload({
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
}) {
  return {
    session_id: sessionId,
    app_version: import.meta.env.VITE_APP_VERSION || 'local',
    group_label: student.group || null,
    zoov_status: zoovSignal.status || null,
    known_support_info_presence: contextInput.knownSupportInfoPresence || null,
    setting_difference:
      contextInput.settingDifference && contextInput.settingDifference !== 'unknown'
        ? contextInput.settingDifference
        : null,
    home_pattern:
      homeInput.pattern && homeInput.pattern !== 'unknown'
        ? homeInput.pattern
        : null,
    test_scores: testScores,
    observation_answers: observationAnswers,
    raw_scores_by_profile: profileBase.rawScoresByProfile,
    top_profile_id: profileBase.topProfileId || null,
    overlap_profile_id: profileBase.overlapProfileId || null,
    direction_key: profileBase.directionKey || null,
    top_score: profileBase.topScore ?? null,
    second_score: profileBase.secondScore ?? null,
    result_heading: advice.resultHeading || null,
    work_hypothesis: advice.workHypothesis || null,
    interpretation_summary: interpretation.interpretationSummary || null,
    advice_areas: advice.prioritizedNeeds.map((item) => ({
      area: item.area,
      sharedByOverlap: Boolean(item.sharedByOverlap)
    })),
    strongest_observations: profileBase.strongestObservations.map((item) => ({
      id: item.id,
      prompt: item.prompt,
      scoreContribution: item.scoreContribution,
      strengthLabel: item.strengthLabel
    }))
  };
}

export async function saveTrackingRecord(payload) {
  if (!supabase) {
    return { ok: false, skipped: true, error: 'Supabase niet ingesteld.' };
  }

  const { error } = await supabase.from('tool_runs').insert(payload);

  if (error) {
    throw error;
  }

  return { ok: true };
}