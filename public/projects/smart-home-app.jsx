const { useState, useCallback } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, sans-serif", padding: '24px' };
var cardStyle = { background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' };

var ROOMS = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom'];
var ROOM_ICONS = { 'Living Room': '\uD83D\uDECB', 'Bedroom': '\uD83D\uDECF', 'Kitchen': '\uD83C\uDF73', 'Bathroom': '\uD83D\uDEC1' };

var SCENES = [
  { name: 'Morning', icon: '\u2600', color: '#ffb347', desc: 'Lights on, thermostat 72\u00B0F' },
  { name: 'Night', icon: '\uD83C\uDF19', color: '#6c5ce7', desc: 'Dim lights, lock doors, 68\u00B0F' },
  { name: 'Away', icon: '\uD83D\uDD12', color: '#e74c3c', desc: 'All off, lock everything, cameras on' },
  { name: 'Movie', icon: '\uD83C\uDFAC', color: '#00b894', desc: 'Dim lights 20%, TV on' }
];

var ENERGY_DATA = [
  { hour: '6am', kwh: 1.2 }, { hour: '8am', kwh: 2.8 }, { hour: '10am', kwh: 2.1 },
  { hour: '12pm', kwh: 3.5 }, { hour: '2pm', kwh: 3.2 }, { hour: '4pm', kwh: 2.9 },
  { hour: '6pm', kwh: 4.1 }, { hour: '8pm', kwh: 3.8 }, { hour: '10pm', kwh: 2.4 }
];

function App() {
  var _r = useState('Living Room'), room = _r[0], setRoom = _r[1];
  var _d = useState({
    'Living Room': { light: 75, temp: 72, lock: true, camera: true },
    'Bedroom': { light: 40, temp: 70, lock: true, camera: false },
    'Kitchen': { light: 100, temp: 72, lock: false, camera: true },
    'Bathroom': { light: 60, temp: 74, lock: false, camera: false }
  }), devices = _d[0], setDevices = _d[1];
  var _a = useState(null), activeScene = _a[0], setActiveScene = _a[1];

  var updateDevice = useCallback(function(r, key, val) {
    setDevices(function(prev) {
      var copy = Object.assign({}, prev);
      copy[r] = Object.assign({}, copy[r]);
      copy[r][key] = val;
      return copy;
    });
  }, []);

  var applyScene = function(scene) {
    setActiveScene(scene.name);
    if (scene.name === 'Night') {
      ROOMS.forEach(function(r) { updateDevice(r, 'light', 15); updateDevice(r, 'lock', true); updateDevice(r, 'temp', 68); });
    } else if (scene.name === 'Morning') {
      ROOMS.forEach(function(r) { updateDevice(r, 'light', 80); updateDevice(r, 'temp', 72); });
    } else if (scene.name === 'Away') {
      ROOMS.forEach(function(r) { updateDevice(r, 'light', 0); updateDevice(r, 'lock', true); updateDevice(r, 'camera', true); });
    } else {
      updateDevice(room, 'light', 20);
    }
  };

  var rd = devices[room];
  var maxKwh = Math.max.apply(null, ENERGY_DATA.map(function(e) { return e.kwh; }));

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '28px', fontWeight: 'bold', marginBottom: '6px', background: 'linear-gradient(90deg, #00b894, #8be9fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Smart Home Dashboard'),
    React.createElement('p', { style: { color: '#888', marginBottom: '24px', fontSize: '14px' } }, 'Control your connected home'),

    // Room selector
    React.createElement('div', { style: { display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' } },
      ROOMS.map(function(r) {
        return React.createElement('button', {
          key: r, onClick: function() { setRoom(r); },
          style: { padding: '12px 20px', borderRadius: '12px', border: room === r ? '2px solid #00b894' : '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: room === r ? 'rgba(0,184,148,0.15)' : 'rgba(255,255,255,0.05)', color: room === r ? '#00b894' : '#aaa', fontSize: '14px', fontWeight: '600' }
        }, ROOM_ICONS[r] + ' ' + r);
      })
    ),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' } },

      // Lights
      React.createElement('div', { style: cardStyle },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' } },
          React.createElement('h3', { style: { margin: 0, fontSize: '16px' } }, '\uD83D\uDCA1 Lights'),
          React.createElement('span', { style: { color: rd.light > 0 ? '#ffd93d' : '#666', fontSize: '14px', fontWeight: 'bold' } }, rd.light > 0 ? 'ON' : 'OFF')
        ),
        React.createElement('div', { style: { marginBottom: '8px', fontSize: '13px', color: '#aaa' } }, 'Brightness: ' + rd.light + '%'),
        React.createElement('input', { type: 'range', min: 0, max: 100, value: rd.light, onChange: function(e) { updateDevice(room, 'light', Number(e.target.value)); }, style: { width: '100%', accentColor: '#ffd93d' } }),
        React.createElement('div', { style: { height: '40px', borderRadius: '8px', marginTop: '12px', background: 'radial-gradient(circle, rgba(255,217,61,' + (rd.light / 100 * 0.6) + ') 0%, transparent 70%)', transition: 'all 0.3s' } })
      ),

      // Thermostat
      React.createElement('div', { style: cardStyle },
        React.createElement('h3', { style: { margin: '0 0 16px 0', fontSize: '16px' } }, '\uD83C\uDF21 Thermostat'),
        React.createElement('div', { style: { textAlign: 'center', marginBottom: '12px' } },
          React.createElement('div', { style: { fontSize: '48px', fontWeight: 'bold', color: rd.temp > 75 ? '#ff6b6b' : rd.temp < 65 ? '#74b9ff' : '#00b894' } }, rd.temp + '\u00B0'),
          React.createElement('div', { style: { fontSize: '12px', color: '#888' } }, 'Target Temperature (\u00B0F)')
        ),
        React.createElement('input', { type: 'range', min: 60, max: 85, value: rd.temp, onChange: function(e) { updateDevice(room, 'temp', Number(e.target.value)); }, style: { width: '100%', accentColor: '#00b894' } }),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', marginTop: '4px' } },
          React.createElement('span', null, '60\u00B0F'), React.createElement('span', null, '85\u00B0F')
        )
      ),

      // Smart Lock
      React.createElement('div', { style: cardStyle },
        React.createElement('h3', { style: { margin: '0 0 16px 0', fontSize: '16px' } }, '\uD83D\uDD12 Smart Lock'),
        React.createElement('div', { style: { textAlign: 'center' } },
          React.createElement('div', {
            onClick: function() { updateDevice(room, 'lock', !rd.lock); },
            style: { width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', cursor: 'pointer', background: rd.lock ? 'rgba(0,184,148,0.2)' : 'rgba(255,107,107,0.2)', border: '3px solid ' + (rd.lock ? '#00b894' : '#ff6b6b'), transition: 'all 0.3s' }
          }, rd.lock ? '\uD83D\uDD12' : '\uD83D\uDD13'),
          React.createElement('div', { style: { fontSize: '16px', fontWeight: 'bold', color: rd.lock ? '#00b894' : '#ff6b6b' } }, rd.lock ? 'Locked' : 'Unlocked'),
          React.createElement('div', { style: { fontSize: '12px', color: '#888', marginTop: '4px' } }, 'Tap to toggle')
        )
      ),

      // Camera
      React.createElement('div', { style: cardStyle },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' } },
          React.createElement('h3', { style: { margin: 0, fontSize: '16px' } }, '\uD83D\uDCF7 Camera'),
          React.createElement('button', {
            onClick: function() { updateDevice(room, 'camera', !rd.camera); },
            style: { padding: '4px 12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', background: rd.camera ? '#00b894' : '#666', color: '#fff' }
          }, rd.camera ? 'ON' : 'OFF')
        ),
        React.createElement('div', { style: { background: rd.camera ? 'linear-gradient(135deg, #1a2a3a, #2a3a4a)' : '#111', borderRadius: '8px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' } },
          rd.camera ?
            React.createElement(React.Fragment, null,
              React.createElement('div', { style: { position: 'absolute', top: '8px', left: '8px', display: 'flex', alignItems: 'center', gap: '6px' } },
                React.createElement('div', { style: { width: '8px', height: '8px', borderRadius: '50%', background: '#ff4444', animation: 'none', boxShadow: '0 0 6px #ff4444' } }),
                React.createElement('span', { style: { fontSize: '10px', color: '#ff6b6b' } }, 'LIVE')
              ),
              React.createElement('div', { style: { fontSize: '13px', color: '#556' } }, room + ' Camera Feed'),
              React.createElement('div', { style: { position: 'absolute', bottom: '8px', right: '8px', fontSize: '10px', color: '#666' } }, '14:32:01')
            ) :
            React.createElement('span', { style: { color: '#444', fontSize: '13px' } }, 'Camera Off')
        )
      )
    ),

    // Scenes
    React.createElement('h3', { style: { fontSize: '16px', marginBottom: '12px', color: '#aaa' } }, 'Quick Scenes'),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' } },
      SCENES.map(function(s) {
        return React.createElement('div', {
          key: s.name, onClick: function() { applyScene(s); },
          style: { padding: '16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', background: activeScene === s.name ? s.color + '22' : 'rgba(255,255,255,0.04)', border: activeScene === s.name ? '2px solid ' + s.color : '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s' }
        },
          React.createElement('div', { style: { fontSize: '28px', marginBottom: '6px' } }, s.icon),
          React.createElement('div', { style: { fontWeight: 'bold', fontSize: '14px', color: activeScene === s.name ? s.color : '#ccc' } }, s.name),
          React.createElement('div', { style: { fontSize: '11px', color: '#888', marginTop: '4px' } }, s.desc)
        );
      })
    ),

    // Energy usage
    React.createElement('div', { style: cardStyle },
      React.createElement('h3', { style: { margin: '0 0 16px 0', fontSize: '16px' } }, '\u26A1 Energy Usage Today'),
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '8px', height: '150px', padding: '0 4px' } },
        ENERGY_DATA.map(function(e) {
          var pct = (e.kwh / maxKwh) * 100;
          return React.createElement('div', { key: e.hour, style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' } },
            React.createElement('div', { style: { fontSize: '10px', color: '#aaa', marginBottom: '4px' } }, e.kwh + ' kWh'),
            React.createElement('div', { style: { width: '100%', maxWidth: '40px', height: pct + '%', borderRadius: '6px 6px 0 0', background: 'linear-gradient(to top, #00b894, #55efc4)', transition: 'height 0.5s' } }),
            React.createElement('div', { style: { fontSize: '10px', color: '#666', marginTop: '6px' } }, e.hour)
          );
        })
      ),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' } },
        React.createElement('span', { style: { fontSize: '13px', color: '#888' } }, 'Total Today'),
        React.createElement('span', { style: { fontSize: '16px', fontWeight: 'bold', color: '#00b894' } }, ENERGY_DATA.reduce(function(a, e) { return a + e.kwh; }, 0).toFixed(1) + ' kWh')
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
