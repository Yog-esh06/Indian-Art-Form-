const regionalArt = [
  {
    region: "Maharashtra",
    coordinates: [20.5529, 75.7033],
    title: "Ajanta Caves",
    imageUrl: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=85",
    description: "Cut into a horseshoe-shaped ravine, Ajanta's Buddhist monasteries and shrines preserve paintings made across several centuries. Their murals illuminate religious storytelling and the region's historic links along Deccan trade routes.",
    technique: "Pigments on prepared plaster; softly modelled Buddhist murals."
  },
  {
    region: "Andhra Pradesh",
    coordinates: [15.9129, 79.7400],
    title: "Kalamkari",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=85",
    description: "Kalamkari developed in Andhra's textile centers, notably Srikalahasti and Machilipatnam. Painted and printed cottons circulated through temple, court and trading networks, carrying stories and patterned designs across the region and beyond.",
    technique: "Hand-drawn kalam or block printing on cotton; mordants and natural dyes."
  },
  {
    region: "Tamil Nadu",
    coordinates: [10.7867, 79.1378],
    title: "Tanjore Painting",
    imageUrl: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1000&q=85",
    description: "Thanjavur painting flourished in Tamil Nadu under regional court and temple patronage, especially from the late eighteenth century. Its devotional images reflect the area's rich networks of worship, craft and royal support.",
    technique: "Raised gesso, vivid pigments, gold foil and glass or stone embellishments."
  },
  {
    region: "Rajasthan",
    coordinates: [27.0238, 74.2179],
    title: "Rajput Miniatures",
    imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1000&q=85",
    description: "Rajput painting grew in the courts of Rajasthan, including Mewar, Marwar and Kishangarh. Distinct schools interpreted courtly life, devotional poetry and Hindu epics through vivid, regionally varied visual languages.",
    technique: "Fine brushwork, bold contours and mineral or vegetal pigments on paper."
  }
];

const artMap = L.map("art-map", {
  center: [20.5937, 78.9629],
  zoom: 5,
  zoomControl: false,
  scrollWheelZoom: true
});

const mapTiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: ["a", "b", "c"],
  maxZoom: 19
});

mapTiles.addTo(artMap);

L.control.zoom({ position: "bottomright" }).addTo(artMap);

const themeToggle = document.querySelector("#theme-toggle");
const themeToggleLabel = document.querySelector("#theme-toggle-label");

themeToggle.addEventListener("click", () => {
  const useLightMode = themeToggle.getAttribute("aria-pressed") !== "true";
  themeToggle.setAttribute("aria-pressed", String(useLightMode));
  themeToggle.setAttribute(
    "aria-label",
    useLightMode ? "Switch to dark map mode" : "Switch to light map mode"
  );
  themeToggleLabel.textContent = useLightMode ? "Dark mode" : "Light mode";
  document.body.classList.toggle("light-mode", useLightMode);
});

function createPlacard(entry) {
  const placard = document.createElement("article");
  placard.className = "placard";

  const image = document.createElement("img");
  image.src = entry.imageUrl;
  image.alt = `${entry.title}, regional art of ${entry.region}`;
  image.loading = "lazy";

  const region = document.createElement("p");
  region.className = "placard-region";
  region.textContent = entry.region;

  const title = document.createElement("h2");
  title.textContent = entry.title;

  const description = document.createElement("p");
  description.className = "placard-description";
  description.textContent = entry.description;

  const technique = document.createElement("div");
  technique.className = "placard-technique";
  const label = document.createElement("strong");
  label.textContent = "In practice: ";
  technique.append(label, document.createTextNode(entry.technique));

  placard.append(image, region, title, description, technique);
  return placard;
}

const markerIcon = L.divIcon({
  className: "custom-marker",
  html: '<span class="art-marker" aria-hidden="true"></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
});

const markersByRegion = new Map();
const regionButtons = [...document.querySelectorAll(".region-button")];

function setActiveRegion(region) {
  regionButtons.forEach((button) => {
    const isActive = button.dataset.region === region;
    button.setAttribute("aria-pressed", String(isActive));
  });
}

regionalArt.forEach((entry) => {
  const highlight = L.circle(entry.coordinates, {
    radius: 150000,
    color: "#e2725b",
    weight: 1.5,
    opacity: 0.55,
    fillColor: "#e2725b",
    fillOpacity: 0.1,
    className: "region-highlight",
    interactive: false
  }).addTo(artMap);
  highlight.bindTooltip(entry.region, { direction: "center", className: "region-label" });

  const marker = L.marker(entry.coordinates, {
    icon: markerIcon,
    title: `${entry.title}, ${entry.region}`,
    alt: `${entry.title} in ${entry.region}`
  })
    .addTo(artMap)
    .bindPopup(createPlacard(entry), { maxWidth: 300, minWidth: 260 });

  marker.on("click", () => setActiveRegion(entry.region));
  marker.on("popupopen", () => setActiveRegion(entry.region));
  markersByRegion.set(entry.region, marker);
});

regionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const region = button.dataset.region;
    const marker = markersByRegion.get(region);
    if (!marker) {
      console.error(`No map marker is configured for region "${region}".`);
      return;
    }

    setActiveRegion(region);
    const coordinates = marker.getLatLng();
    const alreadyAtDestination = artMap.getZoom() === 7
      && artMap.getCenter().equals(coordinates);

    if (alreadyAtDestination) {
      marker.openPopup();
      return;
    }

    artMap.once("moveend", () => marker.openPopup());
    artMap.flyTo(coordinates, 7);
  });
});
