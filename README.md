# 🕵️ DeepGuard : A Deepfake Detection System

<div align="center">
  <br />
      <img src="face-recognition-personal-identification-collage.jpg" alt="Project Banner">
      <br />
  <br />
</div>

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

An AI-powered web app that detects deepfake images/videos using **MesoNet** and **Hugging Face Transformers**, with a **FastAPI** backend and a **Vite + React + TypeScript + Tailwind CSS** frontend.

- **Image analysis** — MesoNet (`mesonet_deepfake_model.h5`) with confidence scores and a bar chart.
- **Video analysis** — frame-by-frame Hugging Face ViT with face cropping, temporal smoothing, live progress, and downloadable CSV results.
- **Responsive UI** — works on mobile, tablet, and desktop, with a dark/light theme toggle.

## 🏗️ Project Structure

```
Deepfake-Detection/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI app, CORS, router mounting
│   │   ├── config.py             # Settings (model paths, HF token, CORS)
│   │   ├── routers/              # health, image, video endpoints
│   │   ├── services/             # model loading, image/video analysis, job store
│   │   ├── schemas/              # Pydantic request/response models
│   │   └── utils/                # face/frame preprocessing helpers
│   ├── models/                   # Pre-trained .h5 models
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/                  # API client + shared types
│   │   ├── components/           # Card, Badge, Metric, charts, upload, etc.
│   │   ├── pages/                # ImageAnalysis, VideoAnalysis
│   │   ├── hooks/                # useTheme, useVideoJob (progress polling)
│   │   └── lib/                  # CSV export + formatting helpers
│   ├── vite.config.ts            # Dev proxy: /api -> http://127.0.0.1:8000
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10+ (TensorFlow is sensitive to the version)
- Node.js 18+ and npm

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate      # Linux/Mac
pip install -r requirements.txt

# Optional: for gated Hugging Face models
copy .env.example .env          # then set HUGGINGFACE_TOKEN

uvicorn app.main:app --reload --port 8000
```

Backend runs at http://127.0.0.1:8000 — interactive docs at `/docs`.

### 2. Frontend (Vite + React + TS + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/api` to the backend, so no extra config is needed.

### Production build

```bash
cd frontend
npm run build        # outputs static assets to frontend/dist
```

## 🔌 API Reference

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET`  | `/api/health` | Service + model availability |
| `POST` | `/api/images/analyze` | Multipart `file`, `threshold` → deepfake score for an image |
| `POST` | `/api/videos/analyze` | Multipart `file`, `threshold`, `model_id` → returns `{ job_id }` (202) |
| `GET`  | `/api/videos/jobs/{job_id}` | Job status, progress, and final result |

Video analysis is asynchronous: start a job, then poll the job endpoint until `status` is `done` or `error`.

## ⚙️ Configuration

Backend (`backend/.env`):

```
HUGGINGFACE_TOKEN=your_token_here
CORS_ORIGINS=http://localhost:5173
```

Frontend (`frontend/.env`):

```
VITE_API_URL=/api
```

## 📜 License

MIT License. See LICENSE for details.

## 🤝 Contributing

1. Fork the project
2. Create a branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Made with ❤️ by Sunil Sowrirajan
