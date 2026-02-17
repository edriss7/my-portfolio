const { useState, useCallback, useRef, useEffect } = React;

var backLinkStyle = { color: '#7b8cff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px' };

var GRID = 20;
var zoneColors = { water: '#1e3a5f', forest: '#1a3a1a', desert: '#3a351a', mountain: '#2a2a3a', city: '#3a2a1a', plains: '#2a3a2a' };
var zoneMap = [];
(function() {
  for (var r = 0; r < GRID; r++) {
    var row = [];
    for (var c = 0; c < GRID; c++) {
      if ((r < 4 && c < 6) || (r > 15 && c > 14)) row.push('water');
      else if (r >= 4 && r <= 8 && c >= 2 && c <= 7) row.push('forest');
      else if (r >= 10 && r <= 14 && c >= 12 && c <= 17) row.push('desert');
      else if (r >= 2 && r <= 5 && c >= 14 && c <= 18) row.push('mountain');
      else if ((r >= 8 && r <= 11 && c >= 8 && c <= 11) || (r === 15 && c === 5)) row.push('city');
      else row.push('plains');
    }
    zoneMap.push(row);
  }
})();

var defaultMarkers = [
  { id: 1, row: 9, col: 9, label: 'Capital City', color: '#f87171' },
  { id: 2, row: 6, col: 4, label: 'Forest Camp', color: '#4ade80' },
  { id: 3, row: 3, col: 16, label: 'Mountain Peak', color: '#a78bfa' },
  { id: 4, row: 12, col: 15, label: 'Oasis', color: '#38bdf8' }
];

var mockLocations = [
  { name: 'Central Plaza', row: 10, col: 10 }, { name: 'North Harbor', row: 1, col: 3 },
  { name: 'East Desert', row: 12, col: 16 }, { name: 'West Forest', row: 5, col: 3 },
  { name: 'South Shore', row: 18, col: 17 }, { name: 'Mountain Pass', row: 4, col: 15 }
];

