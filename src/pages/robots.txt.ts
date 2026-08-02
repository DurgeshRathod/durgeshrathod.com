import type { APIRoute } from 'astro';
import { SITE } from '../consts.ts';

/**
 * Generated rather than static so the sitemap URL always matches the deploy target.
 *
 * The AI crawlers are allowed deliberately. Blocking them is the default advice for
 * publishers protecting ad revenue; for a consultant it is exactly backwards — being
 * quotable by an assistant that someone asks "who can help fix our AI agent" is the
 * whole point. Each bot is listed explicitly because a blanket Allow is easy to
 * misread later as an oversight rather than a decision.
 */
const AI_CRAWLERS = [
  // OpenAI
  'GPTBot', // training + retrieval
  'OAI-SearchBot', // ChatGPT search index
  'ChatGPT-User', // live fetches during a conversation
  // Anthropic
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  // Perplexity
  'PerplexityBot',
  'Perplexity-User',
  // Google — controls Gemini grounding and AI Overviews, not ordinary crawling
  'Google-Extended',
  // Others
  'Applebot-Extended',
  'cohere-ai',
  'Meta-ExternalAgent',
  'Amazonbot',
  'DuckAssistBot',
  'MistralAI-User',
  'YouBot',
];

export const GET: APIRoute = () => {
  const lines = [
    '# Search engines — full access',
    'User-agent: *',
    'Allow: /',
    '',
    '# AI assistants and answer engines — explicitly allowed.',
    '# This site exists to be found and cited. See /llms.txt for a structured summary.',
    ...AI_CRAWLERS.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']),
    `Sitemap: ${SITE.url}/sitemap-index.xml`,
    '',
    `# Structured summary for language models: ${SITE.url}/llms.txt`,
    `# Full text for language models: ${SITE.url}/llms-full.txt`,
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
