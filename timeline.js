const artPeriods = [
  {
    date: "c. 2500 BCE",
    period: "Indus Valley Civilization",
    title: "Dancing Girl of Mohenjo-Daro",
    material: "Bronze casting",
    imageUrl: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=85",
    symbol: "न",
    paragraphs: [
      "This small bronze figure was found at Mohenjo-Daro, one of the great urban centers of the Indus Valley Civilization. Its relaxed, assured stance has made it one of the best-known objects from the civilization.",
      "The sculpture was made using lost-wax casting: a wax model was covered with clay, heated so the wax ran out, and replaced with molten metal. The technique demanded careful planning and skilled metalworking.",
      "The figure's identity and purpose remain unknown. Rather than assigning her a definite role, the sculpture invites us to consider the sophistication, craftsmanship and expressive range of life in a Bronze Age city."
    ]
  },
  {
    date: "c. 250 BCE",
    period: "Mauryan Empire",
    title: "Lion Capital of Ashoka",
    material: "Polished sandstone",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=85",
    symbol: "सिंह",
    paragraphs: [
      "Carved in the third century BCE during the reign of Ashoka, the Sarnath Lion Capital once crowned a pillar marking a place associated with the Buddha's first sermon. Its four lions face the cardinal directions.",
      "The capital is carved from sandstone and finished with the highly polished surface associated with Mauryan imperial sculpture. Below the lions, a drum bears animals and wheels; the abacus rests on a bell-shaped lotus.",
      "The lions proclaim royal authority while also evoking the Buddha's teaching, often called the 'lion's roar.' Adopted as India's national emblem, the surviving capital remains a striking meeting of political and Buddhist imagery."
    ]
  },
  {
    date: "5th century CE",
    period: "Gupta Period",
    title: "Ajanta Cave Murals",
    material: "Pigments on prepared plaster",
    imageUrl: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1000&q=85",
    symbol: "ॐ",
    paragraphs: [
      "Ajanta's Buddhist cave paintings were created in several phases, with major activity in the fifth century CE. Monastic halls and shrines preserve scenes from the Buddha's life and stories of his former births, alongside courtly and everyday figures.",
      "Artists prepared the rock with layers of plaster and applied pigments to a dry surface, a method often described as tempera or fresco-secco rather than true wet-plaster fresco. Mineral and other pigments were worked into softly modelled faces, patterned textiles and detailed settings.",
      "These paintings are not one single moment or workshop: they reflect changing patrons and artistic choices over centuries. Their intimate gestures and sophisticated compositions offer a rare window into religious storytelling and society in ancient India."
    ]
  },
  {
    date: "16th century CE",
    period: "Mughal Era",
    title: "Mughal Miniature Paintings",
    material: "Opaque watercolor and gold on paper",
    imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1000&q=85",
    symbol: "चित्र",
    paragraphs: [
      "Mughal painting took shape at the imperial court under Akbar in the later sixteenth century, drawing on Persianate book arts while developing a distinctive interest in portraiture, observed detail and historical narrative.",
      "Painters worked on carefully prepared paper with fine brushes and opaque water-based pigments. Courtly manuscripts were often collaborative projects: one artist might draw the composition, another paint figures, and another add finishing details or calligraphy.",
      "The tradition continued and diversified under later emperors and regional patrons. Its album portraits, illustrated chronicles and scenes of court life reveal an art shaped by exchange, experimentation and the ambitions of a changing empire."
    ]
  }
];

const eventsRoot = document.querySelector("#timeline-events");
const viewport = document.querySelector("#timeline-viewport");
const overlay = document.querySelector("#artifact-overlay");
const closeButton = document.querySelector("#modal-close");
const modalTitle = document.querySelector("#modal-title");
const modalPeriod = document.querySelector("#modal-period");
const modalImage = document.querySelector("#modal-image");
const modalCaption = document.querySelector("#modal-caption");
const modalDescription = document.querySelector("#modal-description");
const modalIndex = document.querySelector("#modal-index");
const activeCount = document.querySelector("#active-count");
let lastFocusedElement = null;
let closeTimer;

function createEvent(period, index) {
  const article = document.createElement("article");
  article.className = "timeline-event";

  const button = document.createElement("button");
  const isTop = index % 2 === 0;
  button.type = "button";
  button.className = `event-button ${isTop ? "top" : "bottom"}`;
  button.setAttribute("aria-label", `Explore ${period.title}, ${period.date}`);

  const date = document.createElement("span");
  date.className = "event-date";
  date.textContent = period.date;

  const title = document.createElement("span");
  title.className = "event-name";
  title.textContent = period.period;

  const artifact = document.createElement("span");
  artifact.className = "event-artifact";
  artifact.textContent = period.title;

  const node = document.createElement("span");
  node.className = "artifact-node";
  node.setAttribute("aria-hidden", "true");
  const image = document.createElement("img");
  image.src = period.imageUrl;
  image.alt = "";
  image.loading = "lazy";
  const symbol = document.createElement("span");
  symbol.className = "node-symbol";
  symbol.textContent = period.symbol;
  node.append(image, symbol);

  if (isTop) {
    button.append(date, title, artifact, node);
  } else {
    button.append(node, date, title, artifact);
  }

  button.addEventListener("click", () => openArtifact(period, index, button));
  article.append(button);

  const stem = document.createElement("span");
  stem.className = `event-stem ${isTop ? "stem-top" : "stem-bottom"}`;
  stem.setAttribute("aria-hidden", "true");
  article.append(stem);
  return article;
}

function openArtifact(period, index, trigger) {
  window.clearTimeout(closeTimer);
  lastFocusedElement = trigger;
  modalTitle.textContent = period.title;
  modalPeriod.textContent = `${period.period} · ${period.date}`;
  modalCaption.textContent = period.material;
  modalImage.src = period.imageUrl;
  modalImage.alt = `${period.title}, associated with ${period.period}`;
  modalDescription.replaceChildren(...period.paragraphs.map((text) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    return paragraph;
  }));
  modalIndex.textContent = `CHAPTER 0${index + 1} / 04`;
  overlay.hidden = false;
  overlay.classList.remove("is-closing");
  document.body.classList.add("modal-open");
  closeButton.focus();
}

function closeArtifact() {
  if (overlay.hidden || overlay.classList.contains("is-closing")) return;
  overlay.classList.add("is-closing");
  document.body.classList.remove("modal-open");
  closeTimer = window.setTimeout(() => {
    overlay.hidden = true;
    overlay.classList.remove("is-closing");
    lastFocusedElement?.focus();
  }, 280);
}

artPeriods.forEach((period, index) => eventsRoot.append(createEvent(period, index)));

closeButton.addEventListener("click", closeArtifact);
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) closeArtifact();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeArtifact();
});
document.querySelector("#scroll-back").addEventListener("click", () => {
  viewport.scrollBy({ left: -viewport.clientWidth * 0.72, behavior: "smooth" });
});
document.querySelector("#scroll-forward").addEventListener("click", () => {
  viewport.scrollBy({ left: viewport.clientWidth * 0.72, behavior: "smooth" });
});

const timelineObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting);
  if (visible.length) {
    const event = visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0].target;
    activeCount.textContent = String([...eventsRoot.children].indexOf(event) + 1).padStart(2, "0");
  }
}, { root: viewport, threshold: [0.35, 0.6, 0.85] });

[...eventsRoot.children].forEach((event) => timelineObserver.observe(event));
