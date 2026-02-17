const { useState, useCallback, useRef, useEffect } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
var baseStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', sans-serif", padding: '24px' };
var inputStyle = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px 10px', color: '#e0e0e0', fontSize: '13px', boxSizing: 'border-box' };
var btnStyle = function (c) { return { background: c || '#8be9fd', color: '#0a0a1a', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }; };
var cardStyle = { background: 'rgba(255,255,255,0.07)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)' };

var fieldTypes = ['INT', 'VARCHAR(255)', 'TEXT', 'BOOLEAN', 'DATE', 'TIMESTAMP', 'FLOAT', 'UUID'];

var initialTables = [
  { id: 1, name: 'users', x: 60, y: 80, fields: [
    { id: 1, name: 'id', type: 'INT', pk: true },
    { id: 2, name: 'username', type: 'VARCHAR(255)', pk: false },
    { id: 3, name: 'email', type: 'VARCHAR(255)', pk: false },
    { id: 4, name: 'created_at', type: 'TIMESTAMP', pk: false }
  ]},
  { id: 2, name: 'posts', x: 400, y: 80, fields: [
    { id: 5, name: 'id', type: 'INT', pk: true },
    { id: 6, name: 'user_id', type: 'INT', pk: false },
    { id: 7, name: 'title', type: 'VARCHAR(255)', pk: false },
    { id: 8, name: 'body', type: 'TEXT', pk: false },
    { id: 9, name: 'published', type: 'BOOLEAN', pk: false }
  ]},
  { id: 3, name: 'comments', x: 400, y: 340, fields: [
    { id: 10, name: 'id', type: 'INT', pk: true },
    { id: 11, name: 'post_id', type: 'INT', pk: false },
    { id: 12, name: 'user_id', type: 'INT', pk: false },
    { id: 13, name: 'content', type: 'TEXT', pk: false }
  ]}
];

var initialRelations = [
  { id: 1, from: { table: 1, field: 1 }, to: { table: 2, field: 6 }, label: '1:N' },
  { id: 2, from: { table: 2, field: 5 }, to: { table: 3, field: 11 }, label: '1:N' },
  { id: 3, from: { table: 1, field: 1 }, to: { table: 3, field: 12 }, label: '1:N' }
];

