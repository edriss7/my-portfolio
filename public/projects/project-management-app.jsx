const { useState, useCallback, useMemo } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '30px' };
var inputStyle = { background: '#1e1e3a', border: '1px solid #3a3a5c', borderRadius: '8px', color: '#e0e0e0', padding: '8px 12px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' };
var btnStyle = { background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', border: 'none', borderRadius: '8px', color: '#fff', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' };
var cardStyle = { background: 'rgba(30,30,58,0.8)', borderRadius: '12px', padding: '16px', border: '1px solid #2a2a4a' };

var priorityColors = { high: '#ff6b6b', medium: '#ffa502', low: '#2ed573' };
var statusColors = { todo: '#888', 'in-progress': '#1e90ff', review: '#ffa502', done: '#2ed573' };

var teamMembers = [
  { id: 1, name: 'Alice Chen', role: 'Lead Dev', avatar: 'AC', color: '#6c5ce7' },
  { id: 2, name: 'Bob Martinez', role: 'Frontend', avatar: 'BM', color: '#00cec9' },
  { id: 3, name: 'Carol White', role: 'Backend', avatar: 'CW', color: '#fd79a8' },
  { id: 4, name: 'Dave Kim', role: 'Designer', avatar: 'DK', color: '#ffa502' },
  { id: 5, name: 'Eve Johnson', role: 'QA', avatar: 'EJ', color: '#2ed573' }
];

var defaultTasks = [
  { id: 1, title: 'Design system setup', priority: 'high', status: 'done', assignee: 4, startDay: 1, duration: 4, dueDate: '2026-02-20' },
  { id: 2, title: 'Auth API endpoints', priority: 'high', status: 'in-progress', assignee: 3, startDay: 3, duration: 5, dueDate: '2026-02-24' },
  { id: 3, title: 'Dashboard UI', priority: 'medium', status: 'in-progress', assignee: 2, startDay: 5, duration: 6, dueDate: '2026-02-26' },
  { id: 4, title: 'User profile page', priority: 'medium', status: 'todo', assignee: 2, startDay: 8, duration: 3, dueDate: '2026-02-28' },
  { id: 5, title: 'Database schema', priority: 'high', status: 'done', assignee: 3, startDay: 1, duration: 2, dueDate: '2026-02-18' },
  { id: 6, title: 'Integration tests', priority: 'medium', status: 'todo', assignee: 5, startDay: 10, duration: 4, dueDate: '2026-03-02' },
  { id: 7, title: 'Settings page', priority: 'low', status: 'todo', assignee: 1, startDay: 11, duration: 3, dueDate: '2026-03-04' },
  { id: 8, title: 'Performance audit', priority: 'low', status: 'review', assignee: 5, startDay: 7, duration: 2, dueDate: '2026-02-25' }
];

function App() {
  var _t = useState(defaultTasks), tasks = _t[0], setTasks = _t[1];
  var _v = useState('list'), view = _v[0], setView = _v[1];
  var _se = useState(false), showEdit = _se[0], setShowEdit = _se[1];
  var _et = useState(null), editTask = _et[0], setEditTask = _et[1];
  var _ft = useState(''), fTitle = _ft[0], setFTitle = _ft[1];
  var _fp = useState('medium'), fPri = _fp[0], setFPri = _fp[1];
  var _fs = useState('todo'), fStat = _fs[0], setFStat = _fs[1];
  var _fa = useState(1), fAssign = _fa[0], setFAssign = _fa[1];
  var _fd = useState('2026-03-01'), fDue = _fd[0], setFDue = _fd[1];
  var _fsd = useState(1), fStart = _fsd[0], setFStart = _fsd[1];
  var _fdu = useState(3), fDur = _fdu[0], setFDur = _fdu[1];

  var doneCount = tasks.filter(function(t) { return t.status === 'done'; }).length;
  var progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;
  var totalDays = 14;

  var openEdit = function(task) {
    if (task) {
      setEditTask(task); setFTitle(task.title); setFPri(task.priority); setFStat(task.status);
      setFAssign(task.assignee); setFDue(task.dueDate); setFStart(task.startDay); setFDur(task.duration);
    } else {
      setEditTask(null); setFTitle(''); setFPri('medium'); setFStat('todo');
      setFAssign(1); setFDue('2026-03-01'); setFStart(1); setFDur(3);
    }
    setShowEdit(true);
  };

  var saveTask = function() {
    if (!fTitle.trim()) return;
    var data = { title: fTitle, priority: fPri, status: fStat, assignee: fAssign, startDay: fStart, duration: fDur, dueDate: fDue };
    if (editTask) {
      setTasks(function(p) { return p.map(function(t) { return t.id === editTask.id ? Object.assign({}, t, data) : t; }); });
    } else {
      setTasks(function(p) { return p.concat([Object.assign({ id: Date.now() }, data)]); });
    }
    setShowEdit(false);
  };

  var deleteTask = function(id) { setTasks(function(p) { return p.filter(function(t) { return t.id !== id; }); }); };
  var getMember = function(id) { return teamMembers.find(function(m) { return m.id === id; }) || teamMembers[0]; };

  var viewBtn = function(v, label) {
    return React.createElement('button', { style: Object.assign({}, btnStyle, { background: view === v ? 'linear-gradient(135deg, #6c5ce7, #a29bfe)' : '#2a2a4a', fontSize: '12px', padding: '6px 14px' }), onClick: function() { setView(v); } }, label);
  };

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '32px', fontWeight: '700', marginBottom: '8px', background: 'linear-gradient(90deg, #2ed573, #1e90ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Project Management'),

    // Progress bar
    React.createElement('div', { style: { display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' } },
      React.createElement('div', { style: { flex: '1', minWidth: '200px' } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
          React.createElement('span', { style: { fontSize: '13px', color: '#888' } }, 'Overall Progress'),
          React.createElement('span', { style: { fontSize: '13px', color: '#2ed573', fontWeight: '600' } }, progress + '%')
        ),
        React.createElement('div', { style: { background: '#1a1a3a', borderRadius: '8px', height: '10px', overflow: 'hidden' } },
          React.createElement('div', { style: { width: progress + '%', height: '100%', background: 'linear-gradient(90deg, #2ed573, #00cec9)', borderRadius: '8px', transition: 'width 0.5s' } })
        )
      ),
      React.createElement('div', { style: { fontSize: '13px', color: '#888' } }, doneCount + '/' + tasks.length + ' tasks done'),
      React.createElement('div', { style: { display: 'flex', gap: '6px' } }, viewBtn('list', 'List'), viewBtn('gantt', 'Timeline'), viewBtn('board', 'Board')),
      React.createElement('button', { style: btnStyle, onClick: function() { openEdit(null); } }, '+ Task')
    ),

    React.createElement('div', { style: { display: 'flex', gap: '20px', flexWrap: 'wrap' } },
      // Main area
      React.createElement('div', { style: { flex: '1', minWidth: '300px' } },

        // Edit modal
        showEdit && React.createElement('div', { style: Object.assign({}, cardStyle, { border: '1px solid #6c5ce7', marginBottom: '16px' }) },
          React.createElement('h3', { style: { margin: '0 0 14px 0', color: '#a29bfe', fontSize: '16px' } }, editTask ? 'Edit Task' : 'New Task'),
          React.createElement('input', { style: Object.assign({}, inputStyle, { width: '100%', marginBottom: '10px' }), placeholder: 'Task title', value: fTitle, onChange: function(e) { setFTitle(e.target.value); } }),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' } },
            React.createElement('select', { style: Object.assign({}, inputStyle, { cursor: 'pointer' }), value: fPri, onChange: function(e) { setFPri(e.target.value); } },
              React.createElement('option', { value: 'high', style: { background: '#1e1e3a' } }, 'High Priority'),
              React.createElement('option', { value: 'medium', style: { background: '#1e1e3a' } }, 'Medium Priority'),
              React.createElement('option', { value: 'low', style: { background: '#1e1e3a' } }, 'Low Priority')
            ),
            React.createElement('select', { style: Object.assign({}, inputStyle, { cursor: 'pointer' }), value: fStat, onChange: function(e) { setFStat(e.target.value); } },
              React.createElement('option', { value: 'todo', style: { background: '#1e1e3a' } }, 'To Do'),
              React.createElement('option', { value: 'in-progress', style: { background: '#1e1e3a' } }, 'In Progress'),
              React.createElement('option', { value: 'review', style: { background: '#1e1e3a' } }, 'Review'),
              React.createElement('option', { value: 'done', style: { background: '#1e1e3a' } }, 'Done')
            ),
            React.createElement('select', { style: Object.assign({}, inputStyle, { cursor: 'pointer' }), value: fAssign, onChange: function(e) { setFAssign(parseInt(e.target.value)); } },
              teamMembers.map(function(m) { return React.createElement('option', { key: m.id, value: m.id, style: { background: '#1e1e3a' } }, m.name); })
            ),
            React.createElement('input', { style: inputStyle, type: 'date', value: fDue, onChange: function(e) { setFDue(e.target.value); } })
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' } },
            React.createElement('div', null,
              React.createElement('label', { style: { fontSize: '11px', color: '#888' } }, 'Start Day (1-14)'),
              React.createElement('input', { style: Object.assign({}, inputStyle, { width: '100%' }), type: 'number', min: 1, max: 14, value: fStart, onChange: function(e) { setFStart(parseInt(e.target.value) || 1); } })
            ),
            React.createElement('div', null,
              React.createElement('label', { style: { fontSize: '11px', color: '#888' } }, 'Duration (days)'),
              React.createElement('input', { style: Object.assign({}, inputStyle, { width: '100%' }), type: 'number', min: 1, max: 14, value: fDur, onChange: function(e) { setFDur(parseInt(e.target.value) || 1); } })
            )
          ),
          React.createElement('div', { style: { display: 'flex', gap: '8px' } },
            React.createElement('button', { style: btnStyle, onClick: saveTask }, 'Save'),
            React.createElement('button', { style: Object.assign({}, btnStyle, { background: '#555' }), onClick: function() { setShowEdit(false); } }, 'Cancel')
          )
        ),

        // LIST VIEW
        view === 'list' && tasks.map(function(task) {
          var member = getMember(task.assignee);
          return React.createElement('div', { key: task.id, style: Object.assign({}, cardStyle, { marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '3px solid ' + priorityColors[task.priority] }) },
            React.createElement('div', { style: { width: '32px', height: '32px', borderRadius: '50%', background: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 } }, member.avatar),
            React.createElement('div', { style: { flex: '1', minWidth: 0 } },
              React.createElement('div', { style: { fontWeight: '600', color: task.status === 'done' ? '#666' : '#fff', textDecoration: task.status === 'done' ? 'line-through' : 'none', fontSize: '14px' } }, task.title),
              React.createElement('div', { style: { fontSize: '12px', color: '#888', marginTop: '2px' } }, member.name + ' \u00b7 Due: ' + task.dueDate)
            ),
            React.createElement('span', { style: { background: statusColors[task.status] + '22', color: statusColors[task.status], padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', whiteSpace: 'nowrap' } }, task.status),
            React.createElement('span', { style: { cursor: 'pointer', color: '#a29bfe', fontSize: '12px' }, onClick: function() { openEdit(task); } }, 'Edit'),
            React.createElement('span', { style: { cursor: 'pointer', color: '#ff6b6b', fontSize: '12px' }, onClick: function() { deleteTask(task.id); } }, '\u00d7')
          );
        }),

        // GANTT VIEW
        view === 'gantt' && React.createElement('div', { style: Object.assign({}, cardStyle, { overflowX: 'auto' }) },
          React.createElement('div', { style: { minWidth: '700px' } },
            // Header days
            React.createElement('div', { style: { display: 'flex', marginBottom: '8px', paddingLeft: '160px' } },
              Array.from({ length: totalDays }, function(_, i) {
                return React.createElement('div', { key: i, style: { flex: '1', textAlign: 'center', fontSize: '11px', color: '#666', minWidth: '36px' } }, 'D' + (i + 1));
              })
            ),
            // Task bars
            tasks.map(function(task) {
              var member = getMember(task.assignee);
              var left = ((task.startDay - 1) / totalDays) * 100;
              var width = (task.duration / totalDays) * 100;
              return React.createElement('div', { key: task.id, style: { display: 'flex', alignItems: 'center', marginBottom: '6px', height: '32px' } },
                React.createElement('div', { style: { width: '160px', flexShrink: 0, fontSize: '12px', color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '10px' } }, task.title),
                React.createElement('div', { style: { flex: '1', position: 'relative', height: '24px', background: '#1a1a3a', borderRadius: '4px' } },
                  React.createElement('div', { style: { position: 'absolute', left: left + '%', width: width + '%', height: '100%', background: 'linear-gradient(90deg, ' + priorityColors[task.priority] + ', ' + priorityColors[task.priority] + '88)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff', fontWeight: '600', transition: 'all 0.3s', opacity: task.status === 'done' ? 0.5 : 1 } }, member.avatar)
                )
              );
            })
          )
        ),

        // BOARD VIEW
        view === 'board' && React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' } },
          ['todo', 'in-progress', 'review', 'done'].map(function(status) {
            var statusTasks = tasks.filter(function(t) { return t.status === status; });
            return React.createElement('div', { key: status, style: { background: 'rgba(20,20,40,0.5)', borderRadius: '10px', padding: '12px', minHeight: '200px' } },
              React.createElement('div', { style: { fontSize: '13px', fontWeight: '700', color: statusColors[status], marginBottom: '12px', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' } },
                React.createElement('span', null, status.replace('-', ' ')),
                React.createElement('span', { style: { background: statusColors[status] + '33', borderRadius: '10px', padding: '0 8px', fontSize: '11px' } }, statusTasks.length)
              ),
              statusTasks.map(function(task) {
                var member = getMember(task.assignee);
                return React.createElement('div', { key: task.id, style: { background: '#1e1e3a', borderRadius: '8px', padding: '10px', marginBottom: '8px', borderLeft: '3px solid ' + priorityColors[task.priority], cursor: 'pointer' }, onClick: function() { openEdit(task); } },
                  React.createElement('div', { style: { fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '6px' } }, task.title),
                  React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                    React.createElement('div', { style: { width: '22px', height: '22px', borderRadius: '50%', background: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '700' } }, member.avatar),
                    React.createElement('span', { style: { fontSize: '11px', color: '#666' } }, task.dueDate.slice(5))
                  )
                );
              })
            );
          })
        )
      ),

      // Team sidebar
      React.createElement('div', { style: { width: '200px', flexShrink: 0 } },
        React.createElement('div', { style: cardStyle },
          React.createElement('h3', { style: { margin: '0 0 14px 0', color: '#a29bfe', fontSize: '15px' } }, 'Team'),
          teamMembers.map(function(m) {
            var memberTasks = tasks.filter(function(t) { return t.assignee === m.id; });
            var memberDone = memberTasks.filter(function(t) { return t.status === 'done'; }).length;
            return React.createElement('div', { key: m.id, style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' } },
              React.createElement('div', { style: { width: '36px', height: '36px', borderRadius: '50%', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 } }, m.avatar),
              React.createElement('div', null,
                React.createElement('div', { style: { fontSize: '13px', fontWeight: '600', color: '#fff' } }, m.name),
                React.createElement('div', { style: { fontSize: '11px', color: '#888' } }, m.role),
                React.createElement('div', { style: { fontSize: '11px', color: '#666' } }, memberDone + '/' + memberTasks.length + ' done')
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
