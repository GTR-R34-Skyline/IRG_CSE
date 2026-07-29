# WAAM AI — Wire Arc Additive Manufacturing Digital Twin

Production-grade AI web application powered by a pre-trained multi-output Random Forest machine learning model (`WAAM_AI_Model.pkl`).

This application predicts 10 continuous process/bead geometry parameters, classifies weld bead quality, and recommends edge compute deployment hardware in real-time.

---

## 🌟 Key Features

- **Pre-trained Model Integration**: Uses the exact `WAAM_AI_Model.pkl` (no retraining or replacement).
- **FastAPI Async Backend**:
  - `GET /api/health`: Health status & model deserialization verification.
  - `GET /api/schema`: Dynamically inspects preprocessing pipelines to extract material and shielding gas categories.
  - `POST /api/predict`: Runs inference on process inputs and returns 10 regression metrics + 2 classification outputs.
- **Tesla/NVIDIA Industrial Glassmorphic Frontend**:
  - React + TypeScript + Vite + Tailwind CSS.
  - Real-time parameter tuning with dynamic Arc Power calculation (`V * A / 1000`).
  - Interactive Recharts visualization, Porosity Gauge, and Quality Badges.
  - One-click JSON Copy, CSV Export, and Printable PDF Report generation.

---

## 🛠️ Project Structure

```text
IRG_CSE/
├── backend/
│   ├── app.py              # FastAPI application & CORS
│   ├── waam_model.py       # WAAMAI model wrapper & prediction logic
│   ├── schemas.py          # Pydantic request & response models
│   ├── requirements.txt    # Python dependencies
│   └── WAAM_AI_Model.pkl   # Serialized model
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Hero, PredictionForm, ResultsDashboard, About, Footer
│   │   ├── services/       # Axios API client
│   │   ├── types/          # TypeScript interface definitions
│   │   ├── App.tsx         # Main Application root
│   │   └── index.css       # Tailwind CSS & glassmorphism theme
│   ├── package.json
│   └── vite.config.ts      # Vite configuration & API proxy
└── README.md
```

---

## 🚀 Quick Start & Local Running

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (Python 3.12 compatible with scikit-learn 1.6.1 & numpy < 2)
python -m venv .venv

# Activate environment (Windows)
.\.venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Start FastAPI server
uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload
```

FastAPI Swagger API Documentation will be live at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📊 Model Outputs Exposed

| Output Field | Description | Type |
| :--- | :--- | :--- |
| `MeltPool_Area_mm2` | Melt pool cross-sectional area | Continuous (float) |
| `MeltPool_Width_mm` | Width of the liquid melt pool | Continuous (float) |
| `MeltPool_Length_mm` | Length of the liquid melt pool | Continuous (float) |
| `Bead_Width_mm` | Deposited weld bead width | Continuous (float) |
| `Bead_Height_mm` | Deposited weld bead height | Continuous (float) |
| `Build_Height_mm` | Cumulative layer build height | Continuous (float) |
| `Vibration_g` | Sensor vibration acceleration | Continuous (float) |
| `RGB_Brightness` | Melt pool optical brightness | Continuous (float) |
| `RGB_Contrast` | Melt pool optical contrast | Continuous (float) |
| `Porosity_pct` | Volumetric defect porosity % | Continuous (float) |
| `Predicted_Bead_Quality` | Weld Bead Quality Class | Category (`Optimal`, `Good`, `Fair`, `Poor`) |
| `Edge_Device` | Recommended AI Compute Unit | Category (`Jetson Xavier`, `Jetson Nano`) |

---

## ⚙️ Deployment Instructions

### Production Build (Frontend)
```bash
cd frontend
npm run build
```
The static assets will be output to `frontend/dist/`.

### Production Deployment (Backend)
Serve using Uvicorn or Gunicorn with Uvicorn workers:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.app:app
```
