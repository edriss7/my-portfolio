const { useState, useEffect, useRef, useCallback } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'inline-block' };

var BAR_COUNT = 32;

var THEMES = {
  rainbow: function(i, total) {
    var hue = (i / total) * 360;
    return 'hsl(' + hue + ', 80%, 55%)';
  },
  blue: function(i, total) {
    var l = 30 + (i / total) * 40;
    return 'hsl(210, 90%, ' + l + '%)';
  },
  green: function(i, total) {
    var l = 25 + (i / total) * 45;
    return 'hsl(140, 80%, ' + l + '%)';
  },
  fire: function(i, total) {
    var hue = (i / total) * 60;
    return 'hsl(' + hue + ', 100%, 50%)';
  }
};

function App() {
  var _p = useState(true), playing = _p[0], setPlaying = _p[1];
  var _theme = useState('rainbow'), theme = _theme[0], setTheme = _theme[1];
  var _speed = useState(50), speed = _speed[0], setSpeed = _speed[1];
  var _amp = useState(80), amplitude = _amp[0], setAmplitude = _amp[1];
  var _bars = useState(function() {
    var b = [];
    for (var i = 0; i < BAR_COUNT; i++) b.push(Math.random() * 80 + 10);
    return b;
  }), bars = _bars[0], setBars = _bars[1];
  var _peak = useState(function() {
    var b = [];
    for (var i = 0; i < BAR_COUNT; i++) b.push(50);
    return b;
  }), peaks = _peak[0], setPeaks = _peak[1];
  var frameRef = useRef(null);
  var lastTimeRef = useRef(0);

  useEffect(function() {
    if (!playing) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      return;
    }
    var interval = 120 - speed;
    var animate = function(timestamp) {
      if (timestamp - lastTimeRef.current >= interval) {
        lastTimeRef.current = timestamp;
        setBars(function(prev) {
          return prev.map(function(v, i) {
            var target = Math.random() * amplitude + (100 - amplitude) * 0.1;
            var center = Math.sin(Date.now() * 0.002 + i * 0.3) * (amplitude * 0.3) + amplitude * 0.5;
            target = (target + center) / 2;
            return v + (target - v) * 0.3;
          });
        });
        setPeaks(function(prev) {
          return prev.map(function(p, i) {
            return Math.max(p - 1.5, bars[i] || 0);
          });
        });
      }
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return function() { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [playing, speed, amplitude]);

  var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)', color: '#e2e8f0', fontFamily: "'Segoe UI', sans-serif", padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' };

  var visualizerStyle = {
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '3px',
    height: '350px', width: '100%', maxWidth: '800px',
    background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '20px 20px 0 20px',
    border: '1px solid #334155', boxSizing: 'border-box', position: 'relative', overflow: 'hidden'
  };

  var controlsStyle = {
    background: 'rgba(30,41,59,0.8)', borderRadius: '12px', padding: '20px',
    border: '1px solid #334155', maxWidth: '800px', width: '100%', marginTop: '20px'
  };

  var btnStyle = function(active) {
    return {
      padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer',
      fontSize: '14px', fontWeight: 'bold', color: '#fff',
      background: active ? '#6366f1' : '#334155', transition: 'all 0.2s'
    };
  };

  var themeBtn = function(name, label) {
    return React.createElement('button', {
      key: name,
      onClick: function() { setTheme(name); },
      style: Object.assign({}, btnStyle(theme === name), { padding: '8px 14px', fontSize: '12px' })
    }, label);
  };

  var sliderRow = function(label, value, onChange, min, max) {
    return React.createElement('div', {
      style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }
    }, [
      React.createElement('span', { key: 'l', style: { width: '100px', fontSize: '13px', color: '#94a3b8' } }, label),
      React.createElement('input', {
        key: 'slider', type: 'range', min: min, max: max, value: value,
        onChange: function(e) { onChange(Number(e.target.value)); },
        style: { flex: 1, accentColor: '#6366f1' }
      }),
      React.createElement('span', { key: 'v', style: { width: '40px', fontSize: '13px', color: '#e2e8f0', textAlign: 'right' } }, value)
    ]);
  };

  var reflection = React.createElement('div', {
    style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '3px', height: '50px', width: '100%', maxWidth: '800px', opacity: 0.15, transform: 'scaleY(-1)', overflow: 'hidden' }
  }, bars.map(function(h, i) {
    var barH = Math.max(2, (h / 100) * 300);
    var color = THEMES[theme](i, BAR_COUNT);
    return React.createElement('div', {
      key: i,
      style: { flex: 1, maxWidth: '20px', height: Math.min(barH, 50) + 'px', background: color, borderRadius: '0 0 3px 3px' }
    });
  }));

  var avgLevel = bars.reduce(function(a, b) { return a + b; }, 0) / bars.length;
  var levelColor = avgLevel < 40 ? '#22c55e' : avgLevel < 70 ? '#fbbf24' : '#ef4444';

  return React.createElement('div', { style: containerStyle }, [
    React.createElement('a', { key: 'back', href: '/projects', style: Object.assign({}, backLinkStyle, { alignSelf: 'flex-start' }) }, '\u2190 Back to Projects'),
    React.createElement('h1', { key: 'title', style: { fontSize: '28px', fontWeight: 'bold', color: '#c084fc', marginBottom: '5px' } }, 'Audio Visualizer'),
    React.createElement('p', { key: 'sub', style: { color: '#94a3b8', fontSize: '13px', marginBottom: '20px' } }, 'Simulated equalizer with ' + BAR_COUNT + ' frequency bands'),
    React.createElement('div', { key: 'level', style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' } }, [
      React.createElement('span', { key: 'l', style: { fontSize: '12px', color: '#94a3b8' } }, 'Level:'),
      React.createElement('div', { key: 'bar', style: { width: '200px', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' } },
        React.createElement('div', { style: { width: avgLevel + '%', height: '100%', background: levelColor, transition: 'width 0.1s, background 0.3s', borderRadius: '3px' } })
      ),
      React.createElement('span', { key: 'v', style: { fontSize: '12px', color: levelColor } }, Math.round(avgLevel) + '%')
    ]),
    React.createElement('div', { key: 'viz', style: visualizerStyle },
      bars.map(function(h, i) {
        var barH = Math.max(2, (h / 100) * 300);
        var peakH = Math.max(2, (peaks[i] / 100) * 300);
        var color = THEMES[theme](i, BAR_COUNT);
        return React.createElement('div', {
          key: i,
          style: { flex: 1, maxWidth: '20px', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }
        }, [
          React.createElement('div', {
            key: 'peak',
            style: { position: 'absolute', bottom: peakH + 'px', left: 0, right: 0, height: '3px', background: color, opacity: 0.6, transition: 'bottom 0.1s' }
          }),
          React.createElement('div', {
            key: 'bar',
            style: {
              height: barH + 'px', background: 'linear-gradient(to top, ' + color + ', ' + color + 'cc)',
              borderRadius: '3px 3px 0 0', transition: 'height 0.08s',
              boxShadow: '0 0 8px ' + color + '44'
            }
          })
        ]);
      })
    ),
    reflection,
    React.createElement('div', { key: 'controls', style: controlsStyle }, [
      React.createElement('div', { key: 'row1', style: { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' } }, [
        React.createElement('button', {
          key: 'play',
          onClick: function() { setPlaying(!playing); },
          style: Object.assign({}, btnStyle(true), { background: playing ? '#ef4444' : '#22c55e', minWidth: '100px' })
        }, playing ? '\u23F8 Pause' : '\u25B6 Play'),
        React.createElement('span', { key: 'sep', style: { color: '#334155', margin: '0 5px' } }, '|'),
        React.createElement('span', { key: 'tl', style: { fontSize: '13px', color: '#94a3b8' } }, 'Theme:'),
        themeBtn('rainbow', 'Rainbow'),
        themeBtn('blue', 'Ocean'),
        themeBtn('green', 'Forest'),
        themeBtn('fire', 'Fire')
      ]),
      sliderRow('Speed', speed, setSpeed, 10, 100),
      sliderRow('Amplitude', amplitude, setAmplitude, 10, 100)
    ])
  ]);
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