function App() {
  var _s1 = useState(initialTables), tables = _s1[0], setTables = _s1[1];
  var _s2 = useState(initialRelations), relations = _s2[0], setRelations = _s2[1];
  var _s3 = useState(null), dragging = _s3[0], setDragging = _s3[1];
  var _s4 = useState(null), selected = _s4[0], setSelected = _s4[1];
  var _s5 = useState(false), showExport = _s5[0], setShowExport = _s5[1];
  var _s6 = useState(''), newTableName = _s6[0], setNewTableName = _s6[1];
  var _s7 = useState(null), addingRelation = _s7[0], setAddingRelation = _s7[1];
  var canvasRef = useRef(null);
  var dragOffset = useRef({ x: 0, y: 0 });

  var handleMouseDown = useCallback(function (tableId, e) {
    var table = tables.find(function (t) { return t.id === tableId; });
    if (table) {
      dragOffset.current = { x: e.clientX - table.x, y: e.clientY - table.y };
      setDragging(tableId);
    }
  }, [tables]);

  useEffect(function () {
    var handleMove = function (e) {
      if (dragging !== null) {
        setTables(function (prev) { return prev.map(function (t) {
          return t.id === dragging ? Object.assign({}, t, { x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y }) : t;
        }); });
      }
    };
    var handleUp = function () { setDragging(null); };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return function () { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); };
  }, [dragging]);

  var addTable = useCallback(function () {
    if (!newTableName.trim()) return;
    var newTable = { id: Date.now(), name: newTableName.trim().toLowerCase().replace(/\s+/g, '_'), x: 60 + Math.random() * 200, y: 60 + Math.random() * 200, fields: [{ id: Date.now() + 1, name: 'id', type: 'INT', pk: true }] };
    setTables(function (prev) { return prev.concat([newTable]); });
    setNewTableName('');
  }, [newTableName]);

  var removeTable = useCallback(function (id) {
    setTables(function (prev) { return prev.filter(function (t) { return t.id !== id; }); });
    setRelations(function (prev) { return prev.filter(function (r) { return r.from.table !== id && r.to.table !== id; }); });
    if (selected === id) setSelected(null);
  }, [selected]);

  var addField = useCallback(function (tableId) {
    setTables(function (prev) { return prev.map(function (t) {
      if (t.id !== tableId) return t;
      return Object.assign({}, t, { fields: t.fields.concat([{ id: Date.now(), name: 'new_field', type: 'VARCHAR(255)', pk: false }]) });
    }); });
  }, []);

  var removeField = useCallback(function (tableId, fieldId) {
    setTables(function (prev) { return prev.map(function (t) {
      if (t.id !== tableId) return t;
      return Object.assign({}, t, { fields: t.fields.filter(function (f) { return f.id !== fieldId; }) });
    }); });
    setRelations(function (prev) { return prev.filter(function (r) { return !(r.from.field === fieldId || r.to.field === fieldId); }); });
  }, []);

  var updateField = useCallback(function (tableId, fieldId, key, val) {
    setTables(function (prev) { return prev.map(function (t) {
      if (t.id !== tableId) return t;
      return Object.assign({}, t, { fields: t.fields.map(function (f) {
        if (f.id !== fieldId) return f;
        var upd = {}; upd[key] = val; return Object.assign({}, f, upd);
      }) });
    }); });
  }, []);

  var handleFieldClick = useCallback(function (tableId, fieldId) {
    if (addingRelation === null) {
      setAddingRelation({ table: tableId, field: fieldId });
    } else {
      if (addingRelation.table !== tableId) {
        setRelations(function (prev) { return prev.concat([{ id: Date.now(), from: addingRelation, to: { table: tableId, field: fieldId }, label: '1:N' }]); });
      }
      setAddingRelation(null);
    }
  }, [addingRelation]);

  var removeRelation = useCallback(function (id) {
    setRelations(function (prev) { return prev.filter(function (r) { return r.id !== id; }); });
  }, []);

  var exportSchema = function () {
    return tables.map(function (t) {
      var lines = ['CREATE TABLE ' + t.name + ' ('];
      var fieldLines = t.fields.map(function (f) {
        return '  ' + f.name + ' ' + f.type + (f.pk ? ' PRIMARY KEY' : '');
      });
      var fks = relations.filter(function (r) { return r.to.table === t.id; }).map(function (r) {
        var fromT = tables.find(function (tt) { return tt.id === r.from.table; });
        var fromF = fromT ? fromT.fields.find(function (ff) { return ff.id === r.from.field; }) : null;
        var toF = t.fields.find(function (ff) { return ff.id === r.to.field; });
        if (fromT && fromF && toF) return '  FOREIGN KEY (' + toF.name + ') REFERENCES ' + fromT.name + '(' + fromF.name + ')';
        return null;
      }).filter(Boolean);
      lines.push(fieldLines.concat(fks).join(',\n'));
      lines.push(');');
      return lines.join('\n');
    }).join('\n\n');
  };

  var getFieldCenter = function (tableId, fieldId) {
    var t = tables.find(function (tt) { return tt.id === tableId; });
    if (!t) return { x: 0, y: 0 };
    var idx = t.fields.findIndex(function (f) { return f.id === fieldId; });
    return { x: t.x + 120, y: t.y + 36 + idx * 26 + 13 };
  };

  var tableWidth = 240;

  return React.createElement('div', { style: baseStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' } },
      React.createElement('h1', { style: { color: '#8be9fd', margin: 0, fontSize: '24px' } }, 'Database Designer'),
      React.createElement('input', { style: Object.assign({}, inputStyle, { width: '160px' }), placeholder: 'Table name...', value: newTableName, onChange: function (e) { setNewTableName(e.target.value); }, onKeyDown: function (e) { if (e.key === 'Enter') addTable(); } }),
      React.createElement('button', { style: btnStyle('#50fa7b'), onClick: addTable }, '+ Add Table'),
      React.createElement('button', { style: btnStyle(addingRelation ? '#ff5555' : '#bd93f9'), onClick: function () { setAddingRelation(addingRelation ? null : 'waiting'); } }, addingRelation ? 'Cancel Link' : 'Add Relation'),
      React.createElement('button', { style: btnStyle('#ffb86c'), onClick: function () { setShowExport(!showExport); } }, 'Export SQL')
    ),
    addingRelation && React.createElement('div', { style: { background: 'rgba(189,147,249,0.15)', border: '1px solid #bd93f9', borderRadius: '6px', padding: '8px 16px', marginBottom: '12px', fontSize: '13px' } }, addingRelation === 'waiting' ? 'Click a field to start the relationship...' : 'Now click the target field in another table...'),
    showExport && React.createElement('div', { style: Object.assign({}, cardStyle, { marginBottom: '16px' }) },
      React.createElement('h3', { style: { margin: '0 0 8px', color: '#8be9fd' } }, 'SQL Schema'),
      React.createElement('pre', { style: { background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '12px', fontFamily: 'monospace', fontSize: '13px', overflow: 'auto', maxHeight: '200px', margin: 0, color: '#f1fa8c' } }, exportSchema())
    ),
    React.createElement('div', { ref: canvasRef, style: { position: 'relative', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', minHeight: '500px', overflow: 'hidden' } },
      React.createElement('svg', { style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' } },
        relations.map(function (r) {
          var from = getFieldCenter(r.from.table, r.from.field);
          var to = getFieldCenter(r.to.table, r.to.field);
          var fromT = tables.find(function (t) { return t.id === r.from.table; });
          var toT = tables.find(function (t) { return t.id === r.to.table; });
          if (!fromT || !toT) return null;
          var x1 = fromT.x + tableWidth;
          var y1 = from.y;
          var x2 = toT.x;
          var y2 = to.y;
          var mx = (x1 + x2) / 2;
          return React.createElement('g', { key: r.id },
            React.createElement('path', { d: 'M ' + x1 + ' ' + y1 + ' C ' + mx + ' ' + y1 + ' ' + mx + ' ' + y2 + ' ' + x2 + ' ' + y2, stroke: '#bd93f9', strokeWidth: 2, fill: 'none', opacity: 0.7 }),
            React.createElement('circle', { cx: x2, cy: y2, r: 4, fill: '#bd93f9' }),
            React.createElement('text', { x: mx, y: (y1 + y2) / 2 - 6, fill: '#bd93f9', fontSize: '11', textAnchor: 'middle', style: { pointerEvents: 'auto', cursor: 'pointer' }, onClick: function () { removeRelation(r.id); } }, r.label)
          );
        })
      ),
      tables.map(function (table) {
        return React.createElement('div', { key: table.id, style: { position: 'absolute', left: table.x, top: table.y, width: tableWidth, background: 'rgba(20,20,40,0.95)', borderRadius: '8px', border: selected === table.id ? '2px solid #8be9fd' : '1px solid rgba(255,255,255,0.15)', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: dragging === table.id ? 10 : 1 }, onClick: function () { setSelected(table.id); } },
          React.createElement('div', { style: { background: 'rgba(139,233,253,0.15)', padding: '8px 12px', cursor: 'move', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }, onMouseDown: function (e) { handleMouseDown(table.id, e); } },
            React.createElement('span', { style: { fontWeight: 'bold', fontSize: '13px', color: '#8be9fd' } }, table.name),
            React.createElement('div', { style: { display: 'flex', gap: '4px' } },
              React.createElement('button', { style: { background: 'transparent', border: 'none', color: '#50fa7b', cursor: 'pointer', fontSize: '14px', padding: '0 4px' }, onClick: function (e) { e.stopPropagation(); addField(table.id); } }, '+'),
              React.createElement('button', { style: { background: 'transparent', border: 'none', color: '#ff5555', cursor: 'pointer', fontSize: '14px', padding: '0 4px' }, onClick: function (e) { e.stopPropagation(); removeTable(table.id); } }, '\u00D7')
            )
          ),
          table.fields.map(function (field) {
            return React.createElement('div', { key: field.id, style: { padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: addingRelation ? 'crosshair' : 'default', background: addingRelation ? 'rgba(189,147,249,0.05)' : 'transparent' }, onClick: function (e) { if (addingRelation) { e.stopPropagation(); handleFieldClick(table.id, field.id); } } },
              React.createElement('span', { style: { color: field.pk ? '#f1fa8c' : '#999', fontSize: '10px', width: '16px' } }, field.pk ? 'PK' : ''),
              React.createElement('input', { style: Object.assign({}, inputStyle, { flex: 1, padding: '2px 6px', fontSize: '12px', border: 'none', background: 'transparent' }), value: field.name, onChange: function (e) { updateField(table.id, field.id, 'name', e.target.value); } }),
              React.createElement('select', { style: Object.assign({}, inputStyle, { width: '90px', padding: '2px 4px', fontSize: '11px', border: 'none', background: 'transparent', color: '#50fa7b' }), value: field.type, onChange: function (e) { updateField(table.id, field.id, 'type', e.target.value); } },
                fieldTypes.map(function (ft) { return React.createElement('option', { key: ft, value: ft, style: { color: '#000' } }, ft); })
              ),
              React.createElement('button', { style: { background: 'transparent', border: 'none', color: '#ff5555', cursor: 'pointer', fontSize: '12px', padding: '0 2px' }, onClick: function (e) { e.stopPropagation(); removeField(table.id, field.id); } }, '\u00D7')
            );
          })
        );
      })
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
