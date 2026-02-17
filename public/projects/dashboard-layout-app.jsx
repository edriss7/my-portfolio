const { useState } = React;

var navItems = [
  { icon: '\u2302', label: 'Dashboard', id: 'dashboard' },
  { icon: '\u2630', label: 'Analytics', id: 'analytics' },
  { icon: '\u2709', label: 'Messages', id: 'messages' },
  { icon: '\u2699', label: 'Settings', id: 'settings' }
];

var statsData = [
  { label: 'Total Users', value: '12,847', change: '+12.5%', positive: true, icon: '\u263A' },
  { label: 'Revenue', value: '$48,295', change: '+8.2%', positive: true, icon: '$' },
  { label: 'Orders', value: '1,584', change: '-2.4%', positive: false, icon: '\u2606' },
  { label: 'Growth', value: '23.6%', change: '+4.1%', positive: true, icon: '\u2191' }
];

var chartData = [
  { label: 'Mon', value: 65 },
  { label: 'Tue', value: 85 },
  { label: 'Wed', value: 45 },
  { label: 'Thu', value: 90 },
  { label: 'Fri', value: 70 },
  { label: 'Sat', value: 55 },
  { label: 'Sun', value: 40 }
];

var activities = [
  { user: 'Alice Chen', action: 'placed a new order', time: '2 min ago', color: '#50fa7b' },
  { user: 'Bob Smith', action: 'updated their profile', time: '15 min ago', color: '#8be9fd' },
  { user: 'Carol Jones', action: 'submitted a support ticket', time: '1 hr ago', color: '#ffb86c' },
  { user: 'Dave Wilson', action: 'completed onboarding', time: '2 hrs ago', color: '#bd93f9' },
  { user: 'Eve Davis', action: 'cancelled subscription', time: '3 hrs ago', color: '#ff5555' },
  { user: 'Frank Lee', action: 'upgraded to Pro plan', time: '5 hrs ago', color: '#50fa7b' }
];

function App() {
  var _s = useState('dashboard');
  var activeNav = _s[0]; var setActiveNav = _s[1];
  var _s2 = useState(false);
  var sidebarOpen = _s2[0]; var setSidebarOpen = _s2[1];

  var containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: 'flex'
  };

  var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px' };

  var sidebarStyle = {
    width: '220px',
    background: 'rgba(0,0,0,0.3)',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    padding: '20px 0',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column'
  };

  var mainStyle = {
    flex: 1,
    padding: '20px 24px',
    overflowY: 'auto',
    minHeight: '100vh'
  };

  var headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  };

  var cardStyle = {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.08)'
  };

  var maxBar = Math.max.apply(null, chartData.map(function(d) { return d.value; }));

  return React.createElement('div', { style: containerStyle },
    React.createElement('div', { style: sidebarStyle },
      React.createElement('div', { style: { padding: '0 20px', marginBottom: '30px' } },
        React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
        React.createElement('h2', { style: { fontSize: '18px', color: '#bd93f9', marginTop: '16px' } }, 'AdminPanel')
      ),
      React.createElement('nav', null,
        navItems.map(function(item) {
          var isActive = activeNav === item.id;
          return React.createElement('div', {
            key: item.id,
            onClick: function() { setActiveNav(item.id); },
            style: {
              padding: '12px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: isActive ? 'rgba(189,147,249,0.15)' : 'transparent',
              borderLeft: isActive ? '3px solid #bd93f9' : '3px solid transparent',
              color: isActive ? '#bd93f9' : '#888',
              fontSize: '14px',
              transition: 'all 0.2s'
            }
          },
            React.createElement('span', { style: { fontSize: '16px' } }, item.icon),
            item.label
          );
        })
      ),
      React.createElement('div', { style: { marginTop: 'auto', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
          React.createElement('div', { style: { width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #bd93f9, #ff79c6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' } }, 'A'),
          React.createElement('div', null,
            React.createElement('div', { style: { fontSize: '13px', fontWeight: 'bold' } }, 'Admin'),
            React.createElement('div', { style: { fontSize: '11px', color: '#888' } }, 'admin@demo.com')
          )
        )
      )
    ),
    React.createElement('div', { style: mainStyle },
      React.createElement('div', { style: headerStyle },
        React.createElement('div', null,
          React.createElement('h1', { style: { fontSize: '24px', color: '#fff', margin: 0 } }, 'Dashboard'),
          React.createElement('p', { style: { color: '#888', fontSize: '13px', margin: '4px 0 0' } }, 'Welcome back, Admin')
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
          React.createElement('span', { style: { position: 'relative', cursor: 'pointer', fontSize: '18px' } }, '\u2709',
            React.createElement('span', { style: { position: 'absolute', top: '-6px', right: '-8px', width: '16px', height: '16px', background: '#ff5555', borderRadius: '50%', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, '3')
          ),
          React.createElement('div', { style: { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #bd93f9, #ff79c6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' } }, 'A')
        )
      ),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' } },
        statsData.map(function(stat) {
          return React.createElement('div', { key: stat.label, style: cardStyle },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
              React.createElement('span', { style: { fontSize: '13px', color: '#888' } }, stat.label),
              React.createElement('span', { style: { fontSize: '20px' } }, stat.icon)
            ),
            React.createElement('div', { style: { fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' } }, stat.value),
            React.createElement('span', { style: { fontSize: '12px', color: stat.positive ? '#50fa7b' : '#ff5555' } }, stat.change + ' from last month')
          );
        })
      ),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' } },
        React.createElement('div', { style: cardStyle },
          React.createElement('h3', { style: { marginBottom: '20px', color: '#fff', fontSize: '16px' } }, 'Weekly Revenue'),
          React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px' } },
            chartData.map(function(d) {
              var pct = (d.value / maxBar) * 100;
              return React.createElement('div', { key: d.label, style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' } },
                React.createElement('div', { style: { fontSize: '11px', color: '#aaa', marginBottom: '4px' } }, d.value),
                React.createElement('div', { style: {
                  width: '100%',
                  height: pct + '%',
                  background: 'linear-gradient(180deg, #bd93f9, #6c63ff)',
                  borderRadius: '6px 6px 0 0',
                  minHeight: '4px',
                  transition: 'height 0.3s'
                } }),
                React.createElement('div', { style: { fontSize: '11px', color: '#888', marginTop: '6px' } }, d.label)
              );
            })
          )
        ),
        React.createElement('div', { style: cardStyle },
          React.createElement('h3', { style: { marginBottom: '16px', color: '#fff', fontSize: '16px' } }, 'Recent Activity'),
          activities.map(function(a, i) {
            return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0', borderBottom: i < activities.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' } },
              React.createElement('div', { style: { width: '8px', height: '8px', borderRadius: '50%', background: a.color, marginTop: '6px', flexShrink: 0 } }),
              React.createElement('div', null,
                React.createElement('div', { style: { fontSize: '13px' } },
                  React.createElement('span', { style: { fontWeight: 'bold', color: '#fff' } }, a.user),
                  ' ' + a.action
                ),
                React.createElement('div', { style: { fontSize: '11px', color: '#666', marginTop: '2px' } }, a.time)
              )
            );
          })
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
