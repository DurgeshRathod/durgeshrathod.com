/**
 * IndexNow submitter — tells participating search engines to crawl URLs now rather
 * than whenever they next get around to it.
 *
 *   npm run indexnow              submit every URL in the built sitemap
 *   npm run indexnow -- /notes/x  submit specific paths (or absolute URLs)
 *
 * One endpoint, api.indexnow.org, fans out to every participating engine — Bing,
 * Yandex, Seznam, Naver. Bing matters most here: its index feeds ChatGPT, Copilot and
 * DuckDuckGo, and as of 2026-08-04 it had zero pages of this site.
 *
 * Ownership is proved by hosting a key file, not by registering anything — so the key
 * file MUST be deployed before submitting, which is why this script refuses to run
 * until it can fetch it. That check exists because the alternative is a bare 403 with
 * no explanation.
 *
 * Run it manually after publishing. Deliberately not wired into the build: resubmitting
 * 40 unchanged URLs on every deploy is exactly the pattern the spec asks you not to
 * follow, and it would train engines to ignore the signal.
 */
import fs from 'node:fs';
import path from 'node:path';

const KEY = '054431d00f8042ff943d7db2eb897184';
const HOST = 'durgeshrathod.com';
const ORIGIN = `https://${HOST}`;
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITEMAP = path.join(process.cwd(), 'dist', 'sitemap-0.xml');

/** IndexNow's documented responses. Anything else is surfaced verbatim. */
const MEANING = {
  200: 'OK — URLs received',
  202: 'Accepted — received, key validation pending',
  400: 'Bad request — malformed JSON',
  403: 'Forbidden — key file missing, unreachable, or does not match',
  422: 'Unprocessable — a URL does not belong to this host, or the key does not match the host',
  429: 'Too many requests — treated as spam, back off',
};

const args = process.argv.slice(2);

/** Accept bare paths for convenience; normalise everything to absolute URLs on this host. */
function normalise(u) {
  const abs = u.startsWith('http') ? u : ORIGIN + (u.startsWith('/') ? u : `/${u}`);
  const parsed = new URL(abs);
  if (parsed.hostname !== HOST) throw new Error(`${u} is not on ${HOST} — IndexNow rejects cross-host URLs`);
  return parsed.href;
}

function fromSitemap() {
  if (!fs.existsSync(SITEMAP)) {
    console.error(`No sitemap at ${SITEMAP}. Run \`npm run build\` first.`);
    process.exit(1);
  }
  const xml = fs.readFileSync(SITEMAP, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

let urlList;
try {
  urlList = args.length ? args.map(normalise) : fromSitemap();
} catch (e) {
  // A bad argument is a typo, not a bug — say so in one line rather than a stack trace.
  console.error(e.message);
  process.exit(1);
}

if (!urlList.length) {
  console.error('Nothing to submit.');
  process.exit(1);
}

// Pre-flight. Ownership is proved by this file alone, so if it is not live the whole
// submission is wasted — fail loudly here instead of decoding a 403 later.
process.stdout.write(`Checking key file at ${KEY_LOCATION} ... `);
let live;
try {
  live = await fetch(KEY_LOCATION);
} catch (e) {
  console.log('FAILED');
  console.error(`Could not reach ${KEY_LOCATION}: ${e.message}`);
  process.exit(1);
}
if (!live.ok) {
  console.log(`HTTP ${live.status}`);
  console.error(`The key file is not being served. Deploy public/${KEY}.txt before submitting.`);
  process.exit(1);
}
const served = (await live.text()).trim();
if (served !== KEY) {
  console.log('MISMATCH');
  console.error(`Served key is "${served}" but this script sends "${KEY}".`);
  process.exit(1);
}
console.log('ok');

console.log(`Submitting ${urlList.length} URL(s) to ${ENDPOINT}`);

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
});

const body = await res.text();
console.log(`\nHTTP ${res.status} — ${MEANING[res.status] ?? 'unexpected status'}`);
if (body.trim()) console.log(body.trim());

if (res.status === 200 || res.status === 202) {
  console.log(`\n${urlList.length} URL(s) submitted. Bing typically crawls within hours.`);
  console.log('Check progress in Bing Webmaster Tools → URL Submission.');
  process.exit(0);
}
process.exit(1);
