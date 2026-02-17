const { useState, useEffect, useRef } = React;

const App = () => {
  const [time, setTime] = useState(new Date());
  const [is24h, setIs24h] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [timezone, setTimezone] = useState('local');
  const [pulseOpacity, setPulseOpacity] = useState(1);

  const timezones = [
    { label: 'Local', value: 'local', offset: null },
    { label: 'UTC', value: 'UTC', offset: 0 },
    { label: 'EST', value: 'EST', offset: -5 },
    { label: 'PST', value: 'PST', offset: -8 },
    { label: 'GMT', value: 'GMT', offset: 0 },
    { label: 'JST', value: 'JST', offset: 9 },
  ];

  const themes = {
    dark: { accent: '#667eea', glow: 'rgba(102, 126, 234, 0.4)', text: '#e0e0ff', secondHand: '#667eea', label: 'Dark' },
    neon: { accent: '#00ff88', glow: 'rgba(0, 255, 136, 0.4)', text: '#00ff88', secondHand: '#00ff88', label: 'Neon Green' },
    blue: { accent: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)', text: '#38bdf8', secondHand: '#38bdf8', label: 'Blue' },
    pink: { accent: '#f472b6', glow: 'rgba(244, 114, 182, 0.4)', text: '#f472b6', secondHand: '#f472b6', label: 'Pink' },
  };

  const currentTheme = themes[theme];

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPulseOpacity(0.5);
    const timeout = setTimeout(() => setPulseOpacity(1), 500);
    return () => clearTimeout(timeout);
  }, [time.getSeconds()]);

  const getAdjustedTime = () => {
    const tz = timezones.find(t => t.value === timezone);
    if (!tz || tz.offset === null) return time;
    const utc = time.getTime() + time.getTimezoneOffset() * 60000;
    return new Date(utc + tz.offset * 3600000);
  };

  const adjusted = getAdjustedTime();
  const hours = adjusted.getHours();
  const minutes = adjusted.getMinutes();
  const seconds = adjusted.getSeconds();

  const displayHours = is24h ? hours : (hours % 12 || 12);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const pad = (n) => String(n).padStart(2, '0');

  const dateStr = adjusted.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  const styles = {
    wrapper: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
      fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
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
      maxWidth: '650px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    title: {
      fontSize: '42px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, ' + currentTheme.accent + ' 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0 0 8px 0',
      transition: 'all 0.4s',
    },
    subtitle: {
      color: '#6b6b9e',
      fontSize: '16px',
      margin: 0,
    },
    clockArea: {
      display: 'flex',
      gap: '30px',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: '24px',
    },
    digitalCard: {
      background: 'rgba(255, 255, 255, 0.04)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '36px 44px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
    },
    digitalTime: {
      fontSize: '72px',
      fontWeight: '200',
      color: currentTheme.text,
      fontFamily: "'SF Mono', 'Fira Code', 'JetBrains Mono', monospace",
      letterSpacing: '4px',
      textShadow: '0 0 30px ' + currentTheme.glow,
      lineHeight: 1,
      marginBottom: '4px',
      transition: 'color 0.4s, text-shadow 0.4s',
    },
    secondsDisplay: {
      fontSize: '36px',
      fontWeight: '200',
      color: currentTheme.accent,
      opacity: pulseOpacity,
      transition: 'opacity 0.3s ease',
      fontFamily: "'SF Mono', 'Fira Code', monospace",
      display: 'inline-block',
      marginLeft: '4px',
    },
    ampmBadge: {
      display: 'inline-block',
      fontSize: '18px',
      fontWeight: '600',
      color: currentTheme.accent,
      background: 'rgba(255,255,255,0.06)',
      padding: '4px 12px',
      borderRadius: '8px',
      marginLeft: '12px',
      verticalAlign: 'super',
    },
    dateText: {
      fontSize: '16px',
      color: '#6b6b9e',
      marginTop: '12px',
    },
    analogCard: {
      background: 'rgba(255, 255, 255, 0.04)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    controlsRow: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: '16px',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.04)',
      backdropFilter: 'blur(20px)',
      borderRadius: '18px',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      padding: '20px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    },
    sectionTitle: {
      color: '#8b8bc4',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '12px',
      textAlign: 'center',
    },
    themeGrid: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    themeBtn: (key) => ({
      padding: '10px 18px',
      borderRadius: '12px',
      border: theme === key ? '1px solid ' + themes[key].accent : '1px solid rgba(255,255,255,0.08)',
      background: theme === key ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
      color: themes[key].accent,
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    toggleBtn: (active) => ({
      padding: '10px 20px',
      borderRadius: '12px',
      border: active ? '1px solid ' + currentTheme.accent : '1px solid rgba(255,255,255,0.08)',
      background: active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
      color: active ? currentTheme.accent : '#8b8bc4',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    tzGrid: {
      display: 'flex',
      gap: '6px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    tzBtn: (active) => ({
      padding: '8px 14px',
      borderRadius: '10px',
      border: active ? '1px solid ' + currentTheme.accent : '1px solid rgba(255,255,255,0.08)',
      background: active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
      color: active ? currentTheme.accent : '#6b6b9e',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    bottomRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '12px',
    },
  };

  const renderAnalogClock = () => {
    const size = 200;
    const center = size / 2;
    const r = 88;

    const hourMarkers = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const isMain = i % 3 === 0;
      const outerR = r - 2;
      const innerR = isMain ? r - 14 : r - 8;
      hourMarkers.push(
        React.createElement('line', {
          key: 'h' + i,
          x1: center + innerR * Math.cos(angle),
          y1: center + innerR * Math.sin(angle),
          x2: center + outerR * Math.cos(angle),
          y2: center + outerR * Math.sin(angle),
          stroke: isMain ? '#e0e0ff' : 'rgba(255,255,255,0.2)',
          strokeWidth: isMain ? 2.5 : 1,
          strokeLinecap: 'round',
        })
      );
    }

    const minuteMarkers = [];
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue;
      const angle = (i * 6 - 90) * (Math.PI / 180);
      const outerR = r - 2;
      const innerR = r - 5;
      minuteMarkers.push(
        React.createElement('line', {
          key: 'm' + i,
          x1: center + innerR * Math.cos(angle),
          y1: center + innerR * Math.sin(angle),
          x2: center + outerR * Math.cos(angle),
          y2: center + outerR * Math.sin(angle),
          stroke: 'rgba(255,255,255,0.1)',
          strokeWidth: 0.5,
          strokeLinecap: 'round',
        })
      );
    }

    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const numR = r - 24;
      numbers.push(
        React.createElement('text', {
          key: 'n' + i,
          x: center + numR * Math.cos(angle),
          y: center + numR * Math.sin(angle) + 5,
          textAnchor: 'middle',
          fill: '#8b8bc4',
          fontSize: '12',
          fontWeight: '500',
          fontFamily: 'Inter, sans-serif',
        }, i)
      );
    }

    return React.createElement('svg', {
      width: size,
      height: size,
      viewBox: '0 0 ' + size + ' ' + size,
    },
      React.createElement('circle', {
        cx: center, cy: center, r: r + 4,
        fill: 'none',
        stroke: 'rgba(255,255,255,0.06)',
        strokeWidth: 1,
      }),
      React.createElement('circle', {
        cx: center, cy: center, r: r,
        fill: 'rgba(0,0,0,0.3)',
        stroke: 'rgba(255,255,255,0.08)',
        strokeWidth: 1,
      }),
      ...minuteMarkers,
      ...hourMarkers,
      ...numbers,
      // Hour hand
      React.createElement('line', {
        x1: center,
        y1: center,
        x2: center + 45 * Math.cos((hourAngle - 90) * Math.PI / 180),
        y2: center + 45 * Math.sin((hourAngle - 90) * Math.PI / 180),
        stroke: '#e0e0ff',
        strokeWidth: 3.5,
        strokeLinecap: 'round',
      }),
      // Minute hand
      React.createElement('line', {
        x1: center,
        y1: center,
        x2: center + 62 * Math.cos((minuteAngle - 90) * Math.PI / 180),
        y2: center + 62 * Math.sin((minuteAngle - 90) * Math.PI / 180),
        stroke: '#b0b0e0',
        strokeWidth: 2.5,
        strokeLinecap: 'round',
      }),
      // Second hand
      React.createElement('line', {
        x1: center - 12 * Math.cos((secondAngle - 90) * Math.PI / 180),
        y1: center - 12 * Math.sin((secondAngle - 90) * Math.PI / 180),
        x2: center + 72 * Math.cos((secondAngle - 90) * Math.PI / 180),
        y2: center + 72 * Math.sin((secondAngle - 90) * Math.PI / 180),
        stroke: currentTheme.secondHand,
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        style: { filter: 'drop-shadow(0 0 4px ' + currentTheme.glow + ')' },
      }),
      // Center dot
      React.createElement('circle', {
        cx: center, cy: center, r: 4,
        fill: currentTheme.accent,
        style: { filter: 'drop-shadow(0 0 6px ' + currentTheme.glow + ')' },
      }),
      React.createElement('circle', {
        cx: center, cy: center, r: 2,
        fill: '#fff',
      })
    );
  };

  return React.createElement('div', { style: styles.wrapper },
    React.createElement('style', null, `
      .back-link:hover { color: #a5a5e0 !important; }
      button:hover { filter: brightness(1.15); }
    `),
    React.createElement('div', { style: styles.container },
      React.createElement('a', {
        href: '/projects',
        style: styles.backLink,
        className: 'back-link',
      }, '\u2190 Back to Projects'),
      React.createElement('div', { style: styles.header },
        React.createElement('h1', { style: styles.title }, 'Clock'),
        React.createElement('p', { style: styles.subtitle }, 'Time, beautifully displayed')
      ),
      React.createElement('div', { style: styles.clockArea },
        React.createElement('div', { style: styles.digitalCard },
          React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'center' } },
            React.createElement('span', { style: styles.digitalTime },
              pad(displayHours) + ':' + pad(minutes)
            ),
            React.createElement('span', { style: styles.secondsDisplay }, ':' + pad(seconds)),
            !is24h && React.createElement('span', { style: styles.ampmBadge }, ampm)
          ),
          React.createElement('div', { style: styles.dateText }, dateStr),
          timezone !== 'local' && React.createElement('div', {
            style: { fontSize: '13px', color: currentTheme.accent, marginTop: '8px', fontWeight: '500' },
          }, timezone + ' Time')
        ),
        React.createElement('div', { style: styles.analogCard },
          renderAnalogClock()
        )
      ),
      React.createElement('div', { style: styles.bottomRow },
        React.createElement('div', { style: styles.card },
          React.createElement('div', { style: styles.sectionTitle }, 'Format'),
          React.createElement('div', { style: { display: 'flex', gap: '6px', justifyContent: 'center' } },
            React.createElement('button', {
              style: styles.toggleBtn(!is24h),
              onClick: () => setIs24h(false),
            }, '12h'),
            React.createElement('button', {
              style: styles.toggleBtn(is24h),
              onClick: () => setIs24h(true),
            }, '24h')
          )
        ),
        React.createElement('div', { style: styles.card },
          React.createElement('div', { style: styles.sectionTitle }, 'Theme'),
          React.createElement('div', { style: styles.themeGrid },
            Object.keys(themes).map(key =>
              React.createElement('button', {
                key: key,
                style: {
                  ...styles.themeBtn(key),
                  padding: '8px 10px',
                  fontSize: '11px',
                },
                onClick: () => setTheme(key),
              }, themes[key].label)
            )
          )
        ),
        React.createElement('div', { style: styles.card },
          React.createElement('div', { style: styles.sectionTitle }, 'Timezone'),
          React.createElement('div', { style: { ...styles.tzGrid, flexDirection: 'column', alignItems: 'center' } },
            React.createElement('div', { style: { display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' } },
              timezones.map(tz =>
                React.createElement('button', {
                  key: tz.value,
                  style: { ...styles.tzBtn(timezone === tz.value), padding: '6px 10px', fontSize: '11px' },
                  onClick: () => setTimezone(tz.value),
                }, tz.label)
              )
            )
          )
        )
      )
    )
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
