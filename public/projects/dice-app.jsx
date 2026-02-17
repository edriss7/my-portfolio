const { useState, useEffect, useRef, useCallback } = React;

function App() {
  const [numDice, setNumDice] = useState(1);
  const [diceValues, setDiceValues] = useState([1]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState([]);
  const rollIntervalRef = useRef(null);

  const rollDice = useCallback(() => {
    if (rolling) return;
    setRolling(true);
    let count = 0;
    rollIntervalRef.current = setInterval(() => {
      const newValues = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1);
      setDiceValues(newValues);
      count++;
      if (count >= 10) {
        clearInterval(rollIntervalRef.current);
        const finalValues = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1);
        setDiceValues(finalValues);
        setHistory(prev => {
          const entry = { values: finalValues, total: finalValues.reduce((a, b) => a + b, 0), time: new Date().toLocaleTimeString() };
          return [entry, ...prev].slice(0, 10);
        });
        setRolling(false);
      }
    }, 80);
  }, [rolling, numDice]);

  useEffect(() => {
    return () => { if (rollIntervalRef.current) clearInterval(rollIntervalRef.current); };
  }, []);

  const handleNumDiceChange = (n) => {
    if (!rolling) {
      setNumDice(n);
      setDiceValues(Array(n).fill(1));
    }
  };

  const totalRolls = history.length;
  const average = totalRolls > 0 ? (history.reduce((sum, h) => sum + h.total, 0) / totalRolls).toFixed(1) : '0';

  const allValues = history.flatMap(h => h.values);
  let mostCommon = '-';
  if (allValues.length > 0) {
    const freq = {};
    allValues.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
    mostCommon = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
  }

  const dotPositions = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]]
  };

  const styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0ff', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px' },
    backLink: { color: '#8888ff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' },
    title: { textAlign: 'center', fontSize: '32px', marginBottom: '30px', color: '#ffffff' },
    diceArea: { display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' },
    die: { width: '100px', height: '100px', background: 'linear-gradient(145deg, #ffffff, #e8e8e8)', borderRadius: '16px', position: 'relative', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', transition: 'transform 0.1s' },
    dieRolling: { animation: 'none', transform: 'rotate(' + (Math.random() * 20 - 10) + 'deg)' },
    dot: { width: '16px', height: '16px', background: '#1a1a3e', borderRadius: '50%', position: 'absolute', transform: 'translate(-50%, -50%)' },
    controls: { display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', alignItems: 'center', flexWrap: 'wrap' },
    rollBtn: { padding: '14px 40px', fontSize: '18px', background: rolling ? '#555' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '12px', cursor: rolling ? 'not-allowed' : 'pointer', fontWeight: 'bold', transition: 'all 0.3s' },
    diceToggle: { display: 'flex', gap: '8px' },
    toggleBtn: { padding: '8px 16px', fontSize: '14px', border: '2px solid #6366f1', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 'bold' },
    statsRow: { display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px', flexWrap: 'wrap' },
    statCard: { background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '15px 25px', textAlign: 'center', minWidth: '120px' },
    statLabel: { fontSize: '12px', color: '#aaa', textTransform: 'uppercase', marginBottom: '5px' },
    statValue: { fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' },
    historySection: { maxWidth: '500px', margin: '0 auto' },
    historyTitle: { fontSize: '20px', marginBottom: '15px', color: '#ccc' },
    historyItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '8px' },
    historyValues: { fontWeight: 'bold', fontSize: '16px' },
    historyTime: { fontSize: '12px', color: '#888' },
    historyTotal: { color: '#8b5cf6', fontWeight: 'bold' }
  };

  const renderDie = (value, index) => {
    const positions = dotPositions[value] || [];
    const dieStyle = Object.assign({}, styles.die, rolling ? styles.dieRolling : {});
    return React.createElement('div', { key: index, style: dieStyle },
      positions.map((pos, i) =>
        React.createElement('div', {
          key: i,
          style: Object.assign({}, styles.dot, { left: pos[0] + '%', top: pos[1] + '%' })
        })
      )
    );
  };

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, 'Dice Roller'),

    React.createElement('div', { style: styles.controls },
      React.createElement('span', { style: { color: '#aaa', fontSize: '14px' } }, 'Number of dice:'),
      React.createElement('div', { style: styles.diceToggle },
        [1, 2].map(n =>
          React.createElement('button', {
            key: n,
            onClick: () => handleNumDiceChange(n),
            style: Object.assign({}, styles.toggleBtn, {
              background: numDice === n ? '#6366f1' : 'transparent',
              color: numDice === n ? '#fff' : '#6366f1'
            })
          }, n + (n === 1 ? ' Die' : ' Dice'))
        )
      )
    ),

    React.createElement('div', { style: styles.diceArea },
      diceValues.map((val, i) => renderDie(val, i))
    ),

    React.createElement('div', { style: { textAlign: 'center', marginBottom: '30px' } },
      React.createElement('button', {
        onClick: rollDice,
        disabled: rolling,
        style: styles.rollBtn
      }, rolling ? 'Rolling...' : 'Roll!')
    ),

    React.createElement('div', { style: styles.statsRow },
      React.createElement('div', { style: styles.statCard },
        React.createElement('div', { style: styles.statLabel }, 'Total Rolls'),
        React.createElement('div', { style: styles.statValue }, totalRolls)
      ),
      React.createElement('div', { style: styles.statCard },
        React.createElement('div', { style: styles.statLabel }, 'Average'),
        React.createElement('div', { style: styles.statValue }, average)
      ),
      React.createElement('div', { style: styles.statCard },
        React.createElement('div', { style: styles.statLabel }, 'Most Common'),
        React.createElement('div', { style: styles.statValue }, mostCommon)
      )
    ),

    history.length > 0 && React.createElement('div', { style: styles.historySection },
      React.createElement('h2', { style: styles.historyTitle }, 'Roll History'),
      history.map((entry, i) =>
        React.createElement('div', { key: i, style: styles.historyItem },
          React.createElement('span', { style: styles.historyValues },
            entry.values.join(' + ')
          ),
          React.createElement('span', { style: styles.historyTotal }, '= ' + entry.total),
          React.createElement('span', { style: styles.historyTime }, entry.time)
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
