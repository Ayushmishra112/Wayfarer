// src/App.jsx
// Root application component — assembles the 3-panel layout

import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { TripProvider } from './store/tripStore';
import TripForm from './components/TripForm/TripForm';

const ItineraryPanel = React.lazy(() => import('./components/ItineraryPanel/ItineraryPanel'));
const LivePanel = React.lazy(() => import('./components/LivePanel/LivePanel'));

export default function App() {
  return (
    <TripProvider>
      <div className="app-layout">
        {/* Left Panel — Trip Preferences */}
        <TripForm />

        {/* Center Panel — Itinerary Timeline */}
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>}>
          <ItineraryPanel />
        </Suspense>

        {/* Right Panel — Live Context & Alerts */}
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>}>
          <LivePanel />
        </Suspense>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#1a1f35',
            color: 'rgba(255,255,255,0.87)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontSize: '0.85rem',
          },
        }}
      />
    </TripProvider>
  );
}
