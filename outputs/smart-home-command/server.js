const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 8765);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;
const TADO_CLIENT_ID = "1bb50063-6b0c-4d11-bd99-387f4a91cc46";
const TADO_LOGIN = "https://login.tado.com/oauth2";
const TADO_API = "https://my.tado.com/api/v2";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      sendJson(res, 204, {});
      return;
    }
    if (req.url.startsWith("/api/tado/")) {
      await handleTado(req, res);
      return;
    }
    if (req.url.startsWith("/api/calendar/")) {
      await handleCalendar(req, res);
      return;
    }
    serveStatic(req, res);
  } catch (error) {
    sendJson(res, error.status || 500, { error: error.message || "Server error" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`House Command running at http://${HOST}:${PORT}`);
});

async function handleTado(req, res) {
  const body = req.method === "POST" ? await readJson(req) : {};
  const url = new URL(req.url, `http://${HOST}:${PORT}`);

  if (url.pathname === "/api/tado/device/start" && req.method === "POST") {
    const data = await tadoForm(`${TADO_LOGIN}/device_authorize`, {
      client_id: TADO_CLIENT_ID,
      scope: "offline_access"
    });
    sendJson(res, 200, data);
    return;
  }

  if (url.pathname === "/api/tado/device/finish" && req.method === "POST") {
    requireField(body, "deviceCode");
    const data = await tadoForm(`${TADO_LOGIN}/token`, {
      client_id: TADO_CLIENT_ID,
      device_code: body.deviceCode,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code"
    });
    sendJson(res, 200, data);
    return;
  }

  if (url.pathname === "/api/tado/refresh" && req.method === "POST") {
    requireField(body, "refreshToken");
    const data = await tadoForm(`${TADO_LOGIN}/token`, {
      client_id: TADO_CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: body.refreshToken
    });
    sendJson(res, 200, data);
    return;
  }

  if (url.pathname === "/api/tado/sync" && req.method === "POST") {
    requireField(body, "accessToken");
    const synced = await syncTado(body.accessToken);
    sendJson(res, 200, synced);
    return;
  }

  if (url.pathname === "/api/tado/zone/temperature" && req.method === "POST") {
    requireFields(body, ["accessToken", "homeId", "zoneId", "celsius"]);
    const result = await tadoApi(body.accessToken, `/homes/${body.homeId}/zones/${body.zoneId}/overlay`, {
      method: "PUT",
      body: {
        setting: {
          type: "HEATING",
          power: "ON",
          temperature: { celsius: Number(body.celsius) }
        },
        termination: { type: "MANUAL" }
      }
    });
    sendJson(res, 200, { ok: true, rateLimit: result.rateLimit });
    return;
  }

  if (url.pathname === "/api/tado/zone/off" && req.method === "POST") {
    requireFields(body, ["accessToken", "homeId", "zoneId"]);
    const result = await tadoApi(body.accessToken, `/homes/${body.homeId}/zones/${body.zoneId}/overlay`, {
      method: "PUT",
      body: {
        setting: { type: "HEATING", power: "OFF" },
        termination: { type: "MANUAL" }
      }
    });
    sendJson(res, 200, { ok: true, rateLimit: result.rateLimit });
    return;
  }

  if (url.pathname === "/api/tado/zone/resume" && req.method === "POST") {
    requireFields(body, ["accessToken", "homeId", "zoneId"]);
    const result = await tadoApi(body.accessToken, `/homes/${body.homeId}/zones/${body.zoneId}/overlay`, {
      method: "DELETE"
    });
    sendJson(res, 200, { ok: true, rateLimit: result.rateLimit });
    return;
  }

  sendJson(res, 404, { error: "Unknown tado endpoint" });
}

