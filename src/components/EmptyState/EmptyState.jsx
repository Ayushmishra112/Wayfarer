// src/components/EmptyState/EmptyState.jsx
// Beautiful empty state shown before trip generation

import { motion } from 'framer-motion';
import { Sparkles, Zap, Globe, BrainCircuit, CloudRain, Users, Lightbulb, Compass } from 'lucide-react';
import styles from './EmptyState.module.css';

const FEATURES = [
  { icon: BrainCircuit, text: 'AI-powered personalization' },
  { icon: Zap, text: 'Real-time disruption replanning' },
  { icon: CloudRain, text: 'Live weather adaptation' },
  { icon: Users, text: 'Crowd intelligence routing' },
  { icon: Lightbulb, text: 'Explainable AI decisions' },
  { icon: Compass, text: 'Hidden gems discovery' },
];

export default function EmptyState() {
  return (
    <div className={styles.container}>
      {/* Animated background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Logo Icon */}
        <motion.div
          className={styles.icon}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <Globe size={40} />
        </motion.div>

        <h2 className={styles.title}>
          Your AI Travel OS<br />
          <span className="glow-text">Awaits</span>
        </h2>

        <p className={styles.subtitle}>
          Enter your destination and preferences on the left.
          TripPulse AI will generate a hyper-personalized itinerary
          that adapts in real time to weather, crowds, and live events.
        </p>

        {/* Feature Pills */}
        <div className={styles.features}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.text}
              className={styles.featurePill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.07 }}
            >
              <f.icon size={14} style={{ color: 'var(--color-text-secondary)' }} />
              <span>{f.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Demo hint */}
        <motion.p
          className={styles.hint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
          Try: <em>"Tokyo, 3 days, Explorer vibe, anime cafes &amp; nightlife"</em>
        </motion.p>
      </motion.div>
    </div>
  );
}
