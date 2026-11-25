/* Fight cards for /battle-calls/. Newest first.
   Each card is one public call versus the market. The right corner is always
   THE MARKET. Do not add a second person, an avatar URL, or a profile photo.

   Add a card:
   1. Copy the object below.
   2. Paste the copy above it, at the top of FIGHT_CARDS.
   3. Fill in the caller's own words and the tape. Do not invent a number.
      There is no stop field. progress.target is the call's number.
      If they gave a range, use only the lower number. The renderer
      computes both KOs from entry and target. See
      /battle-calls/methodology/.
   4. Set status to OPEN, WIN BY KO, WIN BY DECISION, LOSS BY KO,
      LOSS BY DECISION, UNDER REVIEW, or EXPIRED.
   5. Reload /battle-calls/. The renderer in fight-card.js draws the card.

   progress.target is the call's number, not the KO. The renderer works in
   cents. Caller's KO is one penny past that number, in the caller's
   direction. Market's KO is the exact cent distance the other way from
   entry, plus one more penny. A distance over 50% of entry is capped first,
   then the extra penny is applied. The shown percent is the exact move to
   one decimal. It is not used to price the KO. The bar runs from Market's KO
   on the left to Caller's KO on the right. entryLabel and markLabel are the
   words readers see.
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
      winRule: "A touch at $166.01 or higher before the Dec 31, 2026 close"
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
      markLabel: "High $171.50"
    }
  }
];
