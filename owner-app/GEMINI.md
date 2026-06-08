# Owner App Instructions (GEMINI.md)

This document provides specific guidance for the `owner-app` sub-project.

## Architecture
- **Tech Stack:** React (Vite), Tailwind CSS, Lucide React icons.
- **API Integration:** Uses a custom `api` wrapper in `src/utils/api.js` pointing to the shared backend.
- **State Management:** Context providers in `src/context/` (e.g., `StoreDataContext.jsx`).

## Conventions
- **Formatting:** 
  - Always use `formatOrderId` from `src/utils/format.js` for displaying order IDs.
  - Use `formatTHB` for currency display.
- **Components:** 
  - Keep components in `src/components/` organized by feature (e.g., `orders/`, `stock/`).
  - Shared/generic components go into `src/components/common/`.
- **Pages:** Main views are located in `src/pages/`.

## Recent Updates
- **Order ID Display:** Standardized to match the customer-facing app (prefixed with # and using short IDs where applicable).
- **Search Logic:** Search on the Orders page now supports searching by both the raw database ID and the formatted/human-readable ID.
