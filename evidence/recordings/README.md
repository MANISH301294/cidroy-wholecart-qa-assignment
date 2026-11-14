# Five-minute walkthrough

Record the assigned demo in your own voice. Use captured evidence for inventory or checkout actions that change shared state.

- **0:00–0:25** · Introduce the assigned demo, roles and hold recommendation.
- **0:25–1:40** · Open buyer catalogue and cart. Show the stock shown in the captured UI and how checkout still accepted 201 pieces from 161 available. Explain the separate API race result and its negative stock. [UI triage](../../defect-reports/triage/CART-09.md) · [API triage](../../defect-reports/triage/API-STOCK-RACE.md)
- **1:40–2:55** · Show the two-seller checkout evidence. The combined net was ₹3,643.20, but the FreshFarm sub-order was only ₹993.60 against the ₹2,000 per-seller minimum. [Triage](../../defect-reports/triage/CHK-02.md)
- **2:55–4:10** · Open the invoice page and show where supply type and place of supply should appear. Explain that the invoice should show B2B as the supply type and the state name and code derived from the buyer’s GSTIN as the place of supply. [Triage](../../defect-reports/triage/INV-CR09-STATE.md)
- **4:10–5:00** · Show an exact SKU search and a partial-name search. Explain how the AI-assisted draft still called search broken and how the later retest and case sheet exposed the stale conclusion. End with the release decision. [AI correction](../../ai-usage/sessions.md)

Save the finished recording as `wholecart-walkthrough.mp4` in this folder or add its reviewer-accessible link here.
