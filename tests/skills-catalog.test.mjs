import { describe, expect, it } from 'vitest';
import { GET } from '../src/pages/.well-known/ard.json.js';

describe('ARD skills manifest', () => {
  it('publishes discoverable entries for the skills', async () => {
    const response = GET();
    const manifest = await response.json();
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(manifest.entries.map((entry) => entry.displayName)).toEqual([
      'publish-devto', 'managing-github-prs', 'root-cause-analysis', 'teach-me', 'translate-article',
    ]);
    for (const entry of manifest.entries) {
      expect(entry.identifier).toBe(`urn:air:kevinaleman.com:skill:${entry.displayName}`);
      expect(entry.type).toBe('application/agent-skills+md');
      expect(entry.url).toBe(`https://raw.githubusercontent.com/KevLehman/agent-skills/main/${entry.displayName}/SKILL.md`);
      expect(entry.description).toBeTruthy();
      expect(entry.representativeQueries.length).toBeGreaterThanOrEqual(2);
    }
  });
});
