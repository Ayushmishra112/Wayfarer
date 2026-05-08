# TripPulse AI — Architecture Documentation

## Overview

TripPulse AI is an adaptive travel intelligence engine that generates dynamic itineraries in real time, responding to weather, crowd density, transit delays, and user vibe preferences.

**Built on the Google Cloud ecosystem:**
- Gemini AI (generation + replanning)
- Firebase Hosting (deployment)
- Firebase Firestore (data persistence)
- Open-Meteo API (live weather)
- Google Maps Places API (venue context)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                  │
│                                                                 │
│  ┌──────────────┐    ┌──────────────────┐    ┌───────────────┐ │
│  │  Left Panel  │    │  Center Panel    │    │  Right Panel  │ │
│  │  TripForm    │    │  ItineraryPanel  │    │  LivePanel    │ │
│  │  Preferences │    │  Timeline UI     │    │  Alerts+Feed  │ │
│  └──────┬───────┘    └────────┬─────────┘    └───────┬───────┘ │
│         │                    │                       │         │
│         └──────────── TripStore (Context) ───────────┘         │
│                       useReducer state                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │         SERVICE LAYER        │
              │                             │
              │  geminiService.js           │
              │  weatherService.js          │
              │  firestoreService.js        │
              └──────────────┬──────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
   ┌───────────┐      ┌────────────┐      ┌────────────┐
   │ Gemini AI │      │ Open-Meteo │      │  Firestore │
   │  (GCP)    │      │    API     │      │   (GCP)    │
   └───────────┘      └────────────┘      └────────────┘
```

---

## Folder Structure

```
src/
├── components/
│   ├── TripForm/          # Left panel — user preferences
│   ├── ItineraryPanel/    # Center panel — timeline display
│   ├── LivePanel/         # Right panel — live context & alerts
│   ├── EmptyState/        # Pre-generation welcome screen
│   ├── GeneratingState/   # Loading screen during AI generation
│   └── VibeScoreRing/     # Animated SVG score indicator
│
├── config/
│   └── firebase.js        # Firebase initialization
│
├── hooks/
│   └── useItineraryGenerator.js  # Generation pipeline orchestration
│
├── services/
│   ├── geminiService.js   # Gemini AI abstraction
│   ├── weatherService.js  # Open-Meteo API abstraction
│   └── firestoreService.js # Firestore CRUD abstraction
│
├── store/
│   └── tripStore.jsx      # Global state (Context + useReducer)
│
├── App.jsx                # Root layout
├── main.jsx               # Entry point
└── index.css              # Global design system (CSS tokens)
```

---

## Key Design Decisions

### 1. No Custom Backend
Firebase is used directly from the frontend. This eliminates:
- Express server setup time
- Deployment pipeline complexity
- Auth middleware overhead

For a hackathon context, this is the optimal time-to-quality ratio.

### 2. Service Layer Abstraction
All external API calls go through `/services/*.js`. This means:
- Components never call APIs directly
- Easy to swap implementations
- Clean separation of concerns
- Testable in isolation

### 3. Centralized State (Context + useReducer)
Uses React's built-in primitives instead of Redux/Zustand. This:
- Avoids extra dependencies
- Follows predictable action/reducer pattern
- Is simpler to reason about for a bounded scope app

### 4. Graceful Degradation
Every service has fallback behavior:
- `weatherService.js` → returns mock weather if API key is absent
- `geminiService.js` → catches errors and throws clean messages
- `firestoreService.js` → non-blocking; app works if Firebase is unavailable

### 5. CSS Modules + Global Design Tokens
Component styles are scoped via CSS Modules, while shared design tokens (colors, spacing, radius) live in `index.css` as CSS custom properties. This prevents style conflicts while maintaining a consistent design system.

---

## AI Strategy: Intelligent Prompt Engineering

The entire "AI brain" is a single well-engineered prompt to Gemini 2.0 Flash. The prompt requests:

- Time-wise itinerary with vivid descriptions
- **Reason** for each recommendation (explainable AI)
- **Alternative** options for each activity
- Indoor/outdoor tagging for weather adaptability
- Crowd level estimates per venue
- Budget breakdown

This creates the perception of a complex AI system with a single API call.

### Replanning Prompt
A second, smaller prompt handles disruption replanning. It receives the current day's activities + the event type and returns updated activities with explicit reasoning for each change.

---

## Security Practices

- All API keys stored in `.env` (never committed)
- `.env` listed in `.gitignore`
- `.env.example` provided as a template
- Firebase config uses Vite's `import.meta.env` pattern
- No secrets hardcoded anywhere in source

---

## Deployment (Firebase Hosting)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select Hosting + Firestore)
firebase init

# Build
npm run build

# Deploy
firebase deploy
```

This deploys to Google Cloud infrastructure, satisfying GCP requirements natively.

---

## Scalability Narrative

While built for rapid hackathon delivery, the architecture scales naturally:

| Current | Future |
|---------|--------|
| Direct Gemini calls | Firebase Cloud Functions proxy |
| Anonymous sessions | Firebase Auth |
| Local component state | React Query for caching |
| Mock crowd data | Real-time Firestore + Cloud Functions |
| Single prompt | Multi-turn conversation history |

---

## Future Improvements

1. **Firebase Cloud Functions** — move Gemini calls server-side to protect API keys
2. **Google Routes API** — real travel time between venues
3. **Google Maps Embed** — visual map panel showing the route
4. **Shareable Trip Cards** — generate a visual "trip story" via Canvas API
5. **Offline Mode** — PWA with cached itineraries via service workers
6. **Trip DNA Sharing** — shareable URL that reconstructs a trip

---

*Built with Gemini AI · Firebase · Google Cloud · React · Vite · Framer Motion*
