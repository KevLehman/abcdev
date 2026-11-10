export const clueKey = (ids) => [...ids].sort().join('|');
export const currentModels = (models, fingerprint) => models.filter((model) => model.caseFingerprint === fingerprint);

export function modelGuesses(models, clues) {
  const key = clueKey(clues);
  return models.flatMap((model) => Object.hasOwn(model.guesses, key)
    ? [{ name: model.name, suspect: model.guesses[key] }]
    : []);
}
