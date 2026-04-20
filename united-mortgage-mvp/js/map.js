console.log("Map JS loaded");

// 1) MAP
const mapEl = document.getElementById("map");
if (!mapEl) {
  console.warn("No #map element found.");
} else {
  const map = L.map("map", {
    zoomControl: false,
    scrollWheelZoom: true
  }).setView([37.8, -96], 4);

  L.control.zoom({ position: "bottomright" }).addTo(map);

  // 2) TILES
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  // 3) LAYER
  const layer = L.layerGroup().addTo(map);

  // 4) STATE CENTERS
  const stateCenters = {
    florida: { name: "Florida", lat: 27.9944, lng: -81.7603, zoom: 7 },
    "north carolina": { name: "North Carolina", lat: 35.7596, lng: -79.0193, zoom: 7 },
    "south carolina": { name: "South Carolina", lat: 33.8361, lng: -81.1637, zoom: 7 },
    maryland: { name: "Maryland", lat: 39.0458, lng: -76.6413, zoom: 7 }
  };

  // 5) BRANCHES
  const branches = [
    { type: "branch", name: "Miami Branch", city: "Miami", state: "Florida", slug: "miami", lat: 25.7617, lng: -80.1918 },
    { type: "branch", name: "Orlando Branch", city: "Orlando", state: "Florida", slug: "orlando", lat: 28.5383, lng: -81.3792 },
    { type: "branch", name: "Charlotte Branch", city: "Charlotte", state: "North Carolina", slug: "charlotte", lat: 35.2271, lng: -80.8431 }
  ];

  // 6) PEOPLE
  const people = [
    { type: "person", name: "Joell Pimentel", slug: "Joell-Pimentel", branchSlug: "charlotte", email: "joell.pimentel@unitedmtg.net", city: "Charlotte", state: "North Carolina", lat: 35.2271, lng: -80.8431 },
    { type: "person", name: "Talema Alvarado", slug: "Talema-Alvarado", branchSlug: "charlotte", email: "talema.alvarado@unitedmtg.net", city: "Conway", state: "South Carolina", lat: 33.8360, lng: -79.0478 },
    { type: "person", name: "Henry Burger", slug: "Henry-Burger", branchSlug: "maryland", email: "henry.burger@unitedmtg.net", city: "Mitchellville", state: "Maryland", lat: 38.9276, lng: -76.7427 },
    { type: "person", name: "Dwight Williams", slug: "Dwight-Williams", branchSlug: "miami", email: "dwight.williams@unitedmtg.net", city: "Tampa", state: "Florida", lat: 27.9506, lng: -82.4572 },
    { type: "person", name: "Aaron Marin", slug: "Aaron-Marin", branchSlug: "charlotte", email: "aaron@unitedmtg.net", city: "Huntersville", state: "North Carolina", lat: 35.4107, lng: -80.8428 },
    { type: "person", name: "Jessica Carlin", slug: "Jessica-Carlin", branchSlug: "miami", email: "jessica.carlin@unitedmtg.net", city: "Miami", state: "Florida", lat: 25.7617, lng: -80.1918 }
  ];

  const locations = [...branches, ...people];

  /* =========================
     ICONS (DIV ICONS)
  ========================= */
  const iconHtml = (kind) => `
    <div class="pin pin--${kind}">
      <span class="pin__dot"></span>
    </div>
  `;

  const makeDivIcon = (kind) =>
    L.divIcon({
      className: "pin-wrap",
      html: iconHtml(kind),
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -24]
    });

  const branchIcon = makeDivIcon("branch");
  const personIcon = makeDivIcon("person");

  /* =========================
     POPUP (MODERN CARD)
  ========================= */
  function escapeHtml(str = "") {
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[m]));
  }

  function branchLink(slug) {
    return slug === "miami"
      ? "jessica-carlin/index.html"
      : `branch.html?branch=${encodeURIComponent(slug)}`;
  }

  function personLink(slug) {
    return slug === "Jessica-Carlin"
      ? "jessica-carlin/index.html"
      : `${encodeURIComponent(slug)}/index.html`;
  }

  function popupCard(l) {
    const title = escapeHtml(l.name);
    const subtitle = escapeHtml(`${l.city}, ${l.state}`);
    const badge = l.type === "branch" ? "Branch" : "Loan Officer";

    let primaryHref = "#";
    let primaryText = "View";
    let secondaryHref = "#";
    let secondaryText = "";

    if (l.type === "branch") {
      primaryHref = branchLink(l.slug);
      primaryText = "View Branch";
      secondaryHref = `state.html?state=${encodeURIComponent(l.state)}`;
      secondaryText = `View ${escapeHtml(l.state)}`;
    } else {
      primaryHref = personLink(l.slug);
      primaryText = "View Profile";
      secondaryHref = `branch.html?branch=${encodeURIComponent(l.branchSlug)}`;
      secondaryText = "View Branch";
    }

    const emailRow = l.email
      ? `<a class="popup-link" href="mailto:${encodeURIComponent(l.email)}">${escapeHtml(l.email)}</a>`
      : "";

    return `
      <div class="popup-card">
        <div class="popup-badge">${badge}</div>
        <div class="popup-title">${title}</div>
        <div class="popup-subtitle">${subtitle}</div>
        ${emailRow ? `<div class="popup-meta">${emailRow}</div>` : ""}
        <div class="popup-actions">
          <a class="popup-btn popup-btn--primary" href="${primaryHref}">${primaryText}</a>
          <a class="popup-btn popup-btn--ghost" href="${secondaryHref}">${secondaryText}</a>
        </div>
      </div>
    `;
  }

  /* =========================
     RENDER
  ========================= */
  function render(stateName = "") {
    layer.clearLayers();

    const filtered = locations.filter((l) => !stateName || l.state === stateName);

    if (stateName) {
      if (filtered.length >= 2) {
        const bounds = L.latLngBounds(filtered.map((x) => [x.lat, x.lng]));
        map.fitBounds(bounds, { padding: [60, 60], animate: true, duration: 0.9 });
      } else if (filtered.length === 1) {
        map.flyTo([filtered[0].lat, filtered[0].lng], 10, { duration: 0.9 });
      } else {
        const key = stateName.toLowerCase();
        const center = stateCenters[key];
        if (center) map.flyTo([center.lat, center.lng], center.zoom, { duration: 0.9 });
      }
    } else {
      map.setView([37.8, -96], 4);
    }

    filtered.forEach((l) => {
      const icon = l.type === "branch" ? branchIcon : personIcon;

      L.marker([l.lat, l.lng], { icon })
        .addTo(layer)
        .bindPopup(popupCard(l), {
          closeButton: true,
          maxWidth: 320,
          className: "modern-popup"
        });
    });
  }

  /* =========================
     AUTOCOMPLETE
  ========================= */
  const input = document.getElementById("stateInput");
  const list = document.getElementById("stateSuggestions");

  if (input && list) {
    input.addEventListener("input", () => {
      const value = input.value.trim().toLowerCase();
      list.innerHTML = "";
      if (!value) return;

      Object.values(stateCenters)
        .filter((s) => s.name.toLowerCase().includes(value))
        .forEach((state) => {
          const li = document.createElement("li");
          li.textContent = state.name;
          li.onclick = () => {
            input.value = state.name;
            list.innerHTML = "";
            render(state.name);
          };
          list.appendChild(li);
        });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".autocomplete")) list.innerHTML = "";
    });
  }

  // Initial render
  render();
}