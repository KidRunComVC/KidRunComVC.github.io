/* Renders FIGHT_CARDS into #fight-card-list. Cards are text, not HTML. */
(function () {
  var STATUSES = { OPEN: true, WON: true, LOST: true, EXPIRED: true };
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

  function knownStatus(status) {
    return STATUSES[status] ? status : "unknown";
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

  function tapeRow(dl, label, value, extra) {
    if (!value) return;
    dl.appendChild(text("dt", null, label));
    var dd = el("dd");
    appendValue(dd, value, extra);
    dl.appendChild(dd);
  }

  function renderTape(tape) {
    var data = tape || {};
    var dl = el("dl", "fight-tape");
    tapeRow(dl, "Asset", data.asset, "");
    tapeRow(dl, "Direction", data.direction, "");
    tapeRow(dl, "Entry", data.entry, note(data.entryNote));
    tapeRow(dl, "Target", data.target, note(data.targetNote));
    tapeRow(dl, "Stop", data.stop ? data.stop : "no stop given", "");
    tapeRow(dl, "Deadline", data.deadline, "");
    tapeRow(dl, "Win rule", data.winRule, "");
    return dl;
  }

  function meterLayout(progress) {
    var entry = progress.entry;
    var target = progress.target;
    if (!isNum(entry) || !isNum(target) || entry === target) return null;
    var hasMark = isNum(progress.mark);
    var lo = Math.min(entry, target);
    var hi = Math.max(entry, target);
    if (hasMark) {
      lo = Math.min(lo, progress.mark);
      hi = Math.max(hi, progress.mark);
    }
    var span = hi - lo;
    if (!(span > 0)) return null;

    function xOf(value) {
      return ((value - lo) / span) * 100;
    }

    var entryX = xOf(entry);
    var targetX = xOf(target);
    var markX = hasMark ? xOf(progress.mark) : null;
    var toward = hasMark ? (progress.mark - entry) / (target - entry) : 1;
    var fillEnd = targetX;
    var place = "none";
    if (hasMark) {
      if (toward <= 0) {
        fillEnd = entryX;
        place = "behind";
      } else if (toward < 1) {
        fillEnd = markX;
        place = "between";
      } else {
        fillEnd = targetX;
        place = "beyond";
      }
    }

    return {
      entryX: entryX,
      targetX: targetX,
      markX: markX,
      fillLeft: Math.min(entryX, fillEnd),
      fillWidth: Math.abs(fillEnd - entryX),
      place: place
    };
  }

  function pct(value) {
    return (Math.round(value * 1000) / 1000) + "%";
  }

  function place(node, x) {
    node.style.left = pct(x);
  }

  function meterText(progress, layout) {
    var sentence = "Progress from " + progress.entryLabel + " to " + progress.targetLabel + ".";
    if (progress.markLabel) sentence += " " + progress.markLabel + " is marked.";
    if (layout.place === "beyond") sentence += " The mark is at or beyond the target.";
    if (layout.place === "between") sentence += " The mark is between the entry and the target.";
    if (layout.place === "behind") sentence += " The mark has not moved toward the target.";
    return sentence;
  }

  function renderMeter(progress) {
    if (!progress || !progress.entryLabel || !progress.targetLabel) return null;
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

    var target = el("span", "fight-meter-target");
    place(target, layout.targetX);
    track.appendChild(target);

    if (layout.markX != null) {
      var mark = el("span", "fight-meter-mark");
      place(mark, layout.markX);
      track.appendChild(mark);
    }

    figure.appendChild(track);

    var caption = el("figcaption");
    var list = el("ul", "fight-legend");
    list.setAttribute("aria-hidden", "true");
    [
      ["entry", progress.entryLabel],
      ["target", progress.targetLabel],
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
    block.setAttribute("data-status", knownStatus(status).toLowerCase());
    var line = el("h4", "fight-result-line");
    line.appendChild(text("span", "fight-kicker", "Status"));
    var chip = el("span", "fight-status");
    var icon = el("span", "fight-status-icon fight-status-icon-" + knownStatus(status).toLowerCase());
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

    var versus = el("p", "fight-vs");
    versus.appendChild(text("span", "visually-hidden", "versus"));
    versus.appendChild(text("span", "fight-vs-mark", "vs"));
    versus.lastChild.setAttribute("aria-hidden", "true");
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

    article.appendChild(text("h4", "fight-kicker fight-tape-title", "Tale of the tape"));
    article.appendChild(renderTape(card.tape));
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
