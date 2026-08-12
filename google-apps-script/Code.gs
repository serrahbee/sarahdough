/**
 * Sarah Dough order receiver.
 *
 * Paste this file into Extensions > Apps Script from the Sarah Dough Orders
 * spreadsheet. The spreadsheet tab must be named "Orders" and have this row:
 * Timestamp | Name | Contact | Pickup | Items | Total | Notes | Status
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
  if (!sheet) throw new Error('Missing sheet tab named "Orders".');

  var order = JSON.parse((e.postData && e.postData.contents) || "{}");
  if (!order.name || !order.contact || !order.pickupSlot || !order.items || !order.items.length) {
    return jsonResponse({ ok: false, error: "Missing required order fields." });
  }

  var items = order.items.map(function(item) {
    return item.quantity + " x " + item.name;
  }).join("; ");

  sheet.appendRow([
    new Date(),
    order.name,
    order.contact,
    order.pickupSlot,
    items,
    Number(order.total) || 0,
    order.notes || "",
    "New"
  ]);

  return jsonResponse({ ok: true });
}

function doGet() {
  return jsonResponse({ ok: true, service: "Sarah Dough order receiver" });
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
