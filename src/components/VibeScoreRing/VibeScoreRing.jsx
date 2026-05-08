// src/components/VibeScoreRing/VibeScoreRing.jsx
// Animated SVG ring showing the trip's vibe score (1-100)

import { motion } from 'framer-motion';
import styles from './VibeScoreRing.module.css';

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getScoreColor(score) {
  if (score >= 80) return '#6B8E4E'; // Moss green
  if (score >= 60) return '#7E8D9C'; // Rain blue-gray
  if (score >= 40) return '#D98A44'; // Dusk amber
  return '#C87A65'; // Soft terracotta
}

function getScoreLabel(score) {
  if (score >= 85) return 'Exceptional';
  if (score >= 70) return 'Excellent';
  if (score >= 55) return 'Good';
  return 'Fair';
}

export default function VibeScoreRing({ score = 75 }) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const offset = CIRCUMFERENCE - (clampedScore / 100) * CIRCUMFERENCE;
  const color = getScoreColor(clampedScore);
  const label = getScoreLabel(clampedScore);

  return (
    <div className={styles.container}>
      <svg width="90" height="90" viewBox="0 0 90 90" className={styles.svg}>
        {/* Background ring */}
        <circle
          cx="45"
          cy="45"
          r={RADIUS}
          fill="none"
          stroke="#E0D9CD" // Subtle warm border
          strokeWidth="4"
        />
        {/* Score ring */}
        <motion.circle
          cx="45"
          cy="45"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          transform="rotate(-90 45 45)"
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        />
        {/* Score text */}
        <text
          x="45"
          y="44"
          textAnchor="middle"
          fill="#1A1A1A" // Charcoal
          fontSize="18"
          fontWeight="500"
          fontFamily="'Playfair Display', serif"
        >
          {clampedScore}
        </text>
        <text
          x="45"
          y="58"
          textAnchor="middle"
          fill="#8A8A85" // Muted
          fontSize="8"
          fontFamily="'Inter', sans-serif"
          fontWeight="500"
          letterSpacing="1"
        >
          VIBE
        </text>
      </svg>
      <p className={styles.label} style={{ color }}>{label}</p>
    </div>
  );
}
