# 🗺️ Smart India Explorer - Digital Travel Buddy

A premium, modern React + Node.js travel companion app designed for tourists visiting India. The application features a glassmorphic user interface, personalized daily planners, simulated augmented-reality street direction feeds, real-time voice translation, safety radars, emergency PANIC triggers, and fare estimation tickets.

---

## 🚀 Key Features

### 📅 1. Personalized Trip Planner
- AI-simulated daily itineraries generated based on your destination, trip length, budget tier (Backpacker, Mid-range, Luxury), and custom interests (Temples, Food, History, etc.).
- Detailed day-by-day activity timelines featuring localized safety alerts, cost estimates, transit recommendations, and dining hotspots.

### 🔐 2. Secure User Accounts
- Secure local authentication (Sign In / Sign Up landing page).
- Data isolation: saved itineraries are bound to your user ID, keeping your travel plans private.

### 🎥 3. Camera Street Map (AR HUD)
- Leverages the browser camera stream to display a mock augmented reality navigation HUD.
- Overlays floating Polaroid-style tags showing destination names, walking time estimates (e.g. *5 min walk*), category tags, and visitor reviews.

### 🗣️ 4. Dual-Way Voice & Text Translator
- Voice-enabled translation utility supporting English-to-Hindi and Hindi-to-English translations.
- Listens using the browser's Speech-to-Text API and plays translation outputs aloud via the SpeechSynthesis engine.

### 🍛 5. Local Food Guideline & Boarding Pass
- Curated index of regional delicacies, safety advice, spiciness levels, and allergen warnings.
- **"Request Ticket"** prints a luxurious travel ticket voucher containing dietary guidelines translated into Devanagari script to hand directly to local cooks and waiters.

### 🚕 6. Transit Estimator & Fare Vouchers
- Calculates auto-rickshaw and cab rates compared side-by-side.
- **"Show Driver"** displays a high-visibility fare ticket voucher displaying the estimated price in large, bold numbers (e.g. *₹ 75*) for tourists to point directly to local taxi drivers.

### 🛡️ 7. Safety Hub & Scam Radar
- SOS panic trigger button with a cancelable countdown timer.
- **Fake Call Escaper** triggers a simulated phone call overlay from the **"Hotel Manager"** after 5 seconds to help tourists exit aggressive sell negotiations safely.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite 5, Tailwind-compatible CSS variables, Lucide React icons.
- **Backend**: Node.js, Express, Nodemon.
- **Database**: Zero-dependency local JSON file store (`data/db.json` initialized automatically via `data/seedData.json`).
- **Typography**: Geometric `Outfit` & `Poppins` fonts globally.

---

## 📦 Local Installation & Setup

Ensure you have [Node.js (v18+)](https://nodejs.org/) installed.

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd smart-india-explorer
```

### 2. Run the Backend API
```bash
cd backend
npm install
npm run dev
```
The server will boot on port `8081`. Health check endpoint is available at `http://localhost:8081/api/health`.

### 3. Run the React Client
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The client will bind to standard port `5173`. Open **`http://localhost:5173/`** in your browser.

---

## 🔒 Security & Git Configuration

To keep credentials secure, this repository is configured with a strict `.gitignore` that completely excludes:
- Local dynamic user records and passwords (`backend/data/db.json`).
- Node packages (`node_modules/`).
- Local build outputs, configurations, and environment secrets (`.env`).
