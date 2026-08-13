# Sarah Dough

A tiny weekly bread-ordering page for replacing orders scattered across text messages.

For a complete explanation of the app, weekly menu edits, Google Apps Script maintenance, and Git/GitHub publishing, see [MAINTENANCE_GUIDE.md](MAINTENANCE_GUIDE.md).

For a deeper introduction to HTML, CSS, JavaScript, JSON, the DOM, browser events, network requests, and Google Apps Script using this project as the example, see [LANGUAGES_GUIDE.md](LANGUAGES_GUIDE.md).

## Run it

Open `index.html` in a browser, or serve the folder locally:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## What is included

- Mobile-friendly customer order form
- Menu quantities, pickup windows, notes, and contact details
- Confirmation screen
- Baker view with order totals, status updates, and CSV export
- No dependencies, build step, login, or server required

Orders are stored in the browser until `GOOGLE_APPS_SCRIPT_URL` is set in `app.js`. The repo includes a ready-to-paste Apps Script in `google-apps-script/Code.gs`; deploy it from Sarah's `Sarah Dough Orders` Sheet, paste its `/exec` URL into `app.js`, and push the change. Sarah should use the private Sheet as the production order inbox. The browser-only Baker view is retained for local testing.

To change the weekly menu or pickup times, edit the `MENU` and `PICKUP_SLOTS` constants near the top of `app.js`.
