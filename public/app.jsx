const { useState } = React;

const apps = [
  {
    name: 'Notes',
    href: '/notes',
    description: 'Create and manage your notes',
    icon: '\u{1F4DD}',
    gradient: 'linear-gradient(135deg, #43a047, #66bb6a)',
  },
  {
    name: 'Chat Room',
    href: '/chat',
    description: 'Chat with emoji support',
    icon: '\u{1F4AC}',
    gradient: 'linear-gradient(135deg, #1e88e5, #42a5f5)',
  },
  {
    name: 'Ashpazi',
    href: '/ashpazi',
    description: 'Persian recipes with photos & steps',
    icon: '\u{1F372}',
    gradient: 'linear-gradient(135deg, #ff5722, #ff9800)',
  },
  {
    name: 'Stocks',
    href: '/stocks',
    description: 'Top stocks with live charts',
    icon: '\u{1F4C8}',
    gradient: 'linear-gradient(135deg, #e91e63, #f06292)',
  },
  {
    name: 'Storybook',
    href: '/storybook',
    description: '100 Material UI-style components',
    icon: '\u{1F3A8}',
    gradient: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
  },
  {
    name: 'Project Ideas',
    href: '/projects',
    description: '100 React project ideas by difficulty',
    icon: '\u{1F4A1}',
    gradient: 'linear-gradient(135deg, #00bcd4, #4dd0e1)',
  },
  {
    name: 'Veggie Recipes',
    href: '/vegetarian-recipes',
    description: '100 high-protein vegetarian recipes',
    icon: '\u{1F966}',
    gradient: 'linear-gradient(135deg, #4caf50, #81c784)',
  },
  {
    name: 'API',
    href: '/api',
    description: 'JSON endpoint',
    icon: '\u{1F517}',
    gradient: 'linear-gradient(135deg, #ff9800, #ffb74d)',
  },
];

function AppCard({ app }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={app.href}
      style={{
        ...styles.card,
        transform: hovered ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? '0 12px 30px rgba(0,0,0,0.4)'
          : '0 4px 15px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...styles.cardIcon, background: app.gradient }}>{app.icon}</div>
      <div style={styles.cardName}>{app.name}</div>
      <div style={styles.cardDesc}>{app.description}</div>
    </a>
  );
}

function App() {
  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.avatarRing}>
          <div style={styles.avatar}>E</div>
        </div>
        <h1 style={styles.title}>Edris's Page</h1>
        <p style={styles.subtitle}>Welcome to my collection of mini apps</p>
        <div style={styles.divider} />
      </div>

      <div style={styles.grid}>
        {apps.map((app) => (
          <AppCard key={app.name} app={app} />
        ))}
      </div>

      <div style={styles.footer}>
        Built with React + Express
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '50px 20px 30px',
    color: '#fff',
  },
  hero: {
    textAlign: 'center',
    marginBottom: 50,
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4caf50, #2196f3, #e91e63)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    padding: 3,
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: '50%',
    background: '#24243e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    margin: 0,
    background: 'linear-gradient(90deg, #4caf50, #2196f3, #e91e63)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 8,
  },
  divider: {
    width: 60,
    height: 3,
    borderRadius: 2,
    background: 'linear-gradient(90deg, #4caf50, #2196f3)',
    margin: '20px auto 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20,
    maxWidth: 900,
    width: '100%',
  },
  card: {
    background: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: '30px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'block',
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    margin: '0 auto 14px',
  },
  cardName: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.4,
  },
  footer: {
    marginTop: 60,
    fontSize: 13,
    color: 'rgba(255,255,255,0.25)',
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