function App() {
  var s1 = useState(defaultMarkers), markers = s1[0], setMarkers = s1[1];
  var s2 = useState(null), selectedMarker = s2[0], setSelectedMarker = s2[1];
  var s3 = useState({ x: 0, y: 0 }), pan = s3[0], setPan = s3[1];
  var s4 = useState(1.0), zoom = s4[0], setZoom = s4[1];
  var s5 = useState(''), searchText = s5[0], setSearchText = s5[1];
  var s6 = useState([]), searchResults = s6[0], setSearchResults = s6[1];
  var s7 = useState(null), distPair = s7[0], setDistPair = s7[1];
  var s8 = useState(false), placing = s8[0], setPlacing = s8[1];
  var s9 = useState(''), newLabel = s9[0], setNewLabel = s9[1];
  var dragging = useRef(false);
  var lastPos = useRef({ x: 0, y: 0 });

  var cellSize = 32 * zoom;

  var handleSearch = useCallback(function() {
    var results = mockLocations.filter(function(l) {
      return l.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0;
    });
    setSearchResults(results);
  }, [searchText]);

  var goToLocation = useCallback(function(loc) {
    setPan({ x: -(loc.col * cellSize - 200), y: -(loc.row * cellSize - 150) });
    setSearchResults([]);
    setSearchText('');
  }, [cellSize]);

  var handleCellClick = useCallback(function(r, c) {
    if (placing && newLabel.trim()) {
      setMarkers(function(prev) { return prev.concat([{ id: Date.now(), row: r, col: c, label: newLabel.trim(), color: '#fbbf24' }]); });
      setPlacing(false);
      setNewLabel('');
    }
  }, [placing, newLabel]);

  var deleteMarker = useCallback(function(id) {
    setMarkers(function(prev) { return prev.filter(function(m) { return m.id !== id; }); });
    if (selectedMarker === id) setSelectedMarker(null);
  }, [selectedMarker]);

  var calcDistance = function(m1, m2) {
    var dr = m1.row - m2.row, dc = m1.col - m2.col;
    return Math.sqrt(dr * dr + dc * dc).toFixed(1);
  };

  var handleMouseDown = function(e) {
    if (e.target.dataset && e.target.dataset.cell) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  var handleMouseMove = function(e) {
    if (!dragging.current) return;
    var dx = e.clientX - lastPos.current.x;
    var dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPan(function(p) { return { x: p.x + dx, y: p.y + dy }; });
  };
  var handleMouseUp = function() { dragging.current = false; };

  var legendItems = Object.keys(zoneColors).map(function(k) {
    return { name: k.charAt(0).toUpperCase() + k.slice(1), color: zoneColors[k] };
  });

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '16px' } }, 'Interactive Map'),

    React.createElement('div', { style: { display: 'flex', gap: '16px' } },
      // Sidebar
      React.createElement('div', { style: { width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' } },
        // Search
        React.createElement('div', { style: { background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' } },
          React.createElement('div', { style: { fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '8px' } }, 'Search Location'),
          React.createElement('div', { style: { display: 'flex', gap: '6px' } },
            React.createElement('input', { value: searchText, onChange: function(e) { setSearchText(e.target.value); }, onKeyDown: function(e) { if (e.key === 'Enter') handleSearch(); }, placeholder: 'Search...', style: { flex: 1, padding: '8px', background: '#0a0a1a', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', fontSize: '13px' } }),
            React.createElement('button', { onClick: handleSearch, style: { padding: '8px 12px', background: '#7b8cff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' } }, '\u2315')
          ),
          searchResults.length > 0 && React.createElement('div', { style: { marginTop: '8px' } },
            searchResults.map(function(loc) {
              return React.createElement('div', { key: loc.name, onClick: function() { goToLocation(loc); }, style: { padding: '6px 8px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px', color: '#e0e0e0', background: 'rgba(255,255,255,0.05)', marginBottom: '4px' } }, loc.name);
            })
          )
        ),

        // Place marker
        React.createElement('div', { style: { background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' } },
          React.createElement('div', { style: { fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '8px' } }, 'Place Marker'),
          React.createElement('input', { value: newLabel, onChange: function(e) { setNewLabel(e.target.value); }, placeholder: 'Marker label...', style: { width: '100%', padding: '8px', background: '#0a0a1a', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box' } }),
          React.createElement('button', { onClick: function() { setPlacing(!placing); }, style: { padding: '8px 14px', background: placing ? '#f87171' : '#4ade80', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', width: '100%' } }, placing ? 'Cancel Placing' : 'Click Map to Place')
        ),

        // Markers list
        React.createElement('div', { style: { background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)', flex: 1, overflowY: 'auto' } },
          React.createElement('div', { style: { fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '8px' } }, 'Markers (' + markers.length + ')'),
          markers.map(function(m) {
            return React.createElement('div', { key: m.id, onClick: function() { setSelectedMarker(m.id); }, style: { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', marginBottom: '4px', cursor: 'pointer', background: selectedMarker === m.id ? 'rgba(123,140,255,0.2)' : 'transparent', border: selectedMarker === m.id ? '1px solid rgba(123,140,255,0.4)' : '1px solid transparent' } },
              React.createElement('div', { style: { width: '10px', height: '10px', borderRadius: '50%', background: m.color, flexShrink: 0 } }),
              React.createElement('span', { style: { fontSize: '12px', flex: 1 } }, m.label),
              React.createElement('button', { onClick: function(e) { e.stopPropagation(); deleteMarker(m.id); }, style: { background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '14px', padding: '0 4px' } }, '\u2717')
            );
          })
        ),

        // Distance
        React.createElement('div', { style: { background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' } },
          React.createElement('div', { style: { fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '8px' } }, 'Measure Distance'),
          React.createElement('select', { value: distPair ? distPair[0] : '', onChange: function(e) { setDistPair(function(p) { return [parseInt(e.target.value), p ? p[1] : '']; }); }, style: { width: '100%', padding: '6px', background: '#0a0a1a', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', fontSize: '12px', marginBottom: '6px' } },
            React.createElement('option', { value: '' }, 'From...'),
            markers.map(function(m) { return React.createElement('option', { key: m.id, value: m.id }, m.label); })
          ),
          React.createElement('select', { value: distPair ? distPair[1] : '', onChange: function(e) { setDistPair(function(p) { return [p ? p[0] : '', parseInt(e.target.value)]; }); }, style: { width: '100%', padding: '6px', background: '#0a0a1a', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', fontSize: '12px', marginBottom: '8px' } },
            React.createElement('option', { value: '' }, 'To...'),
            markers.map(function(m) { return React.createElement('option', { key: m.id, value: m.id }, m.label); })
          ),
          distPair && distPair[0] && distPair[1] && (function() {
            var m1 = markers.find(function(m) { return m.id === distPair[0]; });
            var m2 = markers.find(function(m) { return m.id === distPair[1]; });
            if (m1 && m2) return React.createElement('div', { style: { fontSize: '14px', color: '#fbbf24', fontWeight: '600' } }, 'Distance: ' + calcDistance(m1, m2) + ' units');
            return null;
          })()
        ),

        // Legend
        React.createElement('div', { style: { background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' } },
          React.createElement('div', { style: { fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '8px' } }, 'Legend'),
          legendItems.map(function(item) {
            return React.createElement('div', { key: item.name, style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' } },
              React.createElement('div', { style: { width: '16px', height: '16px', borderRadius: '3px', background: item.color } }),
              React.createElement('span', { style: { fontSize: '12px' } }, item.name)
            );
          })
        )
      ),

      // Map
      React.createElement('div', {
        onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp,
        style: { flex: 1, background: '#0a0a1a', borderRadius: '12px', overflow: 'hidden', position: 'relative', cursor: placing ? 'crosshair' : 'grab', border: '1px solid rgba(255,255,255,0.08)', minHeight: '500px' }
      },
        // Zoom controls
        React.createElement('div', { style: { position: 'absolute', top: '12px', right: '12px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '4px' } },
          React.createElement('button', { onClick: function() { setZoom(function(z) { return Math.min(2.5, z + 0.2); }); }, style: { width: '32px', height: '32px', background: 'rgba(0,0,0,0.7)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', cursor: 'pointer', fontSize: '18px' } }, '+'),
          React.createElement('button', { onClick: function() { setZoom(function(z) { return Math.max(0.4, z - 0.2); }); }, style: { width: '32px', height: '32px', background: 'rgba(0,0,0,0.7)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', cursor: 'pointer', fontSize: '18px' } }, '\u2212')
        ),
        placing && React.createElement('div', { style: { position: 'absolute', top: '12px', left: '12px', zIndex: 10, padding: '8px 12px', background: 'rgba(248,113,113,0.9)', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#fff' } }, 'Click on the map to place: ' + (newLabel || 'marker')),

        React.createElement('div', { style: { transform: 'translate(' + pan.x + 'px, ' + pan.y + 'px)', position: 'relative' } },
          zoneMap.map(function(row, r) {
            return React.createElement('div', { key: r, style: { display: 'flex' } },
              row.map(function(zone, c) {
                return React.createElement('div', {
                  key: c,
                  'data-cell': 'true',
                  onClick: function() { handleCellClick(r, c); },
                  style: { width: cellSize + 'px', height: cellSize + 'px', background: zoneColors[zone], border: '1px solid rgba(255,255,255,0.03)', boxSizing: 'border-box', position: 'relative' }
                });
              })
            );
          }),
          // Markers
          markers.map(function(m) {
            var isSel = selectedMarker === m.id;
            return React.createElement('div', { key: m.id, style: { position: 'absolute', left: (m.col * cellSize + cellSize / 2) + 'px', top: (m.row * cellSize) + 'px', transform: 'translate(-50%, -100%)', zIndex: isSel ? 20 : 10, pointerEvents: 'none' } },
              React.createElement('div', { style: { textAlign: 'center' } },
                React.createElement('div', { style: { fontSize: '10px', color: '#fff', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px', marginBottom: '2px', whiteSpace: 'nowrap', border: isSel ? '1px solid ' + m.color : 'none' } }, m.label),
                React.createElement('div', { style: { fontSize: cellSize > 20 ? '20px' : '14px', lineHeight: 1 } }, '\uD83D\uDCCD')
              )
            );
          })
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
