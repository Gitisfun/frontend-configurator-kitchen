/**
 * The shape returned by the BFF route `/api/plinths`.
 */
export interface PlinthOption {
  id: string;
  title: string;
  image: string | null;
  description: string | null;
}
