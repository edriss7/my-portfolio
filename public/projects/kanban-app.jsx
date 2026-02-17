const { useState, useEffect, useRef } = React;

var initialTasks = [
  { id: 1, title: 'Design homepage mockup', column: 'todo', color: '#e74c3c' },
  { id: 2, title: 'Set up database schema', column: 'todo', color: '#3498db' },
  { id: 3, title: 'Implement user authentication', column: 'inprogress', color: '#e67e22' },
  { id: 4, title: 'Write API endpoints', column: 'inprogress', color: '#9b59b6' },
  { id: 5, title: 'Create project README', column: 'done', color: '#2ecc71' },
  { id: 6, title: 'Set up CI/CD pipeline', column: 'done', color: '#1abc9c' }
];

var columns = [
  { id: 'todo', title: 'To Do', color: '#e74c3c' },
  { id: 'inprogress', title: 'In Progress', color: '#f39c12' },
  { id: 'done', title: 'Done', color: '#2ecc71' }
];

function App() {
  var _useState = useState(initialTasks);
  var tasks = _useState[0];
  var setTasks = _useState[1];
  var _useState2 = useState('');
  var newTaskTitle = _useState2[0];
  var setNewTaskTitle = _useState2[1];
  var _useState3 = useState('todo');
  var newTaskColumn = _useState3[0];
  var setNewTaskColumn = _useState3[1];
  var nextId = useRef(7);

  function addTask() {
    if (!newTaskTitle.trim()) return;
    var colors = ['#e74c3c', '#3498db', '#e67e22', '#9b59b6', '#2ecc71', '#1abc9c', '#f39c12', '#e91e63'];
    var color = colors[Math.floor(Math.random() * colors.length)];
    setTasks(function(prev) {
      return prev.concat([{ id: nextId.current++, title: newTaskTitle.trim(), column: newTaskColumn, color: color }]);
    });
    setNewTaskTitle('');
  }

  function deleteTask(id) {
    setTasks(function(prev) { return prev.filter(function(t) { return t.id !== id; }); });
  }

  function moveTask(id, direction) {
    var colOrder = ['todo', 'inprogress', 'done'];
    setTasks(function(prev) {
      return prev.map(function(t) {
        if (t.id !== id) return t;
        var currentIndex = colOrder.indexOf(t.column);
        var newIndex = currentIndex + direction;
        if (newIndex < 0 || newIndex >= colOrder.length) return t;
        return Object.assign({}, t, { column: colOrder[newIndex] });
      });
    });
  }

  function getColumnTasks(columnId) {
    return tasks.filter(function(t) { return t.column === columnId; });
  }

  var styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
      color: '#e0e0e0',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '0 0 40px'
    },
    backLink: {
      color: '#888',
      textDecoration: 'none',
      padding: '15px 20px',
      display: 'inline-block',
      fontSize: '14px'
    },
    header: {
      textAlign: 'center',
      fontSize: '28px',
      color: '#fff',
      margin: '0 0 25px'
    },
    addForm: {
      display: 'flex',
      gap: '10px',
      maxWidth: '600px',
      margin: '0 auto 30px',
      padding: '0 20px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    input: {
      flex: '1 1 250px',
      padding: '10px 15px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.08)',
      color: '#fff',
      fontSize: '14px',
      outline: 'none'
    },
    select: {
      padding: '10px 15px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.08)',
      color: '#fff',
      fontSize: '14px',
      outline: 'none'
    },
    addBtn: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(135deg, #9b59b6, #3498db)',
      color: '#fff',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    board: {
      display: 'flex',
      gap: '20px',
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '0 20px',
      flexWrap: 'wrap'
    },
    column: {
      flex: '1 1 300px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '15px',
      minHeight: '400px'
    },
    columnHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
      padding: '10px 12px',
      borderRadius: '8px'
    },
    columnTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#fff'
    },
    columnCount: {
      fontSize: '13px',
      background: 'rgba(0,0,0,0.3)',
      padding: '3px 10px',
      borderRadius: '12px',
      color: '#fff'
    },
    card: {
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '10px',
      borderLeft: '4px solid',
      position: 'relative'
    },
    cardTitle: {
      fontSize: '14px',
      color: '#fff',
      marginBottom: '10px',
      paddingRight: '25px'
    },
    cardActions: {
      display: 'flex',
      gap: '6px'
    },
    moveBtn: {
      padding: '4px 10px',
      borderRadius: '5px',
      border: 'none',
      background: 'rgba(255,255,255,0.1)',
      color: '#ccc',
      fontSize: '12px',
      cursor: 'pointer'
    },
    deleteBtn: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      background: 'none',
      border: 'none',
      color: '#e74c3c',
      fontSize: '16px',
      cursor: 'pointer',
      padding: '2px 5px'
    }
  };

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.header }, 'Kanban Board'),
    React.createElement('div', { style: styles.addForm },
      React.createElement('input', {
        style: styles.input,
        placeholder: 'New task title...',
        value: newTaskTitle,
        onChange: function(e) { setNewTaskTitle(e.target.value); },
        onKeyDown: function(e) { if (e.key === 'Enter') addTask(); }
      }),
      React.createElement('select', {
        style: styles.select,
        value: newTaskColumn,
        onChange: function(e) { setNewTaskColumn(e.target.value); }
      },
        columns.map(function(col) {
          return React.createElement('option', { key: col.id, value: col.id }, col.title);
        })
      ),
      React.createElement('button', { style: styles.addBtn, onClick: addTask }, '+ Add Task')
    ),
    React.createElement('div', { style: styles.board },
      columns.map(function(col) {
        var colTasks = getColumnTasks(col.id);
        return React.createElement('div', { key: col.id, style: styles.column },
          React.createElement('div', { style: Object.assign({}, styles.columnHeader, { background: col.color + '33' }) },
            React.createElement('span', { style: Object.assign({}, styles.columnTitle, { color: col.color }) }, col.title),
            React.createElement('span', { style: styles.columnCount }, colTasks.length)
          ),
          colTasks.map(function(task) {
            var colOrder = ['todo', 'inprogress', 'done'];
            var idx = colOrder.indexOf(task.column);
            return React.createElement('div', { key: task.id, style: Object.assign({}, styles.card, { borderLeftColor: task.color }) },
              React.createElement('div', { style: styles.cardTitle }, task.title),
              React.createElement('button', {
                style: styles.deleteBtn,
                onClick: function() { deleteTask(task.id); },
                title: 'Delete'
              }, '\u2715'),
              React.createElement('div', { style: styles.cardActions },
                idx > 0 ? React.createElement('button', {
                  style: styles.moveBtn,
                  onClick: function() { moveTask(task.id, -1); }
                }, '\u2190 ' + colOrder[idx - 1].replace('inprogress', 'In Progress').replace('todo', 'To Do').replace('done', 'Done')) : null,
                idx < colOrder.length - 1 ? React.createElement('button', {
                  style: styles.moveBtn,
                  onClick: function() { moveTask(task.id, 1); }
                }, colOrder[idx + 1].replace('inprogress', 'In Progress').replace('todo', 'To Do').replace('done', 'Done') + ' \u2192') : null
              )
            );
          }),
          colTasks.length === 0 ? React.createElement('div', {
            style: { textAlign: 'center', color: '#666', padding: '30px', fontSize: '14px' }
          }, 'No tasks yet') : null
        );
      })
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
