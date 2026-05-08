// src/components/ItineraryPanel/ItineraryPanel.jsx
// Center panel — Main itinerary timeline display
// Shows the generated trip with animated activity cards

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, DollarSign, Users, Home, ArrowRight,
  Lightbulb, Star, ChevronDown, ChevronUp, Zap, RefreshCw,
  Utensils, Landmark, Compass, Martini, Coffee, ShoppingBag, Dna
} from 'lucide-react';
import { useTripStore } from '../../store/tripStore';
import { useItineraryGenerator } from '../../hooks/useItineraryGenerator';
import EmptyState from '../EmptyState/EmptyState';
import GeneratingState from '../GeneratingState/GeneratingState';
import VibeScoreRing from '../VibeScoreRing/VibeScoreRing';
import styles from './ItineraryPanel.module.css';

const CATEGORY_CONFIG = {
  food: { color: '#D98A44', icon: Utensils, label: 'Food' },
  culture: { color: '#7E8D9C', icon: Landmark, label: 'Culture' },
  adventure: { color: '#C87A65', icon: Compass, label: 'Adventure' },
  nightlife: { color: '#2C2C2A', icon: Martini, label: 'Nightlife' },
  relaxation: { color: '#6B8E4E', icon: Coffee, label: 'Relax' },
  shopping: { color: '#A98C6D', icon: ShoppingBag, label: 'Shopping' },
};

const CROWD_CONFIG = {
  low: { color: '#6B8E4E', label: 'Low Crowd' },
  medium: { color: '#D98A44', label: 'Moderate' },
  high: { color: '#C87A65', label: 'Busy' },
};

