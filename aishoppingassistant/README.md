# ShopAI — Luxury Aesthetic Atelier, AI Stylist & Merchant Portal

ShopAI is an intelligent luxury e-commerce platform and merchant marketplace built with **React 19, Vite, React Router v7, Context API, Axios, Tailwind CSS**, and a **Node.js and Express**, adhering strictly to the **Front-End & Back-End Engineering Syllabus (Course & Lab Plan 24CAI0303)**.

---

## 🌟 Key Features

### 1. 📱 Zomato & Swiggy Style Smartphone Push Notifications
* **Mobile Push Banner ([`PushBanner.jsx`](file:///c:/Users/AMAN/OneDrive/Desktop/aishoppingassistant/src/components/common/PushBanner.jsx))**:
  * Slides down from the top of the screen with iOS / Android mobile notification styling.
  * Shows app brand icon (`SHOPAI ATELIER • now`), punchy headline with emoji, body preview, and tap to view.
  * Plays a pleasant dual-tone smartphone notification chime synthesized via the Web Audio API ([`src/utils/sound.js`](file:///c:/Users/AMAN/OneDrive/Desktop/aishoppingassistant/src/utils/sound.js)).
  * Triggers automatically when:
    * An order is placed (e.g. *"🛵 Order #ORD-123456 Placed!"*).
    * A seller/admin registers a new product into the store.
    * An order shipment status changes (*"🛵 Out for Delivery: Delivery partner assigned"*).
    * Smart engagement nudges (e.g. *"☕ Style Break: BrewMate Coffee Maker is trending in your area!"*).

### 2. 🔔 Amazon / Swiggy Notification Center Bell ([`NotificationBell.jsx`](file:///c:/Users/AMAN/OneDrive/Desktop/aishoppingassistant/src/components/common/NotificationBell.jsx))
* Situated in the header with an unread badge indicator counter.
* Opens a categorized notification panel with filter tabs:
  * **All**: Complete stream of atelier updates.
  * **📦 Orders**: Live order milestones and receipt notices.
  * **🔥 Offers**: Promotional privilege codes (e.g., `STYLE20` for 20% off).
  * **✨ Pieces**: New catalog drops and restock alerts.
* Features *"Mark all as read"*, individual delete, and click-to-navigate.

### 3. ⚙️ Admin / Seller Portal & Role Switcher ([`Admin.jsx`](file:///c:/Users/AMAN/OneDrive/Desktop/aishoppingassistant/src/pages/Admin.jsx))
* **Role Switcher in Header**: Toggle seamlessly between `[👤 Customer Mode]` and `[⚡ Admin Mode]`.
* **Register New Products (Sell Products)**:
  * Form inputs for title, category, selling price, original price, stock count, highlight badge, image URL (with one-click sample photo presets), description, and bulleted features.
  * Instant publishing: freshly registered products immediately enter the master store catalog and are persisted in `localStorage`.
  * Customers can immediately find them in `/products`, open their detail pages (`/product/:id`), add them to cart, and purchase them!
* **Store Inventory Manager**:
  * Real-time stock adjuster (`+` / `-` stock counter).
  * Direct storefront preview link & product removal.
* **Order Fulfillment Manager**:
  * Real-time customer orders table.
  * Change milestone status: `Confirmed` → `Packed` → `In Transit` → `Out for Delivery` → `Delivered`.
  * Changing order status immediately triggers a Zomato/Swiggy-style push notification to the customer!

### 4. 🎬 Zara & H&M Runway Editorial Opening Splash ([`EditorialSplash.jsx`](file:///c:/Users/AMAN/OneDrive/Desktop/aishoppingassistant/src/components/common/EditorialSplash.jsx))
* Cinematic opening brand reveal with tracked letter expansion for **"SHOPAI"**.
* Seasonal atelier credits (`AUTUMN / WINTER 2026`).
* Smooth dissolve into the storefront, with instant skip and replay capability.

### 5. 🎨 Pink & Brown Pastel Aesthetic Palette
* High-fashion runway styling with **Cormorant Garamond** & **Italiana** serif fonts.
* Soft dusty rose & blush pastels paired with warm mocha, latte sand, and deep espresso tones.

---

## 🚀 How to Run the Application

### Start Frontend (Vite + React)
```powershell
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Start Backend (Express)
Copy `.env.example` to `.env` and set a unique `JWT_SECRET` before starting the backend.

```powershell
npm run server
```
Runs the Node.js server on **[http://localhost:5000](http://localhost:5000)**.
