const { useState, useCallback } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
var baseStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', sans-serif", padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' };
var cardStyle = { background: 'rgba(255,255,255,0.07)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '12px' };
var btnStyle = function (c) { return { background: c || '#8be9fd', color: '#0a0a1a', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }; };

function Toggle(props) {
  var w = 44, h = 24, r = 18;
  return React.createElement('div', { onClick: props.onChange, style: { width: w, height: h, borderRadius: h / 2, background: props.checked ? '#50fa7b' : 'rgba(255,255,255,0.15)', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 } },
    React.createElement('div', { style: { width: r, height: r, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: props.checked ? w - r - 3 : 3, transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' } })
  );
}

function ProgressBar(props) {
  return React.createElement('div', { style: { width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' } },
    React.createElement('div', { style: { width: props.percent + '%', height: '100%', background: props.color || '#8be9fd', borderRadius: '4px', transition: 'width 0.5s' } })
  );
}

function App() {
  var _s1 = useState('popup'), page = _s1[0], setPage = _s1[1];
  var _s2 = useState({ adBlock: true, darkMode: true, tracking: false, autoFill: true, notifications: true, compression: false }), settings = _s2[0], setSettings = _s2[1];
  var _s3 = useState('dark'), theme = _s3[0], setTheme = _s3[1];
  var _s4 = useState([]), notifications = _s4[0], setNotifications = _s4[1];
  var _s5 = useState(67), storageUsed = _s5[0], setStorageUsed = _s5[1];

  var toggleSetting = useCallback(function (key) {
    setSettings(function (prev) { var n = Object.assign({}, prev); n[key] = !n[key]; return n; });
  }, []);

  var addNotification = useCallback(function () {
    var msgs = ['Ad blocked on current page', 'Dark mode applied to site', 'Form auto-filled successfully', 'Tracker blocked: analytics.js', 'Page compressed: saved 45KB', 'Cookie consent auto-handled'];
    var msg = msgs[Math.floor(Math.random() * msgs.length)];
    setNotifications(function (prev) { return [{ id: Date.now(), msg: msg, time: 'Just now' }].concat(prev).slice(0, 10); });
  }, []);

  var stats = { adsBlocked: 1247, trackersBlocked: 893, pagesSaved: 156, bandwidth: '2.4 GB' };
  var themes = ['dark', 'light', 'blue', 'green'];
  var themeColors = { dark: '#1a1a3e', light: '#f0f0f0', blue: '#1a2a4e', green: '#1a3e2a' };

  var popupWidth = 380;

  var renderPopup = function () {
    return React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
          React.createElement('div', { style: { width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #8be9fd, #bd93f9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', color: '#0a0a1a' } }, 'W'),
          React.createElement('div', null,
            React.createElement('div', { style: { fontWeight: 'bold', fontSize: '15px' } }, 'WebShield Pro'),
            React.createElement('div', { style: { fontSize: '11px', color: '#888' } }, 'v3.2.1')
          )
        ),
        React.createElement('div', { style: { position: 'relative', cursor: 'pointer' }, onClick: function () { setPage('notifications'); } },
          React.createElement('span', { style: { fontSize: '20px' } }, '\uD83D\uDD14'),
          notifications.length > 0 && React.createElement('span', { style: { position: 'absolute', top: '-4px', right: '-6px', background: '#ff5555', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' } }, notifications.length > 9 ? '9+' : notifications.length)
        )
      ),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' } },
        [{ label: 'Ads Blocked', val: stats.adsBlocked, color: '#ff5555' }, { label: 'Trackers', val: stats.trackersBlocked, color: '#ffb86c' }, { label: 'Pages', val: stats.pagesSaved, color: '#50fa7b' }, { label: 'Saved', val: stats.bandwidth, color: '#8be9fd' }].map(function (s, i) {
          return React.createElement('div', { key: i, style: { background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', textAlign: 'center' } },
            React.createElement('div', { style: { fontSize: '20px', fontWeight: 'bold', color: s.color } }, s.val),
            React.createElement('div', { style: { fontSize: '11px', color: '#888', marginTop: '2px' } }, s.label)
          );
        })
      ),
      React.createElement('div', { style: { fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#8be9fd' } }, 'Quick Actions'),
      React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' } },
        [{ label: 'Block Ads', icon: '\uD83D\uDEE1' }, { label: 'Clear Data', icon: '\uD83D\uDDD1' }, { label: 'Screenshot', icon: '\uD83D\uDCF7' }, { label: 'Speed Test', icon: '\u26A1' }].map(function (a, i) {
          return React.createElement('button', { key: i, onClick: addNotification, style: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '8px 12px', color: '#e0e0e0', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', flex: '1 0 40%' } }, a.icon + ' ' + a.label);
        })
      ),
      React.createElement('div', { style: { fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#8be9fd' } }, 'Settings'),
      Object.keys(settings).map(function (key) {
        var labels = { adBlock: 'Ad Blocker', darkMode: 'Dark Mode Inject', tracking: 'Allow Tracking', autoFill: 'Auto-Fill Forms', notifications: 'Notifications', compression: 'Page Compression' };
        return React.createElement('div', { key: key, style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' } },
          React.createElement('span', { style: { fontSize: '13px' } }, labels[key] || key),
          React.createElement(Toggle, { checked: settings[key], onChange: function () { toggleSetting(key); } })
        );
      }),
      React.createElement('div', { style: { marginTop: '16px' } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' } },
          React.createElement('span', { style: { color: '#888' } }, 'Storage Used'),
          React.createElement('span', { style: { color: storageUsed > 80 ? '#ff5555' : '#50fa7b' } }, storageUsed + '% of 5 MB')
        ),
        React.createElement(ProgressBar, { percent: storageUsed, color: storageUsed > 80 ? '#ff5555' : storageUsed > 50 ? '#ffb86c' : '#50fa7b' })
      ),
      React.createElement('div', { style: { display: 'flex', gap: '8px', marginTop: '16px' } },
        React.createElement('button', { style: Object.assign({}, btnStyle('#bd93f9'), { flex: 1, fontSize: '12px' }), onClick: function () { setPage('options'); } }, 'Options Page'),
        React.createElement('button', { style: Object.assign({}, btnStyle('#8be9fd'), { flex: 1, fontSize: '12px' }), onClick: function () { setPage('themes'); } }, 'Themes')
      )
    );
  };

  var renderOptions = function () {
    return React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' } },
        React.createElement('button', { style: { background: 'transparent', border: 'none', color: '#8be9fd', cursor: 'pointer', fontSize: '16px' }, onClick: function () { setPage('popup'); } }, '\u2190'),
        React.createElement('h3', { style: { margin: 0, color: '#8be9fd' } }, 'Extension Options')
      ),
      React.createElement('div', { style: cardStyle },
        React.createElement('h4', { style: { margin: '0 0 12px', color: '#fff' } }, 'Blocking Rules'),
        React.createElement('div', { style: { fontSize: '13px', color: '#999', marginBottom: '8px' } }, 'Custom domains to block:'),
        React.createElement('div', { style: { background: 'rgba(0,0,0,0.2)', borderRadius: '6px', padding: '8px 12px', fontFamily: 'monospace', fontSize: '12px', color: '#f1fa8c' } }, 'ads.example.com\ntracker.site.net\nanalytics.provider.io')
      ),
      React.createElement('div', { style: cardStyle },
        React.createElement('h4', { style: { margin: '0 0 12px', color: '#fff' } }, 'Data Management'),
        React.createElement('div', { style: { display: 'flex', gap: '8px' } },
          React.createElement('button', { style: btnStyle('#ffb86c'), onClick: function () { setStorageUsed(Math.min(storageUsed + 10, 100)); } }, 'Export Data'),
          React.createElement('button', { style: btnStyle('#ff5555'), onClick: function () { setStorageUsed(15); } }, 'Clear All Data')
        )
      ),
      React.createElement('div', { style: cardStyle },
        React.createElement('h4', { style: { margin: '0 0 8px', color: '#fff' } }, 'About'),
        React.createElement('div', { style: { fontSize: '13px', color: '#999', lineHeight: '1.6' } }, 'WebShield Pro v3.2.1\nBuild: 2026.02.17\nPermissions: activeTab, storage, webRequest\nManifest Version: 3')
      )
    );
  };

  var renderThemes = function () {
    return React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' } },
        React.createElement('button', { style: { background: 'transparent', border: 'none', color: '#8be9fd', cursor: 'pointer', fontSize: '16px' }, onClick: function () { setPage('popup'); } }, '\u2190'),
        React.createElement('h3', { style: { margin: 0, color: '#8be9fd' } }, 'Theme Switcher')
      ),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
        themes.map(function (t) {
          return React.createElement('div', { key: t, onClick: function () { setTheme(t); }, style: { background: themeColors[t], borderRadius: '12px', padding: '20px', cursor: 'pointer', border: theme === t ? '2px solid #8be9fd' : '2px solid transparent', textAlign: 'center', textTransform: 'capitalize' } },
            React.createElement('div', { style: { fontSize: '24px', marginBottom: '8px' } }, '\uD83C\uDFA8'),
            React.createElement('div', { style: { fontWeight: 'bold', color: t === 'light' ? '#333' : '#fff' } }, t),
            theme === t && React.createElement('div', { style: { fontSize: '11px', color: '#8be9fd', marginTop: '4px' } }, 'Active')
          );
        })
      )
    );
  };

  var renderNotifications = function () {
    return React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' } },
        React.createElement('button', { style: { background: 'transparent', border: 'none', color: '#8be9fd', cursor: 'pointer', fontSize: '16px' }, onClick: function () { setPage('popup'); } }, '\u2190'),
        React.createElement('h3', { style: { margin: 0, color: '#8be9fd', flex: 1 } }, 'Notifications'),
        notifications.length > 0 && React.createElement('button', { style: Object.assign({}, btnStyle('#ff5555'), { fontSize: '11px', padding: '4px 10px' }), onClick: function () { setNotifications([]); } }, 'Clear All')
      ),
      notifications.length === 0 && React.createElement('div', { style: { textAlign: 'center', color: '#666', padding: '40px 0' } }, 'No notifications'),
      notifications.map(function (n) {
        return React.createElement('div', { key: n.id, style: { padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px' } },
          React.createElement('div', { style: { color: '#e0e0e0' } }, n.msg),
          React.createElement('div', { style: { fontSize: '11px', color: '#666', marginTop: '4px' } }, n.time)
        );
      })
    );
  };

  var renderPage = function () {
    if (page === 'options') return renderOptions();
    if (page === 'themes') return renderThemes();
    if (page === 'notifications') return renderNotifications();
    return renderPopup();
  };

  return React.createElement('div', { style: baseStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { color: '#8be9fd', margin: '0 0 20px', fontSize: '24px' } }, 'Browser Extension Mockup'),
    React.createElement('div', { style: { width: popupWidth, background: 'rgba(20,20,45,0.95)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', padding: '20px', position: 'relative' } },
      React.createElement('div', { style: { position: 'absolute', top: '-8px', right: '20px', width: '16px', height: '16px', background: 'rgba(20,20,45,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderBottom: 'none', borderRight: 'none', transform: 'rotate(45deg)' } }),
      renderPage()
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
