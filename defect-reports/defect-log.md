# WholeCart Defect Log

**Environment:** Assigned `manish-dba39f` demo copy  
**Execution dates:** 2026-11-14 and 2026-11-15

**Scope:** Browser UI and integration API

**Status:** This log includes thirteen UI defects and two integration API defects.

## WC-002 — Checkout success message omits required wording and order number

- **Severity:** S4 Minor
- **Requirement:** Screen 5.2 Checkout
- **Preconditions/data:** Buyer test account; SKU-0478; 11 cases; delivery 2026-11-15, 08:00–11:00.
- **Steps:** Add the product, place the order, and inspect the success message.
- **Expected:** “Your order has been placed. Order number: {numbers}”.
- **Actual:** Only “Order placed!” is shown; the number appears in order history, not in the success message.
- **Evidence:** [Checkout success screenshot](../evidence/screenshots/WC-002-order-success-message.png); case CHK-10.

## WC-003 — Invalid actions remain available on a cancelled order

- **Severity:** S4 Minor
- **Requirements:** BR-13, BR-14, BR-17; order detail UI
- **Preconditions/data:** A cancelled order visible in buyer order history.
- **Steps:** Open the cancelled order and inspect its available actions.
- **Expected:** A cancelled order should not offer cancellation, slot change/redelivery, or refund/exchange actions; reorder may remain available.
- **Actual:** Cancel, Change slot, Request redelivery, and Send request remain enabled. No action was submitted, so backend behavior was not tested.
- **Evidence:** [Cancelled-order screenshot](../evidence/screenshots/WC-003-cancelled-order-actions.png); case ORD-04.

## WC-007 — Invoice UI omits mandatory supply details and delivery-fee line

- **Severity:** S1 Blocker
- **Requirements:** CR-09, BR-19, screen 5.4 Invoice
- **Preconditions/data:** Delivered invoices INV-00005, INV-00071, and INV-00073; use the buyer GSTIN to determine the expected state name and code.
- **Steps:** Open the delivered invoices in the buyer UI. Inspect seller identity, supply details, buyer details, line items, tax, fee, and total.
- **Expected:** Show supply type B2B, the place-of-supply state name and code derived from the buyer GSTIN, seller GSTIN, buyer name/GSTIN/address, all lines, tax by rate, a separate delivery-fee line, and a total matching the order.
- **Actual:** The UI omits the supply type, place of supply, seller GSTIN, and the separate delivery-fee line. For INV-00071 and INV-00073 the displayed invoice totals still match their order totals: ₹504.36 and ₹2,950.00.
- **Evidence:** [INV-00005 screenshot](../evidence/screenshots/CR-09-invoice-missing-supply-details.png), [INV-00073 CR-09 screenshot](../evidence/screenshots/INV-00073-CR09-invoice-missing-fields.png), [INV-00071 calculation](../evidence/screenshots/INV-00071-invoice-ui-calculation.png), and [INV-00073 calculation](../evidence/screenshots/INV-00073-invoice-ui-calculation.png). Cases INV-02, INV-04, INV-05, and INV-CR09-STATE.

## WC-008 — Blank login fields show raw validation response

- **Severity:** S4 Minor
- **Requirement:** Login UI validation
- **Preconditions/data:** Logged out at the login page.
- **Steps:** Submit the form (1) with both fields blank, (2) with username blank, and (3) with password blank.
- **Expected:** Remain on the login page and show clear required-field messages; do not expose raw server output.
- **Actual:** Each submission renders raw HTTP 422 validation JSON instead of clear field-level messages.
- **Evidence:** [Both blank](../evidence/screenshots/UI-LOGIN-BOTH-BLANK-422.png), [username blank](../evidence/screenshots/UI-LOGIN-BLANK-USERNAME-422.png), and [password blank](../evidence/screenshots/UI-LOGIN-BLANK-PASSWORD-422.png). Cases LOGIN-EMPTY-01 through LOGIN-EMPTY-03.

## WC-010 — Cart quantity control and summary layout differ from design

- **Severity:** S4 Minor
- **Requirement:** BR-03, screen 5.1 Cart
- **Preconditions/data:** Buyer cart with one product line at quantity 20.
- **Steps:** Compare the populated cart with the screen 5.1 wireframe; inspect the quantity control, net total, and checkout button placement.
- **Expected:** A dropdown with quantities 1–20; the net total and Proceed button follow the wireframe's lower-right placement. Quantities above 20 are added from the product page.
- **Actual:** The quantity control is a textbox with an Update button. The net total and Proceed button are left-aligned below the table instead of at the wireframe's lower right.
- **Evidence for CART-05 and DESIGN-51** · [Cart §5.1 requirement and wireframe](../evidence/screenshots/DESIGN-51-cart-wireframe.png) · [Actual cart screenshot](../evidence/screenshots/UI-CART-QTY-CONTROL.png)

