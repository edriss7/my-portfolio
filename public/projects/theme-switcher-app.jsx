const { useState } = React;

const themes = {
  dark: { name: 'Dark', bg: '#0a0a1a', bgSecondary: '#1a1a3e', text: '#e0e0ff', textSecondary: '#aaa', accent: '#8b5cf6', cardBg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.1)', buttonBg: '#6366f1', buttonText: '#fff', swatch: '#1a1a3e' },
  light: { name: 'Light', bg: '#f5f5f5', bgSecondary: '#ffffff', text: '#1a1a2e', textSecondary: '#666', accent: '#6366f1', cardBg: '#ffffff', border: '#e0e0e0', buttonBg: '#6366f1', buttonText: '#fff', swatch: '#f5f5f5' },
  ocean: { name: 'Ocean', bg: '#0a1628', bgSecondary: '#0d2137', text: '#c8e6ff', textSecondary: '#7eb8e0', accent: '#00bcd4', cardBg: 'rgba(0,188,212,0.08)', border: 'rgba(0,188,212,0.2)', buttonBg: '#0097a7', buttonText: '#fff', swatch: '#0d2137' },
  forest: { name: 'Forest', bg: '#0a1a0a', bgSecondary: '#1a2e1a', text: '#c8ffc8', textSecondary: '#7eb87e', accent: '#4caf50', cardBg: 'rgba(76,175,80,0.08)', border: 'rgba(76,175,80,0.2)', buttonBg: '#388e3c', buttonText: '#fff', swatch: '#1a2e1a' },
  sunset: { name: 'Sunset', bg: '#1a0a0a', bgSecondary: '#2e1a1a', text: '#ffe0c8', textSecondary: '#e0a07e', accent: '#ff7043', cardBg: 'rgba(255,112,67,0.08)', border: 'rgba(255,112,67,0.2)', buttonBg: '#e64a19', buttonText: '#fff', swatch: '#2e1a1a' }
};

