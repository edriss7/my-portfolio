const { useState, useCallback, useEffect, useRef } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
var baseStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', sans-serif", padding: '24px' };
var cardStyle = { background: 'rgba(255,255,255,0.07)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' };
var btnStyle = function (c) { return { background: c || '#8be9fd', color: '#0a0a1a', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }; };

function RadialProgress(props) {
  var size = props.size || 100;
  var stroke = props.stroke || 8;
  var radius = (size - stroke) / 2;
  var circumference = 2 * Math.PI * radius;
  var offset = circumference - (props.value / 100) * circumference;
  var color = props.value >= 90 ? '#50fa7b' : props.value >= 50 ? '#ffb86c' : '#ff5555';
  if (props.color) color = props.color;

  return React.createElement('div', { style: { position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } },
    React.createElement('svg', { width: size, height: size, style: { transform: 'rotate(-90deg)' } },
      React.createElement('circle', { cx: size / 2, cy: size / 2, r: radius, stroke: 'rgba(255,255,255,0.1)', strokeWidth: stroke, fill: 'none' }),
      React.createElement('circle', { cx: size / 2, cy: size / 2, r: radius, stroke: color, strokeWidth: stroke, fill: 'none', strokeDasharray: circumference, strokeDashoffset: offset, strokeLinecap: 'round', style: { transition: 'stroke-dashoffset 1s ease' } })
    ),
    React.createElement('div', { style: { position: 'absolute', textAlign: 'center' } },
      React.createElement('div', { style: { fontSize: size / 4, fontWeight: 'bold', color: color } }, props.value),
      props.label && React.createElement('div', { style: { fontSize: size / 10, color: '#888', marginTop: '2px' } }, props.label)
    )
  );
}

