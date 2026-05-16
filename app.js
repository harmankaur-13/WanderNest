/**
 * Wandernest — Vanilla JS travel SPA
 * Central appState + localStorage | Mock destinationsDb | Tab router
 */

const STORAGE_KEY = "wandernest_state";

/* ── Step 1: Mock destinations database (Tokyo, Paris, New York) ── */
const destinationsDb = {
  tokyo: {
    country: "Japan",
    language: "Japanese",
    veganHard: true,
    phrases: [
      { en: "Hello", local: "こんにちは", phonetic: "Konnichiwa" },
      { en: "Thank you", local: "ありがとう", phonetic: "Arigatō" },
      { en: "Where is the station?", local: "駅はどこですか？", phonetic: "Eki wa doko desu ka?" },
      { en: "I do not eat meat, fish, or fish sauce.", local: "肉と魚と魚醤は食べません。", phonetic: "Niku to sakana to gyoshō wa tabemasen.", dining: true },
    ],
    cuisines: {
      all: [
        { name: "Tsukiji Outer Market", desc: "Morning seafood and produce stalls." },
        { name: "Afuri Ramen", desc: "Light yuzu-shio ramen — customizable toppings." },
      ],
      vegetarian: [
        { name: "Organic House Salus", desc: "Organic buffet with clear allergen labels." },
        { name: "Vegetarian sushi counters", desc: "Ask for yasai-only omakase sets." },
      ],
      vegan: [
        { name: "T's Tantan (Tokyo Station)", desc: "Famous sesame vegan ramen." },
        { name: "Ain Soph Journey", desc: "Plant-based burgers in Shinjuku." },
      ],
    },
    itineraryPool: [
      { region: "Shibuya & Harajuku", morning: { t: "Meiji Shrine walk", d: "Forest paths at opening hour." }, afternoon: { t: "Omotesando stroll", d: "Architecture and cafés." }, evening: { t: "Shibuya Crossing", d: "Scramble lights and skyline views." } },
      { region: "Asakusa", morning: { t: "Senso-ji Temple", d: "Nakamise shopping lane." }, afternoon: { t: "Sumida cruise", d: "River views toward Skytree." }, evening: { t: "Izakaya dinner", d: "Small plates in old-town lanes." } },
      { region: "Ueno & Yanaka", morning: { t: "Ueno Park", d: "Museum or pond loop." }, afternoon: { t: "Yanaka Ginza", d: "Wooden streets and temples." }, evening: { t: "Ameyoko snacks", d: "Market alley under the tracks." } },
      { region: "Akihabara", morning: { t: "Kanda Myojin", d: "Shrine visit before crowds." }, afternoon: { t: "Electronics district", d: "Retro games and gadgets." }, evening: { t: "Ramen alley", d: "Compact shops, distinct broths." } },
      { region: "Odaiba", morning: { t: "TeamLab / Miraikan", d: "Waterfront art or science." }, afternoon: { t: "Seaside park", d: "Rainbow Bridge photos." }, evening: { t: "Bay dinner", d: "Skyline-facing meal." } },
    ],
  },
  paris: {
    country: "France",
    language: "French",
    veganHard: false,
    phrases: [
      { en: "Hello", local: "Bonjour", phonetic: "Bohn-zhoor" },
      { en: "Thank you", local: "Merci", phonetic: "Mehr-see" },
      { en: "The check, please", local: "L'addition, s'il vous plaît", phonetic: "Lah-dee-syon, seel voo pleh" },
      { en: "No meat or fish stock, please.", local: "Sans viande ni bouillon de poisson.", phonetic: "Sahn vee-ahnd nee boo-yohn duh pwah-sohn.", dining: true },
    ],
    cuisines: {
      all: [
        { name: "Marché des Enfants Rouges", desc: "Historic covered market with diverse stalls." },
        { name: "Latin Quarter bistro", desc: "Classic French plates near the Sorbonne." },
      ],
      vegetarian: [
        { name: "Le Grenier de Notre-Dame", desc: "Vegetarian bistro by the cathedral." },
        { name: "L'As du Fallafel", desc: "Legendary Marais falafel — specify no dairy." },
      ],
      vegan: [
        { name: "Le Potager du Marais", desc: "French classics reimagined vegan." },
        { name: "Gentle Gourmet", desc: "Elegant plant-based tasting menus." },
      ],
    },
    itineraryPool: [
      { region: "Île de la Cité", morning: { t: "Notre-Dame & Seine", d: "Bridges and Gothic exteriors." }, afternoon: { t: "Sainte-Chapelle", d: "Stained-glass masterpiece." }, evening: { t: "Latin Quarter dinner", d: "Neighborhood bistro." } },
      { region: "Le Marais", morning: { t: "Place des Vosges", d: "Symmetric square coffee stop." }, afternoon: { t: "Rue des Rosiers", d: "Boutiques and falafel lane." }, evening: { t: "Seine picnic", d: "Baguette and sunset." } },
      { region: "Montmartre", morning: { t: "Sacré-Cœur", d: "Early climb for fewer crowds." }, afternoon: { t: "Artists' square", d: "Portraitists and vineyard rue." }, evening: { t: "Jazz cellar", d: "Intimate live set." } },
      { region: "Eiffel district", morning: { t: "Trocadéro gardens", d: "Frontal tower photos." }, afternoon: { t: "Musée d'Orsay", d: "Impressionist highlights." }, evening: { t: "Champ de Mars twilight", d: "Sparkle hour lights." } },
      { region: "Saint-Germain", morning: { t: "Luxembourg Gardens", d: "Chair by the fountain." }, afternoon: { t: "Literary cafés", d: "Galleries and bookshops." }, evening: { t: "Left Bank wine bar", d: "Natural wines and small plates." } },
    ],
  },
  newyork: {
    country: "United States",
    language: "English",
    veganHard: false,
    phrases: [
      { en: "Hello", local: "Hello", phonetic: "Standard" },
      { en: "Which train to ___?", local: "Which train do I take?", phonetic: "MTA apps help too." },
      { en: "Check, please", local: "Check, please!", phonetic: "At sit-down restaurants." },
      { en: "I have a severe allergy to ___.", local: "I have a severe ___ allergy.", phonetic: "Show written card to kitchen.", dining: true },
    ],
    cuisines: {
      all: [
        { name: "Katz's Delicatessen", desc: "Iconic deli — ask about allergens." },
        { name: "Chelsea Market", desc: "Global vendors with labeled ingredients." },
      ],
      vegetarian: [
        { name: "Dirt Candy", desc: "Vegetable-forward creative plates." },
        { name: "Divya's Kitchen", desc: "Ayurvedic vegetarian East Village." },
      ],
      vegan: [
        { name: "Blossom", desc: "Upscale vegan American comfort food." },
        { name: "By Chloe", desc: "Quick plant-based bowls citywide." },
      ],
    },
    itineraryPool: [
      { region: "Lower Manhattan", morning: { t: "Liberty Island ferry", d: "Early boat for shorter queues." }, afternoon: { t: "Wall Street walk", d: "Financial district history." }, evening: { t: "Stone Street dinner", d: "Cobblestone outdoor tables." } },
      { region: "Midtown & High Line", morning: { t: "High Line north", d: "Elevated park Hudson views." }, afternoon: { t: "Chelsea Market lunch", d: "Food hall crawl." }, evening: { t: "Broadway / Times Sq.", d: "Show or lights walk." } },
      { region: "Central Park", morning: { t: "Bethesda Terrace", d: "Lake and Bow Bridge loop." }, afternoon: { t: "The Met", d: "Rooftop when open." }, evening: { t: "Upper West dinner", d: "Neighborhood bistro." } },
      { region: "Brooklyn", morning: { t: "Brooklyn Bridge", d: "DUMBO sunrise photos." }, afternoon: { t: "Williamsburg", d: "Coffee and street art." }, evening: { t: "Bridge Park sunset", d: "Carousel and pier pizza." } },
      { region: "Greenwich Village", morning: { t: "Washington Square", d: "Arch and street music." }, afternoon: { t: "West Village walk", d: "Townhouses and hidden courts." }, evening: { t: "Village jazz club", d: "Book small-room sets ahead." } },
    ],
  },
};

