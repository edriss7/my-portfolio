const { useState, useCallback } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'inline-block' };

var LEVEL_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4', '#a855f7'];

var INITIAL_NODES = {
  id: 'root', text: 'Main Idea', x: 400, y: 300, collapsed: false,
  children: [
    { id: 'c1', text: 'Design', x: 180, y: 150, collapsed: false, children: [
      { id: 'c1a', text: 'Colors', x: 50, y: 80, collapsed: false, children: [] },
      { id: 'c1b', text: 'Layout', x: 50, y: 200, collapsed: false, children: [] }
    ]},
    { id: 'c2', text: 'Development', x: 620, y: 150, collapsed: false, children: [
      { id: 'c2a', text: 'Frontend', x: 750, y: 80, collapsed: false, children: [] },
      { id: 'c2b', text: 'Backend', x: 750, y: 200, collapsed: false, children: [] }
    ]},
    { id: 'c3', text: 'Marketing', x: 180, y: 450, collapsed: false, children: [
      { id: 'c3a', text: 'Social', x: 50, y: 420, collapsed: false, children: [] }
    ]},
    { id: 'c4', text: 'Research', x: 620, y: 450, collapsed: false, children: [] }
  ]
};

var nextIdNum = 100;

function App() {
  var _tree = useState(INITIAL_NODES), tree = _tree[0], setTree = _tree[1];
  var _sel = useState(null), selectedId = _sel[0], setSelectedId = _sel[1];
  var _ed = useState(null), editingId = _ed[0], setEditingId = _ed[1];
  var _et = useState(''), editText = _et[0], setEditText = _et[1];
  var _mv = useState(null), moving = _mv[0], setMoving = _mv[1];

  var findNode = function(node, id) {
    if (node.id === id) return node;
    for (var i = 0; i < node.children.length; i++) {
      var found = findNode(node.children[i], id);
      if (found) return found;
    }
    return null;
  };

  var findParent = function(node, id) {
    for (var i = 0; i < node.children.length; i++) {
      if (node.children[i].id === id) return node;
      var found = findParent(node.children[i], id);
      if (found) return found;
    }
    return null;
  };

  var deepClone = function(obj) { return JSON.parse(JSON.stringify(obj)); };

  var updateNode = useCallback(function(updater) {
    setTree(function(t) {
      var clone = deepClone(t);
      updater(clone);
      return clone;
    });
  }, []);

  var addChild = useCallback(function(parentId) {
    nextIdNum++;
    var newId = 'n' + nextIdNum;
    updateNode(function(root) {
      var parent = findNode(root, parentId);
      if (parent) {
        var angle = (parent.children.length * 0.8) - 0.8;
        parent.children.push({
          id: newId, text: 'New Node', x: parent.x + 120 * Math.cos(angle), y: parent.y + 100 * Math.sin(angle),
          collapsed: false, children: []
        });
        parent.collapsed = false;
      }
    });
  }, [updateNode]);

  var deleteNode = useCallback(function(nodeId) {
    if (nodeId === 'root') return;
    updateNode(function(root) {
      var parent = findParent(root, nodeId);
      if (parent) {
        parent.children = parent.children.filter(function(c) { return c.id !== nodeId; });
      }
    });
    setSelectedId(null);
  }, [updateNode]);

  var startEdit = useCallback(function(id) {
    var node = findNode(tree, id);
    if (node) { setEditingId(id); setEditText(node.text); }
  }, [tree]);

  var saveEdit = useCallback(function() {
    if (editingId) {
      updateNode(function(root) {
        var node = findNode(root, editingId);
        if (node) node.text = editText;
      });
      setEditingId(null);
    }
  }, [editingId, editText, updateNode]);

  var toggleCollapse = useCallback(function(id) {
    updateNode(function(root) {
      var node = findNode(root, id);
      if (node) node.collapsed = !node.collapsed;
    });
  }, [updateNode]);

  var handleCanvasClick = useCallback(function(e) {
    if (moving) {
      var rect = e.currentTarget.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      updateNode(function(root) {
        var node = findNode(root, moving);
        if (node) { node.x = x; node.y = y; }
      });
      setMoving(null);
    }
  }, [moving, updateNode]);

  var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)', color: '#e2e8f0', fontFamily: "'Segoe UI', sans-serif", padding: '20px' };
  var canvasStyle = { position: 'relative', width: '100%', height: '600px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden', cursor: moving ? 'crosshair' : 'default' };

  var renderConnection = function(parent, child, level) {
    var dx = child.x - parent.x;
    var dy = child.y - parent.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
    var color = LEVEL_COLORS[level % LEVEL_COLORS.length];
    return React.createElement('div', {
      key: 'conn-' + parent.id + '-' + child.id,
      style: {
        position: 'absolute', left: parent.x + 'px', top: parent.y + 'px',
        width: dist + 'px', height: '2px', background: color + '66',
        transform: 'rotate(' + angle + 'deg)', transformOrigin: '0 0', zIndex: 1
      }
    });
  };

  var elements = [];
  var renderTree = function(node, level) {
    var isSel = selectedId === node.id;
    var isEdit = editingId === node.id;
    var color = LEVEL_COLORS[level % LEVEL_COLORS.length];
    var nodeSize = level === 0 ? { minWidth: '120px', padding: '12px 20px', fontSize: '16px' } : { minWidth: '80px', padding: '8px 14px', fontSize: '13px' };

    elements.push(React.createElement('div', {
      key: node.id,
      onClick: function(e) { e.stopPropagation(); setSelectedId(node.id); },
      onDoubleClick: function(e) { e.stopPropagation(); startEdit(node.id); },
      style: Object.assign({
        position: 'absolute', left: node.x + 'px', top: node.y + 'px', transform: 'translate(-50%, -50%)',
        background: isSel ? color : color + '33', border: '2px solid ' + color,
        borderRadius: level === 0 ? '50%' : '20px', color: '#fff', textAlign: 'center',
        cursor: 'pointer', zIndex: 10, boxShadow: isSel ? '0 0 20px ' + color + '88' : 'none',
        transition: 'box-shadow 0.2s', whiteSpace: 'nowrap'
      }, nodeSize)
    }, [
      isEdit ? React.createElement('input', {
        key: 'inp', autoFocus: true, value: editText,
        onChange: function(e) { setEditText(e.target.value); },
        onBlur: saveEdit,
        onKeyDown: function(e) { if (e.key === 'Enter') saveEdit(); },
        onClick: function(e) { e.stopPropagation(); },
        style: { background: 'transparent', border: 'none', color: '#fff', textAlign: 'center', fontSize: 'inherit', outline: 'none', width: '80px' }
      }) : React.createElement('span', { key: 'text' }, node.text),
      node.children.length > 0 ? React.createElement('div', {
        key: 'toggle',
        onClick: function(e) { e.stopPropagation(); toggleCollapse(node.id); },
        style: { position: 'absolute', bottom: '-10px', right: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: '#1e293b', border: '1px solid ' + color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', cursor: 'pointer', color: '#e2e8f0' }
      }, node.collapsed ? '+' : '\u2212') : null
    ]));

    if (!node.collapsed) {
      node.children.forEach(function(child) {
        elements.push(renderConnection(node, child, level + 1));
        renderTree(child, level + 1);
      });
    }
  };

  renderTree(tree, 0);

  var toolbarStyle = { display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' };
  var btnStyle = function(bg) { return { padding: '8px 14px', background: bg, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }; };

  return React.createElement('div', { style: containerStyle }, [
    React.createElement('a', { key: 'back', href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { key: 'title', style: { fontSize: '28px', fontWeight: 'bold', color: '#ec4899', marginBottom: '10px' } }, 'Mind Map'),
    React.createElement('p', { key: 'info', style: { color: '#94a3b8', fontSize: '13px', marginBottom: '15px' } },
      'Click to select, double-click to edit.' + (moving ? ' Click canvas to place node.' : '') + (selectedId ? ' Selected: ' + (findNode(tree, selectedId) || {}).text : '')),
    React.createElement('div', { key: 'toolbar', style: toolbarStyle }, [
      React.createElement('button', { key: 'add', onClick: function() { if (selectedId) addChild(selectedId); }, disabled: !selectedId, style: btnStyle(selectedId ? '#22c55e' : '#334155') }, '+ Add Child'),
      React.createElement('button', { key: 'del', onClick: function() { if (selectedId) deleteNode(selectedId); }, disabled: !selectedId || selectedId === 'root', style: btnStyle(selectedId && selectedId !== 'root' ? '#ef4444' : '#334155') }, 'Delete'),
      React.createElement('button', { key: 'move', onClick: function() { if (selectedId) setMoving(selectedId); }, disabled: !selectedId, style: btnStyle(moving ? '#fbbf24' : (selectedId ? '#8b5cf6' : '#334155')) }, moving ? 'Click to place...' : 'Move Node'),
      React.createElement('button', { key: 'reset', onClick: function() { setTree(deepClone(INITIAL_NODES)); setSelectedId(null); }, style: btnStyle('#64748b') }, 'Reset')
    ]),
    React.createElement('div', { key: 'canvas', style: canvasStyle, onClick: handleCanvasClick }, elements)
  ]);
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
