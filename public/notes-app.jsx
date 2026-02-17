const { useState } = React;

function NotesApp() {
  const [notes, setNotes] = useState([
    { id: 1, text: 'Buy groceries', done: false },
    { id: 2, text: 'Finish React project', done: true },
    { id: 3, text: 'Call the dentist', done: false },
    { id: 4, text: 'Read a book', done: false },
    { id: 5, text: 'Clean the kitchen', done: true },
  ]);
  const [input, setInput] = useState('');

  const addNote = () => {
    const text = input.trim();
    if (!text) return;
    setNotes([...notes, { id: Date.now(), text, done: false }]);
    setInput('');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const toggleDone = (id) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, done: !n.done } : n)));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addNote();
  };

  return (
    <div style={styles.container}>
      <a href="/" style={styles.backLink}>&larr; Back to Home</a>
      <h1 style={styles.title}>Notes</h1>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          type="text"
          placeholder="Add a note..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button style={styles.addBtn} onClick={addNote}>Add</button>
      </div>

      <ul style={styles.list}>
        {notes.map((note) => (
          <li key={note.id} style={styles.item}>
            <button
              style={{
                ...styles.checkBtn,
                color: note.done ? '#4caf50' : '#ccc',
              }}
              onClick={() => toggleDone(note.id)}
              title="Toggle done"
            >
              &#10003;
            </button>
            <span
              style={{
                ...styles.text,
                textDecoration: note.done ? 'line-through' : 'none',
                color: note.done ? 'rgba(255,255,255,0.3)' : '#e0e0e0',
              }}
            >
              {note.text}
            </span>
            <button
              style={styles.deleteBtn}
              onClick={() => deleteNote(note.id)}
              title="Delete"
            >
              &#10005;
            </button>
          </li>
        ))}
      </ul>

      {notes.length === 0 && <p style={styles.empty}>No notes yet.</p>}
    </div>
  );
}

const styles = {
  backLink: {
    display: 'inline-block',
    marginBottom: 12,
    color: '#66bb6a',
    textDecoration: 'none',
    fontSize: 14,
  },
  container: {
    maxWidth: 520,
    margin: '50px auto',
    padding: 24,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(10px)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
    fontSize: 28,
    fontWeight: 700,
  },
  inputRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: '12px 14px',
    fontSize: 15,
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    outline: 'none',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
  },
  addBtn: {
    padding: '12px 22px',
    fontSize: 15,
    background: 'linear-gradient(135deg, #43a047, #66bb6a)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 10px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8,
    transition: 'background 0.2s',
  },
  checkBtn: {
    background: 'none',
    border: 'none',
    fontSize: 20,
    cursor: 'pointer',
  },
  text: {
    flex: 1,
    fontSize: 15,
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    fontSize: 18,
    color: '#ef5350',
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    marginTop: 20,
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<NotesApp />);
