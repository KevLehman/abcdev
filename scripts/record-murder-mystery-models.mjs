import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { leads, premise, suspects, solution } from '../src/lib/murder-mystery-case.mjs';
import { clueKey } from '../src/lib/murder-mystery-comparison.mjs';
import { caseFingerprint, question } from '../src/lib/murder-mystery-evaluation.mjs';

export function allClueSets() {
  const sets = [[]];
  for (const { id } of leads) {
    for (const set of [...sets]) if (set.length < 4) sets.push([...set, id]);
  }
  return sets.sort((a, b) => a.length - b.length || clueKey(a).localeCompare(clueKey(b)));
}

export async function evaluateModel(decide) {
  const guesses = {};
  for (const ids of allClueSets()) {
    const state = {
      premise,
      suspects,
      clues: [...ids].sort().map((id) => { const { title, text } = leads.find((lead) => lead.id === id); return { id, title, text }; }),
    };
    const suspect = await decide(state);
    if (!suspects.some((person) => person.id === suspect)) throw new Error(`Model returned invalid suspect for ${clueKey(ids) || 'no clues'}`);
    guesses[clueKey(ids)] = suspect;
  }
  return guesses;
}

export function summarizeGuesses(guesses) {
  const entries = Object.entries(guesses);
  const count = (items) => ({ correct: items.filter(([, suspect]) => suspect === solution.suspect).length, total: items.length });
  return { all: count(entries), fourClues: count(entries.filter(([key]) => key.split('|').length === 4)) };
}

export async function requestGuess(provider, requestedModel, key, state, send = fetch) {
  const isTypeSafe = provider === 'typesafe';
  const payload = isTypeSafe
    ? { model: requestedModel, state, questions: { decision: { type: 'choice', instructions: question, criteria: Object.fromEntries(suspects.map((person) => [person.id, `${person.name}: ${person.role}`])) } } }
    : { model: requestedModel, input: `${question}\n\n${JSON.stringify(state)}`, text: { format: { type: 'json_schema', name: 'accusation', strict: true, schema: { type: 'object', properties: { suspect: { type: 'string', enum: suspects.map((person) => person.id) } }, required: ['suspect'], additionalProperties: false } } } };
  const response = await send(isTypeSafe ? 'https://api.typesafe.ai/v1/systemone' : 'https://api.openai.com/v1/responses', {
    method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`${provider} request failed with HTTP ${response.status}`);
  const data = await response.json();
  if (isTypeSafe) return { model: data.model, suspect: data.answers?.decision?.choice };
  const output = data.output?.flatMap((item) => item.content ?? []).find((item) => item.type === 'output_text')?.text;
  if (!output) throw new Error('OpenAI returned no structured answer');
  return { model: data.model, suspect: JSON.parse(output).suspect };
}

async function record(provider, requestedModel) {
  const key = process.env[provider === 'typesafe' ? 'TYPESAFE_API_KEY' : 'OPENAI_API_KEY'];
  if (!key) throw new Error(`Missing ${provider === 'typesafe' ? 'TYPESAFE_API_KEY' : 'OPENAI_API_KEY'}`);
  let actualModel;
  const guesses = await evaluateModel(async (state) => {
    const answer = await requestGuess(provider, requestedModel, key, state);
    if (!answer.model || (actualModel && answer.model !== actualModel)) throw new Error('Model version changed during evaluation; no results were saved');
    actualModel = answer.model;
    return answer.suspect;
  });
  const destination = new URL('../src/data/murder-mystery-models.json', import.meta.url);
  const models = JSON.parse(await readFile(destination, 'utf8'));
  const name = `${provider === 'typesafe' ? 'TypeSafe' : 'OpenAI'} / ${actualModel}`;
  const updated = models.filter((model) => model.name !== name || model.caseFingerprint !== caseFingerprint);
  updated.push({ name, requestedModel, caseFingerprint, recordedAt: new Date().toISOString(), guesses });
  await writeFile(destination, `${JSON.stringify(updated, null, 2)}\n`);
  const scores = summarizeGuesses(guesses);
  console.log(`${name}: ${scores.all.correct}/${scores.all.total} across all sets; ${scores.fourClues.correct}/${scores.fourClues.total} with four clues.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [, , provider, model] = process.argv;
  if (!['typesafe', 'openai'].includes(provider) || !model) throw new Error('Usage: node --env-file-if-exists=.env scripts/record-murder-mystery-models.mjs <typesafe|openai> <model>');
  await record(provider, model);
}
