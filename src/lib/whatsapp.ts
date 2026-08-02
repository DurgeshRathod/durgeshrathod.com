import { CONTACT, SITE } from '../consts.ts';

/**
 * WhatsApp click-to-chat. No API, no backend, no business account required —
 * wa.me accepts a phone number in E.164 (digits only) plus URL-encoded text.
 *
 * The leverage here is that JavaScript composes `text` from whatever the visitor
 * just did, so a lead arrives already describing their own problem.
 */
export function waLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Exposed to client scripts via a data attribute so the number lives in one place. */
export const WA_BASE = `https://wa.me/${CONTACT.whatsapp}?text=`;

export function mailtoLink(subject: string, body: string): string {
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Default openers for static CTAs, kept together so their tone stays consistent. */
export const WA_MESSAGES = {
  general: `Hi Durgesh — I found your site and I'd like to talk about our AI agent setup.`,

  audit: `Hi Durgesh — I'm interested in the Agent Production Readiness Audit.

Our agent: (what it does)
Stack: (framework + model)
Volume: (roughly how many conversations a month)
Biggest worry: (what's keeping you up)`,

  retainer: `Hi Durgesh — I'd like to talk about the Fractional AI Reliability Lead retainer.

Team size:
What our agents do:
What's currently unowned:`,

  hiring: `Hi Durgesh — I have a role I think you'd fit. Details:

Company:
Role:
Remote / timezone expectations:
Comp range:`,
} as const;

/**
 * Scorecard handoff. Built on the client from the visitor's answers, so the first
 * message already contains the score, the failing areas, and their context —
 * which is most of a discovery call.
 */
export interface ScorecardHandoff {
  score: number;
  band: string;
  weakest: string[];
  criticalGaps: string[];
  stack?: string;
  volume?: string;
}

export function scorecardMessage(r: ScorecardHandoff): string {
  const lines = [
    `Hi Durgesh — I completed the Agent Production Readiness Scorecard on ${SITE.url.replace(/^https?:\/\//, '')}.`,
    ``,
    `Score: ${r.score}/100 (${r.band})`,
    `Weakest areas: ${r.weakest.join(', ') || 'none flagged'}`,
  ];
  if (r.criticalGaps.length) {
    lines.push(`Critical gaps: ${r.criticalGaps.join('; ')}`);
  }
  if (r.stack) lines.push(`Stack: ${r.stack}`);
  if (r.volume) lines.push(`Volume: ${r.volume}`);
  lines.push(``, `I'd like to discuss what to fix first.`);
  return lines.join('\n');
}

/** Cost-calculator handoff — the visitor has just seen a number they dislike. */
export interface CostHandoff {
  monthly: string;
  perConversation: string;
  model: string;
  preset: string;
  wastedOnRetries: string;
  potentialSaving: string;
}

export function costMessage(r: CostHandoff): string {
  return [
    `Hi Durgesh — I used the agent cost calculator on your site.`,
    ``,
    `Workload: ${r.preset}`,
    `Model: ${r.model}`,
    `Estimated spend: ${r.monthly}/month (${r.perConversation} per conversation)`,
    `Lost to retries: ${r.wastedOnRetries}/month`,
    `Calculator suggests up to ${r.potentialSaving}/month recoverable`,
    ``,
    `I'd like to talk about getting this down without hurting quality.`,
  ].join('\n');
}
