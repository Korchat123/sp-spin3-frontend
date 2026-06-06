# Project Gemini Guidelines

This file serves as the foundational mandate for all AI agent interactions within this project. Adhere to these standards to ensure consistency, security, and quality across the codebase.

## 🏗 Project Architecture

The project is structured as a monorepo consisting of a backend and a frontend application.

### Backend (`sp-spin3-backend`)
- **Runtime**: Node.js (ESM)
- **Framework**: Express
- **Database**: MongoDB (Mongoose)
- **Realtime**: WebSockets (ws)
- **Media**: Cloudinary
- **Pattern**: Module-based architecture (logic grouped by feature in `src/modules`).

### Frontend (`sp-spin3-frontend`)
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4
- **Routing**: React Router
- **Icons**: Lucide React
- **Maps**: Leaflet

---

## 📁 Frontend Source Structure

```
src/
├── App.jsx                          # Root router — defines all routes per role
├── main.jsx
├── index.css
├── component/
│   ├── cashier/
│   │   ├── BillingSummary.jsx
│   │   ├── CashCalculator.jsx
│   │   ├── CheckoutButton.jsx
│   │   ├── DeclineModal.jsx         # Cashier: decline order modal (shows noteForStaff from DB)
│   │   ├── HistoryAccordion.jsx
│   │   ├── OrderCard.jsx            # Cashier: order card in list view
│   │   ├── OrderDetailModal.jsx     # Cashier: full order detail (shows noteForStaff from DB)
│   │   ├── OrderHeader.jsx
│   │   ├── OrderItemList.jsx
│   │   ├── PaymentMethodSelector.jsx
│   │   ├── SideBar.jsx
│   │   └── WeekDateSelector.jsx
│   ├── customer/
│   │   ├── order/
│   │   │   ├── CheckoutPanel.jsx
│   │   │   ├── OrderDetailsPanel.jsx  # Contains "Note for Staff" textarea → note_global
│   │   │   ├── OrderItem.jsx
│   │   │   ├── OrderPageShell.jsx
│   │   │   ├── OrderProcessingModal.jsx
│   │   │   ├── OrderSummary.jsx
│   │   │   ├── OrderTotalsPanel.jsx
│   │   │   ├── OrderTypeSelector.jsx
│   │   │   ├── SlipUpload.jsx
│   │   │   └── useOrderPageState.js   # Order state + submit logic (writes note_global to DB)
│   │   ├── BrandValue.jsx
│   │   ├── CartSidebar.jsx
│   │   ├── CustomerProfileForm.jsx
│   │   ├── DeliveryConfirmation.jsx
│   │   ├── OrderStatusPopup.jsx
│   │   ├── OrderStep.jsx
│   │   ├── ProfileDropdown.jsx
│   │   ├── RiderCard.jsx
│   │   └── StatusTimeLine.jsx
│   ├── rider/
│   │   ├── DeliveryComplete.jsx
│   │   ├── DeliveryFailed.jsx
│   │   ├── DeliveryHistory.jsx
│   │   ├── DeliveryStatusView.jsx
│   │   ├── DriverDashboard.jsx
│   │   └── OrderDetail.jsx          # Rider: shows note_global as "Delivery Instruction"
│   └── shared/
│       ├── NotificationBell.jsx     # Cashier bell → passes order to DeclineModal
│       └── SideBar.jsx
├── pages/
│   ├── cashier/
│   │   ├── CashierMenu.jsx
│   │   ├── CheckOutPage.jsx
│   │   ├── OrderHistory.jsx
│   │   ├── OrderList.jsx            # Cashier main order management page
│   │   └── SettingsMockup.jsx
│   ├── customer/
│   │   ├── MenuPage.jsx
│   │   ├── OrderHistoryPage.jsx
│   │   ├── OrderPage.jsx            # Wraps OrderPageShell
│   │   ├── OrderTrackingPage.jsx
│   │   └── RiderTracking.jsx
│   └── rider/
│       ├── RiderProfile.jsx
│       └── RiderRegister.jsx
├── context/
│   ├── ordersContext/
│   │   └── OrdersContext.jsx        # Global orders state + fetchAllOrders, updateOrder
│   └── userContext/
│       └── UserContext.jsx
├── services/
│   ├── orderService.js              # API calls for orders (CRUD)
│   ├── paymentService.js
│   ├── accountService.js
│   └── tableService.js
└── utils/
    ├── cashierOrders.js             # toCashierOrder mapping — exposes noteForStaff, pickupTime
    └── customerOrders.js
```

