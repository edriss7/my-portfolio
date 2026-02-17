const { useState, useEffect, useRef, useCallback } = React;

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function getComplementary(r, g, b) {
  return { r: 255 - r, g: 255 - g, b: 255 - b };
}

const presetColors = [
  '#FF6B6B', '#EE5A24', '#F9CA24', '#6AB04C', '#22A6B3',
  '#4834D4', '#BE2EDD', '#ED4C67', '#FDA7DF', '#D980FA',
  '#7ED6DF', '#E056FD', '#686DE0', '#30336B', '#130F40',
  '#FF4757', '#2ED573', '#1E90FF', '#FFA502', '#747D8C'
];

function App() {
  const [r, setR] = useState(88);
  const [g, setG] = useState(101);
  const [b, setB] = useState(242);
  const [recentColors, setRecentColors] = useState([]);
  const [copied, setCopied] = useState('');

  const hex = rgbToHex(r, g, b);
  const hsl = rgbToHsl(r, g, b);
  const comp = getComplementary(r, g, b);
  const compHex = rgbToHex(comp.r, comp.g, comp.b);

  const addToRecent = useCallback((hexVal) => {
    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== hexVal);
      return [hexVal, ...filtered].slice(0, 5);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => addToRecent(hex), 500);
    return () => clearTimeout(timer);
  }, [hex, addToRecent]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(''), 1500);
    });
  };

  const applyPreset = (hexColor) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    if (result) {
      setR(parseInt(result[1], 16));
      setG(parseInt(result[2], 16));
      setB(parseInt(result[3], 16));
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
      color: '#e0e0e0',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      color: '#8888ff',
      textDecoration: 'none',
      fontSize: '14px',
      marginBottom: '20px',
      gap: '6px',
      transition: 'color 0.2s',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    title: {
      fontSize: '2.2rem',
      fontWeight: '700',
      background: 'linear-gradient(90deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0 0 8px 0',
    },
    subtitle: {
      color: '#8888aa',
      fontSize: '1rem',
      margin: 0,
    },
    content: {
      maxWidth: '800px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    card: {
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(10px)',
    },
    previewRow: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    colorPreview: {
      width: '200px',
      height: '200px',
      borderRadius: '16px',
      backgroundColor: `rgb(${r},${g},${b})`,
      border: '3px solid rgba(255,255,255,0.15)',
      boxShadow: `0 8px 32px rgba(${r},${g},${b},0.4)`,
      transition: 'all 0.3s ease',
    },
    compPreview: {
      width: '100px',
      height: '100px',
      borderRadius: '12px',
      backgroundColor: `rgb(${comp.r},${comp.g},${comp.b})`,
      border: '2px solid rgba(255,255,255,0.1)',
      boxShadow: `0 4px 16px rgba(${comp.r},${comp.g},${comp.b},0.3)`,
      transition: 'all 0.3s ease',
    },
    sliderGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    sliderRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    sliderLabel: {
      width: '30px',
      fontWeight: '700',
      fontSize: '1.1rem',
    },
    slider: {
      flex: 1,
      height: '8px',
      borderRadius: '4px',
      appearance: 'none',
      outline: 'none',
      cursor: 'pointer',
    },
    sliderValue: {
      width: '45px',
      textAlign: 'right',
      fontFamily: 'monospace',
      fontSize: '1rem',
      color: '#aaa',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '12px',
    },
    infoItem: {
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '10px',
      padding: '14px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'background 0.2s',
      border: '1px solid rgba(255,255,255,0.05)',
    },
    infoLabel: {
      fontSize: '0.8rem',
      color: '#888',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    infoValue: {
      fontFamily: 'monospace',
      fontSize: '1rem',
      fontWeight: '600',
    },
    copyBadge: {
      display: 'inline-block',
      background: '#4CAF50',
      color: '#fff',
      padding: '2px 8px',
      borderRadius: '6px',
      fontSize: '0.7rem',
      marginLeft: '8px',
    },
    paletteGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(10, 1fr)',
      gap: '8px',
    },
    paletteColor: {
      width: '100%',
      aspectRatio: '1',
      borderRadius: '8px',
      cursor: 'pointer',
      border: '2px solid transparent',
      transition: 'all 0.2s',
    },
    recentRow: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
    },
    recentSwatch: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      cursor: 'pointer',
      border: '2px solid rgba(255,255,255,0.1)',
      transition: 'transform 0.2s',
    },
    sectionTitle: {
      fontSize: '0.9rem',
      color: '#8888aa',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '12px',
      fontWeight: '600',
    },
  };

  const sliderStyle = (color) => ({
    ...styles.slider,
    background: `linear-gradient(to right, #000, ${color})`,
  });

  return (
    React.createElement('div', { style: styles.container },
      React.createElement('a', {
        href: '/projects',
        style: styles.backLink,
        onMouseEnter: (e) => e.target.style.color = '#aaaaff',
        onMouseLeave: (e) => e.target.style.color = '#8888ff',
      }, '\u2190 Back to Projects'),

      React.createElement('div', { style: styles.header },
        React.createElement('h1', { style: styles.title }, '\uD83C\uDFA8 Color Picker'),
        React.createElement('p', { style: styles.subtitle }, 'Explore, pick, and copy beautiful colors')
      ),

      React.createElement('div', { style: styles.content },

        // Preview section
        React.createElement('div', { style: styles.card },
          React.createElement('div', { style: styles.previewRow },
            React.createElement('div', { style: { textAlign: 'center' } },
              React.createElement('div', { style: styles.colorPreview }),
              React.createElement('p', { style: { marginTop: '10px', color: '#aaa', fontSize: '0.85rem' } }, 'Selected Color')
            ),
            React.createElement('div', { style: { textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' } },
              React.createElement('div', { style: styles.compPreview }),
              React.createElement('p', { style: { marginTop: '8px', color: '#aaa', fontSize: '0.8rem' } }, 'Complementary'),
              React.createElement('span', { style: { fontFamily: 'monospace', fontSize: '0.85rem', color: '#ccc' } }, compHex)
            )
          )
        ),

        // Sliders
        React.createElement('div', { style: styles.card },
          React.createElement('div', { style: styles.sectionTitle }, 'RGB Sliders'),
          React.createElement('div', { style: styles.sliderGroup },
            React.createElement('div', { style: styles.sliderRow },
              React.createElement('span', { style: { ...styles.sliderLabel, color: '#ff6b6b' } }, 'R'),
              React.createElement('input', {
                type: 'range', min: 0, max: 255, value: r,
                onChange: (e) => setR(Number(e.target.value)),
                style: sliderStyle('#ff0000'),
              }),
              React.createElement('span', { style: styles.sliderValue }, r)
            ),
            React.createElement('div', { style: styles.sliderRow },
              React.createElement('span', { style: { ...styles.sliderLabel, color: '#6bff6b' } }, 'G'),
              React.createElement('input', {
                type: 'range', min: 0, max: 255, value: g,
                onChange: (e) => setG(Number(e.target.value)),
                style: sliderStyle('#00ff00'),
              }),
              React.createElement('span', { style: styles.sliderValue }, g)
            ),
            React.createElement('div', { style: styles.sliderRow },
              React.createElement('span', { style: { ...styles.sliderLabel, color: '#6b6bff' } }, 'B'),
              React.createElement('input', {
                type: 'range', min: 0, max: 255, value: b,
                onChange: (e) => setB(Number(e.target.value)),
                style: sliderStyle('#0000ff'),
              }),
              React.createElement('span', { style: styles.sliderValue }, b)
            )
          )
        ),

        // Color values
        React.createElement('div', { style: styles.card },
          React.createElement('div', { style: styles.sectionTitle }, 'Color Values'),
          React.createElement('div', { style: styles.infoGrid },
            React.createElement('div', {
              style: styles.infoItem,
              onClick: () => copyToClipboard(hex, 'hex'),
              onMouseEnter: (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)',
              onMouseLeave: (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)',
            },
              React.createElement('div', null,
                React.createElement('div', { style: styles.infoLabel }, 'HEX'),
                React.createElement('div', { style: styles.infoValue }, hex,
                  copied === 'hex' && React.createElement('span', { style: styles.copyBadge }, 'Copied!')
                )
              ),
              React.createElement('span', { style: { fontSize: '1.2rem', opacity: 0.5 } }, '\uD83D\uDCCB')
            ),
            React.createElement('div', {
              style: styles.infoItem,
              onClick: () => copyToClipboard(`rgb(${r}, ${g}, ${b})`, 'rgb'),
              onMouseEnter: (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)',
              onMouseLeave: (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)',
            },
              React.createElement('div', null,
                React.createElement('div', { style: styles.infoLabel }, 'RGB'),
                React.createElement('div', { style: styles.infoValue }, `rgb(${r}, ${g}, ${b})`,
                  copied === 'rgb' && React.createElement('span', { style: styles.copyBadge }, 'Copied!')
                )
              ),
              React.createElement('span', { style: { fontSize: '1.2rem', opacity: 0.5 } }, '\uD83D\uDCCB')
            ),
            React.createElement('div', {
              style: styles.infoItem,
              onClick: () => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl'),
              onMouseEnter: (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)',
              onMouseLeave: (e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)',
            },
              React.createElement('div', null,
                React.createElement('div', { style: styles.infoLabel }, 'HSL'),
                React.createElement('div', { style: styles.infoValue }, `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
                  copied === 'hsl' && React.createElement('span', { style: styles.copyBadge }, 'Copied!')
                )
              ),
              React.createElement('span', { style: { fontSize: '1.2rem', opacity: 0.5 } }, '\uD83D\uDCCB')
            )
          )
        ),

        // Preset palette
        React.createElement('div', { style: styles.card },
          React.createElement('div', { style: styles.sectionTitle }, 'Preset Palette'),
          React.createElement('div', { style: styles.paletteGrid },
            presetColors.map((color, i) =>
              React.createElement('div', {
                key: i,
                style: {
                  ...styles.paletteColor,
                  backgroundColor: color,
                  borderColor: hex === color.toUpperCase() ? '#fff' : 'transparent',
                },
                onClick: () => applyPreset(color),
                onMouseEnter: (e) => e.target.style.transform = 'scale(1.15)',
                onMouseLeave: (e) => e.target.style.transform = 'scale(1)',
                title: color,
              })
            )
          )
        ),

        // Recent colors
        recentColors.length > 0 && React.createElement('div', { style: styles.card },
          React.createElement('div', { style: styles.sectionTitle }, 'Recent Colors'),
          React.createElement('div', { style: styles.recentRow },
            recentColors.map((color, i) =>
              React.createElement('div', {
                key: i,
                style: {
                  ...styles.recentSwatch,
                  backgroundColor: color,
                  opacity: 1 - (i * 0.12),
                },
                onClick: () => applyPreset(color),
                onMouseEnter: (e) => e.target.style.transform = 'scale(1.1)',
                onMouseLeave: (e) => e.target.style.transform = 'scale(1)',
                title: color,
              })
            ),
            React.createElement('span', { style: { color: '#666', fontSize: '0.85rem', marginLeft: '8px' } },
              `${recentColors.length} color${recentColors.length > 1 ? 's' : ''}`
            )
          )
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
