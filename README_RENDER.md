# 🚀 How to Deploy LoanGuard ML Platform on Render

All configuration files required to deploy this project on **Render** have been created for you!

---

## 📋 Created Deployment Files

| File | Purpose |
| :--- | :--- |
| `render.yaml` | Render Infrastructure-as-Code Blueprint specification |
| `build.sh` | Build script that installs Python & Node packages and compiles Vite frontend |
| `Procfile` | Specifies Web server execution command (`gunicorn backend.app:app`) |
| `requirements.txt` | Python dependencies required for Scikit-Learn Flask backend |
| `backend/requirements.txt` | Backend-specific Python requirements |

---

## ⚡ Option 1: 1-Click Deployment via Render Blueprint (Recommended)

1. Push your repository to **GitHub** or **GitLab**.
2. Go to your [Render Dashboard](https://dashboard.render.com).
3. Click **"New +"** and select **"Blueprint"**.
4. Connect your GitHub repository.
5. Render will automatically detect `render.yaml` and configure both:
   - **Web Service**: Flask API + Embedded React UI
   - **Static Site**: Standalone Vite React Frontend
6. Click **"Apply"** and wait for deployment to complete!

---

## 🛠️ Option 2: Deploy as a Single Web Service (Manual Setup)

If you prefer setting up manually without Blueprint:

1. Go to [Render Dashboard](https://dashboard.render.com) -> **"New +"** -> **"Web Service"**.
2. Connect your GitHub repository.
3. Fill in the following settings:
   - **Name**: `loanguard-ml-platform`
   - **Environment**: `Python 3`
   - **Region**: Select closest to your users
   - **Branch**: `main`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn backend.app:app`
4. Click **"Create Web Service"**.

---

## 🔍 How It Works Under the Hood

- `build.sh` automatically installs Python packages, navigates to `frontend/`, installs npm packages, and builds `dist/`.
- `backend/app.py` serves the Flask API at `/api/...` and serves the static production React frontend (`dist/`) directly on root routes `/`.
- `gunicorn` handles production web requests with zero configuration required.

Enjoy your deployed Machine Learning Credit Intelligence Platform on Render! 🎉
