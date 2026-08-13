# Learning the Sarah Dough App: HTML, CSS, JavaScript, and Apps Script

This guide teaches the languages behind the Sarah Dough app by connecting each concept to code that already exists in the project. It is meant for someone who is new to web development but wants to understand the app well enough to change it confidently.

The four important pieces are:

| Technology | Main job | Runs where |
| --- | --- | --- |
| HTML | Describes the page and its meaning | Customer's browser |
| CSS | Controls appearance and layout | Customer's browser |
| JavaScript | Adds data, calculations, and interactions | Customer's browser |
| Google Apps Script | Receives orders and writes them to Sheets | Google's servers |

HTML, CSS, and JavaScript work together in the browser. Google Apps Script is also JavaScript, but it runs in Google's environment and can use services such as `SpreadsheetApp`.

## First: how a web page runs

When someone opens the Sarah Dough site, the browser requests `index.html` from GitHub Pages. While reading that HTML, it finds these two lines:

```html
<link rel="stylesheet" href="styles.css" />
<script src="app.js" defer></script>
```

The first line loads the CSS. The second loads the JavaScript.

The browser then performs three related jobs:

1. It converts the HTML into a tree of objects called the **DOM**, or Document Object Model.
2. It applies matching CSS rules to those objects.
3. It runs the JavaScript, which can read and change the DOM.

For example, the HTML creates an empty menu container:

```html
<div class="menu-grid" id="menu-grid"></div>
```

The JavaScript finds it:

```js
$("#menu-grid")
```

Then JavaScript fills it with bread cards based on the `MENU` data. CSS sees the `menu-grid` and `menu-item` classes and lays those cards out in a grid.

The important idea is that these are not three separate apps. They are three layers of one page:

```text
HTML        What exists?
CSS         How does it look?
JavaScript  What does it do?
```

## HTML: structure and meaning

HTML stands for **HyperText Markup Language**. It is a markup language, not a programming language. HTML describes content and relationships rather than performing calculations.

The main HTML file is `index.html`.

## Elements and tags

Most HTML is made of elements:

```html
<p>Everything is baked to order.</p>
```

This has:

- an opening tag: `<p>`
- text content: `Everything is baked to order.`
- a closing tag: `</p>`

`p` means paragraph. The element tells the browser that this text is a paragraph, not merely how it should look.

Elements can be nested:

```html
<div class="section-heading">
  <span class="step">01</span>
  <div>
    <h2>Choose your bread</h2>
    <p>Everything is baked to order.</p>
  </div>
</div>
```

Here, the outer `div` contains a `span` and another `div`. The inner `div` contains a heading and paragraph.

Indentation does not change what the browser does, but it makes the parent-child structure much easier for people to see.

## Common elements in this app

### Headings and text

```html
<h1>Good bread, made slowly.</h1>
<h2>Choose your bread</h2>
<p>Everything is baked to order.</p>
```

Headings run from `h1` through `h6`. `h1` is the main page heading. A logical heading order helps screen-reader users and search engines understand the page.

### Links

```html
<a class="brand" href="#order">Sarah Dough</a>
```

An anchor element creates a link. The `href` attribute says where it goes.

### Buttons

```html
<button class="primary-button" type="submit">Send my order</button>
```

Buttons perform actions. Inside a form, `type="submit"` submits the form. Other interactive buttons in this app use `type="button"` so they do not accidentally submit it.

### Form fields and labels

```html
<label class="field">
  Your name
  <input id="customer-name" name="name" required />
</label>
```

The label gives the input an accessible name. The `required` attribute tells the browser that the customer must complete it.

The app also uses:

- `<select>` for pickup choices
- `<option>` for each choice
- `<textarea>` for longer notes
- `<form>` to group the complete order

### Sections and semantic elements

