# 🚀 How to Deploy LoanGuard ML Platform on Vercel

All configuration files required to deploy this full-stack Machine Learning project on **Vercel** have been created and configured!

---

## 📋 Created Deployment Files

| File | Purpose |
| :--- | :--- |
| `vercel.json` | Vercel configuration for SPA routing, Python Serverless Function, and Vite static build |
| `api/index.py` | Vercel Python Serverless Function entrypoint exporting the Flask `app` |
| `api/requirements.txt` | Python dependencies required for Scikit-Learn Flask backend on Vercel |
| `package.json` | Root build scripts triggering frontend Vite production compilation |

---

## ⚡ Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your repository** to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** -> **"Project"**.
3. Import your **GitHub Repository**.
4. In the Project Configuration settings:
   - **Framework Preset**: Select **Vite** (or **Other**).
   - **Root Directory**: `./` (leave default if `Project` is repo root).
   - **Build Command**: `npm run build --prefix frontend` (automatically configured by `vercel.json`).
   - **Output Directory**: `frontend/dist` (automatically configured by `vercel.json`).
5. Click **"Deploy"**.
6. Vercel will automatically compile the React frontend assets and package the Flask API with SciKit-Learn models into serverless functions!

---

## 💻 Option 2: Deploy via Vercel CLI

If you have Vercel CLI installed locally:

```bash
# 1. Install Vercel CLI (if not installed)
npm install -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Deploy Preview Build
vercel

# 4. Deploy to Production
vercel --prod
```

---

## 🔍 How Architecture Works on Vercel

1. **Frontend (Vite + React + Tailwind)**:
   - Built into `frontend/dist`.
   - Served globally via Vercel's high-speed Edge CDN.
2. **Backend (Python 3 + Flask + Scikit-Learn)**:
   - Routed from `/api/*` to `api/index.py`.
   - Executes inside Vercel Python Serverless Functions with automatic scaling.
   - Includes trained models (`loan_model.joblib`, `loan_scaler.joblib`, `model_metadata.json`) via `includeFiles` directive in `vercel.json`.

---

## 🧪 Verifying Deployment

Once deployed:
- **Web Interface**: Open `https://your-project.vercel.app/`
- **Health Check**: Open `https://your-project.vercel.app/api/health`
- **Model Info**: Open `https://your-project.vercel.app/api/model-info`
- **Prediction Test**: Send POST request to `https://your-project.vercel.app/api/predict`

Enjoy your deployed LoanGuard ML Credit Intelligence Platform on Vercel! 🎉
