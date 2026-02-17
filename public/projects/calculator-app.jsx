const { useState, useEffect, useRef } = React;

const App = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);
  const [expression, setExpression] = useState('');

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setExpression('');
  };

  const backspace = () => {
    if (waitingForOperand) return;
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const performOperation = (nextOp) => {
    const current = parseFloat(display);

    if (prevValue !== null && operation && !waitingForOperand) {
      let result;
      switch (operation) {
        case '+': result = prevValue + current; break;
        case '-': result = prevValue - current; break;
        case '*': result = prevValue * current; break;
        case '/': result = current !== 0 ? prevValue / current : 'Error'; break;
        default: result = current;
      }

      if (result === 'Error') {
        setDisplay('Error');
        setPrevValue(null);
        setOperation(null);
        setExpression('');
        setWaitingForOperand(true);
        return;
      }

      const resultStr = parseFloat(result.toFixed(10)).toString();
      setDisplay(resultStr);
      setPrevValue(result);
      setExpression(resultStr);
    } else {
      setPrevValue(current);
      setExpression(display);
    }

    const opSymbol = { '+': '+', '-': '\u2212', '*': '\u00D7', '/': '\u00F7' };
    setOperation(nextOp);
    setWaitingForOperand(true);
    if (nextOp) {
      setExpression(prev => (prev || display) + ' ' + (opSymbol[nextOp] || nextOp) + ' ');
    }
  };

  const calculate = () => {
    if (prevValue === null || !operation) return;
    const current = parseFloat(display);
    let result;
    const opSymbol = { '+': '+', '-': '\u2212', '*': '\u00D7', '/': '\u00F7' };

    switch (operation) {
      case '+': result = prevValue + current; break;
      case '-': result = prevValue - current; break;
      case '*': result = prevValue * current; break;
      case '/': result = current !== 0 ? prevValue / current : 'Error'; break;
      default: result = current;
    }

    const fullExpr = prevValue + ' ' + (opSymbol[operation] || operation) + ' ' + current + ' = ' + (result === 'Error' ? 'Error' : parseFloat(result.toFixed(10)));

    if (result !== 'Error') {
      setHistory(prev => [fullExpr, ...prev].slice(0, 8));
    }

    setDisplay(result === 'Error' ? 'Error' : parseFloat(result.toFixed(10)).toString());
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(true);
    setExpression('');
  };

  const toggleSign = () => {
    const val = parseFloat(display);
    if (val !== 0) {
      setDisplay(String(-val));
    }
  };

  const percentage = () => {
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const formatDisplay = (val) => {
    if (val === 'Error') return 'Error';
    if (val.length > 12) return parseFloat(val).toExponential(6);
    return val;
  };

  const styles = {
    wrapper: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
      fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
      padding: '20px',
      boxSizing: 'border-box',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#8b8bc4',
      textDecoration: 'none',
      fontSize: '14px',
      marginBottom: '30px',
      transition: 'color 0.2s',
    },
    container: {
      maxWidth: '380px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    title: {
      fontSize: '42px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0 0 8px 0',
    },
    subtitle: {
      color: '#6b6b9e',
      fontSize: '16px',
      margin: 0,
    },
    calcBody: {
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(20px)',
      borderRadius: '28px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '24px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
      marginBottom: '20px',
    },
    displayArea: {
      padding: '20px 10px',
      textAlign: 'right',
      marginBottom: '16px',
      minHeight: '100px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    expression: {
      color: '#6b6b9e',
      fontSize: '16px',
      marginBottom: '8px',
      minHeight: '22px',
      wordBreak: 'break-all',
    },
    displayText: {
      color: '#fff',
      fontSize: display.length > 9 ? '36px' : '48px',
      fontWeight: '300',
      lineHeight: 1.1,
      transition: 'font-size 0.2s',
      wordBreak: 'break-all',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '10px',
    },
    btn: (type) => {
      const base = {
        height: '64px',
        borderRadius: '16px',
        border: 'none',
        fontSize: '22px',
        fontWeight: '400',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };
      if (type === 'function') {
        return { ...base, background: 'rgba(255, 255, 255, 0.15)', color: '#fff' };
      }
      if (type === 'operator') {
        return { ...base, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', fontWeight: '500' };
      }
      if (type === 'equals') {
        return { ...base, background: 'linear-gradient(135deg, #4ade80, #16a34a)', color: '#fff', fontWeight: '500' };
      }
      if (type === 'zero') {
        return { ...base, background: 'rgba(255, 255, 255, 0.08)', color: '#fff', gridColumn: 'span 2', borderRadius: '16px' };
      }
      return { ...base, background: 'rgba(255, 255, 255, 0.08)', color: '#fff' };
    },
    historyCard: {
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      padding: '20px',
    },
    historyTitle: {
      color: '#8b8bc4',
      fontSize: '13px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '12px',
    },
    historyItem: {
      padding: '8px 12px',
      borderRadius: '8px',
      marginBottom: '4px',
      color: '#8b8bc4',
      fontSize: '14px',
      background: 'rgba(255, 255, 255, 0.02)',
      fontFamily: "'SF Mono', 'Fira Code', monospace",
    },
    emptyHistory: {
      color: '#4a4a7a',
      fontSize: '14px',
      textAlign: 'center',
      padding: '16px',
    },
  };

  const buttons = [
    { label: 'C', type: 'function', action: clear },
    { label: '\u00B1', type: 'function', action: toggleSign },
    { label: '%', type: 'function', action: percentage },
    { label: '\u00F7', type: 'operator', action: () => performOperation('/') },
    { label: '7', type: 'number', action: () => inputDigit(7) },
    { label: '8', type: 'number', action: () => inputDigit(8) },
    { label: '9', type: 'number', action: () => inputDigit(9) },
    { label: '\u00D7', type: 'operator', action: () => performOperation('*') },
    { label: '4', type: 'number', action: () => inputDigit(4) },
    { label: '5', type: 'number', action: () => inputDigit(5) },
    { label: '6', type: 'number', action: () => inputDigit(6) },
    { label: '\u2212', type: 'operator', action: () => performOperation('-') },
    { label: '1', type: 'number', action: () => inputDigit(1) },
    { label: '2', type: 'number', action: () => inputDigit(2) },
    { label: '3', type: 'number', action: () => inputDigit(3) },
    { label: '+', type: 'operator', action: () => performOperation('+') },
    { label: '0', type: 'zero', action: () => inputDigit(0) },
    { label: '.', type: 'number', action: inputDecimal },
    { label: '=', type: 'equals', action: calculate },
  ];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(parseInt(e.key));
      else if (e.key === '.') inputDecimal();
      else if (e.key === '+') performOperation('+');
      else if (e.key === '-') performOperation('-');
      else if (e.key === '*') performOperation('*');
      else if (e.key === '/') { e.preventDefault(); performOperation('/'); }
      else if (e.key === 'Enter' || e.key === '=') calculate();
      else if (e.key === 'Backspace') backspace();
      else if (e.key === 'Escape') clear();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  return React.createElement('div', { style: styles.wrapper },
    React.createElement('style', null, `
      button:hover { filter: brightness(1.2); transform: scale(1.03); }
      button:active { transform: scale(0.96); filter: brightness(0.9); }
      .back-link:hover { color: #a5a5e0 !important; }
    `),
    React.createElement('div', { style: styles.container },
      React.createElement('a', {
        href: '/projects',
        style: styles.backLink,
        className: 'back-link',
      }, '\u2190 Back to Projects'),
      React.createElement('div', { style: styles.header },
        React.createElement('h1', { style: styles.title }, 'Calculator'),
        React.createElement('p', { style: styles.subtitle }, 'Crunch numbers in style')
      ),
      React.createElement('div', { style: styles.calcBody },
        React.createElement('div', { style: styles.displayArea },
          React.createElement('div', { style: styles.expression }, expression || '\u00A0'),
          React.createElement('div', { style: styles.displayText }, formatDisplay(display))
        ),
        React.createElement('div', { style: styles.grid },
          buttons.map((btn, i) =>
            React.createElement('button', {
              key: i,
              style: styles.btn(btn.type),
              onClick: btn.action,
            }, btn.label)
          )
        )
      ),
      React.createElement('div', { style: styles.historyCard },
        React.createElement('div', { style: styles.historyTitle }, 'Calculation History'),
        history.length === 0
          ? React.createElement('div', { style: styles.emptyHistory }, 'Calculations will appear here')
          : history.map((item, idx) =>
              React.createElement('div', {
                key: idx,
                style: styles.historyItem,
              }, item)
            )
      )
    )
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
