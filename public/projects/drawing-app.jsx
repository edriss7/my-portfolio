const { useState, useEffect, useRef, useCallback } = React;

var PRESET_COLORS = ['#ffffff', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c'];
var BRUSH_SIZES = [3, 8, 16];

function App() {
  var canvasRef = useRef(null);
  var _s1 = useState('#ffffff');
  var color = _s1[0], setColor = _s1[1];
  var _s2 = useState(3);
  var brushSize = _s2[0], setBrushSize = _s2[1];
  var _s3 = useState(false);
  var isEraser = _s3[0], setIsEraser = _s3[1];
  var _s4 = useState(false);
  var isDrawing = _s4[0], setIsDrawing = _s4[1];
  var _s5 = useState([]);
  var strokes = _s5[0], setStrokes = _s5[1];
  var currentStroke = useRef([]);
  var currentProps = useRef({});

  useEffect(function() {
    var canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    redrawAll();
  }, []);

  function redrawAll() {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    strokes.forEach(function(stroke) {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.eraser ? '#1a1a2e' : stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (var i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  }

  useEffect(function() {
    redrawAll();
  }, [strokes]);

  function getPos(e) {
    var canvas = canvasRef.current;
    var rect = canvas.getBoundingClientRect();
    var clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function startDrawing(e) {
    e.preventDefault();
    setIsDrawing(true);
    var pos = getPos(e);
    currentStroke.current = [pos];
    currentProps.current = { color: color, size: brushSize, eraser: isEraser };

    var canvas = canvasRef.current;
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = isEraser ? '#1a1a2e' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    var pos = getPos(e);
    currentStroke.current.push(pos);

    var canvas = canvasRef.current;
    var ctx = canvas.getContext('2d');
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function stopDrawing(e) {
    if (!isDrawing) return;
    if (e) e.preventDefault();
    setIsDrawing(false);
    if (currentStroke.current.length > 0) {
      var newStroke = {
        points: currentStroke.current.slice(),
        color: currentProps.current.color,
        size: currentProps.current.size,
        eraser: currentProps.current.eraser
      };
      setStrokes(function(prev) { return prev.concat([newStroke]); });
    }
    currentStroke.current = [];
  }

  function clearCanvas() {
    setStrokes([]);
    var canvas = canvasRef.current;
    if (canvas) {
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function undoStroke() {
    setStrokes(function(prev) {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  }

  function downloadImage() {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  var styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
      color: '#e0e0e0',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '0 0 40px'
    },
    backLink: { color: '#888', textDecoration: 'none', padding: '15px 20px', display: 'inline-block', fontSize: '14px' },
    header: { textAlign: 'center', fontSize: '28px', color: '#fff', margin: '0 0 25px' },
    content: { maxWidth: '800px', margin: '0 auto', padding: '0 20px' },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      flexWrap: 'wrap',
      marginBottom: '15px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '15px'
    },
    toolSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    toolLabel: { fontSize: '12px', color: '#888', marginRight: '4px' },
    colorBtn: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      border: '3px solid transparent',
      cursor: 'pointer',
      transition: 'border-color 0.2s'
    },
    sizeBtn: {
      borderRadius: '50%',
      border: '2px solid transparent',
      cursor: 'pointer',
      background: '#888',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    toolBtn: {
      padding: '8px 14px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '13px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    separator: {
      width: '1px',
      height: '30px',
      background: 'rgba(255,255,255,0.15)'
    },
    canvasWrapper: {
      borderRadius: '12px',
      overflow: 'hidden',
      border: '2px solid rgba(255,255,255,0.1)',
      marginBottom: '15px'
    },
    canvas: {
      display: 'block',
      width: '100%',
      height: '450px',
      cursor: 'crosshair',
      touchAction: 'none'
    },
    actionBar: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      flexWrap: 'wrap'
    }
  };

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.header }, 'Drawing App'),
    React.createElement('div', { style: styles.content },
      React.createElement('div', { style: styles.toolbar },
        React.createElement('div', { style: styles.toolSection },
          React.createElement('span', { style: styles.toolLabel }, 'Color:'),
          PRESET_COLORS.map(function(c) {
            return React.createElement('button', {
              key: c,
              style: Object.assign({}, styles.colorBtn, {
                background: c,
                borderColor: color === c && !isEraser ? '#fff' : 'transparent'
              }),
              onClick: function() { setColor(c); setIsEraser(false); },
              title: c
            });
          })
        ),
        React.createElement('div', { style: styles.separator }),
        React.createElement('div', { style: styles.toolSection },
          React.createElement('span', { style: styles.toolLabel }, 'Size:'),
          BRUSH_SIZES.map(function(s) {
            var dim = s + 14;
            return React.createElement('button', {
              key: s,
              style: Object.assign({}, styles.sizeBtn, {
                width: dim + 'px',
                height: dim + 'px',
                borderColor: brushSize === s ? '#9b59b6' : 'transparent',
                background: brushSize === s ? '#9b59b6' : '#555'
              }),
              onClick: function() { setBrushSize(s); }
            },
              React.createElement('div', {
                style: { width: s + 'px', height: s + 'px', borderRadius: '50%', background: '#fff' }
              })
            );
          })
        ),
        React.createElement('div', { style: styles.separator }),
        React.createElement('button', {
          style: Object.assign({}, styles.toolBtn, {
            background: isEraser ? 'rgba(231,76,60,0.4)' : 'rgba(255,255,255,0.1)',
            color: isEraser ? '#e74c3c' : '#ccc'
          }),
          onClick: function() { setIsEraser(function(e) { return !e; }); }
        }, 'Eraser ' + (isEraser ? '\u2713' : ''))
      ),
      React.createElement('div', { style: styles.canvasWrapper },
        React.createElement('canvas', {
          ref: canvasRef,
          style: styles.canvas,
          onMouseDown: startDrawing,
          onMouseMove: draw,
          onMouseUp: stopDrawing,
          onMouseLeave: stopDrawing,
          onTouchStart: startDrawing,
          onTouchMove: draw,
          onTouchEnd: stopDrawing
        })
      ),
      React.createElement('div', { style: styles.actionBar },
        React.createElement('button', {
          style: Object.assign({}, styles.toolBtn, { background: 'rgba(255,255,255,0.1)', color: '#ccc' }),
          onClick: undoStroke
        }, '\u21A9 Undo'),
        React.createElement('button', {
          style: Object.assign({}, styles.toolBtn, { background: 'rgba(231,76,60,0.2)', color: '#e74c3c' }),
          onClick: clearCanvas
        }, 'Clear Canvas'),
        React.createElement('button', {
          style: Object.assign({}, styles.toolBtn, { background: 'linear-gradient(135deg, #9b59b6, #3498db)', color: '#fff' }),
          onClick: downloadImage
        }, 'Download PNG')
      ),
      React.createElement('div', {
        style: { textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '13px' }
      }, 'Strokes: ' + strokes.length + ' | ' + (isEraser ? 'Eraser Mode' : 'Drawing with ' + color) + ' | Brush: ' + brushSize + 'px')
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
