const MENU = [
  { id: "country-loaf", name: "Country loaf", description: "Naturally leavened · 800g", price: 12 },
  { id: "olive-sourdough", name: "Olive sourdough", description: "Castelvetrano olives · 800g", price: 15 },
  { id: "cinnamon-rolls", name: "Cinnamon rolls", description: "Box of 6 · cream cheese glaze", price: 18 },
  { id: "focaccia", name: "Rosemary focaccia", description: "Sea salt · olive oil · 9 × 13 in", price: 14 },
];

const PICKUP_SLOTS = ["Saturday · 9:00–10:00 am", "Saturday · 10:00–11:00 am", "Saturday · 11:00 am–12:00 pm"];
const ORDERS_KEY = "sarahDoughOrders";
// Paste Sarah's deployed Apps Script /exec URL here before launch.
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwZMPq0dpKhtri1AROK2DCchDAs0_G30aGOOyGP1P2QZUZhyOQhn9SaBlwXW0v7-4l7/exec";
let quantities = Object.fromEntries(MENU.map((item) => [item.id, 0]));

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const money = (value) => `$${value.toFixed(2)}`;
const getOrders = () => JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
const saveOrders = (orders) => localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

function renderMenu() {
  $("#menu-grid").innerHTML = MENU.map((item) => `
    <article class="menu-item" data-item-id="${item.id}">
      <div><h3>${item.name}</h3><p>${item.description}</p></div>
      <div class="menu-item-bottom"><span class="price">${money(item.price)}</span><div class="quantity-control"><button type="button" data-change="-1" data-item="${item.id}" aria-label="Remove one ${item.name}">−</button><span class="quantity" data-quantity="${item.id}">0</span><button type="button" data-change="1" data-item="${item.id}" aria-label="Add one ${item.name}">+</button></div></div>
    </article>`).join("");
  $("#pickup-slot").innerHTML += PICKUP_SLOTS.map((slot) => `<option value="${slot}">${slot}</option>`).join("");
}

function selectedItems() {
  return MENU.filter((item) => quantities[item.id] > 0).map((item) => ({ ...item, quantity: quantities[item.id] }));
}

function total(items = selectedItems()) { return items.reduce((sum, item) => sum + item.price * item.quantity, 0); }

function renderSummary() {
  const items = selectedItems();
  $("#summary-title").textContent = items.length ? `${items.reduce((sum, item) => sum + item.quantity, 0)} item${items.length === 1 && items[0].quantity === 1 ? "" : "s"}` : "Nothing selected yet";
  $("#summary-total").textContent = money(total(items));
  $("#summary-items").innerHTML = items.length ? items.map((item) => `<div class="summary-line"><span>${item.quantity} × ${item.name}</span><span>${money(item.price * item.quantity)}</span></div>`).join("") : `<p class="empty-summary">Add a loaf to get started.</p>`;
  MENU.forEach((item) => {
    $(`[data-quantity="${item.id}"]`).textContent = quantities[item.id];
    $(`[data-item-id="${item.id}"]`).classList.toggle("has-quantity", quantities[item.id] > 0);
  });
}

function showView(view) {
  $$(".nav-button").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  $$(`[data-view-panel]`).forEach((panel) => panel.classList.toggle("active", panel.dataset.viewPanel === view));
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (view === "baker") renderDashboard();
}

function resetForm() {
  $("#order-form").reset();
  quantities = Object.fromEntries(MENU.map((item) => [item.id, 0]));
  renderSummary();
}

function formatDate(iso) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
}

function renderDashboard() {
  const orders = getOrders();
  const activeOrders = orders.filter((order) => order.status !== "picked-up");
  const itemCount = activeOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  const revenue = activeOrders.reduce((sum, order) => sum + order.total, 0);
  $("#dashboard-stats").innerHTML = `<div class="stat"><strong>${activeOrders.length}</strong><span>orders to pack</span></div><div class="stat"><strong>${itemCount}</strong><span>items to bake</span></div><div class="stat"><strong>${money(revenue)}</strong><span>expected total</span></div>`;
  const filter = $("#status-filter").value;
  const visibleOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter);
  $("#orders-list").innerHTML = visibleOrders.length ? visibleOrders.map(orderRow).join("") : `<div class="empty-orders">No orders here yet. When someone submits the form, they will show up on this list.</div>`;
}

