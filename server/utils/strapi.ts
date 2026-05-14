/**
 * Extracts a full image URL from a populated Strapi image field.
 * Handles both Strapi v4 `{ data: { attributes } }` and v5 flat shapes.
 */
export function extractStrapiImageUrl(
  image: unknown,
  strapiBase: string,
): string | null {
  if (image == null) return null;

  const base = strapiBase.replace(/\/$/, '');

  function toFullUrl(path: string | undefined | null): string | null {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  }

  // Strapi v5: flat object with `url`
  if (typeof image === 'object' && !Array.isArray(image) && 'url' in (image as object)) {
    const flat = image as { url?: string; formats?: { thumbnail?: { url?: string } } };
    const src = toFullUrl(flat.formats?.thumbnail?.url ?? flat.url);
    return src;
  }

  // Strapi v4: `{ data: { id, attributes: { url, formats } } }`
  const wrapped = image as { data?: { attributes?: { url?: string; formats?: { thumbnail?: { url?: string } } } } | null };
  const attrs = wrapped.data?.attributes;
  if (!attrs) return null;
  return toFullUrl(attrs.formats?.thumbnail?.url ?? attrs.url);
}

/**
 * Extracts the numeric price class level from a populated Strapi priceClass relation.
 * Handles both flat (v5) and `{ data }` wrapped (v4) shapes.
 */
export function extractStrapiPriceClassLevel(priceClass: unknown): number | null {
  if (priceClass == null) return null;

  // Flat (v5)
  if (typeof priceClass === 'object' && 'level' in (priceClass as object)) {
    const flat = priceClass as { level?: unknown };
    const l = flat.level;
    return typeof l === 'number' && Number.isFinite(l) ? l : null;
  }

  // Wrapped (v4)
  const wrapped = priceClass as { data?: { level?: unknown; attributes?: { level?: unknown } } | null };
  const d = wrapped.data;
  if (!d) return null;
  const levelRaw = d.level ?? d.attributes?.level;
  return typeof levelRaw === 'number' && Number.isFinite(levelRaw) ? levelRaw : null;
}
