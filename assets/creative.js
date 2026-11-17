(function () {
  var root = document.documentElement;

  var marks = {
    "Home": "0.0",
    "About": "4.4",
    "Road Log": "13.1",
    "Runner's Log": "16.2",
    "Family": "18.0",
    "TARA Blog": "20.0",
    "Battle Calls": "22.0",
    "SpaceXSI": "23.1",
    "Market History": "26.2"
  };

  function makeMileSign(number) {
    var sign = document.createElement("span");
    sign.className = "mile-sign";
    sign.setAttribute("aria-label", "Mile " + number);
    var word = document.createElement("span");
    word.className = "mile-sign-label";
    word.setAttribute("aria-hidden", "true");
    word.textContent = "MILE";
    var num = document.createElement("span");
    num.className = "mile-sign-value";
    num.setAttribute("aria-hidden", "true");
    num.textContent = number;
    sign.appendChild(word);
    sign.appendChild(num);
    return sign;
  }

  function fillNamedKicker(kicker, name) {
    var number = marks[name];
    if (!number || !kicker) return false;
    kicker.textContent = "";
    kicker.classList.add("has-mile-sign");
    kicker.appendChild(makeMileSign(number));
    var label = document.createElement("span");
    label.className = "kicker-name";
    label.textContent = name;
    kicker.appendChild(label);
    return true;
  }

  if (root.classList.contains("fx-milemarkers")) {
    document.querySelectorAll(".home-sections .section-block > .section-copy > .kicker").forEach(function (kicker) {
      var heading = kicker.parentElement.querySelector("h2");
      var name = heading ? heading.textContent.trim() : "";
      if (!marks[name] || kicker.querySelector("a") || kicker.querySelector(".mile-sign")) return;
      fillNamedKicker(kicker, name);
    });

    var pageKicker = document.querySelector(".page-head > .kicker");
    if (pageKicker && !pageKicker.querySelector(".mile-sign") && pageKicker.textContent.trim() === "Section") {
      var pageTitle = document.querySelector(".page-head h1");
      var pageName = pageTitle ? pageTitle.textContent.trim() : "";
      fillNamedKicker(pageKicker, pageName);
    }

    var articleKicker = document.querySelector(".article-head > .kicker");
    if (articleKicker && !articleKicker.querySelector(".mile-sign")) {
      var sectionLink = articleKicker.querySelector("a");
      var sectionName = sectionLink ? sectionLink.textContent.trim() : "";
      if (marks[sectionName]) {
        articleKicker.classList.add("has-mile-sign");
        articleKicker.insertBefore(makeMileSign(marks[sectionName]), sectionLink);
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
        hero.insertBefore(line, hero.firstChild);
        fillNamedKicker(line, heroName);
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