/* Generic fallback when city is not in destinationsDb */
const genericFallback = {
  country: "Your destination",
  language: "Local",
  veganHard: false,
  phrases: [
    { en: "Hello", local: "[Local script]", phonetic: "Use a translation app" },
    { en: "Thank you", local: "[Local script]", phonetic: "High-priority phrase" },
    { en: "Where is…?", local: "[Local script]", phonetic: "Point at map" },
    { en: "I cannot eat meat or fish.", local: "[Write clearly]", phonetic: "Show card to waiter.", dining: true },
  ],
  cuisines: {
    all: [{ name: "Central market", desc: "Sample regional produce and street food." }],
    vegetarian: [{ name: "Vegetarian café", desc: "Search near your stay — ask for today's plate." }],
    vegan: [{ name: "Plant-based spot", desc: "Use maps; confirm no hidden animal stock." }],
  },
  itineraryPool: [
    { region: "Historic center", morning: { t: "Old town walk", d: "Main squares and landmarks." }, afternoon: { t: "Local museum", d: "Cultural context." }, evening: { t: "Plaza dinner", d: "Regional cuisine hub." } },
    { region: "Arts district", morning: { t: "Public market", d: "Morning produce and crafts." }, afternoon: { t: "Gallery or show", d: "Check local listings." }, evening: { t: "Live performance", d: "Theater or music venue." } },
    { region: "Waterfront", morning: { t: "Coastal path", d: "Easy walk with photo stops." }, afternoon: { t: "Park or boat", d: "Open-air break." }, evening: { t: "Sunset viewpoint", d: "Scenic overlook." } },
    { region: "Neighborhood", morning: { t: "Residential stroll", d: "Daily life away from tourists." }, afternoon: { t: "Food tour / class", d: "Hands-on local flavors." }, evening: { t: "Local tavern", d: "Where residents gather." } },
    { region: "Day excursion", morning: { t: "Nearby town", d: "Half-day trip out." }, afternoon: { t: "Scenic return", d: "Viewpoints en route." }, evening: { t: "Rest & journal", d: "Plan tomorrow's pace." } },
  ],
};

