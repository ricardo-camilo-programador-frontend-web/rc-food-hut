export interface PageMetadata {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: Record<string, unknown>;
}

export interface OpenGraphMeta {
  property: string;
  content: string;
}

export interface TwitterCardMeta {
  name: string;
  content: string;
}

export interface StructuredDataBase {
  '@context': string;
  '@type': string;
}

export interface RestaurantStructuredData extends StructuredDataBase {
  '@type': 'Restaurant';
  name: string;
  description: string;
  url: string;
  image: string;
  servesCuisine: readonly string[];
  priceRange: string;
  address: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone: string;
  openingHoursSpecification: readonly {
    '@type': 'OpeningHoursSpecification';
    dayOfWeek: readonly string[];
    opens: string;
    closes: string;
  }[];
  sameAs: readonly string[];
}
