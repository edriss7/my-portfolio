const { useState, useMemo } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, sans-serif", padding: '0' };
var cardStyle = { background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' };

var ORDERS = [
  { id: 'ORD-001', customer: 'Acme Corp', amount: 12500, date: '2026-02-17', status: 'delivered', items: 5 },
  { id: 'ORD-002', customer: 'TechStart Inc', amount: 8200, date: '2026-02-16', status: 'shipped', items: 3 },
  { id: 'ORD-003', customer: 'GlobalTrade Ltd', amount: 34000, date: '2026-02-15', status: 'processing', items: 12 },
  { id: 'ORD-004', customer: 'DataFlow Co', amount: 5600, date: '2026-02-14', status: 'pending', items: 2 },
  { id: 'ORD-005', customer: 'BrightPath LLC', amount: 19800, date: '2026-02-13', status: 'delivered', items: 8 },
  { id: 'ORD-006', customer: 'NexGen Systems', amount: 7400, date: '2026-02-12', status: 'cancelled', items: 4 }
];

var INVENTORY = [
  { sku: 'WDG-101', name: 'Premium Widget', stock: 245, reorder: 50, price: 29.99, category: 'Widgets' },
  { sku: 'GDG-202', name: 'Gadget Pro Max', stock: 12, reorder: 30, price: 149.99, category: 'Gadgets' },
  { sku: 'WDG-103', name: 'Widget Lite', stock: 890, reorder: 100, price: 9.99, category: 'Widgets' },
  { sku: 'SRV-301', name: 'Server Module', stock: 5, reorder: 20, price: 499.99, category: 'Hardware' },
  { sku: 'CBL-401', name: 'Premium Cable', stock: 1200, reorder: 200, price: 14.99, category: 'Accessories' },
  { sku: 'GDG-205', name: 'Gadget Mini', stock: 38, reorder: 25, price: 79.99, category: 'Gadgets' }
];

var EMPLOYEES = [
  { id: 1, name: 'Alice Thompson', role: 'Engineering Manager', dept: 'Engineering', email: 'alice@company.com', status: 'active' },
  { id: 2, name: 'Bob Martinez', role: 'Sales Director', dept: 'Sales', email: 'bob@company.com', status: 'active' },
  { id: 3, name: 'Carol Williams', role: 'HR Coordinator', dept: 'HR', email: 'carol@company.com', status: 'active' },
  { id: 4, name: 'David Kim', role: 'Financial Analyst', dept: 'Finance', email: 'david@company.com', status: 'active' },
  { id: 5, name: 'Elena Rossi', role: 'Product Designer', dept: 'Engineering', email: 'elena@company.com', status: 'on-leave' },
  { id: 6, name: 'Frank Okafor', role: 'Account Executive', dept: 'Sales', email: 'frank@company.com', status: 'active' }
];

var REVENUE = [
  { month: 'Sep', amount: 82000 }, { month: 'Oct', amount: 95000 }, { month: 'Nov', amount: 88000 },
  { month: 'Dec', amount: 110000 }, { month: 'Jan', amount: 98000 }, { month: 'Feb', amount: 105000 }
];

function App() {
  var _m = useState('sales'), module = _m[0], setModule = _m[1];
  var _c = useState(false), collapsed = _c[0], setCollapsed = _c[1];

  var statusColors = { delivered: '#00b894', shipped: '#4a9eff', processing: '#ffd93d', pending: '#888', cancelled: '#ff6b6b' };
  var maxRev = Math.max.apply(null, REVENUE.map(function(r) { return r.amount; }));

  var modules = [
    { key: 'sales', label: 'Sales', icon: '\uD83D\uDCCA' },
    { key: 'inventory', label: 'Inventory', icon: '\uD83D\uDCE6' },
    { key: 'hr', label: 'HR', icon: '\uD83D\uDC65' },
    { key: 'finance', label: 'Finance', icon: '\uD83D\uDCB0' }
  ];

  var sidebar = React.createElement('div', { style: { width: collapsed ? '60px' : '220px', background: 'rgba(0,0,0,0.3)', borderRight: '1px solid rgba(255,255,255,0.08)', padding: '16px 0', display: 'flex', flexDirection: 'column', transition: 'width 0.3s', flexShrink: 0, overflow: 'hidden' } },
    React.createElement('div', { style: { padding: '0 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
      !collapsed ? React.createElement('span', { style: { fontWeight: 'bold', fontSize: '16px', color: '#e74c3c', whiteSpace: 'nowrap' } }, '\u2B22 ERP System') : null,
      React.createElement('button', { onClick: function() { setCollapsed(!collapsed); }, style: { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '18px', padding: '4px' } }, collapsed ? '\u2192' : '\u2190')
    ),
    modules.map(function(m) {
      return React.createElement('div', {
        key: m.key, onClick: function() { setModule(m.key); },
        style: { padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', background: module === m.key ? 'rgba(231,76,60,0.15)' : 'transparent', borderLeft: module === m.key ? '3px solid #e74c3c' : '3px solid transparent', color: module === m.key ? '#e74c3c' : '#aaa', transition: 'all 0.2s', whiteSpace: 'nowrap' }
      }, React.createElement('span', { style: { fontSize: '18px' } }, m.icon), !collapsed ? m.label : null);
    })
  );

  var content;
  if (module === 'sales') {
    content = React.createElement('div', null,
      React.createElement('h2', { style: { fontSize: '22px', marginBottom: '20px' } }, '\uD83D\uDCCA Sales Orders'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' } },
        [['Total Orders', ORDERS.length], ['Revenue', '$' + ORDERS.reduce(function(a, o) { return a + (o.status !== 'cancelled' ? o.amount : 0); }, 0).toLocaleString()], ['Delivered', ORDERS.filter(function(o) { return o.status === 'delivered'; }).length], ['Pending', ORDERS.filter(function(o) { return o.status === 'pending' || o.status === 'processing'; }).length]].map(function(s) {
          return React.createElement('div', { key: s[0], style: Object.assign({}, cardStyle, { textAlign: 'center' }) },
            React.createElement('div', { style: { fontSize: '11px', color: '#888' } }, s[0]),
            React.createElement('div', { style: { fontSize: '20px', fontWeight: 'bold', color: '#e74c3c', marginTop: '4px' } }, s[1])
          );
        })
      ),
      React.createElement('div', { style: Object.assign({}, cardStyle, { overflowX: 'auto' }) },
        React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' } },
          React.createElement('thead', null,
            React.createElement('tr', { style: { borderBottom: '1px solid rgba(255,255,255,0.1)' } },
              ['Order ID', 'Customer', 'Items', 'Amount', 'Date', 'Status'].map(function(h) {
                return React.createElement('th', { key: h, style: { padding: '10px', textAlign: 'left', color: '#888' } }, h);
              })
            )
          ),
          React.createElement('tbody', null,
            ORDERS.map(function(o) {
              return React.createElement('tr', { key: o.id, style: { borderBottom: '1px solid rgba(255,255,255,0.05)' } },
                React.createElement('td', { style: { padding: '10px', color: '#e74c3c', fontWeight: 'bold' } }, o.id),
                React.createElement('td', { style: { padding: '10px' } }, o.customer),
                React.createElement('td', { style: { padding: '10px' } }, o.items),
                React.createElement('td', { style: { padding: '10px', fontWeight: 'bold' } }, '$' + o.amount.toLocaleString()),
                React.createElement('td', { style: { padding: '10px', color: '#888' } }, o.date),
                React.createElement('td', { style: { padding: '10px' } },
                  React.createElement('span', { style: { background: (statusColors[o.status] || '#888') + '22', color: statusColors[o.status] || '#888', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', textTransform: 'capitalize' } }, o.status)
                )
              );
            })
          )
        )
      )
    );
  } else if (module === 'inventory') {
    content = React.createElement('div', null,
      React.createElement('h2', { style: { fontSize: '22px', marginBottom: '20px' } }, '\uD83D\uDCE6 Inventory Management'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' } },
        INVENTORY.map(function(item) {
          var lowStock = item.stock < item.reorder;
          return React.createElement('div', { key: item.sku, style: Object.assign({}, cardStyle, { borderLeft: '3px solid ' + (lowStock ? '#ff6b6b' : '#00b894') }) },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' } },
              React.createElement('div', null,
                React.createElement('div', { style: { fontWeight: 'bold', fontSize: '15px' } }, item.name),
                React.createElement('div', { style: { fontSize: '12px', color: '#888' } }, item.sku + ' \u2022 ' + item.category)
              ),
              React.createElement('span', { style: { fontSize: '16px', fontWeight: 'bold', color: '#e74c3c' } }, '$' + item.price)
            ),
            React.createElement('div', { style: { marginTop: '10px' } },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' } },
                React.createElement('span', { style: { color: '#aaa' } }, 'Stock: ' + item.stock),
                React.createElement('span', { style: { color: '#888' } }, 'Reorder at: ' + item.reorder)
              ),
              React.createElement('div', { style: { height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' } },
                React.createElement('div', { style: { height: '100%', width: Math.min((item.stock / (item.reorder * 5)) * 100, 100) + '%', background: lowStock ? '#ff6b6b' : '#00b894', borderRadius: '3px', transition: 'width 0.5s' } })
              ),
              lowStock ? React.createElement('div', { style: { marginTop: '8px', fontSize: '11px', color: '#ff6b6b', background: 'rgba(255,107,107,0.1)', padding: '4px 8px', borderRadius: '6px' } }, '\u26A0 Low stock - reorder recommended') : null
            )
          );
        })
      )
    );
  } else if (module === 'hr') {
    content = React.createElement('div', null,
      React.createElement('h2', { style: { fontSize: '22px', marginBottom: '20px' } }, '\uD83D\uDC65 Employee Directory'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' } },
        EMPLOYEES.map(function(emp) {
          var initials = emp.name.split(' ').map(function(n) { return n[0]; }).join('');
          var colors = ['#e74c3c', '#6c5ce7', '#00b894', '#4a9eff', '#ffd93d', '#ff6b6b'];
          return React.createElement('div', { key: emp.id, style: Object.assign({}, cardStyle, { display: 'flex', gap: '14px', alignItems: 'center' }) },
            React.createElement('div', { style: { width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, ' + colors[emp.id % colors.length] + ', ' + colors[(emp.id + 2) % colors.length] + ')', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 } }, initials),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontWeight: 'bold', fontSize: '15px' } }, emp.name),
              React.createElement('div', { style: { fontSize: '12px', color: '#e74c3c' } }, emp.role),
              React.createElement('div', { style: { fontSize: '11px', color: '#888', marginTop: '2px' } }, emp.dept + ' \u2022 ' + emp.email),
              React.createElement('span', { style: { display: 'inline-block', marginTop: '4px', fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: emp.status === 'active' ? '#00b89422' : '#ffd93d22', color: emp.status === 'active' ? '#00b894' : '#ffd93d', textTransform: 'capitalize' } }, emp.status)
            )
          );
        })
      )
    );
  } else if (module === 'finance') {
    var totalRev = REVENUE.reduce(function(a, r) { return a + r.amount; }, 0);
    content = React.createElement('div', null,
      React.createElement('h2', { style: { fontSize: '22px', marginBottom: '20px' } }, '\uD83D\uDCB0 Financial Overview'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' } },
        [['Total Revenue', '$' + totalRev.toLocaleString(), '#00b894'], ['Expenses', '$' + Math.round(totalRev * 0.65).toLocaleString(), '#ff6b6b'], ['Net Profit', '$' + Math.round(totalRev * 0.35).toLocaleString(), '#4a9eff'], ['Growth', '+12.4%', '#ffd93d']].map(function(s) {
          return React.createElement('div', { key: s[0], style: Object.assign({}, cardStyle, { textAlign: 'center' }) },
            React.createElement('div', { style: { fontSize: '12px', color: '#888' } }, s[0]),
            React.createElement('div', { style: { fontSize: '24px', fontWeight: 'bold', color: s[2], marginTop: '4px' } }, s[1])
          );
        })
      ),
      React.createElement('div', { style: cardStyle },
        React.createElement('h3', { style: { margin: '0 0 16px 0', fontSize: '16px' } }, 'Monthly Revenue'),
        React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px' } },
          REVENUE.map(function(r) {
            var pct = (r.amount / maxRev) * 100;
            return React.createElement('div', { key: r.month, style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' } },
              React.createElement('div', { style: { fontSize: '11px', color: '#aaa', marginBottom: '4px' } }, '$' + (r.amount / 1000) + 'k'),
              React.createElement('div', { style: { width: '100%', maxWidth: '60px', height: pct + '%', borderRadius: '8px 8px 0 0', background: 'linear-gradient(to top, #e74c3c, #ff6b6b)', transition: 'height 0.5s' } }),
              React.createElement('div', { style: { fontSize: '12px', color: '#888', marginTop: '8px' } }, r.month)
            );
          })
        )
      ),
      React.createElement('div', { style: Object.assign({}, cardStyle, { marginTop: '20px' }) },
        React.createElement('h3', { style: { margin: '0 0 12px 0', fontSize: '16px' } }, 'Balance Sheet Summary'),
        [['Assets', '$2,450,000'], ['Liabilities', '$890,000'], ['Equity', '$1,560,000'], ['Cash on Hand', '$420,000'], ['Accounts Receivable', '$185,000'], ['Accounts Payable', '$95,000']].map(function(r) {
          return React.createElement('div', { key: r[0], style: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' } },
            React.createElement('span', { style: { color: '#aaa' } }, r[0]),
            React.createElement('span', { style: { fontWeight: 'bold', fontFamily: 'monospace' } }, r[1])
          );
        })
      )
    );
  }

  return React.createElement('div', { style: Object.assign({}, containerStyle, { display: 'flex', minHeight: '100vh' }) },
    sidebar,
    React.createElement('div', { style: { flex: 1, padding: '24px', overflowY: 'auto' } },
      React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
      React.createElement('h1', { style: { fontSize: '28px', fontWeight: 'bold', marginBottom: '6px', background: 'linear-gradient(90deg, #e74c3c, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Enterprise Resource Planning'),
      React.createElement('p', { style: { color: '#888', marginBottom: '24px', fontSize: '14px' } }, 'Unified business management platform'),
      content
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
