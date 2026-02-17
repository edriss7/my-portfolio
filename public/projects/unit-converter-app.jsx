const { useState, useEffect, useRef } = React;

var conversionData = {
  Length: {
    units: ['Meters', 'Kilometers', 'Centimeters', 'Millimeters', 'Miles', 'Yards', 'Feet', 'Inches'],
    toBase: {
      Meters: 1, Kilometers: 1000, Centimeters: 0.01, Millimeters: 0.001,
      Miles: 1609.344, Yards: 0.9144, Feet: 0.3048, Inches: 0.0254,
    },
  },
  Weight: {
    units: ['Kilograms', 'Grams', 'Milligrams', 'Pounds', 'Ounces', 'Tons'],
    toBase: {
      Kilograms: 1, Grams: 0.001, Milligrams: 0.000001,
      Pounds: 0.453592, Ounces: 0.0283495, Tons: 907.185,
    },
  },
  Temperature: {
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    toBase: null,
  },
  Speed: {
    units: ['m/s', 'km/h', 'mph', 'knots'],
    toBase: { 'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704, 'knots': 0.514444 },
  },
};

function convertTemp(value, from, to) {
  var v = parseFloat(value);
  if (isNaN(v)) return '';
  var celsius;
  if (from === 'Celsius') celsius = v;
  else if (from === 'Fahrenheit') celsius = (v - 32) * 5 / 9;
  else celsius = v - 273.15;

  if (to === 'Celsius') return celsius;
  if (to === 'Fahrenheit') return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

function convert(value, from, to, category) {
  var v = parseFloat(value);
  if (isNaN(v) || value === '') return '';
  if (category === 'Temperature') {
    var result = convertTemp(v, from, to);
    return Math.round(result * 1000000) / 1000000;
  }
  var data = conversionData[category];
  var baseValue = v * data.toBase[from];
  var result = baseValue / data.toBase[to];
  return Math.round(result * 1000000) / 1000000;
}

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
    maxWidth: '550px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  categoryRow: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  catBtn: {
    padding: '8px 18px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: '#ccc',
    cursor: 'pointer',
    fontSize: '14px',
  },
  catBtnActive: {
    background: '#2979ff',
    color: '#fff',
    border: '1px solid #2979ff',
  },
  convRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  input: {
    flex: '1',
    minWidth: '100px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '18px',
    outline: 'none',
  },
  select: {
    flex: '1',
    minWidth: '100px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  swapBtn: {
    padding: '10px 16px',
    borderRadius: '50%',
    border: 'none',
    background: '#7c4dff',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    alignSelf: 'center',
    display: 'block',
    margin: '12px auto',
  },
  resultBox: {
    textAlign: 'center',
    padding: '16px',
    background: 'rgba(0,229,255,0.08)',
    borderRadius: '12px',
    marginTop: '16px',
  },
  resultText: {
    fontSize: '1.4rem',
    color: '#00e5ff',
    fontWeight: 'bold',
  },
};

function App() {
  var categories = ['Length', 'Weight', 'Temperature', 'Speed'];
  var _cat = useState('Length');
  var category = _cat[0], setCategory = _cat[1];
  var _from = useState('Meters');
  var fromUnit = _from[0], setFromUnit = _from[1];
  var _to = useState('Feet');
  var toUnit = _to[0], setToUnit = _to[1];
  var _val = useState('1');
  var value = _val[0], setValue = _val[1];

  function handleCategoryChange(cat) {
    setCategory(cat);
    var units = conversionData[cat].units;
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setValue('1');
  }

  function handleSwap() {
    var tmpFrom = fromUnit;
    var tmpTo = toUnit;
    var converted = convert(value, fromUnit, toUnit, category);
    setFromUnit(tmpTo);
    setToUnit(tmpFrom);
    setValue(converted !== '' ? String(converted) : value);
  }

  var result = convert(value, fromUnit, toUnit, category);
  var units = conversionData[category].units;

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, '\u2696 Unit Converter'),
    React.createElement('div', { style: styles.card },
      React.createElement('div', { style: styles.categoryRow },
        categories.map(function (cat) {
          return React.createElement('button', {
            key: cat,
            style: Object.assign({}, styles.catBtn, category === cat ? styles.catBtnActive : {}),
            onClick: function () { handleCategoryChange(cat); },
          }, cat);
        })
      ),
      React.createElement('div', { style: styles.convRow },
        React.createElement('input', {
          style: styles.input,
          type: 'number',
          value: value,
          onChange: function (e) { setValue(e.target.value); },
          placeholder: 'Enter value',
        }),
        React.createElement('select', {
          style: styles.select,
          value: fromUnit,
          onChange: function (e) { setFromUnit(e.target.value); },
        },
          units.map(function (u) {
            return React.createElement('option', { key: u, value: u }, u);
          })
        )
      ),
      React.createElement('button', {
        style: styles.swapBtn,
        onClick: handleSwap,
        title: 'Swap units',
      }, '\u21C5'),
      React.createElement('div', { style: styles.convRow },
        React.createElement('input', {
          style: Object.assign({}, styles.input, { background: 'rgba(0,229,255,0.1)' }),
          type: 'text',
          value: result !== '' ? result : '',
          readOnly: true,
          placeholder: 'Result',
        }),
        React.createElement('select', {
          style: styles.select,
          value: toUnit,
          onChange: function (e) { setToUnit(e.target.value); },
        },
          units.map(function (u) {
            return React.createElement('option', { key: u, value: u }, u);
          })
        )
      ),
      result !== '' && React.createElement('div', { style: styles.resultBox },
        React.createElement('div', { style: styles.resultText },
          value + ' ' + fromUnit + ' = ' + result + ' ' + toUnit
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