## WC-011 — Invoice total has insufficient visual contrast

- **Severity:** S3 Major
- **Requirement:** BR-19, screen 5.4 Invoice
- **Preconditions/data:** Delivered invoice INV-00073.
- **Steps:** Open the invoice and inspect the total text against the invoice background.
- **Expected:** The total is clearly readable and visually distinguishable from the background.
- **Actual:** The total is rendered in very light text on the white invoice panel and is difficult to read. Selecting the text makes the ₹2,950.00 total visible in the capture below.

  ![Actual invoice INV-00073 with the ₹2,950.00 total selected](../evidence/screenshots/WC-011-invoice-total-selected.png)

- **Evidence for DESIGN-54** · [Invoice with no text selected](../evidence/screenshots/INV-00073-invoice-ui-calculation.png) · [Invoice with total selected](../evidence/screenshots/WC-011-invoice-total-selected.png)

## WC-012 — Checkout accepts quantities above displayed stock

- **Severity:** S1 Blocker
- **Requirement:** BR-01; case CART-09
- **Preconditions/data:** SKU-0001 displayed 161 pieces in stock. Cart contained 15 cases of 12 pieces plus 21 pieces (201 pieces total).
- **Steps:** Proceed to checkout and submit the cart.
- **Expected:** Checkout prevents an order that exceeds available stock.
- **Actual:** Order WC-01072-1 was placed for 201 pieces, 40 more than the displayed stock. The test order was canceled immediately.
- **Evidence:** [Overstock cart](../evidence/screenshots/CART-09-overstock-cart-before-checkout.png) and [placed order](../evidence/screenshots/CART-09-overstock-order-placed.png).

## WC-013 — Same-day checkout is allowed at the cutoff instant

- **Severity:** S3 Major
- **Requirement:** BR-06; case SLOT-04
- **Preconditions/data:** Operator store clock fixed at 10:00:00; 10:00 cutoff.
- **Steps:** Select today's 14:00–17:00 slot and submit checkout at exactly 10:00.
- **Expected:** Same-day delivery is unavailable because orders must be placed before 10:00.
- **Actual:** The slot remained enabled and order WC-01073-1 was placed for same-day delivery. The test order was canceled immediately. At 10:00:01, all same-day slots were disabled.
- **Evidence:** [At-cutoff slot state](../evidence/screenshots/SLOT-04-at-cutoff-100000.png), [order accepted at cutoff](../evidence/screenshots/SLOT-04-order-accepted-at-cutoff.png), and [after-cutoff state](../evidence/screenshots/SLOT-05-after-cutoff-100001.png).

## WC-014 — Zero-stock products remain visible to buyers

- **Severity:** S3 Major
- **Requirement:** BR-02; case CAT-02
- **Preconditions/data:** Buyer searches found SKU-0064 and SKU-0073; each product detail displayed 0 pieces in stock.
- **Steps:** Search each SKU in the buyer catalogue and open the result.
- **Expected:** Products with no stock are absent from catalogue and search results.
- **Actual:** Both zero-stock SKUs appeared in search results and remained accessible on buyer product pages.
- **Evidence:** [SKU-0073 search result](../evidence/screenshots/CAT-02-search-includes-SKU-0073.png), [SKU-0064 product page](../evidence/screenshots/CAT-02-zero-stock-SKU-0064-visible.png), and [SKU-0073 product page](../evidence/screenshots/CAT-02-zero-stock-SKU-0073-visible.png).

## WC-015 — Monthly statement includes cancelled orders

- **Severity:** S3 Major
- **Requirement:** BR-20; case INV-06
- **Preconditions/data:** Buyer statement for November 2026 contains delivered and canceled orders.
- **Steps:** Open Statements and inspect the November 2026 statement.
- **Expected:** Only orders delivered in the selected month are listed; cancelled orders are excluded.
- **Actual:** The statement listed multiple canceled orders, including WC-01072-1, WC-01073-1, and WC-01074-1, and included their amounts in Orders total.
- **Evidence:** [November statement](../evidence/screenshots/INV-06-statement-includes-canceled-orders.png).

## WC-016 — Buyer inquiry entry point does not open a form

- **Severity:** S3 Major
- **Requirement:** CR-11; case INQ-01
- **Preconditions/data:** Buyer opened a delivered order in the order history.
- **Steps:** Select Message seller; also try the buyer inquiry route `/inquiries`.
- **Expected:** A buyer can create and review an inquiry tied to the correct order.
- **Actual:** Message seller only added `#` to the URL and opened no form. `/inquiries` returned 404.
- **Evidence:** [Order history after selecting Message seller](../evidence/screenshots/INQ-01-message-seller-no-form.png).

## WC-017 — Multi-seller checkout bypasses the approved per-seller minimum

