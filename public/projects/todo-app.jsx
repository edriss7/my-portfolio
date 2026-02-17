const { useState, useEffect, useRef } = React;

const App = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Build a React portfolio website', completed: false },
    { id: 2, text: 'Learn TypeScript fundamentals', completed: true },
    { id: 3, text: 'Deploy app to production', completed: false },
  ]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [animatingId, setAnimatingId] = useState(null);
  const inputRef = useRef(null);
  const nextId = useRef(4);

  const addTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newId = nextId.current++;
    setTasks(prev => [...prev, { id: newId, text: trimmed, completed: false }]);
    setInput('');
    setAnimatingId(newId);
    setTimeout(() => setAnimatingId(null), 400);
    inputRef.current?.focus();
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTask();
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  const styles = {
    wrapper: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      padding: '20px',
      boxSizing: 'border-box',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#8b8bc4',
      textDecoration: 'none',
      fontSize: '14px',
      marginBottom: '30px',
      transition: 'color 0.2s',
      cursor: 'pointer',
    },
    container: {
      maxWidth: '600px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    title: {
      fontSize: '42px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0 0 8px 0',
    },
    subtitle: {
      color: '#6b6b9e',
      fontSize: '16px',
      margin: 0,
    },
    card: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '30px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
    inputRow: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
    },
    input: {
      flex: 1,
      padding: '14px 20px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(255, 255, 255, 0.06)',
      color: '#e0e0ff',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    addButton: {
      padding: '14px 24px',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.15s, box-shadow 0.2s',
      whiteSpace: 'nowrap',
    },
    filterRow: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
    },
    filterButton: (active) => ({
      flex: 1,
      padding: '10px 16px',
      borderRadius: '10px',
      border: active ? '1px solid rgba(102, 126, 234, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
      background: active ? 'rgba(102, 126, 234, 0.15)' : 'rgba(255, 255, 255, 0.03)',
      color: active ? '#667eea' : '#8b8bc4',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    taskList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    taskItem: (completed, isNew) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '16px',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.03)',
      marginBottom: '8px',
      transition: 'all 0.3s ease',
      opacity: completed ? 0.5 : 1,
      animation: isNew ? 'slideIn 0.4s ease' : 'none',
      border: '1px solid rgba(255,255,255,0.04)',
    }),
    checkbox: (completed) => ({
      width: '22px',
      height: '22px',
      borderRadius: '6px',
      border: completed ? 'none' : '2px solid rgba(255, 255, 255, 0.2)',
      background: completed ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: 'all 0.2s',
      fontSize: '12px',
      color: '#fff',
    }),
    taskText: (completed) => ({
      flex: 1,
      color: completed ? '#6b6b9e' : '#e0e0ff',
      fontSize: '15px',
      textDecoration: completed ? 'line-through' : 'none',
      transition: 'all 0.2s',
    }),
    deleteButton: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      border: 'none',
      background: 'rgba(255, 80, 80, 0.1)',
      color: '#ff5050',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      transition: 'all 0.2s',
      flexShrink: 0,
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '20px',
      paddingTop: '16px',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    },
    footerText: {
      color: '#6b6b9e',
      fontSize: '13px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#6b6b9e',
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '12px',
    },
  };

  return React.createElement('div', { style: styles.wrapper },
    React.createElement('style', null, `
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      input::placeholder { color: #5a5a8a; }
      button:hover { filter: brightness(1.1); }
      .delete-btn:hover { background: rgba(255, 80, 80, 0.25) !important; }
      .add-btn:hover { transform: scale(1.03); box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3); }
      .task-item:hover { background: rgba(255, 255, 255, 0.06) !important; }
      .back-link:hover { color: #a5a5e0 !important; }
    `),
    React.createElement('div', { style: styles.container },
      React.createElement('a', {
        href: '/projects',
        style: styles.backLink,
        className: 'back-link',
      }, '\u2190 Back to Projects'),
      React.createElement('div', { style: styles.header },
        React.createElement('h1', { style: styles.title }, 'Todo List'),
        React.createElement('p', { style: styles.subtitle }, 'Stay organized, get things done')
      ),
      React.createElement('div', { style: styles.card },
        React.createElement('div', { style: styles.inputRow },
          React.createElement('input', {
            ref: inputRef,
            style: styles.input,
            value: input,
            onChange: (e) => setInput(e.target.value),
            onKeyDown: handleKeyDown,
            placeholder: 'What needs to be done?',
          }),
          React.createElement('button', {
            style: styles.addButton,
            className: 'add-btn',
            onClick: addTask,
          }, '+ Add')
        ),
        React.createElement('div', { style: styles.filterRow },
          ['all', 'active', 'completed'].map(f =>
            React.createElement('button', {
              key: f,
              style: styles.filterButton(filter === f),
              onClick: () => setFilter(f),
            }, f.charAt(0).toUpperCase() + f.slice(1))
          )
        ),
        filteredTasks.length === 0
          ? React.createElement('div', { style: styles.emptyState },
              React.createElement('div', { style: styles.emptyIcon }, filter === 'completed' ? '\u2705' : '📋'),
              React.createElement('p', null, filter === 'all' ? 'No tasks yet. Add one above!' :
                filter === 'active' ? 'No active tasks. Nice work!' : 'No completed tasks yet.')
            )
          : React.createElement('ul', { style: styles.taskList },
              filteredTasks.map(task =>
                React.createElement('li', {
                  key: task.id,
                  style: styles.taskItem(task.completed, animatingId === task.id),
                  className: 'task-item',
                },
                  React.createElement('div', {
                    style: styles.checkbox(task.completed),
                    onClick: () => toggleTask(task.id),
                  }, task.completed ? '\u2713' : null),
                  React.createElement('span', {
                    style: styles.taskText(task.completed),
                  }, task.text),
                  React.createElement('button', {
                    style: styles.deleteButton,
                    className: 'delete-btn',
                    onClick: () => deleteTask(task.id),
                    title: 'Delete task',
                  }, '🗑')
                )
              )
            ),
        React.createElement('div', { style: styles.footer },
          React.createElement('span', { style: styles.footerText },
            activeCount + ' task' + (activeCount !== 1 ? 's' : '') + ' remaining'
          ),
          completedCount > 0 && React.createElement('button', {
            style: {
              ...styles.filterButton(false),
              flex: 'none',
              fontSize: '12px',
              padding: '8px 14px',
              color: '#ff5050',
              borderColor: 'rgba(255, 80, 80, 0.2)',
            },
            onClick: () => setTasks(prev => prev.filter(t => !t.completed)),
          }, 'Clear completed (' + completedCount + ')')
        )
      )
    )
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
