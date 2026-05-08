# Wayfarer AI 🌍⚡

> **An adaptive AI travel engine that replans your trip in real time based on weather, crowd density, budget, delays, and personal vibe.**

[![Built on Google Cloud](https://img.shields.io/badge/Google%20Cloud-Firebase-orange?logo=firebase)](https://firebase.google.com)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%202.0-blue?logo=google)](https://aistudio.google.com)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb?logo=react)](https://vitejs.dev)

---

## What It Does

Wayfarer AI goes beyond static itinerary planners. It's an **adaptive intelligence engine** that:

1. 🧠 **Generates** a hyper-personalized itinerary using Gemini AI
2. 🌧️ **Detects** live weather and crowd conditions
3. 🔄 **Replans** sections instantly when disruptions occur
4. 💡 **Explains** every decision with transparent AI reasoning
5. 📊 **Shows** real-time crowd intelligence per venue
6. ⭐ **Scores** your trip with an AI-computed Vibe Score

---

## Demo Story

> *"I'm in Tokyo for 3 days. Budget: medium. Love anime cafes, hidden spots, nightlife. Avoid crowds. Rainy weather → prefer indoor activities."*

**What happens:**
1. AI generates a beautiful day-by-day itinerary
2. Live weather fetched automatically
3. After 12 seconds → "Rain alert detected" (82% probability)
4. AI replans Day 1 — swaps outdoor venues for covered alternatives
5. Explains WHY each change was made
6. Crowd intelligence shows live density at popular spots

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Animations | Framer Motion |
| Styling | Vanilla CSS + CSS Modules |
| AI | Google Gemini 2.0 Flash |
| Cloud | Firebase Hosting + Firestore |
| Weather | Open-Meteo API (No Key Required) |
| State | React Context + useReducer |

---

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/Ayushmishra112/Wayfarer.git
cd Wayfarer
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Fill in your API keys:

```env
VITE_GEMINI_API_KEY=your_gemini_key
VITE_FIREBASE_API_KEY=your_firebase_key
# ... (see .env.example for all keys)
```

> **No API keys?** The app uses Open-Meteo for free weather data (no key needed!).
> You **must** have a Gemini API key for itinerary generation.

### 3. Run Locally

```bash
npm run dev
```

### 4. Deploy to Firebase

```bash
npm run build
firebase deploy
```

---

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full architecture diagram and design decisions.

**Key principle:** Service layer abstraction — all external API calls are isolated in `src/services/`. Components never call APIs directly.

---

## Project Structure

```
src/
├── components/     # UI components (each with .jsx + .module.css)
├── config/         # Firebase initialization
├── hooks/          # Custom hooks (business logic)
├── services/       # API abstraction layer
├── store/          # Global state (Context + useReducer)
├── App.jsx
└── index.css       # Design system tokens
```

---

## Security

- ✅ All keys in `.env` (git-ignored)
- ✅ `.env.example` template provided
- ✅ No secrets hardcoded
- ✅ Firebase config uses Vite environment variables

---

*Powered by Google Cloud · Gemini AI · Firebase*
