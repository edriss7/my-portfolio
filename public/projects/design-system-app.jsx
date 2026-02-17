const { useState, useCallback } = React;

const backLinkStyle = { color: '#7b8cff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
const containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '30px' };
const sectionStyle = { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.08)' };
const sectionTitle = { fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#fff', borderBottom: '2px solid #7b8cff', paddingBottom: '8px', display: 'inline-block' };

var colors = [
  { name: 'Primary', hex: '#7b8cff' }, { name: 'Secondary', hex: '#ff7bca' }, { name: 'Success', hex: '#4ade80' },
  { name: 'Warning', hex: '#fbbf24' }, { name: 'Error', hex: '#f87171' }, { name: 'Info', hex: '#38bdf8' },
  { name: 'Surface', hex: '#1e1e3a' }, { name: 'Background', hex: '#0a0a1a' }, { name: 'Text', hex: '#e0e0e0' },
  { name: 'Muted', hex: '#6b7280' }, { name: 'Accent', hex: '#a78bfa' }, { name: 'Highlight', hex: '#f0abfc' }
];

var typoScale = [
  { tag: 'H1', size: '48px', weight: '800', sample: 'Heading One' },
  { tag: 'H2', size: '36px', weight: '700', sample: 'Heading Two' },
  { tag: 'H3', size: '28px', weight: '700', sample: 'Heading Three' },
  { tag: 'H4', size: '22px', weight: '600', sample: 'Heading Four' },
  { tag: 'H5', size: '18px', weight: '600', sample: 'Heading Five' },
  { tag: 'H6', size: '16px', weight: '600', sample: 'Heading Six' },
  { tag: 'Body', size: '16px', weight: '400', sample: 'Body text for regular content and paragraphs.' },
  { tag: 'Small', size: '12px', weight: '400', sample: 'Small caption or helper text.' }
];

var spacingScale = [4, 8, 12, 16, 24, 32, 48, 64, 96];
var radiusOptions = [0, 4, 8, 12, 16, 24, 9999];
var shadowLevels = [
  { name: 'SM', value: '0 1px 3px rgba(0,0,0,0.4)' },
  { name: 'MD', value: '0 4px 12px rgba(0,0,0,0.5)' },
  { name: 'LG', value: '0 8px 24px rgba(0,0,0,0.6)' },
  { name: 'XL', value: '0 16px 48px rgba(0,0,0,0.7)' }
];
var icons = [
  { label: 'Home', ch: '\u2302' }, { label: 'Star', ch: '\u2605' }, { label: 'Heart', ch: '\u2665' },
  { label: 'Check', ch: '\u2713' }, { label: 'Cross', ch: '\u2717' }, { label: 'Arrow', ch: '\u2192' },
  { label: 'Sun', ch: '\u2600' }, { label: 'Moon', ch: '\u263D' }, { label: 'Music', ch: '\u266B' },
  { label: 'Mail', ch: '\u2709' }, { label: 'Gear', ch: '\u2699' }, { label: 'Lock', ch: '\uD83D\uDD12' },
  { label: 'Bell', ch: '\uD83D\uDD14' }, { label: 'Fire', ch: '\uD83D\uDD25' }, { label: 'Bolt', ch: '\u26A1' }
];
var tokens = [
  { token: '--color-bg', value: '#0a0a1a' }, { token: '--color-surface', value: '#1e1e3a' },
  { token: '--color-primary', value: '#7b8cff' }, { token: '--color-text', value: '#e0e0e0' },
  { token: '--radius-sm', value: '4px' }, { token: '--radius-md', value: '8px' },
  { token: '--radius-lg', value: '16px' }, { token: '--space-unit', value: '8px' },
  { token: '--font-base', value: '16px' }, { token: '--font-heading', value: '700' },
  { token: '--shadow-default', value: '0 4px 12px rgba(0,0,0,0.5)' }, { token: '--transition', value: '0.2s ease' }
];

function App() {
  var st = useState(null), copied = st[0], setCopied = st[1];
  var copyHex = useCallback(function(hex) {
    setCopied(hex);
    setTimeout(function() { setCopied(null); }, 1500);
  }, []);

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '36px', fontWeight: '800', marginBottom: '8px', color: '#fff' } }, 'Design System'),
    React.createElement('p', { style: { color: '#9ca3af', marginBottom: '32px', fontSize: '16px' } }, 'A comprehensive component and token library for building consistent interfaces.'),

    // Color Palette
    React.createElement('div', { style: sectionStyle },
      React.createElement('div', { style: sectionTitle }, 'Color Palette'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px', marginTop: '12px' } },
        colors.map(function(c) {
          return React.createElement('div', { key: c.name, onClick: function() { copyHex(c.hex); }, style: { cursor: 'pointer', textAlign: 'center' } },
            React.createElement('div', { style: { width: '100%', height: '64px', background: c.hex, borderRadius: '10px', border: '2px solid rgba(255,255,255,0.1)', transition: 'transform 0.2s', marginBottom: '6px' } }),
            React.createElement('div', { style: { fontSize: '13px', fontWeight: '600' } }, c.name),
            React.createElement('div', { style: { fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace' } }, copied === c.hex ? 'Copied!' : c.hex)
          );
        })
      )
    ),

    // Typography Scale
    React.createElement('div', { style: sectionStyle },
      React.createElement('div', { style: sectionTitle }, 'Typography Scale'),
      React.createElement('div', { style: { marginTop: '12px' } },
        typoScale.map(function(t) {
          return React.createElement('div', { key: t.tag, style: { display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' } },
            React.createElement('span', { style: { width: '60px', fontSize: '12px', color: '#7b8cff', fontFamily: 'monospace', flexShrink: 0 } }, t.tag),
            React.createElement('span', { style: { fontSize: t.size, fontWeight: t.weight, color: '#fff', flex: 1 } }, t.sample),
            React.createElement('span', { style: { fontSize: '11px', color: '#6b7280', fontFamily: 'monospace', flexShrink: 0 } }, t.size + ' / ' + t.weight)
          );
        })
      )
    ),

    // Spacing Scale
    React.createElement('div', { style: sectionStyle },
      React.createElement('div', { style: sectionTitle }, 'Spacing Scale'),
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap', marginTop: '12px' } },
        spacingScale.map(function(s) {
          return React.createElement('div', { key: s, style: { textAlign: 'center' } },
            React.createElement('div', { style: { width: s + 'px', height: s + 'px', background: 'linear-gradient(135deg, #7b8cff, #ff7bca)', borderRadius: '4px', marginBottom: '6px' } }),
            React.createElement('div', { style: { fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace' } }, s + 'px')
          );
        })
      )
    ),

    // Border Radius
    React.createElement('div', { style: sectionStyle },
      React.createElement('div', { style: sectionTitle }, 'Border Radius'),
      React.createElement('div', { style: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '12px' } },
        radiusOptions.map(function(r) {
          return React.createElement('div', { key: r, style: { textAlign: 'center' } },
            React.createElement('div', { style: { width: '64px', height: '64px', background: '#7b8cff', borderRadius: r === 9999 ? '9999px' : r + 'px' } }),
            React.createElement('div', { style: { fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace', marginTop: '6px' } }, r === 9999 ? 'full' : r + 'px')
          );
        })
      )
    ),

    // Shadows
    React.createElement('div', { style: sectionStyle },
      React.createElement('div', { style: sectionTitle }, 'Shadow Levels'),
      React.createElement('div', { style: { display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '12px' } },
        shadowLevels.map(function(s) {
          return React.createElement('div', { key: s.name, style: { textAlign: 'center' } },
            React.createElement('div', { style: { width: '100px', height: '100px', background: '#1e1e3a', borderRadius: '12px', boxShadow: s.value, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' } }, s.name),
            React.createElement('div', { style: { fontSize: '10px', color: '#6b7280', fontFamily: 'monospace', marginTop: '8px', maxWidth: '120px' } }, s.value)
          );
        })
      )
    ),

    // Icon Set
    React.createElement('div', { style: sectionStyle },
      React.createElement('div', { style: sectionTitle }, 'Icon Set'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px', marginTop: '12px' } },
        icons.map(function(ic) {
          return React.createElement('div', { key: ic.label, style: { textAlign: 'center', padding: '12px 4px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' } },
            React.createElement('div', { style: { fontSize: '28px', marginBottom: '4px' } }, ic.ch),
            React.createElement('div', { style: { fontSize: '10px', color: '#9ca3af' } }, ic.label)
          );
        })
      )
    ),

    // Theme Tokens
    React.createElement('div', { style: sectionStyle },
      React.createElement('div', { style: sectionTitle }, 'Theme Tokens'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px', marginTop: '12px' } },
        tokens.map(function(tk) {
          return React.createElement('div', { key: tk.token, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px' } },
            React.createElement('span', { style: { color: '#7b8cff' } }, tk.token),
            React.createElement('span', { style: { color: '#fbbf24' } }, tk.value)
          );
        })
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
