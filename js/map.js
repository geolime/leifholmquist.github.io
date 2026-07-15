// Hero map: renders PROJECTS footprints (countries + boxes) and markers
// on a dark Carto basemap. Deep-linkable via #map=zoom/lat/lng.

const COUNTRIES_URL = "assets/geo/countries.geojson";

// --- geometry helpers ---

function boxToPolygon(center, km) {
  const [lng, lat] = center;
  const dLat = (km[1] / 2) / 110.574;
  const dLng = (km[0] / 2) / (111.32 * Math.cos((lat * Math.PI) / 180));
  return {
    type: "Polygon",
    coordinates: [[
      [lng - dLng, lat - dLat],
      [lng + dLng, lat - dLat],
      [lng + dLng, lat + dLat],
      [lng - dLng, lat + dLat],
      [lng - dLng, lat - dLat]
    ]]
  };
}

function buildGeodata(countries) {
  const byId = {};
  countries.features.forEach((f) => { byId[f.properties.id] = f.geometry; });

  const footprints = { type: "FeatureCollection", features: [] };
  const markers = { type: "FeatureCollection", features: [] };

  PROJECTS.forEach((p) => {
    const props = {
      slug: p.slug, title: p.title, years: p.years, loc: p.locationLabel,
      kind: p.kind
    };
    p.footprints.forEach((fp) => {
      let geometry = null;
      if (fp.type === "named") {
        geometry = byId[fp.id];
        if (!geometry) throw new Error(`No geometry for id ${fp.id}`);
      } else if (fp.type === "box") {
        geometry = boxToPolygon(fp.center, fp.km);
      } else if (fp.type === "bbox") {
        const [w, s, e, n] = fp.bounds;
        geometry = {
          type: "Polygon",
          coordinates: [[[w, s], [e, s], [e, n], [w, n], [w, s]]]
        };
      } else {
        throw new Error(`Unknown footprint type: ${fp.type}`);
      }
      footprints.features.push({ type: "Feature", properties: props, geometry });
    });
    p.markers.forEach((m) => {
      markers.features.push({
        type: "Feature", properties: props,
        geometry: { type: "Point", coordinates: m }
      });
    });
  });
  return { footprints, markers };
}

function boundsOf(fc) {
  const b = new maplibregl.LngLatBounds();
  const walk = (c) => {
    if (typeof c[0] === "number") b.extend(c);
    else c.forEach(walk);
  };
  fc.features.forEach((f) => walk(f.geometry.coordinates));
  return b;
}

// --- hash state (#map=zoom/lat/lng) ---

function readHash() {
  const m = location.hash.match(/^#map=([\d.]+)\/(-?[\d.]+)\/(-?[\d.]+)$/);
  return m ? { zoom: +m[1], center: [+m[3], +m[2]] } : null;
}

function writeHash(map) {
  const c = map.getCenter();
  const h = `#map=${map.getZoom().toFixed(2)}/${c.lat.toFixed(4)}/${c.lng.toFixed(4)}`;
  history.replaceState(null, "", h);
}

// kind -> retro palette color (also used by the legend)
/*const KIND_COLORS = {
  Work: "#2de2e6",      // cyan
  Personal: "#ff3864",  // magenta
  Thesis: "#f9c80e"     // amber
};*/

const cssVars = getComputedStyle(document.documentElement);
const KIND_COLORS = {
  Work: cssVars.getPropertyValue("--accent").trim(),
  Personal: cssVars.getPropertyValue("--accent-2").trim(),
  Thesis: cssVars.getPropertyValue("--accent-3").trim()
};

const kindColorExpr = [
  "match", ["get", "kind"],
  "Work", KIND_COLORS.Work,
  "Personal", KIND_COLORS.Personal,
  "Thesis", KIND_COLORS.Thesis,
  "#2de2e6"
];

// --- init ---

async function initMap() {
  const resp = await fetch(COUNTRIES_URL);
  if (!resp.ok) throw new Error(`Failed to load ${COUNTRIES_URL}: ${resp.status}`);
  const countries = await resp.json();
  const { footprints, markers } = buildGeodata(countries);

  const saved = readHash();
  const map = new maplibregl.Map({
    container: "map",
    style: {
      version: 8,
      projection: { type: "globe" },
      sources: {
        carto: {
          type: "raster",
          tiles: [
            "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
          ],
          tileSize: 256,
          attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
        }
      },
      layers: [{ id: "basemap", type: "raster", source: "carto" }]
    },
    center: saved ? saved.center : [10, 25],
    zoom: saved ? saved.zoom : 1.5,
    attributionControl: { compact: true }
  });

  map.addControl(new maplibregl.NavigationControl({ showCompass: false }));

  map.on("load", () => {
    const pending = document.querySelector(".map-pending");
    if (pending) pending.remove();

    map.addSource("footprints", { type: "geojson", data: footprints });
    map.addSource("markers", { type: "geojson", data: markers });

    map.addLayer({
      id: "footprint-fill", type: "fill", source: "footprints",
      paint: { "fill-color": kindColorExpr, "fill-opacity": 0.13 }
    });
    map.addLayer({
      id: "footprint-line", type: "line", source: "footprints",
      paint: { "line-color": kindColorExpr, "line-width": 1.2, "line-opacity": 0.7 }
    });
    map.addLayer({
      id: "marker-glow", type: "circle", source: "markers",
      paint: {
        "circle-radius": 11, "circle-color": kindColorExpr,
        "circle-blur": 1, "circle-opacity": 0.55
      }
    });
    map.addLayer({
      id: "marker-core", type: "circle", source: "markers",
      paint: {
        "circle-radius": 4, "circle-color": kindColorExpr,
        "circle-stroke-color": "#0d0f1a", "circle-stroke-width": 1.5
      }
    });

    const legend = document.createElement("div");
    legend.className = "map-legend mono";
    legend.innerHTML = Object.entries(KIND_COLORS)
      .map(([k, c]) => `<span class="legend-item"><span class="legend-swatch" style="background:${c}; box-shadow: 0 0 6px ${c}"></span>${k}</span>`)
      .join("");
    document.getElementById("map").appendChild(legend);

    if (!saved) {
      map.fitBounds(boundsOf(footprints), { padding: 60, animate: false });
    }

    const openPopup = (feature, lngLat) => {
      const p = feature.properties;
      new maplibregl.Popup({ offset: 10 })
        .setLngLat(lngLat)
        .setHTML(
          `<div class="popup-title">${p.title}</div>` +
          `<div class="popup-meta">${p.years}</div>` +
          `<div class="popup-loc">${p.loc}</div>` +
          `<a class="popup-link" href="#project-${p.slug}">View project &darr;</a>`
        )
        .addTo(map);
    };

    map.on("click", "marker-core", (e) => openPopup(e.features[0], e.lngLat));
    map.on("click", "footprint-fill", (e) => {
      // Markers sit on top; don't double-fire when a marker was hit.
      const hits = map.queryRenderedFeatures(e.point, { layers: ["marker-core"] });
      if (hits.length === 0) openPopup(e.features[0], e.lngLat);
    });

    ["marker-core", "footprint-fill"].forEach((layer) => {
      map.on("mouseenter", layer, () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", layer, () => { map.getCanvas().style.cursor = ""; });
    });

    map.on("moveend", () => writeHash(map));
  });
}

initMap();