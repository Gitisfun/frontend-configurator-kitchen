/**
 * Public brochure-style product from Strapi, returned by `/api/catalog-product`.
 */
export interface CatalogProductDetail {
  documentId: string;
  title: string;
  image: string | null;
  /** Plain text (HTML stripped) for safe display. */
  descriptionText: string | null;
}
