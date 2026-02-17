const { useState, useEffect, useRef, useCallback } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'inline-block' };

function App() {
  var _c = useState(true), connected = _c[0], setConnected = _c[1];
  var _r = useState(0), requestCount = _r[0], setRequestCount = _r[1];
  var _l = useState([45, 50, 42, 60, 55, 48, 52, 58, 46, 53, 61, 44, 50, 55, 47, 59, 63, 41, 56, 49]), latencyHistory = _l[0], setLatencyHistory = _l[1];
  var _lat = useState(45), latency = _lat[0], setLatency = _lat[1];
  var _srv = useState([
    { name: 'API Server', status: true, load: 42 },
    { name: 'Database', status: true, load: 65 },
    { name: 'Cache (Redis)', status: true, load: 23 },
    { name: 'Worker Queue', status: true, load: 78 },
    { name: 'CDN Edge', status: true, load: 15 }
  ]), servers = _srv[0], setServers = _srv[1];
  var _ev = useState([]), events = _ev[0], setEvents = _ev[1];
  var _rps = useState([12, 15, 18, 14, 20, 22, 17, 19, 25, 21, 16, 23, 28, 24, 18, 26, 30, 22, 27, 20]), rpsHistory = _rps[0], setRpsHistory = _rps[1];

  var eventTypes = ['GET /api/users', 'POST /api/data', 'GET /api/health', 'PUT /api/config', 'DELETE /api/cache', 'GET /api/metrics', 'POST /api/auth/login'];
  var statusCodes = [200, 200, 200, 201, 204, 200, 304, 200, 500, 200, 200, 403];

  useEffect(function() {
    if (!connected) return;
    var iv = setInterval(function() {
      var newLat = 20 + Math.floor(Math.random() * 80);
      setLatency(newLat);
      setLatencyHistory(function(h) { var n = h.slice(-19); n.push(newLat); return n; });
      setRequestCount(function(c) { return c + Math.floor(Math.random() * 5) + 1; });
      var newRps = 10 + Math.floor(Math.random() * 30);
      setRpsHistory(function(h) { var n = h.slice(-19); n.push(newRps); return n; });
      setServers(function(srv) { return srv.map(function(s) {
        return Object.assign({}, s, { load: Math.max(5, Math.min(95, s.load + Math.floor(Math.random() * 21) - 10)), status: Math.random() > 0.03 ? true : !s.status });
      }); });
      var evt = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      var code = statusCodes[Math.floor(Math.random() * statusCodes.length)];
      var now = new Date();
      var ts = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ':' + now.getSeconds().toString().padStart(2, '0');
      setEvents(function(e) { return [{ time: ts, event: evt, status: code, latency: newLat }].concat(e.slice(0, 49)); });
    }, 1000);
    return function() { clearInterval(iv); };
  }, [connected]);

  var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)', color: '#e2e8f0', fontFamily: "'Segoe UI', sans-serif", padding: '20px' };
  var cardStyle = { background: 'rgba(30,41,59,0.8)', borderRadius: '12px', padding: '16px', border: '1px solid #334155' };
  var gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' };

  var renderChart = function(data, maxVal, color, height) {
    var h = height || 100;
    var mx = maxVal || Math.max.apply(null, data);
    return React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '2px', height: h + 'px', padding: '4px 0' } },
      data.map(function(v, i) {
        var barH = Math.max(2, (v / mx) * h);
        return React.createElement('div', { key: i, style: { flex: 1, height: barH + 'px', background: 'linear-gradient(to top, ' + color + ', ' + color + '88)', borderRadius: '2px 2px 0 0', transition: 'height 0.3s' } });
      })
    );
  };

  var renderGauge = function(value, max, label) {
    var pct = Math.min(100, (value / max) * 100);
    var color = pct < 40 ? '#22c55e' : pct < 70 ? '#fbbf24' : '#ef4444';
    return React.createElement('div', { style: { textAlign: 'center' } }, [
      React.createElement('div', { key: 'bar', style: { width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' } },
        React.createElement('div', { style: { width: pct + '%', height: '100%', background: color, borderRadius: '4px', transition: 'width 0.5s' } })
      ),
      React.createElement('div', { key: 'val', style: { fontSize: '24px', fontWeight: 'bold', color: color } }, value + 'ms'),
      React.createElement('div', { key: 'lab', style: { fontSize: '12px', color: '#94a3b8' } }, label)
    ]);
  };

  var statusDot = function(on) { return { width: '10px', height: '10px', borderRadius: '50%', background: on ? '#22c55e' : '#ef4444', display: 'inline-block', boxShadow: on ? '0 0 8px #22c55e' : '0 0 8px #ef4444' }; };

  return React.createElement('div', { style: containerStyle }, [
    React.createElement('a', { key: 'back', href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('div', { key: 'header', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } }, [
      React.createElement('h1', { key: 't', style: { fontSize: '26px', fontWeight: 'bold', color: '#67e8f9', margin: 0 } }, 'Real-Time Dashboard'),
      React.createElement('div', { key: 'conn', style: { display: 'flex', alignItems: 'center', gap: '10px' } }, [
        React.createElement('span', { key: 'dot', style: statusDot(connected) }),
        React.createElement('span', { key: 'txt', style: { fontSize: '13px', color: connected ? '#22c55e' : '#ef4444' } }, connected ? 'Connected' : 'Disconnected'),
        React.createElement('button', { key: 'btn', onClick: function() { setConnected(!connected); }, style: { padding: '6px 14px', background: connected ? '#ef4444' : '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' } }, connected ? 'Disconnect' : 'Connect')
      ])
    ]),
    React.createElement('div', { key: 'stats', style: gridStyle }, [
      React.createElement('div', { key: 'req', style: cardStyle }, [
        React.createElement('div', { key: 'l', style: { fontSize: '12px', color: '#94a3b8', marginBottom: '4px' } }, 'Total Requests'),
        React.createElement('div', { key: 'v', style: { fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' } }, requestCount.toLocaleString())
      ]),
      React.createElement('div', { key: 'lat', style: cardStyle }, renderGauge(latency, 120, 'Avg Latency')),
      React.createElement('div', { key: 'up', style: cardStyle }, [
        React.createElement('div', { key: 'l', style: { fontSize: '12px', color: '#94a3b8', marginBottom: '4px' } }, 'Uptime'),
        React.createElement('div', { key: 'v', style: { fontSize: '32px', fontWeight: 'bold', color: '#22c55e' } }, '99.97%')
      ])
    ]),
    React.createElement('div', { key: 'charts', style: gridStyle }, [
      React.createElement('div', { key: 'latChart', style: cardStyle }, [
        React.createElement('div', { key: 'l', style: { fontSize: '13px', color: '#94a3b8', marginBottom: '8px' } }, 'Latency (ms) - Last 20s'),
        renderChart(latencyHistory, 120, '#8b5cf6', 100)
      ]),
      React.createElement('div', { key: 'rpsChart', style: cardStyle }, [
        React.createElement('div', { key: 'l', style: { fontSize: '13px', color: '#94a3b8', marginBottom: '8px' } }, 'Requests/sec - Last 20s'),
        renderChart(rpsHistory, 40, '#67e8f9', 100)
      ])
    ]),
    React.createElement('div', { key: 'bottom', style: Object.assign({}, gridStyle, { gridTemplateColumns: '1fr 1fr' }) }, [
      React.createElement('div', { key: 'servers', style: cardStyle }, [
        React.createElement('div', { key: 'l', style: { fontSize: '14px', color: '#94a3b8', marginBottom: '12px', fontWeight: 'bold' } }, 'Server Status'),
        React.createElement('div', { key: 'list' }, servers.map(function(s, i) {
          return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e293b' } }, [
            React.createElement('div', { key: 'info', style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
              React.createElement('span', { key: 'dot', style: statusDot(s.status) }),
              React.createElement('span', { key: 'name', style: { fontSize: '13px' } }, s.name)
            ]),
            React.createElement('div', { key: 'load', style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
              React.createElement('div', { key: 'bar', style: { width: '80px', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' } },
                React.createElement('div', { style: { width: s.load + '%', height: '100%', background: s.load < 50 ? '#22c55e' : s.load < 80 ? '#fbbf24' : '#ef4444', transition: 'width 0.5s' } })
              ),
              React.createElement('span', { key: 'pct', style: { fontSize: '11px', color: '#94a3b8', width: '30px' } }, s.load + '%')
            ])
          ]);
        }))
      ]),
      React.createElement('div', { key: 'events', style: Object.assign({}, cardStyle, { maxHeight: '300px', overflowY: 'auto' }) }, [
        React.createElement('div', { key: 'l', style: { fontSize: '14px', color: '#94a3b8', marginBottom: '12px', fontWeight: 'bold' } }, 'Event Log'),
        React.createElement('div', { key: 'list' }, events.slice(0, 20).map(function(ev, i) {
          var codeColor = ev.status < 300 ? '#22c55e' : ev.status < 400 ? '#fbbf24' : '#ef4444';
          return React.createElement('div', { key: i, style: { display: 'flex', gap: '10px', padding: '4px 0', borderBottom: '1px solid rgba(51,65,85,0.5)', fontSize: '11px', fontFamily: 'monospace' } }, [
            React.createElement('span', { key: 't', style: { color: '#64748b' } }, ev.time),
            React.createElement('span', { key: 's', style: { color: codeColor, fontWeight: 'bold', width: '30px' } }, ev.status),
            React.createElement('span', { key: 'e', style: { color: '#e2e8f0', flex: 1 } }, ev.event),
            React.createElement('span', { key: 'l', style: { color: '#94a3b8' } }, ev.latency + 'ms')
          ]);
        }))
      ])
    ])
  ]);
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
