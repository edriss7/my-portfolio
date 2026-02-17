const { useState, useCallback } = React;

var steps = ['Personal Info', 'Address', 'Preferences', 'Review & Submit'];

function App() {
  var _s = useState(0);
  var step = _s[0]; var setStep = _s[1];
  var _s2 = useState({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', state: '', zip: '',
    newsletter: true, theme: 'dark', frequency: 'weekly', interests: []
  });
  var data = _s2[0]; var setData = _s2[1];
  var _s3 = useState({});
  var errors = _s3[0]; var setErrors = _s3[1];
  var _s4 = useState(false);
  var submitted = _s4[0]; var setSubmitted = _s4[1];

  var update = function(key, val) {
    setData(function(p) { var n = Object.assign({}, p); n[key] = val; return n; });
    setErrors(function(p) { var n = Object.assign({}, p); delete n[key]; return n; });
  };

  var toggleInterest = function(val) {
    setData(function(p) {
      var arr = p.interests.slice();
      var idx = arr.indexOf(val);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(val);
      return Object.assign({}, p, { interests: arr });
    });
  };

  var validateStep = function(s) {
    var e = {};
    if (s === 0) {
      if (!data.firstName.trim()) e.firstName = 'Required';
      if (!data.lastName.trim()) e.lastName = 'Required';
      if (!data.email.trim()) e.email = 'Required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Invalid email';
      if (data.phone && !/^\d{10,}$/.test(data.phone.replace(/\D/g, ''))) e.phone = 'Invalid phone';
    } else if (s === 1) {
      if (!data.street.trim()) e.street = 'Required';
      if (!data.city.trim()) e.city = 'Required';
      if (!data.state.trim()) e.state = 'Required';
      if (!data.zip.trim()) e.zip = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  var next = function() {
    if (validateStep(step)) setStep(function(s) { return Math.min(s + 1, 3); });
  };
  var back = function() { setStep(function(s) { return Math.max(s - 1, 0); }); };
  var submit = function() { setSubmitted(true); };

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
    width: '100%', maxWidth: '560px',
    background: 'rgba(255,255,255,0.05)', borderRadius: '16px',
    padding: '32px', border: '1px solid rgba(255,255,255,0.1)'
  };
  var inputStyle = function(hasErr) {
    return {
      width: '100%', padding: '11px 14px',
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid ' + (hasErr ? '#ff5555' : 'rgba(255,255,255,0.15)'),
      borderRadius: '8px', color: '#e0e0e0', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
    };
  };
  var labelStyle = { fontSize: '13px', color: '#aaa', marginBottom: '6px', display: 'block' };
  var errStyle = { color: '#ff5555', fontSize: '12px', minHeight: '16px', marginTop: '2px' };
  var row = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };

  var field = function(label, key, type) {
    return React.createElement('div', { style: { marginBottom: '12px' } },
      React.createElement('label', { style: labelStyle }, label),
      React.createElement('input', {
        type: type || 'text', value: data[key],
        onChange: function(e) { update(key, e.target.value); },
        style: inputStyle(!!errors[key])
      }),
      React.createElement('div', { style: errStyle }, errors[key] || '')
    );
  };

  var progress = ((step + 1) / steps.length) * 100;

  if (submitted) {
    return React.createElement('div', { style: containerStyle },
      React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
      React.createElement('div', { style: Object.assign({}, cardStyle, { textAlign: 'center' }) },
        React.createElement('div', { style: { fontSize: '48px', color: '#50fa7b', marginBottom: '16px' } }, '\u2713'),
        React.createElement('h2', { style: { color: '#fff', marginBottom: '8px' } }, 'Form Submitted!'),
        React.createElement('p', { style: { color: '#888' } }, 'Thank you, ' + data.firstName + '. Your information has been recorded.'),
        React.createElement('button', {
          style: { marginTop: '20px', padding: '12px 24px', background: '#bd93f9', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' },
          onClick: function() { setSubmitted(false); setStep(0); setData({ firstName:'',lastName:'',email:'',phone:'',street:'',city:'',state:'',zip:'',newsletter:true,theme:'dark',frequency:'weekly',interests:[] }); }
        }, 'Start Over')
      )
    );
  }

  var interestOptions = ['Technology', 'Design', 'Business', 'Science', 'Art', 'Music'];

  var stepContent;
  if (step === 0) {
    stepContent = React.createElement('div', null,
      React.createElement('div', { style: row }, field('First Name', 'firstName'), field('Last Name', 'lastName')),
      field('Email', 'email', 'email'),
      field('Phone (optional)', 'phone', 'tel')
    );
  } else if (step === 1) {
    stepContent = React.createElement('div', null,
      field('Street Address', 'street'),
      React.createElement('div', { style: row }, field('City', 'city'), field('State', 'state')),
      field('ZIP Code', 'zip')
    );
  } else if (step === 2) {
    stepContent = React.createElement('div', null,
      React.createElement('div', { style: { marginBottom: '16px' } },
        React.createElement('label', { style: labelStyle }, 'Email Frequency'),
        React.createElement('select', {
          value: data.frequency,
          onChange: function(e) { update('frequency', e.target.value); },
          style: Object.assign({}, inputStyle(false), { cursor: 'pointer' })
        },
          React.createElement('option', { value: 'daily' }, 'Daily'),
          React.createElement('option', { value: 'weekly' }, 'Weekly'),
          React.createElement('option', { value: 'monthly' }, 'Monthly')
        )
      ),
      React.createElement('label', { style: Object.assign({}, labelStyle, { marginBottom: '10px' }) }, 'Interests'),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' } },
        interestOptions.map(function(opt) {
          var sel = data.interests.indexOf(opt) >= 0;
          return React.createElement('button', {
            key: opt,
            onClick: function() { toggleInterest(opt); },
            style: {
              padding: '8px 16px', borderRadius: '20px', border: '1px solid ' + (sel ? '#bd93f9' : 'rgba(255,255,255,0.15)'),
              background: sel ? 'rgba(189,147,249,0.2)' : 'transparent',
              color: sel ? '#bd93f9' : '#aaa', cursor: 'pointer', fontSize: '13px'
            }
          }, opt);
        })
      ),
      React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' } },
        React.createElement('input', { type: 'checkbox', checked: data.newsletter, onChange: function(e) { update('newsletter', e.target.checked); }, style: { accentColor: '#bd93f9' } }),
        'Subscribe to newsletter'
      )
    );
  } else {
    var reviewItem = function(label, val) {
      return React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' } },
        React.createElement('span', { style: { color: '#888', fontSize: '13px' } }, label),
        React.createElement('span', { style: { color: '#fff', fontSize: '13px' } }, val || '\u2014')
      );
    };
    stepContent = React.createElement('div', null,
      React.createElement('h3', { style: { color: '#bd93f9', fontSize: '15px', marginBottom: '10px' } }, 'Personal Info'),
      reviewItem('Name', data.firstName + ' ' + data.lastName),
      reviewItem('Email', data.email),
      reviewItem('Phone', data.phone),
      React.createElement('h3', { style: { color: '#bd93f9', fontSize: '15px', marginTop: '16px', marginBottom: '10px' } }, 'Address'),
      reviewItem('Street', data.street),
      reviewItem('City/State', data.city + ', ' + data.state + ' ' + data.zip),
      React.createElement('h3', { style: { color: '#bd93f9', fontSize: '15px', marginTop: '16px', marginBottom: '10px' } }, 'Preferences'),
      reviewItem('Frequency', data.frequency),
      reviewItem('Newsletter', data.newsletter ? 'Yes' : 'No'),
      reviewItem('Interests', data.interests.join(', '))
    );
  }

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '28px', color: '#fff', marginBottom: '24px' } }, 'Multi-Step Form'),
    React.createElement('div', { style: cardStyle },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } },
        steps.map(function(s, i) {
          var active = i === step;
          var done = i < step;
          return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: '6px' } },
            React.createElement('div', { style: {
              width: '28px', height: '28px', borderRadius: '50%',
              background: done ? '#50fa7b' : active ? '#bd93f9' : 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 'bold', color: done || active ? '#fff' : '#666'
            } }, done ? '\u2713' : String(i + 1)),
            React.createElement('span', { style: { fontSize: '12px', color: active ? '#bd93f9' : '#666', display: i < 2 ? 'inline' : 'none' } }, s)
          );
        })
      ),
      React.createElement('div', { style: { height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '24px' } },
        React.createElement('div', { style: { height: '100%', width: progress + '%', background: 'linear-gradient(90deg, #bd93f9, #ff79c6)', borderRadius: '2px', transition: 'width 0.3s' } })
      ),
      React.createElement('h2', { style: { fontSize: '18px', color: '#fff', marginBottom: '20px' } }, steps[step]),
      stepContent,
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '24px' } },
        step > 0
          ? React.createElement('button', {
              onClick: back,
              style: { padding: '12px 24px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#aaa', cursor: 'pointer', fontWeight: 'bold' }
            }, '\u2190 Back')
          : React.createElement('div', null),
        step < 3
          ? React.createElement('button', {
              onClick: next,
              style: { padding: '12px 24px', background: 'linear-gradient(135deg, #bd93f9, #ff79c6)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }
            }, 'Next \u2192')
          : React.createElement('button', {
              onClick: submit,
              style: { padding: '12px 24px', background: 'linear-gradient(135deg, #50fa7b, #00d68f)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }
            }, 'Submit')
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