Elements such as `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, and `<footer>` communicate the role of each region.

They often behave like a generic `<div>` visually, but they provide more meaning to browsers and assistive technology.

## Attributes

Attributes add information to an element:

```html
<input id="customer-name" name="name" autocomplete="name" required />
```

This input has four attributes:

- `id` gives it a unique page identifier.
- `name` identifies the field conceptually.
- `autocomplete` helps the browser fill the customer's name.
- `required` is a Boolean attribute: its presence turns the requirement on.

### `id` versus `class`

An `id` should identify one unique element:

```html
<div id="summary-items"></div>
```

A class can be reused on many elements:

```html
<button class="nav-button">Order bread</button>
<button class="nav-button">Baker view</button>
```

JavaScript often uses IDs to find one exact element. CSS mostly uses classes to apply reusable styles.

### `data-*` attributes

HTML allows custom data attributes whose names begin with `data-`:

```html
<button class="nav-button" data-view="baker">Baker view</button>
```

JavaScript reads this as:

```js
button.dataset.view
```

Its value is `"baker"`. This app uses data attributes to connect buttons with actions while keeping the JavaScript generic.

## Accessibility attributes

The app includes attributes such as:

```html
<nav aria-label="Main navigation">
<aside aria-live="polite">
<span aria-hidden="true">→</span>
```

- `aria-label` provides a useful name for a region or control.
- `aria-live="polite"` tells a screen reader to announce updated content when appropriate.
- `aria-hidden="true"` hides decorative content from screen readers.

Use native HTML elements first. Add ARIA when native HTML alone does not communicate enough.

## HTML syntax mistakes to watch for

Common mistakes include:

- forgetting a closing tag
- putting quotation marks inside an attribute without escaping them
- using the same `id` more than once
- removing an ID or data attribute that JavaScript expects
- accidentally nesting interactive controls inside each other

The browser is forgiving, which can make a mistake look almost correct while causing strange layout or JavaScript behavior.

## CSS: presentation and layout

CSS stands for **Cascading Style Sheets**. CSS selects HTML elements and assigns visual properties to them.

The main CSS file is `styles.css`.

## Anatomy of a CSS rule

```css
.primary-button {
  color: var(--paper);
  background: var(--terracotta);
  border-radius: 999px;
}
```

This contains:

- selector: `.primary-button`
- declarations inside `{ ... }`
- properties such as `color`
- values such as `var(--paper)`

Each declaration ends with a semicolon.

## Selectors

Selectors describe which elements receive a rule.

### Element selector

```css
body { margin: 0; }
```

This selects every `body` element.

### Class selector

```css
.menu-item { padding: 18px; }
```

The leading period means “elements whose class includes `menu-item`.”

### ID selector

```css
#order-form { display: grid; }
```

The leading `#` selects the element with that ID.

### Descendant selector

```css
.brand strong { font-size: 1.2rem; }
```

This selects `strong` elements inside an element with the `brand` class.

### Attribute selector

```css
[data-view-panel] { display: none; }
```

This selects elements that possess the `data-view-panel` attribute.

### State and pseudo-class selectors

```css
.primary-button:hover { background: var(--terracotta-dark); }
input:focus { border-color: var(--terracotta); }
```

`:hover` applies while a pointer is over the element. `:focus` applies while the field has keyboard or input focus.

## The cascade

The word **cascading** means multiple rules can apply to the same element. The browser resolves conflicts using:

1. importance
2. selector specificity
3. source order

For a simplified example:

```css
button { color: black; }
.primary-button { color: white; }
```

The class selector is more specific, so a button with `class="primary-button"` is white.

When two selectors have equal specificity, the later rule generally wins.

Avoid reaching for `!important` as a routine fix. It overrides the normal cascade and makes future changes harder to reason about.

## CSS variables

The app defines reusable custom properties:

```css
:root {
  --cream: #f7f0e5;
  --terracotta: #b75d43;
}
```

They are used with `var(...)`:

```css
body { background: var(--cream); }
```

Variables keep the color system consistent and make a theme change much easier.

## The box model

Every visible element is treated like a box:

```text
margin
  border
    padding
      content
```

- `content` is the text or children.
- `padding` is space inside the border.
- `border` surrounds the padding and content.
- `margin` is space outside the border.

The app uses:

```css
* { box-sizing: border-box; }
```

With `border-box`, a declared width includes the content, padding, and border. This makes layout sizes more predictable.

