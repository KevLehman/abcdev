import { skills } from '../data/skills.mjs';

export function GET() {
  return new Response(JSON.stringify({
    $schema: 'https://json.schemastore.org/claude-code-marketplace.json',
    name: 'kevinaleman',
    description: 'Agent skills for coding and learning, by Kevin Aleman.',
    owner: { name: 'Kevin Aleman', url: 'https://kevinaleman.com' },
    plugins: skills.map((skill) => ({
      name: skill.name,
      description: skill.description,
      source: {
        source: 'git-subdir',
        url: 'https://github.com/KevLehman/agent-skills.git',
        path: skill.name,
      },
      homepage: 'https://kevinaleman.com/skills/',
      repository: 'https://github.com/KevLehman/agent-skills',
    })),
  }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