- **Severity:** S2 Critical
- **Requirement:** CR-07 / BR-04; case CHK-02
- **Preconditions/data:** Checkout with FreshFarm Foods at ₹993.60 net and Coastal Beverages at ₹2,649.60 net; combined net ₹3,643.20. CR-07 sets the approved minimum at ₹2,000 net per seller.
- **Steps:** Add both sellers' products, proceed to checkout, and place the order.
- **Expected:** Checkout blocks the FreshFarm sub-order below ₹2,000 net, even though the combined cart is above the minimum.
- **Actual:** Checkout created WC-01076-1 for FreshFarm at ₹993.60 net (₹1,043.28 total) and WC-01076-2 for Coastal at ₹2,649.60 net (₹3,126.53 total). Both sub-orders were canceled after the observation.
- **Evidence:** [Checkout seller totals](../evidence/screenshots/CHK-02-two-seller-total-above-min-one-below.png), [split order history](../evidence/screenshots/CHK-07-multi-seller-checkout-split.png), [both cancellations](../evidence/screenshots/CHK-07-WC-01076-both-canceled.png).

## WC-018 — Expired OPS-14 free-delivery pilot still waives checkout fees

- **Severity:** S2 Critical
- **Requirement:** BR-08 / OPS-14; case CHK-03
- **Preconditions/data:** Coastal Beverages net ₹2,649.60 (below the ₹3,000 free-delivery threshold) placed on 2026-11-14. The configured delivery fee is ₹100 plus applicable tax; the checkout banner says the pilot runs only through 2026-10-31.
- **Steps:** Review the release notes for an approved OPS-14 extension, then inspect the checkout fee for the below-threshold seller.
- **Expected:** After the stated pilot expiry, and with no approved extension listed in the release notes, apply the configured ₹100 fee and ₹18 fee tax.
- **Actual:** The UI release notes list CR-07 and CR-09 as approved and CR-11 as deferred; they do not list an OPS-14 extension. Checkout nevertheless displayed the expired pilot banner and charged ₹0 delivery for the Coastal sub-order.
- **Evidence:** [Checkout totals and expired pilot banner](../evidence/screenshots/CHK-02-two-seller-total-above-min-one-below.png), [release notes](../evidence/screenshots/OPS-14-release-notes-no-approved-extension.png), [configured delivery fee](../evidence/screenshots/UI-OPERATOR-SETTINGS.png).

## WC-019 — Seller CSV import reports malformed rows as imported

- **Severity** · S3 Major
- **Requirement and cases** · IF-01, CSV-04 and CSV-05
- **Environment and data** · Assigned WholeCart demo, seller1, 15 November 2026. Test SKU prefix `QA-CSV-A8FDC0A2`.
- **Steps** · Submit a CSV with one valid row and one row with piece price `bad` to `POST /api/seller/products/import`. Submit a second CSV with four rows containing tax rate 7, stock −1, case size 0, and piece price −1 respectively.
- **Expected** · Import the valid row and report the line number and reason for each invalid row.
- **Actual** · Both uploads returned HTTP 200. The mixed file reported 2 imports and the invalid-only file reported 4 imports. Both returned `errors: []`. The malformed SKUs were absent in the later seller product readback.
- **Evidence** · [CSV-04 response](../evidence/api-logs/integration-follow-up.txt#L7) · [CSV-05 response](../evidence/api-logs/integration-follow-up.txt#L8) · [CSV-04 triage](triage/CSV-04.md) · [CSV-05 triage](triage/CSV-05.md)

## WC-020 — Logistics CSV reverses delivery slot times

- **Severity** · S3 Major
- **Requirement and case** · IF-02, LOG-SLOT
- **Environment and data** · Assigned WholeCart demo, 15 November 2026. Order WC-01082-1 booked for 16 November, 08:00–11:00, with two 12-piece cases.
- **Steps** · Place the order as the buyer, accept it as the seller, and generate a logistics export as the operator.
- **Expected** · The accepted order row shows `slot_start=08:00`, `slot_end=11:00`, and `pieces=24`.
- **Actual** · The row showed `slot_start=11:00`, `slot_end=08:00`, and `pieces=24`. The test order was cancelled and excluded from the next export.
- **Evidence** · [Export result](../evidence/api-logs/integration-follow-up.txt#L31) · [LOG-SLOT triage](triage/LOG-SLOT.md)

## Reproduction safety

Do not use any state-changing scenario against production. Most lifecycle and order mutation cases in the UI sheet are marked NOT RUN.

## WC-021 — Buyer can open another buyer’s invoice

Buyer1 could open a foreign invoice at `/invoices/5`. The page rendered details for Café Dosa Corner. Severity S1 Blocker under BR-21. [INV-10 reproduction and evidence](triage/INV-10.md)
