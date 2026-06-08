# Implementation Plan: Rider, Cashier, and Customer Features

This document outlines the planned changes to resolve the four tasks requested. 

## Proposed Changes

### Database & Backend

#### [MODIFY] `sp-spin3-backend/src/modules/orders/Order.js`
- Add a `rider` field to the `orderSchema` to store the rider's information when they accept/deliver the order.
```javascript
  rider: {
    userId: { type: String },
    name: { type: String },
    phone: { type: String }
  },
```

#### [MODIFY] `sp-spin3-backend/src/modules/orders/orderController.js`
- In `updateOrderStatus`, check if the user is a rider and the status is being updated to `delivery` (Start Delivery) or `delivered`.
- Fetch the rider's user details (name, surname, phone) and attach it to the `order.rider` field before saving to the DB.

---

### Cashier & Rider (Note from Customer)

#### [MODIFY] `sp-spin3-frontend/src/component/cashier/OrderDetailModal.jsx`
- Update the "Order Notes" section to display the note properly from either `order.raw?.note_global` or `order.raw?.customer?.note`. This links the note submitted by the customer directly to the Cashier view.

#### [MODIFY] `sp-spin3-frontend/src/component/rider/OrderDetail.jsx`
- Update the "Delivery Instruction" section to display the note from `order.note_global` or `order.customer?.note` so the Rider can see it.

---

### Rider (Status & Logout)

#### [MODIFY] `sp-spin3-frontend/src/component/rider/OrderDetail.jsx`
- Fix the "Start Delivery" button. Currently, it only changes the local UI state to Stage 2 but does not tell the DB.
- Add the `updateOrderStatus('delivery')` API call when advancing to Stage 2 so the database knows the order is "on the way".

#### [MODIFY] `sp-spin3-frontend/src/pages/rider/RiderProfile.jsx`
- Remove the `window.confirm` popup from the `handleLogout` function.
- This will allow the rider to log out instantly with a single click as requested.

---

### Customer (Tracking & Rider Info)

#### [MODIFY] `sp-spin3-frontend/src/pages/customer/RiderTracking.jsx`
- Fix the status mapping: change `case 'shipping':` to `case 'delivery':` because the backend uses `delivery` when the rider starts the trip. This ensures the customer tracking map connects properly with the DB.
- Update the Rider Profile Card mock data to use the actual `currentOrder?.rider?.name` and `currentOrder?.rider?.phone` from the DB.

#### [MODIFY] `sp-spin3-frontend/src/pages/customer/OrderTrackingPage.jsx`
- Add a section under the status to display the Rider's Name and Phone number if the order type is `delivery` and a rider is assigned.

## Verification Plan

### Automated Tests
- N/A

### Manual Verification
1. Place a delivery order as a customer, adding a "Note for staff".
2. View the order as a Cashier and ensure the note is visible.
3. View the order as a Rider and ensure the note is visible.
4. As the Rider, click "Start Delivery". Verify the status changes in the DB and the Customer sees "On the way".
5. As the Customer, check the Order Tracking page to verify the Rider's actual name and phone number are displayed.
6. As the Rider, click the Log Out button and ensure it logs out immediately without a confirmation popup.

## User Review Required
Please review this plan. If you agree, I will proceed to execute the changes!
