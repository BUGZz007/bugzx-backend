# 🚀 How to Run & Use BUGZX Locally

This guide explains how to set up, run, and use both the **FastAPI Backend** and **React Frontend** on your local machine.

---

## 🛠️ Prerequisites & Requirements

1. **Node.js & Yarn**
   - Node.js installed on your system.
   - `yarn` package manager installed (`npm install -g yarn`).

2. **Python Environment**
   - Python 3.11+ available on your machine.
   - *Note for Windows with App Control:* If standard `python` is restricted, use the full path to your Python executable (e.g., `C:\Users\visha\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe`).

3. **MongoDB**
   - MongoDB running locally on port `27017` (Default URL: `mongodb://localhost:27017`).

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`)
Ensure `backend/.env` contains:
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="bugzx_database"
CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
```

### Frontend (`frontend/.env`)
Ensure `frontend/.env` contains:
```env
REACT_APP_BACKEND_URL=http://localhost:8000
WDS_SOCKET_PORT=3000
ENABLE_HEALTH_CHECK=false
```

---

## 🏃 Quick Start Guide

### 1. Run the Backend Server (FastAPI)

Navigate to the `backend` folder and run Uvicorn:

**Option A (Standard Python):**
```powershell
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**Option B (Specific Local Python Path):**
```powershell
cd backend
$python = "C:\Users\visha\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
$uvicorn = "C:\Users\visha\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\Scripts\uvicorn.exe"
& $uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

- **Backend API URL:** [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 2. Run the Frontend App (React)

Open a new terminal window, navigate to the `frontend` folder, and start the development server:

```powershell
cd frontend
yarn install
yarn start
```

- **Frontend App URL:** [http://localhost:3000](http://localhost:3000)

---

## 🌐 Firebase Hosting (Frontend Only)

If you want to publish only the React frontend to Firebase Hosting, use the existing Firebase config in this project.

### 1. Install Firebase CLI
```powershell
npm install -g firebase-tools
```

### 2. Login to Firebase
```powershell
firebase login
```

### 3. Set your Firebase project ID
Edit [.firebaserc](.firebaserc) and replace `YOUR_FIREBASE_PROJECT_ID` with your real Firebase project ID:
```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

### 4. Build the frontend
```powershell
cd frontend
yarn install
yarn build
```

### 5. Deploy to Firebase Hosting
From the project root:
```powershell
firebase deploy --only hosting
```

Your app will be available at:
- `https://<your-project-id>.web.app`
- `https://<your-project-id>.firebaseapp.com`

> This deploys only the frontend. The backend remains local unless you also host it separately.

---

## 📌 Features & Verification

- Open [http://localhost:3000](http://localhost:3000) in your web browser.
- Check API health at [http://localhost:8000/api/](http://localhost:8000/api/) (returns `{"message": "Hello World"}`).
