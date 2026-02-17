const { useState, useEffect, useRef } = React;

function getNextNewYear() {
  var now = new Date();
  var year = now.getMonth() >= 0 ? now.getFullYear() + 1 : now.getFullYear();
  return new Date(year, 0, 1).toISOString().slice(0, 16);
}

function getNextChristmas() {
  var now = new Date();
  var year = now.getMonth() === 11 && now.getDate() > 25 ? now.getFullYear() + 1 : now.getFullYear();
  return new Date(year, 11, 25).toISOString().slice(0, 16);
}

function getNextSummer() {
  var now = new Date();
  var year = now.getMonth() >= 5 ? now.getFullYear() + 1 : now.getFullYear();
  return new Date(year, 5, 21).toISOString().slice(0, 16);
}

var presets = [
  { label: 'New Year', getDate: getNextNewYear },
  { label: 'Christmas', getDate: getNextChristmas },
  { label: 'Summer', getDate: getNextSummer },
];

var styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
  },
  backLink: {
    color: '#7eb8ff',
    textDecoration: 'none',
    fontSize: '14px',
    display: 'inline-block',
    marginBottom: '20px',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    color: '#ffffff',
    marginBottom: '30px',
  },
  card: {
    maxWidth: '600px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    textAlign: 'center',
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  dateInput: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
  },
  presetRow: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  presetBtn: {
    padding: '8px 18px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: '#ccc',
    cursor: 'pointer',
    fontSize: '13px',
  },
  presetBtnActive: {
    background: '#7c4dff',
    color: '#fff',
    border: '1px solid #7c4dff',
  },
  ringWrapper: {
    position: 'relative',
    width: '200px',
    height: '200px',
    margin: '0 auto 30px',
  },
  ringCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  ringLabel: {
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase',
  },
  ringValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#00e5ff',
  },
  timeUnits: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  timeUnit: {
    textAlign: 'center',
    minWidth: '80px',
  },
  timeValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#00e5ff',
    fontFamily: "'Courier New', monospace",
  },
  timeLabel: {
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '4px',
  },
  separator: {
    fontSize: '2.5rem',
    color: '#444',
    alignSelf: 'flex-start',
    paddingTop: '4px',
  },
  celebration: {
    fontSize: '3rem',
    textAlign: 'center',
    marginBottom: '20px',
    animation: 'bounce 0.5s infinite alternate',
  },
  celebrationText: {
    fontSize: '1.5rem',
    color: '#ffab00',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
  },
  eventName: {
    fontSize: '1.1rem',
    color: '#b388ff',
    marginBottom: '20px',
  },
};

