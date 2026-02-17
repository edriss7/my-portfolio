const { useState, useEffect } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, sans-serif", padding: '24px' };
var cardStyle = { background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' };

var SERVERS = [
  { name: 'web-prod-01', status: 'healthy', cpu: 45, memory: 62, disk: 71, uptime: '34d 12h', ip: '10.0.1.10' },
  { name: 'web-prod-02', status: 'healthy', cpu: 38, memory: 55, disk: 68, uptime: '34d 12h', ip: '10.0.1.11' },
  { name: 'api-prod-01', status: 'warning', cpu: 82, memory: 78, disk: 45, uptime: '12d 5h', ip: '10.0.2.10' },
  { name: 'api-prod-02', status: 'healthy', cpu: 35, memory: 48, disk: 52, uptime: '12d 5h', ip: '10.0.2.11' },
  { name: 'db-primary', status: 'healthy', cpu: 55, memory: 85, disk: 72, uptime: '90d 3h', ip: '10.0.3.10' },
  { name: 'db-replica', status: 'critical', cpu: 92, memory: 94, disk: 89, uptime: '0d 2h', ip: '10.0.3.11' },
  { name: 'cache-01', status: 'healthy', cpu: 22, memory: 45, disk: 30, uptime: '45d 8h', ip: '10.0.4.10' },
  { name: 'worker-01', status: 'healthy', cpu: 60, memory: 70, disk: 55, uptime: '7d 14h', ip: '10.0.5.10' }
];

var DEPLOYMENTS = [
  { id: 'D-147', service: 'web-frontend', version: 'v2.4.1', time: '14:20', status: 'success', by: 'alice' },
  { id: 'D-146', service: 'api-gateway', version: 'v3.1.0', time: '13:45', status: 'success', by: 'bob' },
  { id: 'D-145', service: 'auth-service', version: 'v1.8.3', time: '11:30', status: 'failed', by: 'carol' },
  { id: 'D-144', service: 'payment-service', version: 'v2.0.5', time: '10:15', status: 'success', by: 'david' },
  { id: 'D-143', service: 'notification-svc', version: 'v1.2.1', time: '09:00', status: 'rollback', by: 'alice' },
  { id: 'D-142', service: 'web-frontend', version: 'v2.4.0', time: 'Yesterday', status: 'success', by: 'bob' }
];

var INCIDENTS = [
  { id: 'INC-089', title: 'Database replica high CPU', severity: 'critical', time: '14:30', status: 'active', assignee: 'David K.' },
  { id: 'INC-088', title: 'API latency spike on /users endpoint', severity: 'warning', time: '13:15', status: 'investigating', assignee: 'Alice T.' },
  { id: 'INC-087', title: 'SSL certificate expiring in 7 days', severity: 'warning', time: '12:00', status: 'acknowledged', assignee: 'Bob M.' },
  { id: 'INC-086', title: 'Disk usage above 85% on db-primary', severity: 'info', time: '10:45', status: 'monitoring', assignee: 'Carol W.' },
  { id: 'INC-085', title: 'Memory leak in worker-01 detected', severity: 'warning', time: '09:30', status: 'resolved', assignee: 'David K.' }
];

var ALERTS = [
  { name: 'CPU > 80%', condition: 'cpu_percent > 80', targets: 'All Servers', channel: '#ops-alerts', active: true },
  { name: 'Memory > 90%', condition: 'mem_percent > 90', targets: 'All Servers', channel: '#ops-critical', active: true },
  { name: 'Disk > 85%', condition: 'disk_percent > 85', targets: 'DB Servers', channel: '#ops-alerts', active: true },
  { name: 'Response Time > 500ms', condition: 'p99_latency > 500', targets: 'API Servers', channel: '#ops-alerts', active: false },
  { name: 'Error Rate > 1%', condition: 'error_rate > 0.01', targets: 'All Services', channel: '#ops-critical', active: true }
];

var SERVICES_GRAPH = [
  { name: 'Load Balancer', deps: ['Web Frontend'], x: 50, y: 0 },
  { name: 'Web Frontend', deps: ['API Gateway'], x: 50, y: 1 },
  { name: 'API Gateway', deps: ['Auth Service', 'Payment Svc', 'User Service'], x: 50, y: 2 },
  { name: 'Auth Service', deps: ['Database'], x: 15, y: 3 },
  { name: 'Payment Svc', deps: ['Database', 'Cache'], x: 50, y: 3 },
  { name: 'User Service', deps: ['Database', 'Cache'], x: 85, y: 3 },
  { name: 'Database', deps: [], x: 30, y: 4 },
  { name: 'Cache', deps: [], x: 70, y: 4 }
];

function Gauge(props) {
  var color = props.value < 60 ? '#00b894' : props.value < 80 ? '#ffd93d' : '#ff6b6b';
  return React.createElement('div', { style: { textAlign: 'center' } },
    React.createElement('div', { style: { position: 'relative', width: '60px', height: '60px', margin: '0 auto' } },
      React.createElement('svg', { width: 60, height: 60, viewBox: '0 0 60 60' },
        React.createElement('circle', { cx: 30, cy: 30, r: 25, fill: 'none', stroke: 'rgba(255,255,255,0.08)', strokeWidth: 5 }),
        React.createElement('circle', { cx: 30, cy: 30, r: 25, fill: 'none', stroke: color, strokeWidth: 5, strokeDasharray: (props.value / 100 * 157) + ' 157', strokeLinecap: 'round', transform: 'rotate(-90 30 30)' })
      ),
      React.createElement('div', { style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '14px', fontWeight: 'bold', color: color } }, props.value + '%')
    ),
    React.createElement('div', { style: { fontSize: '10px', color: '#888', marginTop: '4px' } }, props.label)
  );
}

