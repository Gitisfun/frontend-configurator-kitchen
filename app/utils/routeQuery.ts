/**
 * Normalizes a Vue Router query value (often `unknown`) to a trimmed non-empty string.
 * Returns "" for missing, non-string, or whitespace-only values.
 */
export function trimmedRouteQueryParam(value: unknown): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : '';
}

/**
 * Parses a comma-separated route query param (e.g. `subcategoryPath`) into trimmed ids.
 */
export function commaSeparatedRouteQueryParam(value: unknown): string[] {
  const raw = trimmedRouteQueryParam(value);
  if (!raw) return [];
  return raw.split(',').map((part) => part.trim()).filter(Boolean);
}
