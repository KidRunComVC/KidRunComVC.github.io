/* Renders FIGHT_CARDS into #fight-card-list. Cards are text, not HTML. */
(function () {
  var STATUSES = {
    OPEN: "open",
    EXPIRED: "expired",
    "WIN BY KO": "win-by-ko",
    "WIN BY DECISION": "win-by-decision",
    "LOSS BY KO": "loss-by-ko",
    "LOSS BY DECISION": "loss-by-decision",
    "UNDER REVIEW": "under-review",
    WON: "won",
    LOST: "lost"
  };
  var PRINTS = [
    ["open", "Open", "O"],
    ["high", "High", "H"],
    ["low", "Low", "L"],
    ["close", "Close", "C"]
  ];

  function isNum(value) {
    return typeof value === "number" && isFinite(value);
  }

  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function text(tag, className, value) {
    var node = el(tag, className);
    node.textContent = value == null ? "" : String(value);
    return node;
  }

  function initialOf(handle) {
    var name = String(handle || "").replace(/^@+/, "").trim();
    var ch = name.charAt(0);
    return ch ? ch.toUpperCase() : "?";
  }

  function statusOf(value) {
    var raw = String(value || "OPEN").trim();
    var key = raw.toUpperCase();
    if (STATUSES[key]) return key;
    return raw || "OPEN";
  }

  function statusSlug(status) {
    return STATUSES[status] || "unknown";
  }

  function money(amount) {
    return "$" + amount.toFixed(2);
  }

  function toCents(amount) {
    return Math.round(amount * 100);
  }

  function percentText(ratio) {
    var pct = Math.round(Math.abs(ratio) * 1000) / 10;
    var body = pct % 1 === 0 ? String(pct) : pct.toFixed(1);
    return body + "%";
  }

  function levelsFor(card) {
    var progress = card.progress || {};
    var direction = (card.tape && card.tape.direction) || "";
    if (!isNum(progress.entry) || !isNum(progress.target) || progress.entry === 0) return null;
    var bearish = /bear|short/i.test(direction);
    var entryCents = toCents(progress.entry);
    var targetCents = toCents(progress.target);
    var distance = Math.abs(targetCents - entryCents);
    var cap = Math.round(entryCents / 2);
    if (distance > cap) distance = cap;
    var callerCents = bearish ? targetCents - 1 : targetCents + 1;
    var marketCents = bearish ? entryCents + distance + 1 : entryCents - distance - 1;
    var caller = callerCents / 100;
    var market = marketCents / 100;
    var callPct = percentText(Math.abs(targetCents - entryCents) / entryCents);
    var usedPct = percentText(distance / entryCents);
    return {
      callerPrice: caller,
      marketPrice: market,
      callerText: money(caller) + " (" + (bearish ? "-" : "+") + callPct + ")",
      marketText: money(market) + " (" + (bearish ? "+" : "-") + usedPct + ")",
      callerEnd: "Caller's KO " + money(caller),
      marketEnd: "Market's KO " + money(market)
    };
  }

  function note(value) {
    var clean = String(value || "").trim();
    if (!clean) return "";
    if (clean.charAt(0) === "(") return clean;
    return "(" + clean + ")";
  }

  function appendValue(dd, value, extra) {
    dd.appendChild(document.createTextNode(value));
    if (extra) dd.appendChild(text("span", "fight-note", " " + extra));
  }

  function tapeRow(dl, label, value, extra, extraNode) {
    if (!value && !extraNode) return;
    dl.appendChild(text("dt", null, label));
    var dd = el("dd");
    if (value) appendValue(dd, value, extra);
    if (extraNode) dd.appendChild(extraNode);
    dl.appendChild(dd);
  }

  function methodLink() {
    var wrap = el("p", "fight-rule-link");
    var link = text("a", null, "How bouts are scored");
    link.href = "/battle-calls/methodology/";
    wrap.appendChild(link);
    return wrap;
  }

  function renderTape(tape, levels) {
    var data = tape || {};
    var dl = el("dl", "fight-tape");
    tapeRow(dl, "Asset", data.asset, "");
    tapeRow(dl, "Direction", data.direction, "");
    tapeRow(dl, "Entry", data.entry, note(data.entryNote));
    if (levels) {
      tapeRow(dl, "Caller's KO", levels.callerText, "");
      tapeRow(dl, "Market's KO", levels.marketText, "");
    }
    tapeRow(dl, "Deadline", data.deadline, "");
    tapeRow(dl, "Win rule", data.winRule, "", methodLink());
    return dl;
  }

  function meterLayout(progress) {
    var entry = progress.entry;
    var caller = isNum(progress.callerKo) ? progress.callerKo : progress.target;
    var market = progress.ko;
    if (!isNum(entry) || !isNum(caller) || !isNum(market) || caller === market) return null;

    function xOf(value) {
      return ((value - market) / (caller - market)) * 100;
    }

    function clamp(value) {
      return Math.max(0, Math.min(100, value));
    }

    var entryX = clamp(xOf(entry));
    var hasMark = isNum(progress.mark);
    var rawMark = hasMark ? xOf(progress.mark) : null;
    var beyond = rawMark != null && rawMark >= 100;
    var behind = rawMark != null && rawMark <= 0 && xOf(entry) !== 0;
    var markX = rawMark == null ? null : clamp(rawMark);
    var fillEnd = 100;
    var place = "none";
    if (hasMark) {
      var toward = (progress.mark - entry) / (caller - entry);
      if (toward <= 0) {
        fillEnd = entryX;
        place = "behind";
      } else if (toward < 1) {
        fillEnd = markX;
        place = "between";
      } else {
        fillEnd = 100;
        place = "beyond";
      }
    }

    return {
      entryX: entryX,
      markX: markX,
      fillLeft: Math.min(entryX, fillEnd),
      fillWidth: Math.abs(fillEnd - entryX),
      place: place,
      beyond: beyond,
      behind: behind
    };
  }

  function pct(value) {
    return (Math.round(value * 1000) / 1000) + "%";
  }

  function place(node, x) {
    node.style.left = pct(x);
  }

  function meterText(progress, layout) {
    var sentence = progress.marketEnd + " on the left. " + progress.callerEnd + " on the right.";
    if (progress.entryLabel) sentence += " " + progress.entryLabel + " is marked.";
    if (progress.markLabel) sentence += " " + progress.markLabel + " is marked.";
    if (layout.place === "beyond") sentence += " The high is at or beyond Caller's KO.";
    if (layout.place === "between") sentence += " The mark is between the entry and Caller's KO.";
    if (layout.place === "behind") sentence += " The mark is on the Market's KO side of the entry.";
    return sentence;
  }

  function renderMeter(progress) {
    if (!progress || !progress.callerEnd || !progress.marketEnd) return null;
    var layout = meterLayout(progress);
    if (!layout) return null;

    var figure = el("figure", "fight-meter");
    var track = el("div", "fight-meter-track");
    track.setAttribute("role", "img");
    track.setAttribute("aria-label", meterText(progress, layout));

    var fill = el("span", "fight-meter-fill");
    fill.style.left = pct(layout.fillLeft);
    fill.style.width = pct(layout.fillWidth);
    track.appendChild(fill);

    var entry = el("span", "fight-meter-entry");
    place(entry, layout.entryX);
    track.appendChild(entry);

    if (layout.markX != null) {
      var mark = el("span", "fight-meter-mark");
      place(mark, layout.markX);
      track.appendChild(mark);
    }

    figure.appendChild(track);

    var ends = el("div", "fight-meter-ends");
    ends.setAttribute("aria-hidden", "true");
    ends.appendChild(text("span", null, progress.marketEnd));
    ends.appendChild(text("span", null, progress.callerEnd));
    figure.appendChild(ends);

    var caption = el("figcaption");
    var list = el("ul", "fight-legend");
    list.setAttribute("aria-hidden", "true");
    [
      ["entry", progress.entryLabel],
      ["mark", progress.markLabel]
    ].forEach(function (item) {
      if (!item[1]) return;
      var li = el("li");
      li.appendChild(el("span", "fight-swatch fight-swatch-" + item[0]));
      li.appendChild(document.createTextNode(item[1]));
      list.appendChild(li);
    });
    caption.appendChild(list);
    figure.appendChild(caption);
    return figure;
  }

  function renderPrint(result) {
    var bar = result.bar;
    if (!bar) return null;
    var wrap = el("div", "fight-print");
    if (result.barLabel) wrap.appendChild(text("p", "fight-print-date", result.barLabel));
    var dl = el("dl", "fight-ohlc");
    PRINTS.forEach(function (item) {
      if (bar[item[0]] == null || bar[item[0]] === "") return;
      var pair = el("div");
      pair.appendChild(text("dt", "visually-hidden", item[1]));
      var dd = el("dd");
      var glyph = el("span");
      glyph.setAttribute("aria-hidden", "true");
      glyph.textContent = item[2] + " ";
      dd.appendChild(glyph);
      dd.appendChild(document.createTextNode(String(bar[item[0]])));
      pair.appendChild(dd);
      dl.appendChild(pair);
    });
    wrap.appendChild(dl);
    return wrap;
  }

  function renderResult(card) {
    var status = statusOf(card.status);
    var result = card.result || {};
    var block = el("div", "fight-result");
    block.setAttribute("data-status", statusSlug(status));
    var line = el("h4", "fight-result-line");
    line.appendChild(text("span", "fight-kicker", "Status"));
    var chip = el("span", "fight-status");
    var icon = el("span", "fight-status-icon fight-status-icon-" + statusSlug(status));
    icon.setAttribute("aria-hidden", "true");
    chip.appendChild(icon);
    chip.appendChild(document.createTextNode(status));
    line.appendChild(chip);
    block.appendChild(line);
    if (result.when) block.appendChild(text("p", "fight-result-when", result.when));
    if (result.detail) block.appendChild(text("p", "fight-result-detail", result.detail));
    var print = renderPrint(result);
    if (print) block.appendChild(print);
    if (result.scoredBy) block.appendChild(text("p", "fight-scored", "Scored by " + result.scoredBy));
    return block;
  }

  function renderCard(card) {
    var handle = String(card.handle || "").trim();
    var article = el("article", "fight-card");
    article.setAttribute("aria-label", (handle || "Caller") + " versus the market");

    var header = el("header", "fight-corners");
    var caller = el("div", "fight-side fight-side-caller");
    var badge = text("span", "fight-badge", initialOf(handle));
    badge.setAttribute("aria-hidden", "true");
    caller.appendChild(badge);
    var id = el("div", "fight-id");
    id.appendChild(text("h3", "fight-handle", handle));
    if (card.followers) id.appendChild(text("p", "fight-followers", card.followers));
    caller.appendChild(id);
    header.appendChild(caller);

    var versus = el("div", "fight-vs");
    var logo = el("img", "fight-vs-logo");
    logo.src = "/assets/img/battle-calls/bc-vs-logo-512.webp";
    logo.srcset = "/assets/img/battle-calls/bc-vs-logo-256.webp 256w, /assets/img/battle-calls/bc-vs-logo-512.webp 512w";
    logo.sizes = "(min-width: 640px) 140px, 96px";
    logo.width = 512;
    logo.height = 512;
    logo.alt = "Battle Calls logo: crossed BC boxing gloves with VS";
    logo.decoding = "async";
    versus.appendChild(logo);
    header.appendChild(versus);

    var market = el("div", "fight-side fight-side-market");
    market.appendChild(text("p", "fight-market-name", "THE MARKET"));
    var mark = el("span", "fight-market-mark");
    mark.setAttribute("aria-hidden", "true");
    market.appendChild(mark);
    header.appendChild(market);
    article.appendChild(header);
    article.appendChild(text("h4", "visually-hidden", "The call"));

    var quote = el("blockquote", "fight-quote");
    if (card.sourceUrl) quote.setAttribute("cite", card.sourceUrl);
    quote.appendChild(text("p", null, card.quote || ""));
    article.appendChild(quote);

    if (card.date) {
      var dated = el("p", "fight-date");
      var time = text("time", null, card.date);
      if (card.dateTime) time.setAttribute("datetime", card.dateTime);
      dated.appendChild(time);
      article.appendChild(dated);
    }

    if (card.sourceUrl) {
      var source = el("p", "fight-source");
      var link = text("a", null, "View the original post");
      link.href = card.sourceUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      var hint = text("span", "visually-hidden", " (opens in a new tab)");
      link.appendChild(hint);
      source.appendChild(link);
      article.appendChild(source);
    }

    var levels = levelsFor(card);
    if (levels && card.progress) {
      card.progress.ko = levels.marketPrice;
      card.progress.callerKo = levels.callerPrice;
      card.progress.callerEnd = levels.callerEnd;
      card.progress.marketEnd = levels.marketEnd;
    }
    article.appendChild(text("h4", "fight-kicker fight-tape-title", "Tale of the tape"));
    article.appendChild(renderTape(card.tape, levels));
    article.appendChild(renderResult(card));

    var meter = renderMeter(card.progress);
    if (meter) article.appendChild(meter);

    article.appendChild(text(
      "p",
      "fight-disclaimer",
      "Entertainment and commentary only, not financial advice, not affiliated with anyone featured."
    ));
    return article;
  }

  function boot() {
    var mount = document.getElementById("fight-card-list");
    if (!mount || !Array.isArray(window.FIGHT_CARDS)) return;
    while (mount.firstChild) mount.removeChild(mount.firstChild);
    window.FIGHT_CARDS.forEach(function (card) {
      if (!card || typeof card !== "object") return;
      mount.appendChild(renderCard(card));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
