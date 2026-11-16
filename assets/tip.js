(function () {
  var btn = document.querySelector("[data-copy-target]");
  if (!btn || !navigator.clipboard) return;
  btn.hidden = false;
  btn.addEventListener("click", function () {
    var el = document.getElementById(btn.getAttribute("data-copy-target"));
    navigator.clipboard.writeText(el.textContent.trim()).then(function () {
      btn.textContent = "Copied";
      setTimeout(function () { btn.textContent = "Copy address"; }, 2000);
    });
  });
})();
