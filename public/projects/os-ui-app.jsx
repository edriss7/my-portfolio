const { useState, useCallback, useRef, useEffect } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '8px' };

var DESKTOP_ICONS = [
  { id: 'calculator', name: 'Calculator', icon: '\uD83E\uDDEE', x: 30, y: 30 },
  { id: 'notepad', name: 'Notepad', icon: '\uD83D\uDCDD', x: 30, y: 120 },
  { id: 'files', name: 'Files', icon: '\uD83D\uDCC1', x: 30, y: 210 }
];

var MOCK_FILES = [
  { name: 'Documents', type: 'folder', size: '--', modified: '2026-02-15' },
  { name: 'Pictures', type: 'folder', size: '--', modified: '2026-02-10' },
  { name: 'Downloads', type: 'folder', size: '--', modified: '2026-02-17' },
  { name: 'report.pdf', type: 'file', size: '2.4 MB', modified: '2026-02-16' },
  { name: 'notes.txt', type: 'file', size: '12 KB', modified: '2026-02-17' },
  { name: 'photo.png', type: 'file', size: '3.1 MB', modified: '2026-02-14' },
  { name: 'budget.xlsx', type: 'file', size: '156 KB', modified: '2026-02-12' },
  { name: 'presentation.pptx', type: 'file', size: '8.7 MB', modified: '2026-02-11' }
];

