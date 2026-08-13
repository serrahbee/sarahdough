# Sarah Dough App: Maintenance and Handoff Guide

This guide explains what the app is made of, how an order reaches Google Sheets, how to make common changes, and how to publish those changes with Git and GitHub.

The app is intentionally small. There is no package manager, framework, build process, traditional server, or database. A text editor, a browser, Git, GitHub Pages, Google Sheets, and Google Apps Script are enough to maintain it.

## Quick reference

| Part | Location | Purpose |
| --- | --- | --- |
| HTML | `index.html` | The page structure and wording |
| CSS | `styles.css` | Colors, spacing, typography, and mobile layout |
| JavaScript | `app.js` | Menu data, prices, pickup times, form behavior, and order submission |
| Google Apps Script | `google-apps-script/Code.gs` | Receives an order and adds it to Google Sheets |
| Documentation | `README.md` and this guide | Setup and maintenance instructions |
| Hosting | GitHub Pages | Publishes the files as a public website |
| Order inbox | Google Sheet, `Orders` tab | The shared production order list |

Live site: <https://serrahbee.github.io/sarahdough/>

GitHub repository: <https://github.com/serrahbee/sarahdough>

## How the app works

When someone visits the live site, GitHub Pages sends the browser three files:

1. `index.html` creates the page.
2. `styles.css` makes it look like the Sarah Dough site.
3. `app.js` creates the menu, calculates the total, checks the form, and submits the order.

When the customer presses **Send my order**, the browser packages the order as JSON and sends it to the Google Apps Script web-app URL configured in `app.js`.

```text
Customer's browser
       |
       | order as JSON
       v
Google Apps Script web app
       |
       | appendRow(...)
       v
Sarah Dough Orders Google Sheet
```

The Google Sheet itself stays private. Customers are allowed to submit to the Apps Script endpoint, but they are not given access to open or edit the Sheet.

### Important: the Baker view

The **Baker view** currently uses browser `localStorage`. It was built as an early prototype and only sees orders saved in that same browser when no Google Apps Script URL is configured.

Once the Google integration is enabled, the Google Sheet is the real shared order inbox. The Baker view does **not** read production orders from Google Sheets, and changing a status in the Baker view does not update the Sheet.

## The project files

### `index.html`: content and structure

HTML describes what appears on the page: the header, order form, confirmation screen, Baker view, and footer.

An HTML element usually looks like this:

```html
<h1>Good bread, made slowly.</h1>
```

- `<h1>` starts the main heading.
- The words in the middle are visible on the page.
- `</h1>` ends the heading.

Use `index.html` to change static wording such as:

- the business name or tagline
- the order deadline message
- field labels and placeholder text
- confirmation wording
- footer contact wording

The bread menu and pickup choices are not written directly into the HTML. JavaScript creates them from the lists at the top of `app.js`.

IDs such as `id="order-form"` and attributes such as `data-view="baker"` connect the HTML to JavaScript. Avoid renaming or removing those unless the JavaScript is updated at the same time.

### `styles.css`: appearance

CSS controls how the HTML looks. The reusable colors are near the top:

```css
:root {
  --cream: #f7f0e5;
  --ink: #2e2924;
  --terracotta: #b75d43;
  --sage: #6c8069;
}
```

Changing one of these values changes that color throughout the site.

A CSS rule looks like this:

```css
.primary-button {
  color: var(--paper);
  background: var(--terracotta);
}
```

`.primary-button` selects every HTML element with `class="primary-button"`. The lines inside the braces control its appearance.

The `@media` sections near the bottom contain phone and tablet adjustments. After changing spacing, widths, or font sizes, test both a wide desktop window and a narrow phone-sized window.

### `app.js`: menu and behavior

JavaScript contains the parts of the page that change or react to the customer.

The most frequently edited settings are at the top of the file:

```js
const MENU = [
  {
    id: "country-loaf",
    name: "Country loaf",
    description: "Naturally leavened · 800g",
    price: 12
  },
];

const PICKUP_SLOTS = [
  "Saturday · 9:00–10:00 am",
  "Saturday · 10:00–11:00 am"
];
```

The rest of `app.js`:

- builds the bread cards from `MENU`
- tracks the quantity of each bread
- calculates the order total
- switches among the order, confirmation, and Baker views
- validates required fields
- sends the order to Google Apps Script
- provides the local-only Baker prototype and CSV export

### `google-apps-script/Code.gs`: Google Sheets connection

This file is a repository copy of the code pasted into **Extensions → Apps Script** from the Google Sheet.

Its `doPost(e)` function runs when the website submits an order. It validates the basic fields, turns the item list into readable text, and adds this row to the `Orders` tab:

```text
Timestamp | Name | Contact | Pickup | Items | Total | Notes | Status
```

The order of values in `sheet.appendRow([...])` must match the order of those columns.

