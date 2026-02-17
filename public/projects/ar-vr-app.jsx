const { useState, useEffect, useCallback } = React;

var backLinkStyle = { color: '#7b8cff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px' };
var cardStyle = { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)' };

var environments = [
  { name: 'Nebula', bg: 'radial-gradient(ellipse at center, #1a0033 0%, #0a0a1a 60%, #000 100%)', accent: '#a78bfa', particles: '#c084fc' },
  { name: 'Ocean', bg: 'radial-gradient(ellipse at bottom, #0a2a4a 0%, #0a0a1a 60%, #000 100%)', accent: '#38bdf8', particles: '#7dd3fc' },
  { name: 'Volcanic', bg: 'radial-gradient(ellipse at bottom, #3a0a0a 0%, #0a0a1a 60%, #000 100%)', accent: '#f87171', particles: '#fca5a5' },
  { name: 'Forest', bg: 'radial-gradient(ellipse at bottom, #0a2a0a 0%, #0a0a1a 60%, #000 100%)', accent: '#4ade80', particles: '#86efac' },
  { name: 'Cyber', bg: 'radial-gradient(ellipse at center, #1a1a3e 0%, #0a0a1a 60%, #000 100%)', accent: '#7b8cff', particles: '#93c5fd' }
];

var shapes = [
  { id: 1, type: 'cube', x: 0, y: 0, z: -100, size: 80, color: '#7b8cff', rotSpeed: 1 },
  { id: 2, type: 'pyramid', x: -200, y: 50, z: -150, size: 70, color: '#f87171', rotSpeed: 1.5 },
  { id: 3, type: 'sphere', x: 200, y: -30, z: -120, size: 60, color: '#4ade80', rotSpeed: 0.8 },
  { id: 4, type: 'ring', x: -120, y: -80, z: -200, size: 90, color: '#fbbf24', rotSpeed: 2 },
  { id: 5, type: 'diamond', x: 150, y: 80, z: -180, size: 65, color: '#a78bfa', rotSpeed: 1.2 },
  { id: 6, type: 'cube', x: -50, y: 120, z: -250, size: 50, color: '#38bdf8', rotSpeed: 0.6 }
];

