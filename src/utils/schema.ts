export const SITE_URL = 'https://buildwithjeremy.com';
export const SITE_NAME = 'Build with Jeremy';
export const PERSON_NAME = 'Jeremy Pittman';
export const PERSON_JOB_TITLE = 'Strategic Ops Partner';
export const SOCIAL_PROFILES = [
  'https://www.linkedin.com/in/jeremy-pittman-49720428',
  'https://x.com/jeremyrpittman',
  'https://www.youtube.com/@buildwithjeremy',
];

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    founder: {
      '@type': 'Person',
      name: PERSON_NAME,
    },
    sameAs: SOCIAL_PROFILES,
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PERSON_NAME,
    url: `${SITE_URL}/about`,
    jobTitle: PERSON_JOB_TITLE,
    worksFor: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    sameAs: SOCIAL_PROFILES,
    image: `${SITE_URL}/images/jeremy-head-shot.webp`,
    description: '12 years at Google in ops, logistics, and product launches. Now helping service businesses build systems that scale.',
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function serviceSchema(service: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function blogPostSchema(post: {
  title: string;
  description?: string;
  url: string;
  publishDate: string;
  modifiedDate?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: post.url,
    datePublished: post.publishDate,
    dateModified: post.modifiedDate || post.publishDate,
    ...(post.image && { image: `${SITE_URL}${post.image}` }),
    author: {
      '@type': 'Person',
      name: PERSON_NAME,
      url: `${SITE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
  };
}
