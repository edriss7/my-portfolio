const { useState, useCallback } = React;

function App() {
  var _s1 = useState('login');
  var tab = _s1[0]; var setTab = _s1[1];
  var _s2 = useState({ email: '', password: '', name: '', confirmPassword: '', remember: false });
  var form = _s2[0]; var setForm = _s2[1];
  var _s3 = useState({});
  var errors = _s3[0]; var setErrors = _s3[1];
  var _s4 = useState(false);
  var success = _s4[0]; var setSuccess = _s4[1];
  var _s5 = useState(false);
  var loading = _s5[0]; var setLoading = _s5[1];

  var update = function(field, val) {
    setForm(function(p) { var n = Object.assign({}, p); n[field] = val; return n; });
    setErrors(function(p) { var n = Object.assign({}, p); delete n[field]; return n; });
  };

  var validateEmail = function(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); };

  var getStrength = function(pw) {
    if (!pw) return 0;
    var s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  var strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  var strengthColors = ['', '#ff5555', '#ffb86c', '#f1fa8c', '#50fa7b'];

  var validate = function() {
    var e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!validateEmail(form.email)) e.email = 'Invalid email format';
    if (tab !== 'forgot') {
      if (!form.password) e.password = 'Password is required';
      else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    }
    if (tab === 'register') {
      if (!form.name) e.name = 'Name is required';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  var handleSubmit = function() {
    if (!validate()) return;
    setLoading(true);
    setTimeout(function() { setLoading(false); setSuccess(true); }, 1500);
  };

  var switchTab = function(t) {
    setTab(t);
    setErrors({});
    setSuccess(false);
    setForm({ email: '', password: '', name: '', confirmPassword: '', remember: false });
  };

  var containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', alignSelf: 'flex-start', marginBottom: '20px' };

  var cardStyle = {
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 16px 48px rgba(0,0,0,0.3)'
  };

  var tabRow = { display: 'flex', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' };

  var tabStyle = function(t) {
    return {
      flex: 1,
      padding: '12px',
      background: 'none',
      border: 'none',
      color: tab === t ? '#bd93f9' : '#888',
      borderBottom: tab === t ? '2px solid #bd93f9' : '2px solid transparent',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px'
    };
  };

  var inputStyle = function(hasErr) {
    return {
      width: '100%',
      padding: '12px 14px',
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid ' + (hasErr ? '#ff5555' : 'rgba(255,255,255,0.15)'),
      borderRadius: '8px',
      color: '#e0e0e0',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
      marginBottom: '4px'
    };
  };

  var errStyle = { color: '#ff5555', fontSize: '12px', minHeight: '18px', marginBottom: '8px' };

  var btnStyle = {
    width: '100%',
    padding: '14px',
    background: loading ? '#666' : 'linear-gradient(135deg, #bd93f9, #ff79c6)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: '8px'
  };

  var labelStyle = { fontSize: '13px', color: '#aaa', marginBottom: '6px', display: 'block' };

  var field = function(label, key, type) {
    return React.createElement('div', { key: key, style: { marginBottom: '4px' } },
      React.createElement('label', { style: labelStyle }, label),
      React.createElement('input', {
        type: type || 'text',
        value: form[key],
        onChange: function(e) { update(key, e.target.value); },
        style: inputStyle(!!errors[key]),
        placeholder: label
      }),
      React.createElement('div', { style: errStyle }, errors[key] || '')
    );
  };

  if (success) {
    var msgs = { login: 'Welcome back!', register: 'Account created successfully!', forgot: 'Reset link sent to your email!' };
    return React.createElement('div', { style: containerStyle },
      React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
      React.createElement('div', { style: Object.assign({}, cardStyle, { textAlign: 'center' }) },
        React.createElement('div', { style: { fontSize: '48px', marginBottom: '16px' } }, '\u2713'),
        React.createElement('h2', { style: { color: '#50fa7b', marginBottom: '12px' } }, 'Success!'),
        React.createElement('p', { style: { color: '#aaa', marginBottom: '24px' } }, msgs[tab]),
        React.createElement('button', { style: btnStyle, onClick: function() { switchTab('login'); } }, 'Continue')
      )
    );
  }

  var strength = getStrength(form.password);

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '28px', color: '#fff', marginBottom: '24px' } }, 'Authentication'),
    React.createElement('div', { style: cardStyle },
      React.createElement('div', { style: tabRow },
        React.createElement('button', { style: tabStyle('login'), onClick: function() { switchTab('login'); } }, 'Login'),
        React.createElement('button', { style: tabStyle('register'), onClick: function() { switchTab('register'); } }, 'Register'),
        React.createElement('button', { style: tabStyle('forgot'), onClick: function() { switchTab('forgot'); } }, 'Forgot')
      ),
      tab === 'register' && field('Full Name', 'name', 'text'),
      field('Email Address', 'email', 'email'),
      tab !== 'forgot' && field('Password', 'password', 'password'),
      tab !== 'forgot' && form.password && React.createElement('div', { style: { marginBottom: '12px' } },
        React.createElement('div', { style: { display: 'flex', gap: '4px', marginBottom: '4px' } },
          [1,2,3,4].map(function(i) {
            return React.createElement('div', { key: i, style: {
              flex: 1, height: '4px', borderRadius: '2px',
              background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.1)'
            }});
          })
        ),
        React.createElement('div', { style: { fontSize: '12px', color: strengthColors[strength] } }, strength > 0 ? strengthLabels[strength] : '')
      ),
      tab === 'register' && field('Confirm Password', 'confirmPassword', 'password'),
      tab === 'login' && React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '13px', color: '#aaa', cursor: 'pointer' } },
        React.createElement('input', {
          type: 'checkbox',
          checked: form.remember,
          onChange: function(e) { update('remember', e.target.checked); },
          style: { accentColor: '#bd93f9' }
        }),
        'Remember me'
      ),
      React.createElement('button', { style: btnStyle, onClick: handleSubmit, disabled: loading },
        loading ? 'Please wait...' : (tab === 'login' ? 'Sign In' : tab === 'register' ? 'Create Account' : 'Send Reset Link')
      ),
      tab === 'login' && React.createElement('div', { style: { textAlign: 'center', marginTop: '16px' } },
        React.createElement('span', { style: { color: '#888', fontSize: '13px' } }, "Don't have an account? "),
        React.createElement('span', { style: { color: '#bd93f9', cursor: 'pointer', fontSize: '13px' }, onClick: function() { switchTab('register'); } }, 'Sign up')
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
