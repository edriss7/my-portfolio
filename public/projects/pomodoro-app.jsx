const { useState, useEffect, useRef, useCallback } = React;

function App() {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [flashNotification, setFlashNotification] = useState(false);
  const intervalRef = useRef(null);

  var totalTime = isBreak ? breakDuration * 60 : workDuration * 60;
  var progress = 1 - (timeLeft / totalTime);
  var minutes = Math.floor(timeLeft / 60);
  var seconds = timeLeft % 60;
  var displayTime = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

  useEffect(function() {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(function() {
        setTimeLeft(function(prev) { return prev - 1; });
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(intervalRef.current);
      setFlashNotification(true);
      setTimeout(function() { setFlashNotification(false); }, 3000);
      if (!isBreak) {
        setSessions(function(prev) { return prev + 1; });
        setIsBreak(true);
        setTimeLeft(breakDuration * 60);
        setIsRunning(true);
      } else {
        setIsBreak(false);
        setTimeLeft(workDuration * 60);
        setIsRunning(false);
      }
    }
    return function() { clearInterval(intervalRef.current); };
  }, [isRunning, timeLeft, isBreak, workDuration, breakDuration]);

  var toggleRunning = function() { setIsRunning(!isRunning); };
  var resetTimer = function() {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(workDuration * 60);
    clearInterval(intervalRef.current);
  };

  var applySettings = function(w, b) {
    setWorkDuration(w);
    setBreakDuration(b);
    if (!isBreak) {
      setTimeLeft(w * 60);
    } else {
      setTimeLeft(b * 60);
    }
    setIsRunning(false);
    setShowSettings(false);
  };

  var radius = 120;
  var circumference = 2 * Math.PI * radius;
  var dashOffset = circumference * (1 - progress);
  var accentColor = isBreak ? '#22c55e' : '#ef4444';

  var styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0ff', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px' },
    backLink: { color: '#8888ff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' },
    title: { textAlign: 'center', fontSize: '32px', marginBottom: '10px', color: '#ffffff' },
    subtitle: { textAlign: 'center', fontSize: '16px', color: '#aaa', marginBottom: '40px' },
    timerSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' },
    phaseLabel: { fontSize: '20px', fontWeight: 'bold', color: accentColor, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '3px' },
    circleContainer: { position: 'relative', width: '280px', height: '280px', marginBottom: '30px' },
    timeDisplay: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '52px', fontWeight: 'bold', fontFamily: 'monospace', color: '#fff' },
    controls: { display: 'flex', gap: '15px', marginBottom: '30px' },
    controlBtn: { padding: '12px 30px', fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.3s' },
    sessionInfo: { display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px' },
    sessionCard: { background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '15px 25px', textAlign: 'center' },
    sessionLabel: { fontSize: '12px', color: '#aaa', textTransform: 'uppercase', marginBottom: '5px' },
    sessionValue: { fontSize: '28px', fontWeight: 'bold', color: accentColor },
    settingsBtn: { background: 'transparent', border: '2px solid rgba(255,255,255,0.2)', color: '#aaa', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    settingsCard: { background: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)', borderRadius: '20px', padding: '30px', border: '1px solid rgba(255,255,255,0.15)', minWidth: '320px' },
    settingsTitle: { fontSize: '20px', marginBottom: '20px', textAlign: 'center' },
    settingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    settingLabel: { fontSize: '14px', color: '#ccc' },
    settingInput: { width: '80px', padding: '8px', fontSize: '16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', textAlign: 'center' },
    flash: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.15)', zIndex: 999, pointerEvents: 'none', animation: 'fadeout 3s forwards' },
    notification: { position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: accentColor, color: '#fff', padding: '15px 30px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', zIndex: 1001 },
    pomodoroCircles: { display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }
  };

  var tempWork = useRef(workDuration);
  var tempBreak = useRef(breakDuration);

  return React.createElement('div', { style: styles.container },
    flashNotification && React.createElement('div', { style: styles.notification },
      isBreak ? 'Break time! Relax for a moment.' : 'Great work! Time for a new session.'
    ),
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, 'Pomodoro Timer'),
    React.createElement('p', { style: styles.subtitle }, 'Stay focused and productive'),

    React.createElement('div', { style: styles.timerSection },
      React.createElement('div', { style: styles.phaseLabel }, isBreak ? 'Break' : 'Focus'),

      React.createElement('div', { style: styles.circleContainer },
        React.createElement('svg', { width: '280', height: '280', viewBox: '0 0 280 280' },
          React.createElement('circle', { cx: '140', cy: '140', r: radius, fill: 'none', stroke: 'rgba(255,255,255,0.08)', strokeWidth: '10' }),
          React.createElement('circle', {
            cx: '140', cy: '140', r: radius, fill: 'none', stroke: accentColor, strokeWidth: '10',
            strokeDasharray: circumference, strokeDashoffset: dashOffset,
            strokeLinecap: 'round', transform: 'rotate(-90 140 140)',
            style: { transition: 'stroke-dashoffset 0.5s linear' }
          })
        ),
        React.createElement('div', { style: styles.timeDisplay }, displayTime)
      ),

      React.createElement('div', { style: styles.controls },
        React.createElement('button', {
          onClick: toggleRunning,
          style: Object.assign({}, styles.controlBtn, {
            background: isRunning ? '#f59e0b' : '#22c55e',
            color: '#fff'
          })
        }, isRunning ? 'Pause' : 'Start'),
        React.createElement('button', {
          onClick: resetTimer,
          style: Object.assign({}, styles.controlBtn, {
            background: 'rgba(255,255,255,0.1)',
            color: '#ccc'
          })
        }, 'Reset')
      ),

      React.createElement('button', {
        onClick: function() { tempWork.current = workDuration; tempBreak.current = breakDuration; setShowSettings(true); },
        style: styles.settingsBtn
      }, 'Settings')
    ),

    React.createElement('div', { style: styles.sessionInfo },
      React.createElement('div', { style: styles.sessionCard },
        React.createElement('div', { style: styles.sessionLabel }, 'Completed'),
        React.createElement('div', { style: styles.sessionValue }, sessions)
      ),
      React.createElement('div', { style: styles.sessionCard },
        React.createElement('div', { style: styles.sessionLabel }, 'Work'),
        React.createElement('div', { style: Object.assign({}, styles.sessionValue, { color: '#ef4444' }) }, workDuration + 'm')
      ),
      React.createElement('div', { style: styles.sessionCard },
        React.createElement('div', { style: styles.sessionLabel }, 'Break'),
        React.createElement('div', { style: Object.assign({}, styles.sessionValue, { color: '#22c55e' }) }, breakDuration + 'm')
      )
    ),

    sessions > 0 && React.createElement('div', { style: styles.pomodoroCircles },
      Array.from({ length: sessions }, function(_, i) {
        return React.createElement('div', {
          key: i,
          style: { width: '16px', height: '16px', borderRadius: '50%', background: '#ef4444' }
        });
      })
    ),

    showSettings && React.createElement('div', { style: styles.overlay, onClick: function() { setShowSettings(false); } },
      React.createElement('div', { style: styles.settingsCard, onClick: function(e) { e.stopPropagation(); } },
        React.createElement('h3', { style: styles.settingsTitle }, 'Timer Settings'),
        React.createElement('div', { style: styles.settingRow },
          React.createElement('span', { style: styles.settingLabel }, 'Work Duration (min)'),
          React.createElement('input', {
            type: 'number', min: '1', max: '60', defaultValue: workDuration,
            onChange: function(e) { tempWork.current = parseInt(e.target.value) || 25; },
            style: styles.settingInput
          })
        ),
        React.createElement('div', { style: styles.settingRow },
          React.createElement('span', { style: styles.settingLabel }, 'Break Duration (min)'),
          React.createElement('input', {
            type: 'number', min: '1', max: '30', defaultValue: breakDuration,
            onChange: function(e) { tempBreak.current = parseInt(e.target.value) || 5; },
            style: styles.settingInput
          })
        ),
        React.createElement('button', {
          onClick: function() { applySettings(tempWork.current, tempBreak.current); },
          style: Object.assign({}, styles.controlBtn, { background: '#6366f1', color: '#fff', width: '100%' })
        }, 'Apply')
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
