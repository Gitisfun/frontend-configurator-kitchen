/**
 * The shape returned by the BFF route `/api/fronts`.
 * This is the frontend's canonical representation of a front panel option —
 * it is already normalized (full image URLs, flat priceClass level).
 */
export interface FrontOption {
  id: string;
  title: string;
  image: string | null;
  priceClass: number | null;
  description: string | null;
}
