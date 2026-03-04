// Step one: Choose with or without handle

export interface StepOneOption {
  id: string;
  label: string;
  value: string;
}

export const STEP_ONE_OPTIONS: StepOneOption[] = [
  { id: 'met-greep', label: 'Kies met greep', value: 'met greep' },
  { id: 'greeploos', label: 'Kies greeploos', value: 'greeploos' },
];

// Step two: choose plinth color, front color, side panel color, handle color and handle type

/** Dummy images for front, plinth and side panel options (cycle by index when building options) */
export const PANEL_DUMMY_IMAGES = ['/img197.jpg', '/img199.jpg', '/img201.jpg', '/img203.jpg', '/img205.jpg', '/img207.jpg', '/img209.jpg', '/img211.jpg', '/img213.jpg', '/img215.jpg', '/img219.jpg', '/img241.jpg', '/img243.jpg'] as const;

// Front options (Front panel)

export interface FrontOption {
  id: string;
  title: string;
  image: string;
  priceClass: number;
  infoUrl: string;
}

export const FRONT_OPTIONS: FrontOption[] = [
  { id: 'custom', title: 'Personaliseer jouw kleur', image: '/img197.jpg', priceClass: 5, infoUrl: '/info/custom-color' },
  { id: 'b20', title: 'B20 ultramat', image: '/img199.jpg', priceClass: 3, infoUrl: '/info/b20' },
  { id: 'b30', title: 'B30 ultramat', image: '/img201.jpg', priceClass: 4, infoUrl: '/info/b30' },
  { id: 'b40', title: 'B40 ultramat', image: '/img203.jpg', priceClass: 4, infoUrl: '/info/b40' },
  { id: 'b50', title: 'B50 ultramat', image: '/img205.jpg', priceClass: 5, infoUrl: '/info/b50' },
  { id: 'g20', title: 'G20 ultramat', image: '/img207.jpg', priceClass: 2, infoUrl: '/info/g20' },
  { id: 'g40', title: 'G40 ultramat', image: '/img209.jpg', priceClass: 3, infoUrl: '/info/g40' },
  { id: 'g50', title: 'G50 ultramat', image: '/img211.jpg', priceClass: 3, infoUrl: '/info/g50' },
  { id: 'g60', title: 'G60 ultramat', image: '/img213.jpg', priceClass: 4, infoUrl: '/info/g60' },
  { id: 'sneeuwwit', title: 'Sneeuwwit mat kunststof', image: '/img215.jpg', priceClass: 2, infoUrl: '/info/sneeuwwit' },
  { id: 'magnolia', title: 'Magnolia ultramat', image: '/img219.jpg', priceClass: 3, infoUrl: '/info/magnolia' },
  { id: 'wit', title: 'Wit hoogglans', image: '/img241.jpg', priceClass: 4, infoUrl: '/info/wit' },
  { id: 'antraciet', title: 'Antraciet mat', image: '/img243.jpg', priceClass: 5, infoUrl: '/info/antraciet' },
  { id: 'grafiet', title: 'Grafiet', image: '/img197.jpg', priceClass: 5, infoUrl: '/info/grafiet' },
];

// Handle options (Handle panel)

export interface HandleOption {
  id: string;
  title: string;
  image: string;
}

export const HANDLE_OPTIONS: HandleOption[] = [
  { id: '77', title: 'Knop 77', image: '/svg/handle-knop-77.svg' },
  { id: '9', title: 'Knop 9', image: '/svg/handle-knop-9.svg' },
  { id: '199', title: 'Knop 199', image: '/svg/handle-knop-199.svg' },
  { id: '141', title: 'Knop 141', image: '/svg/handle-knop-141.svg' },
  { id: '178', title: 'Knop 178', image: '/svg/handle-knop-178.svg' },
  { id: 'brass-bar', title: 'Brass Bar', image: '/svg/handle-brass-bar.svg' },
  { id: 'chrome-t', title: 'Chrome T-bar', image: '/svg/handle-chrome-t.svg' },
  { id: 'oval-matt', title: 'Oval mat', image: '/svg/handle-oval-matt.svg' },
  { id: 'round-polished', title: 'Round polished', image: '/svg/handle-round-polished.svg' },
  { id: 'pull-rail', title: 'Pull rail', image: '/svg/handle-pull-rail.svg' },
];

