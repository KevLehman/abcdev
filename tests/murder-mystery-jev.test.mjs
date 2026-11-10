import { describe, it, expect } from 'vitest';
import { runInvestigation } from '../scripts/record-murder-mystery-jev.mjs';

describe('recording Jev’s investigation', () => {
  it('reveals only selected clues and records valid choices without the solution', async () => {
    const requests = [];
    const choices = ['lab', 'camera', 'accuse', 'nina', 'camera'];
    const run = await runInvestigation(async (request) => {
      requests.push(request);
      return { model: 'jev-test', answers: { decision: { choice: choices.shift() } }, usage: { input_tokens: 1 } };
    });
    expect(run.discovered).toEqual(['lab', 'camera']);
    expect(run.accusation).toEqual({ suspect: 'nina', evidence: 'camera' });
    expect(requests[0].state.discovered).toEqual([]);
    expect(requests[1].state.discovered.map((clue) => clue.id)).toEqual(['lab']);
    expect(JSON.stringify(requests)).not.toContain('Nina poisoned the tea');
    expect(requests[0].questions.decision.criteria).toHaveProperty('accuse');
    expect(run.trace).toHaveLength(5);
  });

  it('rejects a decision outside the available choices', async () => {
    await expect(runInvestigation(async () => ({ answers: { decision: { choice: 'not-a-lead' } } }))).rejects.toThrow('invalid choice');
  });
});
