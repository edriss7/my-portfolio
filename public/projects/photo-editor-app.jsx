const { useState, useCallback } = React;

var defaultFilters = { brightness: 100, contrast: 100, saturate: 100, blur: 0, hueRotate: 0, sepia: 0, grayscale: 0 };

var presets = [
  { name: 'None', filters: Object.assign({}, defaultFilters) },
  { name: 'Vintage', filters: { brightness: 110, contrast: 85, saturate: 70, blur: 0, hueRotate: 15, sepia: 40, grayscale: 0 } },
  { name: 'Noir', filters: { brightness: 105, contrast: 130, saturate: 0, blur: 0, hueRotate: 0, sepia: 0, grayscale: 100 } },
  { name: 'Warm', filters: { brightness: 108, contrast: 105, saturate: 120, blur: 0, hueRotate: -15, sepia: 20, grayscale: 0 } },
  { name: 'Cool', filters: { brightness: 105, contrast: 100, saturate: 90, blur: 0, hueRotate: 180, sepia: 0, grayscale: 0 } },
  { name: 'Vivid', filters: { brightness: 110, contrast: 120, saturate: 160, blur: 0, hueRotate: 0, sepia: 0, grayscale: 0 } },
  { name: 'Dreamy', filters: { brightness: 115, contrast: 80, saturate: 110, blur: 1, hueRotate: 10, sepia: 15, grayscale: 0 } },
  { name: 'Dramatic', filters: { brightness: 90, contrast: 150, saturate: 80, blur: 0, hueRotate: 0, sepia: 10, grayscale: 0 } }
];

var sliders = [
  { key: 'brightness', label: 'Brightness', min: 0, max: 200, unit: '%' },
  { key: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%' },
  { key: 'saturate', label: 'Saturation', min: 0, max: 200, unit: '%' },
  { key: 'blur', label: 'Blur', min: 0, max: 10, unit: 'px', step: 0.1 },
  { key: 'hueRotate', label: 'Hue Rotate', min: -180, max: 180, unit: 'deg' },
  { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' },
  { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, unit: '%' }
];

function App() {
  var _s = useState(Object.assign({}, defaultFilters));
  var filters = _s[0]; var setFilters = _s[1];
  var _s2 = useState('None');
  var activePreset = _s2[0]; var setActivePreset = _s2[1];

  var updateFilter = function(key, val) {
    setFilters(function(prev) { var n = Object.assign({}, prev); n[key] = Number(val); return n; });
    setActivePreset('Custom');
  };

  var applyPreset = function(preset) {
    setFilters(Object.assign({}, preset.filters));
    setActivePreset(preset.name);
  };

  var reset = function() {
    setFilters(Object.assign({}, defaultFilters));
    setActivePreset('None');
  };

  var filterStr = 'brightness(' + filters.brightness + '%) contrast(' + filters.contrast + '%) saturate(' + filters.saturate + '%) blur(' + filters.blur + 'px) hue-rotate(' + filters.hueRotate + 'deg) sepia(' + filters.sepia + '%) grayscale(' + filters.grayscale + '%)';

  var containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px'
  };
  var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };

  var layoutStyle = {
    maxWidth: '900px', margin: '0 auto',
    display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px',
    alignItems: 'start'
  };

  var photoStyle = {
    width: '100%', aspectRatio: '4/3',
    borderRadius: '12px', overflow: 'hidden',
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa502 20%, #f7d794 40%, #78e08f 60%, #38ada9 80%, #6c5ce7 100%)',
    filter: filterStr,
    transition: 'filter 0.15s ease',
    position: 'relative'
  };

  var photoOverlayStyle = {
    position: 'absolute', inset: 0,
    background: 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect width="200" height="150" fill="none"/><circle cx="50" cy="40" r="20" fill="rgba(255,255,255,0.3)"/><path d="M0 120 L60 70 L100 100 L150 50 L200 90 L200 150 L0 150Z" fill="rgba(255,255,255,0.15)"/></svg>') + '") center/cover'
  };

  var panelStyle = {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.08)',
    maxHeight: '80vh',
    overflowY: 'auto'
  };

  var sliderTrackStyle = {
    width: '100%', height: '4px', appearance: 'none', WebkitAppearance: 'none',
    background: 'rgba(255,255,255,0.15)', borderRadius: '2px', outline: 'none',
    cursor: 'pointer', accentColor: '#bd93f9'
  };

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { textAlign: 'center', fontSize: '28px', color: '#fff', marginBottom: '24px' } }, 'Photo Filter Editor'),
    React.createElement('div', { style: layoutStyle },
      React.createElement('div', null,
        React.createElement('div', { style: photoStyle },
          React.createElement('div', { style: photoOverlayStyle })
        ),
        React.createElement('div', { style: { marginTop: '16px' } },
          React.createElement('div', { style: { fontSize: '13px', color: '#888', marginBottom: '10px' } }, 'Presets'),
          React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } },
            presets.map(function(p) {
              var isActive = activePreset === p.name;
              return React.createElement('button', {
                key: p.name,
                onClick: function() { applyPreset(p); },
                style: {
                  padding: '8px 14px', borderRadius: '8px',
                  border: '1px solid ' + (isActive ? '#bd93f9' : 'rgba(255,255,255,0.1)'),
                  background: isActive ? 'rgba(189,147,249,0.2)' : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#bd93f9' : '#aaa', cursor: 'pointer', fontSize: '12px',
                  fontWeight: isActive ? 'bold' : 'normal'
                }
              }, p.name);
            })
          )
        )
      ),
      React.createElement('div', { style: panelStyle },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } },
          React.createElement('h3', { style: { margin: 0, fontSize: '16px', color: '#fff' } }, 'Adjustments'),
          React.createElement('button', {
            onClick: reset,
            style: {
              padding: '6px 12px', borderRadius: '6px', border: 'none',
              background: 'rgba(255,85,85,0.2)', color: '#ff5555',
              cursor: 'pointer', fontSize: '12px'
            }
          }, 'Reset All')
        ),
        sliders.map(function(s) {
          var val = filters[s.key];
          return React.createElement('div', { key: s.key, style: { marginBottom: '16px' } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
              React.createElement('label', { style: { fontSize: '13px', color: '#aaa' } }, s.label),
              React.createElement('span', { style: { fontSize: '13px', color: '#bd93f9', fontWeight: 'bold' } }, val + s.unit)
            ),
            React.createElement('input', {
              type: 'range',
              min: s.min, max: s.max, step: s.step || 1,
              value: val,
              onChange: function(e) { updateFilter(s.key, e.target.value); },
              style: sliderTrackStyle
            })
          );
        }),
        React.createElement('div', { style: { marginTop: '16px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' } },
          React.createElement('div', { style: { fontSize: '11px', color: '#666', marginBottom: '4px' } }, 'CSS Filter:'),
          React.createElement('code', { style: { fontSize: '10px', color: '#8be9fd', wordBreak: 'break-all' } }, filterStr)
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
