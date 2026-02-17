const { useState, useMemo, useCallback } = React;

var employees = [
  { id: 1, name: 'Alice Johnson', role: 'Engineer', department: 'Engineering', salary: 95000, status: 'Active', joined: '2021-03-15' },
  { id: 2, name: 'Bob Smith', role: 'Designer', department: 'Design', salary: 82000, status: 'Active', joined: '2020-07-22' },
  { id: 3, name: 'Carol White', role: 'Manager', department: 'Engineering', salary: 115000, status: 'Active', joined: '2019-01-10' },
  { id: 4, name: 'Dave Brown', role: 'Analyst', department: 'Finance', salary: 78000, status: 'On Leave', joined: '2022-05-18' },
  { id: 5, name: 'Eve Davis', role: 'Engineer', department: 'Engineering', salary: 98000, status: 'Active', joined: '2021-09-01' },
  { id: 6, name: 'Frank Miller', role: 'Designer', department: 'Design', salary: 85000, status: 'Active', joined: '2020-11-30' },
  { id: 7, name: 'Grace Lee', role: 'HR Lead', department: 'HR', salary: 92000, status: 'Active', joined: '2019-06-14' },
  { id: 8, name: 'Hank Wilson', role: 'Engineer', department: 'Engineering', salary: 102000, status: 'Inactive', joined: '2018-02-28' },
  { id: 9, name: 'Ivy Chen', role: 'Analyst', department: 'Finance', salary: 80000, status: 'Active', joined: '2022-01-05' },
  { id: 10, name: 'Jack Taylor', role: 'Manager', department: 'Sales', salary: 108000, status: 'Active', joined: '2020-04-12' },
  { id: 11, name: 'Kate Adams', role: 'Engineer', department: 'Engineering', salary: 96000, status: 'Active', joined: '2021-07-20' },
  { id: 12, name: 'Leo Martin', role: 'Designer', department: 'Design', salary: 79000, status: 'Active', joined: '2022-08-15' },
  { id: 13, name: 'Mia Garcia', role: 'Analyst', department: 'Finance', salary: 76000, status: 'On Leave', joined: '2021-12-01' },
  { id: 14, name: 'Nick Thompson', role: 'Engineer', department: 'Engineering', salary: 99000, status: 'Active', joined: '2020-09-10' },
  { id: 15, name: 'Olga Petrov', role: 'Manager', department: 'HR', salary: 112000, status: 'Active', joined: '2019-03-25' },
  { id: 16, name: 'Paul Roberts', role: 'Sales Rep', department: 'Sales', salary: 72000, status: 'Active', joined: '2022-02-14' },
  { id: 17, name: 'Quinn Nguyen', role: 'Engineer', department: 'Engineering', salary: 94000, status: 'Active', joined: '2021-05-07' },
  { id: 18, name: 'Rosa Hernandez', role: 'Designer', department: 'Design', salary: 88000, status: 'Inactive', joined: '2020-01-19' },
  { id: 19, name: 'Sam Clark', role: 'Analyst', department: 'Finance', salary: 81000, status: 'Active', joined: '2021-10-30' },
  { id: 20, name: 'Tina Walker', role: 'Sales Rep', department: 'Sales', salary: 74000, status: 'Active', joined: '2022-06-22' },
  { id: 21, name: 'Uma Patel', role: 'Engineer', department: 'Engineering', salary: 101000, status: 'Active', joined: '2019-11-05' },
  { id: 22, name: 'Victor Kim', role: 'Manager', department: 'Engineering', salary: 118000, status: 'Active', joined: '2018-08-17' },
  { id: 23, name: 'Wendy Scott', role: 'HR Lead', department: 'HR', salary: 89000, status: 'On Leave', joined: '2020-03-28' }
];

var columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'department', label: 'Department' },
  { key: 'salary', label: 'Salary' },
  { key: 'status', label: 'Status' },
  { key: 'joined', label: 'Joined' }
];

