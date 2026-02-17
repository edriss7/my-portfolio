const { useState, useEffect, useRef, useCallback } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '30px' };
var cardStyle = { background: 'rgba(30,30,58,0.8)', borderRadius: '12px', padding: '20px', border: '1px solid #2a2a4a' };
var btnStyle = { background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', border: 'none', borderRadius: '8px', color: '#fff', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' };

var animations = [
  { name: 'Fade', id: 'fade', color: '#6c5ce7', keyframes: '@keyframes fade { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 0; } }' },
  { name: 'Slide', id: 'slide', color: '#00cec9', keyframes: '@keyframes slide { 0% { transform: translateX(-50px); } 50% { transform: translateX(50px); } 100% { transform: translateX(-50px); } }' },
  { name: 'Bounce', id: 'bounce', color: '#fd79a8', keyframes: '@keyframes bounce { 0%, 100% { transform: translateY(0); } 25% { transform: translateY(-30px); } 50% { transform: translateY(0); } 75% { transform: translateY(-15px); } }' },
  { name: 'Rotate', id: 'rotate', color: '#ffa502', keyframes: '@keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }' },
  { name: 'Scale', id: 'scale', color: '#2ed573', keyframes: '@keyframes scale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.5); } }' },
  { name: 'Shake', id: 'shake', color: '#ff6b6b', keyframes: '@keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }' },
  { name: 'Pulse', id: 'pulse', color: '#a29bfe', keyframes: '@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } }' },
  { name: 'Flip', id: 'flip', color: '#1e90ff', keyframes: '@keyframes flip { 0% { transform: perspective(400px) rotateY(0); } 100% { transform: perspective(400px) rotateY(360deg); } }' },
  { name: 'Swing', id: 'swing', color: '#fdcb6e', keyframes: '@keyframes swing { 0%, 100% { transform: rotate(0deg); } 20% { transform: rotate(15deg); } 40% { transform: rotate(-10deg); } 60% { transform: rotate(5deg); } 80% { transform: rotate(-5deg); } }' },
  { name: 'Wobble', id: 'wobble', color: '#e17055', keyframes: '@keyframes wobble { 0%, 100% { transform: translateX(0) rotate(0); } 15% { transform: translateX(-15px) rotate(-5deg); } 30% { transform: translateX(10px) rotate(3deg); } 45% { transform: translateX(-10px) rotate(-3deg); } 60% { transform: translateX(5px) rotate(2deg); } 75% { transform: translateX(-3px) rotate(-1deg); } }' },
  { name: 'Zoom', id: 'zoom', color: '#00b894', keyframes: '@keyframes zoom { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }' },
  { name: 'Flash', id: 'flash', color: '#dfe6e9', keyframes: '@keyframes flash { 0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: 0; } }' }
];

function App() {
  var _playing = useState({}), playing = _playing[0], setPlaying = _playing[1];
  var _dur = useState(1.5), duration = _dur[0], setDuration = _dur[1];
  var _ease = useState('ease'), easing = _ease[0], setEasing = _ease[1];
  var _allPlay = useState(false), allPlaying = _allPlay[0], setAllPlaying = _allPlay[1];
  var _styleInjected = useState(false), styleInjected = _styleInjected[0], setStyleInjected = _styleInjected[1];

  // Inject keyframes
  useEffect(function() {
    if (styleInjected) return;
    var style = document.createElement('style');
    style.textContent = animations.map(function(a) { return a.keyframes; }).join('\n');
    document.head.appendChild(style);
    setStyleInjected(true);
    return function() { document.head.removeChild(style); };
  }, [styleInjected]);

  var toggleAnimation = useCallback(function(id) {
    setPlaying(function(prev) {
      var copy = Object.assign({}, prev);
      copy[id] = !copy[id];
      return copy;
    });
  }, []);

  var toggleAll = function() {
    var newState = !allPlaying;
    setAllPlaying(newState);
    var newPlaying = {};
    animations.forEach(function(a) { newPlaying[a.id] = newState; });
    setPlaying(newPlaying);
  };

  var easings = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'];
  var durations = [0.3, 0.5, 0.75, 1, 1.5, 2, 3];

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '32px', fontWeight: '700', marginBottom: '8px', background: 'linear-gradient(90deg, #fd79a8, #ffa502, #2ed573, #1e90ff, #6c5ce7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Animation Library'),
    React.createElement('p', { style: { color: '#888', marginBottom: '20px' } }, '12 CSS animations with interactive controls'),

    // Global controls
    React.createElement('div', { style: Object.assign({}, cardStyle, { marginBottom: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }) },
      React.createElement('div', null,
        React.createElement('label', { style: { fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' } }, 'Duration'),
        React.createElement('div', { style: { display: 'flex', gap: '4px', flexWrap: 'wrap' } },
          durations.map(function(d) {
            return React.createElement('button', { key: d, style: { background: duration === d ? '#6c5ce7' : '#1e1e3a', border: '1px solid ' + (duration === d ? '#6c5ce7' : '#3a3a5c'), borderRadius: '6px', color: duration === d ? '#fff' : '#888', cursor: 'pointer', padding: '4px 10px', fontSize: '12px' }, onClick: function() { setDuration(d); } }, d + 's');
          })
        )
      ),
      React.createElement('div', null,
        React.createElement('label', { style: { fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' } }, 'Easing'),
        React.createElement('div', { style: { display: 'flex', gap: '4px', flexWrap: 'wrap' } },
          easings.map(function(e) {
            return React.createElement('button', { key: e, style: { background: easing === e ? '#6c5ce7' : '#1e1e3a', border: '1px solid ' + (easing === e ? '#6c5ce7' : '#3a3a5c'), borderRadius: '6px', color: easing === e ? '#fff' : '#888', cursor: 'pointer', padding: '4px 10px', fontSize: '12px' }, onClick: function() { setEasing(e); } }, e);
          })
        )
      ),
      React.createElement('div', { style: { marginLeft: 'auto' } },
        React.createElement('button', { style: Object.assign({}, btnStyle, { background: allPlaying ? '#ff6b6b' : 'linear-gradient(135deg, #6c5ce7, #a29bfe)' }), onClick: toggleAll }, allPlaying ? 'Stop All' : 'Play All')
      )
    ),

    // Animation grid
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' } },
      animations.map(function(anim) {
        var isPlaying = playing[anim.id];
        var animStyle = isPlaying ? {
          animation: anim.id + ' ' + duration + 's ' + easing + ' infinite'
        } : {};

        return React.createElement('div', { key: anim.id, style: Object.assign({}, cardStyle, { display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'border-color 0.3s', borderColor: isPlaying ? anim.color + '60' : '#2a2a4a' }) },
          // Animation preview area
          React.createElement('div', { style: { width: '100%', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a1a', borderRadius: '8px', marginBottom: '14px', overflow: 'hidden' } },
            React.createElement('div', { style: Object.assign({
              width: '50px', height: '50px', borderRadius: '10px',
              background: 'linear-gradient(135deg, ' + anim.color + ', ' + anim.color + '88)',
              boxShadow: isPlaying ? '0 0 20px ' + anim.color + '44' : 'none',
              transition: isPlaying ? 'none' : 'all 0.3s'
            }, animStyle) })
          ),

          // Name and code
          React.createElement('div', { style: { width: '100%', marginBottom: '12px' } },
            React.createElement('div', { style: { fontSize: '16px', fontWeight: '600', color: anim.color, marginBottom: '4px', textAlign: 'center' } }, anim.name),
            React.createElement('div', { style: { fontSize: '11px', color: '#666', textAlign: 'center', fontFamily: 'monospace' } }, 'animation: ' + anim.id + ' ' + duration + 's')
          ),

          // Play/Pause button
          React.createElement('button', { style: Object.assign({}, btnStyle, {
            width: '100%',
            background: isPlaying
              ? 'linear-gradient(135deg, #ff6b6b, #e17055)'
              : 'linear-gradient(135deg, ' + anim.color + ', ' + anim.color + '88)',
            fontSize: '12px', padding: '8px'
          }), onClick: function() { toggleAnimation(anim.id); } },
            isPlaying ? '\u23f8 Pause' : '\u25b6 Play'
          ),

          // Status indicator
          React.createElement('div', { style: { marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' } },
            React.createElement('div', { style: { width: '6px', height: '6px', borderRadius: '50%', background: isPlaying ? '#2ed573' : '#555' } }),
            React.createElement('span', { style: { fontSize: '11px', color: isPlaying ? '#2ed573' : '#555' } }, isPlaying ? 'Playing' : 'Stopped')
          )
        );
      })
    ),

    // CSS code preview
    React.createElement('div', { style: Object.assign({}, cardStyle, { marginTop: '24px' }) },
      React.createElement('h3', { style: { margin: '0 0 12px 0', color: '#a29bfe', fontSize: '15px' } }, 'CSS Keyframes Reference'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' } },
        animations.map(function(anim) {
          return React.createElement('div', { key: anim.id, style: { background: '#0a0a1a', borderRadius: '8px', padding: '12px', fontFamily: "'Consolas', 'Monaco', monospace", fontSize: '11px', lineHeight: '1.5' } },
            React.createElement('span', { style: { color: '#e535ab' } }, '@keyframes '),
            React.createElement('span', { style: { color: anim.color } }, anim.id),
            React.createElement('span', { style: { color: '#888' } }, ' { ... }'),
            React.createElement('div', { style: { marginTop: '4px', color: '#555', fontSize: '10px' } }, 'Usage: animation: ' + anim.id + ' ' + duration + 's ' + easing + ' infinite;')
          );
        })
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
