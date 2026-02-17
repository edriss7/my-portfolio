const { useState, useCallback, useMemo } = React;

var INITIAL_STATES = [
  { id: 1, name: 'Red', x: 200, y: 100, color: '#ff4444' },
  { id: 2, name: 'Green', x: 500, y: 100, color: '#44ff44' },
  { id: 3, name: 'Yellow', x: 350, y: 300, color: '#ffdd44' }
];

var INITIAL_TRANSITIONS = [
  { from: 1, to: 2, label: 'timer' },
  { from: 2, to: 3, label: 'timer' },
  { from: 3, to: 1, label: 'timer' }
];

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'inline-block' };

function App() {
  var _s = useState(INITIAL_STATES), states = _s[0], setStates = _s[1];
  var _t = useState(INITIAL_TRANSITIONS), transitions = _t[0], setTransitions = _t[1];
  var _c = useState(1), currentState = _c[0], setCurrentState = _c[1];
  var _e = useState(null), editing = _e[0], setEditing = _e[1];
  var _n = useState(''), newName = _n[0], setNewName = _n[1];
  var _r = useState(false), running = _r[0], setRunning = _r[1];
  var _h = useState([]), history = _h[0], setHistory = _h[1];
  var _af = useState(null), addFrom = _af[0], setAddFrom = _af[1];
  var _al = useState(''), addLabel = _al[0], setAddLabel = _al[1];
  var _nid = useState(4), nextId = _nid[0], setNextId = _nid[1];

  var step = useCallback(function() {
    var tr = transitions.filter(function(t) { return t.from === currentState; });
    if (tr.length > 0) {
      var next = tr[0];
      setHistory(function(h) { return h.concat([{ from: next.from, to: next.to, label: next.label }]); });
      setCurrentState(next.to);
    }
  }, [currentState, transitions]);

  var reset = useCallback(function() {
    setCurrentState(1);
    setHistory([]);
    setRunning(false);
  }, []);

  var addState = useCallback(function() {
    var id = nextId;
    setNextId(id + 1);
    var colors = ['#ff6b9d', '#c084fc', '#67e8f9', '#fbbf24', '#a3e635'];
    setStates(function(s) {
      return s.concat([{ id: id, name: 'State ' + id, x: 100 + Math.random() * 400, y: 80 + Math.random() * 300, color: colors[id % colors.length] }]);
    });
  }, [nextId]);

  var removeState = useCallback(function(id) {
    setStates(function(s) { return s.filter(function(st) { return st.id !== id; }); });
    setTransitions(function(t) { return t.filter(function(tr) { return tr.from !== id && tr.to !== id; }); });
    if (currentState === id) setCurrentState(states.length > 1 ? states[0].id : 0);
  }, [currentState, states]);

  var startEdit = useCallback(function(id) {
    var st = states.find(function(s) { return s.id === id; });
    setEditing(id);
    setNewName(st ? st.name : '');
  }, [states]);

  var saveEdit = useCallback(function() {
    setStates(function(s) { return s.map(function(st) { return st.id === editing ? Object.assign({}, st, { name: newName }) : st; }); });
    setEditing(null);
  }, [editing, newName]);

  var addTransition = useCallback(function(toId) {
    if (addFrom !== null && addFrom !== toId) {
      setTransitions(function(t) { return t.concat([{ from: addFrom, to: toId, label: addLabel || 'go' }]); });
    }
    setAddFrom(null);
    setAddLabel('');
  }, [addFrom, addLabel]);

  React.useEffect(function() {
    if (!running) return;
    var iv = setInterval(step, 1500);
    return function() { clearInterval(iv); };
  }, [running, step]);

  var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)', color: '#e2e8f0', fontFamily: 'monospace', padding: '20px' };
  var titleStyle = { fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', color: '#c084fc' };
  var canvasStyle = { position: 'relative', width: '100%', height: '450px', border: '1px solid #334155', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', marginBottom: '20px', overflow: 'hidden' };
  var btnStyle = function(bg) { return { padding: '8px 16px', background: bg || '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', margin: '0 5px', fontSize: '13px' }; };

  var renderArrow = function(tr, idx) {
    var fromSt = states.find(function(s) { return s.id === tr.from; });
    var toSt = states.find(function(s) { return s.id === tr.to; });
    if (!fromSt || !toSt) return null;
    var dx = toSt.x - fromSt.x;
    var dy = toSt.y - fromSt.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return null;
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
    var mx = (fromSt.x + toSt.x) / 2;
    var my = (fromSt.y + toSt.y) / 2;
    return React.createElement('div', { key: 'tr-' + idx }, [
      React.createElement('div', {
        key: 'line',
        style: { position: 'absolute', left: fromSt.x + 30 + 'px', top: fromSt.y + 30 + 'px', width: (dist - 60) + 'px', height: '2px', background: currentState === tr.from ? '#fbbf24' : '#64748b', transform: 'rotate(' + angle + 'deg)', transformOrigin: '0 0', zIndex: 1 }
      }),
      React.createElement('div', {
        key: 'arrow',
        style: { position: 'absolute', left: (toSt.x + 30 - 25 * dx / dist) + 'px', top: (toSt.y + 30 - 25 * dy / dist) + 'px', color: '#fbbf24', fontSize: '16px', transform: 'rotate(' + angle + 'deg)', zIndex: 2 }
      }, '\u25B6'),
      React.createElement('div', {
        key: 'label',
        style: { position: 'absolute', left: mx + 'px', top: (my - 18) + 'px', background: '#1e293b', color: '#94a3b8', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', zIndex: 3, whiteSpace: 'nowrap' }
      }, tr.label)
    ]);
  };

  var renderState = function(st) {
    var isCurrent = currentState === st.id;
    var isEditing = editing === st.id;
    return React.createElement('div', {
      key: st.id,
      onClick: function() {
        if (addFrom !== null) { addTransition(st.id); return; }
        if (!isEditing) startEdit(st.id);
      },
      style: {
        position: 'absolute', left: (st.x) + 'px', top: (st.y) + 'px', width: '60px', height: '60px',
        borderRadius: '50%', background: isCurrent ? st.color : 'rgba(100,100,140,0.4)',
        border: '3px solid ' + (isCurrent ? '#fff' : st.color), display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', zIndex: 10, flexDirection: 'column', boxShadow: isCurrent ? '0 0 20px ' + st.color : 'none',
        transition: 'all 0.3s'
      }
    }, [
      isEditing ? React.createElement('input', {
        key: 'inp', value: newName, onChange: function(e) { setNewName(e.target.value); },
        onKeyDown: function(e) { if (e.key === 'Enter') saveEdit(); },
        onBlur: saveEdit,
        autoFocus: true,
        style: { width: '50px', background: 'transparent', border: 'none', color: '#fff', textAlign: 'center', fontSize: '10px', outline: 'none' }
      }) : React.createElement('span', { key: 'name', style: { fontSize: '11px', color: '#fff', fontWeight: 'bold' } }, st.name),
      React.createElement('button', {
        key: 'del',
        onClick: function(e) { e.stopPropagation(); removeState(st.id); },
        style: { position: 'absolute', top: '-8px', right: '-8px', width: '18px', height: '18px', borderRadius: '50%', background: '#ef4444', border: 'none', color: '#fff', fontSize: '10px', cursor: 'pointer', lineHeight: '18px', padding: 0 }
      }, '\u00D7')
    ]);
  };

  var historyPanel = React.createElement('div', {
    style: { maxHeight: '120px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '10px', fontSize: '12px' }
  }, [
    React.createElement('div', { key: 'ht', style: { color: '#94a3b8', marginBottom: '5px', fontWeight: 'bold' } }, 'Transition History'),
    history.length === 0 ? React.createElement('div', { key: 'empty', style: { color: '#475569' } }, 'No transitions yet') : null
  ].concat(history.map(function(h, i) {
    var fromN = states.find(function(s) { return s.id === h.from; });
    var toN = states.find(function(s) { return s.id === h.to; });
    return React.createElement('div', { key: i, style: { color: '#67e8f9', padding: '2px 0' } },
      (fromN ? fromN.name : '?') + ' --[' + h.label + ']--> ' + (toN ? toN.name : '?'));
  })));

  var addTransPanel = React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }
  }, [
    addFrom !== null ?
      React.createElement('span', { key: 'msg', style: { color: '#fbbf24', fontSize: '13px' } }, 'Click a target state to connect...') :
      React.createElement('div', { key: 'controls', style: { display: 'flex', gap: '8px', alignItems: 'center' } }, [
        React.createElement('span', { key: 'l', style: { color: '#94a3b8', fontSize: '13px' } }, 'Add transition: '),
        React.createElement('select', {
          key: 'sel',
          onChange: function(e) { if (e.target.value) { setAddFrom(Number(e.target.value)); } },
          value: '',
          style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '4px', padding: '4px' }
        }, [React.createElement('option', { key: 'p', value: '' }, 'From...')].concat(
          states.map(function(s) { return React.createElement('option', { key: s.id, value: s.id }, s.name); })
        )),
        React.createElement('input', {
          key: 'lab',
          placeholder: 'label',
          value: addLabel,
          onChange: function(e) { setAddLabel(e.target.value); },
          style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '4px', padding: '4px', width: '80px' }
        })
      ])
  ]);

  return React.createElement('div', { style: containerStyle }, [
    React.createElement('a', { key: 'back', href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { key: 'title', style: titleStyle }, 'State Machine Visualizer'),
    React.createElement('div', { key: 'info', style: { color: '#94a3b8', marginBottom: '15px', fontSize: '13px' } },
      'Traffic Light FSM \u2014 Click states to rename. Current: ' + (states.find(function(s) { return s.id === currentState; }) || {}).name),
    React.createElement('div', { key: 'btns', style: { marginBottom: '15px', display: 'flex', gap: '8px', flexWrap: 'wrap' } }, [
      React.createElement('button', { key: 'step', onClick: step, style: btnStyle('#6366f1') }, 'Step'),
      React.createElement('button', { key: 'run', onClick: function() { setRunning(!running); }, style: btnStyle(running ? '#ef4444' : '#22c55e') }, running ? 'Stop' : 'Auto Run'),
      React.createElement('button', { key: 'rst', onClick: reset, style: btnStyle('#64748b') }, 'Reset'),
      React.createElement('button', { key: 'add', onClick: addState, style: btnStyle('#8b5cf6') }, '+ Add State')
    ]),
    React.createElement('div', { key: 'canvas', style: canvasStyle },
      transitions.map(renderArrow).concat(states.map(renderState))
    ),
    addTransPanel,
    React.createElement('div', { key: 'hist', style: { marginTop: '15px' } }, historyPanel)
  ]);
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
