import { describe, expect, it } from 'vitest';
import { GET } from '../src/pages/marketplace.json.js';
import { skills } from '../src/data/skills.mjs';

describe('Claude Code plugin marketplace', () => {
  it('lists every skill as a plugin fetched from its own folder of agent-skills', async () => {
    const response = GET();
    const marketplace = await response.json();
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(marketplace.name).toBe('kevinaleman');
    expect(marketplace.owner.name).toBeTruthy();
    const skillPlugins = marketplace.plugins.slice(0, skills.length);
    expect(skillPlugins.map((plugin) => plugin.name)).toEqual(skills.map((skill) => skill.name));
    for (const plugin of skillPlugins) {
      expect(plugin.source).toEqual({
        source: 'git-subdir',
        url: 'https://github.com/KevLehman/agent-skills.git',
        path: plugin.name,
      });
      expect(plugin.description).toBeTruthy();
    }
  });

  it('lists ts7-lsp from its plugin folder in the ts7-lsp repository', async () => {
    const marketplace = await GET().json();
    expect(marketplace.plugins.at(-1)).toMatchObject({
      name: 'ts7-lsp',
      source: { source: 'git-subdir', url: 'https://github.com/KevLehman/ts7-lsp.git', path: 'plugins/ts7-lsp' },
    });
  });
});
