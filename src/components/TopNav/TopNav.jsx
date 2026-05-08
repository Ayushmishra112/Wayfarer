import { Compass } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TopNav() {
  const handleNavClick = (e, feature) => {
    e.preventDefault();
    toast(`${feature} is coming soon!`);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-tertiary/80 backdrop-blur-xl border-b border-outline-variant/10 flex justify-between items-center px-margin py-sm" style={{ padding: '1rem max(5vw, 40px)', borderBottom: '1px solid rgba(196, 199, 199, 0.1)', background: 'rgba(251, 249, 244, 0.8)', backdropFilter: 'blur(24px)', zIndex: 50, position: 'fixed', width: '100%', top: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="font-display text-h3 tracking-tighter text-primary dark:text-surface-bright flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
        <Compass size={24} />
        <span>WAYFARER</span>
      </div>
      <div className="hidden md:flex items-center gap-8" style={{ display: 'flex', gap: '2rem' }}>
        <a onClick={(e) => handleNavClick(e, 'Discover')} style={{ color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }} href="#">Discover</a>
        <a onClick={(e) => handleNavClick(e, 'Itinerary')} style={{ color: 'var(--color-secondary)', borderBottom: '1px solid var(--color-secondary)', paddingBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }} href="#">Itinerary</a>
        <a onClick={(e) => handleNavClick(e, 'Journeys')} style={{ color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }} href="#">Journeys</a>
        <a onClick={(e) => handleNavClick(e, 'Concierge')} style={{ color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }} href="#">Concierge</a>
      </div>
      <div className="flex items-center gap-4" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button onClick={() => toast('Plan Trip functionality is active below!')} style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)', padding: '0.75rem 1.5rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Plan Trip</button>
      </div>
    </nav>
  );
}
