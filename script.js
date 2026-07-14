"use strict";

const startScreen = document.getElementById("pantallaInicio");
const story = document.getElementById("historia");
const enterButton = document.getElementById("entrar");
const progressBar = document.getElementById("progressBar");
const finalEnvelope = document.getElementById("finalEnvelope");
const photoReveal = document.getElementById("photoReveal");
const letter = document.getElementById("letter");
const finalMessage = document.getElementById("finalMessage");
const music = document.getElementById("musica");
const musicToggle = document.getElementById("musicToggle");
const backToTop = document.getElementById("volverInicio");
const petalContainer = document.getElementById("petalContainer");

let finalOpened = false;
let petalsTimer = null;

enterButton.addEventListener("click", () => {
  startScreen.style.transition = "opacity .7s ease, transform .7s ease";
  startScreen.style.opacity = "0";
  startScreen.style.transform = "scale(1.02)";

  window.setTimeout(() => {
    startScreen.remove();
    story.hidden = false;
    document.body.style.overflow = "auto";
    observeReveals();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, 650);
});

function observeReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, { threshold: 0.22 });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

window.addEventListener("scroll", () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${percentage}%`;
});

function openFinalEnvelope() {
  if (finalOpened) return;
  finalOpened = true;
  finalEnvelope.classList.add("opened");
  musicToggle.classList.add("visible");
  startMusicWithFade();

  window.setTimeout(() => {
    photoReveal.classList.add("visible");
    photoReveal.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 1500);

  window.setTimeout(() => {
    letter.classList.add("visible");
  }, 2600);

  window.setTimeout(() => {
    finalMessage.classList.add("visible");
    startPetals();
  }, 3500);
}

finalEnvelope.addEventListener("click", openFinalEnvelope);
finalEnvelope.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openFinalEnvelope();
  }
});

async function startMusicWithFade() {
  try {
    music.volume = 0;
    await music.play();
    musicToggle.classList.add("playing");

    const fade = window.setInterval(() => {
      if (music.volume < 0.72) {
        music.volume = Math.min(0.72, music.volume + 0.04);
      } else {
        window.clearInterval(fade);
      }
    }, 160);
  } catch (error) {
    console.info("La música no pudo comenzar automáticamente. Usa el botón Música.", error);
  }
}

musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicToggle.classList.add("playing");
    } catch (error) {
      console.info("No se pudo reproducir el audio.", error);
    }
  } else {
    music.pause();
    musicToggle.classList.remove("playing");
  }
});

function createPetal() {
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.setProperty("--size", `${12 + Math.random() * 22}px`);
  petal.style.setProperty("--duration", `${7 + Math.random() * 7}s`);
  petal.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
  petal.style.setProperty("--opacity", `${0.45 + Math.random() * 0.5}`);

  const image = document.createElement("img");
  image.src = "assets/petalo.png";
  image.alt = "";
  image.addEventListener("error", () => {
    image.remove();
    petal.classList.add("petal-fallback");
    petal.textContent = Math.random() > .5 ? "❤" : "❀";
  }, { once: true });

  petal.appendChild(image);
  petalContainer.appendChild(petal);
  window.setTimeout(() => petal.remove(), 15000);
}

function startPetals() {
  if (petalsTimer) return;
  for (let index = 0; index < 20; index += 1) {
    window.setTimeout(createPetal, index * 100);
  }
  petalsTimer = window.setInterval(createPetal, 430);
}

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
