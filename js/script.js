(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var ham = document.querySelector(".ham");
  var mobNav = document.getElementById("mobNav");
  var ctaClose = document.getElementById("pcCtaClose");
  var pcCta = document.getElementById("pcCtaCard");

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  function closeMobNav() {
    if (!ham || !mobNav) return;
    ham.classList.remove("is-active");
    mobNav.classList.remove("is-open");
    ham.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  function setReservationCardState() {
    if (!pcCta || pcCta.classList.contains("is-dismissed")) return;

    var isMobile = window.matchMedia("(max-width: 760px)").matches;
    if (!isMobile) {
      pcCta.classList.add("is-visible");
      return;
    }

    pcCta.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.65);
  }

  window.addEventListener("scroll", setHeaderState, { passive: true });
  window.addEventListener("scroll", setReservationCardState, { passive: true });
  window.addEventListener("resize", setReservationCardState);
  setHeaderState();
  setReservationCardState();

  if (ham && mobNav) {
    ham.addEventListener("click", function () {
      var open = !mobNav.classList.contains("is-open");
      ham.classList.toggle("is-active", open);
      mobNav.classList.toggle("is-open", open);
      ham.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    });

    mobNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobNav);
    });
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  if (ctaClose && pcCta) {
    ctaClose.addEventListener("click", function () {
      pcCta.classList.add("is-dismissed");
      pcCta.classList.add("is-hidden");
    });
  }

  var carousel = document.getElementById("voiceCarousel");
  if (!carousel) return;

  var items = Array.prototype.slice.call(carousel.querySelectorAll(".voice"));
  var dotsWrap = document.querySelector(".carousel-dots");
  var btnPrev = document.getElementById("voicePrev");
  var btnNext = document.getElementById("voiceNext");
  var dots = [];

  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    items.forEach(function (_, index) {
      var dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", (index + 1) + "件目");
      dot.addEventListener("click", function () {
        scrollToIndex(index);
      });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
  }

  function getActiveIndex() {
    var centerX = carousel.scrollLeft + carousel.clientWidth / 2;
    var bestIndex = 0;
    var bestDistance = Infinity;

    items.forEach(function (item, index) {
      var itemCenter = item.offsetLeft + item.offsetWidth / 2;
      var distance = Math.abs(itemCenter - centerX);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    return bestIndex;
  }

  function scrollToIndex(index) {
    var nextIndex = Math.max(0, Math.min(items.length - 1, index));
    var item = items[nextIndex];
    var left = item.offsetLeft - (carousel.clientWidth - item.offsetWidth) / 2;
    carousel.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }

  function updateDots() {
    var activeIndex = getActiveIndex();
    dots.forEach(function (dot, index) {
      dot.classList.toggle("active", index === activeIndex);
    });
  }

  carousel.addEventListener("scroll", updateDots, { passive: true });
  if (btnPrev) {
    btnPrev.addEventListener("click", function () {
      scrollToIndex(getActiveIndex() - 1);
    });
  }
  if (btnNext) {
    btnNext.addEventListener("click", function () {
      scrollToIndex(getActiveIndex() + 1);
    });
  }

  updateDots();
})();
