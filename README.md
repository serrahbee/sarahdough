# Sarah Dough

A tiny weekly bread-ordering page for replacing orders scattered across text messages.

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

Orders are intentionally stored in the browser with `localStorage` for this first prototype. That makes the flow easy to test, but it is not yet a shared production inbox. The next handoff step is to replace the `saveOrders`/`getOrders` functions in `app.js` with a Google Form/Sheet submission, or host the app with a small backend.

To change the weekly menu or pickup times, edit the `MENU` and `PICKUP_SLOTS` constants near the top of `app.js`.