function App() {
  var _target = useState('');
  var target = _target[0], setTarget = _target[1];
  var _label = useState('');
  var label = _label[0], setLabel = _label[1];
  var _now = useState(Date.now());
  var now = _now[0], setNow = _now[1];
  var _done = useState(false);
  var done = _done[0], setDone = _done[1];
  var _celebFrames = useState(0);
  var celebFrames = _celebFrames[0], setCelebFrames = _celebFrames[1];

  useEffect(function () {
    var id = setInterval(function () { setNow(Date.now()); }, 1000);
    return function () { clearInterval(id); };
  }, []);

  var targetMs = target ? new Date(target).getTime() : 0;
  var diff = targetMs - now;
  var expired = target && diff <= 0;

  useEffect(function () {
    if (expired && !done) {
      setDone(true);
      setCelebFrames(0);
    }
    if (!expired) {
      setDone(false);
    }
  }, [expired]);

  useEffect(function () {
    if (done && celebFrames < 50) {
      var id = setTimeout(function () { setCelebFrames(celebFrames + 1); }, 100);
      return function () { clearTimeout(id); };
    }
  }, [done, celebFrames]);

  var days = 0, hours = 0, minutes = 0, seconds = 0;
  if (target && diff > 0) {
    days = Math.floor(diff / 86400000);
    hours = Math.floor((diff % 86400000) / 3600000);
    minutes = Math.floor((diff % 3600000) / 60000);
    seconds = Math.floor((diff % 60000) / 1000);
  }

  var totalSeconds = target && diff > 0 ? diff / 1000 : 0;
  var origDiff = targetMs - (targetMs - 86400000 * 365);
  var progressPct = target && diff > 0 ? Math.min(100, Math.max(0, (1 - diff / (86400000 * 365)) * 100)) : (target ? 100 : 0);

  var radius = 85;
  var circumference = 2 * Math.PI * radius;
  var offset = circumference - (progressPct / 100) * circumference;

  function handlePreset(preset) {
    var dateStr = preset.getDate();
    setTarget(dateStr);
    setLabel(preset.label);
  }

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  var confetti = [];
  if (done) {
    var confettiColors = ['#ff1744', '#ffab00', '#00e5ff', '#69f0ae', '#7c4dff', '#ff69b4'];
    for (var i = 0; i < 30; i++) {
      confetti.push(
        React.createElement('div', {
          key: 'c' + i,
          style: {
            position: 'fixed',
            left: (Math.random() * 100) + '%',
            top: (Math.random() * 100) + '%',
            width: '10px',
            height: '10px',
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            background: confettiColors[i % confettiColors.length],
            opacity: Math.random() * 0.8 + 0.2,
            transform: 'rotate(' + Math.floor(Math.random() * 360) + 'deg)',
            zIndex: 999,
            pointerEvents: 'none',
            animation: 'none',
          },
        })
      );
    }
  }

  return React.createElement('div', { style: styles.container },
    done && confetti,
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, '\u23f3 Countdown Timer'),
    React.createElement('div', { style: styles.card },
      React.createElement('div', { style: styles.inputRow },
        React.createElement('input', {
          type: 'datetime-local',
          style: styles.dateInput,
          value: target,
          onChange: function (e) { setTarget(e.target.value); setLabel('Custom Event'); },
        })
      ),
      React.createElement('div', { style: styles.presetRow },
        presets.map(function (p) {
          return React.createElement('button', {
            key: p.label,
            style: Object.assign({}, styles.presetBtn, label === p.label ? styles.presetBtnActive : {}),
            onClick: function () { handlePreset(p); },
          }, p.label);
        })
      ),
      label && React.createElement('div', { style: styles.eventName }, 'Counting down to: ' + label),
      done ? React.createElement('div', null,
        React.createElement('div', { style: styles.celebration }, '\ud83c\udf89\ud83c\udf8a\ud83c\udf89'),
        React.createElement('div', { style: styles.celebrationText }, 'Time is up! ' + (label || 'Event') + ' has arrived!')
      ) : React.createElement('div', null,
        React.createElement('div', { style: styles.ringWrapper },
          React.createElement('svg', {
            width: '200',
            height: '200',
            viewBox: '0 0 200 200',
          },
            React.createElement('circle', {
              cx: '100', cy: '100', r: String(radius),
              fill: 'none',
              stroke: 'rgba(255,255,255,0.08)',
              strokeWidth: '8',
            }),
            React.createElement('circle', {
              cx: '100', cy: '100', r: String(radius),
              fill: 'none',
              stroke: '#7c4dff',
              strokeWidth: '8',
              strokeDasharray: String(circumference),
              strokeDashoffset: String(offset),
              strokeLinecap: 'round',
              transform: 'rotate(-90 100 100)',
              style: { transition: 'stroke-dashoffset 1s' },
            })
          ),
          React.createElement('div', { style: styles.ringCenter },
            React.createElement('div', { style: styles.ringValue }, pad(days)),
            React.createElement('div', { style: styles.ringLabel }, 'Days')
          )
        ),
        React.createElement('div', { style: styles.timeUnits },
          React.createElement('div', { style: styles.timeUnit },
            React.createElement('div', { style: styles.timeValue }, pad(days)),
            React.createElement('div', { style: styles.timeLabel }, 'Days')
          ),
          React.createElement('span', { style: styles.separator }, ':'),
          React.createElement('div', { style: styles.timeUnit },
            React.createElement('div', { style: styles.timeValue }, pad(hours)),
            React.createElement('div', { style: styles.timeLabel }, 'Hours')
          ),
          React.createElement('span', { style: styles.separator }, ':'),
          React.createElement('div', { style: styles.timeUnit },
            React.createElement('div', { style: styles.timeValue }, pad(minutes)),
            React.createElement('div', { style: styles.timeLabel }, 'Minutes')
          ),
          React.createElement('span', { style: styles.separator }, ':'),
          React.createElement('div', { style: styles.timeUnit },
            React.createElement('div', { style: styles.timeValue }, pad(seconds)),
            React.createElement('div', { style: styles.timeLabel }, 'Seconds')
          )
        )
      ),
      !target && React.createElement('div', {
        style: { color: '#666', fontSize: '15px', marginTop: '10px' },
      }, 'Set a date or pick a preset event to start the countdown')
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
