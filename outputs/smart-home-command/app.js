const STORAGE_KEY = "house-command-state-v1";
const HA_TOKEN_KEY = "house-command-ha-token-v1";
const TADO_TOKEN_KEY = "house-command-tado-token-v1";
const TADO_AUTH_KEY = "house-command-tado-auth-v1";
const GOOGLE_CALENDAR_URL_KEY = "house-command-google-calendar-url-v1";

const MODES = [
  { id: "home", label: "Home" },
  { id: "away", label: "Away" },
  { id: "sleep", label: "Sleep" }
];

const DEFAULT_DEVICES = [
  { id: "living-main-light", name: "Main Lights", room: "Living Room", type: "light", icon: "lightbulb", on: true, level: 68, source: "local" },
  { id: "living-media", name: "Media System", room: "Living Room", type: "media", icon: "media", on: false, source: "local" },
  { id: "kitchen-worktop", name: "Worktop Lights", room: "Kitchen", type: "light", icon: "lightbulb", on: true, level: 76, source: "local" },
  { id: "kitchen-plug", name: "Coffee Plug", room: "Kitchen", type: "switch", icon: "plug", on: false, power: 0, source: "local" },
  { id: "bedroom-lamp", name: "Bedside Lamp", room: "Bedroom", type: "light", icon: "lightbulb", on: false, level: 22, source: "local" },
  { id: "bedroom-blinds", name: "Bedroom Blinds", room: "Bedroom", type: "cover", icon: "blinds", open: 60, source: "local" },
  { id: "hall-lock", name: "Front Door", room: "Hall", type: "lock", icon: "lock", locked: true, source: "local" },
  { id: "hall-light", name: "Hall Light", room: "Hall", type: "light", icon: "lightbulb", on: true, level: 44, source: "local" },
  { id: "whole-home-climate", name: "Heating", room: "Whole Home", type: "climate", icon: "thermometer", current: 19.2, target: 20.5, mode: "heat", source: "local" },
  { id: "arthurs-room-climate", name: "Arthur's Room Heating", room: "Arthur's Room", type: "climate", icon: "thermometer", current: 18.8, target: 19.5, mode: "heat", source: "local" },
  { id: "security-panel", name: "Security", room: "Whole Home", type: "security", icon: "shield", armed: false, source: "local" },
  { id: "study-desk", name: "Desk Power", room: "Study", type: "switch", icon: "zap", on: true, power: 42, source: "local" },
  { id: "porch-light", name: "Porch Light", room: "Outside", type: "light", icon: "lightbulb", on: false, level: 34, source: "local" }
];

const DEFAULT_AUTOMATIONS = [
  {
    id: "weather-rain",
    name: "Rain Guard",
    source: "Weather",
    trigger: "Precipitation above 60%",
    action: "Lower covers and turn on entry lighting",
    active: true
  },
  {
    id: "weather-heat",
    name: "Heat Shield",
    source: "Weather",
    trigger: "Temperature above 24 deg C",
    action: "Lower blinds and ease the heating target",
    active: true
  },
  {
    id: "calendar-heating",
    name: "Calendar Heating",
    source: "Google Calendar",
    trigger: "Upcoming activity changes room needs",
    action: "Set heating targets for away, guests, sleep, and home time",
    active: true
  },
  {
    id: "diary-away",
    name: "Away From Diary",
    source: "Diary",
    trigger: "Away, travel, or work item starts soon",
    action: "Lock up, arm sensors, reduce heating",
    active: true
  },
  {
    id: "diary-guest",
    name: "Guest Arrival",
    source: "Diary",
    trigger: "Guest item starts soon",
    action: "Light hall, living room, and porch",
    active: true
  },
  {
    id: "diary-sleep",
    name: "Quiet Night",
    source: "Diary",
    trigger: "Sleep item or late evening",
    action: "Dim lights, lock doors, set night climate",
    active: true
  },
  {
    id: "energy-idle",
    name: "Idle Power",
    source: "Devices",
    trigger: "Nonessential plug left on",
    action: "Switch off idle plugs and media",
    active: true
  }
];

const WEATHER_CODE = {
  0: ["Clear", "sun"],
  1: ["Mainly clear", "sun"],
  2: ["Partly cloudy", "cloud"],
  3: ["Cloudy", "cloud"],
  45: ["Fog", "cloud"],
  48: ["Fog", "cloud"],
  51: ["Light drizzle", "rain"],
  53: ["Drizzle", "rain"],
  55: ["Heavy drizzle", "rain"],
  61: ["Light rain", "rain"],
  63: ["Rain", "rain"],
  65: ["Heavy rain", "rain"],
  71: ["Light snow", "cloud"],
  73: ["Snow", "cloud"],
  75: ["Heavy snow", "cloud"],
  80: ["Rain showers", "rain"],
  81: ["Rain showers", "rain"],
  82: ["Heavy showers", "rain"],
  95: ["Thunderstorm", "zap"]
};

const ICONS = {
  home: '<path d="m3 10 9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  layout: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  sliders: '<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M2 14h4"/><path d="M10 8h4"/><path d="M18 16h4"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  spark: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  settings: '<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.6 19a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 5 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.4 5a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.17.38.39.72.6 1 .3.28.7.4 1.1.4h.09a2 2 0 1 1 0 4h-.09c-.4 0-.8.12-1.1.4-.21.28-.43.62-.6 1z"/>',
  camera: '<path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3h5z"/><circle cx="12" cy="13" r="3"/>',
  refresh: '<path d="M21 12a9 9 0 0 1-15.5 6.2"/><path d="M3 12A9 9 0 0 1 18.5 5.8"/><path d="M18 2v4h4"/><path d="M6 22v-4H2"/>',
  download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  upload: '<path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M5 3h14"/>',
  mapPin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/>',
  media: '<rect width="18" height="14" x="3" y="5" rx="2"/><path d="m10 9 5 3-5 3V9z"/>',
  lightbulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M8 14a6 6 0 1 1 8 0c-.6.55-1 1.25-1 2H9c0-.75-.4-1.45-1-2z"/>',
  plug: '<path d="M12 22v-5"/><path d="M9 7V2"/><path d="M15 7V2"/><path d="M7 7h10v5a5 5 0 0 1-10 0V7z"/>',
  zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  lock: '<rect width="16" height="10" x="4" y="12" rx="2"/><path d="M8 12V8a4 4 0 0 1 8 0v4"/>',
  unlock: '<rect width="16" height="10" x="4" y="12" rx="2"/><path d="M8 12V8a4 4 0 0 1 7.4-2.3"/>',
  thermometer: '<path d="M14 14.8V5a4 4 0 0 0-8 0v9.8a6 6 0 1 0 8 0z"/><path d="M10 9v8"/>',
  blinds: '<path d="M4 4h16"/><path d="M6 8h12"/><path d="M6 12h12"/><path d="M6 16h12"/><path d="M8 20h8"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  cloud: '<path d="M17.5 19H8a5 5 0 1 1 1.6-9.74A7 7 0 0 1 22 13a4 4 0 0 1-4.5 6z"/>',
  rain: '<path d="M17.5 18H8a5 5 0 1 1 1.6-9.74A7 7 0 0 1 22 12a4 4 0 0 1-4.5 6z"/><path d="M8 20v2"/><path d="M12 19v3"/><path d="M16 20v2"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/>',
  check: '<path d="m20 6-11 11-5-5"/>'
};

const defaultState = () => ({
  mode: "home",
  selectedRoom: "All",
  activeView: "overview",
  devices: clone(DEFAULT_DEVICES),
  events: [],
  automations: clone(DEFAULT_AUTOMATIONS),
  weather: {
    query: "",
    place: "",
    lat: null,
    lon: null,
    current: null,
    daily: null,
    updatedAt: null
  },
  integrations: {
    haBaseUrl: "",
    rememberToken: false,
    haToken: "",
    tado: blankTadoIntegration(),
    googleCalendar: blankGoogleCalendarIntegration()
  }
});

function blankTadoIntegration() {
  return {
    rememberToken: false,
    tokens: {},
    deviceFlow: null,
    userId: "",
    homeId: "",
    homeName: "",
    rateLimit: "",
    updatedAt: null
  };
}

function blankGoogleCalendarIntegration() {
  return {
    rememberUrl: false,
    url: "",
    updatedAt: null,
    eventCount: 0
  };
}

let state = loadState();

