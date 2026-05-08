// src/components/LivePanel/LivePanel.jsx
// Right panel — Live alerts, weather, crowd feed & AI insights
// This is the "dynamic intelligence" panel that makes the app feel alive

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud, Thermometer, Wind, Eye, AlertTriangle,
  CheckCircle, Info, XCircle, X, Wifi, BarChart3,
  Zap, Globe, TrendingUp, CloudRain, Users, Ban,
  Sun, CloudSun, CloudLightning, Snowflake, CloudFog
} from 'lucide-react';
import { useTripStore } from '../../store/tripStore';
import { ACTIONS } from '../../store/tripActions';
import { useItineraryGenerator } from '../../hooks/useItineraryGenerator';
import styles from './LivePanel.module.css';

const WeatherIconMap = {
  Clear: <Sun size={24} style={{ color: '#D98A44' }} />,
  Clouds: <CloudSun size={24} style={{ color: '#7E8D9C' }} />,
  Rain: <CloudRain size={24} style={{ color: '#7E8D9C' }} />,
  Drizzle: <CloudRain size={24} style={{ color: '#7E8D9C' }} />,
  Thunderstorm: <CloudLightning size={24} style={{ color: '#C87A65' }} />,
  Snow: <Snowflake size={24} style={{ color: '#7E8D9C' }} />,
  Mist: <CloudFog size={24} style={{ color: '#7E8D9C' }} />,
  Fog: <CloudFog size={24} style={{ color: '#7E8D9C' }} />,
  Haze: <CloudFog size={24} style={{ color: '#7E8D9C' }} />,
};

const ALERT_ICONS = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const ALERT_COLORS = {
  success: '#6B8E4E',
  warning: '#D98A44',
  error: '#C87A65',
  info: '#7E8D9C',
};

// Simulated live crowd data for the demo
const CROWD_SPOTS = [
  { name: 'Shibuya Crossing', level: 92, trend: 'up' },
  { name: 'TeamLab Borderless', level: 34, trend: 'down' },
  { name: 'Senso-ji Temple', level: 78, trend: 'stable' },
  { name: 'Harajuku Takeshita', level: 61, trend: 'up' },
];

