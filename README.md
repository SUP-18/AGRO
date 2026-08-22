<div align="center">

# 🌿 AgroPredict — AI-Powered Smart Farming Platform

**Precision Agriculture Meets Artificial Intelligence**

[![Launch App](https://img.shields.io/badge/🚀_Launch-Live_App-00e676?style=for-the-badge)](https://agro-dusky.vercel.app)
[![Backend API](https://img.shields.io/badge/⚡_Backend-API_Health-blue?style=for-the-badge)](https://agro-t1kk.onrender.com/api/health)

![Version](https://img.shields.io/badge/version-1.0.0-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini-2.5_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)

<br/>

*AgroPredict is a full-stack intelligent farming platform that combines machine learning, Google Gemini Vision AI, real-time weather analytics, and smart recommendations to help farmers maximize crop yields, diagnose plant diseases, and make data-driven agricultural decisions.*

<br/>

[Live Demo](#-live-demo) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Deployment](#-deployment)

</div>

---

## 📑 Table of Contents

- [🎯 Live Demo](#-live-demo)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [🏗 Architecture Overview](#-architecture-overview)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [🔑 Default Credentials](#-default-credentials)
- [📡 API Reference](#-api-reference)
- [🤖 Machine Learning & AI Models](#-machine-learning--ai-models)
- [🌐 Multi-Language Support](#-multi-language-support)
- [☁️ Deployment](#️-deployment)
- [📸 Application Pages](#-application-pages)
- [🗺 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Live Demo

| Service | URL | Status |
|---------|-----|--------|
| **Frontend (Vercel)** | [agro-dusky.vercel.app](https://agro-dusky.vercel.app) | ✅ Live |
| **Backend API (Render)** | [agro-t1kk.onrender.com](https://agro-t1kk.onrender.com/api/health) | ✅ Live |

> **Note:** The backend runs on Render's free tier and may take ~30–50 seconds to wake up after inactivity. The first request after a cold start will be slow; subsequent requests are fast.

### Quick Demo Access

Use these credentials on the login page or click the **Quick Demo Access** buttons:

| Role | Email | Password |
|------|-------|----------|
| 🧑‍🌾 **Farmer** | `farmer@agropredict.com` | `farmer123` |
| 🛡️ **Admin** | `admin@agropredict.com` | `admin123` |

---

## ✨ Features

### 🌾 Crop Yield Prediction
- Input soil type, rainfall, temperature, humidity, fertilizer usage, and land area via interactive sliders
- Get AI-predicted yield (tonnes/hectare) with confidence scores powered by a **Random Forest Regressor**
- Supports **15 crop types** (Rice, Wheat, Maize, Cotton, Sugarcane, Soybean, Barley, Millet, Potato, Tomato, Groundnut, Sunflower, Mustard, Chickpea, Lentil) and **10 soil types** (Clay, Sandy, Loam, Silt, Peat, Chalky, Red, Black, Alluvial, Laterite)
- Full prediction history with pagination and per-user tracking

### 🦠 Crop Disease Detection (Gemini Vision AI)
- Upload leaf/crop images via drag-and-drop for instant disease identification
- **Online mode:** Powered by **Google Gemini 2.5 Flash Vision API** for real-time image analysis
- **Offline fallback:** Comprehensive pathology engine covering **12 common plant diseases** with symptoms, severity ratings, and treatment protocols
- Diagnostic output includes: disease name, confidence level, severity (`Low` / `Medium` / `High` / `Critical`), scientific description, visible symptoms, chemical solutions, organic remedies, and preventive measures

### 🌤 Weather Station
- Real-time weather data: temperature, humidity, wind speed & direction, UV index, soil temperature, barometric pressure, and solar radiation
- **24-hour forecast chart** with dual temperature & rainfall curves (Recharts)
- **5-day horizon forecast** cards with rain probability and wind speeds
- Severe meteorological warnings with agricultural impact advisories
- Sensor health status dashboard

### 🧠 Smart Farming Recommendations
- AI-generated **weekly irrigation schedules** based on soil type, crop, temperature, and rainfall
- **NPK fertilizer optimization** with split-dosing strategies (basal, tillering, panicle initiation)
- **Crop suitability scoring** by region, season, and soil conditions
- **Soil restoration advisories** (humus/gypsum for clay, cover crops for sandy, lime for laterite)
- Simulated **IoT telemetry dashboard** — Soil Moisture, Soil Temp, pH, Sunlight Lux, NPK Sensors

### 📊 Analytics Dashboard
- Multi-year yield trend analysis with interactive line charts
- Regional production comparisons across Indian states (Punjab, Haryana, UP, MP, Maharashtra, Karnataka)
- Seasonal analysis across Kharif, Rabi, and Zaid cycles
- ML model validation accuracy curves
- Animated KPI counters with real-time stats

### 💬 AI Chatbot (AgroBot)
- Floating conversational assistant with agriculture knowledge base
- **Online mode:** Powered by **Google Gemini 2.5 Flash** with system prompts enforcing agricultural-only boundaries
- **Offline mode:** Regex-based knowledge engine with responses in **6 languages** (English, Hindi, Telugu, Tamil, Punjabi, Marathi)
- Quick-action chips for common queries: crop advice, weather tips, pest control, irrigation help

### 👤 User Management & Admin Panel
- JWT-based authentication (Register / Login / Logout) with 7-day token expiry
- Role-based access control: **Farmer**, **Expert**, **Admin**
- Profile management with editable fields (name, phone, location, password)
- **Admin Panel:** User role management, system health monitoring, crop catalog CRUD, and global notification broadcast

### 🌐 Multi-Language Interface
- Full i18n support with 4 platform languages: **English**, **Hindi (हिन्दी)**, **Telugu (తెలుగు)**, **Punjabi (ਪੰਜਾਬੀ)**
- Seamless language switcher in the header with persistent `localStorage` preference
- Automatic fallback to English for any missing translation keys

### 🎨 Premium UI/UX
- Dark glassmorphic design with emerald/gold accent palette
- Framer Motion animations throughout (fade, slide, scale, staggered lists)
- Fully responsive layout with collapsible sidebar
- Custom scrollbars, shimmer skeleton loaders, and micro-interactions
- Notification bell with unread badge and dropdown panel

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2 | Component-based UI library with hooks |
| **Vite** | 5.0 | Lightning-fast dev server & HMR bundler |
| **Tailwind CSS** | 3.3 | Utility-first styling framework |
| **Framer Motion** | 10.16 | Declarative animations & transitions |
| **Recharts** | 2.10 | Composable data visualization (charts & graphs) |
| **React Router** | 6.20 | Client-side SPA routing |
| **Axios** | 1.6 | Promise-based HTTP client with interceptors |
| **React Icons** | 4.12 | Icon library (Remix Icons) |
| **React Hot Toast** | 2.4 | Non-blocking toast notifications |
| **React Dropzone** | 14.2 | Drag-and-drop file upload |

### Backend

| Technology | Purpose |
|------------|---------|
| **Flask** | Lightweight Python web framework |
| **Flask-SQLAlchemy** | ORM & database management |
| **Flask-JWT-Extended** | JSON Web Token authentication |
| **Flask-CORS** | Cross-Origin Resource Sharing |
| **Flask-Migrate** | Alembic database migrations |
| **Scikit-learn** | Machine learning (RandomForestRegressor) |
| **Pandas / NumPy** | Data manipulation & numerical computing |
| **Pillow** | Image processing for disease detection |
| **Google Gemini API** | Vision AI (disease detection) & conversational AI (chatbot) |
| **SQLite** | Lightweight embedded relational database |
| **Gunicorn** | Production WSGI HTTP server |
| **Joblib** | ML model serialization |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │            React 18 + Vite SPA (Vercel)                   │  │
│  │                                                           │  │
│  │  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌───────────────┐  │  │
│  │  │ Landing  │ │Dashboard │ │Predict │ │Disease Detect │  │  │
│  │  └─────────┘ └──────────┘ └────────┘ └───────────────┘  │  │
│  │  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌───────────────┐  │  │
│  │  │ Weather │ │Analytics │ │ Admin  │ │  Smart Farm   │  │  │
│  │  └─────────┘ └──────────┘ └────────┘ └───────────────┘  │  │
│  │                                                           │  │
│  │  ┌─────────────────┐  ┌───────────┐  ┌───────────────┐  │  │
│  │  │  AuthContext     │  │ i18n (4L) │  │  AgroBot 💬   │  │  │
│  │  │  (JWT Manager)   │  │ EN HI TE PA│  │ (Gemini AI)  │  │  │
│  │  └─────────────────┘  └───────────┘  └───────────────┘  │  │
│  └──────────────────────────┬────────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────┘
                              │ HTTPS (Axios)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FLASK REST API (Render)                         │
│                                                                 │
│  ┌──────────┐ ┌────────────┐ ┌─────────┐ ┌──────────────────┐ │
│  │ /api/auth│ │/api/predict│ │/api/     │ │ /api/disease     │ │
│  │ JWT Auth │ │ ML Predict │ │ weather  │ │ Gemini Vision AI │ │
│  └──────────┘ └────────────┘ └─────────┘ └──────────────────┘ │
│  ┌──────────┐ ┌────────────┐ ┌─────────┐ ┌──────────────────┐ │
│  │/api/admin│ │/api/analyt.│ │/api/rec. │ │ /api/chatbot     │ │
│  │ Admin Ops│ │ Stats/Trend│ │ NPK/Irr.│ │ Gemini Chat AI   │ │
│  └──────────┘ └────────────┘ └─────────┘ └──────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    ML / AI Layer                         │   │
│  │  ┌───────────────┐ ┌──────────────┐ ┌────────────────┐ │   │
│  │  │ RandomForest  │ │ Gemini 2.5   │ │ Recommendation │ │   │
│  │  │ Regressor     │ │ Flash Vision │ │ Engine         │ │   │
│  │  │ (crop_yield)  │ │ (disease AI) │ │ (NPK/Irrig.)  │ │   │
│  │  └───────────────┘ └──────────────┘ └────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                     ┌────────┴────────┐                         │
│                     │   SQLite DB     │                         │
│                     │ (auto-seeded)   │                         │
│                     └─────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
AGRO/
├── README.md                             # This file
├── render.yaml                           # Render IaC deployment blueprint
├── .gitignore                            # Git ignore rules
│
├── backend/                              # Flask REST API
│   ├── run.py                            # Application entry point
│   ├── requirements.txt                  # Python dependencies
│   ├── build.sh                          # Render build script (pip install + DB seed)
│   ├── .env                              # Environment variables (local, gitignored)
│   ├── .env.example                      # Environment template
│   ├── agropredict.db                    # SQLite database (auto-generated)
│   │
│   ├── app/
│   │   ├── __init__.py                   # App factory + auto-seed logic
│   │   ├── config.py                     # Dev/Prod/Test configuration classes
│   │   ├── extensions.py                 # SQLAlchemy, JWT, Migrate initialization
│   │   │
│   │   ├── models/                       # SQLAlchemy ORM models
│   │   │   ├── user.py                   # User (roles, bcrypt hashing)
│   │   │   ├── crop.py                   # Crop & CropData (catalog + regional stats)
│   │   │   ├── prediction.py            # Prediction & Recommendation records
│   │   │   ├── notification.py           # Notification model
│   │   │   └── disease_report.py         # Disease diagnostic report model
│   │   │
│   │   ├── routes/                       # API route blueprints
│   │   │   ├── __init__.py               # Blueprint registry
│   │   │   ├── auth.py                   # /api/auth/* — JWT authentication
│   │   │   ├── prediction.py             # /api/predictions/* — yield forecasting
│   │   │   ├── disease.py                # /api/disease/* — leaf image diagnostics
│   │   │   ├── weather.py                # /api/weather/* — meteorological data
│   │   │   ├── recommendations.py        # /api/recommendations/* — smart advisories
│   │   │   ├── analytics.py              # /api/analytics/* — trends & stats
│   │   │   ├── notifications.py          # /api/notifications/* — alert management
│   │   │   ├── chatbot.py                # /api/chatbot/* — Gemini conversational AI
│   │   │   └── admin.py                  # /api/admin/* — admin operations
│   │   │
│   │   ├── ml/                           # Machine Learning engines
│   │   │   ├── crop_yield_model.py       # CropYieldPredictor (RandomForest + fallback)
│   │   │   ├── disease_model.py          # DiseaseDetector (Gemini Vision + offline DB)
│   │   │   ├── recommendation_engine.py  # RecommendationEngine (NPK, irrigation, soil)
│   │   │   ├── train_model.py            # Model training script
│   │   │   └── crop_yield_rf.joblib      # Serialized trained RF model
│   │   │
│   │   ├── utils/
│   │   │   ├── helpers.py                # Email validation & utility functions
│   │   │   └── decorators.py             # @admin_required, @expert_required guards
│   │   │
│   │   └── data/
│   │       └── crop_data.csv             # 200+ row synthetic training dataset
│   │
│   ├── migrations/
│   │   └── init_db.py                    # Database schema init & seed script
│   │
│   └── uploads/                          # Disease image uploads directory
│
└── frontend/                             # React Single Page Application
    ├── index.html                        # HTML entry point
    ├── package.json                      # Node.js dependencies
    ├── vite.config.js                    # Vite config (dev proxy → :5000)
    ├── tailwind.config.js                # Tailwind theme extensions
    ├── postcss.config.js                 # PostCSS plugins
    │
    └── src/
        ├── main.jsx                      # React DOM render entry
        ├── App.jsx                       # Routes, layout, ProtectedRoute wrapper
        ├── index.css                     # Global styles, animations, glassmorphism
        │
        ├── context/
        │   ├── AuthContext.jsx            # Auth state, JWT management, demo login
        │   ├── LanguageContext.jsx         # i18n language switching & persistence
        │   └── ThemeContext.jsx            # Dark/light theme toggle
        │
        ├── i18n/
        │   └── translations.js            # 4-language translation dictionary (~85 KB)
        │
        ├── services/
        │   ├── api.js                     # Axios instance + JWT interceptors
        │   ├── auth.js                    # Auth API helpers
        │   ├── predictions.js             # Prediction API helpers
        │   └── weather.js                 # Weather API helpers
        │
        ├── components/
        │   ├── layout/
        │   │   ├── AppLayout.jsx          # Protected dashboard shell
        │   │   ├── Header.jsx             # Top bar (search, language, notifications)
        │   │   └── Sidebar.jsx            # Collapsible navigation sidebar
        │   │
        │   ├── common/
        │   │   ├── AnimatedCard.jsx        # Framer Motion card wrapper
        │   │   ├── StatsCard.jsx          # KPI metric with icon & trend
        │   │   ├── ChartCard.jsx          # Glassmorphic Recharts container
        │   │   ├── LoadingSkeleton.jsx     # Shimmer skeleton loader
        │   │   ├── ThemeToggle.jsx         # Sun/Moon theme switch
        │   │   └── FileUpload.jsx         # Drag-and-drop image uploader
        │   │
        │   └── chatbot/
        │       └── ChatBot.jsx            # Floating AgroBot AI assistant
        │
        └── pages/
            ├── Landing.jsx                # Public hero, features, stats, testimonials
            ├── Login.jsx                  # Auth form + Quick Demo Access buttons
            ├── Signup.jsx                 # Registration with role selector
            ├── ForgotPassword.jsx         # Password recovery flow
            ├── Dashboard.jsx              # KPI cards, charts, recent predictions
            ├── Prediction.jsx             # Crop yield ML forecasting tool
            ├── Analytics.jsx              # Interactive data visualization
            ├── DiseaseDetection.jsx        # Leaf image pathology scanner
            ├── SmartFarming.jsx           # IoT telemetry + farm task calendar
            ├── Weather.jsx                # Agricultural weather station
            ├── AdminPanel.jsx             # Admin user/system management
            ├── Profile.jsx                # User profile settings
            ├── About.jsx                  # Platform mission & team
            ├── Contact.jsx                # Contact form & info
            ├── Features.jsx               # Feature showcase page
            └── NotFound.jsx               # Branded 404 page
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| **Python** | 3.10+ | 3.11 recommended |
| **Node.js** | 18+ | LTS recommended |
| **npm** | 9+ | Bundled with Node.js |
| **Git** | Latest | For version control |

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/SUP-18/AGRO.git
cd AGRO/backend

# 2. Create and activate a virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env
# Edit .env and add your keys:
#   SECRET_KEY=your_secret_key
#   JWT_SECRET_KEY=your_jwt_secret
#   GEMINI_API_KEY=your_gemini_api_key  (optional — offline fallbacks work without it)

# 5. Initialize the database with seed data
python migrations/init_db.py

# 6. Train the ML model (generates crop_yield_rf.joblib)
python -m app.ml.train_model

# 7. Start the Flask development server
python run.py
```

> **Backend runs at:** `http://localhost:5000`

### Frontend Setup

```bash
# 1. Open a new terminal and navigate to the frontend
cd AGRO/frontend

# 2. Install Node.js dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

> **Frontend runs at:** `http://localhost:5173`
> 
> The Vite dev server proxies all `/api` requests to the Flask backend on port 5000.

### Production Build

```bash
cd AGRO/frontend

# Build optimized production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 🔑 Default Credentials

After running the database seed script (`python migrations/init_db.py`), the following demo accounts are available:

| Role | Email | Password | Capabilities |
|------|-------|----------|-------------|
| 🛡️ **Admin** | `admin@agropredict.com` | `admin123` | Full access + user management, system stats, broadcast notifications |
| 🧑‍🌾 **Farmer** | `farmer@agropredict.com` | `farmer123` | Predictions, disease detection, weather, smart farming, analytics |

> **Note:** On the deployed version, these accounts are **auto-seeded on every startup** to survive Render's ephemeral filesystem.

---

## 📡 API Reference

All API endpoints are prefixed with `/api`. Authentication uses **Bearer JWT tokens** in the `Authorization` header.

### 🔐 Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register a new user. Body: `{email, password, username, full_name, role, phone, location}` |
| `POST` | `/login` | ❌ | Authenticate and receive JWT. Body: `{email, password}` |
| `POST` | `/forgot-password` | ❌ | Request password reset. Body: `{email}` |
| `GET` | `/profile` | ✅ | Get authenticated user's profile |
| `PUT` | `/profile` | ✅ | Update profile fields. Body: `{full_name, phone, location, password}` |
| `POST` | `/logout` | ❌ | Logout (client discards JWT) |

### 🌾 Predictions — `/api/predictions`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/predict` | ✅ | Submit parameters and get ML yield prediction |
| `GET` | `/` | ✅ | List all predictions for the current user |
| `GET` | `/history` | ✅ | Paginated prediction history (`?page=1&per_page=10`) |
| `GET` | `/<id>` | ✅ | Get a specific prediction by ID |

<details>
<summary><b>POST <code>/predict</code> — Example Request Body</b></summary>

```json
{
  "crop_type": "Rice",
  "soil_type": "Loam",
  "rainfall": 200,
  "temperature": 28.5,
  "humidity": 65,
  "fertilizer_usage": 120,
  "land_area": 5.0
}
```

**Response:**
```json
{
  "prediction": {
    "id": 1,
    "crop_type": "Rice",
    "predicted_yield": 22.6,
    "yield_per_hectare": 4.52,
    "confidence": 94.2,
    "recommendations": { ... }
  }
}
```
</details>

### 🦠 Disease Detection — `/api/disease`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/detect` | ✅ | Upload leaf image (multipart form, `png/jpg/jpeg/gif`) for AI diagnosis |
| `GET` | `/reports` | ✅ | List all disease reports for the current user |
| `GET` | `/reports/<id>` | ✅ | Get a specific disease report |

### 🌤 Weather — `/api/weather`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/current?city=<city>` | ❌ | Current conditions (temp, humidity, wind, UV, soil temp, pressure) |
| `GET` | `/forecast?city=<city>&days=<n>` | ❌ | 5-day daily + 24-hour hourly forecast |
| `GET` | `/alerts` | ❌ | Active weather warnings with agricultural advisories |

### 🧠 Recommendations — `/api/recommendations`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ✅ | List all saved recommendations |
| `POST` | `/generate` | ✅ | Generate full advisory bundle (NPK, irrigation, soil, crop suitability) |
| `GET` | `/irrigation` | ❌ | Weekly irrigation schedule for given `crop`, `soil`, `temp`, `rain` |
| `GET` | `/fertilizer` | ❌ | NPK ratio and split-dosing plan for given `crop`, `soil` |
| `GET` | `/crop-suggestion` | ❌ | Ranked crop suggestions for given `soil`, `temp`, `rain`, `hum` |

### 📊 Analytics — `/api/analytics`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/yield-trends` | ❌ | 6-month historical yield trend data |
| `GET` | `/regional` | ❌ | Regional production comparisons (6 Indian states) |
| `GET` | `/seasonal` | ❌ | Production split across Kharif, Rabi, Zaid seasons |
| `GET` | `/accuracy` | ❌ | ML model validation accuracy history |
| `GET` | `/dashboard-stats` | ✅ | User-specific aggregate stats (predictions, avg yield, accuracy) |

### 🔔 Notifications — `/api/notifications`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ✅ | List all notifications for the user |
| `POST` | `/` | ✅ | Create a new notification |
| `PUT` | `/<id>/read` | ✅ | Mark a notification as read |
| `DELETE` | `/<id>` | ✅ | Delete a notification |

### 💬 Chatbot — `/api/chatbot`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/message` | ❌ | Send a message and receive an AI agriculture response |

### 🛡 Admin — `/api/admin`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/users` | 🔒 Admin | List all registered users |
| `PUT` | `/users/<id>` | 🔒 Admin | Update a user's role |
| `DELETE` | `/users/<id>` | 🔒 Admin | Delete a user (admin lockout safeguard) |
| `GET` | `/stats` | 🔒 Admin | System metrics (user counts, predictions, reports) |
| `POST` | `/broadcast` | 🔒 Admin | Broadcast notification to all users |
| `POST` | `/crops` | 🔒 Admin | Add/update crop catalog entries |

### ❤️ Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | ❌ | Platform status (database, ML model readiness) |

---

## 🤖 Machine Learning & AI Models

### 1. Crop Yield Predictor

| Property | Details |
|----------|---------|
| **Algorithm** | Scikit-learn `RandomForestRegressor` (100 estimators) |
| **Training Data** | 200+ synthetic samples covering 15 crop types × 10 soil types |
| **Input Features** | `crop_type`, `soil_type`, `rainfall` (mm), `temperature` (°C), `humidity` (%), `fertilizer_usage` (kg/ha), `land_area` (ha) |
| **Output** | Total predicted yield (tonnes), yield per hectare, confidence score (78–98%) |
| **Serialization** | Joblib (`.joblib`) |
| **Fallback** | Multi-variable heuristic with baseline yields, soil modifier coefficients, and parabolic climate suitability curves |
| **Retrain** | `python -m app.ml.train_model` |

### 2. Plant Disease Detector

| Property | Details |
|----------|---------|
| **Online Engine** | Google Gemini 2.5 Flash Vision API (base64 image analysis) |
| **Offline Engine** | Rule-based clinical pathology database |
| **Disease Coverage** | 12 diseases: Bacterial Leaf Blight, Powdery Mildew, Corn Smut, Cotton Leaf Curl, Red Rot, Late Blight, Rust, Downy Mildew, Anthracnose, Fusarium Wilt, Mosaic Virus, Brown Spot |
| **Output** | Disease name, crop, confidence, severity, scientific description, symptoms, chemical treatments, organic remedies, preventive measures |

### 3. Smart Recommendation Engine

| Component | Description |
|-----------|-------------|
| **Crop Suitability** | Scores crop-soil-climate compatibility; ranks by season and region |
| **Irrigation Scheduler** | Day-by-day weekly watering plan; accounts for temperature, soil drainage, rainfall suspension |
| **NPK Optimizer** | Baseline N:P:K targets with split application schedules; adjusted for soil characteristics |
| **Soil Restoration** | Tailored conditioning strategies (humus for clay, cover crops for sandy, lime for laterite) |

---

## 🌐 Multi-Language Support

AgroPredict features a comprehensive internationalization (i18n) system:

### Platform UI Languages (4)

| Code | Language | Script |
|------|----------|--------|
| `en` | English | Latin |
| `hi` | Hindi | देवनागरी |
| `te` | Telugu | తెలుగు |
| `pa` | Punjabi | ਗੁਰਮੁਖੀ |

### Chatbot Languages (6)

The AI chatbot additionally supports offline responses in **Tamil** (`ta`) and **Marathi** (`mr`).

### Implementation Details

- **Language Context** (`LanguageContext.jsx`): React context with `localStorage` persistence (`agropredict-lang`)
- **Translation Dictionary** (`translations.js`): ~85 KB comprehensive dictionary covering all UI strings
- **Automatic Fallback**: Missing keys default to English
- **Document Configuration**: Dynamic `document.documentElement.lang` and `dir` attributes

---

## ☁️ Deployment

The project is deployed using a split architecture:

| Component | Platform | URL |
|-----------|----------|-----|
| **Frontend** | Vercel (Static Site) | [agro-dusky.vercel.app](https://agro-dusky.vercel.app) |
| **Backend** | Render (Web Service) | [agro-t1kk.onrender.com](https://agro-t1kk.onrender.com/api/health) |

### Render Backend Configuration (`render.yaml`)

```yaml
services:
  - name: agro-backend
    type: web
    runtime: python
    env: python
    region: oregon
    rootDir: backend
    buildCommand: chmod +x build.sh && ./build.sh
    startCommand: gunicorn run:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
    envVars:
      - key: FLASK_ENV
        value: production
      - key: PYTHON_VERSION
        value: "3.11.9"
      - key: SECRET_KEY
        generateValue: true
      - key: JWT_SECRET_KEY
        generateValue: true
      - key: GEMINI_API_KEY
        sync: false        # Set manually in Render Dashboard
```

### Vercel Frontend Configuration

- **Build Command:** `npm install && npm run build`
- **Output Directory:** `dist`
- **SPA Rewrites:** `/* → /index.html`
- **Environment Variable:** `VITE_API_URL` → Backend Render URL

### Auto-Seed Resilience

The backend includes a startup auto-seeding mechanism (`_seed_if_empty()` in `app/__init__.py`) that detects empty databases and automatically recreates demo users and crop data. This ensures the application works reliably on Render's free tier, where the filesystem is ephemeral and gets wiped on every spin-down.

---

## 📸 Application Pages

| Page | Description |
|------|-------------|
| **🏠 Landing** | Hero section with animated particles, platform stats, feature previews, farmer testimonials, and CTA buttons |
| **📊 Dashboard** | KPI stat cards (Total Predictions, Avg Yield, Active Crops, Accuracy), interactive Recharts graphs, recent predictions table, quick actions |
| **🌾 Prediction** | Crop yield forecasting with input sliders, real-time ML execution, result card with confidence gauge, and history log |
| **🦠 Disease Detection** | Drag-and-drop leaf upload, multi-step animated analysis, severity badges, tabbed treatment protocols |
| **🌤 Weather Station** | Current conditions panel, 24-hour temperature/rain chart, 5-day forecast cards, extreme weather alerts |
| **🧠 Smart Farming** | IoT telemetry dashboard (soil moisture, pH, NPK sensors), crop threshold guides, weekly farm task calendar |
| **📈 Analytics** | Multi-year yield curves, regional comparisons (6 states), seasonal breakdowns, ML validation accuracy |
| **🛡 Admin Panel** | User role management table, system health monitoring, crop catalog CRUD, global notification broadcast |
| **👤 Profile** | Editable user profile, password update, farm preferences |

---

## 🗺 Roadmap

- [ ] Integrate real weather API (OpenWeatherMap / Visual Crossing)
- [ ] Deep learning CNN model for disease detection (TensorFlow/PyTorch)
- [ ] Real-time IoT sensor data integration (MQTT)
- [ ] Mobile app (React Native)
- [ ] SMS/WhatsApp notification alerts via Twilio
- [ ] Satellite imagery analysis for crop health (NDVI)
- [ ] Farmer-to-buyer marketplace module
- [ ] Export reports as PDF
- [ ] Add more languages (Tamil, Marathi, Bengali, Kannada)
- [ ] Progressive Web App (PWA) support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Purpose |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `chore:` | Maintenance / tooling |
| `refactor:` | Code restructuring |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### Built with 💚 for the farming community

*AgroPredict — Empowering farmers with AI-driven precision agriculture*

**[⬆ Back to Top](#-agropredict--ai-powered-smart-farming-platform)**

</div>
