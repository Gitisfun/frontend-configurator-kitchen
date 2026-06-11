import type { ConfiguratorProduct, ProductDimensionOption } from '../../app/constants/dummy';

export interface StrapiVariant {
  width: number;
  height?: number | null;
  isVariableWidth?: boolean;
}

export interface StrapiDepthOption {
  depth: number;
  isDefault?: boolean;
}

export interface StrapiCabinetSeries {
  carcaseHeight?: number | null;
}

export interface StrapiCabinetType {
  documentId: string;
  hasLeftRight?: boolean;
  variants?: StrapiVariant[];
  depthOptions?: StrapiDepthOption[];
  cabinetSeries?: StrapiCabinetSeries | null;
}

export interface StrapiCabinetSerieRow {
  documentId: string;
  name: string;
  carcaseHeight?: number | null;
  defaultCarcaseDepth?: number | null;
  productLine?: string | null;
}

export class ProductBuilder {
  static readonly plinthOptions: ProductDimensionOption[] = [
    { value: '125', label: '12.5 cm hoge plint' },
    { value: '150', label: '15 cm hoge plint' },
  ];

  /** Values in Strapi are stored in mm; convert to cm for display labels. */
  static mmToCm(mm: number): number {
    return mm / 10;
  }

  static stripHtml(html: string): string {
    return html
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  static parseDescriptionBullets(html: string | null | undefined): string[] {
    if (!html || !html.trim()) return [];
    const liMatches = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
    if (liMatches.length > 0) {
      return liMatches.map((m) => ProductBuilder.stripHtml(m[1] ?? '')).filter(Boolean);
    }
    const pParts = html
      .split(/<\/?p[^>]*>/i)
      .map(ProductBuilder.stripHtml)
      .filter(Boolean);
    if (pParts.length > 0) return pParts;
    const plain = ProductBuilder.stripHtml(html);
    return plain ? [plain] : [];
  }

  static buildWidthOptions(types: StrapiCabinetType[]): ProductDimensionOption[] {
    const widths = new Set<number>();
    for (const ct of types) {
      for (const v of ct.variants ?? []) {
        if (!v.isVariableWidth && typeof v.width === 'number' && v.width > 0) {
          widths.add(v.width);
        }
      }
    }
    return [...widths]
      .sort((a, b) => a - b)
      .map((w) => ({ value: String(w), label: `${ProductBuilder.mmToCm(w)} cm breed` }));
  }

  static buildHeightOptions(types: StrapiCabinetType[]): ProductDimensionOption[] {
    const heights = new Set<number>();
    for (const ct of types) {
      const seriesH = ct.cabinetSeries?.carcaseHeight;
      if (typeof seriesH === 'number' && seriesH > 0) {
        heights.add(seriesH);
      } else {
        for (const v of ct.variants ?? []) {
          if (typeof v.height === 'number' && v.height > 0) heights.add(v.height);
        }
      }
    }
    return [...heights]
      .sort((a, b) => a - b)
      .map((h) => ({ value: String(h), label: `${ProductBuilder.mmToCm(h)} cm hoog` }));
  }

  static buildDepthOptions(types: StrapiCabinetType[]): ProductDimensionOption[] {
    const depths = new Map<number, boolean>();
    for (const ct of types) {
      for (const d of ct.depthOptions ?? []) {
        if (typeof d.depth === 'number' && d.depth > 0) {
          depths.set(d.depth, depths.get(d.depth) || !!d.isDefault);
        }
      }
    }
    return [...depths.entries()]
      .sort((a, b) => {
        if (a[1] !== b[1]) return a[1] ? -1 : 1;
        return a[0] - b[0];
      })
      .map(([d]) => ({ value: String(d), label: `${ProductBuilder.mmToCm(d)} cm diep` }));
  }

  static hasLeftRight(types: StrapiCabinetType[]): boolean {
    return types.some((ct) => !!ct.hasLeftRight);
  }

  static mapSerieToConfiguratorProduct(row: StrapiCabinetSerieRow): ConfiguratorProduct {
    const h = row.carcaseHeight;
    const d = row.defaultCarcaseDepth;

    const heightOpts: ProductDimensionOption[] =
      h != null && Number.isFinite(h)
        ? [{ value: String(h), label: `${ProductBuilder.mmToCm(h)} cm hoog` }]
        : [{ value: '720', label: '72 cm hoog' }];

    const depthOpts: ProductDimensionOption[] =
      d != null && Number.isFinite(d)
        ? [{ value: String(d), label: `${ProductBuilder.mmToCm(d)} cm diep` }]
        : [{ value: '600', label: '60 cm diep' }];

    const widthOpts: ProductDimensionOption[] = [
      { value: '600', label: '60 cm breed' },
      { value: '800', label: '80 cm breed' },
      { value: '1000', label: '100 cm breed' },
    ];

    const fallback = '/svg/base-60.svg';

    const info: string[] = [];
    if (row.productLine) info.push(`Productlijn: ${row.productLine}`);
    if (info.length === 0) info.push('Configureer het formaat en opties hieronder.');

    return {
      id: row.documentId,
      title: row.name,
      image: fallback,
      thumb: fallback,
      dimensions: {
        width: widthOpts,
        height: heightOpts,
        depth: depthOpts,
        plinth: ProductBuilder.plinthOptions,
      },
      doorSwing: { leftLabel: 'Deur links', rightLabel: 'Deur rechts', default: 'left' },
      addOns: [],
      productInformation: info,
      basePrice: 0,
    };
  }
}
