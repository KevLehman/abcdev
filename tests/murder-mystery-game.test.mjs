import { describe, it, expect } from 'vitest';
import { newGame, investigate, accuse, result } from '../src/lib/murder-mystery-game.mjs';
import { leads, suspects, solution } from '../src/lib/murder-mystery-case.mjs';

describe('the observatory case', () => {
  it('has four suspects and eight uniquely identified leads', () => {
    expect(suspects).toHaveLength(4);
    expect(leads).toHaveLength(8);
    expect(new Set(leads.map((lead) => lead.id)).size).toBe(8);
    expect(suspects.some((suspect) => suspect.id === solution.suspect)).toBe(true);
  });

  it('accepts four distinct leads, with no charge for revisiting', () => {
    let game = newGame();
    game = investigate(game, leads[0].id);
    expect(investigate(game, leads[0].id)).toEqual(game);
    for (const lead of leads.slice(1, 4)) game = investigate(game, lead.id);
    expect(game.discovered).toHaveLength(4);
    expect(investigate(game, leads[4].id)).toEqual(game);
    expect(investigate(game, 'unknown')).toEqual(game);
  });

  it('allows an early guess, validates the accusation and locks the case', () => {
    let game = newGame();
    expect(accuse(game, 'unknown', null)).toEqual(game);
    expect(accuse(game, suspects[0].id, 'unseen')).toEqual(game);
    game = accuse(game, solution.suspect, null);
    expect(result(game)).toEqual({ correct: true, guessed: true, clues: 0 });
    expect(investigate(game, leads[0].id)).toEqual(game);
    expect(accuse(game, suspects[1].id, null)).toEqual(game);
  });

  it('records only discovered evidence and starts a clean replay', () => {
    let game = investigate(newGame(), leads[0].id);
    game = accuse(game, suspects.find((suspect) => suspect.id !== solution.suspect).id, leads[0].id);
    expect(result(game)).toEqual({ correct: false, guessed: false, clues: 1 });
    expect(newGame()).toEqual({ discovered: [], accusation: null });
  });
});
