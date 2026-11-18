import { skills } from '../data/skills.mjs';

export function GET() {
  return new Response(JSON.stringify({
    $schema: 'https://json.schemastore.org/claude-code-marketplace.json',
    name: 'kevinaleman',
    description: 'Agent skills for coding and learning, by Kevin Aleman.',
    owner: { name: 'Kevin Aleman', url: 'https://kevinaleman.com' },
    plugins: [
      ...skills.map((skill) => ({
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
      {
        name: 'memory-tinder',
        description: 'Keep, remove, or correct local Codex and Claude Code memories in chat or in a swipe deck.',
        source: { source: 'github', repo: 'KevLehman/memory-tinder' },
        category: 'productivity',
        repository: 'https://github.com/KevLehman/memory-tinder',
      },
      {
        name: 'ts7-lsp',
        description: 'TypeScript/JavaScript code intelligence from the native TypeScript 7 language server (tsc --lsp), using the project\'s own tsc.',
        source: {
          source: 'git-subdir',
          url: 'https://github.com/KevLehman/ts7-lsp.git',
          path: 'plugins/ts7-lsp',
        },
        category: 'development',
        repository: 'https://github.com/KevLehman/ts7-lsp',
      },
    ],
  }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
