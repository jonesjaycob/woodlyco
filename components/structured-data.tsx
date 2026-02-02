export function LocalBusinessJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Woodly Company",
    description:
      "Custom handcrafted wooden light posts built with traditional timber frame methods. Solar, battery, or electric options for driveways, gardens, and yards.",
    url: "https://woodlyco.com",
    telephone: "+1-775-848-8609",
    email: "hello@woodlyco.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pell City",
      addressRegion: "AL",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 33.5862,
      longitude: -86.2861,
    },
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    sameAs: [],
    image: "https://woodlyco.com/IMG_5638.jpg",
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: "Custom Wooden Light Post",
        description:
          "Handcrafted 11×11×11 foot wooden light post with traditional mortise and tenon joinery",
        brand: {
          "@type": "Brand",
          name: "Woodly Company",
        },
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function ProductJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Handcrafted Wooden Light Post",
    description:
      "Custom 11×11×11 foot wooden light post built with traditional timber frame methods. Available with solar, battery, or electric power options.",
    brand: {
      "@type": "Brand",
      name: "Woodly Company",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Woodly Company",
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "2400",
      highPrice: "5000",
      priceCurrency: "USD",
      availability: "https://schema.org/MadeToOrder",
      seller: {
        "@type": "Organization",
        name: "Woodly Company",
      },
    },
    image: "https://woodlyco.com/IMG_5638.jpg",
    material: "Wood",
    category: "Outdoor Lighting",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
