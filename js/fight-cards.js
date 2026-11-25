/* Fight cards for /battle-calls/. Newest first.
   Each card is one public call versus THE MARKET. The right corner is always
   THE MARKET. Do not add a second person, an avatar URL, or a profile photo.

   Add a card:
   1. Copy the object below.
   2. Paste the copy above it, at the top of FIGHT_CARDS.
   3. Fill in the caller's own words and the tape. Do not invent a number.
      There is no stop field. progress.target is the call's number.
      If they gave a range, use only the lower number. The renderer
      computes both KOs from entry and target. See
      /battle-calls/methodology/.
   4. Set status to OPEN, WIN, WIN BY KO, WIN BY DECISION, LOSS,
      LOSS BY KO, LOSS BY DECISION, UNDER REVIEW, or EXPIRED.
      WIN is an exact touch of the target. WIN BY KO is a penny past it.
      LOSS is an exact touch of THE MARKET's level. LOSS BY KO is a penny past that.
   5. Reload /battle-calls/. The renderer in fight-card.js draws the card.

   progress.target is the call's number, not the KO. The renderer works in
   cents. A touch of the target is a WIN. Caller's KO is one penny past
   that number, in the caller's direction, and that is a WIN BY KO.
   THE MARKET's level is the exact cent distance the other way from entry.
   A touch there is a LOSS. THE MARKET's KO is one penny past that level,
   and that is a LOSS BY KO. A distance over 50% of entry is capped first,
   then the extra penny is applied. The shown percent is the exact move to
   one decimal. It is not used to price the KO. The bar runs from THE MARKET's KO
   on the left to Caller's KO on the right, each half scaled to its own distance so the entry stays
   centered. entryLabel and markLabel are the words readers see.
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
      winRule: "A touch at $166.00 or higher wins; $166.01 or higher is a win by KO, before the Dec 31, 2026 close"
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
