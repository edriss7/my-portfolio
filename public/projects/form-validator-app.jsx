const { useState, useCallback } = React;

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  var validators = {
    name: function(v) {
      if (!v.trim()) return 'Name is required';
      if (v.trim().length < 2) return 'Name must be at least 2 characters';
      return '';
    },
    email: function(v) {
      if (!v.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email';
      return '';
    },
    password: function(v) {
      if (!v) return 'Password is required';
      if (v.length < 8) return 'Password must be at least 8 characters';
      if (!/[A-Z]/.test(v)) return 'Password must contain an uppercase letter';
      if (!/[0-9]/.test(v)) return 'Password must contain a number';
      return '';
    },
    confirmPassword: function(v) {
      if (!v) return 'Please confirm your password';
      if (v !== formData.password) return 'Passwords do not match';
      return '';
    },
    phone: function(v) {
      if (!v.trim()) return 'Phone number is required';
      var digits = v.replace(/\D/g, '');
      if (digits.length < 10) return 'Phone number must be at least 10 digits';
      return '';
    }
  };

  var errors = {};
  Object.keys(validators).forEach(function(key) {
    errors[key] = validators[key](formData[key]);
  });

  var passwordStrength = function() {
    var p = formData.password;
    if (!p) return { level: 0, label: '', color: '#555' };
    var score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: '#ef4444' };
    if (score <= 2) return { level: 2, label: 'Fair', color: '#f59e0b' };
    if (score <= 3) return { level: 3, label: 'Good', color: '#3b82f6' };
    return { level: 4, label: 'Strong', color: '#22c55e' };
  }();

  var isValid = Object.values(errors).every(function(e) { return e === ''; });

  var handleChange = function(field, value) {
    setFormData(function(prev) {
      var next = Object.assign({}, prev);
      next[field] = value;
      return next;
    });
  };

  var handleBlur = function(field) {
    setTouched(function(prev) {
      var next = Object.assign({}, prev);
      next[field] = true;
      return next;
    });
  };

  var handleSubmit = function() {
    var allTouched = {};
    Object.keys(formData).forEach(function(k) { allTouched[k] = true; });
    setTouched(allTouched);
    if (isValid) {
      setSubmitted(true);
    }
  };

  var styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0ff', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px' },
    backLink: { color: '#8888ff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' },
    title: { textAlign: 'center', fontSize: '32px', marginBottom: '10px', color: '#ffffff' },
    subtitle: { textAlign: 'center', fontSize: '16px', color: '#aaa', marginBottom: '30px' },
    form: { maxWidth: '480px', margin: '0 auto', background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '30px', border: '1px solid rgba(255,255,255,0.1)' },
    fieldGroup: { marginBottom: '22px' },
    labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
    label: { fontSize: '14px', fontWeight: 'bold', color: '#ccc' },
    inputWrapper: { position: 'relative' },
    input: { width: '100%', padding: '12px 40px 12px 14px', fontSize: '15px', background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#e0e0ff', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.3s' },
    inputValid: { borderColor: '#22c55e' },
    inputError: { borderColor: '#ef4444' },
    indicator: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', fontWeight: 'bold' },
    errorText: { fontSize: '12px', color: '#ef4444', marginTop: '5px' },
    strengthBar: { display: 'flex', gap: '4px', marginTop: '8px' },
    strengthSegment: { height: '4px', flex: 1, borderRadius: '2px', transition: 'background 0.3s' },
    strengthLabel: { fontSize: '12px', marginTop: '4px', textAlign: 'right' },
    submitBtn: { width: '100%', padding: '14px', fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.3s', marginTop: '10px' },
    successOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    successCard: { background: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)', borderRadius: '20px', padding: '40px', textAlign: 'center', border: '2px solid #22c55e', maxWidth: '400px' }
  };

  var fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
    { key: 'password', label: 'Password', type: 'password', placeholder: 'At least 8 characters' },
    { key: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Re-enter password' },
    { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '(555) 123-4567' }
  ];

  if (submitted) {
    return React.createElement('div', { style: styles.container },
      React.createElement('div', { style: styles.successOverlay },
        React.createElement('div', { style: styles.successCard },
          React.createElement('div', { style: { fontSize: '60px', marginBottom: '15px' } }, '\u2713'),
          React.createElement('h2', { style: { color: '#22c55e', marginBottom: '10px', fontSize: '24px' } }, 'Success!'),
          React.createElement('p', { style: { color: '#aaa', marginBottom: '25px' } }, 'Your form has been submitted successfully.'),
          React.createElement('button', {
            onClick: function() { setSubmitted(false); setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '' }); setTouched({}); },
            style: Object.assign({}, styles.submitBtn, { background: '#22c55e', color: '#fff', width: 'auto', padding: '12px 30px' })
          }, 'Submit Another')
        )
      )
    );
  }

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, 'Form Validator'),
    React.createElement('p', { style: styles.subtitle }, 'Fill in all fields with valid data to submit'),

    React.createElement('div', { style: styles.form },
      fields.map(function(field) {
        var hasError = touched[field.key] && errors[field.key];
        var isFieldValid = touched[field.key] && !errors[field.key];
        var inputStyle = Object.assign({}, styles.input, hasError ? styles.inputError : {}, isFieldValid ? styles.inputValid : {});

        return React.createElement('div', { key: field.key, style: styles.fieldGroup },
          React.createElement('div', { style: styles.labelRow },
            React.createElement('label', { style: styles.label }, field.label)
          ),
          React.createElement('div', { style: styles.inputWrapper },
            React.createElement('input', {
              type: field.type,
              placeholder: field.placeholder,
              value: formData[field.key],
              onChange: function(e) { handleChange(field.key, e.target.value); },
              onBlur: function() { handleBlur(field.key); },
              style: inputStyle
            }),
            touched[field.key] && React.createElement('span', {
              style: Object.assign({}, styles.indicator, { color: isFieldValid ? '#22c55e' : '#ef4444' })
            }, isFieldValid ? '\u2713' : '\u2717')
          ),
          hasError && React.createElement('div', { style: styles.errorText }, errors[field.key]),
          field.key === 'password' && formData.password && React.createElement('div', null,
            React.createElement('div', { style: styles.strengthBar },
              [1, 2, 3, 4].map(function(seg) {
                return React.createElement('div', {
                  key: seg,
                  style: Object.assign({}, styles.strengthSegment, {
                    background: seg <= passwordStrength.level ? passwordStrength.color : 'rgba(255,255,255,0.1)'
                  })
                });
              })
            ),
            React.createElement('div', { style: Object.assign({}, styles.strengthLabel, { color: passwordStrength.color }) }, passwordStrength.label)
          )
        );
      }),

      React.createElement('button', {
        onClick: handleSubmit,
        disabled: !isValid,
        style: Object.assign({}, styles.submitBtn, {
          background: isValid ? 'linear-gradient(135deg, #22c55e, #16a34a)' : '#333',
          color: isValid ? '#fff' : '#666',
          cursor: isValid ? 'pointer' : 'not-allowed'
        })
      }, 'Submit Form')
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