function orderRow(order) {
  const items = order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ");
  return `<article class="order-row"><div class="order-person"><strong>${escapeHTML(order.name)}</strong><small>${escapeHTML(order.contact)}</small></div><div class="order-items">${escapeHTML(items)}<small>${escapeHTML(order.notes || "No notes")}</small></div><div class="order-time">${escapeHTML(order.pickupSlot)}<small>${formatDate(order.createdAt)}</small></div><select class="status-select" data-order-id="${order.id}" aria-label="Update order status"><option value="new" ${order.status === "new" ? "selected" : ""}>New</option><option value="confirmed" ${order.status === "confirmed" ? "selected" : ""}>Confirmed</option><option value="picked-up" ${order.status === "picked-up" ? "selected" : ""}>Picked up</option></select></article>`;
}

function escapeHTML(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character])); }

async function submitOrder(event) {
  event.preventDefault();
  const items = selectedItems();
  const form = event.currentTarget;
  if (!items.length) { $("#menu-grid").classList.add("shake"); setTimeout(() => $("#menu-grid").classList.remove("shake"), 350); return; }
  if (!form.reportValidity()) return;
  const order = { id: `order-${Date.now()}`, createdAt: new Date().toISOString(), name: $("#customer-name").value.trim(), contact: $("#customer-contact").value.trim(), pickupSlot: $("#pickup-slot").value, notes: $("#order-notes").value.trim(), items, total: total(items), status: "new" };
  if (GOOGLE_APPS_SCRIPT_URL) {
    try {
      // Apps Script accepts this as text/plain, which avoids a browser preflight.
      await fetch(GOOGLE_APPS_SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(order) });
    } catch (error) {
      alert("We couldn't send the order. Please try again or text Sarah directly.");
      return;
    }
  } else {
    // Local fallback keeps the prototype testable before Apps Script is deployed.
    saveOrders([order, ...getOrders()]);
  }
  $("#confirmation-name").textContent = order.name.split(" ")[0];
  $("#confirmation-details").innerHTML = `<strong>${order.items.map((item) => `${item.quantity} × ${escapeHTML(item.name)}`).join("<br />")}</strong><br />${escapeHTML(order.pickupSlot)}<br />Total: ${money(order.total)}`;
  resetForm();
  showView("confirmation");
}

function exportCSV() {
  const rows = [["Order date", "Name", "Contact", "Pickup", "Items", "Total", "Status", "Notes"], ...getOrders().map((order) => [formatDate(order.createdAt), order.name, order.contact, order.pickupSlot, order.items.map((item) => `${item.quantity} x ${item.name}`).join("; "), money(order.total), order.status, order.notes || ""])];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); link.download = "sarah-dough-orders.csv"; link.click(); URL.revokeObjectURL(link.href);
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-view]");
  if (nav) showView(nav.dataset.view);
  const change = event.target.closest("[data-change]");
  if (change) { const id = change.dataset.item; quantities[id] = Math.max(0, quantities[id] + Number(change.dataset.change)); renderSummary(); }
  const action = event.target.closest("[data-action]");
  if (action?.dataset.action === "new-order") { resetForm(); showView("order"); }
  if (action?.dataset.action === "export") exportCSV();
  if (action?.dataset.action === "clear-orders" && getOrders().length && confirm("Clear all orders saved in this browser?")) { saveOrders([]); renderDashboard(); }
});
document.addEventListener("change", (event) => {
  if (event.target.id === "status-filter") renderDashboard();
  if (event.target.matches("[data-order-id]")) { const orders = getOrders(); const order = orders.find((item) => item.id === event.target.dataset.orderId); if (order) { order.status = event.target.value; saveOrders(orders); renderDashboard(); } }
});
$("#order-form").addEventListener("submit", submitOrder);
renderMenu();
renderSummary();