document.addEventListener("DOMContentLoaded", () => {
  hydrateStaticIcons();
  wireEvents();
  setDefaultEventDate();
  renderAll();
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function svg(name, size = 20) {
  const key = name === "map-pin" ? "mapPin" : name;
  const paths = ICONS[key] || ICONS.home;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

function hydrateStaticIcons() {
  document.querySelectorAll("[data-icon]").forEach((node) => {
    node.innerHTML = svg(node.dataset.icon, 20);
  });
}

function loadState() {
  const fresh = defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fresh;
    const saved = JSON.parse(raw);
    const merged = {
      ...fresh,
      ...saved,
      weather: { ...fresh.weather, ...(saved.weather || {}) },
      integrations: {
        ...fresh.integrations,
        ...(saved.integrations || {}),
        tado: {
          ...fresh.integrations.tado,
          ...((saved.integrations || {}).tado || {})
        },
        googleCalendar: {
          ...fresh.integrations.googleCalendar,
          ...((saved.integrations || {}).googleCalendar || {})
        }
      }
    };
    merged.devices = mergeDevices(saved.devices, fresh.devices);
    merged.events = Array.isArray(saved.events) ? saved.events : [];
    merged.automations = mergeAutomations(saved.automations);
    merged.integrations.haToken = merged.integrations.rememberToken
      ? localStorage.getItem(HA_TOKEN_KEY) || ""
      : sessionStorage.getItem(HA_TOKEN_KEY) || "";
    merged.integrations.tado.tokens = readStoredJson(
      merged.integrations.tado.rememberToken ? localStorage : sessionStorage,
      TADO_TOKEN_KEY
    ) || {};
    merged.integrations.tado.deviceFlow = readStoredJson(sessionStorage, TADO_AUTH_KEY) || null;
    merged.integrations.googleCalendar.url = (
      merged.integrations.googleCalendar.rememberUrl
        ? localStorage.getItem(GOOGLE_CALENDAR_URL_KEY)
        : sessionStorage.getItem(GOOGLE_CALENDAR_URL_KEY)
    ) || "";
    return merged;
  } catch (error) {
    console.warn("State load failed", error);
    return fresh;
  }
}

function mergeDevices(savedDevices, fallbackDevices) {
  if (!Array.isArray(savedDevices) || !savedDevices.length) return fallbackDevices;
  const savedById = new Map(savedDevices.map((device) => [device.id, device]));
  const defaults = fallbackDevices.map((device) => ({ ...device, ...(savedById.get(device.id) || {}) }));
  const defaultIds = new Set(fallbackDevices.map((device) => device.id));
  const custom = savedDevices.filter((device) => !defaultIds.has(device.id));
  return defaults.concat(custom);
}

function mergeAutomations(savedAutomations) {
  const saved = Array.isArray(savedAutomations) ? savedAutomations : [];
  return DEFAULT_AUTOMATIONS.map((automation) => {
    const match = saved.find((item) => item.id === automation.id);
    return match ? { ...automation, active: Boolean(match.active) } : clone(automation);
  });
}

function persistState() {
  try {
    if (state.integrations.rememberToken && state.integrations.haToken) {
      localStorage.setItem(HA_TOKEN_KEY, state.integrations.haToken);
      sessionStorage.removeItem(HA_TOKEN_KEY);
    } else {
      localStorage.removeItem(HA_TOKEN_KEY);
      if (state.integrations.haToken) {
        sessionStorage.setItem(HA_TOKEN_KEY, state.integrations.haToken);
      }
    }
    const tado = state.integrations.tado || blankTadoIntegration();
    if (tado.rememberToken && tado.tokens?.refreshToken) {
      localStorage.setItem(TADO_TOKEN_KEY, JSON.stringify(tado.tokens));
      sessionStorage.removeItem(TADO_TOKEN_KEY);
    } else {
      localStorage.removeItem(TADO_TOKEN_KEY);
      if (tado.tokens?.refreshToken) {
        sessionStorage.setItem(TADO_TOKEN_KEY, JSON.stringify(tado.tokens));
      } else {
        sessionStorage.removeItem(TADO_TOKEN_KEY);
      }
    }
    if (tado.deviceFlow) {
      sessionStorage.setItem(TADO_AUTH_KEY, JSON.stringify(tado.deviceFlow));
    } else {
      sessionStorage.removeItem(TADO_AUTH_KEY);
    }
    const googleCalendar = state.integrations.googleCalendar || blankGoogleCalendarIntegration();
    if (googleCalendar.rememberUrl && googleCalendar.url) {
      localStorage.setItem(GOOGLE_CALENDAR_URL_KEY, googleCalendar.url);
      sessionStorage.removeItem(GOOGLE_CALENDAR_URL_KEY);
    } else {
      localStorage.removeItem(GOOGLE_CALENDAR_URL_KEY);
      if (googleCalendar.url) {
        sessionStorage.setItem(GOOGLE_CALENDAR_URL_KEY, googleCalendar.url);
      } else {
        sessionStorage.removeItem(GOOGLE_CALENDAR_URL_KEY);
      }
    }
    const portable = clone(state);
    portable.integrations.haToken = "";
    if (portable.integrations.tado) {
      portable.integrations.tado.tokens = {};
      portable.integrations.tado.deviceFlow = null;
    }
    if (portable.integrations.googleCalendar) {
      portable.integrations.googleCalendar.url = "";
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portable));
  } catch (error) {
    console.warn("State save failed", error);
    toast("Could not save browser state", "error");
  }
}

function readStoredJson(store, key) {
  try {
    const raw = store.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function wireEvents() {
  document.querySelector(".nav-tabs").addEventListener("click", (event) => {
    const tab = event.target.closest("[data-view]");
    if (!tab) return;
    showView(tab.dataset.view);
  });

  document.querySelectorAll("[data-view-jump]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.viewJump));
  });

  document.getElementById("modeButtons").addEventListener("click", (event) => {
    const button = event.target.closest("[data-mode]");
    if (!button) return;
    setMode(button.dataset.mode);
  });

  document.querySelector(".quick-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-scene]");
    if (!button) return;
    applyScene(button.dataset.scene);
  });

  document.getElementById("roomFilters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-room]");
    if (!button) return;
    state.selectedRoom = button.dataset.room;
    persistState();
    renderAll();
  });

  document.getElementById("deviceGrid").addEventListener("click", handleDeviceClick);
  document.getElementById("deviceMatrix").addEventListener("click", handleDeviceClick);
  document.getElementById("heatingGrid").addEventListener("click", handleDeviceClick);
  document.getElementById("cameraGrid").addEventListener("click", handleDeviceClick);
  document.getElementById("deviceGrid").addEventListener("input", handleDeviceInput);
  document.getElementById("deviceMatrix").addEventListener("input", handleDeviceInput);
  document.getElementById("deviceGrid").addEventListener("change", handleDeviceChange);
  document.getElementById("deviceMatrix").addEventListener("change", handleDeviceChange);
  document.getElementById("syncHeatingButton").addEventListener("click", () => syncTado());
  document.getElementById("heatingPlan").addEventListener("click", (event) => {
    const button = event.target.closest("[data-apply-heating-plan]");
    if (!button) return;
    applyCalendarHeatingPlan();
  });
  document.getElementById("syncBlinkButton").addEventListener("click", () => syncBlink());

  document.getElementById("automationGrid").addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-toggle-automation]");
    const run = event.target.closest("[data-run-automation]");
    if (toggle) toggleAutomation(toggle.dataset.toggleAutomation);
    if (run) runAutomation(run.dataset.runAutomation);
  });

  document.getElementById("diaryRoutineList").addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-toggle-automation]");
    if (!toggle) return;
    toggleAutomation(toggle.dataset.toggleAutomation);
  });

  document.getElementById("insightList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-apply-insight]");
    if (!button) return;
    runAutomation(button.dataset.applyInsight);
  });

  document.getElementById("weatherForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = document.getElementById("weatherPlace").value.trim();
    if (!query) return;
    await fetchWeatherByQuery(query);
  });

  document.getElementById("locateButton").addEventListener("click", fetchWeatherByLocation);
  document.getElementById("refreshButton").addEventListener("click", refreshLiveData);
  document.getElementById("exportButton").addEventListener("click", exportAppData);
  document.getElementById("allOffButton").addEventListener("click", () => applyScene("all-off"));
  document.getElementById("secureButton").addEventListener("click", () => applyScene("secure"));

  document.getElementById("eventForm").addEventListener("submit", (event) => {
    event.preventDefault();
    addDiaryEvent();
  });

  document.getElementById("diaryList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-event]");
    if (!button) return;
    state.events = state.events.filter((item) => item.id !== button.dataset.deleteEvent);
    persistState();
    renderAll();
    toast("Diary item removed");
  });

  document.getElementById("importDiaryButton").addEventListener("click", () => {
    document.getElementById("icsInput").click();
  });
  document.getElementById("icsInput").addEventListener("change", importIcs);
  document.getElementById("exportDiaryButton").addEventListener("click", exportIcs);
  document.getElementById("syncGoogleDiaryButton").addEventListener("click", () => syncGoogleCalendar());

  document.getElementById("googleCalendarForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    state.integrations.googleCalendar.url = document.getElementById("googleCalendarUrl").value.trim();
    state.integrations.googleCalendar.rememberUrl = document.getElementById("rememberGoogleCalendarUrl").checked;
    persistState();
    await syncGoogleCalendar();
  });

  document.getElementById("rememberGoogleCalendarUrl").addEventListener("change", (event) => {
    state.integrations.googleCalendar.rememberUrl = event.target.checked;
    state.integrations.googleCalendar.url = document.getElementById("googleCalendarUrl").value.trim();
    persistState();
  });

  document.getElementById("clearGoogleCalendarButton").addEventListener("click", () => {
    state.integrations.googleCalendar = blankGoogleCalendarIntegration();
    state.events = state.events.filter((item) => item.source !== "google");
    localStorage.removeItem(GOOGLE_CALENDAR_URL_KEY);
    sessionStorage.removeItem(GOOGLE_CALENDAR_URL_KEY);
    persistState();
    renderAll();
    toast("Google Calendar link cleared");
  });

  document.getElementById("haForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    state.integrations.haBaseUrl = document.getElementById("haUrl").value.trim();
    state.integrations.haToken = document.getElementById("haToken").value.trim();
    state.integrations.rememberToken = document.getElementById("rememberToken").checked;
    persistState();
    await syncHomeAssistant();
  });

  document.getElementById("clearHaButton").addEventListener("click", () => {
    state.integrations.haBaseUrl = "";
    state.integrations.rememberToken = false;
    state.integrations.haToken = "";
    state.devices = state.devices.filter((device) => device.source !== "ha");
    localStorage.removeItem(HA_TOKEN_KEY);
    sessionStorage.removeItem(HA_TOKEN_KEY);
    persistState();
    renderAll();
    toast("Home Assistant settings cleared");
  });

  document.getElementById("rememberTadoToken").addEventListener("change", (event) => {
    state.integrations.tado.rememberToken = event.target.checked;
    persistState();
  });
  document.getElementById("startTadoButton").addEventListener("click", startTadoLink);
  document.getElementById("finishTadoButton").addEventListener("click", finishTadoLink);
  document.getElementById("syncTadoButton").addEventListener("click", () => syncTado());
  document.getElementById("clearTadoButton").addEventListener("click", clearTadoLink);
  document.getElementById("connectBlinkButton").addEventListener("click", () => syncBlink());
  document.getElementById("openHaBlinkButton").addEventListener("click", () => {
    showView("integrations");
    document.getElementById("haUrl").focus();
  });

  document.getElementById("resetDemoButton").addEventListener("click", () => {
    state.devices = clone(DEFAULT_DEVICES).concat(state.devices.filter((device) => device.source !== "local"));
    persistState();
    renderAll();
    toast("Local devices reset");
  });

  document.getElementById("clearAllButton").addEventListener("click", () => {
    if (!window.confirm("Clear all House Command data from this browser?")) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HA_TOKEN_KEY);
    localStorage.removeItem(TADO_TOKEN_KEY);
    localStorage.removeItem(GOOGLE_CALENDAR_URL_KEY);
    sessionStorage.removeItem(HA_TOKEN_KEY);
    sessionStorage.removeItem(TADO_TOKEN_KEY);
    sessionStorage.removeItem(TADO_AUTH_KEY);
    sessionStorage.removeItem(GOOGLE_CALENDAR_URL_KEY);
    state = defaultState();
    setDefaultEventDate();
    renderAll();
    toast("App data cleared");
  });
}