async function handleCalendar(req, res) {
  const body = req.method === "POST" ? await readJson(req) : {};
  const url = new URL(req.url, `http://${HOST}:${PORT}`);

  if (url.pathname === "/api/calendar/ics" && req.method === "POST") {
    requireField(body, "url");
    const calendarUrl = validateGoogleCalendarUrl(body.url);
    const response = await fetch(calendarUrl, {
      headers: {
        Accept: "text/calendar,text/plain;q=0.9,*/*;q=0.5",
        "User-Agent": "HouseCommand/1.0"
      }
    });
    if (!response.ok) throw statusError(response.status, `Google Calendar returned ${response.status}`);
    const text = await readLimitedText(response, 2_000_000);
    sendText(res, 200, text, "text/calendar; charset=utf-8");
    return;
  }

  sendJson(res, 404, { error: "Unknown calendar endpoint" });
}

function validateGoogleCalendarUrl(value) {
  let parsed;
  try {
    parsed = new URL(String(value || "").trim());
  } catch (error) {
    throw statusError(400, "Enter a valid Google Calendar iCal URL");
  }
  if (parsed.protocol !== "https:" || parsed.hostname !== "calendar.google.com" || !parsed.pathname.includes("/calendar/ical/")) {
    throw statusError(400, "Use Google Calendar's Secret address in iCal format");
  }
  return parsed.toString();
}

async function syncTado(accessToken) {
  const me = await tadoApi(accessToken, "/me");
  const home = (me.data.homes || [])[0];
  if (!home?.id) throw statusError(404, "No tado homes found on this account");

  const zonesResult = await tadoApi(accessToken, `/homes/${home.id}/zones`);
  const devices = [];
  let rateLimit = zonesResult.rateLimit || me.rateLimit || "";

  for (const zone of zonesResult.data || []) {
    const state = await tadoApi(accessToken, `/homes/${home.id}/zones/${zone.id}/state`);
    rateLimit = state.rateLimit || rateLimit;
    devices.push(mapTadoZone(home, zone, state.data));
  }

  return {
    home: { id: home.id, name: home.name || "tado Home" },
    devices,
    rateLimit
  };
}

function mapTadoZone(home, zone, state) {
  const setting = state.setting || {};
  const sensor = state.sensorDataPoints || {};
  const inside = sensor.insideTemperature || {};
  const humidity = sensor.humidity || {};
  const target = setting.temperature?.celsius;
  const power = setting.power || "OFF";
  return {
    id: `tado-${home.id}-${zone.id}`,
    name: zone.name || `Zone ${zone.id}`,
    room: "tado",
    type: "climate",
    icon: "thermometer",
    source: "tado",
    homeId: home.id,
    zoneId: zone.id,
    current: typeof inside.celsius === "number" ? inside.celsius : null,
    target: typeof target === "number" ? target : 20,
    mode: power === "ON" ? "heat" : "off",
    power,
    humidity: typeof humidity.percentage === "number" ? humidity.percentage : null,
    overlayType: state.overlayType || null,
    rawState: state.tadoMode || power
  };
}

async function tadoForm(endpoint, params) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params)
  });
  return parseTadoResponse(response);
}

async function tadoApi(accessToken, pathName, options = {}) {
  const response = await fetch(`${TADO_API}${pathName}`, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await parseTadoResponse(response);
  return {
    data,
    rateLimit: response.headers.get("ratelimit") || ""
  };
}

async function parseTadoResponse(response) {
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    data = { error: text };
  }
  if (!response.ok) {
    const message = data.error_description || data.error || `tado returned ${response.status}`;
    throw statusError(response.status, message);
  }
  return data;
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";
  const file = path.normalize(path.join(ROOT, pathname));
  if (!file.startsWith(ROOT)) {
    sendText(res, 403, "Forbidden");
    return;
  }
  fs.readFile(file, (error, data) => {
    if (error) {
      sendText(res, 404, "Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(data);
  });
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(statusError(413, "Request body too large"));
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(statusError(400, "Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

async function readLimitedText(response, maxBytes) {
  const reader = response.body?.getReader();
  if (!reader) return response.text();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) throw statusError(413, "Calendar feed is too large");
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  if (status === 204) {
    res.end();
  } else {
    res.end(JSON.stringify(data));
  }
}

function sendText(res, status, text, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store"
  });
  res.end(text);
}

function requireField(body, field) {
  if (!body[field]) throw statusError(400, `Missing ${field}`);
}

function requireFields(body, fields) {
  fields.forEach((field) => requireField(body, field));
}

function statusError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}
