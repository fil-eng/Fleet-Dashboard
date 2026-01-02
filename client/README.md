client/
├─ src/
│  ├─ main.jsx               # App entry
│  ├─ app/
│  │  ├─ App.jsx
│  │  ├─ App.css
│  │  └─ router.jsx
│  │
│  ├─ components/
│  │  ├─ layout/
│  │  │  ├─ Header.jsx
│  │  │  ├─ Header.css
│  │  │  ├─ Sidebar.jsx
│  │  │  └─ Sidebar.css
│  │  │
│  │  ├─ cards/
│  │  │  ├─ Card.jsx
│  │  │  └─ Card.css
│  │  │
│  │  ├─ tables/
│  │  │  ├─ VehicleTable.jsx
│  │  │  └─ VehicleTable.css
│  │  │
│  │  └─ command-center/
│  │     ├─ CommandInput.jsx
│  │     └─ CommandInput.css
│  │
│  ├─ pages/
│  │  ├─ Vehicles.jsx
│  │  ├─ Vehicles.css
│  │  ├─ Drivers.jsx
│  │  ├─ Drivers.css
│  │  ├─ Maintenance.jsx
│  │  ├─ Maintenance.css
│  │  ├─ Support.jsx
│  │  └─ Support.css
│  │
│  ├─ services/
│  │  ├─ api.js
│  │  └─ socket.js
│  │
│  └─ hooks/
│     └─ useSocket.js

router.jsx responsibilities

Handles internal dashboard pages only

Examples:

/ → Dashboard overview (cards, summary)

/vehicles

/drivers

/maintenance

/support

❗ Login is NOT part of router.jsx

Login lives outside the dashboard routing.

<!-- ************************ -->
our structure allows:

One dashboard shell

Multiple feature pages

Clean mental model

Easy role-based control later

Zero duplicated layout code