## Units

The stylesheet uses several kinds of units:

- `px`: fixed CSS pixels, useful for borders and precise spacing
- `rem`: relative to the root font size, useful for scalable text
- `%`: relative to a containing dimension
- `vw`: relative to viewport width
- `fr`: a fraction of available grid space

For example:

```css
font-size: clamp(2.7rem, 7vw, 5rem);
```

`clamp(minimum, preferred, maximum)` lets the heading grow with the screen without becoming too small or too large.

## Flexbox

Flexbox is useful for arranging items in one row or one column:

```css
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
```

- `display: flex` enables flex layout.
- `align-items` controls the cross-axis alignment.
- `justify-content` controls main-axis spacing.
- `gap` adds consistent space between children.

The header uses this to place the brand on one side and navigation on the other.

## CSS Grid

Grid is useful for two-dimensional layouts:

```css
.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
```

This creates two equal-width columns. The form uses Grid to place the main form content beside the order summary card.

## Responsive design and media queries

A media query activates rules only when a condition is true:

```css
@media (max-width: 760px) {
  #order-form { display: block; }
  .field-grid { display: block; }
}
```

On screens 760 CSS pixels wide or narrower, the side-by-side form becomes a vertical layout.

Responsive design is not a separate mobile website. It is the same HTML adapting through CSS.

## JavaScript: data and behavior

JavaScript is the programming language running in the browser. It stores data, performs calculations, listens for customer actions, changes the page, and communicates with Google Apps Script.

The browser JavaScript is in `app.js`.

## Values and types

JavaScript values have types. This app frequently uses:

```js
"Country loaf"  // string: text
12               // number
true             // Boolean
null             // intentional absence of a value
```

Strings are enclosed in quotation marks. Numbers are not.

This matters for prices:

```js
price: 12     // correct number
price: "$12"  // string; calculations would become unreliable
```

## Variables: `const` and `let`

Variables give values names:

```js
const ORDERS_KEY = "sarahDoughOrders";
let quantities = {};
```

- `const` means the variable cannot be assigned a different value later.
- `let` means it may be reassigned.

Use `const` by default. Use `let` when reassignment is part of the design.

A `const` object or array can still have its contents changed; `const` protects the binding, not every nested value.

## Arrays

An array is an ordered list:

```js
const PICKUP_SLOTS = [
  "Saturday · 9:00–10:00 am",
  "Saturday · 10:00–11:00 am",
];
```

Array positions start at zero:

```js
PICKUP_SLOTS[0] // first pickup slot
PICKUP_SLOTS[1] // second pickup slot
```

Arrays have methods. The app uses methods such as:

- `.map()` to transform every item into something new
- `.filter()` to keep matching items
- `.reduce()` to combine values into one result
- `.find()` to locate one matching item
- `.join()` to combine strings

## Objects

An object groups named properties:

```js
const bread = {
  id: "country-loaf",
  name: "Country loaf",
  price: 12,
};
```

Read a property with dot notation:

```js
bread.name
bread.price
```

The `MENU` variable is an array of objects: a list in which each item describes one bread.

## Functions

A function groups reusable instructions:

```js
function money(value) {
  return `$${value.toFixed(2)}`;
}
```

- `money` is the function name.
- `value` is a parameter supplied by the caller.
- `return` sends the result back.

Calling it:

```js
money(12) // returns "$12.00"
```

The app also uses arrow functions:

```js
const money = (value) => `$${value.toFixed(2)}`;
```

For this simple example, the arrow function and regular function have the same practical purpose.

## Template literals

Backticks create template literals, which can insert expressions with `${...}`:

```js
const message = `${item.quantity} × ${item.name}`;
```

If quantity is `2` and name is `Country loaf`, the result is:

```text
2 × Country loaf
```

The app uses template literals extensively to generate HTML from menu and order data.

## Transforming arrays

This app builds visible menu cards with `.map()`:

```js
MENU.map((item) => `<article>${item.name}</article>`).join("")
```

Step by step:

