const { useState, useRef, useCallback } = React;

var initialItems = [
  { id: 1, text: 'Review pull requests', color: '#bd93f9' },
  { id: 2, text: 'Update documentation', color: '#ff79c6' },
  { id: 3, text: 'Fix navigation bug', color: '#50fa7b' },
  { id: 4, text: 'Deploy to staging', color: '#8be9fd' },
  { id: 5, text: 'Write unit tests', color: '#ffb86c' },
  { id: 6, text: 'Design new landing page', color: '#f1fa8c' },
  { id: 7, text: 'Optimize database queries', color: '#ff5555' }
];

var nextId = 100;

function App() {
  var _s = useState(initialItems);
  var items = _s[0]; var setItems = _s[1];
  var _s2 = useState(null);
  var dragIdx = _s2[0]; var setDragIdx = _s2[1];
  var _s3 = useState(null);
  var overIdx = _s3[0]; var setOverIdx = _s3[1];
  var _s4 = useState('');
  var newText = _s4[0]; var setNewText = _s4[1];
  var dragStartY = useRef(0);
  var dragging = useRef(false);

  var colors = ['#bd93f9', '#ff79c6', '#50fa7b', '#8be9fd', '#ffb86c', '#f1fa8c', '#ff5555'];

  var addItem = function() {
    if (!newText.trim()) return;
    var item = { id: nextId++, text: newText.trim(), color: colors[items.length % colors.length] };
    setItems(function(prev) { return prev.concat([item]); });
    setNewText('');
  };

  var removeItem = function(id) {
    setItems(function(prev) { return prev.filter(function(it) { return it.id !== id; }); });
  };

  var handleDragStart = function(e, idx) {
    setDragIdx(idx);
    dragStartY.current = e.clientY || (e.touches && e.touches[0].clientY);
    dragging.current = true;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', '');
    }
  };

  var handleDragOver = function(e, idx) {
    e.preventDefault();
    if (dragIdx === null) return;
    setOverIdx(idx);
  };

  var handleDrop = function(e, idx) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    setItems(function(prev) {
      var arr = prev.slice();
      var dragged = arr.splice(dragIdx, 1)[0];
      arr.splice(idx, 0, dragged);
      return arr;
    });
    setDragIdx(null);
    setOverIdx(null);
  };

  var handleDragEnd = function() {
    setDragIdx(null);
    setOverIdx(null);
    dragging.current = false;
  };

  var containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px'
  };
  var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };

  var listStyle = { maxWidth: '500px', margin: '0 auto' };

  var addBarStyle = {
    display: 'flex', gap: '10px', marginBottom: '20px'
  };

  var inputStyle = {
    flex: 1, padding: '12px 14px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px', color: '#e0e0e0', fontSize: '14px', outline: 'none'
  };

  var addBtnStyle = {
    padding: '12px 20px', background: 'linear-gradient(135deg, #bd93f9, #ff79c6)',
    border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold',
    cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap'
  };

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { textAlign: 'center', fontSize: '28px', color: '#fff', marginBottom: '8px' } }, 'Drag & Drop List'),
    React.createElement('p', { style: { textAlign: 'center', color: '#888', fontSize: '14px', marginBottom: '24px' } },
      items.length + ' items \u2022 Drag to reorder'
    ),
    React.createElement('div', { style: listStyle },
      React.createElement('div', { style: addBarStyle },
        React.createElement('input', {
          value: newText,
          onChange: function(e) { setNewText(e.target.value); },
          onKeyDown: function(e) { if (e.key === 'Enter') addItem(); },
          placeholder: 'Add new item...',
          style: inputStyle
        }),
        React.createElement('button', { onClick: addItem, style: addBtnStyle }, '+ Add')
      ),
      items.length === 0 && React.createElement('div', { style: {
        textAlign: 'center', padding: '40px', color: '#666',
        background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
        border: '2px dashed rgba(255,255,255,0.1)'
      } }, 'No items yet. Add some above!'),
      items.map(function(item, idx) {
        var isDragging = dragIdx === idx;
        var isOver = overIdx === idx && dragIdx !== null && dragIdx !== idx;
        var itemStyle = {
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 16px',
          background: isDragging ? 'rgba(189,147,249,0.15)' : 'rgba(255,255,255,0.05)',
          borderRadius: '10px',
          marginBottom: '8px',
          border: isOver ? '2px solid #bd93f9' : '2px solid transparent',
          opacity: isDragging ? 0.5 : 1,
          transform: isOver ? 'scale(1.02)' : 'scale(1)',
          transition: 'transform 0.15s, border-color 0.15s, opacity 0.15s',
          cursor: 'default',
          boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
          userSelect: 'none'
        };

        var handleStyle = {
          cursor: 'grab',
          color: '#666',
          fontSize: '18px',
          padding: '0 4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          lineHeight: '1',
          userSelect: 'none',
          letterSpacing: '2px'
        };

        return React.createElement('div', {
          key: item.id,
          draggable: true,
          onDragStart: function(e) { handleDragStart(e, idx); },
          onDragOver: function(e) { handleDragOver(e, idx); },
          onDrop: function(e) { handleDrop(e, idx); },
          onDragEnd: handleDragEnd,
          style: itemStyle
        },
          React.createElement('div', { style: handleStyle },
            React.createElement('span', null, '\u2261')
          ),
          React.createElement('div', { style: {
            width: '4px', height: '32px', borderRadius: '2px',
            background: item.color, flexShrink: 0
          } }),
          React.createElement('span', { style: { flex: 1, fontSize: '14px', color: '#ddd' } }, item.text),
          React.createElement('span', { style: {
            fontSize: '11px', color: '#555', padding: '2px 8px',
            background: 'rgba(255,255,255,0.05)', borderRadius: '4px'
          } }, '#' + (idx + 1)),
          React.createElement('button', {
            onClick: function(e) { e.stopPropagation(); removeItem(item.id); },
            style: {
              background: 'none', border: 'none', color: '#555',
              cursor: 'pointer', fontSize: '16px', padding: '2px 6px',
              borderRadius: '4px', transition: 'color 0.15s'
            },
            onMouseEnter: function(e) { e.target.style.color = '#ff5555'; },
            onMouseLeave: function(e) { e.target.style.color = '#555'; }
          }, '\u00D7')
        );
      })
    ),
    React.createElement('div', { style: {
      maxWidth: '500px', margin: '20px auto',
      padding: '14px', background: 'rgba(255,255,255,0.03)',
      borderRadius: '8px', textAlign: 'center'
    } },
      React.createElement('span', { style: { fontSize: '12px', color: '#555' } },
        'Grab the \u2261 handle to drag and reorder items'
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
