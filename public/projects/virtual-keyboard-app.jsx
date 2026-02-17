const { useState, useCallback } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'inline-block' };

var ROWS_LOWER = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
];

var ROWS_UPPER = [
  ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|'],
  ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'Shift'],
  ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
];

function App() {
  var _t = useState(''), text = _t[0], setText = _t[1];
  var _s = useState(false), shift = _s[0], setShift = _s[1];
  var _c = useState(false), capsLock = _c[0], setCapsLock = _c[1];
  var _p = useState(null), pressed = _p[0], setPressed = _p[1];
  var _f = useState(false), flash = _f[0], setFlash = _f[1];

  var isUpper = (shift && !capsLock) || (!shift && capsLock);
  var rows = isUpper ? ROWS_UPPER : ROWS_LOWER;

  var doFlash = useCallback(function() {
    setFlash(true);
    setTimeout(function() { setFlash(false); }, 100);
  }, []);

  var handleKey = useCallback(function(key) {
    setPressed(key);
    doFlash();
    setTimeout(function() { setPressed(null); }, 150);

    if (key === 'Backspace') {
      setText(function(t) { return t.slice(0, -1); });
    } else if (key === 'Space') {
      setText(function(t) { return t + ' '; });
    } else if (key === 'Enter') {
      setText(function(t) { return t + '\n'; });
    } else if (key === 'Tab') {
      setText(function(t) { return t + '    '; });
    } else if (key === 'Shift') {
      setShift(function(s) { return !s; });
    } else if (key === 'CapsLock') {
      setCapsLock(function(c) { return !c; });
    } else if (key === 'Ctrl' || key === 'Alt') {
      // no-op
    } else {
      setText(function(t) { return t + key; });
      if (shift) setShift(false);
    }
  }, [shift, capsLock, doFlash]);

  var getKeyWidth = function(key) {
    if (key === 'Backspace') return '110px';
    if (key === 'Tab') return '80px';
    if (key === 'CapsLock') return '90px';
    if (key === 'Enter') return '100px';
    if (key === 'Shift') return '110px';
    if (key === 'Space') return '340px';
    if (key === 'Ctrl') return '70px';
    if (key === 'Alt') return '60px';
    return '48px';
  };

  var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)', color: '#e2e8f0', fontFamily: "'Segoe UI', sans-serif", padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' };

  var keyboardStyle = { background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '16px', padding: '20px', border: '1px solid #334155', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', maxWidth: '800px', width: '100%' };

  var textAreaStyle = { width: '100%', maxWidth: '800px', minHeight: '150px', background: 'rgba(15,23,42,0.9)', border: '2px solid #334155', borderRadius: '12px', color: '#e2e8f0', padding: '16px', fontSize: '16px', fontFamily: 'monospace', resize: 'vertical', outline: 'none', marginBottom: '20px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', boxSizing: 'border-box' };

  var renderKey = function(key, rowIdx, keyIdx) {
    var isPressed = pressed === key;
    var isActive = (key === 'CapsLock' && capsLock) || (key === 'Shift' && shift);
    var displayLabel = key;
    if (key === 'Backspace') displayLabel = '\u232B';
    if (key === 'Space') displayLabel = '';
    if (key === 'Enter') displayLabel = '\u21B5';
    if (key === 'Tab') displayLabel = '\u21E5';

    var bg = isPressed ? '#6366f1' : isActive ? '#4f46e5' : 'linear-gradient(145deg, #334155, #1e293b)';
    var transform = isPressed ? 'scale(0.95)' : 'scale(1)';

    return React.createElement('button', {
      key: rowIdx + '-' + keyIdx,
      onClick: function() { handleKey(key); },
      style: {
        width: getKeyWidth(key), height: '48px', background: bg, border: '1px solid ' + (isActive ? '#818cf8' : '#475569'),
        borderRadius: '8px', color: isActive ? '#c7d2fe' : '#e2e8f0', fontSize: key.length === 1 ? '16px' : '11px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif",
        transition: 'all 0.1s', transform: transform, boxShadow: isPressed ? 'inset 0 2px 4px rgba(0,0,0,0.5)' : '0 2px 4px rgba(0,0,0,0.3)',
        fontWeight: key.length === 1 ? 'bold' : 'normal'
      }
    }, displayLabel);
  };

  var indicators = React.createElement('div', {
    style: { display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '10px' }
  }, [
    React.createElement('div', { key: 'caps', style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
      React.createElement('div', { key: 'dot', style: { width: '8px', height: '8px', borderRadius: '50%', background: capsLock ? '#22c55e' : '#334155', boxShadow: capsLock ? '0 0 8px #22c55e' : 'none' } }),
      React.createElement('span', { key: 'l', style: { fontSize: '11px', color: '#94a3b8' } }, 'CAPS')
    ]),
    React.createElement('div', { key: 'shift', style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
      React.createElement('div', { key: 'dot', style: { width: '8px', height: '8px', borderRadius: '50%', background: shift ? '#fbbf24' : '#334155', boxShadow: shift ? '0 0 8px #fbbf24' : 'none' } }),
      React.createElement('span', { key: 'l', style: { fontSize: '11px', color: '#94a3b8' } }, 'SHIFT')
    ]),
    React.createElement('div', { key: 'sound', style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
      React.createElement('div', { key: 'dot', style: { width: '8px', height: '8px', borderRadius: '50%', background: flash ? '#8b5cf6' : '#334155', boxShadow: flash ? '0 0 12px #8b5cf6' : 'none', transition: 'all 0.1s' } }),
      React.createElement('span', { key: 'l', style: { fontSize: '11px', color: '#94a3b8' } }, 'CLICK')
    ])
  ]);

  var charCount = React.createElement('div', { style: { textAlign: 'right', fontSize: '12px', color: '#64748b', maxWidth: '800px', width: '100%', marginBottom: '5px' } }, text.length + ' characters');

  return React.createElement('div', { style: containerStyle }, [
    React.createElement('a', { key: 'back', href: '/projects', style: Object.assign({}, backLinkStyle, { alignSelf: 'flex-start' }) }, '\u2190 Back to Projects'),
    React.createElement('h1', { key: 'title', style: { fontSize: '28px', fontWeight: 'bold', color: '#818cf8', marginBottom: '20px' } }, 'Virtual Keyboard'),
    React.createElement('div', { key: 'textarea', style: textAreaStyle }, text || React.createElement('span', { style: { color: '#475569' } }, 'Click the keys below to start typing...')),
    React.createElement('div', { key: 'cc', style: { width: '100%', maxWidth: '800px' } }, charCount),
    React.createElement('div', { key: 'kb', style: keyboardStyle }, [
      indicators,
      React.createElement('div', { key: 'rows', style: { display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' } },
        rows.map(function(row, ri) {
          return React.createElement('div', { key: ri, style: { display: 'flex', gap: '4px', justifyContent: 'center' } },
            row.map(function(key, ki) { return renderKey(key, ri, ki); })
          );
        })
      )
    ]),
    React.createElement('div', { key: 'actions', style: { marginTop: '15px', display: 'flex', gap: '10px' } }, [
      React.createElement('button', { key: 'clear', onClick: function() { setText(''); }, style: { padding: '8px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' } }, 'Clear Text'),
      React.createElement('button', { key: 'copy', onClick: function() { if (navigator.clipboard) navigator.clipboard.writeText(text); }, style: { padding: '8px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' } }, 'Copy Text')
    ])
  ]);
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
