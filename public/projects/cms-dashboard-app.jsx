const { useState, useCallback, useMemo } = React;

const backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
const baseStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' };
const sidebarStyle = { width: '220px', background: 'rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '20px 0', flexShrink: 0 };
const sidebarItemStyle = (active) => ({ padding: '10px 20px', cursor: 'pointer', background: active ? 'rgba(139,233,253,0.15)' : 'transparent', borderLeft: active ? '3px solid #8be9fd' : '3px solid transparent', color: active ? '#8be9fd' : '#ccc', fontSize: '14px', transition: 'all 0.2s' });
const cardStyle = { background: 'rgba(255,255,255,0.07)', borderRadius: '8px', padding: '16px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.08)' };
const btnStyle = (color) => ({ background: color || '#8be9fd', color: '#0a0a1a', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', marginRight: '8px' });
const inputStyle = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '8px 12px', color: '#e0e0e0', fontSize: '14px', width: '100%', boxSizing: 'border-box', marginBottom: '10px' };
const badgeStyle = (color) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: color, color: '#fff' });

var initialPosts = [
  { id: 1, title: 'Welcome to Our Platform', body: 'This is the first post on our new content management system. We are excited to share updates.', category: 'Announcements', status: 'published', date: '2026-02-15' },
  { id: 2, title: 'Getting Started Guide', body: 'Learn how to use the dashboard effectively with this comprehensive guide.', category: 'Tutorials', status: 'published', date: '2026-02-14' },
  { id: 3, title: 'Upcoming Features Roadmap', body: 'A look at what we have planned for Q2 2026 including new integrations.', category: 'Updates', status: 'draft', date: '2026-02-13' },
  { id: 4, title: 'Design System Updates', body: 'We have refreshed our component library with new dark theme variants.', category: 'Design', status: 'draft', date: '2026-02-12' },
  { id: 5, title: 'API Documentation v2', body: 'Complete reference for our REST API endpoints and authentication.', category: 'Tutorials', status: 'published', date: '2026-02-11' }
];

var categories = ['Announcements', 'Tutorials', 'Updates', 'Design', 'General'];

