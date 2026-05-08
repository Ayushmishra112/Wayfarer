import { useState, useEffect, useRef } from 'react';
import { Mic, Loader } from 'lucide-react';
import { useTripStore } from '../../store/tripStore';
import { ACTIONS } from '../../store/tripActions';
import { parseVoiceToPreferences } from '../../services/geminiService';
import toast from 'react-hot-toast';

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [volume, setVolume] = useState(0); // 0 to 1
  const { state, dispatch } = useTripStore();
  
  // Use a ref for preferences to avoid useEffect re-runs on every keystroke (A-V3)
  const prefsRef = useRef(state.preferences);
  useEffect(() => {
    prefsRef.current = state.preferences;
  }, [state.preferences]);

  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Moved outside useEffect to fix TDZ violation (A-V1)
  const stopAudioMonitoring = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
    }
    setVolume(0);
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    // Feature detection guard (M-V2)
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = 'en-US';

    recog.onresult = async (event) => {
      stopAudioMonitoring();
      setIsListening(false);
      
      const transcript = event.results[0][0].transcript;
      if (!transcript.trim()) return;
      
      // S-V1: Sanitize transcript (limit length and remove potential injection symbols)
      const sanitizedTranscript = transcript.substring(0, 500).replace(/[<>{}[\]\\]/g, '');
      
      toast(`Heard: "${sanitizedTranscript}"`);
      setIsProcessing(true);
      try {
        const parsedPrefs = await parseVoiceToPreferences(sanitizedTranscript);
        
        const newPrefs = {
          ...prefsRef.current,
          destination: parsedPrefs.destination || prefsRef.current.destination || '',
          duration: parsedPrefs.duration || 3,
          budget: parsedPrefs.budget || '',
          vibe: parsedPrefs.vibe || '',
          interests: parsedPrefs.interests || '',
          constraints: parsedPrefs.constraints || ''
        };

        dispatch({ type: ACTIONS.SET_PREFERENCES, payload: newPrefs });
        toast.success('Form auto-populated!');
      } catch (error) {
        console.error('Voice parsing error:', error);
        toast.error('Failed to interpret voice command');
      } finally {
        setIsProcessing(false);
      }
    };

    recog.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        toast('Listening timed out (no speech detected)');
      } else if (event.error === 'aborted') {
        // User manually stopped it
      } else {
        toast.error('Voice recognition failed: ' + event.error);
      }
      stopAudioMonitoring();
      setIsListening(false);
      setIsProcessing(false);
    };

    recog.onend = () => {
      stopAudioMonitoring();
      setIsListening(false);
    };

    recognitionRef.current = recog;

    return () => {
      stopAudioMonitoring();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, [dispatch]); // Removed state.preferences to avoid re-runs (A-V3)

  const startAudioMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;
      
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setVolume(Math.min(avg / 100, 1));
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      
      updateVolume();
    } catch (err) {
      console.error('Microphone access denied:', err);
      toast.error('Microphone access required for voice input.');
      throw err;
    }
  };

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition is not supported in your browser (use Chrome/Edge)');
      return;
    }

    if (isListening) {
      recognitionRef.current.abort();
      stopAudioMonitoring();
      setIsListening(false);
      toast('Voice input cancelled');
    } else {
      try {
        await startAudioMonitoring();
        recognitionRef.current.start();
        setIsListening(true);
        toast('Listening... Speak now!');
      } catch (_e) {
        // Error already toasted in startAudioMonitoring
        setIsListening(false);
      }
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '2rem', 
      left: '2rem', 
      zIndex: 1000, 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem' 
    }}>
      <button
        onClick={toggleListening}
        disabled={isProcessing}
        aria-label={isListening ? "Stop listening" : "Start voice assistant"}
        aria-pressed={isListening}
        style={{
          width: '4rem',
          height: '4rem',
          borderRadius: 'var(--radius-full)',
          background: isListening ? 'var(--color-danger)' : 'var(--color-primary)',
          color: 'var(--color-primary-text)',
          border: 'none',
          boxShadow: isListening 
            ? `0 0 0 ${10 + volume * 20}px rgba(239, 68, 68, ${0.2 + volume * 0.2})` 
            : 'var(--shadow-lg)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          transition: 'all var(--transition-fast)',
          transform: isListening ? `scale(${1 + volume * 0.1})` : 'scale(1)'
        }}
      >
        {isProcessing ? (
          <Loader 
            size={24} 
            style={{ animation: 'spin 1s linear infinite' }} 
            aria-label="Processing voice..." 
          />
        ) : (
          <Mic size={24} />
        )}
      </button>

      {/* Audio Wave Visualizer (AC-V2: aria-hidden) */}
      {isListening && (
        <div 
          aria-hidden="true" 
          style={{ display: 'flex', gap: '4px', height: '2rem', alignItems: 'center' }}
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="voice-visualizer-bar"
              style={{
                // Date.now() removed from render (Q-V1)
                // Animating via CSS class with staggered delays
                animationDelay: `${i * 0.1}s`,
                // Scale base height with actual volume
                transform: `scaleY(${0.5 + volume * 1.5})`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