function App() {
  var _tab = useState('servers'), tab = _tab[0], setTab = _tab[1];

  var severityColors = { critical: '#ff6b6b', warning: '#ffd93d', info: '#4a9eff' };
  var statusColors = { healthy: '#00b894', warning: '#ffd93d', critical: '#ff6b6b' };
  var deployColors = { success: '#00b894', failed: '#ff6b6b', rollback: '#ffd93d' };

  var overviewStats = React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' } },
    [
      ['Servers', SERVERS.length, '#4a9eff'],
      ['Healthy', SERVERS.filter(function(s) { return s.status === 'healthy'; }).length, '#00b894'],
      ['Warnings', SERVERS.filter(function(s) { return s.status === 'warning'; }).length, '#ffd93d'],
      ['Critical', SERVERS.filter(function(s) { return s.status === 'critical'; }).length, '#ff6b6b'],
      ['Deploys Today', DEPLOYMENTS.length, '#a29bfe'],
      ['Open Incidents', INCIDENTS.filter(function(i) { return i.status !== 'resolved'; }).length, '#fd79a8']
    ].map(function(s) {
      return React.createElement('div', { key: s[0], style: Object.assign({}, cardStyle, { textAlign: 'center' }) },
        React.createElement('div', { style: { fontSize: '11px', color: '#888' } }, s[0]),
        React.createElement('div', { style: { fontSize: '24px', fontWeight: 'bold', color: s[2], marginTop: '4px' } }, s[1])
      );
    })
  );

  var tabBtn = function(name, label) {
    return React.createElement('button', { key: name, onClick: function() { setTab(name); }, style: { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', background: tab === name ? '#4a9eff' : 'rgba(255,255,255,0.06)', color: tab === name ? '#fff' : '#aaa' } }, label);
  };

  var content;
  if (tab === 'servers') {
    content = React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' } },
      SERVERS.map(function(s) {
        return React.createElement('div', { key: s.name, style: Object.assign({}, cardStyle, { borderLeft: '3px solid ' + statusColors[s.status] }) },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' } },
            React.createElement('div', null,
              React.createElement('div', { style: { fontWeight: 'bold', fontSize: '15px' } }, s.name),
              React.createElement('div', { style: { fontSize: '11px', color: '#888' } }, s.ip + ' \u2022 Up: ' + s.uptime)
            ),
            React.createElement('span', { style: { padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: statusColors[s.status] + '22', color: statusColors[s.status], textTransform: 'capitalize' } }, s.status)
          ),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-around' } },
            React.createElement(Gauge, { value: s.cpu, label: 'CPU' }),
            React.createElement(Gauge, { value: s.memory, label: 'Memory' }),
            React.createElement(Gauge, { value: s.disk, label: 'Disk' })
          )
        );
      })
    );
  } else if (tab === 'deployments') {
    content = React.createElement('div', { style: cardStyle },
      React.createElement('h3', { style: { margin: '0 0 16px 0', fontSize: '16px' } }, 'Deployment Timeline'),
      DEPLOYMENTS.map(function(d, i) {
        return React.createElement('div', { key: d.id, style: { display: 'flex', gap: '16px', marginBottom: '0', position: 'relative', paddingLeft: '24px', paddingBottom: '20px' } },
          React.createElement('div', { style: { position: 'absolute', left: '6px', top: '6px', width: '12px', height: '12px', borderRadius: '50%', background: deployColors[d.status], zIndex: 1 } }),
          i < DEPLOYMENTS.length - 1 ? React.createElement('div', { style: { position: 'absolute', left: '11px', top: '18px', width: '2px', bottom: '0', background: 'rgba(255,255,255,0.08)' } }) : null,
          React.createElement('div', { style: { flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '12px' } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
              React.createElement('span', { style: { fontWeight: 'bold', fontSize: '14px' } }, d.service),
              React.createElement('span', { style: { padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold', background: deployColors[d.status] + '22', color: deployColors[d.status], textTransform: 'capitalize' } }, d.status)
            ),
            React.createElement('div', { style: { fontSize: '12px', color: '#888' } },
              d.id + ' \u2022 ' + d.version + ' \u2022 ' + d.time + ' \u2022 by ' + d.by
            )
          )
        );
      })
    );
  } else if (tab === 'incidents') {
    content = React.createElement('div', { style: cardStyle },
      React.createElement('h3', { style: { margin: '0 0 16px 0', fontSize: '16px' } }, 'Incident Log'),
      INCIDENTS.map(function(inc) {
        return React.createElement('div', { key: inc.id, style: { padding: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', marginBottom: '8px', borderLeft: '3px solid ' + severityColors[inc.severity] } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
              React.createElement('span', { style: { padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', background: severityColors[inc.severity] + '22', color: severityColors[inc.severity], textTransform: 'uppercase' } }, inc.severity),
              React.createElement('span', { style: { fontWeight: 'bold', fontSize: '14px' } }, inc.title)
            ),
            React.createElement('span', { style: { fontSize: '12px', padding: '2px 8px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', color: '#aaa', textTransform: 'capitalize' } }, inc.status)
          ),
          React.createElement('div', { style: { fontSize: '12px', color: '#888', marginTop: '8px' } }, inc.id + ' \u2022 ' + inc.time + ' \u2022 Assigned: ' + inc.assignee)
        );
      })
    );
  } else if (tab === 'alerts') {
    content = React.createElement('div', { style: cardStyle },
      React.createElement('h3', { style: { margin: '0 0 16px 0', fontSize: '16px' } }, 'Alert Rules'),
      ALERTS.map(function(a, i) {
        return React.createElement('div', { key: i, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', marginBottom: '8px' } },
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontWeight: 'bold', fontSize: '14px' } }, a.name),
            React.createElement('div', { style: { fontSize: '12px', fontFamily: 'monospace', color: '#8be9fd', marginTop: '2px' } }, a.condition),
            React.createElement('div', { style: { fontSize: '11px', color: '#888', marginTop: '2px' } }, 'Targets: ' + a.targets + ' \u2022 Channel: ' + a.channel)
          ),
          React.createElement('div', { style: { width: '44px', height: '24px', borderRadius: '12px', background: a.active ? '#00b894' : '#444', cursor: 'pointer', position: 'relative', transition: 'background 0.3s' } },
            React.createElement('div', { style: { width: '20px', height: '20px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: a.active ? '22px' : '2px', transition: 'left 0.3s' } })
          )
        );
      })
    );
  } else if (tab === 'services') {
    content = React.createElement('div', { style: cardStyle },
      React.createElement('h3', { style: { margin: '0 0 16px 0', fontSize: '16px' } }, 'Service Dependency Graph'),
      React.createElement('div', { style: { position: 'relative', height: '400px' } },
        SERVICES_GRAPH.map(function(svc) {
          var top = svc.y * 75 + 10;
          var left = svc.x;
          return React.createElement('div', { key: svc.name, style: { position: 'absolute', top: top + 'px', left: left + '%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #1a2a4a, #2a1a4e)', borderRadius: '10px', padding: '10px 16px', border: '1px solid rgba(74,158,255,0.3)', textAlign: 'center', zIndex: 2, minWidth: '100px' } },
            React.createElement('div', { style: { fontSize: '13px', fontWeight: 'bold', color: '#4a9eff' } }, svc.name),
            svc.deps.length > 0 ? React.createElement('div', { style: { fontSize: '10px', color: '#666', marginTop: '2px' } }, '\u2193 ' + svc.deps.join(', ')) : React.createElement('div', { style: { fontSize: '10px', color: '#00b894', marginTop: '2px' } }, '\u2022 No dependencies')
          );
        }),
        // Connection lines (simplified vertical)
        [1, 2, 3, 4].map(function(level) {
          return React.createElement('div', { key: 'line-' + level, style: { position: 'absolute', top: (level * 75 - 10) + 'px', left: '50%', width: '2px', height: '20px', background: 'rgba(74,158,255,0.2)', transform: 'translateX(-50%)' } });
        })
      )
    );
  }

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '28px', fontWeight: 'bold', marginBottom: '6px', background: 'linear-gradient(90deg, #4a9eff, #a29bfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'DevOps Dashboard'),
    React.createElement('p', { style: { color: '#888', marginBottom: '20px', fontSize: '14px' } }, 'Infrastructure monitoring and deployment management'),
    overviewStats,
    React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' } },
      tabBtn('servers', 'Servers'),
      tabBtn('deployments', 'Deployments'),
      tabBtn('incidents', 'Incidents'),
      tabBtn('alerts', 'Alert Rules'),
      tabBtn('services', 'Service Map')
    ),
    content
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
