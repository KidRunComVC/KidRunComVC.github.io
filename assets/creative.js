(function () {
  var root = document.documentElement;

  var marks = {
    "Home": "0.0",
    "About": "4.4",
    "Road Log": "13.1",
    "Runner's Kitchen": "16.2",
    "TARA Blog": "20.0",
    "SpaceXSI": "23.1",
    "Market History": "26.2"
  };

  function mile(name) {
    return "MI " + marks[name] + " " + name;
  }

  if (root.classList.contains("fx-milemarkers")) {
    document.querySelectorAll(".home-sections .section-block > .section-copy > .kicker").forEach(function (kicker) {
      var heading = kicker.parentElement.querySelector("h2");
      var name = heading ? heading.textContent.trim() : "";
      if (!marks[name] || kicker.querySelector("a")) return;
      kicker.textContent = mile(name);
    });

    var pageKicker = document.querySelector(".page-head > .kicker");
    if (pageKicker && pageKicker.textContent.trim() === "Section") {
      var pageTitle = document.querySelector(".page-head h1");
      var pageName = pageTitle ? pageTitle.textContent.trim() : "";
      if (marks[pageName]) pageKicker.textContent = mile(pageName);
    }

    var articleKicker = document.querySelector(".article-head > .kicker");
    if (articleKicker && !articleKicker.querySelector(".mile")) {
      var sectionLink = articleKicker.querySelector("a");
      var sectionName = sectionLink ? sectionLink.textContent.trim() : "";
      if (marks[sectionName]) {
        var badge = document.createElement("span");
        badge.className = "mile";
        badge.textContent = "MI " + marks[sectionName];
        articleKicker.insertBefore(badge, sectionLink);
        articleKicker.insertBefore(document.createTextNode(" "), sectionLink);
      }
    }

    var path = location.pathname;
    var heroName = "";
    if (path === "/" || path === "/index.html") heroName = "Home";
    else if (path === "/about/" || path === "/about/index.html") heroName = "About";
    if (heroName) {
      var hero = document.querySelector(".hero .hero-copy");
      if (hero && !hero.querySelector(".kicker")) {
        var line = document.createElement("p");
        line.className = "kicker";
        line.textContent = mile(heroName);
        hero.insertBefore(line, hero.firstChild);
      }
    }
  }

  if (root.classList.contains("fx-progress")) {
    var article = document.querySelector("main article.article");
    var mast = document.querySelector(".mast");
    if (article && mast && !mast.querySelector(".read-progress")) {
      var bar = document.createElement("div");
      bar.className = "read-progress";
      bar.setAttribute("aria-hidden", "true");
      var line = document.createElement("span");
      line.className = "read-progress-line";
      bar.appendChild(line);
      mast.appendChild(bar);

      function update() {
        var header = mast.offsetHeight;
        var top = article.getBoundingClientRect().top + window.scrollY;
        var from = top - header;
        var to = top + article.offsetHeight - window.innerHeight;
        var span = Math.max(to - from, 1);
        var progress = (window.scrollY - from) / span;
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;
        line.style.width = (progress * 100) + "%";
      }

      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
    }
  }
})();
