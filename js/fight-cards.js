/* Fight cards for /battle-calls/. Newest first.
   Each card is one public call versus the market. The right corner is always
   THE MARKET. Do not add a second person, an avatar URL, or a profile photo.

   Add a card:
   1. Copy the object below.
   2. Paste the copy above it, at the top of FIGHT_CARDS.
   3. Fill in the caller's own words and the tape. Leave stop as "no stop given"
      when they did not name one. Do not invent a stop or any other number.
   4. Set status to OPEN, WON, LOST, or EXPIRED.
   5. Reload /battle-calls/. The renderer in fight-card.js draws the card.

   progress is optional. Its numbers only place the bar. entryLabel, targetLabel,
   and markLabel are the words readers see, so those strings must match the call.
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
      target: "$166+",
      targetNote: "low end of his range, +32.2%",
      stop: "no stop given",
      deadline: "Dec 31, 2026 close",
      winRule: "Trades at or above $166 before the Dec 31, 2026 close (an intraday touch counts)"
    },
    status: "WON",
    result: {
      when: "Mon Nov 23, after one session",
      detail: "Regular-session high $171.50 at 10:25 AM ET, which also reached the top of his $166-172 range.",
      barLabel: "Nov 23",
      bar: { open: "167.04", high: "171.50", low: "156.93", close: "165.05" },
      scoredBy: "HLK IV Quant"
    },
    progress: {
      entry: 125.53,
      entryLabel: "Entry $125.53",
      target: 166,
      targetLabel: "Target $166+",
      mark: 171.5,
      markLabel: "High $171.50"
    }
  }
];