function App() {
  var _wins = useState([]), windows = _wins[0], setWindows = _wins[1];
  var _menu = useState(false), showMenu = _menu[0], setShowMenu = _menu[1];
  var _time = useState(new Date()), time = _time[0], setTime = _time[1];
  var _drag = useState(null), dragging = _drag[0], setDragging = _drag[1];
  var _zMax = useState(10), zMax = _zMax[0], setZMax = _zMax[1];
  var _calcDisp = useState('0'), calcDisp = _calcDisp[0], setCalcDisp = _calcDisp[1];
  var _calcPrev = useState(null), calcPrev = _calcPrev[0], setCalcPrev = _calcPrev[1];
  var _calcOp = useState(null), calcOp = _calcOp[0], setCalcOp = _calcOp[1];
  var _noteText = useState('Welcome to Notepad!\n\nStart typing here...'), noteText = _noteText[0], setNoteText = _noteText[1];
  var dragOffset = useRef({ x: 0, y: 0 });

  useEffect(function() {
    var timer = setInterval(function() { setTime(new Date()); }, 1000);
    return function() { clearInterval(timer); };
  }, []);

  var openWindow = useCallback(function(appId) {
    setShowMenu(false);
    var existing = windows.find(function(w) { return w.appId === appId; });
    if (existing) {
      setWindows(function(prev) { return prev.map(function(w) { return w.id === existing.id ? Object.assign({}, w, { minimized: false, zIndex: zMax + 1 }) : w; }); });
      setZMax(function(z) { return z + 1; });
      return;
    }
    var titles = { calculator: 'Calculator', notepad: 'Notepad', files: 'File Manager' };
    var sizes = { calculator: { w: 320, h: 420 }, notepad: { w: 500, h: 400 }, files: { w: 600, h: 420 } };
    var s = sizes[appId] || { w: 400, h: 350 };
    var newWin = { id: Date.now(), appId: appId, title: titles[appId] || appId, x: 100 + windows.length * 40, y: 60 + windows.length * 30, w: s.w, h: s.h, minimized: false, maximized: false, zIndex: zMax + 1 };
    setWindows(function(prev) { return prev.concat([newWin]); });
    setZMax(function(z) { return z + 1; });
  }, [windows, zMax]);

  var closeWindow = function(id) { setWindows(function(prev) { return prev.filter(function(w) { return w.id !== id; }); }); };
  var minimizeWindow = function(id) { setWindows(function(prev) { return prev.map(function(w) { return w.id === id ? Object.assign({}, w, { minimized: true }) : w; }); }); };
  var toggleMaximize = function(id) {
    setWindows(function(prev) { return prev.map(function(w) {
      if (w.id !== id) return w;
      if (w.maximized) return Object.assign({}, w, { maximized: false, x: w.prevX || 100, y: w.prevY || 60, w: w.prevW || 400, h: w.prevH || 350 });
      return Object.assign({}, w, { maximized: true, prevX: w.x, prevY: w.y, prevW: w.w, prevH: w.h, x: 0, y: 0, w: window.innerWidth, h: window.innerHeight - 48 });
    }); });
  };
  var focusWindow = function(id) {
    setWindows(function(prev) { return prev.map(function(w) { return w.id === id ? Object.assign({}, w, { zIndex: zMax + 1 }) : w; }); });
    setZMax(function(z) { return z + 1; });
  };

  var onMouseDown = function(id, e) {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    var win = windows.find(function(w) { return w.id === id; });
    if (!win || win.maximized) return;
    dragOffset.current = { x: e.clientX - win.x, y: e.clientY - win.y };
    setDragging(id);
    focusWindow(id);
  };

  useEffect(function() {
    if (dragging === null) return;
    var onMove = function(e) {
      setWindows(function(prev) { return prev.map(function(w) {
        if (w.id !== dragging) return w;
        return Object.assign({}, w, { x: Math.max(0, e.clientX - dragOffset.current.x), y: Math.max(0, e.clientY - dragOffset.current.y) });
      }); });
    };
    var onUp = function() { setDragging(null); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return function() { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging]);

  // Calculator logic
  var calcPress = function(val) {
    if (val === 'C') { setCalcDisp('0'); setCalcPrev(null); setCalcOp(null); return; }
    if (val === '=') {
      if (calcPrev !== null && calcOp) {
        var a = parseFloat(calcPrev), b = parseFloat(calcDisp), r = 0;
        if (calcOp === '+') r = a + b;
        else if (calcOp === '-') r = a - b;
        else if (calcOp === '\u00D7') r = a * b;
        else if (calcOp === '\u00F7') r = b !== 0 ? a / b : 'Error';
        setCalcDisp(String(typeof r === 'number' ? parseFloat(r.toFixed(8)) : r));
        setCalcPrev(null); setCalcOp(null);
      }
      return;
    }
    if (['+', '-', '\u00D7', '\u00F7'].indexOf(val) !== -1) {
      setCalcPrev(calcDisp); setCalcOp(val); setCalcDisp('0'); return;
    }
    if (val === '.') {
      if (calcDisp.indexOf('.') === -1) setCalcDisp(calcDisp + '.');
      return;
    }
    setCalcDisp(calcDisp === '0' ? val : calcDisp + val);
  };

  // Render app content
  var renderApp = function(appId) {
    if (appId === 'calculator') {
      var btns = ['7','8','9','\u00F7','4','5','6','\u00D7','1','2','3','-','C','0','.', '+'];
      return React.createElement('div', { style: { padding: '12px', height: '100%', display: 'flex', flexDirection: 'column' } },
        React.createElement('div', { style: { background: '#0d1117', borderRadius: '8px', padding: '12px 16px', marginBottom: '12px', textAlign: 'right', fontSize: '28px', fontFamily: 'monospace', color: '#8be9fd', minHeight: '44px', wordBreak: 'break-all' } }, calcDisp),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', flex: 1 } },
          btns.map(function(b) {
            var isOp = ['+', '-', '\u00D7', '\u00F7'].indexOf(b) !== -1;
            var isC = b === 'C';
            return React.createElement('button', { key: b, onClick: function() { calcPress(b); }, style: { borderRadius: '8px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', background: isC ? '#ff6b6b33' : isOp ? '#4a9eff33' : 'rgba(255,255,255,0.08)', color: isC ? '#ff6b6b' : isOp ? '#4a9eff' : '#e0e0e0' } }, b);
          }),
          React.createElement('button', { onClick: function() { calcPress('='); }, style: { gridColumn: 'span 4', borderRadius: '8px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', padding: '10px', background: '#00b894', color: '#fff' } }, '=')
        )
      );
    }
    if (appId === 'notepad') {
      return React.createElement('div', { style: { padding: '12px', height: '100%', display: 'flex', flexDirection: 'column' } },
        React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' } },
          ['File', 'Edit', 'Format', 'View', 'Help'].map(function(m) {
            return React.createElement('span', { key: m, style: { fontSize: '12px', color: '#888', cursor: 'pointer', padding: '2px 6px' } }, m);
          })
        ),
        React.createElement('textarea', {
          value: noteText, onChange: function(e) { setNoteText(e.target.value); },
          style: { flex: 1, background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e0e0e0', padding: '12px', fontSize: '14px', fontFamily: 'Consolas, monospace', resize: 'none', outline: 'none', lineHeight: '1.6' }
        }),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#666' } },
          React.createElement('span', null, 'Lines: ' + noteText.split('\n').length),
          React.createElement('span', null, 'Characters: ' + noteText.length)
        )
      );
    }
    if (appId === 'files') {
      return React.createElement('div', { style: { padding: '12px', height: '100%', display: 'flex', flexDirection: 'column' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', padding: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' } },
          React.createElement('span', { style: { fontSize: '12px', color: '#888' } }, '\uD83C\uDFE0'),
          React.createElement('span', { style: { fontSize: '12px', color: '#4a9eff' } }, 'Home'),
          React.createElement('span', { style: { fontSize: '12px', color: '#666' } }, ' / '),
          React.createElement('span', { style: { fontSize: '12px', color: '#aaa' } }, 'Files')
        ),
        React.createElement('div', { style: { flex: 1, overflowY: 'auto' } },
          React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' } },
            React.createElement('thead', null,
              React.createElement('tr', { style: { borderBottom: '1px solid rgba(255,255,255,0.1)' } },
                ['Name', 'Size', 'Modified'].map(function(h) {
                  return React.createElement('th', { key: h, style: { padding: '8px', textAlign: 'left', color: '#888', fontSize: '11px' } }, h);
                })
              )
            ),
            React.createElement('tbody', null,
              MOCK_FILES.map(function(f) {
                var icon = f.type === 'folder' ? '\uD83D\uDCC1' : f.name.endsWith('.pdf') ? '\uD83D\uDCC4' : f.name.endsWith('.txt') ? '\uD83D\uDCDD' : f.name.endsWith('.png') ? '\uD83D\uDDBC' : '\uD83D\uDCC4';
                return React.createElement('tr', { key: f.name, style: { borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' } },
                  React.createElement('td', { style: { padding: '8px' } }, icon + ' ' + f.name),
                  React.createElement('td', { style: { padding: '8px', color: '#888' } }, f.size),
                  React.createElement('td', { style: { padding: '8px', color: '#888' } }, f.modified)
                );
              })
            )
          )
        ),
        React.createElement('div', { style: { fontSize: '11px', color: '#666', marginTop: '8px' } }, MOCK_FILES.length + ' items')
      );
    }
    return null;
  };

  var timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  var dateStr = time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

  return React.createElement('div', { style: { height: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, sans-serif", overflow: 'hidden', position: 'relative', userSelect: dragging ? 'none' : 'auto' } },

    // Desktop area
    React.createElement('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: '48px', padding: '16px' } },
      React.createElement('a', { href: '/projects', style: Object.assign({}, backLinkStyle, { position: 'absolute', top: '8px', right: '16px', zIndex: 5 }) }, '\u2190 Back to Projects'),

      // Desktop icons
      DESKTOP_ICONS.map(function(icon) {
        return React.createElement('div', {
          key: icon.id,
          onDoubleClick: function() { openWindow(icon.id); },
          style: { position: 'absolute', left: icon.x + 'px', top: icon.y + 'px', width: '72px', textAlign: 'center', cursor: 'pointer', padding: '8px 4px', borderRadius: '8px' }
        },
          React.createElement('div', { style: { fontSize: '36px', marginBottom: '4px' } }, icon.icon),
          React.createElement('div', { style: { fontSize: '11px', color: '#ccc', textShadow: '0 1px 3px rgba(0,0,0,0.8)' } }, icon.name)
        );
      }),

      // Windows
      windows.map(function(win) {
        if (win.minimized) return null;
        return React.createElement('div', {
          key: win.id,
          onMouseDown: function() { focusWindow(win.id); },
          style: { position: 'absolute', left: win.x + 'px', top: win.y + 'px', width: win.w + 'px', height: win.h + 'px', background: 'linear-gradient(180deg, #1a1a3e, #0d0d20)', borderRadius: win.maximized ? '0' : '12px', border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden', zIndex: win.zIndex, display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }
        },
          // Title bar
          React.createElement('div', {
            onMouseDown: function(e) { onMouseDown(win.id, e); },
            style: { background: 'rgba(0,0,0,0.4)', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: dragging === win.id ? 'grabbing' : 'grab', flexShrink: 0 }
          },
            React.createElement('span', { style: { fontSize: '13px', fontWeight: '600' } }, win.title),
            React.createElement('div', { style: { display: 'flex', gap: '6px' } },
              React.createElement('button', { onClick: function(e) { e.stopPropagation(); minimizeWindow(win.id); }, style: { width: '14px', height: '14px', borderRadius: '50%', border: 'none', background: '#ffd93d', cursor: 'pointer', fontSize: '0', padding: 0 } }),
              React.createElement('button', { onClick: function(e) { e.stopPropagation(); toggleMaximize(win.id); }, style: { width: '14px', height: '14px', borderRadius: '50%', border: 'none', background: '#00b894', cursor: 'pointer', fontSize: '0', padding: 0 } }),
              React.createElement('button', { onClick: function(e) { e.stopPropagation(); closeWindow(win.id); }, style: { width: '14px', height: '14px', borderRadius: '50%', border: 'none', background: '#ff6b6b', cursor: 'pointer', fontSize: '0', padding: 0 } })
            )
          ),
          // Content
          React.createElement('div', { style: { flex: 1, overflow: 'auto' } }, renderApp(win.appId))
        );
      })
    ),

    // Start menu
    showMenu ? React.createElement('div', {
      onClick: function() { setShowMenu(false); },
      style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }
    },
      React.createElement('div', {
        onClick: function(e) { e.stopPropagation(); },
        style: { position: 'absolute', bottom: '52px', left: '8px', width: '280px', background: 'linear-gradient(180deg, #1a1a3e, #0d0d20)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', padding: '12px', zIndex: 999, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }
      },
        React.createElement('div', { style: { fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)' } }, 'Applications'),
        DESKTOP_ICONS.map(function(app) {
          return React.createElement('div', {
            key: app.id,
            onClick: function() { openWindow(app.id); },
            style: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px' }
          },
            React.createElement('span', { style: { fontSize: '24px' } }, app.icon),
            React.createElement('span', { style: { fontSize: '14px' } }, app.name)
          );
        }),
        React.createElement('div', { style: { borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '8px', paddingTop: '8px' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', cursor: 'pointer', color: '#888' } },
            React.createElement('span', { style: { fontSize: '20px' } }, '\u2699'),
            React.createElement('span', { style: { fontSize: '14px' } }, 'Settings')
          )
        )
      )
    ) : null,

    // Taskbar
    React.createElement('div', { style: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '48px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', padding: '0 8px', zIndex: 900 } },
      // Start button
      React.createElement('button', {
        onClick: function() { setShowMenu(!showMenu); },
        style: { width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: showMenu ? 'rgba(74,158,255,0.2)' : 'rgba(255,255,255,0.06)', color: '#4a9eff', cursor: 'pointer', fontSize: '18px', marginRight: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
      }, '\u2B22'),

      // Taskbar app buttons
      React.createElement('div', { style: { display: 'flex', gap: '4px', flex: 1 } },
        DESKTOP_ICONS.map(function(app) {
          var win = windows.find(function(w) { return w.appId === app.id; });
          var isOpen = !!win;
          return React.createElement('button', {
            key: app.id,
            onClick: function() {
              if (!isOpen) { openWindow(app.id); return; }
              if (win.minimized) {
                setWindows(function(prev) { return prev.map(function(w) { return w.id === win.id ? Object.assign({}, w, { minimized: false, zIndex: zMax + 1 }) : w; }); });
                setZMax(function(z) { return z + 1; });
              } else {
                minimizeWindow(win.id);
              }
            },
            style: { padding: '6px 12px', borderRadius: '6px', border: 'none', background: isOpen ? 'rgba(74,158,255,0.15)' : 'rgba(255,255,255,0.04)', color: '#e0e0e0', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: isOpen ? '2px solid #4a9eff' : '2px solid transparent' }
          },
            React.createElement('span', null, app.icon),
            React.createElement('span', null, app.name)
          );
        })
      ),

      // System tray
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto', paddingRight: '8px' } },
        React.createElement('span', { style: { fontSize: '14px' } }, '\uD83D\uDD0A'),
        React.createElement('span', { style: { fontSize: '14px' } }, '\uD83D\uDD0B'),
        React.createElement('span', { style: { fontSize: '14px' } }, '\uD83C\uDF10'),
        React.createElement('div', { style: { textAlign: 'right' } },
          React.createElement('div', { style: { fontSize: '12px', fontWeight: '600' } }, timeStr),
          React.createElement('div', { style: { fontSize: '10px', color: '#888' } }, dateStr)
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
