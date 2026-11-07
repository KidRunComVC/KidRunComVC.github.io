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

  var photos = document.querySelectorAll("article img[src]");
  if (photos.length) {
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

    var enlarged = document.createElement("img");
    var caption = document.createElement("p");
    caption.className = "lightbox-caption";

    overlay.appendChild(closeBtn);
    overlay.appendChild(enlarged);
    overlay.appendChild(caption);
    document.body.appendChild(overlay);

    var lastFocus = null;

    function openPhoto(source) {
      lastFocus = document.activeElement;
      enlarged.src = source.currentSrc || source.src;
      enlarged.alt = source.alt || "";
      caption.textContent = source.alt || "";
      caption.hidden = !source.alt;
      overlay.classList.add("is-open");
      document.body.classList.add("lightbox-open");
      closeBtn.focus();
    }

    function closePhoto() {
      if (!overlay.classList.contains("is-open")) return;
      overlay.classList.remove("is-open");
      enlarged.removeAttribute("src");
      enlarged.alt = "";
      document.body.classList.remove("lightbox-open");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    Array.prototype.forEach.call(photos, function (photo) {
      photo.addEventListener("click", function () {
        openPhoto(photo);
      });
    });

    overlay.addEventListener("click", function (event) {
      if (event.target === enlarged) return;
      closePhoto();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closePhoto();
    });
  }
})();
