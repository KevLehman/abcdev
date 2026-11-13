import { skills } from '../../data/skills.mjs';

export function GET() {
  return new Response(JSON.stringify({
    entries: skills.map((skill) => ({
      identifier: `urn:air:kevinaleman.com:skill:${skill.name}`,
      displayName: skill.name,
      type: 'application/agent-skills+md',
      url: `https://raw.githubusercontent.com/KevLehman/agent-skills/main/${skill.name}/SKILL.md`,
      description: skill.description,
      representativeQueries: skill.queries,
      trustManifest: {
        identity: 'https://kevinaleman.com',
        identityType: 'https',
        provenance: [{ relation: 'publishedFrom', sourceId: 'https://github.com/KevLehman/agent-skills' }],
      },
    })),
  }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
