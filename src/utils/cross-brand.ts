/**
 * Links from this site to buildmysystem.co, tagged per BWJ-Ops/utm-convention.md:
 * utm_source names where the link lives, utm_medium=cross-brand, utm_content names
 * the placement on the page.
 *
 * Tagged URLs are kept out of Google's index by an X-Robots-Tag: noindex header on
 * any request with a utm_source parameter (vercel.json on both sites). Without that
 * header, Google indexed /pricing?utm_source=... as a separate page (GSC to
 * 2026-09-12), which is why these links went untagged for two months.
 *
 * Mirror of src/utils/cross-brand.ts in buildmysystem-website.
 */
export const crossBrandHref = (url: string, content: string): string => {
  const u = new URL(url);
  u.searchParams.set('utm_source', 'buildwithjeremy-com');
  u.searchParams.set('utm_medium', 'cross-brand');
  u.searchParams.set('utm_content', content);
  return u.toString();
};