function App() {
  var _s1 = useState(true), showInstall = _s1[0], setShowInstall = _s1[1];
  var _s2 = useState(true), isOnline = _s2[0], setIsOnline = _s2[1];
  var _s3 = useState('activated'), swStatus = _s3[0], setSwStatus = _s3[1];
  var _s4 = useState([]), pushNotifs = _s4[0], setPushNotifs = _s4[1];
  var _s5 = useState(false), showManifest = _s5[0], setShowManifest = _s5[1];
  var _s6 = useState({ performance: 92, accessibility: 88, bestPractices: 95, seo: 78, pwa: 100 }), scores = _s6[0], setScores = _s6[1];
  var _s7 = useState(false), installed = _s7[0], setInstalled = _s7[1];

  var cachedPages = [
    { url: '/index.html', size: '12 KB', cached: true },
    { url: '/app.js', size: '145 KB', cached: true },
    { url: '/styles.css', size: '28 KB', cached: true },
    { url: '/icons/icon-192.png', size: '8 KB', cached: true },
    { url: '/icons/icon-512.png', size: '24 KB', cached: true },
    { url: '/api/data.json', size: '3 KB', cached: true },
    { url: '/fonts/inter.woff2', size: '48 KB', cached: true },
    { url: '/offline.html', size: '4 KB', cached: true }
  ];

  var manifest = {
    name: 'My Progressive Web App',
    short_name: 'MyPWA',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a1a',
    theme_color: '#8be9fd',
    orientation: 'portrait',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  };

  var sendNotification = useCallback(function () {
    var messages = [
      'New content available! Tap to update.',
      'Your data has been synced successfully.',
      'You have 3 unread messages.',
      'Weekly report is ready to view.',
      'App update installed in background.'
    ];
    var msg = messages[Math.floor(Math.random() * messages.length)];
    setPushNotifs(function (prev) { return [{ id: Date.now(), msg: msg, time: new Date().toLocaleTimeString() }].concat(prev).slice(0, 8); });
  }, []);

  var swStates = ['installing', 'installed', 'activating', 'activated', 'redundant'];
  var swColors = { installing: '#ffb86c', installed: '#f1fa8c', activating: '#8be9fd', activated: '#50fa7b', redundant: '#ff5555' };

  var cycleSwStatus = useCallback(function () {
    var idx = swStates.indexOf(swStatus);
    setSwStatus(swStates[(idx + 1) % swStates.length]);
  }, [swStatus]);

  var randomizeScores = useCallback(function () {
    setScores({
      performance: 60 + Math.floor(Math.random() * 40),
      accessibility: 60 + Math.floor(Math.random() * 40),
      bestPractices: 60 + Math.floor(Math.random() * 40),
      seo: 60 + Math.floor(Math.random() * 40),
      pwa: 80 + Math.floor(Math.random() * 20)
    });
  }, []);

  return React.createElement('div', { style: baseStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { color: '#8be9fd', margin: '0 0 20px', fontSize: '24px' } }, 'Progressive Web App Demo'),

    showInstall && !installed && React.createElement('div', { style: { background: 'linear-gradient(135deg, rgba(139,233,253,0.15), rgba(189,147,249,0.15))', border: '1px solid rgba(139,233,253,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' } },
      React.createElement('div', { style: { width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #8be9fd, #bd93f9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 } }, '\uD83D\uDCF1'),
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', { style: { fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' } }, 'Install MyPWA'),
        React.createElement('div', { style: { fontSize: '13px', color: '#999' } }, 'Add to your home screen for the best experience')
      ),
      React.createElement('button', { style: btnStyle('#50fa7b'), onClick: function () { setInstalled(true); setShowInstall(false); } }, 'Install'),
      React.createElement('button', { style: { background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '18px' }, onClick: function () { setShowInstall(false); } }, '\u00D7')
    ),

    installed && React.createElement('div', { style: { background: 'rgba(80,250,123,0.1)', border: '1px solid rgba(80,250,123,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: '#50fa7b' } }, '\u2713 App installed successfully! Running in standalone mode.'),

    React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center' } },
      React.createElement('div', { style: { width: '10px', height: '10px', borderRadius: '50%', background: isOnline ? '#50fa7b' : '#ff5555' } }),
      React.createElement('span', { style: { fontSize: '14px', fontWeight: 'bold', color: isOnline ? '#50fa7b' : '#ff5555' } }, isOnline ? 'Online' : 'Offline'),
      React.createElement('button', { style: Object.assign({}, btnStyle(isOnline ? '#ff5555' : '#50fa7b'), { marginLeft: '8px', padding: '4px 12px', fontSize: '12px' }), onClick: function () { setIsOnline(!isOnline); } }, isOnline ? 'Go Offline' : 'Go Online')
    ),

    !isOnline && React.createElement('div', { style: { background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.3)', borderRadius: '8px', padding: '16px', marginBottom: '20px', textAlign: 'center' } },
      React.createElement('div', { style: { fontSize: '32px', marginBottom: '8px' } }, '\uD83D\uDCE1'),
      React.createElement('div', { style: { fontWeight: 'bold', marginBottom: '4px' } }, 'You are offline'),
      React.createElement('div', { style: { fontSize: '13px', color: '#999' } }, 'Cached content is still available below')
    ),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' } },

      React.createElement('div', { style: cardStyle },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' } },
          React.createElement('h3', { style: { margin: 0, color: '#8be9fd' } }, 'Service Worker'),
          React.createElement('button', { style: Object.assign({}, btnStyle('#bd93f9'), { padding: '4px 12px', fontSize: '11px' }), onClick: cycleSwStatus }, 'Cycle Status')
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' } },
          React.createElement('div', { style: { width: '12px', height: '12px', borderRadius: '50%', background: swColors[swStatus], boxShadow: '0 0 8px ' + swColors[swStatus] } }),
          React.createElement('span', { style: { fontSize: '14px', color: swColors[swStatus], fontWeight: 'bold', textTransform: 'capitalize' } }, swStatus)
        ),
        React.createElement('div', { style: { fontSize: '12px', color: '#888', lineHeight: '1.6' } },
          'Scope: /\nScript: /sw.js\nUpdated: Feb 17, 2026 09:30 AM\nCache: v3.2.1'
        )
      ),

      React.createElement('div', { style: cardStyle },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' } },
          React.createElement('h3', { style: { margin: 0, color: '#8be9fd' } }, 'Push Notifications'),
          React.createElement('button', { style: Object.assign({}, btnStyle('#ffb86c'), { padding: '4px 12px', fontSize: '11px' }), onClick: sendNotification }, 'Simulate Push')
        ),
        pushNotifs.length === 0 && React.createElement('div', { style: { color: '#666', fontSize: '13px', textAlign: 'center', padding: '20px' } }, 'No notifications yet. Click Simulate Push.'),
        pushNotifs.map(function (n) {
          return React.createElement('div', { key: n.id, style: { background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px 12px', marginBottom: '6px', fontSize: '13px', display: 'flex', gap: '10px', alignItems: 'flex-start' } },
            React.createElement('span', { style: { fontSize: '16px' } }, '\uD83D\uDD14'),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', null, n.msg),
              React.createElement('div', { style: { fontSize: '11px', color: '#666', marginTop: '2px' } }, n.time)
            )
          );
        })
      ),

      React.createElement('div', { style: cardStyle },
        React.createElement('h3', { style: { margin: '0 0 12px', color: '#8be9fd' } }, 'Cached Content'),
        React.createElement('div', { style: { fontSize: '12px', color: '#888', marginBottom: '8px' } }, cachedPages.length + ' files \u2022 ' + cachedPages.reduce(function (a, p) { return a + parseInt(p.size); }, 0) + ' KB total'),
        cachedPages.map(function (p, i) {
          return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13px' } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              React.createElement('span', { style: { color: '#50fa7b', fontSize: '10px' } }, '\u25CF'),
              React.createElement('span', { style: { fontFamily: 'monospace', color: '#f1fa8c' } }, p.url)
            ),
            React.createElement('span', { style: { color: '#888', fontSize: '12px' } }, p.size)
          );
        })
      ),

      React.createElement('div', { style: cardStyle },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' } },
          React.createElement('h3', { style: { margin: 0, color: '#8be9fd' } }, 'Manifest'),
          React.createElement('button', { style: Object.assign({}, btnStyle('#8be9fd'), { padding: '4px 12px', fontSize: '11px' }), onClick: function () { setShowManifest(!showManifest); } }, showManifest ? 'Hide JSON' : 'View JSON')
        ),
        !showManifest && React.createElement('div', { style: { fontSize: '13px' } },
          Object.keys(manifest).filter(function (k) { return k !== 'icons'; }).map(function (key) {
            return React.createElement('div', { key: key, style: { display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' } },
              React.createElement('span', { style: { color: '#bd93f9' } }, key),
              React.createElement('span', { style: { color: '#f1fa8c' } }, String(manifest[key]))
            );
          })
        ),
        showManifest && React.createElement('pre', { style: { background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '12px', fontFamily: 'monospace', fontSize: '12px', overflow: 'auto', maxHeight: '200px', margin: 0, color: '#f8f8f2' } }, JSON.stringify(manifest, null, 2))
      ),

      React.createElement('div', { style: Object.assign({}, cardStyle, { gridColumn: '1 / -1' }) },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' } },
          React.createElement('h3', { style: { margin: 0, color: '#8be9fd' } }, 'Lighthouse Score'),
          React.createElement('button', { style: Object.assign({}, btnStyle('#bd93f9'), { padding: '4px 12px', fontSize: '11px' }), onClick: randomizeScores }, 'Re-run Audit')
        ),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' } },
          [
            { key: 'performance', label: 'Performance' },
            { key: 'accessibility', label: 'Accessibility' },
            { key: 'bestPractices', label: 'Best Practices' },
            { key: 'seo', label: 'SEO' },
            { key: 'pwa', label: 'PWA' }
          ].map(function (item) {
            return React.createElement('div', { key: item.key, style: { textAlign: 'center' } },
              React.createElement(RadialProgress, { value: scores[item.key], size: 100, stroke: 8, label: item.label })
            );
          })
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