function App() {
  var s1 = useState(0), envIdx = s1[0], setEnvIdx = s1[1];
  var s2 = useState(false), vrMode = s2[0], setVrMode = s2[1];
  var s3 = useState(0), time = s3[0], setTime = s3[1];
  var s4 = useState(null), hoveredObj = s4[0], setHoveredObj = s4[1];
  var s5 = useState(null), selectedObj = s5[0], setSelectedObj = s5[1];
  var s6 = useState({ lx: 0, ly: 0, rx: 0, ry: 0 }), controllers = s6[0], setControllers = s6[1];

  var env = environments[envIdx];

  useEffect(function() {
    var timer = setInterval(function() { setTime(function(t) { return t + 1; }); }, 50);
    return function() { clearInterval(timer); };
  }, []);

  useEffect(function() {
    var handler = function(e) {
      var rect = document.getElementById('scene-container');
      if (!rect) return;
      var bounds = rect.getBoundingClientRect();
      var x = ((e.clientX - bounds.left) / bounds.width - 0.5) * 2;
      var y = ((e.clientY - bounds.top) / bounds.height - 0.5) * 2;
      setControllers({ lx: x * -30, ly: y * -20, rx: x * 20, ry: y * 15 });
    };
    window.addEventListener('mousemove', handler);
    return function() { window.removeEventListener('mousemove', handler); };
  }, []);

  var renderShape = function(shape) {
    var isHov = hoveredObj === shape.id;
    var isSel = selectedObj === shape.id;
    var angle = time * shape.rotSpeed;
    var bobY = Math.sin(time * 0.03 + shape.id) * 10;
    var scale = isHov ? 1.15 : isSel ? 1.1 : 1;
    var glow = isHov || isSel ? '0 0 30px ' + shape.color + ', 0 0 60px ' + shape.color + '40' : 'none';

    var transform = 'translate3d(' + shape.x + 'px, ' + (shape.y + bobY) + 'px, ' + shape.z + 'px) rotateY(' + angle + 'deg) rotateX(' + (angle * 0.5) + 'deg) scale(' + scale + ')';

    var inner = null;
    if (shape.type === 'cube') {
      var faceStyle = function(t, bg) {
        return { position: 'absolute', width: shape.size + 'px', height: shape.size + 'px', background: bg, border: '1px solid ' + shape.color, opacity: 0.8, transform: t, backfaceVisibility: 'hidden' };
      };
      var hs = shape.size / 2;
      inner = React.createElement('div', { style: { width: shape.size + 'px', height: shape.size + 'px', position: 'relative', transformStyle: 'preserve-3d' } },
        React.createElement('div', { style: faceStyle('translateZ(' + hs + 'px)', shape.color + '30') }),
        React.createElement('div', { style: faceStyle('rotateY(180deg) translateZ(' + hs + 'px)', shape.color + '20') }),
        React.createElement('div', { style: faceStyle('rotateY(90deg) translateZ(' + hs + 'px)', shape.color + '25') }),
        React.createElement('div', { style: faceStyle('rotateY(-90deg) translateZ(' + hs + 'px)', shape.color + '25') }),
        React.createElement('div', { style: faceStyle('rotateX(90deg) translateZ(' + hs + 'px)', shape.color + '35') }),
        React.createElement('div', { style: faceStyle('rotateX(-90deg) translateZ(' + hs + 'px)', shape.color + '15') })
      );
    } else if (shape.type === 'pyramid') {
      inner = React.createElement('div', { style: { width: 0, height: 0, borderLeft: (shape.size / 2) + 'px solid transparent', borderRight: (shape.size / 2) + 'px solid transparent', borderBottom: shape.size + 'px solid ' + shape.color + '80', filter: 'drop-shadow(0 0 10px ' + shape.color + '40)' } });
    } else if (shape.type === 'sphere') {
      inner = React.createElement('div', { style: { width: shape.size + 'px', height: shape.size + 'px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, ' + shape.color + ', ' + shape.color + '40 60%, ' + shape.color + '10)', border: '1px solid ' + shape.color + '60' } });
    } else if (shape.type === 'ring') {
      inner = React.createElement('div', { style: { width: shape.size + 'px', height: shape.size + 'px', borderRadius: '50%', border: '8px solid ' + shape.color + '80', background: 'transparent' } });
    } else if (shape.type === 'diamond') {
      inner = React.createElement('div', { style: { width: (shape.size * 0.7) + 'px', height: (shape.size * 0.7) + 'px', background: shape.color + '60', border: '2px solid ' + shape.color, transform: 'rotate(45deg)' } });
    }

    return React.createElement('div', {
      key: shape.id,
      onMouseEnter: function() { setHoveredObj(shape.id); },
      onMouseLeave: function() { setHoveredObj(null); },
      onClick: function() { setSelectedObj(selectedObj === shape.id ? null : shape.id); },
      style: { position: 'absolute', left: '50%', top: '50%', transform: transform, transformStyle: 'preserve-3d', cursor: 'pointer', transition: 'filter 0.3s', boxShadow: glow, zIndex: isHov ? 10 : 1 }
    }, inner);
  };

  // Floating spatial UI elements
  var renderSpatialUI = function() {
    var panels = [
      { x: -320, y: -140, z: -80, label: 'FPS', value: '90', rY: 15 },
      { x: 320, y: -140, z: -80, label: 'LAT', value: '12ms', rY: -15 },
      { x: -330, y: 100, z: -100, label: 'OBJS', value: shapes.length, rY: 20 },
      { x: 330, y: 100, z: -100, label: 'ENV', value: env.name, rY: -20 }
    ];
    return panels.map(function(p, i) {
      return React.createElement('div', { key: i, style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate3d(' + p.x + 'px, ' + p.y + 'px, ' + p.z + 'px) rotateY(' + p.rY + 'deg)', padding: '8px 14px', background: 'rgba(0,0,0,0.5)', border: '1px solid ' + env.accent + '40', borderRadius: '8px', backdropFilter: 'blur(4px)', pointerEvents: 'none' } },
        React.createElement('div', { style: { fontSize: '9px', color: env.accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' } }, p.label),
        React.createElement('div', { style: { fontSize: '16px', fontWeight: '700', color: '#fff' } }, p.value)
      );
    });
  };

  var selShape = selectedObj ? shapes.find(function(s) { return s.id === selectedObj; }) : null;

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' } },
      React.createElement('h1', { style: { fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0 } }, 'AR/VR Experience'),
      React.createElement('div', { style: { display: 'flex', gap: '8px' } },
        React.createElement('button', { onClick: function() { setVrMode(!vrMode); }, style: { padding: '8px 16px', background: vrMode ? env.accent : 'rgba(255,255,255,0.1)', color: vrMode ? '#000' : '#e0e0e0', border: '1px solid ' + (vrMode ? env.accent : 'rgba(255,255,255,0.2)'), borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' } }, vrMode ? '\u2299 VR Mode ON' : '\u2299 VR Mode'),
        React.createElement('select', { value: envIdx, onChange: function(e) { setEnvIdx(parseInt(e.target.value)); }, style: { padding: '8px 14px', background: '#1e1e3a', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '13px' } },
          environments.map(function(e, i) { return React.createElement('option', { key: i, value: i }, e.name); })
        )
      )
    ),

    React.createElement('div', { style: { display: 'flex', gap: '16px' } },
      // 3D Scene
      React.createElement('div', { style: { flex: 1, position: 'relative' } },
        React.createElement('div', { id: 'scene-container', style: { width: '100%', height: '500px', borderRadius: vrMode ? '0' : '16px', overflow: 'hidden', position: 'relative', background: env.bg, perspective: '800px', perspectiveOrigin: '50% 50%', border: vrMode ? 'none' : '1px solid rgba(255,255,255,0.08)' } },
          // VR headset frame
          vrMode && React.createElement('div', { style: { position: 'absolute', inset: 0, zIndex: 50, pointerEvents: 'none', borderRadius: '80px', boxShadow: 'inset 0 0 80px 40px #000, inset 0 0 200px 100px rgba(0,0,0,0.8)', border: '3px solid #333' } }),
          vrMode && React.createElement('div', { style: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: '4px', background: '#000', zIndex: 51, transform: 'translateX(-50%)', pointerEvents: 'none' } }),

          // Grid floor
          React.createElement('div', { style: { position: 'absolute', left: '50%', bottom: '0', width: '800px', height: '300px', transform: 'translateX(-50%) rotateX(70deg)', transformOrigin: 'bottom', backgroundImage: 'linear-gradient(' + env.accent + '15 1px, transparent 1px), linear-gradient(90deg, ' + env.accent + '15 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.6 } }),

          // Particles
          Array.from({ length: 20 }, function(_, i) {
            var px = Math.sin(time * 0.01 + i * 1.3) * 300 + 'px';
            var py = Math.cos(time * 0.015 + i * 0.9) * 150 + 'px';
            var op = 0.3 + Math.sin(time * 0.02 + i) * 0.2;
            return React.createElement('div', { key: i, style: { position: 'absolute', left: 'calc(50% + ' + px + ')', top: 'calc(50% + ' + py + ')', width: '3px', height: '3px', borderRadius: '50%', background: env.particles, opacity: op, pointerEvents: 'none' } });
          }),

          // 3D Objects
          React.createElement('div', { style: { position: 'absolute', inset: 0, transformStyle: 'preserve-3d' } },
            shapes.map(renderShape),
            renderSpatialUI()
          ),

          // Crosshair
          React.createElement('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 40 } },
            React.createElement('div', { style: { width: '20px', height: '20px', border: '2px solid ' + env.accent + '60', borderRadius: '50%' } }),
            React.createElement('div', { style: { position: 'absolute', left: '50%', top: '-8px', width: '1px', height: '6px', background: env.accent + '40', transform: 'translateX(-50%)' } }),
            React.createElement('div', { style: { position: 'absolute', left: '50%', bottom: '-8px', width: '1px', height: '6px', background: env.accent + '40', transform: 'translateX(-50%)' } }),
            React.createElement('div', { style: { position: 'absolute', top: '50%', left: '-8px', width: '6px', height: '1px', background: env.accent + '40', transform: 'translateY(-50%)' } }),
            React.createElement('div', { style: { position: 'absolute', top: '50%', right: '-8px', width: '6px', height: '1px', background: env.accent + '40', transform: 'translateY(-50%)' } })
          )
        )
      ),

      // Right panel
      React.createElement('div', { style: { width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' } },
        // Controllers
        React.createElement('div', { style: cardStyle },
          React.createElement('h3', { style: { margin: '0 0 12px', fontSize: '14px', color: '#fff' } }, 'Hand Controllers'),
          React.createElement('div', { style: { display: 'flex', gap: '12px' } },
            ['Left', 'Right'].map(function(hand) {
              var cx = hand === 'Left' ? controllers.lx : controllers.rx;
              var cy = hand === 'Left' ? controllers.ly : controllers.ry;
              return React.createElement('div', { key: hand, style: { flex: 1, textAlign: 'center' } },
                React.createElement('div', { style: { fontSize: '11px', color: '#9ca3af', marginBottom: '6px' } }, hand),
                React.createElement('div', { style: { width: '80px', height: '80px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid ' + env.accent + '30', margin: '0 auto', position: 'relative', overflow: 'hidden' } },
                  React.createElement('div', { style: { position: 'absolute', left: 'calc(50% + ' + (cx * 0.5) + 'px)', top: 'calc(50% + ' + (cy * 0.5) + 'px)', width: '12px', height: '12px', borderRadius: '50%', background: env.accent, transform: 'translate(-50%, -50%)', transition: 'left 0.1s, top 0.1s', boxShadow: '0 0 8px ' + env.accent } })
                ),
                React.createElement('div', { style: { fontSize: '10px', color: '#6b7280', marginTop: '4px', fontFamily: 'monospace' } }, 'X:' + cx.toFixed(0) + ' Y:' + cy.toFixed(0))
              );
            })
          )
        ),

        // Selected object
        React.createElement('div', { style: cardStyle },
          React.createElement('h3', { style: { margin: '0 0 12px', fontSize: '14px', color: '#fff' } }, 'Selected Object'),
          selShape ? React.createElement('div', null,
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' } },
              React.createElement('div', { style: { width: '24px', height: '24px', borderRadius: '6px', background: selShape.color } }),
              React.createElement('span', { style: { fontWeight: '600', textTransform: 'capitalize' } }, selShape.type)
            ),
            [['Position X', selShape.x], ['Position Y', selShape.y], ['Position Z', selShape.z], ['Size', selShape.size], ['Rotation Speed', selShape.rotSpeed + 'x']].map(function(pair) {
              return React.createElement('div', { key: pair[0], style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' } },
                React.createElement('span', { style: { color: '#9ca3af' } }, pair[0]),
                React.createElement('span', { style: { color: '#fff', fontFamily: 'monospace' } }, pair[1])
              );
            })
          ) : React.createElement('div', { style: { color: '#6b7280', fontSize: '12px', textAlign: 'center', padding: '20px 0' } }, 'Click an object to inspect')
        ),

        // Environment
        React.createElement('div', { style: cardStyle },
          React.createElement('h3', { style: { margin: '0 0 12px', fontSize: '14px', color: '#fff' } }, 'Environment'),
          environments.map(function(e, i) {
            var isActive = i === envIdx;
            return React.createElement('div', { key: i, onClick: function() { setEnvIdx(i); }, style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer', background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent', border: isActive ? '1px solid ' + e.accent + '40' : '1px solid transparent', marginBottom: '4px' } },
              React.createElement('div', { style: { width: '16px', height: '16px', borderRadius: '4px', background: e.accent } }),
              React.createElement('span', { style: { fontSize: '13px', color: isActive ? '#fff' : '#9ca3af' } }, e.name)
            );
          })
        ),

        // Scene Info
        React.createElement('div', { style: cardStyle },
          React.createElement('h3', { style: { margin: '0 0 8px', fontSize: '14px', color: '#fff' } }, 'Scene Info'),
          [['Objects', shapes.length], ['Rendering', 'WebGL 2.0'], ['Frame Time', '11.1ms'], ['Draw Calls', '24'], ['Triangles', '1.2K']].map(function(pair) {
            return React.createElement('div', { key: pair[0], style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '3px 0' } },
              React.createElement('span', { style: { color: '#6b7280' } }, pair[0]),
              React.createElement('span', { style: { color: '#fff', fontFamily: 'monospace' } }, pair[1])
            );
          })
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
