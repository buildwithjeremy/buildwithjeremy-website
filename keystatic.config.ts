import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: {
      name: 'Build with Jeremy',
    },
  },
  singletons: {
    settings: singleton({
      label: 'Site Settings',
      path: 'src/content/settings',
      schema: {
        siteName: fields.text({ label: 'Site Name', validation: { isRequired: true } }),
        siteDescription: fields.text({ label: 'Site Description', multiline: true }),
        socialLinks: fields.object({
          facebook: fields.url({ label: 'Facebook URL' }),
          linkedin: fields.url({ label: 'LinkedIn URL' }),
          twitter: fields.url({ label: 'X (Twitter) URL' }),
          youtube: fields.url({ label: 'YouTube URL' }),
        }),
        bookingUrl: fields.url({ label: 'Booking/Calendar URL (Cal.com or Calendly)' }),
      },
    }),
    homepage: singleton({
      label: 'Homepage',
      path: 'src/content/homepage',
      schema: {
        heroHeadline: fields.text({ label: 'Hero Headline', validation: { isRequired: true } }),
        heroSubheadline: fields.text({ label: 'Hero Subheadline', multiline: true }),
        heroCtaText: fields.text({ label: 'Hero CTA Button Text' }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'src/assets/images',
          publicPath: '/src/assets/images/',
        }),
        valueProposition: fields.document({
          label: 'Value Proposition Section',
          formatting: true,
          links: true,
        }),
        aboutPreview: fields.document({
          label: 'About Preview (shown on homepage)',
          formatting: true,
          links: true,
        }),
      },
    }),
    about: singleton({
      label: 'About Page',
      path: 'src/content/about',
      schema: {
        headline: fields.text({ label: 'Page Headline', validation: { isRequired: true } }),
        bio: fields.document({
          label: 'Full Bio',
          formatting: true,
          links: true,
        }),
        headshot: fields.image({
          label: 'Headshot',
          directory: 'src/assets/images',
          publicPath: '/src/assets/images/',
        }),
        credentials: fields.array(
          fields.object({
            title: fields.text({ label: 'Credential/Experience' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          {
            label: 'Credentials & Experience',
            itemLabel: (props) => props.fields.title.value || 'Credential',
          }
        ),
      },
    }),
  },
  collections: {
    blog: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
        description: fields.text({ label: 'Description', multiline: true }),
        publishDate: fields.date({ label: 'Publish Date', validation: { isRequired: true } }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'src/assets/images/blog',
          publicPath: '/src/assets/images/blog/',
        }),
        content: fields.mdx({
          label: 'Content',
        }),
      },
    }),
    portfolio: collection({
      label: 'Portfolio / Case Studies',
      slugField: 'title',
      path: 'src/content/portfolio/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
        client: fields.text({ label: 'Client Name' }),
        description: fields.text({ label: 'Short Description', multiline: true }),
        industry: fields.text({ label: 'Industry' }),
        publishDate: fields.date({ label: 'Publish Date' }),
        featured: fields.checkbox({ label: 'Featured on Homepage', defaultValue: false }),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'src/assets/images/portfolio',
          publicPath: '/src/assets/images/portfolio/',
        }),
        results: fields.array(
          fields.object({
            metric: fields.text({ label: 'Metric' }),
            value: fields.text({ label: 'Value/Result' }),
          }),
          {
            label: 'Key Results',
            itemLabel: (props) => props.fields.metric.value || 'Result',
          }
        ),
        content: fields.mdx({
          label: 'Full Case Study',
        }),
      },
    }),
    services: collection({
      label: 'Services',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Service Name', validation: { isRequired: true } } }),
        tagline: fields.text({ label: 'Tagline', multiline: true }),
        description: fields.text({ label: 'Short Description', multiline: true }),
        price: fields.text({ label: 'Price/Pricing Info' }),
        featured: fields.checkbox({ label: 'Show on Homepage', defaultValue: true }),
        order: fields.integer({ label: 'Display Order', defaultValue: 0 }),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'src/assets/images/services',
          publicPath: '/src/assets/images/services/',
        }),
        benefits: fields.array(
          fields.object({
            title: fields.text({ label: 'Benefit Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          {
            label: 'Benefits / What You Get',
            itemLabel: (props) => props.fields.title.value || 'Benefit',
          }
        ),
        content: fields.mdx({
          label: 'Full Service Description',
        }),
      },
    }),
    resources: collection({
      label: 'Resources / Downloads',
      slugField: 'title',
      path: 'src/content/resources/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
        description: fields.text({ label: 'Description', multiline: true }),
        resourceType: fields.select({
          label: 'Resource Type',
          options: [
            { label: 'Guide', value: 'guide' },
            { label: 'Template', value: 'template' },
            { label: 'Checklist', value: 'checklist' },
            { label: 'Ebook', value: 'ebook' },
            { label: 'Video', value: 'video' },
          ],
          defaultValue: 'guide',
        }),
        gated: fields.checkbox({ label: 'Require Email to Download', defaultValue: true }),
        downloadUrl: fields.url({ label: 'Download URL (if external)' }),
        featuredImage: fields.image({
          label: 'Cover Image',
          directory: 'src/assets/images/resources',
          publicPath: '/src/assets/images/resources/',
        }),
        content: fields.mdx({
          label: 'Landing Page Content',
        }),
      },
    }),
  },
});