1. `.map()` runs once for each bread.
2. It returns an HTML string for that bread.
3. The result is an array of HTML strings.
4. `.join("")` combines them into one string without commas.

The total uses `.reduce()`:

```js
items.reduce((sum, item) => sum + item.price * item.quantity, 0)
```

Step by step:

1. Start `sum` at `0`.
2. Multiply each item's price by its quantity.
3. Add that amount to the running sum.
4. Return the final total.

## The DOM

The DOM is the browser's JavaScript representation of the HTML document.

The app defines two convenience functions:

```js
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
```

Then it can find elements with CSS selectors:

```js
$("#summary-total")      // one element with this ID
$$(".nav-button")       // all elements with this class
```

JavaScript changes content like this:

```js
$("#summary-total").textContent = "$24.00";
```

It changes HTML content like this:

```js
$("#summary-items").innerHTML = "<p>1 × Country loaf</p>";
```

Use `textContent` for plain text. `innerHTML` parses the string as HTML and must be handled carefully when customer-provided text is involved.

## Events

An event is something that happens in the browser: a click, a form submission, a changed field, or a key press.

The app listens for clicks:

```js
document.addEventListener("click", (event) => {
  // respond to the click
});
```

`event.target` is the element that was clicked. `.closest(...)` walks up the HTML tree to find a matching element:

```js
const change = event.target.closest("[data-change]");
```

This pattern is called **event delegation**. One listener on the document handles many buttons, including buttons created later by JavaScript.

## Form submission

The app attaches its submit function here:

```js
$("#order-form").addEventListener("submit", submitOrder);
```

Inside `submitOrder`:

```js
event.preventDefault();
```

Normally, submitting an HTML form reloads or navigates the page. `preventDefault()` stops that standard behavior so JavaScript can validate, submit, and show the custom confirmation screen.

## Conditions

Conditions select behavior:

```js
if (!items.length) {
  return;
}
```

`items.length` is the number of selected items. `!` means “not.” If there are no items, the function stops.

The app also uses a conditional expression:

```js
const visibleOrders = filter === "all" ? orders : orders.filter(...);
```

This means:

```text
if filter equals "all"
  use all orders
otherwise
  use the filtered orders
```

`===` is strict equality. It compares values without automatically converting their types.

## Asynchronous code and `fetch`

Network requests take time. JavaScript uses promises and `async`/`await` to handle work that finishes later:

```js
async function submitOrder(event) {
  await fetch(GOOGLE_APPS_SCRIPT_URL, options);
}
```

- `async` says the function performs asynchronous work.
- `fetch(...)` starts an HTTP request.
- `await` pauses this function until the request has been handed off or fails.
- Other browser work can continue while it waits.

The request includes:

```js
{
  method: "POST",
  mode: "no-cors",
  headers: { "Content-Type": "text/plain;charset=utf-8" },
  body: JSON.stringify(order)
}
```

- `POST` means the browser is sending data.
- `body` contains the order.
- `JSON.stringify` converts the JavaScript object to text.
- `text/plain` avoids a browser CORS preflight for this simple Apps Script endpoint.
- `no-cors` permits the one-way request, but prevents browser JavaScript from reading Google's response.

That final point is important: the site can know that the browser attempted the request, but it cannot use this setup to verify the resulting Sheet row. A test order must be checked in the Sheet.

## Errors and `try...catch`

The submission wraps the network request in:

```js
try {
  await fetch(...);
} catch (error) {
  alert("We couldn't send the order.");
  return;
}
```

If `fetch` throws a network-level error, execution jumps to `catch`. The customer sees a message and the confirmation screen is not shown.

Because the request uses `no-cors`, an error returned by Apps Script after receiving the request may not be visible to the browser. This is one tradeoff of the intentionally simple architecture.

## JSON

JSON stands for **JavaScript Object Notation**. It is a text format used to exchange structured data.

A submitted order looks conceptually like:

```json
{
  "name": "Jane Smith",
  "contact": "555-0100",
  "pickupSlot": "Saturday · 9:00–10:00 am",
  "items": [
    {
      "name": "Country loaf",
      "price": 12,
      "quantity": 2
    }
  ],
  "total": 24,
  "notes": "Porch pickup, please",
  "status": "new"
}
```

