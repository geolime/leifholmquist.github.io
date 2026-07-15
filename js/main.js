// Renders the project grid from PROJECTS (js/projects.js) and the
// project modal. Thumbnail convention: assets/projects/<slug>/thumb.png,
// overridable with `thumb`. Optional per-project: `video`, `details`,
// `gallery: [{src, caption}]`. Missing media renders styled placeholders.

function mediaFor(p) {
  const media = document.createElement("div");
  media.className = "card-media";
  if (p.nda && !p.image) {
    media.classList.add("placeholder");
  } else if (p.video) {
    const vid = document.createElement("video");
    vid.autoplay = true; vid.loop = true; vid.muted = true;
    vid.playsInline = true; vid.preload = "metadata";
    vid.src = p.video;
    vid.onerror = () => { vid.remove(); media.classList.add("placeholder"); };
    media.appendChild(vid);
  } else {
    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = p.title;
    img.src = p.image || `assets/projects/${p.slug}/preview.png`;
    img.onerror = () => { img.remove(); media.classList.add("placeholder"); };
    media.appendChild(img);
  }
  if (p.nda) {
    const badge = document.createElement("span");
    badge.className = "nda-badge";
    badge.textContent = "NDA";
    media.appendChild(badge);
  }
  return media;
}
function metaFor(p) {
  const meta = document.createElement("div");
  meta.className = "card-meta";
  meta.innerHTML =
    `<span class="card-years">${p.years}</span>` +
    `<span class="card-category">${p.category}</span>` +
    `<span class="card-kind">${p.kind}</span>`;
  return meta;
}

function linksFor(p) {
  if (p.links.length === 0) return null;
  const links = document.createElement("div");
  links.className = "card-links";
  p.links.forEach((l) => {
    const a = document.createElement("a");
    a.href = l.url;
    a.textContent = l.label + " \u2197";
    if (l.url.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
    a.addEventListener("click", (e) => e.stopPropagation());
    links.appendChild(a);
  });
  return links;
}

/* ---------- grid ---------- */

function techChip(t, detailed) {
  const chip = document.createElement("span");
  if (typeof t === "string") {
    chip.textContent = t;
  } else if (detailed && t.libs && t.libs.length > 0) {
    chip.innerHTML = `${t.name} <em class="chip-libs">${t.libs.join(" \u00b7 ")}</em>`;
  } else {
    chip.textContent = t.name;
  }
  return chip;
}

function renderProjects() {
  const grid = document.getElementById("project-grid");

  PROJECTS.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";
    card.id = "project-" + p.slug;

    card.appendChild(mediaFor(p));

    const body = document.createElement("div");
    body.className = "card-body";
    body.appendChild(metaFor(p));

    const h3 = document.createElement("h3");
    h3.textContent = p.title;
    body.appendChild(h3);

    const loc = document.createElement("div");
    loc.className = "card-location";
    loc.textContent = p.locationLabel;
    body.appendChild(loc);

    const blurb = document.createElement("p");
    blurb.className = "card-blurb";
    blurb.textContent = p.blurb;
    body.appendChild(blurb);

    const tech = document.createElement("div");
    tech.className = "card-tech";
    p.tech.forEach((t) => tech.appendChild(techChip(t, false)));
    body.appendChild(tech);

    const links = linksFor(p);
    if (links) body.appendChild(links);

    card.appendChild(body);
    card.addEventListener("click", () => openModal(p));
    grid.appendChild(card);
  });
}

/* ---------- modal ---------- */

function closeModal() {
  const overlay = document.querySelector(".modal-overlay");
  if (overlay) overlay.remove();
  document.body.style.overflow = "";
}

function openModal(p) {
  closeModal();
  document.body.style.overflow = "hidden";

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  const panel = document.createElement("div");
  panel.className = "modal-panel";

  const close = document.createElement("button");
  close.className = "modal-close mono";
  close.textContent = "\u00d7";
  close.setAttribute("aria-label", "Close");
  close.addEventListener("click", closeModal);
  panel.appendChild(close);

  panel.appendChild(mediaFor(p));

  const body = document.createElement("div");
  body.className = "modal-body";
  body.appendChild(metaFor(p));

  const h2 = document.createElement("h2");
  h2.textContent = p.title;
  body.appendChild(h2);

  const loc = document.createElement("div");
  loc.className = "card-location";
  loc.textContent = p.locationLabel;
  body.appendChild(loc);

  const blurb = document.createElement("p");
  blurb.className = "modal-text";
  blurb.textContent = p.blurb;
  body.appendChild(blurb);

  if (p.details) {
    const det = document.createElement("p");
    det.className = "modal-text";
    det.textContent = p.details;
    body.appendChild(det);
  }

  const galleryItems = (p.full ? [{ src: p.full, caption: (p.fullCaption || "Full map") + " \u00b7 click to open" }] : [])
    .concat(p.gallery || []);
  if (galleryItems.length > 0) {
    const gal = document.createElement("div");
    gal.className = "modal-gallery";
    galleryItems.forEach((g) => {
      const fig = document.createElement("figure");
      const isVideo = /\.(mp4|webm)$/i.test(g.src);
      if (isVideo) {
        const vid = document.createElement("video");
        vid.controls = true; vid.loop = true; vid.muted = true;
        vid.playsInline = true; vid.preload = "metadata";
        vid.src = g.src;
        vid.onerror = () => fig.remove();
        fig.appendChild(vid);
      } else {
        const a = document.createElement("a");
        a.href = g.src; a.target = "_blank"; a.rel = "noopener";
        const img = document.createElement("img");
        img.loading = "lazy";
        img.src = g.src;
        img.alt = g.caption || p.title;
        img.onerror = () => fig.remove();
        a.appendChild(img);
        fig.appendChild(a);
      }
      if (g.caption) {
        const cap = document.createElement("figcaption");
        cap.className = "mono";
        cap.textContent = g.caption;
        fig.appendChild(cap);
      }
      gal.appendChild(fig);
    });
    body.appendChild(gal);
  }

  const chipGroup = (label, items, extraClass) => {
    if (!items || items.length === 0) return;
    const lab = document.createElement("div");
    lab.className = "chip-group-label mono";
    lab.textContent = label;
    body.appendChild(lab);
    const row = document.createElement("div");
    row.className = "card-tech" + (extraClass ? " " + extraClass : "");
    items.forEach((t) => row.appendChild(techChip(t, true)));
    body.appendChild(row);
  };
  chipGroup("// TOOLS & METHODS", p.tech);
  chipGroup("// DATA SOURCES", p.data, "data-chips");

  const links = linksFor(p);
  if (links) body.appendChild(links);

  panel.appendChild(body);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

renderProjects();