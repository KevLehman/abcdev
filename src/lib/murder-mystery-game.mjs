import { leads, suspects, solution } from './murder-mystery-case.mjs';

/** @returns {{ discovered: string[], accusation: { suspect: string, evidence: string | null } | null }} */
export const newGame = () => ({ discovered: [], accusation: null });

export function investigate(game, id) {
  if (game.accusation || game.discovered.includes(id) || game.discovered.length >= 4 || !leads.some((lead) => lead.id === id)) return game;
  return { ...game, discovered: [...game.discovered, id] };
}

export function accuse(game, suspect, evidence) {
  if (game.accusation || !suspects.some((person) => person.id === suspect) || (evidence !== null && !game.discovered.includes(evidence))) return game;
  return { ...game, accusation: { suspect, evidence } };
}

export function result(game) {
  if (!game.accusation) return null;
  return { correct: game.accusation.suspect === solution.suspect, guessed: game.accusation.evidence === null, clues: game.discovered.length };
}