function renderAll() {
  renderShell();
  renderModeButtons();
  renderWeather();
  renderDiary();
  renderInsights();
  renderHeating();
  renderCameras();
  renderRooms();
  renderDevices();
  renderAutomations();
  renderIntegrations();
  showView(state.activeView || "overview", false);
}

function renderShell() {
  const now = new Date();
  document.getElementById("dateLabel").textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(now);

  const modeMeta = MODES.find((mode) => mode.id === state.mode) || MODES[0];
  document.getElementById("modeLabel").textContent = modeMeta.label;
  const statusDot = document.getElementById("statusDot");
  statusDot.className = `status-dot ${state.mode}`;

  const activeCount = state.devices.filter((device) => device.on || device.armed).length;
  const unlockedCount = state.devices.filter((device) => device.type === "lock" && !device.locked).length;
  const haCount = state.devices.filter((device) => device.source === "ha").length;
  const blinkCount = getBlinkDevices().length;
  document.getElementById("statusSummary").textContent = `${activeCount} active, ${unlockedCount} unlocked`;
  document.getElementById("connectionLabel").textContent = haCount || blinkCount ? `${haCount + blinkCount} hub entities` : "Local controls";

  const nextEvent = getUpcomingEvents()[0];
  document.getElementById("nextEventSummary").textContent = nextEvent
    ? `${nextEvent.title} at ${formatEventTime(nextEvent)}`
    : "No upcoming diary items";
}

function renderModeButtons() {
  document.getElementById("modeButtons").innerHTML = MODES.map((mode) => `
    <button class="segment-button ${state.mode === mode.id ? "is-active" : ""}" data-mode="${mode.id}" type="button">${mode.label}</button>
  `).join("");
}

function renderWeather() {
  document.getElementById("weatherPlace").value = state.weather.query || state.weather.place || "";
  const container = document.getElementById("weatherContent");
  if (!state.weather.current) {
    container.innerHTML = '<div class="empty-state">Set a place for local weather.</div>';
    return;
  }

  const current = state.weather.current;
  const daily = state.weather.daily || {};
  const code = weatherMeta(current.weather_code);
  const updated = state.weather.updatedAt ? new Date(state.weather.updatedAt) : null;
  const updatedText = updated ? new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(updated) : "Now";

  container.innerHTML = `
    <div class="weather-now">
      <div class="weather-icon">${svg(code.icon, 28)}</div>
      <div>
        <div class="weather-temp">${round(current.temperature_2m)}&deg;C</div>
        <strong>${escapeHtml(code.label)}</strong>
        <small>${escapeHtml(state.weather.place || state.weather.query || "Local")} - updated ${updatedText}</small>
      </div>
    </div>
    <div class="weather-stat-grid">
      <div class="stat"><small>Feels</small><strong>${round(current.apparent_temperature)}&deg;C</strong></div>
      <div class="stat"><small>Rain</small><strong>${daily.precipitation_probability_max ?? 0}%</strong></div>
      <div class="stat"><small>Wind</small><strong>${round(current.wind_speed_10m)} km/h</strong></div>
    </div>
  `;
}

function renderDiary() {
  const upcoming = getUpcomingEvents();
  const mini = document.getElementById("miniDiary");
  mini.innerHTML = upcoming.slice(0, 4).map((event) => miniEventHtml(event)).join("") || '<div class="empty-state">No upcoming diary items.</div>';

  const list = document.getElementById("diaryList");
  list.innerHTML = upcoming.concat(getPastEvents().slice(0, 6)).map((event) => diaryItemHtml(event)).join("") || '<div class="empty-state">Your diary is empty.</div>';

  document.getElementById("diaryRoutineList").innerHTML = [
    ["Away items", "Runs Away mode near travel, work, or away entries.", "diary-away"],
    ["Guest items", "Lights shared areas before guests arrive.", "diary-guest"],
    ["Sleep items", "Locks up and dims the home for the night.", "diary-sleep"]
  ].map(([title, detail, id]) => {
    const automation = state.automations.find((item) => item.id === id);
    return `
      <div class="routine-item">
        <div>
          <strong>${title}</strong>
          <small>${detail}</small>
        </div>
        <button class="toggle-switch ${automation?.active ? "is-on" : ""}" data-toggle-automation="${id}" type="button" aria-label="Toggle ${title}"></button>
      </div>
    `;
  }).join("");
}

function miniEventHtml(event) {
  return `
    <div class="mini-item">
      <div>
        <strong>${escapeHtml(event.title)}</strong>
        <small>${formatEventDate(event)} at ${formatEventTime(event)}</small>
      </div>
      <span class="type-pill ${event.type}">${escapeHtml(event.type)}</span>
    </div>
  `;
}

function diaryItemHtml(event) {
  return `
    <div class="diary-item">
      <div>
        <strong>${escapeHtml(event.title)}</strong>
        <small>${formatEventDate(event)} at ${formatEventTime(event)}</small>
      </div>
      <div class="inline-buttons">
        <span class="type-pill ${event.type}">${escapeHtml(event.type)}</span>
        <button class="icon-button" data-delete-event="${event.id}" type="button" title="Delete" aria-label="Delete ${escapeHtml(event.title)}">
          ${svg("trash", 18)}
        </button>
      </div>
    </div>
  `;
}

function renderInsights() {
  const insights = buildInsights();
  document.getElementById("insightCount").textContent = String(insights.length);
  document.getElementById("insightList").innerHTML = insights.map((item) => `
    <div class="insight-item">
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.detail)}</small>
      </div>
      <button class="icon-button" data-apply-insight="${item.automationId}" type="button" title="Apply" aria-label="Apply ${escapeHtml(item.title)}">
        ${svg("check", 18)}
      </button>
    </div>
  `).join("") || '<div class="empty-state">No suggested changes right now.</div>';
}

function renderHeating() {
  renderHeatingPlan();
  const climates = getHeatingDevices();
  document.getElementById("heatingGrid").innerHTML = climates.map(heatingCardHtml).join("") || '<div class="empty-state">No heating zones found.</div>';
}

function renderHeatingPlan() {
  const plan = buildCalendarHeatingPlan();
  const container = document.getElementById("heatingPlan");
  if (!plan.targets.length) {
    container.innerHTML = '<div class="empty-state">Calendar heating plan will appear after diary or Google Calendar events are available.</div>';
    return;
  }
  container.innerHTML = `
    <div class="plan-strip">
      <div>
        <strong>${escapeHtml(plan.title)}</strong>
        <small>${escapeHtml(plan.detail)}</small>
        <div class="plan-targets">
          ${plan.targets.slice(0, 5).map((target) => `<span class="panel-badge">${escapeHtml(target.label)} ${target.target.toFixed(1)}&deg;C</span>`).join("")}
        </div>
      </div>
      <button class="primary-button" data-apply-heating-plan type="button">
        ${svg("check", 18)}
        <span>Apply Plan</span>
      </button>
    </div>
  `;
}

function renderCameras() {
  const cameras = getBlinkCameras();
  document.getElementById("cameraGrid").innerHTML = cameras.map(cameraCardHtml).join("") || '<div class="empty-state">No Blink cameras synced yet.</div>';
}

