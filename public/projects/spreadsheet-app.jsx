const { useState, useCallback, useMemo } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'inline-block' };

var COLS = 10;
var ROWS = 20;
var COL_LETTERS = 'ABCDEFGHIJ'.split('');

function colName(c) { return COL_LETTERS[c]; }
function cellKey(r, c) { return colName(c) + (r + 1); }

function parseCellRef(ref) {
  var m = ref.match(/^([A-J])(\d+)$/i);
  if (!m) return null;
  var col = m[1].toUpperCase().charCodeAt(0) - 65;
  var row = parseInt(m[2], 10) - 1;
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
  return { row: row, col: col };
}

function parseRange(range) {
  var parts = range.split(':');
  if (parts.length !== 2) return [];
  var start = parseCellRef(parts[0]);
  var end = parseCellRef(parts[1]);
  if (!start || !end) return [];
  var cells = [];
  for (var r = Math.min(start.row, end.row); r <= Math.max(start.row, end.row); r++) {
    for (var c = Math.min(start.col, end.col); c <= Math.max(start.col, end.col); c++) {
      cells.push({ row: r, col: c });
    }
  }
  return cells;
}

function App() {
  var _d = useState({}), data = _d[0], setData = _d[1];
  var _b = useState({}), bold = _b[0], setBold = _b[1];
  var _sel = useState(null), selected = _sel[0], setSelected = _sel[1];
  var _ed = useState(null), editing = _ed[0], setEditing = _ed[1];
  var _ev = useState(''), editValue = _ev[0], setEditValue = _ev[1];

  var getCellValue = useCallback(function(r, c, visited) {
    var key = cellKey(r, c);
    var raw = data[key];
    if (raw === undefined || raw === '') return '';
    if (typeof raw === 'string' && raw.charAt(0) === '=') {
      return evaluateFormula(raw, visited || {});
    }
    var num = parseFloat(raw);
    return isNaN(num) ? raw : num;
  }, [data]);

  var evaluateFormula = useCallback(function(formula, visited) {
    try {
      var f = formula.substring(1).trim().toUpperCase();
      var sumMatch = f.match(/^SUM\(([A-J]\d+:[A-J]\d+)\)$/i);
      if (sumMatch) {
        var cells = parseRange(sumMatch[1]);
        var sum = 0;
        cells.forEach(function(cell) {
          var k = cellKey(cell.row, cell.col);
          if (visited[k]) return;
          visited[k] = true;
          var v = getCellValue(cell.row, cell.col, visited);
          var n = parseFloat(v);
          if (!isNaN(n)) sum += n;
        });
        return sum;
      }
      var avgMatch = f.match(/^AVG\(([A-J]\d+:[A-J]\d+)\)$/i);
      if (avgMatch) {
        var cells2 = parseRange(avgMatch[1]);
        var total = 0, count = 0;
        cells2.forEach(function(cell) {
          var k = cellKey(cell.row, cell.col);
          if (visited[k]) return;
          visited[k] = true;
          var v = getCellValue(cell.row, cell.col, visited);
          var n = parseFloat(v);
          if (!isNaN(n)) { total += n; count++; }
        });
        return count > 0 ? Math.round(total / count * 100) / 100 : 0;
      }
      var ref = parseCellRef(f);
      if (ref) {
        var k = cellKey(ref.row, ref.col);
        if (visited[k]) return '#REF!';
        visited[k] = true;
        return getCellValue(ref.row, ref.col, visited);
      }
      return '#ERR!';
    } catch (e) {
      return '#ERR!';
    }
  }, [data]);

  var getDisplay = useCallback(function(r, c) {
    var key = cellKey(r, c);
    var raw = data[key];
    if (raw === undefined || raw === '') return '';
    if (typeof raw === 'string' && raw.charAt(0) === '=') {
      return evaluateFormula(raw, {});
    }
    return raw;
  }, [data, evaluateFormula]);

  var startEdit = useCallback(function(r, c) {
    var key = cellKey(r, c);
    setEditing(key);
    setEditValue(data[key] || '');
    setSelected(key);
  }, [data]);

  var finishEdit = useCallback(function() {
    if (editing) {
      setData(function(d) {
        var n = Object.assign({}, d);
        if (editValue === '') { delete n[editing]; } else { n[editing] = editValue; }
        return n;
      });
    }
    setEditing(null);
  }, [editing, editValue]);

  var toggleBold = useCallback(function() {
    if (selected) {
      setBold(function(b) {
        var n = Object.assign({}, b);
        n[selected] = !n[selected];
        return n;
      });
    }
  }, [selected]);

  var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)', color: '#e2e8f0', fontFamily: "'Segoe UI', sans-serif", padding: '20px' };
  var tableStyle = { borderCollapse: 'collapse', fontSize: '13px', width: '100%', maxWidth: '1100px' };
  var headerCellStyle = { background: '#1e293b', padding: '6px 12px', border: '1px solid #334155', fontWeight: 'bold', color: '#94a3b8', textAlign: 'center', position: 'sticky', top: 0, minWidth: '80px' };
  var rowHeaderStyle = { background: '#1e293b', padding: '6px 8px', border: '1px solid #334155', fontWeight: 'bold', color: '#94a3b8', textAlign: 'center', width: '40px' };

  var formulaBar = React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', maxWidth: '1100px' }
  }, [
    React.createElement('div', { key: 'cell', style: { background: '#1e293b', padding: '6px 12px', borderRadius: '4px', minWidth: '50px', textAlign: 'center', fontSize: '13px', border: '1px solid #334155' } }, selected || 'A1'),
    React.createElement('div', { key: 'fx', style: { color: '#64748b', fontSize: '13px' } }, 'fx'),
    React.createElement('div', { key: 'val', style: { flex: 1, background: '#0f172a', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', border: '1px solid #334155', minHeight: '20px', color: '#e2e8f0' } }, selected ? (data[selected] || '') : ''),
    React.createElement('button', { key: 'bold', onClick: toggleBold, style: { padding: '6px 12px', background: (selected && bold[selected]) ? '#6366f1' : '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' } }, 'B')
  ]);

  var headerRow = React.createElement('tr', { key: 'header' },
    [React.createElement('th', { key: 'corner', style: headerCellStyle }, '')].concat(
      COL_LETTERS.map(function(letter, ci) {
        return React.createElement('th', { key: ci, style: headerCellStyle }, letter);
      })
    )
  );

  var bodyRows = [];
  for (var r = 0; r < ROWS; r++) {
    (function(row) {
      var cells = [React.createElement('td', { key: 'rh', style: rowHeaderStyle }, row + 1)];
      for (var c = 0; c < COLS; c++) {
        (function(col) {
          var key = cellKey(row, col);
          var isSelected = selected === key;
          var isEditing = editing === key;
          var display = getDisplay(row, col);
          var isBold = bold[key];
          var cellStyle = {
            padding: '0', border: '1px solid ' + (isSelected ? '#6366f1' : '#334155'),
            background: isSelected ? 'rgba(99,102,241,0.15)' : '#0f172a',
            cursor: 'pointer', minWidth: '80px', height: '28px', position: 'relative'
          };
          var content;
          if (isEditing) {
            content = React.createElement('input', {
              autoFocus: true, value: editValue,
              onChange: function(e) { setEditValue(e.target.value); },
              onBlur: finishEdit,
              onKeyDown: function(e) {
                if (e.key === 'Enter') { finishEdit(); }
                if (e.key === 'Escape') { setEditing(null); }
                if (e.key === 'Tab') { e.preventDefault(); finishEdit(); var nc = col + 1; if (nc < COLS) startEdit(row, nc); }
              },
              style: { width: '100%', height: '100%', background: 'transparent', border: 'none', color: '#e2e8f0', padding: '4px 6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontWeight: isBold ? 'bold' : 'normal' }
            });
          } else {
            content = React.createElement('div', {
              onClick: function() { setSelected(key); },
              onDoubleClick: function() { startEdit(row, col); },
              style: { padding: '4px 6px', fontSize: '13px', fontWeight: isBold ? 'bold' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', height: '100%', boxSizing: 'border-box', lineHeight: '20px' }
            }, String(display));
          }
          cells.push(React.createElement('td', { key: col, style: cellStyle }, content));
        })(c);
      }
      bodyRows.push(React.createElement('tr', { key: row }, cells));
    })(r);
  }

  return React.createElement('div', { style: containerStyle }, [
    React.createElement('a', { key: 'back', href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { key: 'title', style: { fontSize: '26px', fontWeight: 'bold', color: '#22c55e', marginBottom: '10px' } }, 'Spreadsheet'),
    React.createElement('p', { key: 'info', style: { color: '#94a3b8', fontSize: '13px', marginBottom: '15px' } }, 'Double-click to edit. Formulas: =SUM(A1:A5), =AVG(B1:B3), =A1'),
    formulaBar,
    React.createElement('div', { key: 'table', style: { overflowX: 'auto', overflowY: 'auto', maxHeight: '600px', borderRadius: '8px', border: '1px solid #334155' } },
      React.createElement('table', { style: tableStyle }, [
        React.createElement('thead', { key: 'thead' }, headerRow),
        React.createElement('tbody', { key: 'tbody' }, bodyRows)
      ])
    )
  ]);
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