Editing `Code.gs` in GitHub does **not** automatically update Google Apps Script. The Apps Script editor has its own copy. If this file changes, copy the updated code into Google Apps Script and deploy a new version as explained later in this guide.

## Make common changes

### Change a bread, description, or price

Open `app.js` and edit the matching item in `MENU`:

```js
{ id: "country-loaf", name: "Country loaf", description: "Naturally leavened · 800g", price: 12 },
```

- `id` is the internal identifier. Use lowercase words separated by hyphens, and keep every ID unique.
- `name` is the customer-facing name.
- `description` is the smaller text below the name.
- `price` is a number without a dollar sign. Use `12.5` for $12.50.

Changing a price on the website affects future orders only. It does not change rows already saved in the Sheet.

### Add a bread

Add another object inside the `MENU` brackets. Include a comma after the preceding item:

```js
const MENU = [
  { id: "country-loaf", name: "Country loaf", description: "Naturally leavened · 800g", price: 12 },
  { id: "baguette", name: "Baguette", description: "Crisp crust · 350g", price: 7 },
];
```

The new bread card, quantity controls, summary line, total, and Google Sheet item text are created automatically.

### Remove a bread temporarily

Delete its full `{ ... }` entry from `MENU`. Be careful to leave valid commas between the remaining entries.

If a bread will return soon, another option is to keep a copy of the line in a note outside the code. JavaScript comments can be used, but comment out the entire item cleanly:

```js
// { id: "focaccia", name: "Rosemary focaccia", description: "Sea salt · olive oil", price: 14 },
```

### Change pickup windows

Edit `PICKUP_SLOTS` in `app.js`:

```js
const PICKUP_SLOTS = [
  "Friday · 4:00–5:00 pm",
  "Saturday · 9:00–10:00 am",
];
```

These are plain labels; the app does not currently enforce capacity or automatically calculate dates.

### Change the order deadline or pickup message

Open `index.html` and find:

```html
Orders close Thursday at noon · Pickup Saturday
```

Replace the visible wording while leaving the surrounding HTML in place.

### Change colors

Edit the color variables at the top of `styles.css`. Hex colors use the format `#RRGGBB`. A color picker can provide the value.

### Change the Google Apps Script URL

Find this line near the top of `app.js`:

```js
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/.../exec";
```

Replace the entire URL between the quotation marks. Use the deployed URL ending in `/exec`, not a testing URL ending in `/dev`.

## Test changes locally

Before publishing, open Terminal and run:

```sh
cd /Users/drewhunt/git/sarahdough
python3 -m http.server 8000
```

Keep that Terminal window open and visit:

<http://localhost:8000>

Refresh the browser after every edit. If a change seems stuck, use a hard refresh:

- macOS Chrome: `Command + Shift + R`
- macOS Safari: `Command + Option + R`

Stop the local server by returning to Terminal and pressing `Control + C`.

### Local test checklist

Before publishing a normal menu change, verify:

1. Every bread card appears.
2. The plus and minus buttons work.
3. Prices and the total are correct.
4. Pickup choices are current.
5. Required fields prevent an incomplete order.
6. A test order reaches the Google Sheet.
7. The layout is readable in a narrow browser window.

Use an obvious test name such as `TEST - Drew`, then remove the test row from the Sheet after verification.

## Save and publish changes with Git

Git records versions on the computer. GitHub stores those versions online. GitHub Pages publishes the latest version pushed to the `main` branch.

### 1. Go to the project

```sh
cd /Users/drewhunt/git/sarahdough
```

### 2. Check the current state

```sh
git status
```

This lists changed files. Read the list before continuing so unrelated files are not included accidentally.

### 3. Review the changes

```sh
git diff
```

Lines beginning with `-` were removed. Lines beginning with `+` were added.

For a quick JavaScript syntax check, run:

```sh
node --check app.js
```

No output means the syntax check passed. If `node` is not installed, test carefully in the browser instead.

### 4. Stage the intended files

For a weekly menu change:

```sh
git add app.js
```

For changes to several known files:

```sh
git add index.html styles.css app.js
```

Using explicit filenames makes it easier to avoid including unrelated work.

### 5. Commit the version

```sh
git commit -m "Update weekly bread menu"
```

The message should briefly describe what changed. Other good examples:

```sh
git commit -m "Change Saturday pickup windows"
git commit -m "Update order deadline wording"
git commit -m "Adjust site colors"
```

### 6. Push to GitHub

```sh
git push
```

GitHub Pages should deploy automatically. Follow the deployment at:

<https://github.com/serrahbee/sarahdough/actions>

When the **pages build and deployment** workflow shows a green check, open:

<https://serrahbee.github.io/sarahdough/>

GitHub Pages or the browser may briefly cache the previous version. Wait a minute and hard-refresh if needed.

