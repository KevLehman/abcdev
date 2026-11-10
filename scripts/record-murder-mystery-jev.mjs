import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { leads, premise, suspects } from '../src/lib/murder-mystery-case.mjs';

export async function runInvestigation(decide) {
  const discovered = [];
  const trace = [];
  const state = () => ({
    premise,
    rules: 'You may investigate up to four different leads, or accuse at any time. You may select only one discovered clue as evidence, or say you are guessing. One of the four suspects committed the murder.',
    suspects,
    discovered: discovered.map((id) => { const { title, text } = leads.find((lead) => lead.id === id); return { id, title, text }; }),
  });
  async function choose(instructions, criteria) {
    const request = { model: 'jev-latest', state: state(), questions: { decision: { type: 'choice', instructions, criteria } } };
    const response = await decide(request);
    const choice = response?.answers?.decision?.choice;
    if (!Object.hasOwn(criteria, choice)) throw new Error('Jev returned an invalid choice');
    trace.push({ request, response });
    return choice;
  }
  while (discovered.length < 4) {
    const criteria = Object.fromEntries(leads.filter((lead) => !discovered.includes(lead.id)).map((lead) => [lead.id, `${lead.place}: ${lead.title}`]));
    criteria.accuse = 'Stop investigating and accuse a suspect now.';
    const choice = await choose('Which lead should you investigate next, or are you ready to accuse?', criteria);
    if (choice === 'accuse') break;
    discovered.push(choice);
  }
  const suspect = await choose('Which suspect committed the murder?', Object.fromEntries(suspects.map((person) => [person.id, `${person.name}: ${person.role}`])));
  const evidence = discovered.length ? await choose('Which discovered clue best supports your accusation, or are you guessing?', {
    ...Object.fromEntries(discovered.map((id) => [id, leads.find((lead) => lead.id === id).title])),
    guessing: 'I am guessing without a supporting clue.',
  }) : 'guessing';
  return { recordedAt: new Date().toISOString(), discovered, accusation: { suspect, evidence: evidence === 'guessing' ? null : evidence }, trace };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const key = process.env.TYPESAFE_API_KEY;
  if (!key) throw new Error('Set TYPESAFE_API_KEY before recording Jev’s investigation.');
  const run = await runInvestigation(async (request) => {
    const response = await fetch('https://api.typesafe.ai/v1/systemone', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error(`TypeSafe request failed with HTTP ${response.status}`);
    return response.json();
  });
  await writeFile(new URL('../src/data/murder-mystery-jev.json', import.meta.url), `${JSON.stringify(run, null, 2)}\n`);
  console.log(`Recorded ${run.discovered.length} leads and an accusation in src/data/murder-mystery-jev.json.`);
}
