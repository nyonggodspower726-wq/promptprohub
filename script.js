// ================================
// PromptPro Hub Premium Script v2.0
// ================================

// Reveal Animation

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.15
});

document.querySelectorAll(".card, .hero-text, .hero-image, section").forEach((el) => {
  observer.observe(el);
});

// Smooth Navigation

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener("click", function (e) {

    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));

    if (target) {

      target.scrollIntoView({

        behavior: "smooth"

      });

    }

  });

});

// Floating Book Effect

const mockup = document.querySelector(".mockup");

if (mockup) {

  let up = true;

  setInterval(() => {

    mockup.style.transition = "transform .8s ease";

    mockup.style.transform = up
      ? "translateY(-12px)"
      : "translateY(0px)";

    up = !up;

  }, 1800);

}

// Cookie Banner Memory

const cookieBanner = document.getElementById("cookie-banner");

if (cookieBanner) {

  if (localStorage.getItem("cookieAccepted")) {

    cookieBanner.style.display = "none";

  }

  const btn = cookieBanner.querySelector("button");

  if (btn) {

    btn.addEventListener("click", () => {

      localStorage.setItem("cookieAccepted", "true");

      cookieBanner.style.display = "none";

    });

  }

}

// Back To Top Button

const backToTop = document.querySelector("button[onclick*='scrollTo']");

window.addEventListener("scroll", () => {

  if (!backToTop) return;

  if (window.scrollY > 500) {

    backToTop.style.opacity = "1";

    backToTop.style.visibility = "visible";

  } else {

    backToTop.style.opacity = "0";

    backToTop.style.visibility = "hidden";

  }

});

// Active Navigation Link

const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {

  let current = "";

  sections.forEach(section => {

    const sectionTop = section.offsetTop - 120;

    if (pageYOffset >= sectionTop) {

      current = section.getAttribute("id");

    }

  });

  navLinks.forEach(link => {

    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + current) {

      link.classList.add("active");

    }

  });

});

// Welcome Message

window.addEventListener("load", () => {

  console.log("🚀 PromptPro Hub Premium Loaded Successfully");

});