In browser JavaScript:

```js
JSON.stringify(order)
```

turns the object into JSON text.

In Google Apps Script:

```js
JSON.parse(e.postData.contents)
```

turns that text back into an object.

JSON does not support comments, functions, or trailing commas. Its property names and string values use double quotes.

## Browser storage

The prototype Baker view uses `localStorage`:

```js
localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
localStorage.getItem(ORDERS_KEY);
```

`localStorage` is a small key-value store inside one browser profile on one device. It is persistent across page reloads, but it is not shared with Sarah's other devices or customers.

That is why production orders go to Google Sheets instead. The local Baker view and Google Sheet are separate data stores.

## Escaping customer text

Customer-provided text must not be inserted into `innerHTML` as executable markup. The app uses:

```js
escapeHTML(order.name)
```

to replace characters such as `<`, `>`, and `&` with safe HTML entities before placing customer text into generated HTML.

This is a basic defense against HTML injection. Prefer `textContent` whenever generated markup is not actually needed.

## Google Apps Script: server-side JavaScript

Google Apps Script uses JavaScript syntax, but it runs on Google's servers rather than in the customer's browser.

The script file uses `.gs` instead of `.js`, but concepts such as variables, functions, arrays, objects, conditions, and JSON are the same.

## Browser JavaScript versus Apps Script

| Browser JavaScript | Google Apps Script |
| --- | --- |
| Runs in the customer's browser | Runs on Google's servers |
| Can use `document` and the DOM | Has no page DOM in this project |
| Can react directly to clicks | Reacts to web requests through `doGet` and `doPost` |
| Can use `localStorage` | Can use Google services such as `SpreadsheetApp` |
| Is published through GitHub Pages | Is published through an Apps Script deployment |

Code in `app.js` cannot directly call `SpreadsheetApp`. Code in `Code.gs` cannot directly change the customer's open page.

## Web-app entry points

Google calls specially named functions based on the HTTP request:

```js
function doGet() {
  // handles a normal GET request
}

function doPost(e) {
  // handles a POST request containing an order
}
```

The `e` object is created by Google. For an order submission, the raw request body is available through:

```js
e.postData.contents
```

## Google services

Apps Script provides service objects that do not exist in ordinary browser JavaScript:

```js
var sheet = SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName("Orders");
```

This asks Google for:

1. the spreadsheet attached to this Apps Script project
2. the sheet tab named `Orders`

Then:

```js
sheet.appendRow([new Date(), order.name, order.contact]);
```

adds one row. The array order maps left-to-right across spreadsheet columns.

## `var` in Apps Script

The Apps Script currently uses `var`:

```js
var order = JSON.parse(...);
```

Modern JavaScript generally prefers `const` and `let`, but `var` remains valid and is common in broadly compatible Apps Script examples. The key difference is scope: `var` is function-scoped, while `let` and `const` are block-scoped.

For this small script, either style can work if used consistently and carefully.

## Apps Script deployment versions

The repository copy, Apps Script editor, and deployed web app are three distinct states:

```text
google-apps-script/Code.gs in Git
             |
             | manually copy changes
             v
Code in the Apps Script editor
             |
             | Deploy > Manage deployments > New version
             v
Live /exec web app
```

Changing and pushing `Code.gs` only updates GitHub. It does not update the Apps Script editor.

Saving in the Apps Script editor updates the editable project. It does not necessarily update the deployed `/exec` version.

After changing server code, create a new deployment version and test a real order.

## Reading a complete order submission

Here is the submission path in order:

1. The customer changes quantities.
2. `renderSummary()` recalculates the visible summary.
3. The customer submits `#order-form`.
4. The form's `submit` event calls `submitOrder(event)`.
5. `selectedItems()` creates an array of breads whose quantities are greater than zero.
6. The browser validates the name, contact, and pickup fields.
7. JavaScript creates the `order` object.
8. `JSON.stringify(order)` converts it to JSON text.
9. `fetch(...)` sends that text to the Apps Script `/exec` URL.
10. Google calls `doPost(e)`.
11. `JSON.parse(...)` recreates the order object on Google's server.
12. Apps Script validates the required fields.
13. `sheet.appendRow(...)` writes the order to the `Orders` tab.
14. The browser shows its confirmation view after the request handoff succeeds.

