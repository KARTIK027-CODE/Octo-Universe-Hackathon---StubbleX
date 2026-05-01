# StubbleX Deployment Guide 🚀

Follow these steps exactly to deploy your StubbleX app to Render.

## 1. Deploy the Backend (Python) first 🐍
*This creates the API that your frontend will talk to.*

1.  Click **New +** -> **Web Service**.
2.  Connect your GitHub repo: `StubbleX`.
3.  **Name**: `stubblex-backend`
4.  **Language**: `Python 3`
5.  **Root Directory**: `backend`
6.  **Build Command**: `echo Done` (Avoid using quotes to prevent syntax errors)
7.  **Start Command**: `python simple_server.py`
8.  Click **Create Web Service**.
9.  **COPY THE URL** assigned to this service (e.g., `https://stubblex-backend.onrender.com`). You need it for step 2.

## 2. Deploy the Frontend (Next.js) ⚡
*This is the website users will see.*

1.  Click **New +** -> **Web Service**.
2.  Connect your GitHub repo: `StubbleX`.
3.  **Name**: `stubblex-frontend`
4.  **Language**: `Node` (or `Docker` if preferred, but Node is fine).
5.  **Root Directory**: leave empty (defaults to root).
6.  **Build Command**: `npm install; npm run build`
7.  **Start Command**: `npm run start`
8.  **Environment Variables** (Crucial Step!):
    *   Find the **"Environment Variables"** section.
    *   Click **"Add Environment Variable"**.
    *   **Key**: `NEXT_PUBLIC_API_URL`
    *   **Value**: Paste the Backend URL from Step 1 (e.g., `https://stubblex-backend.onrender.com`).
    *   *Note: Do not add a trailing slash `/` at the end.*
9.  Click **Create Web Service**.

---

## ✅ Success!
Your StubbleX app will be live at the URL provided by the Frontend service.