### The short version

After editing and testing, the usual weekly workflow is:

```sh
cd /Users/drewhunt/git/sarahdough
git status
git diff
node --check app.js
git add app.js
git commit -m "Update weekly bread menu"
git push
```

## Editing directly on GitHub

For a small emergency text or menu change, a repository collaborator can edit a file on GitHub:

1. Open the repository.
2. Open the file.
3. Click the pencil icon.
4. Make the change.
5. Click **Commit changes**.
6. Commit directly to `main` only when the change has been reviewed carefully.

This triggers GitHub Pages, but it skips local browser testing. Local editing is safer for changes involving punctuation, commas, brackets, HTML tags, or multiple files.

After someone edits on GitHub, update the local copy before doing more local work:

```sh
cd /Users/drewhunt/git/sarahdough
git pull
```

## Update Google Apps Script

Only do this when `google-apps-script/Code.gs` changes or a new Sheet/script deployment is needed. Normal bread, price, pickup, wording, and style changes do not require an Apps Script update.

1. Open the **Sarah Dough Orders** Google Sheet.
2. Choose **Extensions → Apps Script**.
3. Replace the code in the editor with the current contents of `google-apps-script/Code.gs`.
4. Save the project.
5. Choose **Deploy → Manage deployments**.
6. Click the pencil/edit icon for the web-app deployment.
7. Under **Version**, select **New version**.
8. Confirm that it executes as the account that should own the integration and is available to **Anyone**.
9. Click **Deploy**.
10. Keep the `/exec` URL. If Google gives a different URL, update `GOOGLE_APPS_SCRIPT_URL` in `app.js`, commit, and push it.
11. Submit a test order through the live site and confirm a new Sheet row appears.

Saving Apps Script code alone does not update the live web app. A new deployment version is required.

## Google Sheet rules

The Apps Script expects:

- a tab named exactly `Orders`
- these eight columns in this exact order:

```text
Timestamp | Name | Contact | Pickup | Items | Total | Notes | Status
```

It is safe to format columns, freeze the header, create filters, or add dropdown validation to the Status column. Do not rename or reorder these columns without updating `sheet.appendRow([...])` in `Code.gs` to match.

Keep the Sheet restricted to Sarah and trusted editors. Do not publish the Sheet or grant customers access to it.

## Troubleshooting

### The live site did not change

1. Confirm `git push` succeeded.
2. Check the deployment at <https://github.com/serrahbee/sarahdough/actions>.
3. Wait one or two minutes.
4. Hard-refresh the live page.
5. Confirm the change was committed to the `main` branch.

### The page is blank or part of it disappeared

This is commonly caused by an unmatched quote, comma, bracket, or HTML tag.

Run:

```sh
node --check app.js
git diff
```

Also open the browser's developer console with **View → Developer → JavaScript Console** in Safari or **View → Developer → JavaScript Console** in Chrome and look for a red error.

### An order shows confirmation but no Sheet row appears

Because the browser uses a one-way `no-cors` submission, it cannot read Google's detailed response. A confirmation means the browser sent the request, not that it independently read the Sheet afterward.

Check:

1. The Apps Script URL in `app.js` ends in `/exec`.
2. The Apps Script deployment allows **Anyone**.
3. The Apps Script editor contains the current `Code.gs`.
4. The deployment was updated to a **New version** after the latest script change.
5. The spreadsheet tab is named exactly `Orders`.
6. Apps Script **Executions** does not show an error.

Always verify an integration change with a real test row.

### Git says permission denied

Confirm the logged-in GitHub account is a collaborator on `serrahbee/sarahdough`. Repository access is managed at:

<https://github.com/serrahbee/sarahdough/settings/access>

### Git rejects the push

Someone may have changed GitHub since the local copy was last updated. First save or commit local changes, then run:

```sh
git pull --rebase
git push
```

If Git reports a merge conflict, stop and review the conflicting file rather than deleting or overwriting it blindly.

## Current limitations

This intentionally simple version does not yet provide:

- pickup-slot capacity limits
- online payments
- customer accounts
- automatic email or text confirmations
- spam protection
- a private web dashboard connected to the Sheet
- automatic opening and closing of weekly orders

For the current volume, Sarah can manage production orders directly in the private Google Sheet. If the business outgrows that workflow, the next useful improvement would be a protected Baker dashboard that reads and updates the same order data.

## Safe handoff checklist

Before handing everything to Sarah, verify that she has:

- owner or administrator access to the GitHub repository
- access to the GitHub Pages settings
- owner access to the Google Sheet
- owner or deployment access to the Apps Script project
- the live site, repository, and Sheet links
- this maintenance guide
- two-factor authentication enabled on GitHub and Google

Passwords should never be shared. Access should be granted through GitHub collaborators and Google Drive sharing.
