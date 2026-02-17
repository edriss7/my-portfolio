const { useState, useEffect, useRef } = React;

const styles = {
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
    maxWidth: '500px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  timeDisplay: {
    textAlign: 'center',
    fontSize: '4rem',
    fontFamily: "'Courier New', monospace",
    color: '#00e5ff',
    margin: '20px 0',
    letterSpacing: '2px',
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  btn: {
    padding: '12px 28px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.1s',
  },
  startBtn: {
    background: '#00c853',
    color: '#fff',
  },
  stopBtn: {
    background: '#ff1744',
    color: '#fff',
  },
  resetBtn: {
    background: '#455a64',
    color: '#fff',
  },
  lapBtn: {
    background: '#2979ff',
    color: '#fff',
  },
  lapsTitle: {
    fontSize: '1.2rem',
    color: '#aaa',
    marginBottom: '10px',
  },
  lapItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    fontSize: '14px',
  },
  bestLap: {
    background: 'rgba(0,200,83,0.15)',
    color: '#69f0ae',
    borderRadius: '4px',
  },
  worstLap: {
    background: 'rgba(255,23,68,0.15)',
    color: '#ff8a80',
    borderRadius: '4px',
  },
  lapList: {
    maxHeight: '250px',
    overflowY: 'auto',
  },
};

function App() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);
  const lastLapRef = useRef(0);

  useEffect(function () {
    if (running) {
      intervalRef.current = setInterval(function () {
        setTime(function (prev) { return prev + 10; });
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return function () { clearInterval(intervalRef.current); };
  }, [running]);

  function formatTime(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = Math.floor((ms % 60000) / 1000);
    var centiseconds = Math.floor((ms % 1000) / 10);
    return (
      (minutes < 10 ? '0' : '') + minutes + ':' +
      (seconds < 10 ? '0' : '') + seconds + '.' +
      (centiseconds < 10 ? '0' : '') + centiseconds
    );
  }

  function handleStartStop() {
    if (!running && time === 0) {
      lastLapRef.current = 0;
    }
    setRunning(!running);
  }

  function handleReset() {
    setRunning(false);
    setTime(0);
    setLaps([]);
    lastLapRef.current = 0;
  }

  function handleLap() {
    if (!running) return;
    var lapTime = time - lastLapRef.current;
    lastLapRef.current = time;
    setLaps(function (prev) {
      return [{ id: prev.length + 1, lapTime: lapTime, totalTime: time }].concat(prev);
    });
  }

  var lapTimes = laps.map(function (l) { return l.lapTime; });
  var bestLapTime = lapTimes.length > 0 ? Math.min.apply(null, lapTimes) : null;
  var worstLapTime = lapTimes.length > 0 ? Math.max.apply(null, lapTimes) : null;

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, '\u23F1 Stopwatch'),
    React.createElement('div', { style: styles.card },
      React.createElement('div', { style: styles.timeDisplay }, formatTime(time)),
      React.createElement('div', { style: styles.btnRow },
        React.createElement('button', {
          style: Object.assign({}, styles.btn, running ? styles.stopBtn : styles.startBtn),
          onClick: handleStartStop,
        }, running ? 'Stop' : 'Start'),
        React.createElement('button', {
          style: Object.assign({}, styles.btn, styles.lapBtn),
          onClick: handleLap,
          disabled: !running,
        }, 'Lap'),
        React.createElement('button', {
          style: Object.assign({}, styles.btn, styles.resetBtn),
          onClick: handleReset,
        }, 'Reset')
      ),
      laps.length > 0 && React.createElement('div', null,
        React.createElement('div', { style: styles.lapsTitle }, 'Laps (' + laps.length + ')'),
        React.createElement('div', { style: styles.lapList },
          laps.map(function (lap) {
            var isBest = lapTimes.length > 1 && lap.lapTime === bestLapTime;
            var isWorst = lapTimes.length > 1 && lap.lapTime === worstLapTime;
            var itemStyle = Object.assign({}, styles.lapItem,
              isBest ? styles.bestLap : {},
              isWorst ? styles.worstLap : {}
            );
            return React.createElement('div', { key: lap.id, style: itemStyle },
              React.createElement('span', null, 'Lap ' + lap.id),
              React.createElement('span', null, formatTime(lap.lapTime)),
              React.createElement('span', null, formatTime(lap.totalTime)),
              isBest ? React.createElement('span', { style: { color: '#69f0ae' } }, 'Best') : null,
              isWorst ? React.createElement('span', { style: { color: '#ff8a80' } }, 'Worst') : null
            );
          })
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
