<![CDATA[<div align="center">

# 🌿 AgroPredict — AI-Powered Smart Farming Platform

**Precision Agriculture Meets Artificial Intelligence**

[![Deploy](https://img.shields.io/badge/Launch-Live%20App-00e676?style=for-the-badge&logo=vercel&logoColor=white)](https://agro-dusky.vercel.app)

![Version](https://img.shields.io/badge/version-1.0.0-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

<br/>

*AgroPredict is a full-stack intelligent farming platform that combines machine learning, real-time weather analytics, and AI-driven recommendations to help farmers maximize crop yields and make data-driven agricultural decisions.*

<br/>

</div>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [🔑 Default Credentials](#-default-credentials)
- [📡 API Reference](#-api-reference)
- [🤖 Machine Learning Models](#-machine-learning-models)
- [📸 Screenshots](#-screenshots)
- [🗺 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🌾 Crop Yield Prediction
- Input soil type, rainfall, temperature, humidity, fertilizer usage, and land area
- Get AI-predicted yield with confidence scores powered by a **Random Forest Regressor**
- Full prediction history with pagination and per-user tracking

### 🦠 Disease Detection
- Upload leaf/crop images for instant disease identification
- Covers **10+ common plant diseases** with symptoms, confidence scores, and treatment plans
- Persistent disease report history per user

### 🌤 Weather Station
- Real-time weather data: temperature, humidity, wind, UV index, soil temp, pressure
- **24-hour forecast chart** with dual temperature & rainfall curves
- **5-day horizon forecast** cards with rain probability and wind speeds
- Severe meteorological warnings and agri-advisory recommendations
- Sensor health status dashboard

### 🧠 Smart Farming Recommendations
- AI-generated irrigation schedules based on soil & weather data
- Fertilizer optimization plans with NPK analysis
- Crop suitability suggestions by region and season
- Water management and soil health advisories

### 📊 Analytics Dashboard
- Yield trend analysis by crop type and year (interactive line charts)
- Regional production heatmap data
- Seasonal analysis and prediction accuracy metrics
- Dashboard summary statistics with animated counters

### 💬 AI Chatbot
- Floating chat assistant with agriculture knowledge base
- Quick-action buttons for common farming queries
- Covers crop management, pest control, irrigation, fertilizers, and weather guidance

### 👤 User Management
- JWT-based authentication (Register / Login / Logout)
- Role-based access: **Farmer**, **Admin**, **Expert**
- Profile management with editable fields
- Admin panel for user management and system stats

### 🎨 Premium UI/UX
- Dark glassmorphic design with emerald/gold accent palette
- Framer Motion animations throughout (fade, slide, scale)
- Fully responsive layout with collapsible sidebar
- Custom scrollbars, shimmer loaders, and micro-interactions
- Notification system with bell badge and dropdown

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library with hooks |
| **Vite 5** | Lightning-fast dev server & bundler |
| **Tailwind CSS 3** | Utility-first styling framework |
| **Framer Motion** | Declarative animations |
| **Recharts** | Data visualization (charts & graphs) |
| **React Router 6** | Client-side routing |
| **Axios** | HTTP client |
| **React Icons** | Icon library (Remix Icons) |
| **React Hot Toast** | Toast notifications |
| **React Dropzone** | Drag-and-drop file uploads |

### Backend
| Technology | Purpose |
|---|---|
| **Flask** | Python web framework |
| **Flask-SQLAlchemy** | ORM & database management |
| **Flask-JWT-Extended** | JSON Web Token authentication |
| **Flask-CORS** | Cross-Origin Resource Sharing |
| **Flask-Migrate** | Database migrations |
| **Scikit-learn** | Machine learning (RandomForestRegressor) |
| **Pandas / NumPy** | Data manipulation |
| **Pillow** | Image processing |
| **SQLite** | Lightweight relational database |
| **Joblib** | Model serialization |

---

## 📁 Project Structure

```
AGRO/
├── README.md
│
├── backend/                          # Flask REST API
│   ├── run.py                        # Application entry point
│   ├── requirements.txt              # Python dependencies
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Env template
│   ├── agropredict.db                # SQLite database (auto-generated)
│   │
│   ├── app/
│   │   ├── __init__.py               # App factory (create_app)
│   │   ├── config.py                 # Configuration classes
│   │   ├── extensions.py             # SQLAlchemy, JWT, Migrate init
│   │   │
│   │   ├── models/                   # Database models
│   │   │   ├── user.py               # User model (roles, auth)
│   │   │   ├── crop.py               # Crop & CropData models
│   │   │   ├── prediction.py         # Prediction & Recommendation
│   │   │   ├── notification.py       # Notification model
│   │   │   └── disease_report.py     # Disease report model
│   │   │
│   │   ├── routes/                   # API blueprints
│   │   │   ├── auth.py               # /api/auth/*
│   │   │   ├── prediction.py         # /api/predictions/*
│   │   │   ├── disease.py            # /api/disease/*
│   │   │   ├── weather.py            # /api/weather/*
│   │   │   ├── admin.py              # /api/admin/*
│   │   │   ├── recommendations.py    # /api/recommendations/*
│   │   │   ├── analytics.py          # /api/analytics/*
│   │   │   ├── notifications.py      # /api/notifications/*
│   │   │   └── chatbot.py            # /api/chatbot/*
│   │   │
│   │   ├── ml/                       # Machine Learning
│   │   │   ├── crop_yield_model.py   # CropYieldPredictor class
│   │   │   ├── disease_model.py      # DiseaseDetector class
│   │   │   ├── recommendation_engine.py  # RecommendationEngine
│   │   │   ├── train_model.py        # Training script
│   │   │   └── crop_yield_rf.joblib  # Trained RF model
│   │   │
│   │   ├── utils/
│   │   │   ├── helpers.py            # Utility functions
│   │   │   └── decorators.py         # @admin_required, @expert_required
│   │   │
│   │   └── data/
│   │       └── crop_data.csv         # 200+ rows synthetic training data
│   │
│   ├── migrations/
│   │   └── init_db.py                # DB init & seed script
│   │
│   └── uploads/                      # Disease image uploads
│
└── frontend/                         # React SPA
    ├── index.html                    # HTML entry point
    ├── package.json                  # Node dependencies
    ├── vite.config.js                # Vite configuration (proxy → :5000)
    ├── tailwind.config.js            # Tailwind theme extensions
    ├── postcss.config.js             # PostCSS config
    │
    └── src/
        ├── main.jsx                  # React DOM render
        ├── App.jsx                   # Routes & layout
        ├── index.css                 # Global styles & animations
        │
        ├── context/
        │   ├── AuthContext.jsx        # Auth state & JWT management
        │   └── ThemeContext.jsx        # Dark/light theme toggle
        │
        ├── services/
        │   ├── api.js                 # Axios instance + interceptors
        │   ├── auth.js                # Auth API calls
        │   ├── predictions.js         # Prediction API calls
        │   └── weather.js             # Weather API calls
        │
        ├── components/
        │   ├── layout/
        │   │   ├── Sidebar.jsx        # Navigation sidebar
        │   │   ├── Header.jsx         # Top bar (search, notifications)
        │   │   └── AppLayout.jsx      # Dashboard shell layout
        │   │
        │   ├── common/
        │   │   ├── AnimatedCard.jsx    # Framer Motion card wrapper
        │   │   ├── StatsCard.jsx      # Stat with icon & trend
        │   │   ├── ChartCard.jsx      # Recharts chart wrapper
        │   │   ├── LoadingSkeleton.jsx # Shimmer skeleton loader
        │   │   ├── ThemeToggle.jsx     # Sun/Moon theme switch
        │   │   └── FileUpload.jsx     # Drag-and-drop uploader
        │   │
        │   └── chatbot/
        │       └── ChatBot.jsx        # Floating AI chat assistant
        │
        └── pages/
            ├── Landing.jsx            # Public landing page
            ├── Login.jsx              # Login form
            ├── Signup.jsx             # Registration form
            ├── ForgotPassword.jsx     # Password reset
            ├── Dashboard.jsx          # Main dashboard
            ├── Prediction.jsx         # Yield prediction tool
            ├── Analytics.jsx          # Charts & analytics
            ├── DiseaseDetection.jsx   # Image-based detection
            ├── SmartFarming.jsx       # AI recommendations
            ├── Weather.jsx            # Weather station
            ├── AdminPanel.jsx         # Admin management
            ├── Profile.jsx            # User profile
            ├── About.jsx              # About page
            ├── Contact.jsx            # Contact page
            ├── Features.jsx           # Features showcase
            └── NotFound.jsx           # 404 page
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| **Python** | 3.10+ |
| **Node.js** | 18+ |
| **npm** | 9+ |
| **Git** | Latest |

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd AGRO/backend

# 2. Create a virtual environment (recommended)
python -m venv venv

# 3. Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install Python dependencies
pip install -r requirements.txt

# 5. Set up environment variables
cp .env.example .env
# Edit .env with your own SECRET_KEY if desired

# 6. Initialize the database with seed data
python migrations/init_db.py

# 7. Train the ML model (generates crop_yield_rf.joblib)
python -m app.ml.train_model

# 8. Start the Flask development server
python run.py
```

The backend API will be running at **http://localhost:5000**

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd AGRO/frontend

# 2. Install Node dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

The frontend will be running at **http://localhost:5173** and proxies all `/api` requests to the Flask backend on port 5000.

### Production Build

```bash
# Build optimized production bundle
cd AGRO/frontend
npm run build

# Preview the production build
npm run preview
```

---

## 🔑 Default Credentials

After running the database seed script (`init_db.py`), the following accounts are available:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@agropredict.com` | `admin123` |
| **Farmer** | *(register a new account)* | *(your choice)* |

---

## 📡 API Reference

All API endpoints are prefixed with `/api`. Authentication uses **Bearer JWT tokens** in the `Authorization` header.

### 🔐 Authentication — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login & receive JWT token | ❌ |
| `POST` | `/forgot-password` | Request password reset | ❌ |
| `GET` | `/profile` | Get current user profile | ✅ |
| `PUT` | `/profile` | Update user profile | ✅ |
| `POST` | `/logout` | Logout | ✅ |

### 🌾 Predictions — `/api/predictions`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/predict` | Submit data & get yield prediction | ✅ |
| `GET` | `/` | List all user predictions | ✅ |
| `GET` | `/<id>` | Get specific prediction | ✅ |
| `GET` | `/history` | Paginated prediction history | ✅ |

**POST `/predict` body:**
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

### 🦠 Disease Detection — `/api/disease`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/detect` | Upload image for detection | ✅ |
| `GET` | `/reports` | List user's disease reports | ✅ |
| `GET` | `/reports/<id>` | Get specific report | ✅ |

### 🌤 Weather — `/api/weather`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/current?city=<city>` | Current weather data | ❌ |
| `GET` | `/forecast?city=<city>&days=<n>` | Multi-day + hourly forecast | ❌ |
| `GET` | `/alerts` | Active weather alerts | ❌ |

### 🧠 Recommendations — `/api/recommendations`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/` | Get AI recommendations | ✅ |
| `POST` | `/generate` | Generate new recommendations | ✅ |
| `GET` | `/irrigation` | Irrigation schedule | ✅ |
| `GET` | `/fertilizer` | Fertilizer optimization plan | ✅ |
| `GET` | `/crop-suggestion` | Best crop suggestions | ✅ |

### 📊 Analytics — `/api/analytics`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/yield-trends` | Yield trends by crop & year | ❌ |
| `GET` | `/regional` | Region-wise production data | ❌ |
| `GET` | `/seasonal` | Seasonal analysis data | ❌ |
| `GET` | `/accuracy` | Prediction accuracy metrics | ❌ |
| `GET` | `/dashboard-stats` | Dashboard summary stats | ❌ |

### 🔔 Notifications — `/api/notifications`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/` | Get user notifications | ✅ |
| `PUT` | `/<id>/read` | Mark notification as read | ✅ |
| `POST` | `/` | Create a notification | ✅ |
| `DELETE` | `/<id>` | Delete a notification | ✅ |

### 💬 Chatbot — `/api/chatbot`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/message` | Send message, get AI response | ❌ |

### 🛡 Admin — `/api/admin`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/users` | List all users | 🔒 Admin |
| `PUT` | `/users/<id>` | Update user role | 🔒 Admin |
| `DELETE` | `/users/<id>` | Delete a user | 🔒 Admin |
| `GET` | `/stats` | Dashboard statistics | 🔒 Admin |
| `GET` | `/datasets` | List datasets | 🔒 Admin |
| `POST` | `/crops` | Add/update crop info | 🔒 Admin |

---

## 🤖 Machine Learning Models

### Crop Yield Predictor

| Property | Details |
|---|---|
| **Algorithm** | Random Forest Regressor |
| **Training Data** | 200+ synthetic samples covering 10 crop types and 6 soil types |
| **Features** | crop_type, soil_type, rainfall, temperature, humidity, fertilizer_usage, land_area |
| **Output** | Predicted yield (tons/hectare) + confidence score |
| **Serialization** | Joblib (`.joblib` format) |
| **Retraining** | `python -m app.ml.train_model` |

### Disease Detector

| Property | Details |
|---|---|
| **Method** | Rule-based simulation with realistic confidence scores |
| **Coverage** | 10+ common plant diseases (Leaf Blast, Blight, Rust, Powdery Mildew, etc.) |
| **Output** | Disease name, confidence, symptoms, and treatment recommendations |

### Recommendation Engine

| Property | Details |
|---|---|
| **Method** | Rule-based AI engine analyzing weather, soil, and crop parameters |
| **Outputs** | Irrigation schedules, fertilizer plans, crop suggestions, water management, soil tips |

---

## 📸 Screenshots

> After starting the application, visit **http://localhost:5173** to explore the full UI.

| Page | Description |
|---|---|
| **Landing Page** | Hero section with animated particles, feature cards, stats, testimonials |
| **Dashboard** | Stats cards, yield charts, quick actions, recent predictions |
| **Prediction** | Input form with sliders, result card with confidence gauge |
| **Weather Station** | Current conditions, 24-hour chart, 5-day horizon, alerts panel |
| **Disease Detection** | Drag-and-drop image upload, detection results with treatment |
| **Smart Farming** | AI recommendations for irrigation, fertilizer, and crop selection |
| **Analytics** | Interactive Recharts graphs for trends, regional, and seasonal data |

---

## 🗺 Roadmap

- [ ] Integrate real weather API (OpenWeatherMap / Visual Crossing)
- [ ] Deep learning model for disease detection (CNN with TensorFlow/PyTorch)
- [ ] Real-time IoT sensor data integration
- [ ] Multi-language support (Hindi, Punjabi, Tamil, Telugu)
- [ ] Mobile app (React Native)
- [ ] SMS/WhatsApp notification alerts
- [ ] Satellite imagery analysis for crop health
- [ ] Marketplace for farmer-to-buyer connections
- [ ] Export reports as PDF

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with 💚 for the farming community**

*AgroPredict — Empowering farmers with AI-driven precision agriculture*

</div>
]]>