function getBlinkCameras() {
  return state.devices
    .filter((device) => device.type === "camera" && device.integration === "blink")
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getBlinkDevices() {
  return state.devices.filter((device) => device.integration === "blink" || device.source === "blink");
}

function cameraCardHtml(device) {
  const preview = cameraPreviewUrl(device);
  const motion = blinkRelatedDevice(device, "motion");
  const motionSwitch = blinkRelatedDevice(device, "motion_switch");
  const armed = motionSwitch ? (motionSwitch.on ? "Motion on" : "Motion off") : device.rawState || "Ready";
  return `
    <article class="camera-card" data-type="camera">
      <div class="device-head">
        <div>
          <h3 class="device-name">${escapeHtml(device.name)}</h3>
          <small>Blink - ${escapeHtml(armed)}</small>
        </div>
        <div class="device-icon">${svg("camera", 20)}</div>
      </div>
      <div class="camera-preview">
        ${preview ? `<img src="${escapeAttr(preview)}" alt="${escapeAttr(device.name)} preview">` : svg("camera", 34)}
      </div>
      <div class="camera-meta">
        <span class="panel-badge">${motion?.on ? "Motion" : "Clear"}</span>
        ${device.updatedAt ? `<span class="panel-badge">${escapeHtml(device.updatedAt)}</span>` : ""}
      </div>
      <div class="inline-buttons">
        <button class="text-button" data-device-action="camera-refresh" data-device-id="${escapeAttr(device.id)}" type="button">Refresh</button>
        ${motionSwitch ? `<button class="text-button" data-device-action="toggle-related" data-related-id="${escapeAttr(motionSwitch.id)}" data-device-id="${escapeAttr(device.id)}" type="button">${motionSwitch.on ? "Disable Motion" : "Enable Motion"}</button>` : ""}
      </div>
    </article>
  `;
}

function blinkRelatedDevice(camera, role) {
  const key = blinkCameraKey(camera);
  return state.devices.find((device) => device.integration === "blink" && device.blinkRole === role && blinkCameraKey(device) === key);
}

function blinkCameraKey(device) {
  return normaliseHeatingName((device.blinkCameraName || device.name || "").replace(/\b(camera|motion|detected|enabled|armed|blink)\b/gi, ""));
}

function cameraPreviewUrl(device) {
  if (!device.entityPicture || !state.integrations.haBaseUrl) return "";
  if (/^https?:\/\//.test(device.entityPicture)) return device.entityPicture;
  return `${normaliseBaseUrl(state.integrations.haBaseUrl)}${device.entityPicture}`;
}

function getHeatingDevices() {
  const climates = state.devices.filter((device) => device.type === "climate");
  const tadoZones = climates.filter((device) => device.source === "tado");
  return climates
    .filter((device) => !isShadowedLocalHeating(device, tadoZones))
    .sort((a, b) => heatingSortName(a).localeCompare(heatingSortName(b)));
}

function isShadowedLocalHeating(device, tadoZones) {
  if (device.source !== "local" || !tadoZones.length) return false;
  const localName = normaliseHeatingName(`${device.name} ${device.room}`);
  return tadoZones.some((zone) => {
    const zoneName = normaliseHeatingName(`${zone.name} ${zone.room}`);
    return zoneName.includes(localName) || localName.includes(zoneName) || (localName.includes("arthur") && zoneName.includes("arthur"));
  });
}

function heatingCardHtml(device) {
  const target = Number(device.target ?? 20);
  const current = round(device.current ?? target);
  const source = sourceLabel(device);
  const mode = device.power === "OFF" || device.mode === "off" ? "Off" : device.overlayType ? "Manual" : "Heat";
  return `
    <article class="heating-card" data-type="climate">
      <div class="device-head">
        <div>
          <h3 class="device-name">${escapeHtml(heatingSortName(device))}</h3>
          <small>${source} - ${escapeHtml(mode)}</small>
        </div>
        <div class="device-icon">${svg("thermometer", 20)}</div>
      </div>
      <div class="device-status">
        <div class="temperature-readout">
          <small>Current</small>
          <strong>${current}&deg;C</strong>
        </div>
        <span class="panel-badge">${target.toFixed(1)}&deg;C</span>
      </div>
      <div class="control-stack">${deviceControlsHtml(device)}</div>
    </article>
  `;
}

function heatingSortName(device) {
  if (device.room && device.room !== "Whole Home" && device.room !== "tado") return device.room;
  return device.name;
}

function normaliseHeatingName(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function buildCalendarHeatingPlan() {
  const climates = getHeatingDevices();
  if (!climates.length) return { title: "No heating zones", detail: "Connect tado or add climate devices.", targets: [] };

  const now = Date.now();
  const events = getUpcomingEvents()
    .filter((event) => eventDateValue(event) <= now + 24 * 60 * 60 * 1000)
    .slice(0, 8);
  if (!events.length) return { title: "No upcoming activity", detail: "Add diary or Google Calendar events to generate a heating plan.", targets: [] };

  const scenario = classifyHeatingScenario(events);
  const targets = climates.map((device) => ({
    id: device.id,
    label: heatingSortName(device),
    target: heatingTargetForDevice(device, scenario),
    source: device.source
  }));
  const next = events[0];
  return {
    title: scenario.title,
    detail: `Based on ${next.title} at ${formatEventTime(next)}.`,
    targets
  };
}

function classifyHeatingScenario(events) {
  const text = events.map((event) => `${event.title} ${event.location || ""} ${event.type || ""}`).join(" ").toLowerCase();
  const next = events[0];
  if (/(away|travel|flight|train|airport|holiday|office|work|commute)/.test(text) || ["away", "work"].includes(next.type)) {
    return { id: "away", title: "Away Schedule" };
  }
  if (/(guest|visitor|visit|dinner|party|hosting|friends|family)/.test(text) || next.type === "guest") {
    return { id: "guest", title: "Guest Comfort" };
  }
  if (/(sleep|bedtime|bed time|night|nap)/.test(text) || next.type === "sleep") {
    return { id: "sleep", title: "Sleep Heating" };
  }
  if (/(arthur|nursery|school run|school|childcare)/.test(text)) {
    return { id: "arthur", title: "Arthur Comfort" };
  }
  return { id: "home", title: "Home Comfort" };
}

function heatingTargetForDevice(device, scenario) {
  const name = normaliseHeatingName(`${device.name} ${device.room}`);
  const isArthur = name.includes("arthur");
  const isBedroom = name.includes("bedroom") || name.includes("master");
  const isLiving = name.includes("living") || name.includes("thermostat") || name.includes("wholehome");
  const isHall = name.includes("hall");
  const currentTarget = Number(device.target ?? 19);

  if (scenario.id === "away") return 15.5;
  if (scenario.id === "guest") {
    if (isLiving || isHall) return 20.5;
    if (isBedroom) return 18.5;
    return Math.max(currentTarget, 19);
  }
  if (scenario.id === "sleep") {
    if (isArthur) return 18.5;
    if (isBedroom) return 18;
    return 17;
  }
  if (scenario.id === "arthur") {
    if (isArthur) return 20;
    if (isLiving) return 19.5;
    return Math.max(currentTarget, 18);
  }
  if (isArthur) return 19.5;
  if (isBedroom) return 18;
  if (isLiving || isHall) return 20;
  return Math.max(currentTarget, 18.5);
}

function applyCalendarHeatingPlan() {
  const plan = buildCalendarHeatingPlan();
  if (!plan.targets.length) {
    toast("No calendar heating plan available", "error");
    return;
  }
  patchDevices((device) => {
    const target = plan.targets.find((item) => item.id === device.id);
    if (!target || device.type !== "climate") return null;
    return { target: target.target, power: "ON", mode: "heat" };
  });
  persistState();
  renderAll();
  toast(`${plan.title} applied`);
}

function renderRooms() {
  const rooms = ["All", ...Array.from(new Set(state.devices.map((device) => device.room || "Other"))).sort()];
  if (!rooms.includes(state.selectedRoom)) state.selectedRoom = "All";
  document.getElementById("roomFilters").innerHTML = rooms.map((room) => `
    <button class="room-button ${state.selectedRoom === room ? "is-active" : ""}" data-room="${escapeAttr(room)}" type="button">${escapeHtml(room)}</button>
  `).join("");
}

function renderDevices() {
  const filtered = state.devices.filter((device) => state.selectedRoom === "All" || device.room === state.selectedRoom);
  document.getElementById("deviceGrid").innerHTML = filtered.map(deviceCardHtml).join("") || '<div class="empty-state">No devices in this room.</div>';
  document.getElementById("deviceMatrix").innerHTML = state.devices.map(matrixRowHtml).join("") || '<div class="empty-state">No devices synced.</div>';
}

function deviceCardHtml(device) {
  const source = sourceLabel(device);
  return `
    <article class="device-card" data-type="${escapeAttr(device.type)}">
      <div class="device-head">
        <div>
          <h3 class="device-name">${escapeHtml(device.name)}</h3>
          <small>${escapeHtml(device.room || "Home")} - ${source}</small>
        </div>
        <div class="device-icon">${svg(device.icon || iconForType(device.type), 20)}</div>
      </div>
      <div class="device-status">
        <small>${escapeHtml(deviceStateText(device))}</small>
        ${deviceToggleHtml(device)}
      </div>
      <div class="control-stack">${deviceControlsHtml(device)}</div>
    </article>
  `;
}

function sourceLabel(device) {
  if (device.source === "ha") return "Hub";
  if (device.source === "blink") return "Blink";
  if (device.source === "tado") return "tado";
  return "Local";
}

function matrixRowHtml(device) {
  return `
    <div class="matrix-row">
      <div>
        <strong>${escapeHtml(device.name)}</strong>
        <small>${escapeHtml(device.room || "Home")} - ${escapeHtml(deviceStateText(device))}</small>
      </div>
      ${deviceToggleHtml(device)}
    </div>
  `;
}

function deviceToggleHtml(device) {
  if (device.readOnly) return '<span class="panel-badge">Read</span>';
  let on = false;
  let label = "Toggle";
  if (["light", "switch", "media"].includes(device.type)) {
    on = Boolean(device.on);
    label = on ? `Turn off ${device.name}` : `Turn on ${device.name}`;
  } else if (device.type === "lock") {
    on = Boolean(device.locked);
    label = on ? `Unlock ${device.name}` : `Lock ${device.name}`;
  } else if (device.type === "security") {
    on = Boolean(device.armed);
    label = on ? `Disarm ${device.name}` : `Arm ${device.name}`;
  } else if (device.type === "cover") {
    on = Number(device.open || 0) > 0;
    label = on ? `Close ${device.name}` : `Open ${device.name}`;
  } else if (device.type === "camera") {
    return '<span class="panel-badge">Camera</span>';
  } else if (device.type === "climate") {
    return '<span class="panel-badge">Auto</span>';
  }
  return `<button class="toggle-switch ${on ? "is-on" : ""}" data-device-action="toggle" data-device-id="${escapeAttr(device.id)}" type="button" aria-label="${escapeAttr(label)}"></button>`;
}

function deviceControlsHtml(device) {
  if (device.readOnly) {
    return `<div class="empty-state">${escapeHtml(deviceStateText(device))}</div>`;
  }
  if (device.type === "light") {
    const level = Number(device.level ?? 50);
    return `
      <label class="range-line">
        <span>Brightness</span>
        <strong data-range-output="${escapeAttr(device.id)}">${level}%</strong>
        <input data-device-range="${escapeAttr(device.id)}" data-field="level" type="range" min="1" max="100" value="${level}">
      </label>
    `;
  }
  if (device.type === "cover") {
    const open = Number(device.open ?? 0);
    return `
      <label class="range-line">
        <span>Open</span>
        <strong data-range-output="${escapeAttr(device.id)}">${open}%</strong>
        <input data-device-range="${escapeAttr(device.id)}" data-field="open" type="range" min="0" max="100" value="${open}">
      </label>
    `;
  }
  if (device.type === "climate") {
    const target = Number(device.target ?? 20);
    const tadoActions = device.source === "tado" ? `
      <div class="inline-buttons">
        <button class="text-button" data-device-action="resume" data-device-id="${escapeAttr(device.id)}" type="button">Schedule</button>
        <button class="text-button" data-device-action="climate-off" data-device-id="${escapeAttr(device.id)}" type="button">Off</button>
      </div>
    ` : "";
    return `
      <div class="stepper" aria-label="Climate target">
        <button data-device-action="step" data-step="-0.5" data-device-id="${escapeAttr(device.id)}" type="button" aria-label="Decrease temperature">-</button>
        <strong>${target.toFixed(1)}&deg;C</strong>
        <button data-device-action="step" data-step="0.5" data-device-id="${escapeAttr(device.id)}" type="button" aria-label="Increase temperature">+</button>
      </div>
      <small>Current ${round(device.current ?? target)}&deg;C</small>
      ${tadoActions}
    `;
  }
  if (device.type === "camera") {
    const preview = cameraPreviewUrl(device);
    return `
      <div class="camera-preview">
        ${preview ? `<img src="${escapeAttr(preview)}" alt="${escapeAttr(device.name)} preview">` : svg("camera", 34)}
      </div>
      <button class="text-button" data-device-action="camera-refresh" data-device-id="${escapeAttr(device.id)}" type="button">Refresh</button>
    `;
  }
  if (device.type === "switch" && typeof device.power === "number") {
    return `<small>${round(device.power)} W now</small>`;
  }
  if (device.type === "media") {
    return `<small>${device.on ? "Ready to play" : "Standby"}</small>`;
  }
  if (device.type === "lock") {
    return `<small>${device.locked ? "Secured" : "Unlocked"}</small>`;
  }
  if (device.type === "security") {
    return `<small>${device.armed ? "Armed" : "Disarmed"}</small>`;
  }
  return "";
}

function renderAutomations() {
  document.getElementById("automationGrid").innerHTML = state.automations.map((automation) => `
    <article class="automation-card ${automation.active ? "" : "is-off"}">
      <div class="automation-head">
        <div>
          <h3>${escapeHtml(automation.name)}</h3>
          <small>${escapeHtml(automation.source)}</small>
        </div>
        <button class="toggle-switch ${automation.active ? "is-on" : ""}" data-toggle-automation="${automation.id}" type="button" aria-label="Toggle ${escapeAttr(automation.name)}"></button>
      </div>
      <div>
        <strong>${escapeHtml(automation.trigger)}</strong>
        <small>${escapeHtml(automation.action)}</small>
      </div>
      <div class="automation-actions">
        <span class="panel-badge">${automation.active ? "On" : "Off"}</span>
        <button class="text-button" data-run-automation="${automation.id}" type="button">Run</button>
      </div>
    </article>
  `).join("");
}

function renderIntegrations() {
  document.getElementById("haUrl").value = state.integrations.haBaseUrl || "";
  document.getElementById("haToken").value = state.integrations.haToken || "";
  document.getElementById("rememberToken").checked = Boolean(state.integrations.rememberToken);
  const haCount = state.devices.filter((device) => device.source === "ha").length;
  document.getElementById("haStatus").textContent = haCount ? `${haCount} synced` : "Not connected";
  const blinkCameras = getBlinkCameras().length;
  const blinkDevices = getBlinkDevices().length;
  document.getElementById("blinkStatus").textContent = blinkCameras ? `${blinkCameras} cameras` : blinkDevices ? `${blinkDevices} entities` : "Not synced";
  const googleCalendar = state.integrations.googleCalendar || blankGoogleCalendarIntegration();
  document.getElementById("googleCalendarUrl").value = googleCalendar.url || "";
  document.getElementById("rememberGoogleCalendarUrl").checked = Boolean(googleCalendar.rememberUrl);
  document.getElementById("googleCalendarStatus").textContent = googleCalendar.eventCount
    ? `${googleCalendar.eventCount} events`
    : googleCalendar.url ? "Linked" : "Not linked";

  const tado = state.integrations.tado || blankTadoIntegration();
  const tadoCount = state.devices.filter((device) => device.source === "tado").length;
  const isLinked = Boolean(tado.tokens?.refreshToken);
  document.getElementById("rememberTadoToken").checked = Boolean(tado.rememberToken);
  document.getElementById("tadoStatus").textContent = isLinked
    ? `${tadoCount || 0} zones`
    : tado.deviceFlow ? "Approval pending" : "Not linked";
  document.getElementById("syncTadoButton").disabled = !isLinked;
  document.getElementById("finishTadoButton").disabled = !tado.deviceFlow;
  document.getElementById("tadoAuthBox").innerHTML = tadoAuthHtml(tado, tadoCount);
}

function tadoAuthHtml(tado, count) {
  if (tado.deviceFlow) {
    const expires = new Date(tado.deviceFlow.expiresAt);
    return `
      <div class="empty-state">
        <strong>Approve this app in tado.</strong>
        <div class="auth-code">${escapeHtml(tado.deviceFlow.userCode || "")}</div>
        <a class="external-link" href="${escapeAttr(tado.deviceFlow.verificationUriComplete || tado.deviceFlow.verificationUri || "#")}" target="_blank" rel="noopener">Open tado approval</a>
        <small>Expires ${new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(expires)}. After approving, return here and press Finish Link.</small>
      </div>
    `;
  }
  if (tado.tokens?.refreshToken) {
    const updated = tado.updatedAt
      ? new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(tado.updatedAt))
      : "Not synced yet";
    const home = tado.homeName ? `${escapeHtml(tado.homeName)} - ` : "";
    const rate = tado.rateLimit ? `<small>tado API: ${escapeHtml(tado.rateLimit)}</small>` : "";
    return `
      <div class="empty-state">
        <strong>${home}${count} heating zones linked.</strong>
        <small>Last sync ${updated}. Manual sync keeps tado API use low.</small>
        ${rate}
      </div>
    `;
  }
  return '<div class="empty-state">Start a tado link to approve this app in your tado account.</div>';
}

function showView(view, shouldPersist = true) {
  state.activeView = view;
  document.querySelectorAll(".view").forEach((node) => {
    node.classList.toggle("is-active", node.id === `${view}View`);
  });
  document.querySelectorAll(".nav-tab").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.view === view);
  });
  if (shouldPersist) persistState();
}

