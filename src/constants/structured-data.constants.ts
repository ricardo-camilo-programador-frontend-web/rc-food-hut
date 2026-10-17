import { env } from '@/configs/env';

export const RESTAURANT_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Food Hut",
  "description": "Discover delicious meals crafted with passion. Order online for delivery or pickup from Food Hut.",
  "url": env.SITE_URL,
  "image": `${env.SITE_URL}assets/images/og-image.webp`,
  "servesCuisine": ["American", "Fast Food", "Burgers", "Pizza"],
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Food Street",
    "addressLocality": "Anytown",
    "addressRegion": "CA",
    "postalCode": "90210",
    "addressCountry": "US"
  },
  "telephone": "+1-555-123-4567",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "10:00",
      "closes": "22:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday", "Sunday"],
      "opens": "09:00",
      "closes": "23:00"
    }
  ],
  "sameAs": [
    "https://facebook.com/foodhut",
    "https://instagram.com/foodhut",
    "https://twitter.com/foodhut"
  ]
} as const;
