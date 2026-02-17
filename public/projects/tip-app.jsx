const { useState, useEffect, useRef } = React;

function App() {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState(18);
  const [customTip, setCustomTip] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [numPeople, setNumPeople] = useState(2);

  const tipPresets = [10, 15, 18, 20, 25];
  const activeTip = isCustom ? (parseFloat(customTip) || 0) : tipPercent;
  const bill = parseFloat(billAmount) || 0;
  const tipAmount = bill * (activeTip / 100);
  const totalWithTip = bill + tipAmount;
  const perPerson = numPeople > 0 ? totalWithTip / numPeople : 0;
  const tipPerPerson = numPeople > 0 ? tipAmount / numPeople : 0;

  const quickPresets = [
    { label: 'Coffee Date', icon: '\u2615', bill: 12.50, tip: 18, people: 2 },
    { label: 'Family Dinner', icon: '\uD83C\uDF7D\uFE0F', bill: 85.00, tip: 20, people: 4 },
    { label: 'Pizza Night', icon: '\uD83C\uDF55', bill: 45.00, tip: 15, people: 3 },
    { label: 'Fine Dining', icon: '\uD83E\uDD42', bill: 200.00, tip: 25, people: 2 },
  ];

  const applyPreset = (preset) => {
    setBillAmount(preset.bill.toFixed(2));
    setTipPercent(preset.tip);
    setIsCustom(false);
    setNumPeople(preset.people);
  };

  const formatCurrency = (amount) => {
    return '$' + amount.toFixed(2);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
      color: '#e0e0e0',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      color: '#8888ff',
      textDecoration: 'none',
      fontSize: '14px',
      marginBottom: '20px',
      gap: '6px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    title: {
      fontSize: '2.2rem',
      fontWeight: '700',
      background: 'linear-gradient(90deg, #43e97b, #38f9d7)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0 0 8px 0',
    },
    subtitle: {
      color: '#8888aa',
      fontSize: '1rem',
      margin: 0,
    },
    content: {
      maxWidth: '700px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    card: {
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(10px)',
    },
    sectionTitle: {
      fontSize: '0.85rem',
      color: '#8888aa',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '14px',
      fontWeight: '600',
    },
    inputGroup: {
      position: 'relative',
      marginBottom: '4px',
    },
    currencySymbol: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '1.4rem',
      color: '#43e97b',
      fontWeight: '700',
    },
    input: {
      width: '100%',
      padding: '16px 16px 16px 40px',
      fontSize: '1.5rem',
      background: 'rgba(255,255,255,0.06)',
      border: '2px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      color: '#fff',
      fontWeight: '600',
      outline: 'none',
      transition: 'border-color 0.3s',
      boxSizing: 'border-box',
    },
    tipGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
    },
    tipBtn: (active) => ({
      padding: '14px',
      borderRadius: '10px',
      border: active ? '2px solid #43e97b' : '2px solid rgba(255,255,255,0.1)',
      background: active ? 'rgba(67, 233, 123, 0.15)' : 'rgba(255,255,255,0.04)',
      color: active ? '#43e97b' : '#ccc',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    customInput: {
      padding: '14px',
      fontSize: '1rem',
      background: 'rgba(255,255,255,0.06)',
      border: '2px solid rgba(255,255,255,0.1)',
      borderRadius: '10px',
      color: '#fff',
      textAlign: 'center',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
    },
    peopleRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
    },
    peopleBtn: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.06)',
      color: '#fff',
      fontSize: '1.5rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    peopleCount: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#43e97b',
      minWidth: '60px',
      textAlign: 'center',
    },
    resultCard: {
      background: 'linear-gradient(135deg, rgba(67,233,123,0.1), rgba(56,249,215,0.1))',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(67,233,123,0.2)',
    },
    resultGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
    },
    resultItem: {
      textAlign: 'center',
      padding: '16px',
      background: 'rgba(0,0,0,0.2)',
      borderRadius: '12px',
    },
    resultLabel: {
      fontSize: '0.75rem',
      color: '#88aa88',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      marginBottom: '6px',
    },
    resultValue: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#43e97b',
    },
    resultValueLarge: {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: '#fff',
    },
    perPersonHighlight: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      padding: '20px',
      background: 'rgba(67,233,123,0.08)',
      borderRadius: '12px',
      border: '1px dashed rgba(67,233,123,0.3)',
    },
    splitVisual: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      justifyContent: 'center',
      marginTop: '16px',
    },
    personCard: {
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '12px',
      padding: '12px 16px',
      textAlign: 'center',
      minWidth: '80px',
      border: '1px solid rgba(255,255,255,0.06)',
    },
    personIcon: {
      fontSize: '1.5rem',
      marginBottom: '4px',
    },
    personAmount: {
      fontSize: '0.95rem',
      fontWeight: '600',
      color: '#43e97b',
    },
    presetGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px',
    },
    presetCard: {
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '12px',
      padding: '14px',
      cursor: 'pointer',
      border: '1px solid rgba(255,255,255,0.06)',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    presetIcon: {
      fontSize: '1.8rem',
    },
    presetInfo: {
      flex: 1,
    },
    presetName: {
      fontWeight: '600',
      fontSize: '0.95rem',
      color: '#ddd',
    },
    presetDetail: {
      fontSize: '0.75rem',
      color: '#888',
      marginTop: '2px',
    },
  };

  return (
    React.createElement('div', { style: styles.container },
      React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),

      React.createElement('div', { style: styles.header },
        React.createElement('h1', { style: styles.title }, '\uD83D\uDCB0 Tip Calculator'),
        React.createElement('p', { style: styles.subtitle }, 'Split bills effortlessly')
      ),

      React.createElement('div', { style: styles.content },

        // Quick Presets
        React.createElement('div', { style: styles.card },
          React.createElement('div', { style: styles.sectionTitle }, 'Quick Scenarios'),
          React.createElement('div', { style: styles.presetGrid },
            quickPresets.map((preset, i) =>
              React.createElement('div', {
                key: i,
                style: styles.presetCard,
                onClick: () => applyPreset(preset),
                onMouseEnter: (e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(67,233,123,0.3)';
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                },
              },
                React.createElement('span', { style: styles.presetIcon }, preset.icon),
                React.createElement('div', { style: styles.presetInfo },
                  React.createElement('div', { style: styles.presetName }, preset.label),
                  React.createElement('div', { style: styles.presetDetail },
                    `${formatCurrency(preset.bill)} \u00B7 ${preset.tip}% \u00B7 ${preset.people} people`
                  )
                )
              )
            )
          )
        ),

        // Bill Amount
        React.createElement('div', { style: styles.card },
          React.createElement('div', { style: styles.sectionTitle }, 'Bill Amount'),
          React.createElement('div', { style: styles.inputGroup },
            React.createElement('span', { style: styles.currencySymbol }, '$'),
            React.createElement('input', {
              type: 'number',
              placeholder: '0.00',
              value: billAmount,
              onChange: (e) => setBillAmount(e.target.value),
              style: styles.input,
              onFocus: (e) => e.target.style.borderColor = 'rgba(67,233,123,0.5)',
              onBlur: (e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)',
            })
          )
        ),

        // Tip Percentage
        React.createElement('div', { style: styles.card },
          React.createElement('div', { style: styles.sectionTitle }, 'Tip Percentage'),
          React.createElement('div', { style: styles.tipGrid },
            tipPresets.map(pct =>
              React.createElement('button', {
                key: pct,
                style: styles.tipBtn(!isCustom && tipPercent === pct),
                onClick: () => { setTipPercent(pct); setIsCustom(false); },
                onMouseEnter: (e) => e.target.style.transform = 'scale(1.03)',
                onMouseLeave: (e) => e.target.style.transform = 'scale(1)',
              }, `${pct}%`)
            ),
            React.createElement('div', { style: { position: 'relative' } },
              React.createElement('input', {
                type: 'number',
                placeholder: 'Custom %',
                value: customTip,
                onChange: (e) => { setCustomTip(e.target.value); setIsCustom(true); },
                onFocus: () => setIsCustom(true),
                style: {
                  ...styles.customInput,
                  borderColor: isCustom ? '#43e97b' : 'rgba(255,255,255,0.1)',
                },
              })
            )
          )
        ),

        // Number of People
        React.createElement('div', { style: styles.card },
          React.createElement('div', { style: styles.sectionTitle }, 'Number of People'),
          React.createElement('div', { style: styles.peopleRow },
            React.createElement('button', {
              style: styles.peopleBtn,
              onClick: () => setNumPeople(Math.max(1, numPeople - 1)),
              onMouseEnter: (e) => e.target.style.background = 'rgba(255,255,255,0.12)',
              onMouseLeave: (e) => e.target.style.background = 'rgba(255,255,255,0.06)',
            }, '\u2212'),
            React.createElement('span', { style: styles.peopleCount }, numPeople),
            React.createElement('button', {
              style: styles.peopleBtn,
              onClick: () => setNumPeople(Math.min(10, numPeople + 1)),
              onMouseEnter: (e) => e.target.style.background = 'rgba(255,255,255,0.12)',
              onMouseLeave: (e) => e.target.style.background = 'rgba(255,255,255,0.06)',
            }, '+')
          )
        ),

        // Results
        bill > 0 && React.createElement('div', { style: styles.resultCard },
          React.createElement('div', { style: { ...styles.sectionTitle, color: '#43e97b' } }, 'Results'),
          React.createElement('div', { style: styles.resultGrid },
            React.createElement('div', { style: styles.resultItem },
              React.createElement('div', { style: styles.resultLabel }, 'Tip Amount'),
              React.createElement('div', { style: styles.resultValue }, formatCurrency(tipAmount))
            ),
            React.createElement('div', { style: styles.resultItem },
              React.createElement('div', { style: styles.resultLabel }, 'Total'),
              React.createElement('div', { style: styles.resultValue }, formatCurrency(totalWithTip))
            ),
            React.createElement('div', { style: styles.perPersonHighlight },
              React.createElement('div', { style: styles.resultLabel }, 'Per Person'),
              React.createElement('div', { style: styles.resultValueLarge }, formatCurrency(perPerson)),
              React.createElement('div', { style: { fontSize: '0.8rem', color: '#88aa88', marginTop: '4px' } },
                `(${formatCurrency(bill / numPeople)} + ${formatCurrency(tipPerPerson)} tip)`
              )
            )
          ),

          // Split Visual
          numPeople > 1 && React.createElement('div', null,
            React.createElement('div', { style: { ...styles.sectionTitle, marginTop: '20px' } }, 'Split View'),
            React.createElement('div', { style: styles.splitVisual },
              Array.from({ length: numPeople }, (_, i) =>
                React.createElement('div', { key: i, style: styles.personCard },
                  React.createElement('div', { style: styles.personIcon }, '\uD83E\uDDD1'),
                  React.createElement('div', { style: { fontSize: '0.75rem', color: '#aaa', marginBottom: '2px' } }, `Person ${i + 1}`),
                  React.createElement('div', { style: styles.personAmount }, formatCurrency(perPerson))
                )
              )
            )
          )
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
