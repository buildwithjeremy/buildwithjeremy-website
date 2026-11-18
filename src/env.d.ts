// gtag is defined by src/components/GoogleAnalytics.astro, which assigns
// window.gtag. It only renders in production with PUBLIC_GA4_ID set, so callers
// guard with `typeof gtag !== 'undefined'`.
declare function gtag(...args: unknown[]): void;

interface Window {
  gtag?: (...args: unknown[]) => void;
}
