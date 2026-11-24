(function () {
  var reduce = false;
  try {
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (err) {
    reduce = false;
  }

  try {
    document.documentElement.classList.add("js");

    var nodes = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && nodes.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      nodes.forEach(function (node, index) {
        if (!reduce) node.style.transitionDelay = (index % 5) * 70 + "ms";
        observer.observe(node);
      });
    } else {
      nodes.forEach(function (node) { node.classList.add("is-in"); });
    }

    var slides = document.querySelectorAll(".hero-slide");
    if (!reduce && slides.length > 1) {
      var current = 0;
      window.setInterval(function () {
        slides[current].classList.remove("is-on");
        current = (current + 1) % slides.length;
        slides[current].classList.add("is-on");
      }, 7000);
    }

    var form = document.querySelector(".demo-form");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var note = form.querySelector(".form-result");
        if (note) {
          note.hidden = false;
          note.textContent = "This is a demo. Your message was not sent.";
        }
      });
    }

    setupLightbox();
  } catch (err) {
    document.documentElement.classList.remove("js");
  }

  function setupLightbox() {
    var buttons = document.querySelectorAll("[data-full]");
    var lb = document.querySelector(".lb");
    if (!buttons.length || !lb) return;
    var imgs = lb.querySelectorAll(".lb-img");
    var active = 0;
    var list = [];
    var index = 0;

    buttons.forEach(function (button) {
      list.push({
        src: button.getAttribute("data-full"),
        alt: button.getAttribute("data-alt") || ""
      });
      button.addEventListener("click", function () {
        index = list.findIndex(function (item) { return item.src === button.getAttribute("data-full"); });
        if (index < 0) index = 0;
        openAt(index, false);
      });
    });

    function show(src, alt) {
      var incoming = imgs[active ^ 1];
      var outgoing = imgs[active];
      incoming.alt = alt;
      incoming.src = src;
      incoming.classList.add("is-on");
      outgoing.classList.remove("is-on");
      active = active ^ 1;
    }

    function openAt(i, fade) {
      index = (i + list.length) % list.length;
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      if (!fade) {
        imgs.forEach(function (img) { img.classList.remove("is-on"); });
        active = 0;
        imgs[0].src = list[index].src;
        imgs[0].alt = list[index].alt;
        imgs[0].classList.add("is-on");
        return;
      }
      show(list[index].src, list[index].alt);
    }

    lb.querySelector(".lb-next").addEventListener("click", function () { openAt(index + 1, true); });
    lb.querySelector(".lb-prev").addEventListener("click", function () { openAt(index - 1, true); });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.addEventListener("click", function (event) {
      if (event.target === lb) close();
    });
    document.addEventListener("keydown", function (event) {
      if (lb.hidden) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") openAt(index + 1, true);
      if (event.key === "ArrowLeft") openAt(index - 1, true);
    });

    function close() {
      lb.hidden = true;
      document.body.style.overflow = "";
    }
  }
})();
