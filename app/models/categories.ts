/**
 * The shape returned by the BFF route `/api/categories`.
 */
export interface Category {
  id: string;
  name: string;
  /** Stable text from Strapi (e.g. routing key aligned with cabinet group). */
  value: string;
}
