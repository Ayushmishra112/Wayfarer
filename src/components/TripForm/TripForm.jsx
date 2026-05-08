// src/components/TripForm/TripForm.jsx
// Left panel — User preference collection form
// Clean, beautiful input form with vibe selection

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Wallet, Sparkles, Heart, AlertCircle, Compass, Coffee, Gem, Zap, DollarSign, CreditCard } from 'lucide-react';
import { useTripStore } from '../../store/tripStore';
import { ACTIONS } from '../../store/tripActions';
import { useItineraryGenerator } from '../../hooks/useItineraryGenerator';
import styles from './TripForm.module.css';

const VIBES = [
  { id: 'explorer', label: 'Explorer', icon: Compass, desc: 'Hidden gems & local secrets' },
  { id: 'relaxed', label: 'Relaxed', icon: Coffee, desc: 'Slow travel, cafes & scenery' },
  { id: 'luxury', label: 'Luxury', icon: Gem, desc: 'Premium experiences only' },
  { id: 'chaos', label: 'Chaos Mode', icon: Zap, desc: 'Non-stop action & nightlife' },
];

const BUDGETS = [
  { id: 'low', label: 'Budget', icon: DollarSign, range: '<$50/day' },
  { id: 'medium', label: 'Mid-Range', icon: CreditCard, range: '$50-150/day' },
  { id: 'high', label: 'Luxury', icon: Gem, range: '$150+/day' },
];

export default function TripForm() {
  const { state, dispatch } = useTripStore();
  const { generate } = useItineraryGenerator();
  const [localPrefs, setLocalPrefs] = useState(state.preferences);

  const update = (key, value) => setLocalPrefs(p => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // E-1: Basic input sanitization (prevent prompt injection via max lengths & character stripping)
    const sanitizedPrefs = {
      ...localPrefs,
      destination: localPrefs.destination.substring(0, 100).replace(/[<>{}[\]\\]/g, ''),
      interests: localPrefs.interests.substring(0, 300).replace(/[<>{}[\]\\]/g, ''),
      constraints: localPrefs.constraints.substring(0, 300).replace(/[<>{}[\]\\]/g, ''),
    };

    dispatch({ type: ACTIONS.SET_PREFERENCES, payload: sanitizedPrefs });
    await generate(sanitizedPrefs);
  };

  const isLoading = state.isGenerating;

  return (
    <motion.aside
      className={styles.panel}
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className={styles.logoTitle}>Wayfarer<span className="glow-text"> AI</span></h1>
            <p className={styles.logoSub}>Adaptive Travel Engine</p>
          </div>
        </div>
        <div className={styles.liveDot}>
          <span className="pulse-dot" style={{ background: '#10b981' }} />
          <span>LIVE</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Destination */}
        <div className={styles.field}>
          <label htmlFor="destination">
            <MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />
            Destination
          </label>
          <input
            id="destination"
            className="input-field"
            type="text"
            placeholder="Tokyo, Paris, Bali..."
            value={localPrefs.destination}
            onChange={(e) => update('destination', e.target.value)}
            required
          />
        </div>

        {/* Duration */}
        <div className={styles.field}>
          <label htmlFor="duration">
            <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
            Duration: <span style={{ color: '#a5b4fc', textTransform: 'none' }}>{localPrefs.duration} days</span>
          </label>
          <input
            id="duration"
            className={styles.slider}
            type="range"
            min={1}
            max={7}
            value={localPrefs.duration}
            onChange={(e) => update('duration', Number(e.target.value))}
          />
          <div className={styles.sliderTicks}>
            {[1,2,3,4,5,6,7].map(n => (
              <span key={n} style={{ opacity: n === localPrefs.duration ? 1 : 0.3 }}>{n}</span>
            ))}
          </div>
        </div>

        {/* Budget */}
        <fieldset className={styles.field} style={{ border: 'none', padding: 0 }}>
          <legend style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            <Wallet size={11} style={{ display: 'inline', marginRight: 4 }} />
            Budget Level
          </legend>
          <div className={styles.budgetGrid}>
            {BUDGETS.map(b => (
              <button
                key={b.id}
                type="button"
                className={`${styles.budgetBtn} ${localPrefs.budget === b.id ? styles.budgetBtnActive : ''}`}
                onClick={() => update('budget', b.id)}
                aria-pressed={localPrefs.budget === b.id}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <b.icon size={13} />
                  <span>{b.label}</span>
                </div>
                <small>{b.range}</small>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Travel Vibe */}
        <fieldset className={styles.field} style={{ border: 'none', padding: 0 }}>
          <legend style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            <Heart size={11} style={{ display: 'inline', marginRight: 4 }} />
            Travel Vibe
          </legend>
          <div className={styles.vibeGrid}>
            {VIBES.map(v => (
              <button
                key={v.id}
                type="button"
                className={`${styles.vibeBtn} ${localPrefs.vibe === v.id ? styles.vibeBtnActive : ''}`}
                onClick={() => update('vibe', v.id)}
                aria-pressed={localPrefs.vibe === v.id}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <v.icon size={14} />
                  <span className={styles.vibeLabel}>{v.label}</span>
                </div>
                <span className={styles.vibeDesc}>{v.desc}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Interests */}
        <div className={styles.field}>
          <label htmlFor="interests">Interests & Preferences</label>
          <textarea
            id="interests"
            className={`input-field ${styles.textarea}`}
            placeholder="Anime cafes, street food, rooftop bars, historical sites..."
            value={localPrefs.interests}
            onChange={(e) => update('interests', e.target.value)}
            rows={3}
          />
        </div>

        {/* Constraints */}
        <div className={styles.field}>
          <label htmlFor="constraints">
            <AlertCircle size={11} style={{ display: 'inline', marginRight: 4 }} />
            Avoid / Constraints
          </label>
          <input
            id="constraints"
            className="input-field"
            type="text"
            placeholder="No crowds, avoid tourist traps, no spicy food..."
            value={localPrefs.constraints}
            onChange={(e) => update('constraints', e.target.value)}
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          className={`btn-primary ${styles.submitBtn}`}
          disabled={isLoading || !localPrefs.destination || !localPrefs.vibe}
          whileTap={{ scale: 0.97 }}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Trip
            </>
          )}
        </motion.button>

        {!localPrefs.vibe && localPrefs.destination && (
          <p className={styles.hint}>Select a travel vibe to continue</p>
        )}
      </form>

      {/* Footer */}
      <div className={styles.footer}>
        <p>Powered by Gemini AI · Google Cloud</p>
      </div>
    </motion.aside>
  );
}
