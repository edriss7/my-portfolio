const { useState, useEffect, useRef, useCallback } = React;

const allQuotes = [
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
  { text: 'Be the change that you wish to see in the world.', author: 'Mahatma Gandhi' },
  { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein' },
  { text: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
  { text: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle' },
  { text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
  { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
  { text: 'What you get by achieving your goals is not as important as what you become.', author: 'Zig Ziglar' },
  { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
  { text: 'Your time is limited, don\'t waste it living someone else\'s life.', author: 'Steve Jobs' },
  { text: 'If you want to lift yourself up, lift up someone else.', author: 'Booker T. Washington' },
  { text: 'Everything you\'ve ever wanted is on the other side of fear.', author: 'George Addair' },
  { text: 'Act as if what you do makes a difference. It does.', author: 'William James' },
  { text: 'The mind is everything. What you think you become.', author: 'Buddha' },
  { text: 'Strive not to be a success, but rather to be of value.', author: 'Albert Einstein' },
  { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
  { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
];

const gradientThemes = [
  { bg: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', accent: '#667eea' },
  { bg: 'linear-gradient(135deg, #0a0a1a 0%, #1a2a2a 100%)', accent: '#43e97b' },
  { bg: 'linear-gradient(135deg, #0a0a1a 0%, #2a1a2a 100%)', accent: '#e056fd' },
  { bg: 'linear-gradient(135deg, #0a0a1a 0%, #2a2a1a 100%)', accent: '#f9ca24' },
  { bg: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2a 100%)', accent: '#38f9d7' },
  { bg: 'linear-gradient(135deg, #0a0a1a 0%, #2a1a1a 100%)', accent: '#ff6b6b' },
  { bg: 'linear-gradient(135deg, #0a0a1a 0%, #1a2a3e 100%)', accent: '#74b9ff' },
  { bg: 'linear-gradient(135deg, #0a0a1a 0%, #2e1a3e 100%)', accent: '#d980fa' },
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [copied, setCopied] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  const quote = allQuotes[currentIndex];
  const theme = gradientThemes[themeIndex];
  const isFav = favorites.some(f => f.text === quote.text);

  // Quote of the day - deterministic based on date
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const qotdIndex = dayOfYear % allQuotes.length;
  const qotd = allQuotes[qotdIndex];

  const getNewQuote = () => {
    setFading(true);
    setTimeout(() => {
      let newIdx;
      do {
        newIdx = Math.floor(Math.random() * allQuotes.length);
      } while (newIdx === currentIndex);
      setCurrentIndex(newIdx);
      setThemeIndex((themeIndex + 1) % gradientThemes.length);
      setFading(false);
    }, 400);
  };

  const toggleFavorite = () => {
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 600);

    if (isFav) {
      setFavorites(favorites.filter(f => f.text !== quote.text));
    } else {
      setFavorites([...favorites, { text: quote.text, author: quote.author }]);
    }
  };

  const copyQuote = () => {
    navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: theme.bg,
      color: '#e0e0e0',
      fontFamily: "'Georgia', 'Times New Roman', serif",
      padding: '20px',
      transition: 'background 0.8s ease',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      color: '#8888ff',
      textDecoration: 'none',
      fontSize: '14px',
      marginBottom: '20px',
      gap: '6px',
      fontFamily: "'Segoe UI', sans-serif",
    },
    content: {
      maxWidth: '750px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    header: {
      textAlign: 'center',
      fontFamily: "'Segoe UI', sans-serif",
    },
    title: {
      fontSize: '2.2rem',
      fontWeight: '700',
      background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}88)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0 0 8px 0',
      transition: 'all 0.8s ease',
    },
    subtitle: {
      color: '#8888aa',
      fontSize: '1rem',
      margin: 0,
    },
    qotdCard: {
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '16px',
      padding: '20px 24px',
      border: '1px solid rgba(255,255,255,0.06)',
      position: 'relative',
    },
    qotdLabel: {
      fontSize: '0.7rem',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      color: theme.accent,
      marginBottom: '10px',
      fontFamily: "'Segoe UI', sans-serif",
      fontWeight: '600',
    },
    qotdText: {
      fontSize: '1rem',
      fontStyle: 'italic',
      lineHeight: 1.6,
      color: '#bbb',
    },
    qotdAuthor: {
      fontSize: '0.85rem',
      color: '#777',
      marginTop: '8px',
      fontFamily: "'Segoe UI', sans-serif",
    },
    quoteCard: {
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '20px',
      padding: '48px 40px',
      border: `1px solid ${theme.accent}22`,
      position: 'relative',
      textAlign: 'center',
      opacity: fading ? 0 : 1,
      transform: fading ? 'translateY(15px)' : 'translateY(0)',
      transition: 'all 0.4s ease',
    },
    openQuote: {
      fontSize: '5rem',
      color: theme.accent,
      opacity: 0.3,
      lineHeight: 0.5,
      marginBottom: '16px',
      fontFamily: 'Georgia, serif',
      transition: 'color 0.8s ease',
    },
    quoteText: {
      fontSize: '1.6rem',
      fontStyle: 'italic',
      lineHeight: 1.7,
      color: '#eee',
      marginBottom: '24px',
      fontWeight: '400',
    },
    authorLine: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    authorDash: {
      width: '30px',
      height: '2px',
      background: theme.accent,
      opacity: 0.5,
      transition: 'background 0.8s ease',
    },
    authorName: {
      fontSize: '1.1rem',
      color: theme.accent,
      fontFamily: "'Segoe UI', sans-serif",
      fontWeight: '600',
      transition: 'color 0.8s ease',
    },
    actions: {
      display: 'flex',
      justifyContent: 'center',
      gap: '14px',
      flexWrap: 'wrap',
    },
    actionBtn: (primary) => ({
      padding: primary ? '16px 36px' : '14px 24px',
      fontSize: primary ? '1.05rem' : '0.95rem',
      fontWeight: '600',
      background: primary ? `linear-gradient(135deg, ${theme.accent}, ${theme.accent}aa)` : 'rgba(255,255,255,0.06)',
      color: primary ? '#000' : '#ccc',
      border: primary ? 'none' : `1px solid rgba(255,255,255,0.1)`,
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: "'Segoe UI', sans-serif",
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }),
    heartBtn: {
      padding: '14px 20px',
      fontSize: '1.3rem',
      background: isFav ? 'rgba(255,107,107,0.15)' : 'rgba(255,255,255,0.06)',
      border: isFav ? '1px solid rgba(255,107,107,0.3)' : '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      transform: heartAnim ? 'scale(1.3)' : 'scale(1)',
    },
    favoritesToggle: {
      textAlign: 'center',
      fontFamily: "'Segoe UI', sans-serif",
    },
    favToggleBtn: {
      background: 'none',
      border: 'none',
      color: theme.accent,
      fontSize: '0.9rem',
      cursor: 'pointer',
      fontFamily: "'Segoe UI', sans-serif",
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
      transition: 'color 0.8s ease',
    },
    favoritesPanel: {
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(255,255,255,0.06)',
    },
    favSectionTitle: {
      fontSize: '0.8rem',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      color: '#ff6b6b',
      marginBottom: '14px',
      fontFamily: "'Segoe UI', sans-serif",
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    favItem: {
      padding: '14px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '10px',
      marginBottom: '10px',
      borderLeft: '3px solid rgba(255,107,107,0.4)',
    },
    favText: {
      fontSize: '0.95rem',
      fontStyle: 'italic',
      lineHeight: 1.5,
      color: '#ccc',
      marginBottom: '6px',
    },
    favAuthor: {
      fontSize: '0.8rem',
      color: '#888',
      fontFamily: "'Segoe UI', sans-serif",
    },
    emptyFav: {
      textAlign: 'center',
      color: '#666',
      padding: '20px',
      fontSize: '0.9rem',
      fontFamily: "'Segoe UI', sans-serif",
    },
    copiedBadge: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#43e97b',
      color: '#000',
      padding: '10px 20px',
      borderRadius: '10px',
      fontWeight: '600',
      fontSize: '0.9rem',
      fontFamily: "'Segoe UI', sans-serif",
      boxShadow: '0 4px 20px rgba(67,233,123,0.3)',
      zIndex: 1000,
      opacity: copied ? 1 : 0,
      transform: copied ? 'translateY(0)' : 'translateY(-10px)',
      transition: 'all 0.3s ease',
    },
  };

  return (
    React.createElement('div', { style: styles.container },

      // Copied notification
      React.createElement('div', { style: styles.copiedBadge }, '\u2705 Copied to clipboard!'),

      React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),

      React.createElement('div', { style: styles.header },
        React.createElement('h1', { style: styles.title }, '\u2728 Quote Generator'),
        React.createElement('p', { style: styles.subtitle }, 'Wisdom to inspire your day')
      ),

      React.createElement('div', { style: styles.content },

        // Quote of the Day
        React.createElement('div', { style: styles.qotdCard },
          React.createElement('div', { style: styles.qotdLabel }, '\u2B50 Quote of the Day'),
          React.createElement('div', { style: styles.qotdText }, `"${qotd.text}"`),
          React.createElement('div', { style: styles.qotdAuthor }, `\u2014 ${qotd.author}`)
        ),

        // Main Quote
        React.createElement('div', { style: styles.quoteCard },
          React.createElement('div', { style: styles.openQuote }, '\u201C'),
          React.createElement('div', { style: styles.quoteText }, quote.text),
          React.createElement('div', { style: styles.authorLine },
            React.createElement('div', { style: styles.authorDash }),
            React.createElement('div', { style: styles.authorName }, quote.author),
            React.createElement('div', { style: styles.authorDash })
          )
        ),

        // Action buttons
        React.createElement('div', { style: styles.actions },
          React.createElement('button', {
            style: styles.actionBtn(true),
            onClick: getNewQuote,
            onMouseEnter: (e) => e.target.style.transform = 'scale(1.05)',
            onMouseLeave: (e) => e.target.style.transform = 'scale(1)',
          }, '\uD83C\uDFB2', ' New Quote'),
          React.createElement('button', {
            style: styles.actionBtn(false),
            onClick: copyQuote,
            onMouseEnter: (e) => e.target.style.background = 'rgba(255,255,255,0.1)',
            onMouseLeave: (e) => e.target.style.background = 'rgba(255,255,255,0.06)',
          }, '\uD83D\uDCCB', ' Share'),
          React.createElement('button', {
            style: styles.heartBtn,
            onClick: toggleFavorite,
          }, isFav ? '\u2764\uFE0F' : '\uD83E\uDD0D')
        ),

        // Favorites toggle
        React.createElement('div', { style: styles.favoritesToggle },
          React.createElement('button', {
            style: styles.favToggleBtn,
            onClick: () => setShowFavorites(!showFavorites),
          }, showFavorites ? 'Hide Favorites' : `Show Favorites (${favorites.length})`)
        ),

        // Favorites panel
        showFavorites && React.createElement('div', { style: styles.favoritesPanel },
          React.createElement('div', { style: styles.favSectionTitle }, '\u2764\uFE0F', ` Favorite Quotes (${favorites.length})`),
          favorites.length === 0
            ? React.createElement('div', { style: styles.emptyFav }, 'No favorites yet. Click the heart to save quotes!')
            : favorites.map((fav, i) =>
              React.createElement('div', { key: i, style: styles.favItem },
                React.createElement('div', { style: styles.favText }, `"${fav.text}"`),
                React.createElement('div', { style: styles.favAuthor }, `\u2014 ${fav.author}`)
              )
            )
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