var PER_PAGE = 5;

function App() {
  var _s = useState('');
  var search = _s[0]; var setSearch = _s[1];
  var _s2 = useState({ key: 'name', dir: 'asc' });
  var sort = _s2[0]; var setSort = _s2[1];
  var _s3 = useState(0);
  var page = _s3[0]; var setPage = _s3[1];
  var _s4 = useState({});
  var selected = _s4[0]; var setSelected = _s4[1];

  var toggleSort = function(key) {
    setSort(function(prev) {
      if (prev.key === key) return { key: key, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
      return { key: key, dir: 'asc' };
    });
    setPage(0);
  };

  var filtered = useMemo(function() {
    var q = search.toLowerCase();
    var f = employees.filter(function(e) {
      return e.name.toLowerCase().indexOf(q) >= 0 ||
             e.role.toLowerCase().indexOf(q) >= 0 ||
             e.department.toLowerCase().indexOf(q) >= 0;
    });
    f.sort(function(a, b) {
      var va = a[sort.key];
      var vb = b[sort.key];
      if (typeof va === 'string') {
        var cmp = va.localeCompare(vb);
        return sort.dir === 'asc' ? cmp : -cmp;
      }
      return sort.dir === 'asc' ? va - vb : vb - va;
    });
    return f;
  }, [search, sort]);

  var totalPages = Math.ceil(filtered.length / PER_PAGE);
  var pageData = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  var selectedCount = Object.keys(selected).filter(function(k) { return selected[k]; }).length;

  var toggleSelect = function(id) {
    setSelected(function(prev) { var n = Object.assign({}, prev); n[id] = !n[id]; return n; });
  };

  var toggleAll = function() {
    var allSelected = pageData.every(function(e) { return selected[e.id]; });
    var n = Object.assign({}, selected);
    pageData.forEach(function(e) { n[e.id] = !allSelected; });
    setSelected(n);
  };

  var statusColor = function(s) {
    if (s === 'Active') return '#50fa7b';
    if (s === 'On Leave') return '#f1fa8c';
    return '#ff5555';
  };

  var containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px'
  };
  var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };

  var tableWrap = {
    maxWidth: '960px', margin: '0 auto',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    overflow: 'hidden'
  };

  var thStyle = function(key) {
    return {
      padding: '12px 14px', textAlign: 'left', fontSize: '12px',
      color: sort.key === key ? '#bd93f9' : '#888',
      textTransform: 'uppercase', letterSpacing: '0.5px',
      cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(0,0,0,0.2)'
    };
  };

  var tdStyle = {
    padding: '12px 14px', fontSize: '13px',
    borderBottom: '1px solid rgba(255,255,255,0.04)'
  };

  var sortIcon = function(key) {
    if (sort.key !== key) return ' \u2195';
    return sort.dir === 'asc' ? ' \u2191' : ' \u2193';
  };

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { textAlign: 'center', fontSize: '28px', color: '#fff', marginBottom: '24px' } }, 'Data Table'),
    React.createElement('div', { style: tableWrap },
      React.createElement('div', { style: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
          React.createElement('input', {
            placeholder: 'Search employees...',
            value: search,
            onChange: function(e) { setSearch(e.target.value); setPage(0); },
            style: {
              padding: '8px 14px', background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
              color: '#e0e0e0', fontSize: '13px', outline: 'none', width: '220px'
            }
          }),
          React.createElement('span', { style: { fontSize: '12px', color: '#666' } }, filtered.length + ' results')
        ),
        selectedCount > 0 && React.createElement('div', { style: {
          padding: '6px 14px', background: 'rgba(189,147,249,0.15)',
          borderRadius: '8px', fontSize: '13px', color: '#bd93f9'
        } }, selectedCount + ' selected')
      ),
      React.createElement('div', { style: { overflowX: 'auto' } },
        React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse' } },
          React.createElement('thead', null,
            React.createElement('tr', null,
              React.createElement('th', { style: Object.assign({}, thStyle(''), { cursor: 'pointer', width: '40px' }), onClick: toggleAll },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: pageData.length > 0 && pageData.every(function(e) { return selected[e.id]; }),
                  onChange: toggleAll,
                  style: { accentColor: '#bd93f9', cursor: 'pointer' }
                })
              ),
              columns.map(function(col) {
                return React.createElement('th', { key: col.key, style: thStyle(col.key), onClick: function() { toggleSort(col.key); } },
                  col.label + sortIcon(col.key)
                );
              })
            )
          ),
          React.createElement('tbody', null,
            pageData.map(function(emp) {
              var isSelected = !!selected[emp.id];
              return React.createElement('tr', {
                key: emp.id,
                style: { background: isSelected ? 'rgba(189,147,249,0.06)' : 'transparent', transition: 'background 0.15s' }
              },
                React.createElement('td', { style: tdStyle },
                  React.createElement('input', {
                    type: 'checkbox', checked: isSelected,
                    onChange: function() { toggleSelect(emp.id); },
                    style: { accentColor: '#bd93f9', cursor: 'pointer' }
                  })
                ),
                React.createElement('td', { style: Object.assign({}, tdStyle, { fontWeight: 'bold', color: '#fff' }) }, emp.name),
                React.createElement('td', { style: tdStyle }, emp.role),
                React.createElement('td', { style: tdStyle }, emp.department),
                React.createElement('td', { style: Object.assign({}, tdStyle, { color: '#50fa7b' }) }, '$' + emp.salary.toLocaleString()),
                React.createElement('td', { style: tdStyle },
                  React.createElement('span', { style: {
                    padding: '3px 10px', borderRadius: '12px', fontSize: '11px',
                    background: statusColor(emp.status) + '20', color: statusColor(emp.status)
                  } }, emp.status)
                ),
                React.createElement('td', { style: Object.assign({}, tdStyle, { color: '#888' }) }, emp.joined)
              );
            }),
            pageData.length === 0 && React.createElement('tr', null,
              React.createElement('td', { colSpan: 7, style: { padding: '40px', textAlign: 'center', color: '#666' } }, 'No employees found')
            )
          )
        )
      ),
      React.createElement('div', { style: {
        padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: '#888'
      } },
        React.createElement('span', null, 'Page ' + (page + 1) + ' of ' + Math.max(totalPages, 1)),
        React.createElement('div', { style: { display: 'flex', gap: '6px' } },
          React.createElement('button', {
            onClick: function() { setPage(function(p) { return Math.max(p - 1, 0); }); },
            disabled: page === 0,
            style: {
              padding: '6px 14px', borderRadius: '6px', border: 'none',
              background: page === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.1)',
              color: page === 0 ? '#444' : '#ccc', cursor: page === 0 ? 'not-allowed' : 'pointer', fontSize: '12px'
            }
          }, '\u2190 Prev'),
          Array.from({ length: totalPages }, function(_, i) {
            return React.createElement('button', {
              key: i,
              onClick: function() { setPage(i); },
              style: {
                padding: '6px 10px', borderRadius: '6px', border: 'none',
                background: i === page ? '#bd93f9' : 'rgba(255,255,255,0.1)',
                color: i === page ? '#fff' : '#aaa', cursor: 'pointer', fontSize: '12px',
                fontWeight: i === page ? 'bold' : 'normal'
              }
            }, String(i + 1));
          }),
          React.createElement('button', {
            onClick: function() { setPage(function(p) { return Math.min(p + 1, totalPages - 1); }); },
            disabled: page >= totalPages - 1,
            style: {
              padding: '6px 14px', borderRadius: '6px', border: 'none',
              background: page >= totalPages - 1 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.1)',
              color: page >= totalPages - 1 ? '#444' : '#ccc',
              cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', fontSize: '12px'
            }
          }, 'Next \u2192')
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
