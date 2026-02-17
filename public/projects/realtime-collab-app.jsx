const { useState, useEffect, useRef, useCallback } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '30px' };
var inputStyle = { background: '#1e1e3a', border: '1px solid #3a3a5c', borderRadius: '8px', color: '#e0e0e0', padding: '10px 14px', fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none' };
var cardStyle = { background: 'rgba(30,30,58,0.8)', borderRadius: '12px', padding: '16px', border: '1px solid #2a2a4a' };

var users = [
  { id: 1, name: 'Alice', color: '#6c5ce7', avatar: 'AC' },
  { id: 2, name: 'Bob', color: '#00cec9', avatar: 'BM' }
];

function App() {
  var _t1 = useState('Hello! This is a collaborative document.\n\nFeel free to start typing in either editor panel to see changes appear in the other one after a short delay.\n\nThis simulates real-time collaboration between two users.'), text1 = _t1[0], setText1 = _t1[1];
  var _t2 = useState('Hello! This is a collaborative document.\n\nFeel free to start typing in either editor panel to see changes appear in the other one after a short delay.\n\nThis simulates real-time collaboration between two users.'), text2 = _t2[0], setText2 = _t2[1];
  var _c1 = useState(0), cursor1 = _c1[0], setCursor1 = _c1[1];
  var _c2 = useState(0), cursor2 = _c2[0], setCursor2 = _c2[1];
  var _log = useState([
    { id: 1, user: 1, action: 'joined the document', time: '10:00 AM' },
    { id: 2, user: 2, action: 'joined the document', time: '10:01 AM' }
  ]), history = _log[0], setHistory = _log[1];
  var _syncing = useState(null), syncing = _syncing[0], setSyncing = _syncing[1];
  var _active = useState(null), activeEditor = _active[0], setActiveEditor = _active[1];
  var _online1 = useState(true), online1 = _online1[0], setOnline1 = _online1[1];
  var _online2 = useState(true), online2 = _online2[0], setOnline2 = _online2[1];
  var syncTimer = useRef(null);
  var logCounter = useRef(3);

  var getTimeStr = function() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s + ' ' + ampm;
  };

  var addLog = useCallback(function(userId, action) {
    logCounter.current++;
    setHistory(function(prev) {
      var newLog = { id: logCounter.current, user: userId, action: action, time: getTimeStr() };
      var updated = [newLog].concat(prev);
      return updated.slice(0, 50);
    });
  }, []);

  var handleChange1 = useCallback(function(e) {
    var val = e.target.value;
    setText1(val);
    setCursor1(e.target.selectionStart || 0);
    setActiveEditor(1);
    setSyncing(1);
    addLog(1, 'is typing...');
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(function() {
      setText2(val);
      setSyncing(null);
      addLog(1, 'edited the document');
    }, 400);
  }, [addLog]);

  var handleChange2 = useCallback(function(e) {
    var val = e.target.value;
    setText2(val);
    setCursor2(e.target.selectionStart || 0);
    setActiveEditor(2);
    setSyncing(2);
    addLog(2, 'is typing...');
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(function() {
      setText1(val);
      setSyncing(null);
      addLog(2, 'edited the document');
    }, 400);
  }, [addLog]);

  var handleSelect1 = function(e) { setCursor1(e.target.selectionStart || 0); };
  var handleSelect2 = function(e) { setCursor2(e.target.selectionStart || 0); };

  var wordCount = text1.split(/\s+/).filter(function(w) { return w.length > 0; }).length;
  var charCount = text1.length;
  var lineCount = text1.split('\n').length;

  var getLineCol = function(text, pos) {
    var before = text.substring(0, pos);
    var lines = before.split('\n');
    return { line: lines.length, col: lines[lines.length - 1].length + 1 };
  };

  var pos1 = getLineCol(text1, cursor1);
  var pos2 = getLineCol(text2, cursor2);

  var renderEditor = function(userId, text, onChange, onSelect, cursorPos, lineCol, otherLineCol, otherUser, isOnline, setOnline, otherOnline) {
    var user = users[userId - 1];
    var other = users[userId === 1 ? 1 : 0];
    var isSyncing = syncing === userId;
    var isActive = activeEditor === userId;

    return React.createElement('div', { style: { flex: '1', minWidth: '300px' } },
      React.createElement('div', { style: Object.assign({}, cardStyle, { border: isActive ? '1px solid ' + user.color + '60' : '1px solid #2a2a4a' }) },
        // Header
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
            React.createElement('div', { style: { width: '32px', height: '32px', borderRadius: '50%', background: user.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', position: 'relative' } },
              user.avatar,
              React.createElement('div', { style: { position: 'absolute', bottom: '-1px', right: '-1px', width: '10px', height: '10px', borderRadius: '50%', background: isOnline ? '#2ed573' : '#888', border: '2px solid #1e1e3a' } })
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: '14px', fontWeight: '600', color: '#fff' } }, user.name + "'s Editor"),
              React.createElement('div', { style: { fontSize: '11px', color: isOnline ? '#2ed573' : '#888' } }, isOnline ? 'Online' : 'Offline')
            )
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
            isSyncing && React.createElement('span', { style: { fontSize: '11px', color: '#ffa502', animation: 'none' } }, 'Syncing...'),
            React.createElement('button', { style: { background: isOnline ? '#2a2a4a' : '#ff6b6b33', border: '1px solid ' + (isOnline ? '#3a3a5c' : '#ff6b6b'), borderRadius: '6px', color: isOnline ? '#888' : '#ff6b6b', cursor: 'pointer', padding: '4px 10px', fontSize: '11px' }, onClick: function() { setOnline(!isOnline); } }, isOnline ? 'Go Offline' : 'Go Online')
          )
        ),

        // Cursor indicator for OTHER user
        otherOnline && React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', padding: '4px 10px', background: other.color + '15', borderRadius: '6px', border: '1px solid ' + other.color + '30' } },
          React.createElement('div', { style: { width: '8px', height: '14px', background: other.color, borderRadius: '2px', animation: 'none' } }),
          React.createElement('span', { style: { fontSize: '11px', color: other.color } }, other.name + ' - Ln ' + otherLineCol.line + ', Col ' + otherLineCol.col)
        ),

        // Editor
        React.createElement('textarea', {
          style: Object.assign({}, inputStyle, {
            height: '280px', resize: 'vertical', fontFamily: "'Consolas', 'Monaco', monospace",
            fontSize: '14px', lineHeight: '1.6', background: '#0a0a1a',
            border: '1px solid ' + (isActive ? user.color + '40' : '#2a2a4a'),
            opacity: isOnline ? 1 : 0.5
          }),
          value: text,
          onChange: isOnline ? onChange : undefined,
          onSelect: onSelect,
          onClick: function() { setActiveEditor(userId); },
          readOnly: !isOnline,
          placeholder: isOnline ? 'Start typing...' : 'Offline - reconnect to edit'
        }),

        // Status bar
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#666' } },
          React.createElement('span', null, 'Ln ' + lineCol.line + ', Col ' + lineCol.col),
          React.createElement('span', null, wordCount + ' words \u00b7 ' + charCount + ' chars \u00b7 ' + lineCount + ' lines')
        )
      )
    );
  };

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '32px', fontWeight: '700', marginBottom: '8px', background: 'linear-gradient(90deg, #6c5ce7, #00cec9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Real-time Collaboration'),
    React.createElement('p', { style: { color: '#888', marginBottom: '24px' } }, 'Simulated collaborative editor - type in one panel, see changes in the other'),

    // Connected users bar
    React.createElement('div', { style: { display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' } },
      React.createElement('span', { style: { fontSize: '13px', color: '#888' } }, 'Connected users:'),
      users.map(function(u, i) {
        var isOnline = i === 0 ? online1 : online2;
        return React.createElement('div', { key: u.id, style: { display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: u.color + '15', borderRadius: '20px', border: '1px solid ' + u.color + '40' } },
          React.createElement('div', { style: { width: '8px', height: '8px', borderRadius: '50%', background: isOnline ? '#2ed573' : '#888' } }),
          React.createElement('span', { style: { fontSize: '13px', color: u.color } }, u.name)
        );
      }),
      syncing && React.createElement('span', { style: { fontSize: '12px', color: '#ffa502', marginLeft: 'auto' } }, '\u26a1 Syncing changes...')
    ),

    // Editors side by side
    React.createElement('div', { style: { display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' } },
      renderEditor(1, text1, handleChange1, handleSelect1, cursor1, pos1, pos2, users[1], online1, setOnline1, online2),
      renderEditor(2, text2, handleChange2, handleSelect2, cursor2, pos2, pos1, users[0], online2, setOnline2, online1)
    ),

    // Edit history log
    React.createElement('div', { style: Object.assign({}, cardStyle, { maxHeight: '200px', overflowY: 'auto' }) },
      React.createElement('h3', { style: { margin: '0 0 12px 0', color: '#a29bfe', fontSize: '15px' } }, 'Edit History'),
      history.map(function(entry) {
        var user = users[entry.user - 1];
        return React.createElement('div', { key: entry.id, style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: '1px solid #1a1a3a', fontSize: '13px' } },
          React.createElement('span', { style: { fontSize: '11px', color: '#555', minWidth: '90px' } }, entry.time),
          React.createElement('div', { style: { width: '22px', height: '22px', borderRadius: '50%', background: user.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '700', flexShrink: 0 } }, user.avatar),
          React.createElement('span', { style: { color: user.color, fontWeight: '600' } }, user.name),
          React.createElement('span', { style: { color: '#888' } }, entry.action)
        );
      })
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
