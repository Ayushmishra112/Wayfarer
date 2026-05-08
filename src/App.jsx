import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { TripProvider, useTripStore } from './store/tripStore';
import { ACTIONS } from './store/tripActions';
import ErrorBoundary from './components/ErrorBoundary';
import TopNav from './components/TopNav/TopNav';
import VoiceAssistant from './components/VoiceAssistant/VoiceAssistant';
import IntelligenceShiftModal from './components/IntelligenceShiftModal/IntelligenceShiftModal';

const TripForm = lazy(() => import('./components/TripForm/TripForm'));
const ItineraryPanel = lazy(() => import('./components/ItineraryPanel/ItineraryPanel'));
const LivePanel = lazy(() => import('./components/LivePanel/LivePanel'));

// Styled fallback
const PanelSkeleton = () => (
  <div className="shimmer" style={{ 
    height: '100%', 
    width: '100%', 
    minHeight: '600px', 
    borderRadius: '24px',
    background: 'rgba(255,255,255,0.05)'
  }} />
);

// We need an inner component to access the trip store for the modal
function AppContent() {
  const { state, dispatch } = useTripStore();

  const handleAcceptReplan = () => {
    if (state.proposedReplan) {
      dispatch({ type: ACTIONS.APPLY_REPLAN, payload: state.proposedReplan });
    }
  };

  const handleDiscardReplan = () => {
    dispatch({ type: ACTIONS.DISCARD_REPLAN });
  };

  return (
    <>
      <a href="#main-content" className="sr-only skip-nav">Skip to main content</a>
      
      {/* Ambient Backgrounds */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', opacity: 0.4, backgroundImage: 'url("https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(251, 249, 244, 0.9), rgba(251, 249, 244, 0.7), var(--color-bg))' }}></div>

      <TopNav />
      <VoiceAssistant />
      
      <div style={{ display: 'flex' }}>
        
        <main id="main-content" style={{ flex: 1, paddingTop: '100px', width: '100%', maxWidth: '1800px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div className="app-layout" style={{ background: 'transparent' }}>
            <ErrorBoundary>
              <Suspense fallback={<PanelSkeleton />}>
                <TripForm />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<PanelSkeleton />}>
                <ItineraryPanel />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
              <Suspense fallback={<PanelSkeleton />}>
                <LivePanel />
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Intelligence Shift Modal */}
      <IntelligenceShiftModal 
        isOpen={!!state.proposedReplan}
        onClose={handleDiscardReplan}
        onAccept={handleAcceptReplan}
        event={state.proposedReplan?.event}
      />

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'var(--color-primary)',
            color: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.85rem',
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <TripProvider>
      <AppContent />
    </TripProvider>
  );
}