function App() {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const t = themes[currentTheme];

  const styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, ' + t.bg + ' 0%, ' + t.bgSecondary + ' 100%)', color: t.text, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px', transition: 'all 0.5s ease' },
    backLink: { color: t.accent, textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px', transition: 'color 0.5s' },
    title: { textAlign: 'center', fontSize: '32px', marginBottom: '10px', color: t.text, transition: 'color 0.5s' },
    subtitle: { textAlign: 'center', fontSize: '16px', color: t.textSecondary, marginBottom: '30px', transition: 'color 0.5s' },
    swatchRow: { display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' },
    swatch: { width: '80px', height: '80px', borderRadius: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', fontSize: '11px', fontWeight: 'bold' },
    previewSection: { maxWidth: '800px', margin: '0 auto' },
    sectionTitle: { fontSize: '20px', marginBottom: '20px', color: t.textSecondary, transition: 'color 0.5s' },
    cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' },
    card: { background: t.cardBg, borderRadius: '12px', padding: '20px', border: '1px solid ' + t.border, transition: 'all 0.5s ease' },
    cardTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: t.text, transition: 'color 0.5s' },
    cardText: { fontSize: '14px', lineHeight: '1.6', color: t.textSecondary, marginBottom: '15px', transition: 'color 0.5s' },
    button: { padding: '8px 20px', background: t.buttonBg, color: t.buttonText, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: 'all 0.5s' },
    buttonOutline: { padding: '8px 20px', background: 'transparent', color: t.accent, border: '2px solid ' + t.accent, borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: 'all 0.5s' },
    textPreview: { background: t.cardBg, borderRadius: '12px', padding: '25px', border: '1px solid ' + t.border, marginBottom: '40px', transition: 'all 0.5s' },
    heading: { fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: t.text, transition: 'color 0.5s' },
    paragraph: { fontSize: '15px', lineHeight: '1.8', color: t.textSecondary, marginBottom: '15px', transition: 'color 0.5s' },
    accentText: { color: t.accent, fontWeight: 'bold', transition: 'color 0.5s' },
    buttonRow: { display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center' },
    colorBar: { height: '40px', borderRadius: '8px', display: 'flex', overflow: 'hidden', marginBottom: '40px' }
  };

  const sampleCards = [
    { title: 'Getting Started', text: 'Explore different themes to customize your experience.' },
    { title: 'Accessibility', text: 'Each theme is designed with proper contrast ratios.' },
    { title: 'Consistency', text: 'Colors transition smoothly between all themes.' }
  ];

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, 'Theme Switcher'),
    React.createElement('p', { style: styles.subtitle }, 'Select a theme to see live preview changes'),

    React.createElement('div', { style: styles.swatchRow },
      Object.entries(themes).map(function(entry) {
        var key = entry[0];
        var theme = entry[1];
        var isActive = currentTheme === key;
        return React.createElement('div', {
          key: key,
          onClick: function() { setCurrentTheme(key); },
          style: Object.assign({}, styles.swatch, {
            background: theme.swatch,
            border: isActive ? '3px solid ' + theme.accent : '3px solid transparent',
            color: theme.text,
            transform: isActive ? 'scale(1.1)' : 'scale(1)',
            boxShadow: isActive ? '0 4px 20px rgba(0,0,0,0.3)' : 'none'
          })
        },
          React.createElement('div', { style: { width: '24px', height: '24px', borderRadius: '50%', background: theme.accent, marginBottom: '6px' } }),
          theme.name
        );
      })
    ),

    React.createElement('div', { style: styles.previewSection },
      React.createElement('div', { style: { textAlign: 'center', marginBottom: '8px' } },
        React.createElement('span', { style: Object.assign({}, styles.accentText, { fontSize: '14px' }) }, 'Current theme: ' + t.name)
      ),

      React.createElement('div', { style: styles.colorBar },
        [t.bg, t.bgSecondary, t.accent, t.text, t.textSecondary].map(function(color, i) {
          return React.createElement('div', { key: i, style: { flex: 1, background: color, transition: 'background 0.5s' } });
        })
      ),

      React.createElement('h3', { style: styles.sectionTitle }, 'Cards'),
      React.createElement('div', { style: styles.cardGrid },
        sampleCards.map(function(card, i) {
          return React.createElement('div', { key: i, style: styles.card },
            React.createElement('div', { style: styles.cardTitle }, card.title),
            React.createElement('div', { style: styles.cardText }, card.text),
            React.createElement('button', { style: i % 2 === 0 ? styles.button : styles.buttonOutline }, 'Learn More')
          );
        })
      ),

      React.createElement('h3', { style: styles.sectionTitle }, 'Typography'),
      React.createElement('div', { style: styles.textPreview },
        React.createElement('h2', { style: styles.heading }, 'The Art of Theming'),
        React.createElement('p', { style: styles.paragraph }, 'Good themes provide a ',
          React.createElement('span', { style: styles.accentText }, 'consistent visual experience'),
          ' that is both aesthetically pleasing and functionally accessible. Each color in a theme palette serves a specific purpose.'
        ),
        React.createElement('p', { style: styles.paragraph }, 'From background tones to accent highlights, every shade should complement the others while maintaining ',
          React.createElement('span', { style: styles.accentText }, 'readability and contrast'),
          '.'
        )
      ),

      React.createElement('h3', { style: styles.sectionTitle }, 'Buttons'),
      React.createElement('div', { style: styles.buttonRow },
        React.createElement('button', { style: styles.button }, 'Primary Action'),
        React.createElement('button', { style: styles.buttonOutline }, 'Secondary Action'),
        React.createElement('button', { style: Object.assign({}, styles.button, { opacity: 0.5, cursor: 'not-allowed' }) }, 'Disabled'),
        React.createElement('button', { style: Object.assign({}, styles.button, { borderRadius: '50px', padding: '8px 30px' }) }, 'Rounded')
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
