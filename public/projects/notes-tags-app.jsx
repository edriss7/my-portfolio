const { useState, useCallback, useMemo } = React;

const backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
const containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '30px' };
const inputStyle = { background: '#1e1e3a', border: '1px solid #3a3a5c', borderRadius: '8px', color: '#e0e0e0', padding: '10px 14px', fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none' };
const btnStyle = { background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', border: 'none', borderRadius: '8px', color: '#fff', padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' };
const cardStyle = { background: 'rgba(30,30,58,0.8)', borderRadius: '12px', padding: '18px', marginBottom: '12px', border: '1px solid #2a2a4a', position: 'relative' };

var tagColors = ['#ff6b6b', '#ffa502', '#2ed573', '#1e90ff', '#a29bfe', '#fd79a8', '#00cec9', '#fdcb6e', '#e17055', '#6c5ce7'];
var defaultTags = [
  { id: 1, name: 'Work', color: '#ff6b6b' },
  { id: 2, name: 'Personal', color: '#2ed573' },
  { id: 3, name: 'Ideas', color: '#1e90ff' },
  { id: 4, name: 'Urgent', color: '#ffa502' },
  { id: 5, name: 'Learning', color: '#a29bfe' }
];
var defaultNotes = [
  { id: 1, title: 'Project Planning', content: 'Outline the Q2 roadmap and assign tasks to team members.', tags: [1, 4], created: '2026-02-15' },
  { id: 2, title: 'Grocery List', content: 'Milk, eggs, bread, avocados, coffee beans, pasta.', tags: [2], created: '2026-02-16' },
  { id: 3, title: 'App Idea', content: 'Build a habit tracker with streak counting and motivational quotes.', tags: [3, 5], created: '2026-02-17' }
];

function App() {
  var _s = useState(defaultNotes), notes = _s[0], setNotes = _s[1];
  var _t = useState(defaultTags), tags = _t[0], setTags = _t[1];
  var _f = useState(null), filterTag = _f[0], setFilterTag = _f[1];
  var _q = useState(''), search = _q[0], setSearch = _q[1];
  var _nt = useState(''), newTitle = _nt[0], setNewTitle = _nt[1];
  var _nc = useState(''), newContent = _nc[0], setNewContent = _nc[1];
  var _ns = useState([]), newTags = _ns[0], setNewTags = _ns[1];
  var _e = useState(null), editId = _e[0], setEditId = _e[1];
  var _et = useState(''), editTitle = _et[0], setEditTitle = _et[1];
  var _ec = useState(''), editContent = _ec[0], setEditContent = _ec[1];
  var _sp = useState(false), showTagPanel = _sp[0], setShowTagPanel = _sp[1];
  var _tn = useState(''), tagName = _tn[0], setTagName = _tn[1];
  var nid = useState(4)[0]; var nextId = { current: nid };

  var addNote = useCallback(function() {
    if (!newTitle.trim()) return;
    nextId.current++;
    setNotes(function(p) { return [{ id: Date.now(), title: newTitle, content: newContent, tags: newTags, created: '2026-02-17' }].concat(p); });
    setNewTitle(''); setNewContent(''); setNewTags([]);
  }, [newTitle, newContent, newTags]);

  var deleteNote = useCallback(function(id) { setNotes(function(p) { return p.filter(function(n) { return n.id !== id; }); }); }, []);
  var startEdit = useCallback(function(n) { setEditId(n.id); setEditTitle(n.title); setEditContent(n.content); }, []);
  var saveEdit = useCallback(function(id) {
    setNotes(function(p) { return p.map(function(n) { return n.id === id ? Object.assign({}, n, { title: editTitle, content: editContent }) : n; }); });
    setEditId(null);
  }, [editTitle, editContent]);

  var addTag = useCallback(function() {
    if (!tagName.trim()) return;
    var t = { id: Date.now(), name: tagName, color: tagColors[tags.length % tagColors.length] };
    setTags(function(p) { return p.concat([t]); });
    setTagName('');
  }, [tagName, tags.length]);

  var deleteTag = useCallback(function(id) {
    setTags(function(p) { return p.filter(function(t) { return t.id !== id; }); });
    setNotes(function(p) { return p.map(function(n) { return Object.assign({}, n, { tags: n.tags.filter(function(tid) { return tid !== id; }) }); }); });
    if (filterTag === id) setFilterTag(null);
  }, [filterTag]);

  var toggleNewTag = useCallback(function(tid) {
    setNewTags(function(p) { return p.indexOf(tid) > -1 ? p.filter(function(x) { return x !== tid; }) : p.concat([tid]); });
  }, []);

  var filtered = useMemo(function() {
    return notes.filter(function(n) {
      var matchTag = !filterTag || n.tags.indexOf(filterTag) > -1;
      var matchSearch = !search || n.title.toLowerCase().indexOf(search.toLowerCase()) > -1 || n.content.toLowerCase().indexOf(search.toLowerCase()) > -1;
      return matchTag && matchSearch;
    });
  }, [notes, filterTag, search]);

  var getTag = function(id) { return tags.find(function(t) { return t.id === id; }); };

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '32px', fontWeight: '700', marginBottom: '8px', background: 'linear-gradient(90deg, #a29bfe, #fd79a8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Notes & Tags'),
    React.createElement('p', { style: { color: '#888', marginBottom: '24px' } }, 'Organize your thoughts with colorful tags'),

    // Search and filter bar
    React.createElement('div', { style: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' } },
      React.createElement('input', { style: Object.assign({}, inputStyle, { flex: '1', minWidth: '200px' }), placeholder: 'Search notes...', value: search, onChange: function(e) { setSearch(e.target.value); } }),
      React.createElement('button', { style: Object.assign({}, btnStyle, { background: showTagPanel ? '#e17055' : btnStyle.background }), onClick: function() { setShowTagPanel(!showTagPanel); } }, showTagPanel ? 'Close Tags' : 'Manage Tags'),
      filterTag && React.createElement('button', { style: Object.assign({}, btnStyle, { background: '#555', fontSize: '12px' }), onClick: function() { setFilterTag(null); } }, 'Clear Filter')
    ),

    // Tag filter bar
    React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' } },
      tags.map(function(t) {
        return React.createElement('span', { key: t.id, onClick: function() { setFilterTag(filterTag === t.id ? null : t.id); }, style: { background: filterTag === t.id ? t.color : 'transparent', border: '2px solid ' + t.color, color: filterTag === t.id ? '#fff' : t.color, borderRadius: '20px', padding: '4px 14px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '600' } }, t.name);
      })
    ),

    // Tag management panel
    showTagPanel && React.createElement('div', { style: Object.assign({}, cardStyle, { marginBottom: '20px' }) },
      React.createElement('h3', { style: { marginTop: 0, marginBottom: '12px', color: '#a29bfe' } }, 'Tag Management'),
      React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '12px' } },
        React.createElement('input', { style: Object.assign({}, inputStyle, { flex: '1' }), placeholder: 'New tag name...', value: tagName, onChange: function(e) { setTagName(e.target.value); }, onKeyDown: function(e) { if (e.key === 'Enter') addTag(); } }),
        React.createElement('button', { style: btnStyle, onClick: addTag }, 'Add')
      ),
      React.createElement('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
        tags.map(function(t) {
          return React.createElement('span', { key: t.id, style: { background: t.color + '33', border: '1px solid ' + t.color, borderRadius: '16px', padding: '4px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' } },
            React.createElement('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: t.color, display: 'inline-block' } }),
            t.name,
            React.createElement('span', { onClick: function() { deleteTag(t.id); }, style: { cursor: 'pointer', color: '#ff6b6b', fontWeight: 'bold', marginLeft: '4px' } }, '\u00d7')
          );
        })
      )
    ),

    // Add note form
    React.createElement('div', { style: Object.assign({}, cardStyle, { marginBottom: '24px', border: '1px solid #6c5ce7' }) },
      React.createElement('h3', { style: { marginTop: 0, marginBottom: '12px', color: '#a29bfe' } }, 'New Note'),
      React.createElement('input', { style: Object.assign({}, inputStyle, { marginBottom: '10px' }), placeholder: 'Note title...', value: newTitle, onChange: function(e) { setNewTitle(e.target.value); } }),
      React.createElement('textarea', { style: Object.assign({}, inputStyle, { height: '80px', resize: 'vertical', marginBottom: '10px' }), placeholder: 'Note content...', value: newContent, onChange: function(e) { setNewContent(e.target.value); } }),
      React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' } },
        React.createElement('span', { style: { fontSize: '13px', color: '#888' } }, 'Tags:'),
        tags.map(function(t) {
          var sel = newTags.indexOf(t.id) > -1;
          return React.createElement('span', { key: t.id, onClick: function() { toggleNewTag(t.id); }, style: { background: sel ? t.color : 'transparent', border: '1px solid ' + t.color, color: sel ? '#fff' : t.color, borderRadius: '14px', padding: '2px 10px', fontSize: '12px', cursor: 'pointer' } }, t.name);
        })
      ),
      React.createElement('button', { style: btnStyle, onClick: addNote }, 'Add Note')
    ),

    React.createElement('div', { style: { color: '#888', fontSize: '13px', marginBottom: '12px' } }, 'Showing ' + filtered.length + ' of ' + notes.length + ' notes'),

    // Notes list
    filtered.map(function(n) {
      var isEditing = editId === n.id;
      return React.createElement('div', { key: n.id, style: Object.assign({}, cardStyle, { transition: 'transform 0.2s', borderLeft: '3px solid ' + (n.tags.length > 0 && getTag(n.tags[0]) ? getTag(n.tags[0]).color : '#6c5ce7') }) },
        isEditing
          ? React.createElement('div', null,
              React.createElement('input', { style: Object.assign({}, inputStyle, { marginBottom: '8px', fontWeight: '600', fontSize: '16px' }), value: editTitle, onChange: function(e) { setEditTitle(e.target.value); } }),
              React.createElement('textarea', { style: Object.assign({}, inputStyle, { height: '60px', resize: 'vertical', marginBottom: '8px' }), value: editContent, onChange: function(e) { setEditContent(e.target.value); } }),
              React.createElement('div', { style: { display: 'flex', gap: '8px' } },
                React.createElement('button', { style: Object.assign({}, btnStyle, { fontSize: '12px', padding: '6px 14px' }), onClick: function() { saveEdit(n.id); } }, 'Save'),
                React.createElement('button', { style: Object.assign({}, btnStyle, { background: '#555', fontSize: '12px', padding: '6px 14px' }), onClick: function() { setEditId(null); } }, 'Cancel')
              )
            )
          : React.createElement('div', null,
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } },
                React.createElement('h3', { style: { margin: '0 0 8px 0', fontSize: '18px', color: '#fff' } }, n.title),
                React.createElement('div', { style: { display: 'flex', gap: '8px' } },
                  React.createElement('span', { onClick: function() { startEdit(n); }, style: { cursor: 'pointer', color: '#a29bfe', fontSize: '13px' } }, 'Edit'),
                  React.createElement('span', { onClick: function() { deleteNote(n.id); }, style: { cursor: 'pointer', color: '#ff6b6b', fontSize: '13px' } }, 'Delete')
                )
              ),
              React.createElement('p', { style: { margin: '0 0 10px 0', color: '#bbb', lineHeight: '1.5' } }, n.content),
              React.createElement('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' } },
                n.tags.map(function(tid) {
                  var tag = getTag(tid);
                  if (!tag) return null;
                  return React.createElement('span', { key: tid, style: { background: tag.color + '33', color: tag.color, borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '600' } }, tag.name);
                }),
                React.createElement('span', { style: { marginLeft: 'auto', fontSize: '11px', color: '#666' } }, n.created)
              )
            )
      );
    })
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
