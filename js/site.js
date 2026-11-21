(function () {
  var root = document.documentElement;
  var toggle = document.querySelector(".theme-toggle");

  function current() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    if (!toggle) return;
    var light = theme === "light";
    toggle.setAttribute("aria-pressed", light ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      light ? "Switch to dark theme" : "Switch to light theme"
    );
  }

  apply(current());

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = current() === "light" ? "dark" : "light";
      apply(next);
      try {
        localStorage.setItem("theme", next);
      } catch (err) {
        /* Storage can be blocked. The choice still applies for this visit. */
      }
    });
  }

  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (navToggle && nav) {
    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      var label = navToggle.querySelector(".nav-toggle-label");
      if (label) label.textContent = open ? "Close" : "Menu";
    }

    navToggle.addEventListener("click", function () {
      setOpen(navToggle.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      var target = event.target;
      if (target.closest && (target.closest("#site-nav") || target.closest(".nav-toggle"))) return;
      setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        navToggle.focus();
      }
    });

    nav.addEventListener("click", function (event) {
      var target = event.target;
      if (target.closest && target.closest("a")) setOpen(false);
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 701px)").matches) setOpen(false);
    });
  }

  var photos = [];
  Array.prototype.forEach.call(document.querySelectorAll("article img[src]"), function (photo) {
    if (!photo.closest("a")) photos.push(photo);
  });
  var enlargeLinks = document.querySelectorAll('a[aria-label="Enlarge chart"]');

  if (photos.length || enlargeLinks.length) {
    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Enlarged photo");

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "lightbox-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "\u00d7";

    var picture = document.createElement("picture");
    var webpSource = document.createElement("source");
    webpSource.type = "image/webp";
    var enlarged = document.createElement("img");
    picture.appendChild(webpSource);
    picture.appendChild(enlarged);

    var caption = document.createElement("p");
    caption.className = "lightbox-caption";

    overlay.appendChild(closeBtn);
    overlay.appendChild(picture);
    overlay.appendChild(caption);
    document.body.appendChild(overlay);

    var lastFocus = null;

    function largestCandidate(srcset) {
      var best = "";
      var bestW = -1;
      String(srcset || "").split(",").forEach(function (part) {
        var bits = part.trim().split(/\s+/);
        if (!bits[0]) return;
        var width = bits[1] && /w$/.test(bits[1]) ? parseInt(bits[1], 10) : 0;
        if (width >= bestW) {
          bestW = width;
          best = bits[0];
        }
      });
      return best;
    }

    function showCaption(text) {
      caption.textContent = text || "";
      caption.hidden = !text;
    }

    function openLightbox() {
      overlay.classList.add("is-open");
      document.body.classList.add("lightbox-open");
      closeBtn.focus();
    }

    function openPhoto(source) {
      lastFocus = document.activeElement;
      overlay.setAttribute("aria-label", "Enlarged photo");
      webpSource.removeAttribute("srcset");
      enlarged.removeAttribute("width");
      enlarged.removeAttribute("height");
      enlarged.src = source.currentSrc || source.src;
      enlarged.alt = source.alt || "";
      showCaption(source.alt);
      openLightbox();
    }

    function openChart(link) {
      lastFocus = link;
      overlay.setAttribute("aria-label", "Enlarged chart");
      var inline = link.querySelector("img");
      var webp = link.querySelector('source[type="image/webp"]');
      var fullWebp = largestCandidate(webp ? webp.getAttribute("srcset") : "");
      if (fullWebp) webpSource.srcset = fullWebp;
      else webpSource.removeAttribute("srcset");
      enlarged.src = link.getAttribute("href");
      enlarged.alt = (inline && inline.alt) || "";
      enlarged.width = inline ? inline.width || 1600 : 1600;
      enlarged.height = inline ? inline.height || 900 : 900;
      showCaption(enlarged.alt);
      openLightbox();
    }

    function closePhoto() {
      if (!overlay.classList.contains("is-open")) return;
      overlay.classList.remove("is-open");
      webpSource.removeAttribute("srcset");
      enlarged.removeAttribute("src");
      enlarged.alt = "";
      document.body.classList.remove("lightbox-open");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function focusableInDialog() {
      return overlay.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])");
    }

    Array.prototype.forEach.call(photos, function (photo) {
      photo.setAttribute("tabindex", "0");
      photo.setAttribute("role", "button");
      photo.addEventListener("click", function () {
        openPhoto(photo);
      });
      photo.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPhoto(photo);
        }
      });
    });

    Array.prototype.forEach.call(enlargeLinks, function (link) {
      link.addEventListener("click", function (event) {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        openChart(link);
      });
      link.addEventListener("keydown", function (event) {
        if (event.key === " ") {
          event.preventDefault();
          openChart(link);
        }
      });
    });

    overlay.addEventListener("click", function (event) {
      if (picture.contains(event.target)) return;
      closePhoto();
    });

    closeBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      closePhoto();
    });

    overlay.addEventListener("keydown", function (event) {
      if (event.key !== "Tab") return;
      var nodes = focusableInDialog();
      if (!nodes.length) return;
      var first = nodes[0];
      var last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closePhoto();
    });
  }
})();
