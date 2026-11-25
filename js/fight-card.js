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

  function asNumber(value) {
    if (isNum(value)) return value;
    if (value == null || value === "") return null;
    var parsed = Number(String(value).replace(/[$,]/g, ""));
    return isNum(parsed) ? parsed : null;
  }

  function tugCaption(card, levels) {
    var progress = card.progress || {};
    var bar = card.result && card.result.bar;
    var entry = progress.entry;
    var high = asNumber(progress.mark);
    if (high == null && bar) high = asNumber(bar.high);
    var low = bar ? asNumber(bar.low) : null;
    var close = bar ? asNumber(bar.close) : null;
    var status = statusOf(card.status);
    var start = money(entry);
    var caller = money(levels.callerPrice);
    var market = money(levels.marketPrice);

    if (status === "WIN BY KO" && high != null) {
      return "Price ran from " + start + " to " + money(high) + ", through the Caller's KO at " + caller + ".";
    }
    if (status === "LOSS BY KO") {
      var broke = low != null ? low : high;
      return "Price ran from " + start + " to " + money(broke) + ", through the Market's KO at " + market + ".";
    }
    if (status === "WIN BY DECISION" && close != null) {
      return "Price closed at " + money(close) + ", past the start at " + start + ", short of the Caller's KO at " + caller + ".";
    }
    if (status === "LOSS BY DECISION" && close != null) {
      return "Price closed at " + money(close) + ", on the market's side of the start at " + start + ".";
    }
    if (status === "UNDER REVIEW") {
      return "Price touched the Caller's KO at " + caller + " and the Market's KO at " + market + ".";
    }
    if (status === "OPEN" || status === "EXPIRED") {
      if (high != null && low != null) {
        return "Since the start at " + start + ", price has traded from " + money(low) + " to " + money(high) + ".";
      }
      if (high != null) return "Price has run from " + start + " to " + money(high) + ".";
      return "The bout is open from the start at " + start + ".";
    }
    if (high != null) return "Price ran from " + start + " to " + money(high) + ".";
    return "The bout starts at " + start + ".";
  }

  function reachOf(entry, boundary, price) {
    var span = Math.abs(boundary - entry);
    if (!(span > 0) || !isNum(price)) return 0;
    return Math.abs(price - entry) / span;
  }

  function renderMeter(card, levels) {
    var progress = card.progress || {};
    if (!levels || !isNum(progress.entry)) return null;
    var entry = progress.entry;
    var caller = levels.callerPrice;
    var market = levels.marketPrice;
    var bearish = /bear|short/i.test((card.tape && card.tape.direction) || "");
    var bar = card.result && card.result.bar;
    var high = asNumber(progress.mark);
    if (high == null && bar) high = asNumber(bar.high);
    var low = bar ? asNumber(bar.low) : null;

    function onCaller(price) {
      if (!isNum(price) || price === entry) return false;
      return bearish ? price < entry : price > entry;
    }

    var callerReach = 0;
    var marketReach = 0;
    [high, low].forEach(function (price) {
      if (!isNum(price)) return;
      if (onCaller(price)) callerReach = Math.max(callerReach, reachOf(entry, caller, price));
      else if (price !== entry) marketReach = Math.max(marketReach, reachOf(entry, market, price));
    });
    var callerBroke = callerReach >= 1;
    var marketBroke = marketReach >= 1;
    var callerFill = Math.max(0, Math.min(1, callerReach));
    var marketFill = Math.max(0, Math.min(1, marketReach));

    var figure = el("figure", "fight-tug");
    var visual = el("div", "fight-tug-visual");
    if (callerBroke) visual.classList.add("has-caller-over");
    if (marketBroke) visual.classList.add("has-market-over");
    visual.setAttribute("aria-hidden", "true");

    var top = el("div", "fight-tug-top");
    top.appendChild(text("span", "fight-tug-start", "START " + money(entry)));
    visual.appendChild(top);

    var row = el("div", "fight-tug-row");
    if (marketBroke) {
      var leftOver = el("div", "fight-tug-over");
      leftOver.appendChild(el("span", "fight-tug-pin fight-tug-pin-left"));
      row.appendChild(leftOver);
    }

    var marketHalf = el("div", "fight-tug-half fight-tug-market");
    var marketFillEl = el("span", "fight-tug-fill");
    marketFillEl.style.width = (Math.round(marketFill * 1000) / 10) + "%";
    marketHalf.appendChild(marketFillEl);
    if (marketBroke) marketHalf.appendChild(text("span", "fight-tug-burst", "KO"));
    row.appendChild(marketHalf);

    var callerHalf = el("div", "fight-tug-half fight-tug-caller");
    var callerFillEl = el("span", "fight-tug-fill");
    callerFillEl.style.width = (Math.round(callerFill * 1000) / 10) + "%";
    callerHalf.appendChild(callerFillEl);
    if (callerBroke) callerHalf.appendChild(text("span", "fight-tug-burst", "KO"));
    row.appendChild(callerHalf);

    if (callerBroke) {
      var over = el("div", "fight-tug-over");
      over.appendChild(el("span", "fight-tug-pin"));
      row.appendChild(over);
    }
    visual.appendChild(row);

    var caps = el("div", "fight-tug-caps");
    caps.appendChild(text("span", "fight-tug-cap-market", "MARKET KO " + money(market)));
    caps.appendChild(text("span", "fight-tug-cap-caller", "CALLER KO " + money(caller)));
    visual.appendChild(caps);

    if ((marketBroke && low != null && !onCaller(low)) || (callerBroke && high != null && onCaller(high))) {
      var extremes = el("div", "fight-tug-extremes");
      var lowLabel = el("span", "fight-tug-extreme");
      if (marketBroke && low != null && !onCaller(low)) lowLabel.textContent = "LOW " + money(low);
      extremes.appendChild(lowLabel);
      var highLabel = el("span", "fight-tug-extreme");
      if (callerBroke && high != null && onCaller(high)) highLabel.textContent = "HIGH " + money(high);
      extremes.appendChild(highLabel);
      visual.appendChild(extremes);
    }
    figure.appendChild(visual);
    figure.appendChild(text("figcaption", "fight-tug-caption", tugCaption(card, levels)));
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

    var meter = renderMeter(card, levels);
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
