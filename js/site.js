(function () {
  var root = document.documentElement;
  var toggle = document.querySelector(".theme-toggle");
  var label = toggle ? toggle.querySelector(".theme-toggle-label") : null;

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
    if (label) label.textContent = light ? "Light" : "Dark";
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
})();
