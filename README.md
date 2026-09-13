# 🇮🇳 LandGuard AI — Government of India Frontend Portal

> **SIH PS-25017**: AI-Powered Decision Support Portal for Early Detection of Land Acquisition Delays  
> Built for the **Ministry of Rural Development (MoRD) / Department of Land Resources (DoLR)**.

---

## 🌟 Overview & Key Features

Designed strictly in accordance with **Government of India (GOI) Digital Guidelines** (clean typography, dignified high-contrast interface with National Emblem branding & Indian Tricolor accents: Deep Saffron `#E65100`, Navy Blue `#0A2540`, India Green `#15803D`).

### Included Features & Views:

1. **🔐 Official Login & OTP Verification Portal** (`/login`)
   - Secure login with OTP verification drawer.
   - **Hackathon Quick Role Switcher**: Instant switching between `District Officer (Bhopal, MP)`, `District Collector (Lucknow, UP)`, `State Admin (Maharashtra)`, and `Central Ministry Admin (National)` for live RBAC demonstrations.

2. **📊 Executive Overview Dashboard** (`/`)
   - High-level KPI summary cards (Active projects, High Risk %, Delay Rate %, AI Predictions Run).
   - **Section 11 Statutory Lapse Watch Banner**: Proximity countdown (< 45 days) to statutory 12-month limit under RFCTLARR Act 2013.
   - Interactive Recharts analytics: Monthly Delay Trends (Line), Risk Category Distribution (Donut), 10-Stage LARR Lifecycle Funnel (Bar).

3. **📁 Projects Directory & Detail View** (`/projects`, `/projects/:id`)
   - Filterable data table by State, District, and LARR Stage.
   - **Statutory LARR 10-Stage Stepper**: Visual stepper tracking Stage 0 (Pre-Notification) through Stage 9 (Possession & Compensation).
   - Progress metric gauges (Compensation disbursement %, Possession %, R&R progress %).
   - Court stay order tracker & modal to add new projects.

4. **🤖 Predictive AI & Explainable AI (SHAP)** (`/analytics`)
   - Explainable AI (XAI) horizontal factor contribution breakdown chart quantifying risk drivers (e.g. Legal disputes +28%, Compensation stall +24%, Section 11 lapse proximity +18%).
   - "Run Live Prediction Engine" trigger connecting to backend rule engine / Python ML microservice webhook.

5. **🗺️ Interactive GIS Digital Map** (`/gis-map`)
   - Leaflet map displaying GeoJSON spatial project markers (Green=Low, Yellow=Medium, Orange=High, Red=Critical).
   - District risk choropleth heatmaps & interactive popup detail cards.

6. **💡 Actionable Interventions & Recommendations Matrix** (`/interventions`)
   - Actionable directives categorized by priority (`URGENT`, `HIGH`, `MEDIUM`) with owner authority assignments (e.g. District Collector, State Legal Dept) and status updates (`Pending` -> `In Progress` -> `Resolved`).

7. **🔔 Automated Alert & Notification Center** (`/alerts`)
   - Real-time notification feed auditing Section 11 lapse dates and risk threshold breaches.
   - Manual Alert Dispatch modal for District Collectors to broadcast directives.

8. **👤 Officer Efficiency & Performance Workspace** (`/officers`)
   - Officer directory ranking District Collectors & SLAOs by assigned workload, delay rate %, and efficiency ratings out of 10.

9. **📋 Security Audit Trail & Official CSV Exporters** (`/audit-logs`)
   - Audit trail log table with IP tracking and timestamp audit history.
   - Export buttons generating `projects_export.csv` and `predictions_export.csv`.

---

## ⚡ Quick Start & Development Server

```bash
# 1. Install dependencies
npm install

# 2. Start Vite frontend dev server
npm run dev
```

The portal will open at `http://localhost:5173`.
The frontend proxies API requests automatically to the Node.js Express backend at `http://localhost:3000/api/v1`.
