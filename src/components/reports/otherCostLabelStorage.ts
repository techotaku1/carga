const STORAGE_KEY = 'cargo-other-cost-label';

/**
 * Reads the user's custom label for the "other cost" field.
 * @returns The saved label, or an empty string when unset.
 */
export const loadOtherCostLabel = (): string => window.localStorage.getItem(STORAGE_KEY) ?? '';

/**
 * Persists the user's custom label for the "other cost" field.
 * @param label - The label to persist.
 */
export const saveOtherCostLabel = (label: string) => {
  window.localStorage.setItem(STORAGE_KEY, label);
};
