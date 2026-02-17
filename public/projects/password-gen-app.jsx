const { useState, useEffect, useRef } = React;

var CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generatePassword(length, options) {
  var charset = '';
  if (options.uppercase) charset += CHARS.uppercase;
  if (options.lowercase) charset += CHARS.lowercase;
  if (options.numbers) charset += CHARS.numbers;
  if (options.symbols) charset += CHARS.symbols;
  if (charset === '') charset = CHARS.lowercase;
  var password = '';
  for (var i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

function getStrength(password, options) {
  var score = 0;
  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;
  if (options.uppercase) score += 1;
  if (options.lowercase) score += 1;
  if (options.numbers) score += 1;
  if (options.symbols) score += 2;
  if (password.length >= 20) score += 1;
  if (score <= 2) return { label: 'Weak', color: '#ff1744', pct: 25 };
  if (score <= 4) return { label: 'Medium', color: '#ffab00', pct: 55 };
  if (score <= 6) return { label: 'Strong', color: '#00e676', pct: 80 };
  return { label: 'Very Strong', color: '#00e5ff', pct: 100 };
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
    maxWidth: '520px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  passwordBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '20px',
  },
  passwordText: {
    flex: '1',
    fontSize: '1.3rem',
    fontFamily: "'Courier New', monospace",
    color: '#00e5ff',
    wordBreak: 'break-all',
    userSelect: 'all',
  },
  copyBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: '#2979ff',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  strengthBar: {
    height: '8px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
    marginBottom: '6px',
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s, background 0.3s',
  },
  strengthLabel: {
    fontSize: '13px',
    marginBottom: '20px',
  },
  sliderRow: {
    marginBottom: '20px',
  },
  sliderLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px',
  },
  slider: {
    width: '100%',
    accentColor: '#7c4dff',
    height: '6px',
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  toggleLabel: {
    fontSize: '15px',
  },
  toggle: {
    width: '48px',
    height: '26px',
    borderRadius: '13px',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background 0.2s',
    padding: 0,
  },
  toggleKnob: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: '#fff',
    position: 'absolute',
    top: '2px',
    transition: 'left 0.2s',
  },
  genBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #7c4dff, #2979ff)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
  },
  copiedToast: {
    textAlign: 'center',
    color: '#69f0ae',
    fontSize: '13px',
    marginTop: '8px',
    transition: 'opacity 0.3s',
  },
};

function App() {
  var _length = useState(16);
  var length = _length[0], setLength = _length[1];
  var _options = useState({ uppercase: true, lowercase: true, numbers: true, symbols: false });
  var options = _options[0], setOptions = _options[1];
  var _password = useState('');
  var password = _password[0], setPassword = _password[1];
  var _copied = useState(false);
  var copied = _copied[0], setCopied = _copied[1];

  useEffect(function () {
    setPassword(generatePassword(length, options));
  }, []);

  function handleGenerate() {
    setPassword(generatePassword(length, options));
    setCopied(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(password).then(function () {
      setCopied(true);
      setTimeout(function () { setCopied(false); }, 2000);
    });
  }

  function toggleOption(key) {
    var newOptions = Object.assign({}, options);
    newOptions[key] = !newOptions[key];
    var anyActive = newOptions.uppercase || newOptions.lowercase || newOptions.numbers || newOptions.symbols;
    if (!anyActive) return;
    setOptions(newOptions);
  }

  var strength = getStrength(password, options);
  var toggleItems = [
    { key: 'uppercase', label: 'Uppercase (A-Z)' },
    { key: 'lowercase', label: 'Lowercase (a-z)' },
    { key: 'numbers', label: 'Numbers (0-9)' },
    { key: 'symbols', label: 'Symbols (!@#$...)' },
  ];

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, '\ud83d\udd10 Password Generator'),
    React.createElement('div', { style: styles.card },
      React.createElement('div', { style: styles.passwordBox },
        React.createElement('div', { style: styles.passwordText }, password),
        React.createElement('button', { style: styles.copyBtn, onClick: handleCopy },
          copied ? '\u2713 Copied' : 'Copy'
        )
      ),
      React.createElement('div', { style: styles.strengthBar },
        React.createElement('div', {
          style: Object.assign({}, styles.strengthFill, {
            width: strength.pct + '%',
            background: strength.color,
          }),
        })
      ),
      React.createElement('div', {
        style: Object.assign({}, styles.strengthLabel, { color: strength.color }),
      }, 'Strength: ' + strength.label),
      React.createElement('div', { style: styles.sliderRow },
        React.createElement('div', { style: styles.sliderLabel },
          React.createElement('span', null, 'Password Length'),
          React.createElement('span', { style: { color: '#00e5ff', fontWeight: 'bold' } }, length)
        ),
        React.createElement('input', {
          type: 'range',
          min: '8',
          max: '32',
          value: length,
          onChange: function (e) { setLength(parseInt(e.target.value)); },
          style: styles.slider,
        })
      ),
      toggleItems.map(function (item) {
        var isOn = options[item.key];
        return React.createElement('div', { key: item.key, style: styles.toggleRow },
          React.createElement('span', { style: styles.toggleLabel }, item.label),
          React.createElement('button', {
            style: Object.assign({}, styles.toggle, {
              background: isOn ? '#7c4dff' : '#455a64',
            }),
            onClick: function () { toggleOption(item.key); },
          },
            React.createElement('div', {
              style: Object.assign({}, styles.toggleKnob, {
                left: isOn ? '24px' : '2px',
              }),
            })
          )
        );
      }),
      React.createElement('button', { style: styles.genBtn, onClick: handleGenerate },
        'Generate Password'
      ),
      copied && React.createElement('div', { style: styles.copiedToast }, 'Password copied to clipboard!')
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
