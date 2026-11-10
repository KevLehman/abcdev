import { describe, it, expect } from 'vitest';
import { clueKey, currentModels, modelGuesses } from '../src/lib/murder-mystery-comparison.mjs';
import { allClueSets, evaluateModel, requestGuess, summarizeGuesses } from '../scripts/record-murder-mystery-models.mjs';
import { leads, solution } from '../src/lib/murder-mystery-case.mjs';

describe('same-clue model comparison', () => {
  it('generates all 163 sets from zero to four distinct clues', () => {
    const sets = allClueSets();
    expect(sets).toHaveLength(163);
    expect(new Set(sets.map(clueKey)).size).toBe(163);
    expect(sets.filter((set) => set.length === 4)).toHaveLength(70);
  });

  it('matches selections regardless of order and never substitutes a different set', () => {
    const models = [{ name: 'Example', guesses: { 'camera|lab': 'mara', '': 'leo' } }];
    expect(modelGuesses(models, ['lab', 'camera'])).toEqual([{ name: 'Example', suspect: 'mara' }]);
    expect(modelGuesses(models, [])).toEqual([{ name: 'Example', suspect: 'leo' }]);
    expect(modelGuesses(models, ['lab'])).toEqual([]);
  });

  it('excludes answers recorded for a different version of the case', () => {
    const models = [{ name: 'Old', caseFingerprint: 'old', guesses: {} }, { name: 'Current', caseFingerprint: 'current', guesses: {} }];
    expect(currentModels(models, 'current').map((model) => model.name)).toEqual(['Current']);
  });

  it('sends each model only the selected clue texts and requires a valid suspect', async () => {
    const seen = [];
    const guesses = await evaluateModel(async (state) => {
      seen.push(state);
      return 'mara';
    });
    expect(Object.keys(guesses)).toHaveLength(163);
    expect(seen[0].clues).toEqual([]);
    expect(seen.every((state) => state.clues.length <= 4)).toBe(true);
    const one = seen.find((state) => state.clues.length === 1 && state.clues[0].id === 'lab');
    expect(one.clues).toEqual([{ id: 'lab', title: leads.find((lead) => lead.id === 'lab').title, text: leads.find((lead) => lead.id === 'lab').text }]);
    expect(JSON.stringify(seen)).not.toContain(solution.text);
    await expect(evaluateModel(async () => 'unknown')).rejects.toThrow('invalid suspect');
  });

  it('reports accuracy separately for four-clue sets', () => {
    expect(summarizeGuesses({ '': solution.suspect, 'lab': 'mara', 'camera|coats|lab|log': solution.suspect })).toEqual({ all: { correct: 2, total: 3 }, fourClues: { correct: 1, total: 1 } });
  });

  it('extracts structured accusations from both supported provider formats', async () => {
    const state = { premise: 'case', suspects: [], clues: [] };
    const mock = (body) => async (_url, options) => {
      expect(JSON.stringify(JSON.parse(options.body))).not.toContain('test-key');
      return { ok: true, json: async () => body };
    };
    expect(await requestGuess('typesafe', 'jev-latest', 'test-key', state, mock({ model: 'jev-1', answers: { decision: { choice: 'nina' } } }))).toEqual({ model: 'jev-1', suspect: 'nina' });
    expect(await requestGuess('openai', 'test-model', 'test-key', state, mock({ model: 'test-model-1', output: [{ content: [{ type: 'output_text', text: '{"suspect":"mara"}' }] }] }))).toEqual({ model: 'test-model-1', suspect: 'mara' });
  });
});
