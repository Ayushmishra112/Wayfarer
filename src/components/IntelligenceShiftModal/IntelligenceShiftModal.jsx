// src/components/IntelligenceShiftModal/IntelligenceShiftModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun, Users, ArrowRight, CheckCircle, ArrowLeftRight } from 'lucide-react';
import styles from './IntelligenceShiftModal.module.css';

export default function IntelligenceShiftModal({ isOpen, onClose, onAccept, event, originalDay: _originalDay, newDay: _newDay }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Background is handled globally or we can add ambient here, but overlay implies taking over */}
        <div className={styles.container}>
          {/* Intelligence Header */}
          <div className={styles.headerArea}>
            <div className={styles.intelBadge}>
              {/* <AutoAwesome size={16} /> */}
              <span className="font-label-caps">Adaptive Intel</span>
            </div>
            <h1 className={styles.title}>A Gentle Realignment</h1>
            <p className={styles.subtitle}>
              {event?.description || "We've noticed a shift in conditions. To ensure your visit remains serene and unhurried, we suggest adjusting your schedule."}
            </p>
          </div>

          {/* Shift Comparison Canvas */}
          <div className={styles.comparisonCanvas}>
            {/* Timeline Connecting Line */}
            <div className={styles.connectorLine}>
              <div className={styles.swapIcon}>
                <ArrowLeftRight size={16} />
              </div>
            </div>

            {/* Original Plan */}
            <div className={styles.originalPlan}>
              <div className={styles.originalBg}></div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardLabel}>Original Plan</span>
                  <span className={styles.cardTime}>Tomorrow, 2:00 PM</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.imagePlaceholder}>
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnPsADqEFrcgIz74GcEQ9ATxws1m4GETnodSIyC9-VEjxbrQ6J9jUnP4Yyg7fXytXYRc8n2I-8euZhst0SmxLe-MUBw8Br5end_6BnNfTf0szKCq2XQLai6FFOnanj4aqT2e19L9aOhO3DKTTyiOA7UdZl1ACwslWOqOIVQHghdp5O0DY7H4TFRtvaJVu5H0UwoHdxztIdLvekFxVQMaWCXul_44PGDXf6ruSViOFXsQcUPQAzSYeYmawGoO9yg0H8ICLGT5KbX98" 
                      alt="Silver Pavilion" 
                      className={styles.originalImg}
                    />
                  </div>
                  <div className={styles.activityInfo}>
                    <h3 className={styles.originalTitle}>Silver Pavilion Visit</h3>
                    <div className={styles.conditionRow}>
                      <Cloud size={18} />
                      <span>80% chance of heavy rain</span>
                    </div>
                  </div>
                </div>
                <p className={styles.reasoning}>
                  The incoming front would obscure the garden views and make the moss paths slippery.
                </p>
              </div>
            </div>

            {/* Suggested Plan */}
            <div className={styles.suggestedPlan}>
              <div className={styles.suggestedBg}></div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeaderActive}>
                  <span className={styles.cardLabelActive}>
                    <CheckCircle size={16} /> New Proposal
                  </span>
                  <span className={styles.cardTimeActive}>Today, 3:30 PM</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.imagePlaceholderActive}>
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB0qgMnS57k1tChhn3k66KugbvezGd6QJPl68OqcJsDW4p79TxxyFaaahFI2Lr-GdJJqezWDChaFFm8j4f54VqXJjgC5QtiqBTM4FEowm5TCX4I9pf5O_-AQ2lwZyGdj2uPgrOy-_is0Um_kBDSinCgMIsJ_f3a4OD73xSpe0hqHSWLEpz2oW6mRwng5UgRke5AVmy5CKKNfRNyEwwijomCtnbe8gJyX6Hg7T5GWkf9hv7BSokHYhZEFzhfvEJ5aR45LXcJFqDKLY" 
                      alt="Silver Pavilion Sun" 
                      className={styles.suggestedImg}
                    />
                  </div>
                  <div className={styles.activityInfo}>
                    <h3 className={styles.suggestedTitle}>Silver Pavilion Visit</h3>
                    <div className={styles.conditionRowActive}>
                      <Sun size={18} />
                      <span>Clear skies, golden hour</span>
                    </div>
                    <div className={styles.conditionRowNeutral}>
                      <Users size={18} />
                      <span>Lower crowd density expected</span>
                    </div>
                  </div>
                </div>
                <p className={styles.reasoningActive}>
                  Moving this forward allows you to experience the gardens in their best light, right before sunset.
                </p>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className={styles.actionArea}>
            <button onClick={onAccept} className={styles.acceptBtn}>
              Accept Adjustment <ArrowRight size={18} />
            </button>
            <button onClick={onClose} className={styles.keepBtn}>
              Keep Original Plan
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
