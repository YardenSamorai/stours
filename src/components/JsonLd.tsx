type JsonLdProps = {
  data: Record<string, unknown>;
};

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'דיל טורס - Deal Tours',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://dealtours.co.il',
    telephone: '+972-52-511-8536',
    email: 'Stours.bookings@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
    },
    sameAs: [],
    description: 'סוכנות הנסיעות המובילה בישראל - חבילות נופש, טיסות ומלונות במחירים הטובים ביותר',
  };
  return <JsonLd data={data} />;
}

export function ArticleJsonLd({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  url,
}: {
  title: string;
  description?: string | null;
  image?: string | null;
  datePublished?: Date | null;
  dateModified?: Date | null;
  authorName?: string | null;
  url: string;
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    url,
    ...(description && { description }),
    ...(image && { image }),
    ...(datePublished && { datePublished: datePublished.toISOString() }),
    ...(dateModified && { dateModified: dateModified.toISOString() }),
    ...(authorName && {
      author: { '@type': 'Person', name: authorName },
    }),
    publisher: {
      '@type': 'Organization',
      name: 'Deal Tours - דיל טורס',
    },
  };
  return <JsonLd data={data} />;
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  currency,
  url,
}: {
  name: string;
  description?: string | null;
  image?: string | null;
  price: number;
  currency: string;
  url: string;
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    url,
    ...(description && { description }),
    ...(image && { image }),
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
    },
  };
  return <JsonLd data={data} />;
}
