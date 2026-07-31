import { useNavigate, useLocation } from 'react-router-dom';

const LINKS = [
  { label: 'Problem', path: '/problem' },
  { label: 'How it works', path: '/tech' },
];

export function Nav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-5"
      style={{ background: 'rgba(242,240,234,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E2DED3' }}>
      <button onClick={() => navigate('/')} className="flex items-center gap-2 shrink-0">
        <span className="w-7 h-7 rounded-md bg-ink text-background flex items-center justify-center font-wordmark text-sm">T</span>
        <span className="font-wordmark text-ink text-sm tracking-tight hidden sm:inline">TOJIBOX</span>
      </button>

      <div className="hidden md:flex items-center gap-8">
        {LINKS.map(({ label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="text-sm font-medium transition-colors"
            style={{ color: pathname === path ? '#111110' : '#6B6862' }}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate('/map')}
        className="px-4 py-2 rounded-lg text-sm font-semibold bg-ink text-background hover:opacity-85 transition-opacity"
      >
        Open Map
      </button>
    </nav>
  );
}
