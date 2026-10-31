(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const entryScreen = $("entryScreen");
  const site = $("site");
  const modal = $("modal");
  const modalTitle = $("modalTitle");
  const modalEyebrow = $("modalEyebrow");
  const modalBody = $("modalBody");
  const archiveList = $("archiveList");
  const flowers = [...document.querySelectorAll(".tulip")];
  const flowerStatus = $("flowerStatus");
  const bloomMessage = $("bloomMessage");
  const SAVE_KEY = "bunbun-garden-keepsakes";
  const flowerNotes = [
    "A pink tulip for the way your smile changes a room. ♡",
    "Lavender, because you make even quiet things feel lovely.",
    "A little cream flower for the ordinary moments I want to keep.",
    "A purple one, obviously. I know my Bunbun.",
    "This one is for every version of you, not just the easy days.",
    "A tiny reminder that you deserve softness, always."
  ];
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}"); } catch (_) {}
  const bloomed = new Set(saved.bloomed || []);
  let soundOn = false;
  let audio = null;
  let lastFocus = null;

  function persist() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ bloomed: [...bloomed] })); } catch (_) {}
  }
  function tone(frequency = 620, duration = .12) {
    if (!soundOn) return;
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, audio.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.22, audio.currentTime + duration);
      gain.gain.setValueAtTime(.035, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + duration);
      oscillator.connect(gain); gain.connect(audio.destination);
      oscillator.start(); oscillator.stop(audio.currentTime + duration);
    } catch (_) {}
  }
  function openModal(title, eyebrow, body, isHtml = false) {
    lastFocus = document.activeElement;
    modalTitle.textContent = title;
    modalEyebrow.textContent = eyebrow || "A LITTLE NOTE";
    modalBody.innerHTML = "";
    if (isHtml) modalBody.innerHTML = body;
    else {
      body.split(/\n\s*\n/).forEach(part => {
        const p = document.createElement("p");
        p.textContent = part;
        modalBody.appendChild(p);
      });
    }
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("modalClose").focus();
    tone(520, .09);
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }
  $("modalClose").addEventListener("click", closeModal);
  $("modalDone").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target.dataset.close) closeModal(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeModal(); closeLightbox(); }
  });

  $("enterButton").addEventListener("click", () => {
    entryScreen.classList.add("hidden");
    site.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    tone(540, .1);
  });

  // Archive titles are intentionally typeset like labels on old envelopes, not numbered entries.
  const titleOverrides = {
    "To andrea 1 year later": "To Andrea, a year later",
    "The story of you and me": "The story of you & me"
  };
  const icons = ["✉", "♡", "✿", "〰", "❀", "☾"];
  (window.BUNBUN_LETTERS || []).forEach((letter, index) => {
    const button = document.createElement("button");
    button.className = "archive-entry";
    button.type = "button";
    const icon = document.createElement("span");
    icon.className = "entry-icon";
    icon.textContent = icons[index % icons.length];
    const text = document.createElement("span");
    text.className = "entry-text";
    const title = document.createElement("strong");
    title.textContent = titleOverrides[letter.title] || letter.title;
    const note = document.createElement("small");
    note.textContent = letter.note;
    const arrow = document.createElement("span");
    arrow.className = "entry-arrow";
    arrow.textContent = "↗";
    text.append(title, note);
    button.append(icon, text, arrow);
    button.addEventListener("click", () => {
      openModal(title.textContent, "FROM THE LITTLE ARCHIVE", letter.body);
    });
    archiveList.appendChild(button);
  });

  flowers.forEach((flower, index) => {
    if (bloomed.has(index)) flower.classList.add("bloomed");
    flower.addEventListener("click", () => {
      const already = bloomed.has(index);
      if (!already) {
        bloomed.add(index);
        flower.classList.add("bloomed");
        persist();
        tone(640 + index * 42, .16);
        makeSparkles(flower);
      } else {
        tone(500 + index * 28, .08);
      }
      bloomMessage.textContent = flowerNotes[index];
      flowerStatus.textContent = bloomed.size === flowers.length
        ? "the whole patch is smiling now ♡"
        : "some little things are opening up";
    });
  });
  flowerStatus.textContent = bloomed.size === flowers.length
    ? "the whole patch is smiling now ♡"
    : bloomed.size ? "some little things are opening up" : "a few buds are waiting for you";

  function makeSparkles(flower) {
    const meadow = $("tulipMeadow");
    const rect = flower.getBoundingClientRect();
    const parent = meadow.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      const sparkle = document.createElement("span");
      sparkle.textContent = i % 2 ? "✧" : "♡";
      sparkle.className = "bloom-sparkle";
      sparkle.style.left = `${rect.left - parent.left + rect.width / 2 + (Math.random() * 56 - 28)}px`;
      sparkle.style.top = `${rect.top - parent.top + 25 + (Math.random() * 30 - 15)}px`;
      meadow.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1050);
    }
  }

  // Personal photo lightbox.
  const lightbox = $("lightbox");
  const lightboxImage = $("lightboxImage");
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
  }
  document.querySelectorAll(".photo").forEach(photo => {
    photo.addEventListener("click", () => {
      lightboxImage.src = `assets/images/${photo.dataset.photo}`;
      lightboxImage.alt = photo.querySelector("img").alt;
      $("lightboxDescription").textContent = photo.dataset.description;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      tone(470, .08);
    });
  });
  $("lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

  // The bedside note and the little visitor.
  $("roomNote").addEventListener("click", () => {
    openModal("A note on the nightstand", "WHEN THE WORLD GETS LOUD", "Hi, Bunbun.\n\nYou can rest here for a bit. You don't have to be productive, cheerful, pretty, clever, or anything in particular to deserve a soft place to land.\n\nTake your time. Drink some water. Get comfy. I hope you know how loved you are, even when you don't feel like your usual self.\n\nI'll be cheering for you, always. ♡");
  });
  const pet = $("roomPet");
  function petBunny() {
    $("roomCaption").textContent = "the little bunny says: stay a little longer ♡";
    pet.textContent = "૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა";
    tone(720, .11);
  }
  pet.addEventListener("click", petBunny);
  pet.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); petBunny(); } });

  document.querySelectorAll("[data-treat]").forEach(button => {
    button.addEventListener("click", () => {
      $("treatResponse").textContent = button.dataset.treat;
      tone(580, .08);
    });
  });

  $("soundToggle").addEventListener("click", () => {
    soundOn = !soundOn;
    $("soundToggle").innerHTML = soundOn ? "♫ <span>sound on</span>" : "♫ <span>sound</span>";
    if (soundOn) tone(660, .13);
  });

  // Small, friendly nav behavior on narrow screens: jump links remain available from the footer/scroll.
  document.querySelectorAll(".main-nav a, .wordmark, .text-link").forEach(link => {
    link.addEventListener("click", () => tone(430, .06));
  });
})();