function App() {
  var _useState = useState('posts'), section = _useState[0], setSection = _useState[1];
  var _useState2 = useState(initialPosts), posts = _useState2[0], setPosts = _useState2[1];
  var _useState3 = useState(null), editing = _useState3[0], setEditing = _useState3[1];
  var _useState4 = useState(false), showForm = _useState4[0], setShowForm = _useState4[1];
  var _useState5 = useState({ title: '', body: '', category: 'General' }), form = _useState5[0], setForm = _useState5[1];

  var stats = useMemo(function () {
    return { total: posts.length, published: posts.filter(function (p) { return p.status === 'published'; }).length, drafts: posts.filter(function (p) { return p.status === 'draft'; }).length };
  }, [posts]);

  var handleSave = useCallback(function () {
    if (!form.title.trim()) return;
    if (editing !== null) {
      setPosts(function (prev) { return prev.map(function (p) { return p.id === editing ? Object.assign({}, p, form) : p; }); });
      setEditing(null);
    } else {
      var newPost = Object.assign({}, form, { id: Date.now(), status: 'draft', date: '2026-02-17' });
      setPosts(function (prev) { return [newPost].concat(prev); });
    }
    setForm({ title: '', body: '', category: 'General' });
    setShowForm(false);
  }, [form, editing]);

  var toggleStatus = useCallback(function (id) {
    setPosts(function (prev) { return prev.map(function (p) { return p.id === id ? Object.assign({}, p, { status: p.status === 'published' ? 'draft' : 'published' }) : p; }); });
  }, []);

  var deletePost = useCallback(function (id) {
    setPosts(function (prev) { return prev.filter(function (p) { return p.id !== id; }); });
  }, []);

  var startEdit = useCallback(function (post) {
    setForm({ title: post.title, body: post.body, category: post.category });
    setEditing(post.id);
    setShowForm(true);
  }, []);

  var sections = ['pages', 'posts', 'media'];

  var renderStats = function () {
    return React.createElement('div', { style: { display: 'flex', gap: '16px', marginBottom: '20px' } },
      [{ label: 'Total', val: stats.total, c: '#8be9fd' }, { label: 'Published', val: stats.published, c: '#50fa7b' }, { label: 'Drafts', val: stats.drafts, c: '#ffb86c' }].map(function (s, i) {
        return React.createElement('div', { key: i, style: Object.assign({}, cardStyle, { flex: 1, textAlign: 'center' }) },
          React.createElement('div', { style: { fontSize: '28px', fontWeight: 'bold', color: s.c } }, s.val),
          React.createElement('div', { style: { fontSize: '12px', color: '#999', marginTop: '4px' } }, s.label)
        );
      })
    );
  };

  var renderForm = function () {
    return React.createElement('div', { style: Object.assign({}, cardStyle, { marginBottom: '20px' }) },
      React.createElement('h3', { style: { margin: '0 0 12px', color: '#8be9fd' } }, editing !== null ? 'Edit Post' : 'New Post'),
      React.createElement('input', { style: inputStyle, placeholder: 'Title', value: form.title, onChange: function (e) { setForm(Object.assign({}, form, { title: e.target.value })); } }),
      React.createElement('textarea', { style: Object.assign({}, inputStyle, { minHeight: '80px', resize: 'vertical' }), placeholder: 'Body', value: form.body, onChange: function (e) { setForm(Object.assign({}, form, { body: e.target.value })); } }),
      React.createElement('select', { style: Object.assign({}, inputStyle, { width: 'auto' }), value: form.category, onChange: function (e) { setForm(Object.assign({}, form, { category: e.target.value })); } },
        categories.map(function (c) { return React.createElement('option', { key: c, value: c }, c); })
      ),
      React.createElement('div', { style: { display: 'flex', gap: '8px', marginTop: '8px' } },
        React.createElement('button', { style: btnStyle('#50fa7b'), onClick: handleSave }, 'Save'),
        React.createElement('button', { style: btnStyle('#ff5555'), onClick: function () { setShowForm(false); setEditing(null); setForm({ title: '', body: '', category: 'General' }); } }, 'Cancel')
      )
    );
  };

  var renderPosts = function () {
    return React.createElement('div', null,
      posts.map(function (post) {
        return React.createElement('div', { key: post.id, style: Object.assign({}, cardStyle, { display: 'flex', alignItems: 'center', gap: '16px' }) },
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' } }, post.title),
            React.createElement('div', { style: { fontSize: '12px', color: '#888' } }, post.category + ' \u2022 ' + post.date),
            React.createElement('div', { style: { fontSize: '13px', color: '#aaa', marginTop: '4px' } }, post.body.substring(0, 80) + '...')
          ),
          React.createElement('span', { style: badgeStyle(post.status === 'published' ? '#50fa7b' : '#ffb86c') }, post.status),
          React.createElement('button', { style: Object.assign({}, btnStyle('#bd93f9'), { padding: '6px 12px' }), onClick: function () { toggleStatus(post.id); } }, post.status === 'published' ? 'Unpublish' : 'Publish'),
          React.createElement('button', { style: Object.assign({}, btnStyle('#8be9fd'), { padding: '6px 12px' }), onClick: function () { startEdit(post); } }, 'Edit'),
          React.createElement('button', { style: Object.assign({}, btnStyle('#ff5555'), { padding: '6px 12px' }), onClick: function () { deletePost(post.id); } }, 'Delete')
        );
      })
    );
  };

  return React.createElement('div', { style: baseStyle },
    React.createElement('div', { style: { display: 'flex', flex: 1 } },
      React.createElement('div', { style: sidebarStyle },
        React.createElement('div', { style: { padding: '0 20px 20px', fontWeight: 'bold', fontSize: '18px', color: '#8be9fd' } }, 'CMS Dashboard'),
        React.createElement('a', { href: '/projects', style: Object.assign({}, backLinkStyle, { padding: '0 20px', display: 'block', marginBottom: '20px' }) }, '\u2190 Back to Projects'),
        sections.map(function (s) {
          return React.createElement('div', { key: s, style: sidebarItemStyle(section === s), onClick: function () { setSection(s); } }, s.charAt(0).toUpperCase() + s.slice(1));
        })
      ),
      React.createElement('div', { style: { flex: 1, padding: '24px', overflowY: 'auto' } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } },
          React.createElement('h2', { style: { margin: 0, color: '#fff' } }, section.charAt(0).toUpperCase() + section.slice(1)),
          !showForm && React.createElement('button', { style: btnStyle('#50fa7b'), onClick: function () { setShowForm(true); } }, '+ New Post')
        ),
        renderStats(),
        showForm && renderForm(),
        section === 'posts' && renderPosts(),
        section === 'pages' && React.createElement('div', { style: cardStyle }, React.createElement('p', { style: { color: '#999' } }, 'Pages section - manage your site pages here. Create landing pages, about pages, and more.')),
        section === 'media' && React.createElement('div', { style: cardStyle }, React.createElement('p', { style: { color: '#999' } }, 'Media library - upload and manage images, videos, and documents.'))
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
