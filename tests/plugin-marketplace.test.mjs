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
    expect(marketplace.plugins.map((plugin) => plugin.name)).toEqual(skills.map((skill) => skill.name));
    for (const plugin of marketplace.plugins) {
      expect(plugin.source).toEqual({
        source: 'git-subdir',
        url: 'https://github.com/KevLehman/agent-skills.git',
        path: plugin.name,
      });
      expect(plugin.description).toBeTruthy();
    }
  });
});
