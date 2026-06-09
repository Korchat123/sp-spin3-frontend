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

| DB Status | Rider App Stage | Customer RiderTracking | Customer Timeline (`getTrackerStatus`) |
|---|---|---|---|
| `preparing` / `cooking` | - | - | `cooking` (Step 2) |
| `delivery` | Ready (Stage 1) | `picking_up` ("Picking up food") | `on_the_way` (Step 3) |
| `shipping` | Transit (Stage 2) | `on_the_way` ("On the way") | `on_the_way` (Step 3) |
| `delivered` | Finish (Stage 3) | `arriving` ("Order Delivered!") | `delivered` (Step 4) |

### Synchronization & Integration Details
1. **Rider Action**: When starting delivery, the Rider clicks "Start Delivery" in `OrderDetail.jsx` which updates the database status to `shipping` using `updateOrderStatus('shipping')`. This correctly sets the Rider's UI stage to 2 (Transit).
2. **Customer Polling**: `RiderTracking.jsx` (Customer side) polls the database every 5 seconds using `fetchAllOrders` from `OrdersContext.jsx` to ensure rider status changes are synced in real-time.
3. **Database ID Matching**: Customer tracking matches orders by checking `o._id` (MongoDB ObjectID) in addition to `id` and `orderId` to prevent unresolved order states.
4. **Delivered Order Retention (30s Delay)**: When an order is updated to `delivered`, the customer's interface (Navbar, History, and Status Popup) retains the order under "On Going Orders" for exactly 30 seconds after the `deliveredAt` timestamp before automatically transitioning it to "Past Orders".

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

## 📅 Reservation Status & Verification Flow

To ensure secure transactions, all Reservation orders must be verified by a cashier before appearing in the active reservation list.

| Flow Stage | DB Status | Cashier UI Location | Customer Status UI |
|---|---|---|---|
| 1. Customer Submits | `pending` | Cashier Notification Bell (Verify Slip card) | `"PENDING VERIFICATION"` |
| 2. Cashier Accepts | `reserved` | Cashier Orders > Reservation (Check-in active) | `"RESERVED ORDER RECEIVED"` |
| 3. Customer Check-in | `checked-in` | Cashier Orders > Reservation (Checked-in) | `"RESERVED ORDER RECEIVED"` |
| 4. Kitchen Prep | `preparing` / `cooking` | Cashier Orders > Reservation / Kitchen Board | `"Preparing your food"` |
| 5. Table Received | `received` | Cashier Orders > Reservation (Received) | `"Completed"` |

### Key Logic & Verification details
1. **Pending Reservation Hide**: Pending reservation orders (DB status `pending`) are explicitly excluded from the Cashier's active order columns (`OrderList.jsx`) and instead show up in the **Notification Bell** card.
2. **Notification Card**: Shows the reservation date, time, pax count, customer details, and a **View Slip** button. The **Accept Reservation** button is disabled until the cashier confirms the payment slip in the details modal.
3. **Accepting Reservation**: When clicking **Accept Reservation**, the order status is updated to `reserved`. It disappears from the Notification Bell and moves into **Cashier Orders > Reservation**, allowing check-in and further onsite processing.
4. **Decline Flow**: The existing `DeclineModal` is reused to decline/cancel pending reservations (`status: "cancelled"`) with a reason, avoiding duplicate business logic.
5. **Synchronization & Integration Details**:
   - **Payment Method Badge**: When an order is paid via PromptPay (PromptPay QR Code), the order contains `payment.method: "promptpay"`. Both the Notification Bell verification cards and the Order Cards display a purple `"PROMPTPAY"` badge side-by-side with the slip status badge (e.g. `"VERIFY SLIP"`, `"SLIP VERIFIED"`, or `"PAID (SLIP)"`) to provide instant visibility into the transaction channel.
   - **Reservation Details Mapping**: Reservation details such as booking time and pax count are extracted from `order.bookingTime` and `order.reservationPax` and mapped as `time` and `pax` on the normalized cashier order object for consistent display in the card and details modal views.

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