/* City name aliases → destinationsDb keys */
const CITY_ALIASES = { tokyo: "tokyo", paris: "paris", "new york": "newyork", nyc: "newyork", "new york city": "newyork" };

/* ── Step 2: Central app state + localStorage sync ── */
const DEFAULT_STATE = {
  isAuthenticated: false,
  theme: "light",
  user: { name: "Wanderer", email: "", homeCountry: "", dietaryRestriction: "none", healthNotes: "" },
  trip: null,
  savedTrips: [],
  dietFilter: "all",
};

let appState = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const p = JSON.parse(raw);
    return { ...structuredClone(DEFAULT_STATE), ...p, user: { ...DEFAULT_STATE.user, ...p.user } };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

/* ── DOM cache ── */
const $ = {
  landing: document.getElementById("landing"),
  app: document.getElementById("app"),
  authForm: document.getElementById("auth-form"),
  tripForm: document.getElementById("trip-form"),
  profileForm: document.getElementById("profile-form"),
  destination: document.getElementById("destination"),
  duration: document.getElementById("duration"),
  dashGreet: document.getElementById("dashboard-greeting"),
  navGreet: document.getElementById("sidebar-greeting"),
  savedList: document.getElementById("saved-trips-list"),
  tripSummary: document.getElementById("current-trip-summary"),
  tripContent: document.getElementById("current-trip-content"),
  timeline: document.getElementById("itinerary-timeline"),
  itinSub: document.getElementById("itinerary-subtitle"),
  eaterSub: document.getElementById("eater-subtitle"),
  sosBox: document.getElementById("sos-phrases"),
  foodGrid: document.getElementById("culinary-grid"),
  lingoBox: document.getElementById("lingo-categories"),
  lingoSub: document.getElementById("lingo-subtitle"),
  profName: document.getElementById("profile-name"),
  profCountry: document.getElementById("profile-country"),
  profDiet: document.getElementById("profile-diet"),
  profHealth: document.getElementById("profile-health"),
  profMsg: document.getElementById("profile-save-msg"),
  toast: document.getElementById("toast"),
  navTabs: document.querySelectorAll(".nav-tab"),
  panels: document.querySelectorAll(".tab-panel"),
  dietChips: document.querySelectorAll("[data-diet-filter]"),
};

