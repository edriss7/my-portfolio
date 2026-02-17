const { useState, useRef, useEffect, useCallback } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'inline-block' };

var PRODUCTS = [
  { name: 'Gaming Console', faces: ['#6366f1', '#818cf8', '#4f46e5', '#a5b4fc', '#312e81', '#c7d2fe'], label: ['PLAY', 'GAME', 'PRO', 'X', '2026', '\u2605'] },
  { name: 'Smart Speaker', faces: ['#ec4899', '#f472b6', '#db2777', '#fbcfe8', '#831843', '#fce7f3'], label: ['SOUND', 'HI-FI', 'BASS', '+', 'MAX', '\u266B'] },
  { name: 'Fitness Tracker', faces: ['#22c55e', '#4ade80', '#16a34a', '#bbf7d0', '#14532d', '#dcfce7'], label: ['FIT', 'HEALTH', 'TRACK', 'GO', 'PRO', '\u2665'] },
  { name: 'VR Headset', faces: ['#f59e0b', '#fbbf24', '#d97706', '#fef3c7', '#78350f', '#fef9c3'], label: ['VR', 'META', 'VIEW', '360', 'NEXT', '\u2736'] }
];

function App() {
  var _prod = useState(0), productIdx = _prod[0], setProductIdx = _prod[1];
  var _rotX = useState(-25), rotX = _rotX[0], setRotX = _rotX[1];
  var _rotY = useState(35), rotY = _rotY[0], setRotY = _rotY[1];
  var _zoom = useState(1), zoom = _zoom[0], setZoom = _zoom[1];
  var _auto = useState(true), autoRotate = _auto[0], setAutoRotate = _auto[1];
  var _speed = useState(30), speed = _speed[0], setSpeed = _speed[1];
  var _dragging = useState(false), dragging = _dragging[0], setDragging = _dragging[1];
  var lastPos = useRef({ x: 0, y: 0 });
  var animRef = useRef(null);

  var product = PRODUCTS[productIdx];

  useEffect(function() {
    if (!autoRotate || dragging) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }
    var animate = function() {
      setRotY(function(r) { return r + speed * 0.02; });
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return function() { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [autoRotate, speed, dragging]);

  var handleMouseDown = useCallback(function(e) {
    setDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  var handleMouseMove = useCallback(function(e) {
    if (!dragging) return;
    var dx = e.clientX - lastPos.current.x;
    var dy = e.clientY - lastPos.current.y;
    setRotY(function(r) { return r + dx * 0.5; });
    setRotX(function(r) { return Math.max(-80, Math.min(80, r - dy * 0.5)); });
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, [dragging]);

  var handleMouseUp = useCallback(function() {
    setDragging(false);
  }, []);

  var handleTouchStart = useCallback(function(e) {
    if (e.touches.length === 1) {
      setDragging(true);
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  var handleTouchMove = useCallback(function(e) {
    if (!dragging || e.touches.length !== 1) return;
    var dx = e.touches[0].clientX - lastPos.current.x;
    var dy = e.touches[0].clientY - lastPos.current.y;
    setRotY(function(r) { return r + dx * 0.5; });
    setRotX(function(r) { return Math.max(-80, Math.min(80, r - dy * 0.5)); });
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, [dragging]);

  var handleTouchEnd = useCallback(function() { setDragging(false); }, []);

  var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)', color: '#e2e8f0', fontFamily: "'Segoe UI', sans-serif", padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' };

  var size = 120 * zoom;

  var faceStyle = function(bg, transform) {
    return {
      position: 'absolute', width: size + 'px', height: size + 'px',
      background: bg, border: '1px solid rgba(255,255,255,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: (20 * zoom) + 'px', fontWeight: 'bold', color: 'rgba(255,255,255,0.9)',
      backfaceVisibility: 'visible', transform: transform,
      textShadow: '0 1px 3px rgba(0,0,0,0.4)', letterSpacing: '2px'
    };
  };

  var half = size / 2;
  var faces = [
    { transform: 'rotateY(0deg) translateZ(' + half + 'px)', bg: product.faces[0], label: product.label[0] },
    { transform: 'rotateY(180deg) translateZ(' + half + 'px)', bg: product.faces[1], label: product.label[1] },
    { transform: 'rotateY(90deg) translateZ(' + half + 'px)', bg: product.faces[2], label: product.label[2] },
    { transform: 'rotateY(-90deg) translateZ(' + half + 'px)', bg: product.faces[3], label: product.label[3] },
    { transform: 'rotateX(90deg) translateZ(' + half + 'px)', bg: product.faces[4], label: product.label[4] },
    { transform: 'rotateX(-90deg) translateZ(' + half + 'px)', bg: product.faces[5], label: product.label[5] }
  ];

  var sceneStyle = {
    width: '400px', height: '400px', perspective: '800px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', cursor: dragging ? 'grabbing' : 'grab',
    background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
    borderRadius: '20px', border: '1px solid #334155', position: 'relative',
    touchAction: 'none', userSelect: 'none'
  };

  var cubeStyle = {
    width: size + 'px', height: size + 'px', position: 'relative',
    transformStyle: 'preserve-3d',
    transform: 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)',
    transition: dragging ? 'none' : 'transform 0.05s linear'
  };

  var controlsStyle = {
    background: 'rgba(30,41,59,0.8)', borderRadius: '12px', padding: '20px',
    border: '1px solid #334155', maxWidth: '500px', width: '100%', marginTop: '20px'
  };

  var btnStyle = function(active) {
    return { padding: '8px 16px', background: active ? '#6366f1' : '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', transition: 'background 0.2s' };
  };

  var sliderRow = function(label, value, onChange, min, max, unit) {
    return React.createElement('div', {
      style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }
    }, [
      React.createElement('span', { key: 'l', style: { width: '120px', fontSize: '13px', color: '#94a3b8' } }, label),
      React.createElement('input', {
        key: 's', type: 'range', min: min, max: max, step: '0.1', value: value,
        onChange: function(e) { onChange(Number(e.target.value)); },
        style: { flex: 1, accentColor: '#6366f1' }
      }),
      React.createElement('span', { key: 'v', style: { width: '50px', fontSize: '13px', color: '#e2e8f0', textAlign: 'right' } }, Math.round(value * 10) / 10 + (unit || ''))
    ]);
  };

  var shadowSize = Math.round(60 + 40 * Math.abs(Math.sin(rotY * Math.PI / 180)));
  var shadow = React.createElement('div', {
    style: {
      position: 'absolute', bottom: '60px', width: shadowSize + 'px', height: '20px',
      background: 'radial-gradient(ellipse, rgba(0,0,0,0.3), transparent)',
      borderRadius: '50%', left: '50%', transform: 'translateX(-50%)'
    }
  });

  return React.createElement('div', { style: containerStyle, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd }, [
    React.createElement('a', { key: 'back', href: '/projects', style: Object.assign({}, backLinkStyle, { alignSelf: 'flex-start' }) }, '\u2190 Back to Projects'),
    React.createElement('h1', { key: 'title', style: { fontSize: '28px', fontWeight: 'bold', color: '#c084fc', marginBottom: '5px' } }, '3D Product Viewer'),
    React.createElement('p', { key: 'pname', style: { color: '#94a3b8', fontSize: '14px', marginBottom: '20px' } }, product.name + ' \u2014 Drag to rotate'),
    React.createElement('div', { key: 'products', style: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' } },
      PRODUCTS.map(function(p, i) {
        return React.createElement('button', {
          key: i, onClick: function() { setProductIdx(i); },
          style: Object.assign({}, btnStyle(i === productIdx), { display: 'flex', alignItems: 'center', gap: '6px' })
        }, [
          React.createElement('div', { key: 'swatch', style: { width: '12px', height: '12px', borderRadius: '3px', background: p.faces[0] } }),
          React.createElement('span', { key: 'name' }, p.name)
        ]);
      })
    ),
    React.createElement('div', {
      key: 'scene', style: sceneStyle,
      onMouseDown: handleMouseDown, onTouchStart: handleTouchStart
    }, [
      React.createElement('div', { key: 'cube', style: cubeStyle },
        faces.map(function(f, i) {
          return React.createElement('div', { key: i, style: faceStyle(f.bg, f.transform) }, f.label);
        })
      ),
      shadow
    ]),
    React.createElement('div', { key: 'info', style: { marginTop: '10px', fontSize: '12px', color: '#64748b' } },
      'X: ' + Math.round(rotX) + '\u00B0  Y: ' + Math.round(rotY % 360) + '\u00B0  Zoom: ' + Math.round(zoom * 100) + '%'),
    React.createElement('div', { key: 'controls', style: controlsStyle }, [
      React.createElement('div', { key: 'btns', style: { display: 'flex', gap: '10px', flexWrap: 'wrap' } }, [
        React.createElement('button', { key: 'auto', onClick: function() { setAutoRotate(!autoRotate); }, style: btnStyle(autoRotate) }, autoRotate ? '\u23F8 Stop Rotation' : '\u25B6 Auto Rotate'),
        React.createElement('button', { key: 'reset', onClick: function() { setRotX(-25); setRotY(35); setZoom(1); }, style: btnStyle(false) }, 'Reset View'),
        React.createElement('button', { key: 'front', onClick: function() { setRotX(0); setRotY(0); }, style: btnStyle(false) }, 'Front'),
        React.createElement('button', { key: 'top', onClick: function() { setRotX(-90); setRotY(0); }, style: btnStyle(false) }, 'Top')
      ]),
      sliderRow('Zoom', zoom, setZoom, 0.5, 2, 'x'),
      sliderRow('Rotation Speed', speed, setSpeed, 5, 100, '')
    ])
  ]);
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
