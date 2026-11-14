# Questions and assumptions log

| ID | Question for product owner | Working assumption |
|---|---|---|
| Q-01 | Which API values identify an order, a seller sub-order, and a delivery slot in each response? | Use order number as the stable external identifier; map other fields from an observed response before enabling assertions. |
| Q-02 | Which fields and units are required in each `/api/seller/orders/{id}/{action}` action? | Use only documented action names/UI-supported actions; do not guess request bodies. |
| Q-03 | What are the exact operator setting keys, validation ranges, and how is the fixed store clock restored? | Capture current settings before changing them and restore in `finally`; block clock-boundary automation until the restore method is confirmed. |
| Q-04 | Does the store clock use India Standard Time, and is the 10:00 cutoff inclusive? | Use application timezone; BR-06 says “before”, so exactly 10:00 is unavailable. |
| Q-05 | Does slot capacity count checkout attempts, buyer orders, or seller sub-orders? | Assume one buyer checkout/order consumes one slot capacity unit unless the UI/API proves otherwise. |
| Q-06 | How is an idempotency key represented, given `CheckoutIn` has only date and slot? | Repeating the same checkout must not create another checkout/sub-order, regardless of the response to the replay. |
| Q-07 | Is the five-minute cancellation interval measured from checkout creation or seller acceptance, and what is authoritative clock precision? | Measure from checkout creation; allow cancellation at exactly 5:00 and reject at 5:00.001. |
| Q-08 | How are cancellation/refund stock quantities handled after partial refunds, and may exchange and refund coexist? | Refund/exchange quantities share a per-line cap equal to the ordered quantity; no combined overage is allowed. |
| Q-09 | Is delivery fee charged on net merchandise value before or after refunds, and how is it treated in partial refund? | BR-08 bases it on sub-order net; full/partial refund includes tax paid on refunded quantities. Fee refund treatment requires product-owner confirmation. |
| Q-10 | Which invoice fields are mandatory beyond design doc and CR-09, including seller supply state and invoice tax breakdown? | Require seller/buyer identity and GSTIN, buyer address, B2B, buyer-GSTIN-derived supply state/code, line details, fee, tax totals and order-total match. |
| Q-11 | For monthly statements, is month based on delivery date and how are refunds approved after that month reflected? | Include delivered orders by delivery month and subtract approved refunds in the requested statement; confirm cross-month refund policy. |
| Q-12 | Does “read every page returns each seller's orders exactly once” include cancelled/delivered historical orders? | Expect all seller-owned orders exactly once across partner pages; confirm retention and ordering. |
| Q-13 | Where are partner API keys provisioned, and which seller's key is available for this copy? | Store a test-only key in `WC_SELLER_API_KEY`; never check it into source control. |
| Q-14 | How are buyer-only and seller-only response fields checked where the API returns generic errors? | Require no foreign order data and a consistent 401/403 or non-disclosing 404. |
| Q-15 | Can a seller have multiple lines with the same product in different units? How should case pricing be rounded? | Treat `(product, unit)` as a cart line; use the displayed/configured case price exactly. |
| Q-16 | Can slot changes after a failed delivery select any date in the next 7 days, including same-day only before cutoff? | Apply BR-05/06 to redelivery and slot changes identically. |
| Q-17 | What is the scope of request rate limiting (per user, IP, or copy) and how does `/api/metrics` represent it? | Load-test at whole-copy level, cap the generated load at 50 RPS and record metrics before/after. |
| Q-18 | Can test data be reset, and may test orders/refunds/settings be left in the copy? | No reset endpoint is documented. Use reserved test accounts and record all created IDs; do not run mutations until approved. |
| Q-19 | What login failure status and error format are contractual? | Any 4xx is acceptable for invalid credentials; 5xx is a defect. |
| Q-20 | Are inquiry attachments excluded from this release? | Yes; CR-11 is deferred. |