function setMode(mode) {
  state.mode = mode;
  persistState();
  renderAll();
}

function handleDeviceClick(event) {
  const button = event.target.closest("[data-device-action]");
  if (!button) return;
  const device = state.devices.find((item) => item.id === button.dataset.deviceId);
  if (!device || device.readOnly) return;
  const action = button.dataset.deviceAction;
  if (action === "toggle") {
    toggleDevice(device);
  }
  if (action === "step") {
    const step = Number(button.dataset.step || 0);
    const target = clamp(Number(device.target ?? 20) + step, 10, 30);
    updateDevice(device.id, { target }, { send: true });
  }
  if (action === "resume") {
    updateDevice(device.id, { overlayType: null }, { send: true, command: "resume" });
  }
  if (action === "climate-off") {
    updateDevice(device.id, { power: "OFF", mode: "off" }, { send: true, command: "off" });
  }
  if (action === "camera-refresh") {
    sendDeviceAction(device, {}, { command: "camera-refresh" });
    toast(`${device.name} refresh requested`);
  }
  if (action === "toggle-related") {
    const related = state.devices.find((item) => item.id === button.dataset.relatedId);
    if (!related) return;
    updateDevice(related.id, { on: !related.on }, { send: true });
  }
}

function handleDeviceInput(event) {
  const input = event.target.closest("[data-device-range]");
  if (!input) return;
  const device = state.devices.find((item) => item.id === input.dataset.deviceRange);
  if (!device) return;
  const value = Number(input.value);
  const field = input.dataset.field;
  device[field] = value;
  if (field === "level") device.on = value > 0;
  const output = document.querySelector(`[data-range-output="${cssEscape(device.id)}"]`);
  if (output) output.textContent = `${value}%`;
}

function handleDeviceChange(event) {
  const input = event.target.closest("[data-device-range]");
  if (!input) return;
  const device = state.devices.find((item) => item.id === input.dataset.deviceRange);
  if (!device) return;
  const value = Number(input.value);
  const field = input.dataset.field;
  updateDevice(device.id, { [field]: value, ...(field === "level" ? { on: value > 0 } : {}) }, { send: true });
}

function toggleDevice(device) {
  if (["light", "switch", "media"].includes(device.type)) {
    updateDevice(device.id, { on: !device.on }, { send: true });
    return;
  }
  if (device.type === "lock") {
    updateDevice(device.id, { locked: !device.locked }, { send: true });
    return;
  }
  if (device.type === "security") {
    updateDevice(device.id, { armed: !device.armed }, { send: true });
    return;
  }
  if (device.type === "cover") {
    updateDevice(device.id, { open: Number(device.open || 0) > 0 ? 0 : 100 }, { send: true });
  }
}

function updateDevice(id, patch, options = {}) {
  const device = state.devices.find((item) => item.id === id);
  if (!device) return;
  Object.assign(device, patch);
  persistState();
  if (options.send) sendDeviceAction(device, patch, options);
  renderAll();
}

function applyScene(scene) {
  if (scene === "home") {
    state.mode = "home";
    patchDevices((device) => {
      if (device.type === "light") return { on: true, level: device.room === "Bedroom" ? 36 : 68 };
      if (device.type === "climate") return { target: 20.5 };
      if (device.type === "security") return { armed: false };
      if (device.type === "cover") return { open: 70 };
      return null;
    });
  }
  if (scene === "away") {
    state.mode = "away";
    patchDevices((device) => {
      if (device.type === "light") return { on: device.room === "Outside", level: device.room === "Outside" ? 38 : device.level };
      if (device.type === "switch" || device.type === "media") return { on: false };
      if (device.type === "climate") return { target: 15.5 };
      if (device.type === "lock") return { locked: true };
      if (device.type === "security") return { armed: true };
      if (device.type === "cover") return { open: 25 };
      return null;
    });
  }
  if (scene === "sleep") {
    state.mode = "sleep";
    patchDevices((device) => {
      if (device.type === "light") return { on: device.room === "Hall", level: device.room === "Hall" ? 12 : device.level };
      if (device.type === "switch" || device.type === "media") return { on: false };
      if (device.type === "climate") return { target: 18 };
      if (device.type === "lock") return { locked: true };
      if (device.type === "security") return { armed: true };
      if (device.type === "cover") return { open: 0 };
      return null;
    });
  }
  if (scene === "movie") {
    state.mode = "home";
    patchDevices((device) => {
      if (device.room === "Living Room" && device.type === "light") return { on: true, level: 18 };
      if (device.room === "Living Room" && device.type === "media") return { on: true };
      if (device.type === "cover") return { open: 15 };
      if (device.type === "climate") return { target: 20 };
      return null;
    });
  }
  if (scene === "all-off") {
    patchDevices((device) => {
      if (["light", "switch", "media"].includes(device.type)) return { on: false };
      return null;
    });
  }
  if (scene === "secure") {
    patchDevices((device) => {
      if (device.type === "lock") return { locked: true };
      if (device.type === "security") return { armed: true };
      if (device.type === "cover") return { open: 0 };
      return null;
    });
  }
  persistState();
  renderAll();
  toast(`${titleCase(scene)} applied`);
}