export default function LivePanel() {
  const { state, dispatch } = useTripStore();
  const { replan } = useItineraryGenerator();
  const { weather, alerts, itinerary, replanHistory } = state;
  const [targetDay, setTargetDay] = useState(0);

  // M-1: Derive crowd spots from current itinerary or fallback
  const dynamicCrowdSpots = useMemo(() => {
    if (!itinerary || !itinerary.days || itinerary.days.length === 0) return CROWD_SPOTS;
    
    // Take up to 4 places from the first few days
    const places = itinerary.days.flatMap(d => d.activities).filter(a => a.place).map(a => a.place);
    if (places.length === 0) return CROWD_SPOTS;

    return places.slice(0, 4).map((place, i) => ({
      name: place.substring(0, 20) + (place.length > 20 ? '...' : ''),
      level: Math.floor(Math.random() * 60) + 20, // 20-80%
      trend: i % 2 === 0 ? 'up' : 'down'
    }));
  }, [itinerary]);

  const dismissAlert = (id) => {
    dispatch({ type: ACTIONS.DISMISS_ALERT, payload: id });
  };

  const handleReplan = () => {
    if (!itinerary) return;
    replan(
      {
        type: 'weather',
        description: 'Sudden rain — 82% precipitation probability',
        explanation: 'Outdoor venues swapped for covered alternatives',
      },
      targetDay
    );
  };

  return (
    <motion.aside
      className={styles.panel}
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Live Status Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Wifi size={14} style={{ color: '#10b981' }} />
          </motion.div>
          <span>Live Context</span>
        </div>
        <span className={styles.updateTime}>Updates every 30s</span>
      </div>

      <div className={styles.content}>
        {/* Weather Widget */}
        {weather && (
          <motion.div
            className={`glass-card ${styles.weatherCard}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className={styles.weatherHeader}>
              <div>
                <p className={styles.weatherCity}>{weather.city}</p>
                <div className={styles.weatherMain}>
                  <span className={styles.weatherEmoji}>
                    {WeatherIconMap[weather.condition] || <Thermometer size={24} />}
                  </span>
                  <span className={styles.weatherTemp}>{weather.temp}°C</span>
                </div>
                <p className={styles.weatherDesc}>{weather.description}</p>
              </div>
              <div className={styles.weatherBadge}>
                {weather.isRainy ? (
                  <span className="badge badge-warning">
                    <CloudRain size={10} style={{ marginRight: 4 }} /> Rain Alert
                  </span>
                ) : (
                  <span className="badge badge-success">
                    <CheckCircle size={10} style={{ marginRight: 4 }} /> All Clear
                  </span>
                )}
              </div>
            </div>
            <div className={styles.weatherStats}>
              <div className={styles.weatherStat}>
                <Thermometer size={12} />
                <span>Feels {weather.feelsLike}°C</span>
              </div>
              <div className={styles.weatherStat}>
                <Wind size={12} />
                <span>{weather.windSpeed} m/s</span>
              </div>
              <div className={styles.weatherStat}>
                <Eye size={12} />
                <span>{weather.visibility}km vis.</span>
              </div>
              <div className={styles.weatherStat}>
                <Cloud size={12} />
                <span>{weather.humidity}% humidity</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Replanning Trigger */}
        {itinerary && (
          <motion.div
            className={styles.replanWidget}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.replanHeader}>
              <Zap size={14} style={{ color: '#6366f1' }} />
              <span>AI Disruption Engine</span>
            </div>
            <p className={styles.replanDesc}>
              Simulate a real-world event and watch TripPulse replan your trip instantly.
            </p>
            <div style={{ marginBottom: '8px' }}>
              <select 
                value={targetDay} 
                onChange={e => setTargetDay(Number(e.target.value))}
                className="input-field"
                style={{ padding: '4px 8px', fontSize: '0.8rem', height: 'auto', background: 'var(--color-bg-tertiary)' }}
              >
                {itinerary.days?.map((d, i) => (
                  <option key={d.day} value={i}>Day {d.day}</option>
                ))}
              </select>
            </div>
            <div className={styles.replanButtons}>
              <button
                className={styles.replanBtn}
                onClick={handleReplan}
                disabled={state.isReplanning}
              >
                <CloudRain size={14} /> Trigger Rain Alert
              </button>
              <button
                className={styles.replanBtn}
                onClick={() => replan({
                  type: 'crowd',
                  description: 'Sudden crowd surge at major attractions — 3x normal levels',
                  explanation: 'Rerouted to hidden gems with 90% less traffic',
                }, targetDay)}
                disabled={state.isReplanning}
              >
                <Users size={14} /> Crowd Surge
              </button>
              <button
                className={styles.replanBtn}
                onClick={() => replan({
                  type: 'closure',
                  description: 'Top-rated venue closed unexpectedly today',
                  explanation: 'Replaced with equally rated nearby alternative',
                }, targetDay)}
                disabled={state.isReplanning}
              >
                <Ban size={14} /> Venue Closed
              </button>
            </div>
          </motion.div>
        )}

        {/* Live Alerts Feed */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <AlertTriangle size={13} />
            <span>Live Alerts</span>
            {alerts.length > 0 && (
              <span className={styles.alertCount}>{alerts.length}</span>
            )}
          </div>

          <div className={styles.alertsList}>
            <AnimatePresence mode="popLayout">
              {alerts.length === 0 ? (
                <div className={styles.emptyAlerts}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    style={{ marginBottom: 12, opacity: 0.3 }}
                  >
                    <Globe size={24} />
                  </motion.div>
                  <p>Scanning environment...</p>
                  <span>No disruptions detected. Systems nominal.</span>
                </div>
              ) : (
                alerts.map((alert) => {
                  const Icon = ALERT_ICONS[alert.type] || Info;
                  const color = ALERT_COLORS[alert.type] || '#06b6d4';
                  return (
                    <motion.div
                      key={alert.id}
                      className={styles.alertItem}
                      style={{ borderLeftColor: color }}
                      initial={{ opacity: 0, x: 20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      layout
                    >
                      <Icon size={13} style={{ color, flexShrink: 0, marginTop: 2 }} />
                      <div className={styles.alertContent}>
                        <p className={styles.alertTitle}>{alert.title}</p>
                        <p className={styles.alertMessage}>{alert.message}</p>
                        <span className={styles.alertTime}>
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <button
                        className={styles.dismissBtn}
                        onClick={() => dismissAlert(alert.id)}
                        aria-label="Dismiss alert"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Crowd Intelligence */}
        {itinerary && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <BarChart3 size={13} />
              <span>Crowd Intelligence</span>
              <span className={styles.livePill}>LIVE</span>
            </div>
            <div className={styles.crowdList}>
              {dynamicCrowdSpots.map((spot, i) => (
                <motion.div
                  key={spot.name}
                  className={styles.crowdItem}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <div className={styles.crowdItemLeft}>
                    <span className={styles.crowdName}>{spot.name}</span>
                    <div className={styles.crowdBar}>
                      <motion.div
                        className={styles.crowdFill}
                        style={{
                          background: spot.level > 75
                            ? '#C87A65'
                            : spot.level > 50
                            ? '#D98A44'
                            : '#6B8E4E',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${spot.level}%` }}
                        transition={{ delay: 0.4 + i * 0.05, duration: 0.6 }}
                      />
                    </div>
                  </div>
                  <div className={styles.crowdRight}>
                    <span
                      className={styles.crowdPct}
                      style={{ color: spot.level > 75 ? '#C87A65' : spot.level > 50 ? '#D98A44' : '#6B8E4E' }}
                    >
                      {spot.level}%
                    </span>
                    <TrendingUp
                      size={10}
                      style={{
                        color: spot.trend === 'up' ? '#C87A65' : spot.trend === 'down' ? '#6B8E4E' : '#D98A44',
                        transform: spot.trend === 'down' ? 'rotate(180deg)' : 'none',
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Replan History */}
        {replanHistory.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Globe size={13} />
              <span>Adaptation Log</span>
            </div>
            <div className={styles.historyList}>
              {replanHistory.map((event, i) => (
                <div key={i} className={styles.historyItem}>
                  <span className={styles.historyDot} />
                  <div>
                    <p className={styles.historyType}>{event.type?.toUpperCase()}</p>
                    <p className={styles.historyExplanation}>{event.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
