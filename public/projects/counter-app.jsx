const { useState, useEffect, useRef } = React;

const App = () => {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCount = useRef(0);

  const applyChange = (amount) => {
    const label = (amount > 0 ? '+' : '') + amount;
    const newCount = count + amount;
    setHistory(prev => {
      const updated = [{ label, from: count, to: newCount, time: new Date().toLocaleTimeString() }, ...prev];
      return updated.slice(0, 10);
    });
    prevCount.current = count;
    setCount(newCount);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const reset = () => {
    if (count === 0) return;
    setHistory(prev => {
      const updated = [{ label: 'Reset', from: count, to: 0, time: new Date().toLocaleTimeString() }, ...prev];
      return updated.slice(0, 10);
    });
    prevCount.current = count;
    setCount(0);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getColor = () => {
    if (count > 0) return '#4ade80';
    if (count < 0) return '#f87171';
    return '#e0e0ff';
  };

  const getGlow = () => {
    if (count > 0) return '0 0 60px rgba(74, 222, 128, 0.3)';
    if (count < 0) return '0 0 60px rgba(248, 113, 113, 0.3)';
    return '0 0 60px rgba(224, 224, 255, 0.1)';
  };

  const styles = {
    wrapper: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      padding: '20px',
      boxSizing: 'border-box',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#8b8bc4',
      textDecoration: 'none',
      fontSize: '14px',
      marginBottom: '30px',
      transition: 'color 0.2s',
    },
    container: {
      maxWidth: '550px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    title: {
      fontSize: '42px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0 0 8px 0',
    },
    subtitle: {
      color: '#6b6b9e',
      fontSize: '16px',
      margin: 0,
    },
    card: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '40px 30px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
      marginBottom: '20px',
    },
    countDisplay: {
      fontSize: '96px',
      fontWeight: '800',
      color: getColor(),
      transition: 'color 0.3s ease',
      textShadow: getGlow(),
      margin: '10px 0 30px 0',
      lineHeight: 1,
      transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
      transitionProperty: 'transform, color',
      transitionDuration: '0.3s',
    },
    buttonRow: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      marginBottom: '14px',
      flexWrap: 'wrap',
    },
    button: (bg, hoverBg) => ({
      padding: '14px 22px',
      borderRadius: '14px',
      border: 'none',
      background: bg,
      color: '#fff',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      minWidth: '60px',
    }),
    smallButton: (bg) => ({
      padding: '10px 16px',
      borderRadius: '10px',
      border: 'none',
      background: bg,
      color: '#fff',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    }),
    resetButton: {
      padding: '12px 30px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#8b8bc4',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: '6px',
    },
    historyCard: {
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    },
    historyTitle: {
      color: '#8b8bc4',
      fontSize: '14px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '16px',
      textAlign: 'left',
    },
    historyItem: (idx) => ({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 14px',
      borderRadius: '10px',
      background: idx === 0 ? 'rgba(102, 126, 234, 0.08)' : 'transparent',
      marginBottom: '4px',
      opacity: 1 - idx * 0.07,
      transition: 'all 0.3s ease',
    }),
    historyLabel: (label) => ({
      fontSize: '14px',
      fontWeight: '600',
      color: label === 'Reset' ? '#fbbf24' : label.startsWith('+') ? '#4ade80' : '#f87171',
      minWidth: '60px',
      textAlign: 'left',
    }),
    historyValues: {
      fontSize: '13px',
      color: '#6b6b9e',
    },
    historyTime: {
      fontSize: '12px',
      color: '#4a4a7a',
    },
    emptyHistory: {
      color: '#4a4a7a',
      fontSize: '14px',
      textAlign: 'center',
      padding: '20px',
    },
  };

  return React.createElement('div', { style: styles.wrapper },
    React.createElement('style', null, `
      button:hover { filter: brightness(1.15); transform: scale(1.04); }
      button:active { transform: scale(0.97); }
      .back-link:hover { color: #a5a5e0 !important; }
    `),
    React.createElement('div', { style: styles.container },
      React.createElement('a', {
        href: '/projects',
        style: styles.backLink,
        className: 'back-link',
      }, '\u2190 Back to Projects'),
      React.createElement('div', { style: styles.header },
        React.createElement('h1', { style: styles.title }, 'Counter'),
        React.createElement('p', { style: styles.subtitle }, 'Track your numbers beautifully')
      ),
      React.createElement('div', { style: styles.card },
        React.createElement('div', { style: styles.countDisplay }, count),
        React.createElement('div', { style: styles.buttonRow },
          React.createElement('button', {
            style: styles.button('linear-gradient(135deg, #f87171, #dc2626)'),
            onClick: () => applyChange(-1),
          }, '\u2212 1'),
          React.createElement('button', {
            style: styles.button('linear-gradient(135deg, #4ade80, #16a34a)'),
            onClick: () => applyChange(1),
          }, '+ 1')
        ),
        React.createElement('div', { style: styles.buttonRow },
          React.createElement('button', {
            style: styles.smallButton('rgba(248, 113, 113, 0.2)'),
            onClick: () => applyChange(-10),
          }, '\u2212 10'),
          React.createElement('button', {
            style: styles.smallButton('rgba(248, 113, 113, 0.15)'),
            onClick: () => applyChange(-5),
          }, '\u2212 5'),
          React.createElement('button', {
            style: styles.smallButton('rgba(74, 222, 128, 0.15)'),
            onClick: () => applyChange(5),
          }, '+ 5'),
          React.createElement('button', {
            style: styles.smallButton('rgba(74, 222, 128, 0.2)'),
            onClick: () => applyChange(10),
          }, '+ 10')
        ),
        React.createElement('button', {
          style: styles.resetButton,
          onClick: reset,
        }, '\u21BA Reset to Zero')
      ),
      React.createElement('div', { style: styles.historyCard },
        React.createElement('div', { style: styles.historyTitle }, 'History (last 10)'),
        history.length === 0
          ? React.createElement('div', { style: styles.emptyHistory }, 'No operations yet. Start counting!')
          : history.map((item, idx) =>
              React.createElement('div', {
                key: idx,
                style: styles.historyItem(idx),
              },
                React.createElement('span', { style: styles.historyLabel(item.label) }, item.label),
                React.createElement('span', { style: styles.historyValues },
                  item.from + ' \u2192 ' + item.to
                ),
                React.createElement('span', { style: styles.historyTime }, item.time)
              )
            )
      )
    )
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