// Plinth options (Plinth panel)

export interface PlinthOption {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const PLINTH_OPTIONS: PlinthOption[] = [
  { id: 'kalkwit', title: 'Kalkwit', description: 'Bedrag per 10cm: 6,20', image: '/img197.jpg' },
  { id: 'magnolia', title: 'Magnolia kunststof', description: 'Bedrag per 10cm: 5,80', image: '/img199.jpg' },
  { id: 'magnolia-hg', title: 'Magnolia hoogglanzend', description: 'Bedrag per 10cm: 7,40', image: '/img201.jpg' },
  { id: 'magnolia-mat', title: 'Magnolia uv-lak extra mat', description: 'Bedrag per 10cm: 8,10', image: '/img203.jpg' },
  { id: 'magnolia-uv', title: 'Magnolia uv-lak hoogglanzend', description: 'Bedrag per 10cm: 0,-', image: '/img205.jpg' },
  { id: 'ivory', title: 'Ivory', description: 'Bedrag per 10cm: 5,50', image: '/img207.jpg' },
  { id: 'warm-wit', title: 'Warm wit', description: 'Bedrag per 10cm: 6,00', image: '/img209.jpg' },
  { id: 'parelwit', title: 'Parelwit', description: 'Bedrag per 10cm: 6,80', image: '/img211.jpg' },
  { id: 'natuurwit', title: 'Natuurwit', description: 'Bedrag per 10cm: 5,20', image: '/img213.jpg' },
  { id: 'zand', title: 'Zand', description: 'Bedrag per 10cm: 6,40', image: '/img215.jpg' },
  { id: 'grijs-wit', title: 'Grijs wit', description: 'Bedrag per 10cm: 7,20', image: '/img219.jpg' },
  { id: 'lichtgrijs', title: 'Lichtgrijs', description: 'Bedrag per 10cm: 5,90', image: '/img241.jpg' },
  { id: 'muisgrijs', title: 'Muisgrijs', description: 'Bedrag per 10cm: 6,60', image: '/img243.jpg' },
  { id: 'antraciet', title: 'Antraciet', description: 'Bedrag per 10cm: 8,40', image: '/img197.jpg' },
  { id: 'grafiet', title: 'Grafiet', description: 'Bedrag per 10cm: 8,20', image: '/img199.jpg' },
  { id: 'zwart', title: 'Zwart', description: 'Bedrag per 10cm: 9,00', image: '/img201.jpg' },
  { id: 'donkergrijs', title: 'Donkergrijs', description: 'Bedrag per 10cm: 7,80', image: '/img203.jpg' },
  { id: 'taupe', title: 'Taupe', description: 'Bedrag per 10cm: 6,50', image: '/img205.jpg' },
  { id: 'beige', title: 'Beige', description: 'Bedrag per 10cm: 5,70', image: '/img207.jpg' },
  { id: 'zandsteen', title: 'Zandsteen', description: 'Bedrag per 10cm: 7,00', image: '/img209.jpg' },
  { id: 'natuur-eiken', title: 'Natuur eiken', description: 'Bedrag per 10cm: 8,80', image: '/img211.jpg' },
  { id: 'walnoot', title: 'Walnoot', description: 'Bedrag per 10cm: 9,20', image: '/img213.jpg' },
  { id: 'noten', title: 'Noten', description: 'Bedrag per 10cm: 8,60', image: '/img215.jpg' },
  { id: 'eiken-matt', title: 'Eiken mat', description: 'Bedrag per 10cm: 7,60', image: '/img219.jpg' },
  { id: 'eiken-glans', title: 'Eiken hoogglans', description: 'Bedrag per 10cm: 8,00', image: '/img241.jpg' },
  { id: 'wit-matt', title: 'Wit mat', description: 'Bedrag per 10cm: 6,10', image: '/img243.jpg' },
  { id: 'wit-glans', title: 'Wit hoogglans', description: 'Bedrag per 10cm: 6,90', image: '/img197.jpg' },
  { id: 'off-white', title: 'Off-white', description: 'Bedrag per 10cm: 5,40', image: '/img199.jpg' },
  { id: 'crème', title: 'Crème', description: 'Bedrag per 10cm: 6,30', image: '/img201.jpg' },
  { id: 'melk', title: 'Melk', description: 'Bedrag per 10cm: 5,60', image: '/img203.jpg' },
  { id: 'steengrijs', title: 'Steengrijs', description: 'Bedrag per 10cm: 7,40', image: '/img205.jpg' },
  { id: 'charcoal', title: 'Charcoal', description: 'Bedrag per 10cm: 8,50', image: '/img207.jpg' },
  { id: 'grijs-blauw', title: 'Grijs blauw', description: 'Bedrag per 10cm: 7,90', image: '/img209.jpg' },
  { id: 'licht-beige', title: 'Licht beige', description: 'Bedrag per 10cm: 5,30', image: '/img211.jpg' },
  { id: 'terracotta', title: 'Terracotta', description: 'Bedrag per 10cm: 8,20', image: '/img213.jpg' },
  { id: 'zilver', title: 'Zilver', description: 'Bedrag per 10cm: 9,40', image: '/img215.jpg' },
  { id: 'aluminium', title: 'Aluminium', description: 'Bedrag per 10cm: 9,80', image: '/img219.jpg' },
  { id: 'rood-bruin', title: 'Rood bruin', description: 'Bedrag per 10cm: 8,70', image: '/img241.jpg' },
  { id: 'mahonie', title: 'Mahonie', description: 'Bedrag per 10cm: 10,20', image: '/img243.jpg' },
  { id: 'wengé', title: 'Wengé', description: 'Bedrag per 10cm: 9,60', image: '/img197.jpg' },
];

// Side panel options (Side panel)

export interface SideOption {
  id: string;
  title: string;
  image: string;
}

export const SIDE_OPTIONS: SideOption[] = [
  { id: 'sneeuwwit', title: 'Sneeuwwit', image: '/img197.jpg' },
  { id: 'premiumwit', title: 'Premiumwit', image: '/img199.jpg' },
  { id: 'kalkwit', title: 'Kalkwit', image: '/img201.jpg' },
  { id: 'magic-grijs', title: 'Magic-grijs', image: '/img203.jpg' },
  { id: 'klei', title: 'Klei', image: '/img205.jpg' },
  { id: 'magnolia', title: 'Magnolia', image: '/img207.jpg' },
  { id: 'lichtgrijs', title: 'Lichtgrijs', image: '/img209.jpg' },
  { id: 'antraciet', title: 'Antraciet', image: '/img211.jpg' },
  { id: 'taupe', title: 'Taupe', image: '/img213.jpg' },
  { id: 'zand', title: 'Zand', image: '/img215.jpg' },
  { id: 'grafiet', title: 'Grafiet', image: '/img219.jpg' },
  { id: 'natuurwit', title: 'Natuurwit', image: '/img241.jpg' },
];

// Step three: choose cabinet type
// Configurator type page: cabinet group selection (onderkasten, bovenkasten, hoge kasten)
export interface ConfiguratorTypeOption {
  id: string;
  label: string;
  value: string;
}

export const CONFIGURATOR_TYPE_OPTIONS: ConfiguratorTypeOption[] = [
  { id: 'onderkasten', label: 'onderkasten', value: 'base' },
  { id: 'bovenkasten', label: 'bovenkasten', value: 'wall' },
  { id: 'hoge-kasten', label: 'hoge kasten', value: 'tall' },
];

// Subcategories page: subcategories per cabinet type (base, wall, tall)
export interface Subcategory {
  id: string;
  title: string;
  image: string;
}

export const SUBCATEGORIES_BY_TYPE: Record<string, Subcategory[]> = {
  base: [
    { id: 'base-60', title: 'Onderkast(en) 60cm breed', image: '/svg/base-60.svg' },
    { id: 'base-80', title: 'Onderkast(en) 80cm breed', image: '/svg/base-80.svg' },
    { id: 'base-100', title: 'Onderkast(en) 100cm breed', image: '/svg/base-100.svg' },
    { id: 'base-accessories', title: 'Onderkast accessoires', image: '/svg/base-accessories.svg' },
  ],
  wall: [
    { id: 'wall-60', title: 'Bovenkast(en) 60cm breed', image: '/svg/wall-60.svg' },
    { id: 'wall-80', title: 'Bovenkast(en) 80cm breed', image: '/svg/wall-80.svg' },
    { id: 'wall-accessories', title: 'Bovenkast accessoires', image: '/svg/wall-accessories.svg' },
  ],
  tall: [
    { id: 'tall-143', title: 'Hoge kast(en) 143cm hoog', image: '/svg/tall-143.svg' },
    { id: 'tall-194', title: 'Hoge kast(en) 194.8cm hoog', image: '/svg/tall-194.svg' },
    { id: 'tall-207', title: 'Hoge kast(en) 207.8cm hoog', image: '/svg/tall-207.svg' },
    { id: 'tall-220', title: 'Hoge kast(en) 220.8cm hoog', image: '/svg/tall-220.svg' },
    { id: 'tall-accessories', title: 'Hoge kast accessoires', image: '/svg/tall-accessories.svg' },
    { id: 'tall-panels', title: 'Hoge kast afwerkpanelen', image: '/svg/tall-panels.svg' },
  ],
};

// ——— Product page: configurator product detail dummy data ———

export interface ProductDimensionOption {
  value: string;
  label: string;
}

export interface ProductAddOn {
  id: string;
  name: string;
  price: number;
}

export interface ConfiguratorProduct {
  id: string;
  title: string;
  image: string;
  thumb?: string;
  dimensions: {
    width: ProductDimensionOption[];
    height: ProductDimensionOption[];
    depth: ProductDimensionOption[];
    plinth: ProductDimensionOption[];
  };
  doorSwing: {
    leftLabel: string;
    rightLabel: string;
    default: 'left' | 'right';
  };
  addOns: ProductAddOn[];
  productInformation: string[];
  basePrice: number;
}

export const CONFIGURATOR_PRODUCTS: ConfiguratorProduct[] = [
  {
    id: 'appliance-niche-178',
    title: 'Apparatenkast, met inbouwnis 178cm hoog',
    image: '/placeholder.png',
    thumb: '/placeholder.png',
    dimensions: {
      width: [
        { value: '60', label: '60 cm breed' },
        { value: '80', label: '80 cm breed' },
        { value: '100', label: '100 cm breed' },
      ],
      height: [
        { value: '207.8', label: '207.8 cm hoog' },
        { value: '194.8', label: '194.8 cm hoog' },
        { value: '220.8', label: '220.8 cm hoog' },
      ],
      depth: [
        { value: '58', label: '58 cm diep' },
        { value: '60', label: '60 cm diep' },
      ],
      plinth: [
        { value: '12.5', label: '12.5 cm hoge plint' },
        { value: '15', label: '15 cm hoge plint' },
      ],
    },
    doorSwing: { leftLabel: 'Deur links', rightLabel: 'Deur rechts', default: 'left' },
    addOns: [
      { id: 'front', name: 'Frontverlenging voor onderkastdeur', price: 53 },
      { id: 'top', name: 'Opzetkast', price: 158 },
    ],
    productInformation: [
      'hoogte 208cm excl. plinthoogte, met 2 deuren (onderste deur 77,6cm hoog) en een nis voor een geïntegreerde koel/vries combinatie 178,5cm',
      'draairichting deur volgens afbeelding',
      'kast wordt volledig voorgemonteerd geleverd',
      'Blum Clip Top scharnieren zijn standaard voorzien van ingebouwde demping met softclose',
      'stelpoten, grepen en plintmateriaal zijn inbegrepen',
    ],
    basePrice: 528,
  },
  {
    id: 'base-2-drawers-80',
    title: 'Onderkast met 2 lades, 80cm breed',
    image: '/placeholder.png',
    thumb: '/placeholder.png',
    dimensions: {
      width: [
        { value: '80', label: '80 cm breed' },
        { value: '60', label: '60 cm breed' },
        { value: '90', label: '90 cm breed' },
      ],
      height: [{ value: '72', label: '72 cm hoog' }],
      depth: [{ value: '60', label: '60 cm diep' }],
      plinth: [
        { value: '10', label: '10 cm hoge plint' },
        { value: '12.5', label: '12.5 cm hoge plint' },
      ],
    },
    doorSwing: { leftLabel: 'Deur links', rightLabel: 'Deur rechts', default: 'left' },
    addOns: [{ id: 'mats', name: 'Anti-slip matten voor lades', price: 25 }],
    productInformation: ['Robuuste onderkast met twee ruime lades', 'Voorzien van hoogwaardige ladegeleiders met soft-close', 'Ideaal voor bestek, pannen en keukengerei', 'Volledig voorgemonteerd geleverd'],
    basePrice: 380,
  },
  {
    id: 'wall-glass-60',
    title: 'Bovenkast met glazen deur, 60cm breed',
    image: '/placeholder.png',
    thumb: '/placeholder.png',
    dimensions: {
      width: [
        { value: '60', label: '60 cm breed' },
        { value: '45', label: '45 cm breed' },
      ],
      height: [
        { value: '90', label: '90 cm hoog' },
        { value: '72', label: '72 cm hoog' },
      ],
      depth: [{ value: '35', label: '35 cm diep' }],
      plinth: [],
    },
    doorSwing: { leftLabel: 'Deur links', rightLabel: 'Deur rechts', default: 'right' },
    addOns: [{ id: 'led', name: 'Geïntegreerde LED verlichting', price: 75 }],
    productInformation: ['Elegante bovenkast met gehard glazen deur', 'Inclusief twee verstelbare glazen planken', 'Soft-close scharnieren', 'Perfect voor het tentoonstellen van serviesgoed'],
    basePrice: 299,
  },
  {
    id: 'tall-pantry-60',
    title: 'Hoge voorraadkast, 60cm breed',
    image: '/placeholder.png',
    thumb: '/placeholder.png',
    dimensions: {
      width: [{ value: '60', label: '60 cm breed' }],
      height: [
        { value: '200', label: '200 cm hoog' },
        { value: '220', label: '220 cm hoog' },
      ],
      depth: [{ value: '60', label: '60 cm diep' }],
      plinth: [
        { value: '10', label: '10 cm hoge plint' },
        { value: '12.5', label: '12.5 cm hoge plint' },
      ],
    },
    doorSwing: { leftLabel: 'Deur links', rightLabel: 'Deur rechts', default: 'left' },
    addOns: [{ id: 'drawers', name: 'Set van 2 interne lades', price: 95 }],
    productInformation: ['Ruime voorraadkast met vier legplanken', 'Ideaal voor het opslaan van etenswaren en keukengerei', 'Verstelbare scharnieren voor perfecte uitlijning', 'Duurzaam en onderhoudsvriendelijk materiaal'],
    basePrice: 450,
  },
  {
    id: 'corner-base-90',
    title: 'Hoekonderkast, 90x90cm',
    image: '/placeholder.png',
    thumb: '/placeholder.png',
    dimensions: {
      width: [{ value: '90', label: '90 cm breed' }],
      height: [{ value: '72', label: '72 cm hoog' }],
      depth: [{ value: '60', label: '60 cm diep' }],
      plinth: [
        { value: '10', label: '10 cm hoge plint' },
        { value: '12.5', label: '12.5 cm hoge plint' },
      ],
    },
    doorSwing: { leftLabel: 'Deur links', rightLabel: 'Deur rechts', default: 'right' },
    addOns: [
      { id: 'carrousel', name: 'Carrousel systeem', price: 180 },
      { id: 'lemans', name: 'LeMans systeem', price: 250 },
    ],
    productInformation: ['Optimale benutting van hoekruimte in de keuken', 'Carrousel of LeMans-systeem selecteerbaar', 'Stevige constructie voor zware belastingen', 'Wordt geleverd met alle benodigde montagematerialen'],
    basePrice: 620,
  },
];
