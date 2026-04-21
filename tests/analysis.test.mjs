import test from 'node:test';
import assert from 'node:assert/strict';

import { analyzeProfileBase, analyzeRichInterpretation } from '../src/lib/analysis.js';

function unknownTests() {
  return {
    dmt: 'unknown',
    avi: 'unknown',
    begrijpendLezen: 'unknown',
    rekenen: 'unknown',
    spelling: 'unknown'
  };
}

test('geeft no_signal bij geen positieve observaties', () => {
  const result = analyzeProfileBase({}, { knownSupportInfoPresence: 'unknown' });
  assert.equal(result.directionKey, 'no_signal');
  assert.equal(result.topProfileId, null);
});

test('herkent type2 bij sterke ankeritems', () => {
  const result = analyzeProfileBase(
    {
      'obs-critical-rules': 3,
      'obs-original-ideas': 3,
      'obs-discussion-overtakes-task': 3
    },
    { knownSupportInfoPresence: 'unknown' }
  );

  assert.equal(result.topProfileId, 'type2');
});

test('type2 zakt terug als ankeritems ontbreken', () => {
  const result = analyzeProfileBase(
    {
      'obs-reacts-to-unfairness': 3,
      'obs-low-effort-low-meaning': 3,
      'obs-engages-when-meaningful': 3
    },
    { knownSupportInfoPresence: 'unknown' }
  );

  assert.ok(result.scoresByProfile.type2 < result.rawScoresByProfile.type2);
  assert.equal(result.topProfileId, 'type4');
});

test('type5 wordt uitgesloten zonder bekende ondersteuningsinformatie', () => {
  const result = analyzeProfileBase(
    {
      'obs-strong-problem-solving': 3,
      'obs-unorganized-work': 3,
      'obs-work-quality-mismatch': 3,
      'obs-not-always-on-task': 2
    },
    { knownSupportInfoPresence: 'no' }
  );

  assert.equal(result.profileStatusById.type5.status, 'insufficient');
  assert.equal(result.scoresByProfile.type5, 0);
  assert.notEqual(result.topProfileId, 'type5');
});

test('type5 wordt toegestaan met sterke signalen en bekende ondersteuningsinformatie', () => {
  const result = analyzeProfileBase(
    {
      'obs-strong-problem-solving': 3,
      'obs-unorganized-work': 3,
      'obs-work-quality-mismatch': 3,
      'obs-not-always-on-task': 2
    },
    { knownSupportInfoPresence: 'yes' }
  );

  assert.equal(result.profileStatusById.type5.status, 'regular');
  assert.equal(result.topProfileId, 'type5');
});

test('type5 wordt uitgesloten zonder sterkte-indicator', () => {
  const result = analyzeProfileBase(
    {
      'obs-unorganized-work': 3,
      'obs-work-quality-mismatch': 3,
      'obs-not-always-on-task': 2
    },
    { knownSupportInfoPresence: 'yes' }
  );

  assert.equal(result.evidenceFlags.type5.hasStrengthIndicator, false);
  assert.equal(result.profileStatusById.type5.status, 'insufficient');
  assert.equal(result.scoresByProfile.type5, 0);
  assert.notEqual(result.topProfileId, 'type5');
});

test('type5 wordt uitgesloten zonder mismatch-indicator', () => {
  const result = analyzeProfileBase(
    {
      'obs-strong-problem-solving': 3
    },
    { knownSupportInfoPresence: 'yes' }
  );

  assert.equal(result.evidenceFlags.type5.hasExecutionMismatchIndicator, false);
  assert.equal(result.profileStatusById.type5.status, 'insufficient');
  assert.equal(result.scoresByProfile.type5, 0);
  assert.notEqual(result.topProfileId, 'type5');
});

test('contra-indicatoren verlagen type1 bij sterke type6 signalen', () => {
  const result = analyzeProfileBase(
    {
      'obs-seeks-confirmation': 2,
      'obs-safe-approach': 2,
      'obs-seeks-extra-challenge': 2,
      'obs-sets-goals': 2
    },
    { knownSupportInfoPresence: 'unknown' }
  );

  assert.equal(result.rawScoresByProfile.type1, 4);
  assert.equal(result.scoresByProfile.type1, 3);
  assert.equal(result.rawScoresByProfile.type6, 4);
  assert.equal(result.scoresByProfile.type6, 3);
});

test('rich interpretation geeft onderprestatie-signaal bij type4 met zwakke prestaties', () => {
  const profileBase = analyzeProfileBase(
    {
      'obs-incomplete-work': 3,
      'obs-resistant-schoolwork': 2,
      'obs-low-effort-low-meaning': 3
    },
    { knownSupportInfoPresence: 'unknown' }
  );

  const interpretation = analyzeRichInterpretation({
    profileBase,
    contextInput: {
      settingDifference: 'unknown',
      knownSupportInfoPresence: 'unknown',
      knownSupportInfoNote: '',
      note: ''
    },
    homeInput: { pattern: 'unknown', summary: '' },
    testScores: {
      ...unknownTests(),
      dmt: 'weak',
      avi: 'weak',
      begrijpendLezen: 'vulnerable'
    },
    notes: ''
  });

  assert.equal(profileBase.topProfileId, 'type4');
  assert.ok(
    interpretation.discrepancySignals.some((signal) =>
      signal.toLowerCase().includes('onderprestatie')
    )
  );
});