# House Command

A local smart home dashboard with:

- Room and device controls for lights, locks, plugs, covers, climate, media, and security.
- Scenes for Home, Away, Sleep, Movie, All Off, and Secure.
- Weather-aware routines using Open-Meteo.
- A local diary with browser persistence, ICS import, and ICS export.
- Google Calendar read-only sync through a private iCal URL.
- Optional Home Assistant sync through a local URL and long-lived access token.
- Optional tado heating sync through OAuth device-code approval.
- Blink camera viewing and controls through the Home Assistant Blink integration.

## Run

Run the local server from this folder:

```bash
node server.js
```

Then open:

```text
http://127.0.0.1:8765/
```

The tado integration requires `server.js` because the browser app uses the local server as a same-origin proxy for tado OAuth and REST calls.

## Connect Home Assistant

1. Open the Connect view.
2. Enter your Home Assistant base URL, for example `http://homeassistant.local:8123`.
3. Paste a long-lived access token.
4. Choose whether to store the token on this browser.
5. Press Sync.

The token is stored only in this browser when the storage option is enabled. App data export never includes the token.

## Connect tado

1. Open the Connect view.
2. Press Start Link in the tado Heating panel.
3. Open the tado approval link and approve access in your tado account.
4. Return to House Command and press Finish Link.
5. Press Sync Heating whenever you want a fresh manual sync.

tado API calls are kept manual to avoid unnecessary daily API usage. tado tokens are stored only in this browser when the storage option is enabled, and app data export never includes them.

## Connect Google Calendar

1. In Google Calendar, open Settings.
2. Choose the calendar under Settings for my calendars.
3. Open Integrate calendar.
4. Copy the Secret address in iCal format.
5. Paste it into the Google Calendar panel in House Command.
6. Press Sync Calendar.

The calendar link is treated as a secret. It is stored only in this browser when the storage option is enabled, and app data export never includes it.

Google Calendar and diary events feed the Calendar Heating plan in the Heating section. The app classifies upcoming activity such as away, work, guests, sleep, Arthur-related events, and home time, then suggests per-room heating targets. Press Apply Plan to send those targets to local or tado climate devices.

## Connect Blink

Blink cameras are imported through Home Assistant.

1. Add the Blink integration in Home Assistant.
2. Complete Blink's MFA or approval prompt in Home Assistant.
3. Add your Home Assistant URL and token in House Command.
4. Press Sync Blink.

Blink still images, motion state, motion switches, and arm/disarm entities appear when Home Assistant exposes them. Home Assistant's Blink integration does not provide live camera viewing.

## Diary

The Diary view stores entries locally and can import `.ics` calendar files. Diary entry types such as Away, Guest, Work, and Sleep feed the automation suggestions on the Overview screen.