function patchDevices(getPatch) {
  state.devices.forEach((device) => {
    const patch = getPatch(device);
    if (!patch) return;
    Object.assign(device, patch);
    sendDeviceAction(device, patch, { silent: true });
  });
}

async function fetchWeatherByQuery(query) {
  renderWeatherLoading("Finding forecast");
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
    const geo = await fetchJson(geoUrl);
    if (!geo.results || !geo.results.length) throw new Error("Place not found");
    const place = geo.results[0];
    const label = [place.name, place.admin1, place.country].filter(Boolean).join(", ");
    await fetchWeatherByCoords(place.latitude, place.longitude, label, query);
  } catch (error) {
    renderWeather();
    toast(error.message || "Weather lookup failed", "error");
  }
}

function fetchWeatherByLocation() {
  if (!navigator.geolocation) {
    toast("Location is not available in this browser", "error");
    return;
  }
  renderWeatherLoading("Checking location");
  navigator.geolocation.getCurrentPosition(async (position) => {
    try {
      await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude, "Current location", "Current location");
    } catch (error) {
      renderWeather();
      toast(error.message || "Weather lookup failed", "error");
    }
  }, (error) => {
    renderWeather();
    toast(error.message || "Location permission was not granted", "error");
  }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 900000 });
}

async function fetchWeatherByCoords(lat, lon, place, query) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset",
    timezone: "auto"
  });
  const forecast = await fetchJson(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  state.weather = {
    query,
    place,
    lat,
    lon,
    current: forecast.current,
    daily: firstDaily(forecast.daily),
    updatedAt: new Date().toISOString()
  };
  persistState();
  renderAll();
  toast("Weather updated");
}

function renderWeatherLoading(text) {
  document.getElementById("weatherContent").innerHTML = `<div class="empty-state">${escapeHtml(text)}</div>`;
}