/* ── Utilities ── */
const esc = (s) => { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; };

function toast(msg) {
  $.toast.textContent = msg;
  $.toast.classList.remove("hidden");
  $.toast.classList.add("show");
  setTimeout(() => { $.toast.classList.remove("show"); setTimeout(() => $.toast.classList.add("hidden"), 300); }, 2500);
}

function setErr(id, msg) {
  const el = document.querySelector(`.field-error[data-for="${id}"]`);
  const input = document.getElementById(id);
  if (el) el.textContent = msg || "";
  input?.closest(".field")?.classList.toggle("invalid", !!msg);
}

function resolveCity(input) {
  const n = (input || "").trim().toLowerCase();
  if (CITY_ALIASES[n]) return CITY_ALIASES[n];
  if (n.includes("tokyo")) return "tokyo";
  if (n.includes("paris")) return "paris";
  if (n.includes("new york") || n === "nyc") return "newyork";
  return null;
}

function getDestData(destInput) {
  const key = resolveCity(destInput);
  return key ? { key, data: destinationsDb[key] } : { key: null, data: genericFallback };
}

/** Profile diet → cuisine bucket key (none/all → all) */
function dietKey() {
  const p = appState.user.dietaryRestriction;
  if (p === "vegetarian" || p === "vegan") return p;
  if (p === "allergies") return "all";
  return appState.dietFilter === "all" ? "all" : appState.dietFilter;
}

/* ── Tab switching router + auth shell ── */
function switchTab(id) {
  $.navTabs.forEach((b) => {
    const on = b.dataset.tab === id;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", on);
  });
  $.panels.forEach((p) => {
    const on = p.dataset.panel === id;
    p.classList.toggle("view-active", on);
    p.hidden = !on;
  });
}

function showLanding() {
  $.landing.classList.remove("hidden");
  $.app.classList.add("hidden");
  $.app.setAttribute("aria-hidden", "true");
}

function showApp() {
  $.landing.classList.add("hidden");
  $.app.classList.remove("hidden");
  $.app.classList.add("fade-enter");
  $.app.setAttribute("aria-hidden", "false");
  renderAll();
}

function greet() {
  const first = (appState.user.name || "Wanderer").split(" ")[0];
  $.dashGreet.textContent = `Good day, ${first}`;
  $.navGreet.textContent = first;
}

/* ── Dynamic itinerary engine ── */
function buildDays(data, days, label) {
  const pool = data.itineraryPool;
  const count = Math.min(Math.max(days, 1), 30);
  let html = "";
  for (let i = 0; i < count; i++) {
    const day = pool[i % pool.length];
    const slot = (s) => `<div class="time-block${s.evening ? " evening" : ""}"><div class="time-label">${s.label}</div><h4>${esc(s.t)}</h4><p>${esc(s.d)}</p></div>`;
    html += `<article class="day-card"><div class="day-card-inner"><span class="day-badge">Day ${i + 1}</span>
      <h3 class="day-region">${esc(day.region)} — ${esc(label)}</h3><div class="time-blocks">
      ${slot({ label: "Morning", ...day.morning })}
      ${slot({ label: "Afternoon", ...day.afternoon })}
      ${slot({ label: "Evening", evening: true, ...day.evening })}
      </div></div></article>`;
  }
  return html;
}

function renderItinerary() {
  if (!appState.trip) {
    $.itinSub.textContent = "Set a destination on the Dashboard first.";
    $.timeline.innerHTML = '<p class="empty-state">No active trip — plan one from the Dashboard.</p>';
    return;
  }
  const { destination, duration } = appState.trip;
  const { data } = getDestData(destination);
  $.itinSub.textContent = `${duration}-day trail through ${destination}`;
  $.timeline.innerHTML = buildDays(data, duration, destination);
}

