/* Click events for the GoatCounter count script.
   One delegated listener, so new posts copied from the draft templates are covered.
   Names: "nav: /path", "out: host/path", "btn: label", or "mailto" / "tel".
   No cookies, no field values, no addresses. */
(function () {
  var MAX = 40;
  var queue = [];
  var watching = false;

  function clean(value) {
    return (value || "").replace(/\s+/g, " ").trim();
  }

  function clip(value) {
    if (value.length <= MAX) return value;
    return value.slice(0, MAX).trim();
  }

  function scheme(href) {
    var match = /^\s*([a-z][a-z0-9+.-]*):/i.exec(href || "");
    return match ? match[1].toLowerCase() : "";
  }

  function linkName(el) {
    var href = el.getAttribute("href");
    if (href == null || !clean(href)) return "";
    var kind = scheme(href);
    if (kind === "mailto") return "mailto";
    if (kind === "tel") return "tel";
    if (kind && kind !== "http" && kind !== "https") return "out: " + kind;

    var url;
    try {
      url = new URL(href, location.href);
    } catch (err) {
      return "";
    }
    if (url.protocol === "mailto:") return "mailto";
    if (url.protocol === "tel:") return "tel";
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "out: " + url.protocol.replace(":", "");
    }

    var path = url.pathname || "/";
    if (url.hostname === location.hostname) {
      if (url.hash && /^#[A-Za-z][\w:.-]*$/.test(url.hash)) path += url.hash;
      return "nav: " + path;
    }
    return "out: " + url.hostname + path;
  }

  function visibleText(el) {
    var style;
    try { style = window.getComputedStyle(el); } catch (err) { style = null; }
    if (style && (style.display === "none" || style.visibility === "hidden")) return "";
    var out = "";
    var child = el.firstChild;
    while (child) {
      if (child.nodeType === 3) out += child.nodeValue;
      else if (child.nodeType === 1) out += " " + visibleText(child);
      child = child.nextSibling;
    }
    return clean(out);
  }

  function buttonName(el) {
    if (el.hasAttribute("data-copy-target") || el.classList.contains("zec-copy")) {
      return "btn: copy zcash address";
    }
    var text = visibleText(el);
    if (!text || !/[a-z0-9]/i.test(text)) text = clean(el.getAttribute("aria-label"));
    if (!text) text = "button";
    return "btn: " + clip(text);
  }

  function eventName(el) {
    if (!el || el.disabled) return "";
    if (el.hasAttribute("data-goatcounter-click")) return "";
    if (el.tagName === "A") return linkName(el);
    if (el.tagName === "BUTTON") return buttonName(el);
    return "";
  }

  function deliver(path) {
    window.goatcounter.count({
      path: path,
      event: true
    });
  }

  function send(path) {
    if (!path || path.charAt(0) === "/") return;
    if (window.goatcounter && typeof window.goatcounter.count === "function") {
      deliver(path);
      return;
    }
    queue.push(path);
  }

  function flush() {
    if (!window.goatcounter || typeof window.goatcounter.count !== "function" || !queue.length) return;
    var pending = queue.slice();
    queue.length = 0;
    for (var i = 0; i < pending.length; i++) deliver(pending[i]);
  }

  function fromEvent(event) {
    var node = event.target;
    if (!node) return;
    if (node.nodeType !== 1) node = node.parentElement;
    if (!node || !node.closest) return;
    send(eventName(node.closest("a, button")));
  }

  document.addEventListener("click", function (event) {
    if (event.button !== 0) return;
    fromEvent(event);
  }, true);

  document.addEventListener("auxclick", function (event) {
    if (event.button !== 1) return;
    fromEvent(event);
  }, true);

  function arm() {
    flush();
    if (watching) return;
    var tag = document.querySelector("script[data-goatcounter]");
    if (!tag) return;
    watching = true;
    tag.addEventListener("load", flush);
  }

  arm();
  var tries = 0;
  var timer = setInterval(function () {
    tries += 1;
    arm();
    if ((window.goatcounter && window.goatcounter.count) || tries > 40) {
      clearInterval(timer);
      flush();
    }
  }, 250);
})();
