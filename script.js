(function () {
  var STYLES = {
    rational: {
      name: "Rational",
      color: "var(--rational)",
      text: "You search thoroughly for alternatives and evaluate them logically before you decide (Scott & Bruce, 1995, p. 820)."
    },
    intuitive: {
      name: "Intuitive",
      color: "var(--intuitive)",
      text: "You rely on hunches and feelings when you decide (Scott & Bruce, 1995, p. 820)."
    },
    dependent: {
      name: "Dependent",
      color: "var(--dependent)",
      text: "You look for advice and direction from other people when you decide (Scott & Bruce, 1995, p. 820)."
    },
    avoidant: {
      name: "Avoidant",
      color: "var(--avoidant)",
      text: "You tend to try to avoid making decisions (Scott & Bruce, 1995, p. 820)."
    },
    spontaneous: {
      name: "Spontaneous",
      color: "var(--spontaneous)",
      text: "You feel a sense of immediacy and want to get through the decision as quickly as possible (Scott & Bruce, 1995, p. 823)."
    }
  };
  var ORDER = ["rational", "intuitive", "dependent", "avoidant", "spontaneous"];

  var ITEMS = [
    { s: "rational", t: "I double-check my information sources to be sure I have the right facts before making decisions." },
    { s: "rational", t: "I make decisions in a logical and systematic way." },
    { s: "rational", t: "My decision making requires careful thought." },
    { s: "rational", t: "When making a decision, I consider various options in terms of a specific goal." },
    { s: "rational", t: "I plan my important decisions carefully." },
    { s: "intuitive", t: "When making decisions, I rely upon my instincts." },
    { s: "intuitive", t: "When I make decisions, I tend to rely on my intuition." },
    { s: "intuitive", t: "I generally make decisions that feel right to me." },
    { s: "intuitive", t: "When I make a decision, it is more important for me to feel the decision is right than to have a rational reason for it." },
    { s: "intuitive", t: "When I make a decision, I trust my inner feelings and reactions." },
    { s: "dependent", t: "I often need the assistance of other people when making important decisions." },
    { s: "dependent", t: "I rarely make important decisions without consulting other people." },
    { s: "dependent", t: "If I have the support of others, it is easier for me to make important decisions." },
    { s: "dependent", t: "I use the advice of other people in making my important decisions." },
    { s: "dependent", t: "I like to have someone to steer me in the right direction when I am faced with important decisions." },
    { s: "avoidant", t: "I avoid making important decisions until the pressure is on." },
    { s: "avoidant", t: "I postpone decision making whenever possible." },
    { s: "avoidant", t: "I often procrastinate when it comes to making important decisions." },
    { s: "avoidant", t: "I generally make important decisions at the last minute." },
    { s: "avoidant", t: "I put off making many decisions because thinking about them makes me uneasy." },
    { s: "spontaneous", t: "I generally make snap decisions." },
    { s: "spontaneous", t: "I often make decisions on the spur of the moment." },
    { s: "spontaneous", t: "I make quick decisions." },
    { s: "spontaneous", t: "I often make impulsive decisions." },
    { s: "spontaneous", t: "When making decisions, I do what seems natural at the moment." }
  ];

  var LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

  var $ = function (id) { return document.getElementById(id); };
  var order = [];
  var answers = [];
  var index = 0;

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function show(id) {
    ["intro", "quiz", "results"].forEach(function (s) {
      $(s).classList.toggle("hidden", s !== id);
    });
    window.scrollTo(0, 0);
  }

  function buildOptions() {
    var box = $("options");
    box.innerHTML = "";
    for (var v = 1; v <= 5; v++) {
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.id = "opt" + v;
      input.value = v;
      input.addEventListener("change", onPick);
      var label = document.createElement("label");
      label.htmlFor = "opt" + v;
      label.innerHTML = "<strong>" + v + "</strong><span>" + LABELS[v - 1] + "</span>";
      box.appendChild(input);
      box.appendChild(label);
    }
  }

  function start() {
    order = shuffle(ITEMS);
    answers = new Array(order.length).fill(null);
    index = 0;
    show("quiz");
    render();
  }

  function render() {
    var item = order[index];
    $("statement").textContent = item.t;
    $("legend").textContent = "How much do you agree with: " + item.t;
    $("count").textContent = "Statement " + (index + 1) + " of " + order.length;
    $("progressBar").style.width = (index / order.length * 100) + "%";
    var current = answers[index];
    for (var v = 1; v <= 5; v++) {
      $("opt" + v).checked = current === v;
    }
    $("nextBtn").disabled = current === null;
    $("nextBtn").textContent = index === order.length - 1 ? "See my result" : "Next";
    $("backBtn").style.visibility = index === 0 ? "hidden" : "visible";
  }

  function onPick(e) {
    answers[index] = Number(e.target.value);
    $("nextBtn").disabled = false;
  }

  function next() {
    if (answers[index] === null) return;
    if (index < order.length - 1) {
      index++;
      render();
    } else {
      finish();
    }
  }

  function back() {
    if (index > 0) { index--; render(); }
  }

  function finish() {
    var sums = {}, counts = {};
    ORDER.forEach(function (k) { sums[k] = 0; counts[k] = 0; });
    order.forEach(function (item, i) {
      sums[item.s] += answers[i];
      counts[item.s] += 1;
    });
    var means = {};
    ORDER.forEach(function (k) { means[k] = sums[k] / counts[k]; });

    var max = Math.max.apply(null, ORDER.map(function (k) { return means[k]; }));
    var top = ORDER.filter(function (k) { return Math.abs(means[k] - max) < 1e-9; });
    var names = top.map(function (k) { return STYLES[k].name; });

    if (top.length === 1) {
      $("verdictLead").textContent = "Your strongest style is";
      $("verdict").textContent = names[0];
      $("verdictText").textContent = STYLES[top[0]].text;
    } else {
      $("verdictLead").textContent = "You score equally high on";
      $("verdict").textContent = names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
      $("verdictText").textContent = "You regularly use more than one decision-making style.";
    }

    var profile = $("profile");
    profile.innerHTML = "";
    var sorted = ORDER.slice().sort(function (a, b) { return means[b] - means[a]; });
    sorted.forEach(function (k) {
      var row = document.createElement("div");
      row.className = "row" + (top.indexOf(k) > -1 ? " top" : "");
      var pct = (means[k] - 1) / 4 * 100;
      row.innerHTML =
        '<span class="name">' + STYLES[k].name + '</span>' +
        '<div class="track"><div class="fill" style="background:' + STYLES[k].color + '"></div></div>' +
        '<span class="score">' + means[k].toFixed(1) + '</span>';
      row.setAttribute("aria-label", STYLES[k].name + ": " + means[k].toFixed(1) + " out of 5");
      profile.appendChild(row);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          row.querySelector(".fill").style.width = Math.max(pct, 2) + "%";
        });
      });
    });

    var desc = $("descriptions");
    desc.innerHTML = "<h2>The five styles</h2>";
    ORDER.forEach(function (k) {
      var d = document.createElement("div");
      d.className = "desc";
      d.style.borderLeftColor = STYLES[k].color;
      d.innerHTML = "<h3>" + STYLES[k].name + "</h3><p>" + STYLES[k].text + "</p>";
      desc.appendChild(d);
    });

    $("progressBar").style.width = "100%";
    show("results");
  }

  document.addEventListener("keydown", function (e) {
    if ($("quiz").classList.contains("hidden")) return;
    if (e.key >= "1" && e.key <= "5") {
      var el = $("opt" + e.key);
      el.checked = true;
      answers[index] = Number(e.key);
      $("nextBtn").disabled = false;
    } else if (e.key === "Enter" && answers[index] !== null && e.target.tagName !== "BUTTON") {
      next();
    } else if (e.key === "Backspace" || e.key === "ArrowLeft") {
      back();
    }
  });

  buildOptions();
  $("startBtn").addEventListener("click", start);
  $("nextBtn").addEventListener("click", next);
  $("backBtn").addEventListener("click", back);
  $("restartBtn").addEventListener("click", start);
})();