/* ── Conscious Eater: profile diet filter + SOS card ── */
function renderEater() {
  $.dietChips.forEach((c) => c.classList.toggle("active", c.dataset.dietFilter === appState.dietFilter));

  if (!appState.trip) {
    $.eaterSub.textContent = "Pick a destination on the Dashboard.";
    $.foodGrid.innerHTML = '<p class="empty-state">No destination selected.</p>';
    $.sosBox.innerHTML = "";
    return;
  }

  const { destination } = appState.trip;
  const { data } = getDestData(destination);
  const key = dietKey();
  const items = data.cuisines[key] || data.cuisines.all;
  $.eaterSub.textContent = `Eating in ${destination} — showing ${key} options for your nest`;

  const dining = data.phrases.filter((p) => p.dining);
  $.sosBox.innerHTML = dining.length
    ? dining.map((p) => `<div class="sos-phrase"><div class="local">${esc(p.local)}</div><div class="romanized">${esc(p.phonetic)}</div><div class="english">${esc(p.en)}</div></div>`).join("")
    : '<p class="empty-state">No SOS phrases for this destination.</p>';

  let extra = "";
  if (key === "vegan" && data.veganHard) {
    extra = `<article class="card sos-card"><h2>Vegan traveler note</h2><p>${esc(destination)} can be challenging for vegans — fish stock (dashi) hides in many dishes. Show the SOS card above and ask about broth ingredients.</p></article>`;
  }

  $.foodGrid.innerHTML = extra + (items.length
    ? items.map((c) => `<article class="culinary-card"><header class="culinary-card-header"><h3>${esc(c.name)}</h3></header><div class="culinary-card-body"><p>${esc(c.desc)}</p></div></article>`).join("")
    : '<p class="empty-state">No matches — try updating your profile diet.</p>');
}

/* ── Lingo Nest: phrase grid ── */
function renderLingo() {
  if (!appState.trip) {
    $.lingoSub.textContent = "Phrases unlock with a destination.";
    $.lingoBox.innerHTML = '<p class="empty-state">Plan a trip on the Dashboard.</p>';
    return;
  }
  const { destination } = appState.trip;
  const { data } = getDestData(destination);
  $.lingoSub.textContent = `${data.language} survival phrases — ${destination}`;
  $.lingoBox.innerHTML = `<section class="lingo-category"><h2>Essential phrases</h2><div class="phrase-grid">${data.phrases.map((p) =>
    `<article class="phrase-card"><span class="phrase-english">${esc(p.en)}</span><span class="phrase-local">${esc(p.local)}</span><span class="phrase-phonetic">${esc(p.phonetic)}</span><button type="button" class="play-audio-btn" aria-label="Play">▶</button></article>`
  ).join("")}</div></section>`;
  $.lingoBox.querySelectorAll(".play-audio-btn").forEach((b) => b.addEventListener("click", () => toast("Mock audio — read phonetic guide above.")));
}

/* ── Dashboard + trip form ── */
function renderDashboard() {
  greet();
  if (appState.trip) {
    const { destination, duration } = appState.trip;
    const { data } = getDestData(destination);
    $.tripSummary.classList.remove("hidden");
    $.tripContent.innerHTML = `<div class="summary-row"><div class="summary-stat"><span>Destination</span><strong>${esc(destination)}</strong></div>
      <div class="summary-stat"><span>Days</span><strong>${duration}</strong></div>
      <div class="summary-stat"><span>Language</span><strong>${esc(data.language)}</strong></div></div>`;
    $.destination.value = destination;
    $.duration.value = duration;
  } else $.tripSummary.classList.add("hidden");

  if (!appState.savedTrips.length) {
    $.savedList.innerHTML = '<p class="empty-state">No trips yet — generate your first nest above.</p>';
    return;
  }
  $.savedList.innerHTML = appState.savedTrips.map((t) =>
    `<div class="trip-chip"><div><strong>${esc(t.destination)}</strong><div class="trip-chip-meta">${t.duration} days</div></div>
    <div class="trip-chip-actions"><button type="button" data-load="${t.id}">Open</button><button type="button" data-del="${t.id}">Remove</button></div></div>`
  ).join("");
  $.savedList.querySelectorAll("[data-load]").forEach((b) => b.onclick = () => loadTrip(b.dataset.load));
  $.savedList.querySelectorAll("[data-del]").forEach((b) => b.onclick = () => delTrip(b.dataset.del));
}