export default function ItineraryPanel() {
  const { state } = useTripStore();
  const [activeDay, setActiveDay] = useState(0);
  const [expandedCards, setExpandedCards] = useState(new Set());

  const { itinerary, isGenerating, isReplanning, phase } = state;

  const toggleCard = (id) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDayChange = (i) => {
    setActiveDay(i);
    setExpandedCards(new Set());
  };

  if (phase === 'input') return <EmptyState />;
  if (isGenerating) return <GeneratingState />;
  if (!itinerary) return <EmptyState />;

  const currentDay = itinerary.days?.[activeDay];

  return (
    <main className={styles.panel}>
      {/* Trip Header */}
      <motion.div
        className={styles.tripHeader}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.tripInfo}>
          <div className={styles.tripMeta}>
            <span className="badge badge-primary">
              <MapPin size={10} />
              {state.preferences.destination}
            </span>
            <span className="badge badge-info">
              <Clock size={10} />
              {state.preferences.duration} days
            </span>
            <span className="badge badge-success">
              <Dna size={10} style={{ marginRight: 2 }} /> Trip DNA
            </span>
          </div>
          <h2 className={styles.tripTitle}>{itinerary.tripTitle}</h2>
          <p className={styles.tripDNA}>{itinerary.tripDNA}</p>
        </div>

        <div className={styles.tripStats}>
          <VibeScoreRing score={itinerary.vibeScore} />
          {itinerary.insiderTip && (
            <div className={styles.insiderTip}>
              <Lightbulb size={13} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <span>{itinerary.insiderTip}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Day Tabs */}
      <div className={styles.dayTabs}>
        {itinerary.days?.map((day, i) => (
          <button
            key={day.day}
            className={`${styles.dayTab} ${activeDay === i ? styles.dayTabActive : ''}`}
            onClick={() => handleDayChange(i)}
          >
            <span>Day {day.day}</span>
            <small>{day.theme}</small>
          </button>
        ))}

        {isReplanning && (
          <div className={styles.replanBadge}>
            <RefreshCw size={12} className={styles.spinning} />
            Replanning...
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className={styles.timeline}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Day Theme Banner */}
            <div className={styles.dayTheme}>
              <Zap size={14} style={{ color: '#6366f1' }} />
              <span>{currentDay?.theme}</span>
            </div>

            {/* Activity Cards */}
            {currentDay?.activities?.map((activity, idx) => {
              const catConfig = CATEGORY_CONFIG[activity.category] || CATEGORY_CONFIG.culture;
              const crowdConfig = CROWD_CONFIG[activity.crowdLevel] || CROWD_CONFIG.medium;
              const isExpanded = expandedCards.has(activity.id || idx);

              return (
                <motion.div
                  key={activity.id || idx}
                  className={styles.timelineItem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.35 }}
                >
                  {/* Time Connector */}
                  <div className={styles.connector}>
                    <div className={styles.timeBubble} style={{ background: catConfig.color }}>
                      <catConfig.icon size={16} color="#fff" />
                    </div>
                    {idx < (currentDay.activities.length - 1) && (
                      <div className={styles.connectorLine} />
                    )}
                  </div>

                  {/* Card */}
                  <div className={`glass-card ${styles.activityCard}`}>
                    {/* Card Header */}
                    <div
                      className={styles.cardHeader}
                      onClick={() => toggleCard(activity.id || idx)}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      aria-label={`Toggle details for ${activity.place}`}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleCard(activity.id || idx)}
                    >
                      <div className={styles.cardHeaderLeft}>
                        <span className={styles.activityTime}>{activity.time}</span>
                        <div>
                          <h3 className={styles.activityName}>{activity.place}</h3>
                          <p className={styles.activityDesc}>{activity.description}</p>
                        </div>
                      </div>
                      <div className={styles.cardHeaderRight}>
                        <div className={styles.cardBadges}>
                          <span
                            className="badge"
                            style={{
                              background: `${catConfig.color}18`,
                              color: catConfig.color,
                              border: `1px solid ${catConfig.color}30`,
                            }}
                          >
                            {catConfig.label}
                          </span>
                          <span
                            className="badge"
                            style={{
                              background: `${crowdConfig.color}18`,
                              color: crowdConfig.color,
                              border: `1px solid ${crowdConfig.color}30`,
                            }}
                          >
                            <Users size={10} style={{ marginRight: 2 }} /> {crowdConfig.label}
                          </span>
                        </div>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          className={styles.cardDetails}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className={styles.detailRow}>
                            <span className={styles.detailItem}>
                              <Clock size={12} />
                              {activity.duration}
                            </span>
                            <span className={styles.detailItem}>
                              <DollarSign size={12} />
                              {activity.cost}
                            </span>
                            <span className={styles.detailItem}>
                              {activity.indoorOutdoor === 'indoor' ? <Home size={12} /> : <MapPin size={12} />}
                              {activity.indoorOutdoor}
                            </span>
                            {activity.rating && (
                              <span className={styles.detailItem}>
                                <Star size={12} style={{ color: '#f59e0b' }} />
                                {activity.rating}
                              </span>
                            )}
                          </div>

                          {/* AI Reason */}
                          <div className={styles.aiReason}>
                            <div className={styles.aiReasonHeader}>
                              <Lightbulb size={13} style={{ color: '#6366f1' }} />
                              <span>Why TripPulse picked this</span>
                            </div>
                            <p>{activity.reason}</p>
                          </div>

                          {/* Tags */}
                          {activity.tags?.length > 0 && (
                            <div className={styles.tagRow}>
                              {activity.tags.map(tag => (
                                <span key={tag} className={`badge badge-primary`}>#{tag}</span>
                              ))}
                            </div>
                          )}

                          {/* Alternative */}
                          {activity.alternative && (
                            <div className={styles.alternative}>
                              <ArrowRight size={12} style={{ color: '#06b6d4', flexShrink: 0 }} />
                              <div>
                                <span className={styles.altLabel}>Alternative: </span>
                                <span className={styles.altName}>{activity.alternative.place}</span>
                                <span className={styles.altReason}> — {activity.alternative.reason}</span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Budget Breakdown */}
        {itinerary.budgetBreakdown && (
          <motion.div
            className={`glass-card ${styles.budgetCard}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h4 className={styles.budgetTitle}>
              <DollarSign size={14} /> Budget Breakdown
            </h4>
            <div className={styles.budgetGrid}>
              {Object.entries(itinerary.budgetBreakdown).map(([key, val]) => (
                <div key={key} className={styles.budgetItem}>
                  <span className={styles.budgetKey}>{key}</span>
                  <span className={styles.budgetVal}>{val}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
