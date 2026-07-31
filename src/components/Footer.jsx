import { useNavigate } from 'react-router-dom';

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'Map', path: '/map' },
      { label: 'The Problem', path: '/problem' },
      { label: 'How it works', path: '/tech' },
    ],
  },
  {
    heading: 'Repos',
    links: [
      { label: 'tojibox-app', href: 'https://github.com/tojibox/tojibox-app' },
      { label: 'tojibox-api', href: 'https://github.com/tojibox/tojibox-api' },
      { label: 'tojibox-scraper', href: 'https://github.com/tojibox/tojibox-scraper' },
    ],
  },
  {
    heading: 'Socials',
    links: [
      { label: 'GitHub', href: 'https://github.com/tojibox' },
    ],
  },
];

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-surface-alt">
      <div className="h-1.5 w-full bg-tojibox-gradient" />
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="font-wordmark text-2xl text-ink tracking-tight">TOJIBOX</div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <div className="text-xs font-medium text-muted uppercase tracking-wide mb-3">{col.heading}</div>
            <div className="flex flex-col gap-2.5">
              {col.links.map((link) =>
                link.path ? (
                  <button
                    key={link.label}
                    onClick={() => navigate(link.path)}
                    className="text-sm text-ink text-left hover:text-muted transition-colors"
                  >
                    {link.label}
                  </button>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink hover:text-muted transition-colors"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-10">
        <p className="text-xs text-muted">© 2026 Tojibox. Built on GIWA.</p>
      </div>
    </footer>
  );
}