function loadTrip(id) {
  const t = appState.savedTrips.find((x) => x.id === id);
  if (!t) return;
  appState.trip = { ...t };
  saveState();
  renderAll();
  toast(`Loaded ${t.destination}`);
}

function delTrip(id) {
  appState.savedTrips = appState.savedTrips.filter((x) => x.id !== id);
  if (appState.trip?.id === id) appState.trip = appState.savedTrips[0] || null;
  saveState();
  renderAll();
}

function onTripSubmit(e) {
  e.preventDefault();
  const dest = $.destination.value.trim();
  const days = parseInt($.duration.value, 10);
  setErr("destination", !dest ? "Destination required." : "");
  setErr("duration", !days || days < 1 ? "Enter at least 1 day." : days > 30 ? "Max 30 days." : "");
  if (!dest || !days || days < 1 || days > 30) return;

  const trip = { id: `t${Date.now()}`, destination: dest, duration: days };
  appState.trip = trip;
  if (!appState.savedTrips.some((x) => x.destination === dest && x.duration === days)) {
    appState.savedTrips.unshift(trip);
    if (appState.savedTrips.length > 10) appState.savedTrips.length = 10;
  }
  saveState();
  renderAll();
  switchTab("itinerary");
  toast(`Nest ready for ${dest}!`);
}

/* ── Profile form handler ── */
function fillProfile() {
  const u = appState.user;
  $.profName.value = u.name;
  $.profCountry.value = u.homeCountry || "";
  $.profDiet.value = u.dietaryRestriction;
  $.profHealth.value = u.healthNotes || "";
}

function onProfileSubmit(e) {
  e.preventDefault();
  const name = $.profName.value.trim();
  setErr("profile-name", !name ? "Name required." : "");
  if (!name) return;
  appState.user = { ...appState.user, name, homeCountry: $.profCountry.value.trim(), dietaryRestriction: $.profDiet.value, healthNotes: $.profHealth.value.trim() };
  saveState();
  renderAll();
  $.profMsg.classList.remove("hidden");
  setTimeout(() => $.profMsg.classList.add("hidden"), 3000);
  toast("Profile saved.");
}

function renderAll() {
  renderDashboard();
  renderItinerary();
  renderEater();
  renderLingo();
  fillProfile();
}

/* ── Theme + event bindings ── */
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  appState.theme = t;
  saveState();
}

function bindEvents() {
  $.authForm.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("auth-name").value.trim();
    const email = document.getElementById("auth-email").value.trim();
    setErr("auth-name", !name ? "Enter your name." : "");
    setErr("auth-email", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Valid email required." : "");
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    appState.isAuthenticated = true;
    appState.user.name = name;
    appState.user.email = email;
    saveState();
    showApp();
    toast(`Welcome, ${name.split(" ")[0]}!`);
  };

  $.tripForm.onsubmit = onTripSubmit;
  $.profileForm.onsubmit = onProfileSubmit;
  document.getElementById("logout-btn").onclick = () => { appState.isAuthenticated = false; saveState(); showLanding(); };
  $.navTabs.forEach((b) => b.onclick = () => switchTab(b.dataset.tab));
  $.dietChips.forEach((c) => c.onclick = () => { appState.dietFilter = c.dataset.dietFilter; saveState(); renderEater(); });
  document.querySelectorAll(".theme-toggle").forEach((b) => b.onclick = () => applyTheme(appState.theme === "dark" ? "light" : "dark"));
}

/* ── Boot ── */
function init() {
  applyTheme(appState.theme);
  bindEvents();
  appState.isAuthenticated ? showApp() : showLanding();
}

init();