async function refreshLiveData() {
  if (state.weather.lat && state.weather.lon) {
    await fetchWeatherByCoords(state.weather.lat, state.weather.lon, state.weather.place || "Local", state.weather.query || "");
  } else if (state.weather.query) {
    await fetchWeatherByQuery(state.weather.query);
  }
  if (state.integrations.haBaseUrl && state.integrations.haToken) {
    await syncHomeAssistant(true);
  }
  if (state.integrations.tado?.tokens?.refreshToken) {
    await syncTado(true);
  }
  if (state.integrations.googleCalendar?.url) {
    await syncGoogleCalendar(true);
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

function firstDaily(daily) {
  if (!daily) return null;
  const item = {};
  Object.keys(daily).forEach((key) => {
    item[key] = Array.isArray(daily[key]) ? daily[key][0] : daily[key];
  });
  return item;
}

async function syncHomeAssistant(silent = false) {
  const base = normaliseBaseUrl(state.integrations.haBaseUrl);
  const token = state.integrations.haToken;
  if (!base || !token) {
    toast("Add a Home Assistant URL and token", "error");
    return;
  }
  state.integrations.haBaseUrl = base;
  persistState();
  document.getElementById("haStatus").textContent = "Connecting";
  try {
    const entities = await haFetch("/api/states");
    const mapped = entities.map(mapHomeAssistantEntity).filter(Boolean);
    const localDevices = state.devices.filter((device) => !["ha", "blink"].includes(device.source));
    state.devices = localDevices.concat(mapped);
    persistState();
    renderAll();
    if (!silent) toast(`${mapped.length} Home Assistant entities synced`);
  } catch (error) {
    renderIntegrations();
    toast(homeAssistantError(error), "error");
  }
}

async function syncBlink() {
  if (!state.integrations.haBaseUrl || !state.integrations.haToken) {
    toast("Connect Home Assistant first", "error");
    showView("integrations");
    return;
  }
  await syncHomeAssistant(true);
  const cameras = getBlinkCameras().length;
  if (cameras) {
    toast(`${cameras} Blink cameras synced`);
  } else {
    toast("No Blink cameras found in Home Assistant", "error");
  }
}

async function syncGoogleCalendar(silent = false) {
  const calendar = state.integrations.googleCalendar || blankGoogleCalendarIntegration();
  const url = (calendar.url || document.getElementById("googleCalendarUrl")?.value || "").trim();
  if (!url) {
    toast("Add your Google Calendar iCal URL first", "error");
    showView("integrations");
    document.getElementById("googleCalendarUrl").focus();
    return;
  }
  try {
    document.getElementById("googleCalendarStatus").textContent = "Syncing";
    state.integrations.googleCalendar.url = url;
    state.integrations.googleCalendar.rememberUrl = document.getElementById("rememberGoogleCalendarUrl")?.checked || calendar.rememberUrl;
    const text = await localApiText("/api/calendar/ics", {
      method: "POST",
      body: JSON.stringify({ url })
    });
    const imported = parseIcs(text, { source: "google" });
    const importedIds = new Set(imported.map((event) => event.id));
    state.events = state.events
      .filter((event) => event.source !== "google" || !importedIds.has(event.id))
      .filter((event) => event.source !== "google")
      .concat(imported)
      .sort((a, b) => eventDateValue(a) - eventDateValue(b));
    state.integrations.googleCalendar.updatedAt = new Date().toISOString();
    state.integrations.googleCalendar.eventCount = imported.length;
    persistState();
    renderAll();
    if (!silent) toast(`${imported.length} Google Calendar events synced`);
  } catch (error) {
    renderIntegrations();
    toast(googleCalendarError(error), "error");
  }
}

async function haFetch(path, options = {}) {
  const base = normaliseBaseUrl(state.integrations.haBaseUrl);
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${state.integrations.haToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  if (!response.ok) throw new Error(`Home Assistant returned ${response.status}`);
  if (response.status === 204) return null;
  return response.json();
}

function sendDeviceAction(device, patch, options = {}) {
  sendHomeAssistantAction(device, patch, options);
  sendTadoAction(device, patch, options);
}

async function sendHomeAssistantAction(device, patch, options = {}) {
  const silent = Boolean(options.silent);
  if (!["ha", "blink"].includes(device.source) || !device.entityId || !state.integrations.haBaseUrl || !state.integrations.haToken) return;
  const [domain] = device.entityId.split(".");
  const service = homeAssistantService(domain, device, patch, options.command);
  if (!service) return;
  try {
    await haFetch(`/api/services/${service.domain}/${service.name}`, {
      method: "POST",
      body: JSON.stringify(service.data)
    });
  } catch (error) {
    if (!silent) toast(homeAssistantError(error), "error");
  }
}

async function startTadoLink() {
  document.getElementById("tadoAuthBox").innerHTML = '<div class="empty-state">Starting tado approval...</div>';
  try {
    const data = await localApiJson("/api/tado/device/start", { method: "POST" });
    state.integrations.tado.deviceFlow = {
      deviceCode: data.device_code,
      userCode: data.user_code,
      verificationUri: data.verification_uri,
      verificationUriComplete: data.verification_uri_complete,
      expiresAt: Date.now() + Number(data.expires_in || 300) * 1000,
      interval: Number(data.interval || 5)
    };
    persistState();
    renderIntegrations();
    toast("tado approval link ready");
  } catch (error) {
    renderIntegrations();
    toast(tadoError(error), "error");
  }
}

async function finishTadoLink() {
  const flow = state.integrations.tado.deviceFlow;
  if (!flow?.deviceCode) {
    toast("Start a tado link first", "error");
    return;
  }
  if (Date.now() > flow.expiresAt) {
    state.integrations.tado.deviceFlow = null;
    persistState();
    renderIntegrations();
    toast("tado approval expired. Start a new link.", "error");
    return;
  }
  try {
    const data = await localApiJson("/api/tado/device/finish", {
      method: "POST",
      body: JSON.stringify({ deviceCode: flow.deviceCode })
    });
    state.integrations.tado.tokens = normaliseTadoTokens(data);
    state.integrations.tado.userId = data.userId || data.user_id || "";
    state.integrations.tado.deviceFlow = null;
    persistState();
    await syncTado();
  } catch (error) {
    toast(tadoError(error), "error");
  }
}

async function syncTado(silent = false) {
  if (!state.integrations.tado.tokens?.refreshToken) {
    toast("Link your tado account first", "error");
    return;
  }
  document.getElementById("tadoStatus").textContent = "Syncing";
  try {
    const accessToken = await ensureTadoAccessToken();
    const data = await localApiJson("/api/tado/sync", {
      method: "POST",
      body: JSON.stringify({ accessToken })
    });
    const current = state.devices.filter((device) => device.source !== "tado");
    state.devices = current.concat(data.devices || []);
    state.integrations.tado.homeId = data.home?.id || "";
    state.integrations.tado.homeName = data.home?.name || "";
    state.integrations.tado.rateLimit = data.rateLimit || "";
    state.integrations.tado.updatedAt = new Date().toISOString();
    persistState();
    renderAll();
    if (!silent) toast(`${(data.devices || []).length} tado heating zones synced`);
  } catch (error) {
    renderIntegrations();
    toast(tadoError(error), "error");
  }
}

async function sendTadoAction(device, patch, options = {}) {
  if (device.source !== "tado" || !device.homeId || !device.zoneId) return;
  const silent = Boolean(options.silent);
  try {
    const accessToken = await ensureTadoAccessToken();
    let path = "";
    let body = { accessToken, homeId: device.homeId, zoneId: device.zoneId };
    if (options.command === "resume") {
      path = "/api/tado/zone/resume";
    } else if (options.command === "off") {
      path = "/api/tado/zone/off";
    } else if ("target" in patch) {
      path = "/api/tado/zone/temperature";
      body = { ...body, celsius: patch.target };
    }
    if (!path) return;
    const data = await localApiJson(path, {
      method: "POST",
      body: JSON.stringify(body)
    });
    if (data.rateLimit) state.integrations.tado.rateLimit = data.rateLimit;
    persistState();
    if (!silent) toast(`${device.name} updated in tado`);
  } catch (error) {
    if (!silent) toast(tadoError(error), "error");
  }
}

async function ensureTadoAccessToken() {
  const tokens = state.integrations.tado.tokens || {};
  if (tokens.accessToken && Number(tokens.expiresAt || 0) > Date.now() + 30000) {
    return tokens.accessToken;
  }
  if (!tokens.refreshToken) throw new Error("No tado refresh token");
  const data = await localApiJson("/api/tado/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken: tokens.refreshToken })
  });
  state.integrations.tado.tokens = normaliseTadoTokens(data, tokens);
  persistState();
  return state.integrations.tado.tokens.accessToken;
}

function normaliseTadoTokens(data, previous = {}) {
  const expiresIn = Number(data.expires_in || data.expiresIn || 600);
  return {
    accessToken: data.access_token || data.accessToken || previous.accessToken || "",
    refreshToken: data.refresh_token || data.refreshToken || previous.refreshToken || "",
    expiresAt: Date.now() + Math.max(60, expiresIn - 60) * 1000,
    userId: data.userId || data.user_id || previous.userId || ""
  };
}

function clearTadoLink() {
  state.integrations.tado = blankTadoIntegration();
  state.devices = state.devices.filter((device) => device.source !== "tado");
  localStorage.removeItem(TADO_TOKEN_KEY);
  sessionStorage.removeItem(TADO_TOKEN_KEY);
  sessionStorage.removeItem(TADO_AUTH_KEY);
  persistState();
  renderAll();
  toast("tado link cleared");
}

async function localApiJson(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    data = { error: text };
  }
  if (!response.ok) {
    throw new Error(data.error || `Local API returned ${response.status}`);
  }
  return data;
}

async function localApiText(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  if (!response.ok) {
    try {
      const data = JSON.parse(text);
      throw new Error(data.error || `Local API returned ${response.status}`);
    } catch (error) {
      if (error.message && !error.message.startsWith("Unexpected")) throw error;
      throw new Error(text || `Local API returned ${response.status}`);
    }
  }
  return text;
}

function tadoError(error) {
  const message = error?.message || "tado request failed";
  if (message.includes("authorization_pending")) return "Approve the tado link first, then press Finish Link.";
  if (message.includes("expired_token")) return "The tado approval expired. Start a new link.";
  if (message.includes("Failed to fetch")) return "The local tado proxy is not running. Start the app with server.js.";
  return message;
}

function googleCalendarError(error) {
  const message = error?.message || "Google Calendar sync failed";
  if (message.includes("Failed to fetch")) return "The local calendar proxy is not running. Start the app with server.js.";
  return message;
}

function homeAssistantService(domain, device, patch, command = "") {
  const entity_id = device.entityId;
  if (command === "camera-refresh" && domain === "camera") {
    return { domain: "blink", name: "trigger_camera", data: { entity_id } };
  }
  if (domain === "light") {
    if ("on" in patch && !patch.on) return { domain, name: "turn_off", data: { entity_id } };
    return { domain, name: "turn_on", data: { entity_id, ...(patch.level ? { brightness_pct: patch.level } : {}) } };
  }
  if (domain === "switch" || domain === "fan") {
    return { domain, name: patch.on ? "turn_on" : "turn_off", data: { entity_id } };
  }
  if (domain === "lock") {
    return { domain, name: patch.locked ? "lock" : "unlock", data: { entity_id } };
  }
  if (domain === "cover") {
    if ("open" in patch) return { domain, name: "set_cover_position", data: { entity_id, position: patch.open } };
  }
  if (domain === "climate" && "target" in patch) {
    return { domain, name: "set_temperature", data: { entity_id, temperature: patch.target } };
  }
  if (domain === "media_player") {
    return { domain, name: patch.on ? "turn_on" : "turn_off", data: { entity_id } };
  }
  if (domain === "alarm_control_panel" && "armed" in patch) {
    return { domain, name: patch.armed ? "alarm_arm_away" : "alarm_disarm", data: { entity_id } };
  }
  return null;
}

function mapHomeAssistantEntity(entity) {
  const [domain] = entity.entity_id.split(".");
  const supported = ["light", "switch", "fan", "climate", "lock", "cover", "media_player", "sensor", "binary_sensor", "alarm_control_panel", "camera"];
  if (!supported.includes(domain)) return null;
  const attrs = entity.attributes || {};
  const name = attrs.friendly_name || entity.entity_id.replace(".", " ");
  const source = homeAssistantEntitySource(entity, name);
  const base = {
    id: `ha-${entity.entity_id.replace(/[^a-z0-9]/gi, "-")}`,
    entityId: entity.entity_id,
    name,
    room: inferRoom(name, attrs),
    source,
    integration: source === "blink" ? "blink" : "home_assistant",
    blinkCameraName: blinkNameFromEntity(entity, name),
    rawState: entity.state,
    updatedAt: entity.last_updated ? formatShortTime(entity.last_updated) : ""
  };
  if (domain === "camera") {
    return {
      ...base,
      type: "camera",
      icon: "camera",
      entityPicture: attrs.entity_picture || "",
      updatedAt: attrs.friendly_name ? "" : ""
    };
  }
  if (domain === "light") {
    return { ...base, type: "light", icon: "lightbulb", on: entity.state === "on", level: attrs.brightness ? Math.round((attrs.brightness / 255) * 100) : 100 };
  }
  if (domain === "switch" || domain === "fan") {
    return {
      ...base,
      type: "switch",
      icon: source === "blink" ? "camera" : domain === "fan" ? "spark" : "plug",
      on: entity.state === "on",
      power: attrs.power,
      blinkRole: source === "blink" && blinkRoleForEntity(entity, name) === "motion" ? "motion_switch" : undefined
    };
  }
  if (domain === "climate") {
    return { ...base, type: "climate", icon: "thermometer", current: attrs.current_temperature, target: attrs.temperature || attrs.target_temp_high || 20, mode: entity.state };
  }
  if (domain === "lock") {
    return { ...base, type: "lock", icon: entity.state === "locked" ? "lock" : "unlock", locked: entity.state === "locked" };
  }
  if (domain === "cover") {
    return { ...base, type: "cover", icon: "blinds", open: typeof attrs.current_position === "number" ? attrs.current_position : entity.state === "open" ? 100 : 0 };
  }
  if (domain === "media_player") {
    return { ...base, type: "media", icon: "media", on: !["off", "standby", "unavailable", "unknown"].includes(entity.state) };
  }
  if (domain === "alarm_control_panel") {
    return { ...base, type: "security", icon: "shield", armed: entity.state.startsWith("armed"), blinkRole: source === "blink" ? "system" : undefined };
  }
  if (domain === "binary_sensor") {
    return {
      ...base,
      type: "sensor",
      icon: "camera",
      readOnly: true,
      on: entity.state === "on",
      blinkRole: blinkRoleForEntity(entity, name),
      value: entity.state === "on" ? "Detected" : "Clear"
    };
  }
  return {
    ...base,
    type: "sensor",
    icon: "spark",
    readOnly: true,
    blinkRole: blinkRoleForEntity(entity, name),
    value: `${entity.state}${attrs.unit_of_measurement ? ` ${attrs.unit_of_measurement}` : ""}`
  };
}

function homeAssistantEntitySource(entity, name) {
  const raw = `${entity.entity_id} ${name}`.toLowerCase();
  return raw.includes("blink") ? "blink" : "ha";
}

function blinkRoleForEntity(entity, name) {
  const raw = `${entity.entity_id} ${name}`.toLowerCase();
  if (raw.includes("motion") || raw.includes("detected")) return "motion";
  if (raw.includes("battery")) return "battery";
  if (raw.includes("wifi") || raw.includes("wi-fi")) return "wifi";
  if (raw.includes("temperature")) return "temperature";
  return "sensor";
}

function blinkNameFromEntity(entity, name) {
  return String(name || entity.entity_id)
    .replace(/^blink\s+/i, "")
    .replace(/\s+(camera|motion|detected|enabled|battery|temperature|wi-?fi).*$/i, "")
    .trim();
}

function inferRoom(name, attrs) {
  if (attrs.area_id) return titleCase(String(attrs.area_id).replace(/_/g, " "));
  const known = ["living", "kitchen", "bedroom", "hall", "study", "office", "garden", "outside", "bathroom", "garage"];
  const lower = name.toLowerCase();
  const match = known.find((item) => lower.includes(item));
  if (!match) return "Home Assistant";
  if (match === "living") return "Living Room";
  if (match === "outside" || match === "garden") return "Outside";
  return titleCase(match);
}

function normaliseBaseUrl(url) {
  return String(url || "").trim().replace(/\/+$/, "");
}

function homeAssistantError(error) {
  const message = error?.message || "Home Assistant request failed";
  if (message.includes("Failed to fetch")) return "Home Assistant could not be reached from this browser";
  return message;
}

function addDiaryEvent() {
  const title = document.getElementById("eventTitle").value.trim();
  const date = document.getElementById("eventDate").value;
  const time = document.getElementById("eventTime").value;
  const type = document.getElementById("eventType").value;
  if (!title || !date || !time) return;
  state.events.push({ id: newId(), title, date, time, type });
  state.events.sort((a, b) => eventDateValue(a) - eventDateValue(b));
  persistState();
  document.getElementById("eventTitle").value = "";
  setDefaultEventDate();
  renderAll();
  toast("Diary item added");
}

function setDefaultEventDate() {
  const dateInput = document.getElementById("eventDate");
  const timeInput = document.getElementById("eventTime");
  if (!dateInput || !timeInput) return;
  const now = new Date();
  dateInput.value = toDateInput(now);
  if (!timeInput.value) {
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
    timeInput.value = `${String(nextHour.getHours()).padStart(2, "0")}:00`;
  }
}

function getUpcomingEvents() {
  const now = Date.now();
  return state.events
    .filter((event) => eventDateValue(event) >= now - 15 * 60 * 1000)
    .sort((a, b) => eventDateValue(a) - eventDateValue(b));
}

function getPastEvents() {
  const now = Date.now();
  return state.events
    .filter((event) => eventDateValue(event) < now - 15 * 60 * 1000)
    .sort((a, b) => eventDateValue(b) - eventDateValue(a));
}

function eventDateValue(event) {
  return new Date(`${event.date}T${event.time || "00:00"}`).getTime();
}

function formatEventDate(event) {
  return new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${event.date}T00:00`));
}

function formatEventTime(event) {
  return event.time || "00:00";
}

function formatShortTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(date);
}

function buildInsights() {
  const insights = [];
  const active = (id) => state.automations.some((item) => item.id === id && item.active);
  const daily = state.weather.daily;
  const current = state.weather.current;
  if (daily && Number(daily.precipitation_probability_max) >= 60 && active("weather-rain")) {
    insights.push({
      title: "Rain likely today",
      detail: "Lower covers and keep entry lighting ready.",
      automationId: "weather-rain"
    });
  }
  if (current && Number(current.temperature_2m) >= 24 && active("weather-heat")) {
    insights.push({
      title: "Warm indoor risk",
      detail: "Lower blinds and stop extra heating.",
      automationId: "weather-heat"
    });
  }
  const heatingPlan = buildCalendarHeatingPlan();
  if (heatingPlan.targets.length && active("calendar-heating")) {
    insights.push({
      title: heatingPlan.title,
      detail: heatingPlan.detail,
      automationId: "calendar-heating"
    });
  }
  const next = getUpcomingEvents()[0];
  if (next) {
    const minutes = (eventDateValue(next) - Date.now()) / 60000;
    if (minutes <= 180 && ["away", "work"].includes(next.type) && active("diary-away")) {
      insights.push({
        title: `${titleCase(next.type)} starts soon`,
        detail: "Prepare locks, sensors, and heating.",
        automationId: "diary-away"
      });
    }
    if (minutes <= 180 && next.type === "guest" && active("diary-guest")) {
      insights.push({
        title: "Guest entry soon",
        detail: "Light shared rooms before arrival.",
        automationId: "diary-guest"
      });
    }
    if (minutes <= 180 && next.type === "sleep" && active("diary-sleep")) {
      insights.push({
        title: "Sleep routine soon",
        detail: "Dim, lock, and set night climate.",
        automationId: "diary-sleep"
      });
    }
  }
  const idlePlug = state.devices.find((device) => device.type === "switch" && device.on && Number(device.power || 0) > 25);
  if (idlePlug && active("energy-idle")) {
    insights.push({
      title: `${idlePlug.name} using power`,
      detail: "Switch off idle nonessential loads.",
      automationId: "energy-idle"
    });
  }
  return insights.slice(0, 4);
}

function toggleAutomation(id) {
  const automation = state.automations.find((item) => item.id === id);
  if (!automation) return;
  automation.active = !automation.active;
  persistState();
  renderAll();
}

function runAutomation(id) {
  const automation = state.automations.find((item) => item.id === id);
  if (!automation) return;
  if (id === "weather-rain") {
    patchDevices((device) => {
      if (device.type === "cover") return { open: 20 };
      if (device.room === "Hall" || device.room === "Outside") {
        if (device.type === "light") return { on: true, level: 42 };
      }
      return null;
    });
  }
  if (id === "weather-heat") {
    patchDevices((device) => {
      if (device.type === "cover") return { open: 15 };
      if (device.type === "climate") return { target: 19 };
      return null;
    });
  }
  if (id === "calendar-heating") {
    applyCalendarHeatingPlan();
    return;
  }
  if (id === "diary-away") {
    applyScene("away");
    return;
  }
  if (id === "diary-guest") {
    state.mode = "home";
    patchDevices((device) => {
      if ((device.room === "Hall" || device.room === "Living Room" || device.room === "Outside") && device.type === "light") {
        return { on: true, level: 70 };
      }
      if (device.type === "climate") return { target: 20.5 };
      return null;
    });
  }
  if (id === "diary-sleep") {
    applyScene("sleep");
    return;
  }
  if (id === "energy-idle") {
    patchDevices((device) => {
      if (device.type === "switch" || device.type === "media") return { on: false };
      return null;
    });
  }
  persistState();
  renderAll();
  toast(`${automation.name} ran`);
}

async function importIcs(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const imported = parseIcs(text, { source: "ics" });
    state.events = state.events.concat(imported).sort((a, b) => eventDateValue(a) - eventDateValue(b));
    persistState();
    renderAll();
    toast(`${imported.length} diary items imported`);
  } catch (error) {
    toast("Diary import failed", "error");
  } finally {
    event.target.value = "";
  }
}

function parseIcs(text, options = {}) {
  const unfolded = [];
  text.replace(/\r\n/g, "\n").split("\n").forEach((line) => {
    if (/^\s/.test(line) && unfolded.length) {
      unfolded[unfolded.length - 1] += line.slice(1);
    } else {
      unfolded.push(line);
    }
  });

  const events = [];
  let current = null;
  unfolded.forEach((line) => {
    if (line === "BEGIN:VEVENT") {
      current = {};
      return;
    }
    if (line === "END:VEVENT") {
      if (current?.title && current?.date) {
        const eventSource = options.source || "ics";
        const externalId = current.uid || `${current.title}-${current.date}-${current.time || ""}`;
        events.push({
          id: eventSource === "google" ? `google-${safeId(externalId)}` : newId(),
          externalId,
          source: eventSource,
          title: current.title,
          date: current.date,
          time: current.time || "09:00",
          location: current.location || "",
          description: current.description || "",
          type: inferEventType(`${current.title} ${current.location || ""} ${current.description || ""}`)
        });
      }
      current = null;
      return;
    }
    if (!current) return;
    const split = line.indexOf(":");
    if (split === -1) return;
    const property = line.slice(0, split).split(";")[0];
    const value = line.slice(split + 1);
    if (property === "UID") current.uid = unescapeIcs(value);
    if (property === "SUMMARY") current.title = unescapeIcs(value);
    if (property === "LOCATION") current.location = unescapeIcs(value);
    if (property === "DESCRIPTION") current.description = unescapeIcs(value);
    if (property === "DTSTART") Object.assign(current, parseIcsDate(value));
  });
  return events;
}

function parseIcsDate(value) {
  if (/^\d{8}T\d{6}Z$/.test(value)) {
    const date = new Date(Date.UTC(
      Number(value.slice(0, 4)),
      Number(value.slice(4, 6)) - 1,
      Number(value.slice(6, 8)),
      Number(value.slice(9, 11)),
      Number(value.slice(11, 13)),
      Number(value.slice(13, 15))
    ));
    return { date: toDateInput(date), time: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}` };
  }
  const clean = value.replace(/Z$/, "");
  if (/^\d{8}$/.test(clean)) {
    return { date: `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`, time: "09:00" };
  }
  const match = clean.match(/^(\d{4})(\d{2})(\d{2})T?(\d{2})?(\d{2})?/);
  if (!match) return {};
  return {
    date: `${match[1]}-${match[2]}-${match[3]}`,
    time: `${match[4] || "09"}:${match[5] || "00"}`
  };
}

