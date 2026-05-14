/**
 * The shape returned by the BFF route `/api/backs`.
 * Backs are used as the side panel selection in the configurator.
 */
export interface BackOption {
  id: string;
  title: string;
  image: string | null;
}
