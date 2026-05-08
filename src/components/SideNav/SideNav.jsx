import { Cloud, Sparkles, Sun, Users, TrendingUp, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SideNav() {
  const handleNavClick = (e, feature) => {
    e.preventDefault();
    toast(`${feature} module is coming soon!`);
  };

  return (
    <aside style={{ position: 'fixed', left: '1rem', top: '6rem', bottom: '2rem', width: '5rem', borderRadius: '9999px', background: 'rgba(245, 243, 238, 0.6)', backdropFilter: 'blur(40px)', border: '1px solid rgba(196, 199, 199, 0.2)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0', zIndex: 40 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', marginTop: '2rem', width: '100%' }}>
        <button onClick={(e) => handleNavClick(e, 'Weather')} title="Weather" style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '0.75rem', borderRadius: '50%' }}>
          <Cloud size={24} />
        </button>
        <button onClick={() => toast('You are currently on the AI Planner!')} title="AI Planner" style={{ background: 'var(--color-secondary)', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.75rem', borderRadius: '50%', transform: 'scale(0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={24} />
        </button>
        <button onClick={(e) => handleNavClick(e, 'Day Trips')} title="Day Trips" style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '0.75rem', borderRadius: '50%' }}>
          <Sun size={24} />
        </button>
        <button onClick={(e) => handleNavClick(e, 'Collaborators')} title="Collaborators" style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '0.75rem', borderRadius: '50%' }}>
          <Users size={24} />
        </button>
        <button onClick={(e) => handleNavClick(e, 'Trends')} title="Trends" style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '0.75rem', borderRadius: '50%' }}>
          <TrendingUp size={24} />
        </button>
      </div>
      <div style={{ marginBottom: '2rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <button onClick={(e) => handleNavClick(e, 'Settings')} title="Settings" style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '0.75rem', borderRadius: '50%' }}>
          <Settings size={24} />
        </button>
      </div>
    </aside>
  );
}
