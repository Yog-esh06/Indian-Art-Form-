# Indian Art Form

> **Live Demo:** [Open the Indian Art Form portal](https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/)

## About

Indian Art Form is a small, accessible digital portal for exploring the visual heritage of the Indian subcontinent. It brings together a chronological timeline, a regional map and a generative canvas study in a single static website. Each experience is designed to encourage exploration while presenting historical context, artistic materials and regional practice.

The site is built as a framework-free collection of HTML pages and browser-native CSS and JavaScript. `index.html` is the root landing page and links to the three project experiences.

## Experiences

### 1. Interactive Historical Timeline

The timeline presents four landmark moments in Indian art history: the Indus Valley Civilization, the Mauryan Empire, the Gupta period and the Mughal era. Select a timeline node to open an illustrated detail panel with historical context and material notes.

### 2. Geographical Heritage of Indian Art

The full-screen interactive map locates four regional traditions: Ajanta Caves in Maharashtra, Kalamkari in Andhra Pradesh, Tanjore painting in Tamil Nadu and Rajput miniatures in Rajasthan. Visitors can select map markers or the region guide to navigate the map and open an illustrated placard. Regional highlight circles show the geographical context around each marker.

### 3. Regional Painting Fusion

The generative studio combines Warli-inspired geometric figures and borders with Kalamkari-inspired floral vines, drawn with the HTML5 Canvas API. Generate a new composition from the button or the canvas. Export a portrait A4 PDF collage featuring two variations, notes about both traditions and the project team roster.

## Technology

- **HTML5** for semantic, accessible page structure.
- **CSS3** for responsive layouts, visual styling, animation and reduced-motion support.
- **Vanilla ES6 JavaScript** for page interactions and generative drawing.
- **Leaflet** for the interactive map and marker popups.
- **OpenStreetMap and CARTO** for map tiles and geographic data attribution.
- **jsPDF** for client-side PDF creation.

Leaflet, jsPDF, web fonts, map tiles and photographic images are loaded from external services. An internet connection is needed for those resources; the local pages and canvas drawing are otherwise static browser code.

## Project structure

```text
Indian Art Form/
├── index.html       # GitHub Pages entry point and project portal
├── index.css
├── timeline.html
├── timeline.css
├── timeline.js
├── map.html
├── map.css
├── map.js
├── fusion.html
├── fusion.css
├── fusion.js
└── README.md
```

All page assets are referenced with relative paths. Keep these files together in the published directory so navigation works on both a repository project site and a custom domain.

## Deploy with GitHub Pages

1. Push this project directory to the root of a GitHub repository. Confirm that `index.html` is in the repository root (or in the selected Pages publishing directory); GitHub Pages uses it as the site's entry page.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the deployment branch (commonly `main`) and the `/ (root)` folder, then select **Save**.
5. Wait for the Pages deployment to complete. The published site URL is usually `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.
6. Replace the Live Demo placeholder at the top of this README with the deployed URL.
7. Open the published portal and verify the three relative navigation links. Also test the map and PDF export, which depend on external CDN and tile/image services.

No package install, build command or server-side runtime is required. The HTML pages may also be opened directly from a local folder; online resources require an internet connection.

## Historical and image notes

The timeline and map provide concise introductions rather than a comprehensive survey. Dates, attributions and techniques are presented with appropriate qualifiers where evidence is incomplete or traditions span multiple periods. Photography is illustrative and served by Unsplash; it should not be interpreted as a verified photograph of the named historical object or site.

## Team

- **YOGESH R MEHTA** — RA2411003010776
- **DARSH M SARAF** — RA2411003010731
- **MINK RANGA** — RA2411003010717
- **PRAKARSH AWASTHI** — RA2411003010737
- **ARIEVE BALORIA** — RA2411003010743

