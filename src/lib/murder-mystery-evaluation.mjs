import { createHash } from 'node:crypto';
import { leads, premise, suspects } from './murder-mystery-case.mjs';

export const question = 'One of these four suspects murdered Adrian Vale. Based only on the case and the selected clues, choose the most likely suspect. You must choose even if the evidence is incomplete.';
export const caseFingerprint = createHash('sha256').update(JSON.stringify({ question, premise, suspects, leads })).digest('hex');
