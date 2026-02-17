const { useState, useMemo } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, sans-serif", padding: '24px' };
var cardStyle = { background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' };

var PATIENT = { name: 'Sarah Johnson', age: 34, dob: '1991-08-15', blood: 'A+', allergies: 'Penicillin', insurance: 'BlueCross PPO', memberId: 'BC-2847193' };

var APPOINTMENTS = [
  { id: 1, doctor: 'Dr. Emily Chen', specialty: 'Primary Care', date: '2026-02-20', time: '10:00 AM', type: 'Check-up', status: 'upcoming' },
  { id: 2, doctor: 'Dr. James Park', specialty: 'Cardiology', date: '2026-02-25', time: '2:30 PM', type: 'Follow-up', status: 'upcoming' },
  { id: 3, doctor: 'Dr. Emily Chen', specialty: 'Primary Care', date: '2026-01-15', time: '9:00 AM', type: 'Annual Physical', status: 'completed' },
  { id: 4, doctor: 'Dr. Lisa Wang', specialty: 'Dermatology', date: '2026-03-05', time: '11:00 AM', type: 'Consultation', status: 'upcoming' }
];

var MEDICATIONS = [
  { name: 'Lisinopril', dose: '10mg', freq: 'Once daily', refill: '2026-03-01', taken: true },
  { name: 'Vitamin D3', dose: '2000 IU', freq: 'Once daily', refill: '2026-04-15', taken: true },
  { name: 'Metformin', dose: '500mg', freq: 'Twice daily', refill: '2026-02-28', taken: false },
  { name: 'Atorvastatin', dose: '20mg', freq: 'Once at bedtime', refill: '2026-03-10', taken: true }
];

var VITALS_HISTORY = [
  { date: 'Feb 10', hr: 72, systolic: 120, diastolic: 80, temp: 98.6 },
  { date: 'Feb 11', hr: 75, systolic: 118, diastolic: 78, temp: 98.4 },
  { date: 'Feb 12', hr: 68, systolic: 122, diastolic: 82, temp: 98.7 },
  { date: 'Feb 13', hr: 71, systolic: 119, diastolic: 79, temp: 98.5 },
  { date: 'Feb 14', hr: 74, systolic: 121, diastolic: 81, temp: 98.6 },
  { date: 'Feb 15', hr: 69, systolic: 117, diastolic: 77, temp: 98.3 },
  { date: 'Feb 16', hr: 73, systolic: 120, diastolic: 80, temp: 98.6 },
  { date: 'Feb 17', hr: 70, systolic: 118, diastolic: 79, temp: 98.5 }
];

var LAB_RESULTS = [
  { test: 'Complete Blood Count', date: '2026-02-10', result: 'Normal', value: 'WBC: 6.5', range: '4.5-11.0' },
  { test: 'Hemoglobin A1C', date: '2026-02-10', result: 'Borderline', value: '5.8%', range: '<5.7%' },
  { test: 'Cholesterol (Total)', date: '2026-02-10', result: 'Normal', value: '195 mg/dL', range: '<200' },
  { test: 'TSH', date: '2026-02-10', result: 'Normal', value: '2.1 mIU/L', range: '0.4-4.0' },
  { test: 'Vitamin D', date: '2026-02-10', result: 'Low', value: '22 ng/mL', range: '30-100' }
];

var MESSAGES = [
  { from: 'Dr. Emily Chen', time: '2:15 PM', text: 'Your lab results look good overall. Vitamin D is a bit low, keep taking the supplement.', isDoctor: true },
  { from: 'You', time: '2:20 PM', text: 'Thank you! Should I increase the dosage?', isDoctor: false },
  { from: 'Dr. Emily Chen', time: '2:25 PM', text: 'The current dose is fine. We will recheck in 3 months. Let me know if you have any other questions.', isDoctor: true }
];

function App() {
  var _t = useState('overview'), tab = _t[0], setTab = _t[1];
  var _msg = useState(''), msg = _msg[0], setMsg = _msg[1];
  var _meds = useState(MEDICATIONS), meds = _meds[0], setMeds = _meds[1];
  var _msgs = useState(MESSAGES), msgs = _msgs[0], setMsgs = _msgs[1];

  var toggleMed = function(i) {
    setMeds(function(prev) { var c = prev.slice(); c[i] = Object.assign({}, c[i], { taken: !c[i].taken }); return c; });
  };

  var sendMsg = function() {
    if (!msg.trim()) return;
    setMsgs(function(prev) { return prev.concat([{ from: 'You', time: 'Now', text: msg, isDoctor: false }]); });
    setMsg('');
  };

  var tabBtn = function(name, label) {
    return React.createElement('button', { key: name, onClick: function() { setTab(name); }, style: { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', background: tab === name ? '#6c5ce7' : 'rgba(255,255,255,0.06)', color: tab === name ? '#fff' : '#aaa' } }, label);
  };

  var maxHr = 80;
  var vitalChart = function(key, color, label, min, max) {
    return React.createElement('div', { style: { marginBottom: '16px' } },
      React.createElement('div', { style: { fontSize: '12px', color: '#888', marginBottom: '6px' } }, label),
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px' } },
        VITALS_HISTORY.map(function(v, i) {
          var val = v[key];
          var pct = ((val - min) / (max - min)) * 100;
          return React.createElement('div', { key: i, style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' } },
            React.createElement('div', { style: { width: '100%', height: Math.max(pct, 10) + '%', borderRadius: '3px 3px 0 0', background: color, opacity: 0.7 + (i / VITALS_HISTORY.length) * 0.3 } }),
            React.createElement('div', { style: { fontSize: '8px', color: '#666', marginTop: '2px' } }, v.date.split(' ')[1])
          );
        })
      ),
      React.createElement('div', { style: { fontSize: '20px', fontWeight: 'bold', color: color, marginTop: '4px' } }, VITALS_HISTORY[VITALS_HISTORY.length - 1][key] + (key === 'temp' ? '\u00B0F' : key === 'hr' ? ' bpm' : ''))
    );
  };

  var patientCard = React.createElement('div', { style: Object.assign({}, cardStyle, { display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }) },
    React.createElement('div', { style: { width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: '#fff' } }, 'SJ'),
    React.createElement('div', { style: { flex: 1, minWidth: '200px' } },
      React.createElement('h2', { style: { margin: 0, fontSize: '20px' } }, PATIENT.name),
      React.createElement('div', { style: { fontSize: '13px', color: '#888', marginTop: '4px' } }, 'Age: ' + PATIENT.age + ' | DOB: ' + PATIENT.dob + ' | Blood: ' + PATIENT.blood),
      React.createElement('div', { style: { fontSize: '12px', color: '#6c5ce7', marginTop: '2px' } }, PATIENT.insurance + ' \u2022 ' + PATIENT.memberId)
    ),
    React.createElement('div', { style: { background: 'rgba(255,107,107,0.15)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px' } },
      React.createElement('span', { style: { color: '#ff6b6b' } }, '\u26A0 Allergies: ' + PATIENT.allergies)
    )
  );

  var content;
  if (tab === 'overview') {
    content = React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' } },
      // Vitals
      React.createElement('div', { style: cardStyle },
        React.createElement('h3', { style: { margin: '0 0 16px 0', fontSize: '16px' } }, '\u2764 Vital Signs'),
        vitalChart('hr', '#ff6b6b', 'Heart Rate', 60, 85),
        vitalChart('systolic', '#6c5ce7', 'Blood Pressure (Systolic)', 110, 130),
        vitalChart('temp', '#00b894', 'Temperature', 97, 100)
      ),
      // Upcoming appointments
      React.createElement('div', { style: cardStyle },
        React.createElement('h3', { style: { margin: '0 0 16px 0', fontSize: '16px' } }, '\uD83D\uDCC5 Upcoming Appointments'),
        APPOINTMENTS.filter(function(a) { return a.status === 'upcoming'; }).map(function(a) {
          return React.createElement('div', { key: a.id, style: { padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', marginBottom: '8px', borderLeft: '3px solid #6c5ce7' } },
            React.createElement('div', { style: { fontWeight: 'bold', fontSize: '14px' } }, a.doctor),
            React.createElement('div', { style: { fontSize: '12px', color: '#6c5ce7' } }, a.specialty + ' \u2022 ' + a.type),
            React.createElement('div', { style: { fontSize: '12px', color: '#888', marginTop: '4px' } }, a.date + ' at ' + a.time)
          );
        })
      ),
      // Medications
      React.createElement('div', { style: cardStyle },
        React.createElement('h3', { style: { margin: '0 0 16px 0', fontSize: '16px' } }, '\uD83D\uDC8A Medications'),
        meds.map(function(m, i) {
          return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', marginBottom: '6px' } },
            React.createElement('div', {
              onClick: function() { toggleMed(i); },
              style: { width: '24px', height: '24px', borderRadius: '6px', border: '2px solid ' + (m.taken ? '#00b894' : '#666'), background: m.taken ? '#00b894' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', flexShrink: 0 }
            }, m.taken ? '\u2713' : ''),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontSize: '14px', fontWeight: '600', textDecoration: m.taken ? 'line-through' : 'none', opacity: m.taken ? 0.6 : 1 } }, m.name + ' ' + m.dose),
              React.createElement('div', { style: { fontSize: '11px', color: '#888' } }, m.freq + ' \u2022 Refill: ' + m.refill)
            )
          );
        })
      )
    );
  } else if (tab === 'labs') {
    content = React.createElement('div', { style: cardStyle },
      React.createElement('h3', { style: { margin: '0 0 16px 0', fontSize: '16px' } }, '\uD83E\uDDEA Lab Results - Feb 10, 2026'),
      React.createElement('div', { style: { overflowX: 'auto' } },
        React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' } },
          React.createElement('thead', null,
            React.createElement('tr', { style: { borderBottom: '1px solid rgba(255,255,255,0.1)' } },
              ['Test', 'Value', 'Reference Range', 'Result', 'Date'].map(function(h) {
                return React.createElement('th', { key: h, style: { padding: '10px', textAlign: 'left', color: '#888' } }, h);
              })
            )
          ),
          React.createElement('tbody', null,
            LAB_RESULTS.map(function(l, i) {
              var color = l.result === 'Normal' ? '#00b894' : l.result === 'Low' ? '#ff6b6b' : '#ffd93d';
              return React.createElement('tr', { key: i, style: { borderBottom: '1px solid rgba(255,255,255,0.05)' } },
                React.createElement('td', { style: { padding: '10px', fontWeight: '600' } }, l.test),
                React.createElement('td', { style: { padding: '10px', fontFamily: 'monospace' } }, l.value),
                React.createElement('td', { style: { padding: '10px', color: '#888' } }, l.range),
                React.createElement('td', { style: { padding: '10px' } },
                  React.createElement('span', { style: { background: color + '22', color: color, padding: '3px 10px', borderRadius: '12px', fontSize: '11px' } }, l.result)
                ),
                React.createElement('td', { style: { padding: '10px', color: '#888' } }, l.date)
              );
            })
          )
        )
      )
    );
  } else if (tab === 'messages') {
    content = React.createElement('div', { style: Object.assign({}, cardStyle, { display: 'flex', flexDirection: 'column', height: '450px' }) },
      React.createElement('h3', { style: { margin: '0 0 12px 0', fontSize: '16px' } }, '\uD83D\uDCAC Messages - Dr. Emily Chen'),
      React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '8px' } },
        msgs.map(function(m, i) {
          return React.createElement('div', { key: i, style: { display: 'flex', justifyContent: m.isDoctor ? 'flex-start' : 'flex-end', marginBottom: '12px' } },
            React.createElement('div', { style: { maxWidth: '70%', padding: '10px 14px', borderRadius: m.isDoctor ? '12px 12px 12px 4px' : '12px 12px 4px 12px', background: m.isDoctor ? 'rgba(108,92,231,0.2)' : 'rgba(0,184,148,0.2)' } },
              React.createElement('div', { style: { fontSize: '11px', color: '#888', marginBottom: '4px' } }, m.from + ' \u2022 ' + m.time),
              React.createElement('div', { style: { fontSize: '14px' } }, m.text)
            )
          );
        })
      ),
      React.createElement('div', { style: { display: 'flex', gap: '8px', marginTop: '12px' } },
        React.createElement('input', { type: 'text', value: msg, onChange: function(e) { setMsg(e.target.value); }, onKeyDown: function(e) { if (e.key === 'Enter') sendMsg(); }, placeholder: 'Type a message...', style: { flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', padding: '10px 14px', fontSize: '14px' } }),
        React.createElement('button', { onClick: sendMsg, style: { padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#6c5ce7', color: '#fff', cursor: 'pointer', fontWeight: 'bold' } }, 'Send')
      )
    );
  }

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '28px', fontWeight: 'bold', marginBottom: '6px', background: 'linear-gradient(90deg, #6c5ce7, #a29bfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Patient Health Portal'),
    React.createElement('p', { style: { color: '#888', marginBottom: '20px', fontSize: '14px' } }, 'Manage your health information'),
    patientCard,
    React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' } },
      tabBtn('overview', 'Overview'),
      tabBtn('labs', 'Lab Results'),
      tabBtn('messages', 'Messages')
    ),
    content
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