Tracing a feature through all four layers is often the best way to understand or debug it.

## How to approach a new feature

Before editing, ask which layer owns the change.

### Example: add a dietary note field

This touches several layers:

1. **HTML:** add a labeled input.
2. **JavaScript:** read the input and add it to the order object.
3. **JSON:** the new property is automatically included when the object is stringified.
4. **Apps Script:** read the property and place it into a row.
5. **Google Sheet:** add a matching column.
6. **CSS:** style is likely inherited from the existing `.field` rules.

### Example: change the button color

This is CSS only. No HTML, JavaScript, Sheet, or Apps Script change is necessary.

### Example: change a price

This is a JavaScript data change in `MENU`. The total and submitted order update automatically.

### Example: add pickup capacity limits

This is not just a label change. It would require shared server-side state and validation so two customers cannot claim the final place at the same time. JavaScript in one customer's browser cannot safely enforce a global capacity by itself.

## Debugging by layer

When something breaks, identify the last layer that worked.

### HTML or CSS problem

Symptoms:

- content is missing or in the wrong place
- layout is broken
- styles do not apply

Inspect the element with browser developer tools. Check its classes, matched CSS rules, dimensions, and overridden declarations.

### Browser JavaScript problem

Symptoms:

- buttons do nothing
- totals do not update
- menu cards do not appear
- the page shows only static HTML

Open the browser console and look for the first red error. Also run:

```sh
node --check app.js
```

The first error is often the root cause; later errors may be consequences.

### Network or Apps Script problem

Symptoms:

- the form appears to submit but no Sheet row arrives
- Apps Script shows a failed execution

Check:

1. the Network panel in browser developer tools
2. the Apps Script **Executions** page
3. the deployed `/exec` URL
4. deployment access settings
5. the `Orders` tab name
6. whether the current Apps Script code was deployed as a new version

### Sheet mapping problem

Symptoms:

- values arrive under the wrong headings
- fields are missing from rows

Compare the Sheet's left-to-right columns with the left-to-right values in `appendRow([...])`.

## Practice exercises

These exercises move from low risk to more involved. Make one change at a time, test locally, and review `git diff` before committing.

### Exercise 1: change static copy

In `index.html`, change the sentence below the main heading. Refresh locally and identify which CSS rule controls its appearance.

Concepts: HTML text content, classes, CSS selectors.

### Exercise 2: add a menu item

Add a new bread object to `MENU`. Confirm the card, quantity control, summary, and total all work without additional HTML.

Concepts: arrays, objects, data-driven rendering, `.map()`.

### Exercise 3: adjust the theme

Change `--terracotta` and `--terracotta-dark` in `styles.css`. Inspect all places those variables affect.

Concepts: CSS variables, cascade, reusable design tokens.

### Exercise 4: trace an event

Use the browser console or temporary `console.log(...)` statements to follow a plus-button click through the document click listener, the `quantities` object, and `renderSummary()`.

Concepts: events, data attributes, state, DOM updates.

Remove debugging logs before committing unless they are intentionally useful.

### Exercise 5: add an optional field

Add an optional “How did you hear about us?” field, include it in the order object, add a Sheet column, and update `Code.gs` to write it.

Concepts: full-stack data flow, HTML forms, JavaScript objects, JSON, Apps Script, Sheet schemas, deployment versions.

## What to learn next

This app is a good foundation for these topics:

1. Browser developer tools and the JavaScript console
2. Semantic and accessible HTML
3. Flexbox and Grid
4. Array methods such as `map`, `filter`, and `reduce`
5. HTTP methods and JSON APIs
6. Input validation and web security
7. Git branches and pull requests
8. Automated tests

The best learning method here is to make one small change, predict what should happen, test it, inspect the result, and then commit it as a known-good version.
