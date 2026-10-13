# ☀️ HeatShield — Community Heat-Risk & Water-Access Platform 🚰

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169e1.svg)](https://www.postgresql.org/)
[![AWS Amplify](https://img.shields.io/badge/AWS%20Amplify-Deployed-FF9900.svg)](https://aws.amazon.com/amplify/)

> **HeatShield** is a smart, community-driven platform designed to provide real-time monitoring, alerts, and access mapping for urban heatwaves, heat-risk zones, and public drinking water sources.

---

## 🌟 Key Features

* 🗺️ **Interactive Heat-Risk Mapping:** Real-time temperature, "feels like" metrics, and geographic heat risk level visualization.
* 💧 **Water Point Location & Status Tracker:** Operational status tracking (`OPERATIONAL`, `LOW_SUPPLY`, `BROKEN`) for public taps, kiosks, fountains, and tanker points.
* 🚨 **Automated Heat Advisories:** Live safety guidelines, temperature threshold alerts, and preventive health measures.
* 📣 **Community Reporting System:** Allows citizens and volunteers to report real-time water source issues, infrastructure defects, or heat hazards.
* ⚡ **High Performance & Modern UI:** Built with React + Vite on the frontend and robust Spring Boot REST APIs on the backend.

---

## 📐 System Architecture & Workflow

Below is the detailed flow diagram representing the interaction between Community Members, Administrators, Frontend React Components, Spring Boot API Endpoints, and Domain Storage.

```mermaid
flowchart TD
    subgraph Users ["👥 User Roles"]
        CM["👤 Community Member"]
        ADM["👨‍💼 Administrator"]
    end

    subgraph Frontend ["💻 Community App (React + Vite)"]
        APP["App Coordinator (App.jsx)"]

        LOC["Location Selection (useGeolocation.js)"]
        WEATH_HOOK["Weather State Hook (useLiveWeather.js)"]
        WEATH_SVC["Weather Service (weather.js)"]

        COOL["Cooling Tracker"]
        REP_PG["Report Workflow (ReportPage.jsx)"]
        REP_FEED["Community Report Feed"]
        REP_FORM["Report Submission Form"]

        OVERVIEW["Heat Overview (OverviewPage.jsx)"]
        RELIEF["Find Relief (FindReliefPage.jsx)"]
        PLACES["Places Map / List"]

        SAFETY["Safety Guidance (StaySafePage.jsx)"]
        WATER_HOOK["Water Data Hook (useWaterPoints.js)"]
        ADMIN_PORTAL["Admin Management (AdminPortal.jsx)"]

        API_FALLBACK["API & Demo Fallback (api.js)"]
    end

    subgraph External ["🌐 External Data"]
        GEO["Browser Geolocation"]
        W_PROV["Weather Provider"]
    end

    subgraph Backend ["⚙️ HeatShield API (Spring Boot)"]
        HEAT_EP["Heat Risk Endpoints"]
        REP_EP["Report Endpoints"]
        WATER_EP["Water Endpoints"]

        HEAT_Q["Heat Risk Queries"]
        REP_OPS["Report Operations (ReportService.java)"]
        WATER_OPS["Water Operations"]

        PHOTO["Photo Storage"]
    end

    subgraph Database ["🐘 Domain Storage (PostgreSQL)"]
        R_ZONES[("Risk Zones")]
        R_SNAPS[("Risk Snapshots")]
        DB_REPS[("Reports")]
        DB_WATER[("Water Points")]
    end

    %% User Interactions
    CM -->|uses| APP
    ADM -->|manages| ADMIN_PORTAL

    %% App Routing
    APP --> LOC
    APP --> WEATH_HOOK
    APP --> COOL
    APP --> REP_PG
    APP --> OVERVIEW
    APP --> RELIEF
    APP --> SAFETY
    APP --> WATER_HOOK
    APP --> ADMIN_PORTAL

    %% Component Flows
    REP_PG --> REP_FEED
    REP_PG --> REP_FORM
    OVERVIEW --> PLACES
    RELIEF --> PLACES

    WEATH_HOOK --> WEATH_SVC
    LOC -->|requests coordinates| GEO
    WEATH_SVC -->|fetches weather| W_PROV
    WEATH_SVC -->|loads heat risk| HEAT_EP

    REP_FORM -->|submits report| API_FALLBACK
    WATER_HOOK -->|fetches & confirms| API_FALLBACK
    ADMIN_PORTAL -->|manages records| API_FALLBACK

    %% API to Backend Connections
    API_FALLBACK -->|calls reports API| REP_EP
    API_FALLBACK -->|calls water API| WATER_EP

    %% Backend internal processing
    HEAT_EP --> HEAT_Q
    REP_EP --> REP_OPS
    WATER_EP --> WATER_OPS
    REP_OPS --> PHOTO

    %% Database Reads/Writes
    HEAT_Q -->|reads| R_ZONES
    HEAT_Q -->|reads| R_SNAPS
    REP_OPS -->|reads & writes| DB_REPS
    WATER_OPS -->|reads & writes| DB_WATER
```

---

## 🛠️ Tech Stack

### 💻 Frontend
* **Framework:** React 18 (Vite Build Tool)
* **Styling:** Custom CSS3 & Responsive UI Components
* **Code Quality:** Oxlint & ESLint rules

### ⚙️ Backend
* **Framework:** Java 17, Spring Boot 3.5.6
* **Database:** PostgreSQL with Spring Data JPA
* **Health Monitoring:** Spring Boot Actuator

---

## 📂 Project Structure

```plaintext
HeatShield/
├── src/                          # 🎨 React Frontend Code
│   ├── assets/                   # Images, Icons & SVGs
│   ├── components/               # React Components (Dashboard, HeatRiskMap, ReportForm, etc.)
│   ├── data/                     # Offline Fallback / Mock Data
│   └── services/                 # Axios / Fetch API integrations
├── src/main/java/com/heatshield/ # ⚙️ Spring Boot Java Backend
│   ├── config/                   # CORS, Security & DataSeeder Configurations
│   ├── controller/               # REST Endpoints (Health, HeatRisk, WaterPoints)
│   ├── dto/                      # Data Transfer Objects
│   ├── entity/                   # JPA Relational Entities
│   ├── repository/               # Data Access Repositories
│   └── service/                  # Business Logic Layer
├── pom.xml                       # 📦 Maven Project Dependencies
├── vite.config.js                # ⚡ Vite Configuration
└── README.md                     # 📖 Project Documentation
```

---

## 🚀 Getting Started

### 📋 Prerequisites

Make sure the following tools are installed on your machine:

* 🟢 Node.js (v18+ recommended)
* ☕ Java JDK (v17 or higher)
* 🐘 PostgreSQL Server
* 📦 Maven

### 🗄️ 1. Backend Setup (Spring Boot)

**Database Configuration:**

Start PostgreSQL and update your database credentials in `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/heatshield
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

**Run Backend Server:**

```bash
./mvnw spring-boot:run
```

The backend starts at `http://localhost:8080` and seeds initial demo data into the database.

**Verify API:**

Navigate to `http://localhost:8080/api/health` in your browser.

### 💻 2. Frontend Setup (React + Vite)

**Install Dependencies:**

```bash
npm install
```

**Environment File Configuration:**

Create a `.env` file in the root directory based on `.env.example`:

```env
VITE_API_URL=http://localhost:8080/api
```

**Start Development Server:**

```bash
npm run dev
```

The application will open at `http://localhost:5173`.

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check endpoint |
| GET | `/api/heat-risk/current` | Live temperature & heat risk advisory |
| GET | `/api/heat-risk/zones` | Bounding box coordinates for heat risk zones |
| GET | `/api/water-points` | Public water access locations and statuses |
| POST | `/api/reports` | Submit community heat/water reports |

---

## 👨‍💻 Contributors

Special thanks to the team behind HeatShield:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/aryansangal100-ship-it">
        <img src="https://github.com/aryansangal100-ship-it.png?size=100" width="100" height="100" alt="Aryan Sangal" style="border-radius:50%;" /><br />
        <sub><b>Aryan Sangal</b></sub>
      </a><br />
      <sub>Full-Stack Development & AWS Deployment</sub>
    </td>
    <td align="center">
      <a href="https://github.com/Suryanshsah">
        <img src="https://github.com/Suryanshsah.png?size=100" width="100" height="100" alt="Suryansh Sah" style="border-radius:50%;" /><br />
        <sub><b>Suryansh Sah</b></sub>
      </a><br />
      <sub>Core Architecture & System Design</sub>
    </td>
    <td align="center">
      <a href="https://github.com/dhwlpandey">
        <img src="https://github.com/dhwlpandey.png?size=100" width="100" height="100" alt="Dhawal Pandey" style="border-radius:50%;" /><br />
        <sub><b>Dhawal Pandey</b></sub>
      </a><br />
      <sub>Backend Developer & API Infrastructure</sub>
    </td>
    <td align="center">
      <a href="https://github.com/anirudhagarwal-dev">
        <img src="https://github.com/anirudhagarwal-dev.png?size=100" width="100" height="100" alt="Anirudh Agarwal" style="border-radius:50%;" /><br />
        <sub><b>Anirudh Agarwal</b></sub>
      </a><br />
      <sub>Core Contributor & Team Role</sub>
    </td>
  </tr>
</table>

---

## 📄 License

This project is open-source and released under the MIT License.
heloo