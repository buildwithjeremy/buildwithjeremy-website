/**
 * DataForSEO Keyword Audit Script
 *
 * Checks keyword volumes and rankings for buildwithjeremy.com target terms.
 * Reads credentials from .env.txt (DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD).
 *
 * Usage: npx tsx scripts/seo-audit.ts
 * Output: scripts/output/seo-audit.csv
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.txt manually since Vite/Astro only reads .env
function loadEnv(): Record<string, string> {
  const envPath = path.join(__dirname, '..', '.env.txt');
  if (!fs.existsSync(envPath)) {
    console.error('No .env.txt found. Add DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD there.');
    process.exit(1);
  }
  return Object.fromEntries(
    fs.readFileSync(envPath, 'utf8')
      .split('\n')
      .filter(l => l.includes('=') && !l.startsWith('#'))
      .map(l => l.split('=').map(s => s.trim()) as [string, string])
  );
}

const env = loadEnv();
const LOGIN = env['DATAFORSEO_LOGIN'];
const PASSWORD = env['DATAFORSEO_PASSWORD'];

if (!LOGIN || !PASSWORD) {
  console.error('Missing DATAFORSEO_LOGIN or DATAFORSEO_PASSWORD in .env.txt');
  process.exit(1);
}

const AUTH = Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64');
const BASE_URL = 'https://api.dataforseo.com/v3';

async function dfsPost(endpoint: string, body: object[]): Promise<any> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${AUTH}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`DataForSEO ${endpoint} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// Target keywords for buildwithjeremy.com
const TARGET_KEYWORDS = [
  // Core service keywords
  'fractional coo',
  'fractional coo services',
  'fractional coo consultant',
  'fractional coo for small business',
  'hire fractional coo',
  'fractional chief operating officer',
  // Operations consulting
  'operations consultant small business',
  'strategic operations consultant',
  'business operations consultant',
  'business systems consultant',
  'workflow automation consultant',
  'business process consultant',
  'business automation consultant',
  'outsource operations management',
  'small business process improvement',
  // AI / automation angle
  'ai employee for agencies',
  'ai automation for marketing agencies',
  'ai automation for agencies',
  'agency automation consultant',
  'ai tools for agencies',
  // Pain point searches
  'how to scale service business',
  'operations bottleneck business',
  'business scaling consultant',
  'remote team operations consultant',
];

interface KeywordResult {
  keyword: string;
  searchVolume: number | null;
  competition: string | null;
  cpc: number | null;
  difficulty: number | null;
}

async function getKeywordData(keywords: string[]): Promise<KeywordResult[]> {
  console.log(`\nFetching keyword data for ${keywords.length} keywords...`);

  const body = [{
    keywords,
    location_code: 2840, // United States
    language_code: 'en',
  }];

  try {
    const data = await dfsPost('/keywords_data/google_ads/search_volume/live', body);

    if (data.status_code !== 20000) {
      console.error('API error:', data.status_message);
      return keywords.map(k => ({ keyword: k, searchVolume: null, competition: null, cpc: null, difficulty: null }));
    }

    const items = data.tasks?.[0]?.result || [];
    return keywords.map(keyword => {
      const item = items.find((i: any) => i.keyword?.toLowerCase() === keyword.toLowerCase());
      return {
        keyword,
        searchVolume: item?.search_volume ?? null,
        competition: item?.competition ?? null,
        cpc: item?.cpc ?? null,
        difficulty: null, // Will enrich separately
      };
    });
  } catch (err) {
    console.error('Keyword volume fetch failed:', err);
    return keywords.map(k => ({ keyword: k, searchVolume: null, competition: null, cpc: null, difficulty: null }));
  }
}

async function getKeywordDifficulty(keywords: string[]): Promise<Record<string, number>> {
  console.log(`\nFetching keyword difficulty for ${keywords.length} keywords...`);

  const body = [{
    keywords,
    location_code: 2840,
    language_code: 'en',
  }];

  try {
    const data = await dfsPost('/dataforseo_labs/google/bulk_keyword_difficulty/live', body);

    const difficulties: Record<string, number> = {};
    const items = data.tasks?.[0]?.result || [];
    for (const item of items) {
      if (item.keyword && item.keyword_difficulty != null) {
        difficulties[item.keyword] = item.keyword_difficulty;
      }
    }
    return difficulties;
  } catch (err) {
    console.error('Keyword difficulty fetch failed:', err);
    return {};
  }
}

async function getSerpRankings(domain: string, keywords: string[]): Promise<Record<string, number | null>> {
  console.log(`\nChecking SERP rankings for ${domain}...`);

  const rankings: Record<string, number | null> = {};

  // DataForSEO SERP live endpoint - check a sample of keywords to stay within credits
  const sampleKeywords = keywords.slice(0, 10);

  for (const keyword of sampleKeywords) {
    try {
      const body = [{
        keyword,
        location_code: 2840,
        language_code: 'en',
        device: 'desktop',
        os: 'macos',
        depth: 100,
      }];

      const data = await dfsPost('/serp/google/organic/live/advanced', body);
      const items = data.tasks?.[0]?.result?.[0]?.items || [];

      const domainResult = items.find((item: any) =>
        item.domain === domain || item.url?.includes(domain)
      );

      rankings[keyword] = domainResult?.rank_absolute ?? null;
    } catch (err) {
      rankings[keyword] = null;
    }

    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 200));
  }

  return rankings;
}

function toCsv(rows: KeywordResult[], rankings: Record<string, number | null>): string {
  const headers = ['Keyword', 'Monthly Searches', 'Competition', 'CPC ($)', 'Keyword Difficulty', 'Current Rank (buildwithjeremy.com)', 'Priority'];

  const getPriority = (row: KeywordResult, rank: number | null): string => {
    const vol = row.searchVolume ?? 0;
    const diff = row.difficulty ?? 50;
    if (vol > 500 && diff < 40) return 'HIGH - Quick Win';
    if (vol > 200 && diff < 60) return 'MEDIUM - Worth targeting';
    if (rank && rank <= 20) return 'MEDIUM - Already ranking, optimize';
    if (vol > 100) return 'LOW - Long-term play';
    return 'MONITOR';
  };

  const dataRows = rows.map(row => [
    row.keyword,
    row.searchVolume ?? 'N/A',
    row.competition ?? 'N/A',
    row.cpc != null ? `$${row.cpc.toFixed(2)}` : 'N/A',
    row.difficulty ?? 'N/A',
    rankings[row.keyword] != null ? `#${rankings[row.keyword]}` : 'Not in top 100',
    getPriority(row, rankings[row.keyword] ?? null),
  ]);

  return [headers, ...dataRows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
}

async function main() {
  console.log('=== Build with Jeremy — SEO Keyword Audit ===');
  console.log(`Date: ${new Date().toISOString().split('T')[0]}`);
  console.log(`Keywords to analyze: ${TARGET_KEYWORDS.length}`);

  // Fetch keyword volumes and difficulty in parallel
  const [volumeData, difficulties, rankings] = await Promise.all([
    getKeywordData(TARGET_KEYWORDS),
    getKeywordDifficulty(TARGET_KEYWORDS),
    getSerpRankings('buildwithjeremy.com', TARGET_KEYWORDS),
  ]);

  // Merge difficulty into volume data
  const enriched = volumeData.map(row => ({
    ...row,
    difficulty: difficulties[row.keyword] ?? null,
  }));

  // Sort by opportunity (volume desc, difficulty asc)
  enriched.sort((a, b) => {
    const scoreA = (a.searchVolume ?? 0) / Math.max(a.difficulty ?? 50, 1);
    const scoreB = (b.searchVolume ?? 0) / Math.max(b.difficulty ?? 50, 1);
    return scoreB - scoreA;
  });

  // Write CSV
  const csv = toCsv(enriched, rankings);
  const outPath = path.join(__dirname, 'output', 'seo-audit.csv');
  fs.writeFileSync(outPath, csv, 'utf8');

  // Print summary to console
  console.log('\n=== TOP OPPORTUNITIES ===');
  const topOpps = enriched.filter(r => (r.searchVolume ?? 0) > 100).slice(0, 10);
  for (const row of topOpps) {
    const rank = rankings[row.keyword];
    console.log(`  "${row.keyword}"`);
    console.log(`    Volume: ${row.searchVolume ?? 'N/A'} | Difficulty: ${row.difficulty ?? 'N/A'} | Rank: ${rank != null ? '#' + rank : 'Not ranking'}`);
  }

  console.log(`\n✓ Full CSV saved to: ${outPath}`);
  console.log(`  ${enriched.length} keywords analyzed`);
}

main().catch(console.error);
