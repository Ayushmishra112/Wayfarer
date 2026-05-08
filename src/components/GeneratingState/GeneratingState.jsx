// src/components/GeneratingState/GeneratingState.jsx
// Beautiful loading state shown during AI generation

import { motion } from 'framer-motion';
import { Thermometer, Users, BrainCircuit, Sparkles, Map, RefreshCw, Globe, Check } from 'lucide-react';
import { useTripStore } from '../../store/tripStore';
import styles from './GeneratingState.module.css';

const STEPS = [
  { id: 1, label: 'Fetching live weather data', icon: Thermometer, delay: 0 },
  { id: 2, label: 'Analyzing crowd patterns', icon: Users, delay: 0.8 },
  { id: 3, label: 'Consulting Gemini AI', icon: BrainCircuit, delay: 1.6 },
  { id: 4, label: 'Personalizing to your vibe', icon: Sparkles, delay: 2.4 },
  { id: 5, label: 'Building dynamic itinerary', icon: Map, delay: 3.2 },
  { id: 6, label: 'Calibrating alternatives', icon: RefreshCw, delay: 4.0 },
];

export default function GeneratingState() {
  const { state } = useTripStore();

  return (
    <div className={styles.container}>
      {/* Animated background */}
      <div className={styles.bgPulse} />

      <div className={styles.content}>
        {/* Orbital loader */}
        <div className={styles.orbitContainer}>
          <div className={styles.orbitRing1} />
          <div className={styles.orbitRing2} />
          <div className={styles.orbitCenter}>
            <Globe size={20} strokeWidth={1.5} />
          </div>
        </div>

        <motion.h2
          className={styles.title}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Wayfarer is thinking...
        </motion.h2>
        <p className={styles.subtitle}>
          Generating your perfect {state.preferences.duration}-day{' '}
          <strong style={{ color: '#a5b4fc' }}>{state.preferences.destination}</strong> experience
        </p>

        {/* Progress Steps */}
        <div className={styles.steps}>
          {STEPS.map((step) => (
            <motion.div
              key={step.id}
              className={styles.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: step.delay, duration: 0.4 }}
            >
              <motion.div
                className={styles.stepIcon}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ delay: step.delay, duration: 0.5 }}
              >
                <step.icon size={16} />
              </motion.div>
              <span className={styles.stepLabel}>{step.label}</span>
              <motion.div
                className={styles.stepCheck}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: step.delay + 0.5, type: 'spring' }}
              >
                <Check size={12} strokeWidth={3} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