---

## 🔗 Note for Staff — Data Flow

The **"Note for Staff"** field (filled by the customer in OrderDetailsPanel) flows through the system via the `note_global` field in the database Order model.

```
Customer (OrderDetailsPanel)
  └─ noteGlobal state → submitted as order.note_global to DB
        │
        ├─ Cashier (OrderDetailModal → "Order Notes" section)
        │    └─ reads: order.raw.noteForStaff  (mapped in toCashierOrder from note_global)
        │
        ├─ Cashier (DeclineModal → "Note from Customer" yellow box)
        │    └─ reads: order.raw.noteForStaff
        │
        └─ Rider (OrderDetail → "Delivery Instruction" yellow box)
             └─ reads: order.note_global  (direct from API response)
```

> ⚠️ `order.customer.note` contains ORDER TYPE + SERVICE TIME metadata (e.g. `"delivery|As soon as possible (~30 mins)"`), NOT the staff note. Always use `note_global` / `noteForStaff` for the customer-written note.

---

## 🏍️ Delivery Status Flow

Order statuses flow as follows for delivery orders to sync between Rider and Customer:
1. **Kitchen Cooking**: `preparing` / `cooking` (mapped to Cooking in tracker)
2. **Ready for Pickup**: `delivery` (mapped to Ready on Rider / Stage 1 / On The Way in tracker)
3. **In Transit (On the Way)**: `shipping` (mapped to Transit on Rider / Stage 2 / On The Way in tracker)
4. **Delivered**: `delivered` (mapped to Finish on Rider / Stage 3 / Delivered in tracker)

The `shipping` status is set by the Rider when starting delivery, and the logged-in rider's information is dynamically persisted to `order.rider` in the DB:
```javascript
rider: {
  userId: String,
  name: String,
  phone: String,
  vehicle: String,
  plate: String
}
```

---

## 🛠 Engineering Standards

### General
- **ES Modules**: Both frontend and backend use ESM. Use `import/export` syntax exclusively.
- **Environment Variables**: Always check `.env` files for configuration. Use `.env.example` as a template.
- **Naming Conventions**: 
  - Backend: camelCase for variables/functions, PascalCase for Models.
  - Frontend: PascalCase for components, camelCase for hooks and utilities.

### Backend Specifics
- **Module Pattern**: New features should be added as modules under `src/modules`.
- **Routes**: Define routes in `src/routes` and link them in `src/routes/index.js`.
- **Validation**: Ensure input validation is handled at the route or controller level.

### Frontend Specifics
- **Component Design**: Prefer functional components with hooks.
- **Styling**: Use Tailwind CSS utility classes. Avoid custom CSS unless necessary.
- **Icons**: Use `lucide-react` for iconography.
- **Order Mapping**: Use `toCashierOrder()` from `src/utils/cashierOrders.js` to transform raw DB orders for cashier views. The mapped `raw.noteForStaff` key contains the customer's staff note (`note_global`).

---

## 🧑‍💼 Role-Based Routes

| Role | Entry Path | Key Pages |
|------|-----------|-----------|
| Customer | `/` | `/menu`, `/order`, `/order-tracking` |
| Cashier | `/cashier` | `/cashier/orders`, `/cashier/checkout`, `/cashier/history` |
| Rider | `/driver` | `/driver/order/:id`, `/driver/profile`, `/driver/history` |
| Cook | `/cook` | `/cook/board` |
| Owner | `/owner` | Owner dashboard (owner-app/) |

---

## 🚀 Common Commands

### Backend
- `npm run dev`: Start development server.
- `npm run seed:ingredients`: Seed initial ingredient data.
- `npm run seed:menus`: Seed initial menu data.

### Frontend
- `npm run dev`: Start Vite development server.
- `npm run build`: Build for production.
- `npm run lint`: Run ESLint.

---

## 🔒 Security & Safety
- Never commit `.env` files or secrets.
- Use `bcryptjs` for password hashing.
- Use `jsonwebtoken` for authentication.
- Implement `helmet` and `cors` for basic security headers.
