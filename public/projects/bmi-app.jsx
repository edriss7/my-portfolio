const { useState, useEffect, useRef } = React;

function App() {
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm'); // cm or ft
  const [weightUnit, setWeightUnit] = useState('kg'); // kg or lbs
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [lbs, setLbs] = useState('');
  const [bmi, setBmi] = useState(null);
  const [history, setHistory] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

  const calculateBMI = () => {
    let h, w;

    if (heightUnit === 'cm') {
      h = parseFloat(heightCm);
    } else {
      const ft = parseFloat(feet) || 0;
      const inc = parseFloat(inches) || 0;
      h = (ft * 30.48) + (inc * 2.54);
    }

    if (weightUnit === 'kg') {
      w = parseFloat(weightKg);
    } else {
      w = (parseFloat(lbs) || 0) * 0.453592;
    }

    if (!h || !w || h <= 0 || w <= 0) return;

    const hMeters = h / 100;
    const result = w / (hMeters * hMeters);
    const rounded = Math.round(result * 10) / 10;
    setBmi(rounded);

    const heightDisplay = heightUnit === 'cm' ? `${h} cm` : `${feet}'${inches}"`;
    const weightDisplay = weightUnit === 'kg' ? `${weightKg} kg` : `${lbs} lbs`;

    setHistory(prev => [
      { bmi: rounded, height: heightDisplay, weight: weightDisplay, date: new Date().toLocaleTimeString() },
      ...prev
    ].slice(0, 8));
  };

  const getCategory = (val) => {
    if (val < 18.5) return {
      label: 'Underweight',
      color: '#74b9ff',
      emoji: '\uD83D\uDCA8',
      tips: 'Consider increasing caloric intake with nutritious foods. Include protein-rich meals and healthy fats. Consult a healthcare professional for personalized advice.',
    };
    if (val < 25) return {
      label: 'Normal Weight',
      color: '#43e97b',
      emoji: '\u2705',
      tips: 'Great job! Maintain your healthy weight with regular exercise and a balanced diet. Keep up the good habits!',
    };
    if (val < 30) return {
      label: 'Overweight',
      color: '#ffa502',
      emoji: '\u26A0\uFE0F',
      tips: 'Consider moderate exercise and balanced nutrition. Small changes in diet and activity can make a big difference. Aim for 150 minutes of activity per week.',
    };
    return {
      label: 'Obese',
      color: '#ff6b6b',
      emoji: '\uD83C\uDFE5',
      tips: 'It is recommended to consult a healthcare professional. Focus on gradual lifestyle changes, not crash diets. Regular physical activity and portion control can help.',
    };
  };

  const getGaugePosition = (val) => {
    if (!val) return 0;
    // Map BMI 10-40 to 0-100%
    const clamped = Math.max(10, Math.min(40, val));
    return ((clamped - 10) / 30) * 100;
  };

  const category = bmi ? getCategory(bmi) : null;

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
      background: 'linear-gradient(90deg, #ff6b6b, #ffa502)',
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
    },
    sectionTitle: {
      fontSize: '0.85rem',
      color: '#8888aa',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '14px',
      fontWeight: '600',
    },
    unitToggle: {
      display: 'flex',
      gap: '4px',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '10px',
      padding: '4px',
      marginBottom: '14px',
      width: 'fit-content',
    },
    unitBtn: (active) => ({
      padding: '8px 20px',
      borderRadius: '8px',
      border: 'none',
      background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
      color: active ? '#fff' : '#888',
      fontSize: '0.85rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    inputRow: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
    },
    inputWrapper: {
      flex: 1,
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      fontSize: '1.2rem',
      background: 'rgba(255,255,255,0.06)',
      border: '2px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      color: '#fff',
      fontWeight: '600',
      outline: 'none',
      transition: 'border-color 0.3s',
      boxSizing: 'border-box',
    },
    inputLabel: {
      position: 'absolute',
      right: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#666',
      fontSize: '0.85rem',
      pointerEvents: 'none',
    },
    calculateBtn: {
      width: '100%',
      padding: '16px',
      fontSize: '1.15rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #ff6b6b, #ffa502)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0 4px 20px rgba(255,107,107,0.3)',
    },
    resultCard: {
      background: `rgba(255,255,255,0.04)`,
      borderRadius: '20px',
      padding: '32px',
      border: `2px solid ${category ? category.color + '33' : 'transparent'}`,
      textAlign: 'center',
    },
    bmiValue: {
      fontSize: '4rem',
      fontWeight: '800',
      color: category ? category.color : '#fff',
      lineHeight: 1,
      marginBottom: '8px',
    },
    categoryLabel: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: category ? category.color : '#aaa',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    gauge: {
      position: 'relative',
      height: '24px',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '8px',
      display: 'flex',
    },
    gaugeSection: (color, width) => ({
      height: '100%',
      width: `${width}%`,
      background: color,
      opacity: 0.4,
    }),
    gaugeMarker: {
      position: 'absolute',
      top: '-4px',
      width: '4px',
      height: '32px',
      background: '#fff',
      borderRadius: '2px',
      left: `${getGaugePosition(bmi)}%`,
      transition: 'left 0.5s ease',
      boxShadow: '0 0 8px rgba(255,255,255,0.5)',
    },
    gaugeLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.7rem',
      color: '#666',
      marginBottom: '20px',
    },
    tipsBox: {
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'left',
      marginTop: '16px',
      fontSize: '0.9rem',
      lineHeight: 1.6,
      color: '#bbb',
      borderLeft: `3px solid ${category ? category.color : '#666'}`,
    },
    tipsLabel: {
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      color: category ? category.color : '#888',
      marginBottom: '6px',
      fontWeight: '600',
    },
    historyItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 14px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '10px',
      marginBottom: '8px',
    },
    historyBmi: (val) => ({
      fontSize: '1.2rem',
      fontWeight: '700',
      color: getCategory(val).color,
    }),
    historyDetail: {
      fontSize: '0.8rem',
      color: '#888',
    },
    historyTime: {
      fontSize: '0.75rem',
      color: '#555',
    },
    infoPanel: {
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(255,255,255,0.06)',
      lineHeight: 1.7,
      fontSize: '0.9rem',
      color: '#bbb',
    },
    infoToggle: {
      background: 'none',
      border: 'none',
      color: '#8888ff',
      cursor: 'pointer',
      fontSize: '0.9rem',
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
    },
    infoTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#ddd',
      marginBottom: '10px',
    },
  };

  return (
    React.createElement('div', { style: styles.container },
      React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),

      React.createElement('div', { style: styles.header },
        React.createElement('h1', { style: styles.title }, '\u2696\uFE0F BMI Calculator'),
        React.createElement('p', { style: styles.subtitle }, 'Calculate your Body Mass Index')
      ),

      React.createElement('div', { style: styles.content },

        // Height input
        React.createElement('div', { style: styles.card },
          React.createElement('div', { style: styles.sectionTitle }, 'Height'),
          React.createElement('div', { style: styles.unitToggle },
            React.createElement('button', {
              style: styles.unitBtn(heightUnit === 'cm'),
              onClick: () => setHeightUnit('cm'),
            }, 'Centimeters'),
            React.createElement('button', {
              style: styles.unitBtn(heightUnit === 'ft'),
              onClick: () => setHeightUnit('ft'),
            }, 'Feet / Inches')
          ),
          heightUnit === 'cm'
            ? React.createElement('div', { style: styles.inputWrapper },
                React.createElement('input', {
                  type: 'number',
                  placeholder: '170',
                  value: heightCm,
                  onChange: (e) => setHeightCm(e.target.value),
                  style: styles.input,
                  onFocus: (e) => e.target.style.borderColor = 'rgba(255,107,107,0.5)',
                  onBlur: (e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)',
                }),
                React.createElement('span', { style: styles.inputLabel }, 'cm')
              )
            : React.createElement('div', { style: styles.inputRow },
                React.createElement('div', { style: styles.inputWrapper },
                  React.createElement('input', {
                    type: 'number',
                    placeholder: '5',
                    value: feet,
                    onChange: (e) => setFeet(e.target.value),
                    style: styles.input,
                    onFocus: (e) => e.target.style.borderColor = 'rgba(255,107,107,0.5)',
                    onBlur: (e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)',
                  }),
                  React.createElement('span', { style: styles.inputLabel }, 'ft')
                ),
                React.createElement('div', { style: styles.inputWrapper },
                  React.createElement('input', {
                    type: 'number',
                    placeholder: '8',
                    value: inches,
                    onChange: (e) => setInches(e.target.value),
                    style: styles.input,
                    onFocus: (e) => e.target.style.borderColor = 'rgba(255,107,107,0.5)',
                    onBlur: (e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)',
                  }),
                  React.createElement('span', { style: styles.inputLabel }, 'in')
                )
              )
        ),

        // Weight input
        React.createElement('div', { style: styles.card },
          React.createElement('div', { style: styles.sectionTitle }, 'Weight'),
          React.createElement('div', { style: styles.unitToggle },
            React.createElement('button', {
              style: styles.unitBtn(weightUnit === 'kg'),
              onClick: () => setWeightUnit('kg'),
            }, 'Kilograms'),
            React.createElement('button', {
              style: styles.unitBtn(weightUnit === 'lbs'),
              onClick: () => setWeightUnit('lbs'),
            }, 'Pounds')
          ),
          weightUnit === 'kg'
            ? React.createElement('div', { style: styles.inputWrapper },
                React.createElement('input', {
                  type: 'number',
                  placeholder: '70',
                  value: weightKg,
                  onChange: (e) => setWeightKg(e.target.value),
                  style: styles.input,
                  onFocus: (e) => e.target.style.borderColor = 'rgba(255,107,107,0.5)',
                  onBlur: (e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)',
                }),
                React.createElement('span', { style: styles.inputLabel }, 'kg')
              )
            : React.createElement('div', { style: styles.inputWrapper },
                React.createElement('input', {
                  type: 'number',
                  placeholder: '154',
                  value: lbs,
                  onChange: (e) => setLbs(e.target.value),
                  style: styles.input,
                  onFocus: (e) => e.target.style.borderColor = 'rgba(255,107,107,0.5)',
                  onBlur: (e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)',
                }),
                React.createElement('span', { style: styles.inputLabel }, 'lbs')
              )
        ),

        // Calculate button
        React.createElement('button', {
          style: styles.calculateBtn,
          onClick: calculateBMI,
          onMouseEnter: (e) => { e.target.style.transform = 'scale(1.02)'; e.target.style.boxShadow = '0 6px 30px rgba(255,107,107,0.4)'; },
          onMouseLeave: (e) => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 20px rgba(255,107,107,0.3)'; },
        }, 'Calculate BMI'),

        // Result
        bmi && React.createElement('div', { style: styles.resultCard },
          React.createElement('div', { style: { fontSize: '1.5rem', marginBottom: '8px' } }, category.emoji),
          React.createElement('div', { style: styles.bmiValue }, bmi),
          React.createElement('div', { style: styles.categoryLabel },
            React.createElement('span', null, category.label)
          ),

          // Gauge
          React.createElement('div', { style: { position: 'relative' } },
            React.createElement('div', { style: styles.gauge },
              React.createElement('div', { style: styles.gaugeSection('#74b9ff', 28.3) }),
              React.createElement('div', { style: styles.gaugeSection('#43e97b', 21.7) }),
              React.createElement('div', { style: styles.gaugeSection('#ffa502', 16.7) }),
              React.createElement('div', { style: styles.gaugeSection('#ff6b6b', 33.3) })
            ),
            React.createElement('div', { style: styles.gaugeMarker })
          ),
          React.createElement('div', { style: styles.gaugeLabels },
            React.createElement('span', null, '10'),
            React.createElement('span', { style: { color: '#74b9ff' } }, '18.5'),
            React.createElement('span', { style: { color: '#43e97b' } }, '25'),
            React.createElement('span', { style: { color: '#ffa502' } }, '30'),
            React.createElement('span', null, '40')
          ),

          // Scale legend
          React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' } },
            [
              { label: 'Underweight', color: '#74b9ff' },
              { label: 'Normal', color: '#43e97b' },
              { label: 'Overweight', color: '#ffa502' },
              { label: 'Obese', color: '#ff6b6b' },
            ].map((item, i) =>
              React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#aaa' } },
                React.createElement('div', { style: { width: '10px', height: '10px', borderRadius: '3px', background: item.color } }),
                React.createElement('span', null, item.label)
              )
            )
          ),

          // Tips
          React.createElement('div', { style: styles.tipsBox },
            React.createElement('div', { style: styles.tipsLabel }, 'Health Tips'),
            React.createElement('div', null, category.tips)
          )
        ),

        // History
        history.length > 0 && React.createElement('div', { style: styles.card },
          React.createElement('div', { style: styles.sectionTitle }, 'Calculation History'),
          history.map((entry, i) =>
            React.createElement('div', { key: i, style: styles.historyItem },
              React.createElement('div', null,
                React.createElement('div', { style: styles.historyBmi(entry.bmi) }, entry.bmi),
                React.createElement('div', { style: { fontSize: '0.75rem', color: getCategory(entry.bmi).color, opacity: 0.7 } }, getCategory(entry.bmi).label)
              ),
              React.createElement('div', { style: { textAlign: 'right' } },
                React.createElement('div', { style: styles.historyDetail }, `${entry.height} / ${entry.weight}`),
                React.createElement('div', { style: styles.historyTime }, entry.date)
              )
            )
          )
        ),

        // Info section
        React.createElement('div', { style: { textAlign: 'center' } },
          React.createElement('button', {
            style: styles.infoToggle,
            onClick: () => setShowInfo(!showInfo),
          }, showInfo ? 'Hide BMI Info' : 'What is BMI?')
        ),

        showInfo && React.createElement('div', { style: styles.infoPanel },
          React.createElement('div', { style: styles.infoTitle }, 'Understanding Body Mass Index'),
          React.createElement('p', null, 'Body Mass Index (BMI) is a simple measure using height and weight to estimate body fat. The formula is: BMI = weight(kg) / height(m)\u00B2.'),
          React.createElement('p', null, 'While BMI is a useful screening tool, it has limitations. It does not directly measure body fat and may not be accurate for athletes, elderly people, or those with high muscle mass.'),
          React.createElement('p', { style: { marginBottom: 0 } }, 'BMI Categories:'),
          React.createElement('ul', { style: { paddingLeft: '20px', margin: '8px 0 0 0' } },
            React.createElement('li', null, React.createElement('span', { style: { color: '#74b9ff' } }, 'Underweight'), ': Below 18.5'),
            React.createElement('li', null, React.createElement('span', { style: { color: '#43e97b' } }, 'Normal weight'), ': 18.5 \u2013 24.9'),
            React.createElement('li', null, React.createElement('span', { style: { color: '#ffa502' } }, 'Overweight'), ': 25 \u2013 29.9'),
            React.createElement('li', null, React.createElement('span', { style: { color: '#ff6b6b' } }, 'Obese'), ': 30 and above')
          ),
          React.createElement('p', { style: { color: '#888', fontSize: '0.8rem', marginTop: '12px', marginBottom: 0 } }, 'Always consult a healthcare professional for a comprehensive health assessment.')
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
