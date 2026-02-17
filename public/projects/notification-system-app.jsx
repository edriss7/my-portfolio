const { useState, useEffect, useCallback, useRef } = React;

var nextId = 1;

function App() {
  var _useState = useState([]);
  var notifications = _useState[0];
  var setNotifications = _useState[1];
  var _useState2 = useState('top-right');
  var position = _useState2[0];
  var setPosition = _useState2[1];

  var removeNotification = useCallback(function(id) {
    setNotifications(function(prev) { return prev.filter(function(n) { return n.id !== id; }); });
  }, []);

  var addNotification = useCallback(function(type) {
    var messages = {
      success: ['Operation completed successfully!', 'Data saved!', 'Profile updated!'],
      error: ['Something went wrong!', 'Connection failed!', 'Invalid input detected!'],
      warning: ['Low disk space warning', 'Session expiring soon', 'Unsaved changes detected'],
      info: ['New update available', 'Scheduled maintenance tonight', '3 new messages received']
    };
    var msgs = messages[type];
    var msg = msgs[Math.floor(Math.random() * msgs.length)];
    var id = nextId++;
    var n = { id: id, type: type, message: msg, createdAt: Date.now(), duration: 4000 };
    setNotifications(function(prev) { return prev.concat([n]); });
    setTimeout(function() { removeNotification(id); }, 4000);
  }, [removeNotification]);

  var containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px'
  };

  var backLinkStyle = {
    color: '#8be9fd',
    textDecoration: 'none',
    fontSize: '14px',
    display: 'inline-block',
    marginBottom: '20px'
  };

  var titleStyle = { textAlign: 'center', fontSize: '28px', marginBottom: '30px', color: '#fff' };

  var panelStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '30px',
    border: '1px solid rgba(255,255,255,0.1)'
  };

  var btnBase = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#fff',
    margin: '6px',
    transition: 'opacity 0.2s'
  };

  var typeColors = {
    success: '#50fa7b',
    error: '#ff5555',
    warning: '#f1fa8c',
    info: '#8be9fd'
  };

  var positions = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];

  var posStyle = {};
  if (position === 'top-right') posStyle = { top: '20px', right: '20px' };
  else if (position === 'top-left') posStyle = { top: '20px', left: '20px' };
  else if (position === 'bottom-right') posStyle = { bottom: '20px', right: '20px' };
  else posStyle = { bottom: '20px', left: '20px' };

  var notifContainerStyle = Object.assign({
    position: 'fixed',
    zIndex: 9999,
    display: 'flex',
    flexDirection: position.startsWith('bottom') ? 'column-reverse' : 'column',
    gap: '10px',
    maxWidth: '380px',
    width: '100%'
  }, posStyle);

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: titleStyle }, 'Toast Notification System'),
    React.createElement('div', { style: panelStyle },
      React.createElement('h3', { style: { marginBottom: '15px', color: '#bd93f9' } }, 'Trigger Notifications'),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' } },
        ['success', 'error', 'warning', 'info'].map(function(type) {
          return React.createElement('button', {
            key: type,
            style: Object.assign({}, btnBase, { background: typeColors[type], color: type === 'warning' ? '#1a1a2e' : '#fff' }),
            onClick: function() { addNotification(type); }
          }, type.charAt(0).toUpperCase() + type.slice(1));
        })
      ),
      React.createElement('h3', { style: { marginBottom: '10px', color: '#bd93f9' } }, 'Position'),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' } },
        positions.map(function(pos) {
          return React.createElement('button', {
            key: pos,
            style: Object.assign({}, btnBase, {
              background: pos === position ? '#bd93f9' : 'rgba(255,255,255,0.1)',
              fontSize: '12px',
              padding: '8px 16px'
            }),
            onClick: function() { setPosition(pos); }
          }, pos);
        })
      ),
      React.createElement('div', { style: { textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '13px' } },
        'Active notifications: ' + notifications.length
      )
    ),
    React.createElement('div', { style: notifContainerStyle },
      notifications.map(function(n) {
        return React.createElement(NotificationItem, { key: n.id, notification: n, onClose: removeNotification, typeColors: typeColors });
      })
    )
  );
}

function NotificationItem(props) {
  var n = props.notification;
  var onClose = props.onClose;
  var typeColors = props.typeColors;
  var _useState = useState(100);
  var progress = _useState[0];
  var setProgress = _useState[1];
  var intervalRef = useRef(null);

  useEffect(function() {
    var start = Date.now();
    intervalRef.current = setInterval(function() {
      var elapsed = Date.now() - start;
      var pct = Math.max(0, 100 - (elapsed / n.duration) * 100);
      setProgress(pct);
      if (pct <= 0) clearInterval(intervalRef.current);
    }, 50);
    return function() { clearInterval(intervalRef.current); };
  }, [n.duration]);

  var icons = { success: '\u2713', error: '\u2717', warning: '\u26A0', info: '\u2139' };
  var color = typeColors[n.type];

  var itemStyle = {
    background: 'rgba(30,30,60,0.95)',
    borderRadius: '10px',
    padding: '14px 16px',
    borderLeft: '4px solid ' + color,
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    position: 'relative',
    overflow: 'hidden',
    animation: 'slideIn 0.3s ease'
  };

  return React.createElement('div', { style: itemStyle },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
      React.createElement('span', { style: { fontSize: '18px', color: color, flexShrink: 0 } }, icons[n.type]),
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', { style: { fontWeight: 'bold', fontSize: '13px', color: color, textTransform: 'uppercase', marginBottom: '2px' } }, n.type),
        React.createElement('div', { style: { fontSize: '14px', color: '#ccc' } }, n.message)
      ),
      React.createElement('button', {
        style: { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '18px', padding: '0 4px' },
        onClick: function() { onClose(n.id); }
      }, '\u00D7')
    ),
    React.createElement('div', {
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '3px',
        width: progress + '%',
        background: color,
        transition: 'width 0.05s linear',
        borderRadius: '0 0 0 10px'
      }
    })
  );
}

var styleTag = document.createElement('style');
styleTag.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }';
document.head.appendChild(styleTag);

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