function unescapeIcs(value) {
  return value.replace(/\\n/g, " ").replace(/\\,/g, ",").replace(/\\;/g, ";").trim();
}

function safeId(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96) || newId();
}

function exportIcs() {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//House Command//Diary//EN"
  ];
  state.events.forEach((event) => {
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${event.id}@house-command`);
    lines.push(`SUMMARY:${escapeIcs(event.title)}`);
    lines.push(`DTSTART:${event.date.replace(/-/g, "")}T${event.time.replace(":", "")}00`);
    lines.push("END:VEVENT");
  });
  lines.push("END:VCALENDAR");
  downloadFile("house-command-diary.ics", lines.join("\r\n"), "text/calendar");
}

function exportAppData() {
  const data = clone(state);
  data.integrations.haToken = "";
  if (data.integrations.tado) {
    data.integrations.tado.tokens = {};
    data.integrations.tado.deviceFlow = null;
  }
  if (data.integrations.googleCalendar) {
    data.integrations.googleCalendar.url = "";
  }
  downloadFile("house-command-data.json", JSON.stringify(data, null, 2), "application/json");
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeIcs(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

function inferEventType(title) {
  const lower = title.toLowerCase();
  if (/(away|travel|flight|train|office|work)/.test(lower)) return "away";
  if (/(guest|visit|visitor|dinner|party)/.test(lower)) return "guest";
  if (/(sleep|bed|night)/.test(lower)) return "sleep";
  return "home";
}

function weatherMeta(code) {
  const meta = WEATHER_CODE[Number(code)] || ["Weather", "cloud"];
  return { label: meta[0], icon: meta[1] };
}

function deviceStateText(device) {
  if (device.readOnly) return device.value || device.rawState || "Read only";
  if (device.type === "light") return device.on ? `On at ${device.level ?? 100}%` : "Off";
  if (device.type === "switch") return device.on ? "On" : "Off";
  if (device.type === "media") return device.on ? "On" : "Standby";
  if (device.type === "cover") return `${device.open ?? 0}% open`;
  if (device.type === "lock") return device.locked ? "Locked" : "Unlocked";
  if (device.type === "security") return device.armed ? "Armed" : "Disarmed";
  if (device.type === "camera") return device.rawState || "Ready";
  if (device.type === "climate" && device.source === "tado") {
    const current = `${round(device.current ?? device.target)} deg C`;
    const target = device.power === "OFF" ? "off" : `${round(device.target)} deg C set`;
    return `${current} now, ${target}`;
  }
  if (device.type === "climate") return `${round(device.current ?? device.target)} deg C now`;
  return device.rawState || "Ready";
}

function iconForType(type) {
  return {
    light: "lightbulb",
    switch: "plug",
    climate: "thermometer",
    lock: "lock",
    cover: "blinds",
    media: "media",
    security: "shield",
    camera: "camera",
    sensor: "spark"
  }[type] || "home";
}

function titleCase(value) {
  return String(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toDateInput(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return Math.round(Number(value) * 10) / 10;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function cssEscape(value) {
  if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(value);
  return String(value).replace(/"/g, '\\"');
}

function newId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toast(message, type = "info") {
  const stack = document.getElementById("toastStack");
  const node = document.createElement("div");
  node.className = `toast ${type === "error" ? "error" : ""}`;
  node.textContent = message;
  stack.appendChild(node);
  window.setTimeout(() => node.remove(), 3600);
}
