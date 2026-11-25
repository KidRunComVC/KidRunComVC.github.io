/* Fight cards for /battle-calls/. Newest first.
   Each card is one public call versus the market. The right corner is always
   THE MARKET. Do not add a second person, an avatar URL, or a profile photo.

   Add a card:
   1. Copy the object below.
   2. Paste the copy above it, at the top of FIGHT_CARDS.
   3. Fill in the caller's own words and the tape. Do not invent a number.
      There is no stop field. Caller's KO is the target number.
      If they gave a range, use only the lower number. Market's KO is
      computed. See /battle-calls/methodology/.
   4. Set status to OPEN, WIN BY KO, WIN BY DECISION, LOSS BY KO,
      LOSS BY DECISION, UNDER REVIEW, or EXPIRED.
   5. Reload /battle-calls/. The renderer in fight-card.js draws the card.

   progress.target is Caller's KO, the one number that counts.
   callSize is the percent move from entry to that number (0.322 is 32.2%).
   Market's KO is that same move the other way from entry, capped at 50%,
   rounded to cents. The bar runs from Market's KO on the left to Caller's KO
   on the right. Leave callSize off and the percent is taken from the entry
   and target prices. entryLabel and markLabel are the words readers see.
   Omit progress and the bar stays hidden. Omit result details on an open card.
   result.scoredBy is the name only. The card adds "Scored by". */
var FIGHT_CARDS = [
  {
    handle: "@MentoviaX",
    followers: "~31.6K followers",
    date: "Fri Nov 20, 2026, 10:54 PM ET",
    dateTime: "2026-11-20T22:54:00-05:00",
    quote: "PREDICTION: NVIDIA $NVDA WILL SEE $166-172 BY YEAR END AFTER HITTING MY $130 TARGET.",
    sourceUrl: "https://x.com/MentoviaX/status/2123988433618207160",
    tape: {
      asset: "NVDA",
      direction: "Bullish",
      entry: "$125.53",
      entryNote: "official Nov 20 close",
      deadline: "Dec 31, 2026 close",
      winRule: "A touch at or above $166.00 before the Dec 31, 2026 close (an intraday touch counts)"
    },
    status: "WIN BY KO",
    result: {
      when: "Mon Nov 23, after one session",
      detail: "Regular-session high $171.50 at 10:25 AM ET.",
      barLabel: "Nov 23",
      bar: { open: "167.04", high: "171.50", low: "156.93", close: "165.05" },
      scoredBy: "HLK IV Quant"
    },
    progress: {
      entry: 125.53,
      entryLabel: "Entry $125.53",
      target: 166,
      mark: 171.5,
      markLabel: "High $171.50",
      callSize: 0.322
    }
  }
];
